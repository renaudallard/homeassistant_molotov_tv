# BSD 2-Clause License
#
# Copyright (c) 2026, Renaud Allard <renaud@allard.it>
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice, this
#    list of conditions and the following disclaimer.
#
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

"""Fubo backend API client for the Molotov TV integration.

Molotov 5.51 runs on the Fubo backend; this client speaks that REST API
(``api-eu.fubo.tv``) while keeping the public method names the rest of the
integration depends on. The transport engine (url resolution, single 401
refresh-and-retry, 5xx/429 backoff, auth locking) is provider-agnostic.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import datetime, timedelta
import json
import logging
import random
from typing import Any
import uuid
from urllib.parse import urljoin

from aiohttp import ClientResponseError, ClientSession, ClientTimeout
from homeassistant.util import dt as dt_util

from .const import (
    CONTENT_TYPE_DASH,
    DEFAULT_ENVIRONMENT,
    ENVIRONMENTS,
    FUBO_APPLICATION_ID,
    FUBO_CLIENT_VERSION,
    FUBO_SUPPORTED_FEATURES,
    FUBO_USER_AGENT,
)

_LOGGER = logging.getLogger(__name__)


def _truncate_text(value: str, limit: int = 500) -> str:
    if len(value) <= limit:
        return value
    return value[:limit] + "..."


async def _read_error_body(resp) -> str | None:
    try:
        body = await resp.text()
    except Exception:  # pragma: no cover - best effort logging
        return None
    body = body.strip()
    if not body:
        return None
    return _truncate_text(body)


def _extract_user_message(error_body: str | None) -> str | None:
    """Extract a human-readable message from a JSON error body if present."""
    if not error_body:
        return None
    try:
        data = json.loads(error_body)
        if isinstance(data, dict):
            error = data.get("error", data)
            if isinstance(error, dict):
                return error.get("user_message") or error.get("message")
    except (json.JSONDecodeError, TypeError) as err:
        _LOGGER.debug("Failed to extract user message from error body: %s", err)
    return None


def _rfc3339(value: datetime) -> str:
    """Format a datetime as the RFC3339 UTC string /epg requires."""
    return value.astimezone(dt_util.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


# HTTP request timeouts (seconds)
DEFAULT_TIMEOUT = ClientTimeout(total=20, connect=10)
LARGE_RESPONSE_TIMEOUT = ClientTimeout(total=45, connect=10)

# Retry configuration
MAX_RETRIES = 3
RETRY_STATUS_CODES = {502, 503, 504, 429}  # Gateway errors and rate limiting
RETRY_DELAY_SECONDS = 1.0

# Live guide window: how far ahead to fetch, and how many channels per page.
EPG_WINDOW = timedelta(hours=6)
EPG_CHANNEL_LIMIT = 100

# Playback reference scheme used by build_asset_url/async_get_asset_stream. The
# value is opaque to callers and resolved to a fresh manifest at play time.
_REF_PREFIX = "fubo:"
_VIDEO_TYPE_TO_KIND = {
    "channel": "live",
    "live": "live",
    "replay": "vod",
    "vod": "vod",
    "program": "vod",
    "episode": "vod",
    "recording": "dvr",
    "record": "dvr",
    "dvr": "dvr",
}


class MolotovApiError(Exception):
    """Generic backend API error."""

    def __init__(self, message: str, user_message: str | None = None) -> None:
        super().__init__(message)
        self.user_message = user_message


class MolotovAuthError(MolotovApiError):
    """Authentication failed."""


@dataclass
class MolotovSession:
    """Holds session-level data for the Fubo backend."""

    access_token: str | None = None
    refresh_token: str | None = None
    user_id: str | None = None
    profile_id: str | None = None
    # None for Fubo (no official receiver app id); the media player then falls
    # back to the custom receiver, which is what handles Fubo's Widevine DRM.
    cast_app_id: str | None = None
    device_id: str | None = None


class MolotovApi:
    """Fubo backend API client for Home Assistant."""

    def __init__(
        self,
        session: ClientSession,
        email: str,
        password: str,
        environment: str,
        language: str,
        device_id: str | None = None,
    ) -> None:
        self._session = session
        self._email = email
        self._password = password
        if environment not in ENVIRONMENTS:
            environment = DEFAULT_ENVIRONMENT
        self._environment = environment
        env = ENVIRONMENTS[environment]
        self._base_api_url = env["base_api_url"]
        self._language = language
        # Fubo expects a BCP-47 tag; the integration stores a short code.
        self._preferred_language = "fr-FR" if language.startswith("fr") else language
        self._device_id = device_id or f"etincelle-{uuid.uuid4()}"
        self._session_state = MolotovSession(device_id=self._device_id)
        self._lock = asyncio.Lock()

    @property
    def session_state(self) -> MolotovSession:
        """Return the current session state."""

        return self._session_state

    @property
    def base_api_url(self) -> str:
        """Return the base API URL for the selected environment."""

        return self._base_api_url

    @property
    def device_id(self) -> str:
        """Return the stable device id sent to the backend."""

        return self._device_id

    def build_asset_url(
        self, video_type: str, video_id: str, start_over: bool = False
    ) -> str:
        """Build an opaque playback reference for the given video.

        The reference is resolved to a fresh tokenized manifest by
        async_get_asset_stream at play time (tokens are short-lived).
        """

        kind = _VIDEO_TYPE_TO_KIND.get(video_type, "vod")
        ref = f"{_REF_PREFIX}{kind}:{video_id}"
        if start_over:
            ref = f"{ref}:startover"
        return ref

    @staticmethod
    def _parse_asset_ref(ref: str) -> tuple[str, str, bool]:
        """Parse a build_asset_url reference into (kind, id, start_over)."""

        if not ref.startswith(_REF_PREFIX):
            # Fall back to treating an unknown reference as a VOD id.
            return "vod", ref, False
        parts = ref.split(":")
        kind = parts[1] if len(parts) > 1 else "vod"
        start_over = parts[-1] == "startover"
        id_parts = parts[2:-1] if start_over else parts[2:]
        return kind, ":".join(id_parts), start_over

    def stream_content_type(self) -> str:
        """Return the default content type for cast playback."""

        return CONTENT_TYPE_DASH

    # --- Authentication -------------------------------------------------

    async def async_login(self) -> None:
        """Sign in and load the user/profile ids."""

        async with self._lock:
            data = await self._request(
                "PUT",
                "signin",
                auth=False,
                json={"email": self._email, "password": self._password},
            )
            tokens = data.get("payload", data)
            access_token = tokens.get("access_token")
            if not access_token:
                raise MolotovAuthError("Login response did not include access token")
            self._session_state.access_token = access_token
            self._session_state.refresh_token = tokens.get("refresh_token")

            # The fresh token cannot 401, so disable the refresh-and-retry path
            # here to avoid re-entering the auth lock we already hold.
            user = await self._request("GET", "user", auth=True, _retry=False)
            account = user.get("data") or {}
            user_id = account.get("id")
            if not user_id:
                raise MolotovAuthError("Login response did not include user id")
            profiles = account.get("profiles") or []
            profile_id = profiles[0].get("id") if profiles else None
            if not profile_id:
                raise MolotovAuthError("Account has no usable profile")
            self._session_state.user_id = str(user_id)
            self._session_state.profile_id = str(profile_id)

    async def async_refresh_token(self, force: bool = False) -> None:
        """Exchange the refresh token for a fresh access token."""

        token_before = self._session_state.access_token
        async with self._lock:
            # Another caller may have refreshed while we waited for the lock.
            if force and self._session_state.access_token != token_before:
                return

            refresh_token = self._session_state.refresh_token
            if not refresh_token:
                raise MolotovAuthError("Missing refresh token")

            data = await self._request(
                "POST",
                "refresh",
                auth=False,
                headers={"authorization": f"Bearer {refresh_token}"},
                _retry=False,
            )
            tokens = data.get("payload", data)
            access_token = tokens.get("access_token")
            if not access_token:
                raise MolotovAuthError("Refresh did not return an access token")
            self._session_state.access_token = access_token
            new_refresh = tokens.get("refresh_token")
            if new_refresh:
                self._session_state.refresh_token = new_refresh

    async def async_ensure_logged_in(self) -> None:
        """Ensure an access token is present; a stale one is refreshed on 401."""

        if not self._session_state.access_token:
            await self.async_login()

    # --- Content (server-driven page API) -------------------------------

    async def async_get_page(self, slug_or_url: str) -> dict[str, Any]:
        """Fetch a papi page by slug ('home') or absolute action URL."""

        await self.async_ensure_logged_in()
        path = slug_or_url
        if not path.startswith("http") and not path.startswith("papi/"):
            path = f"papi/v1/page/{path}"
        return await self._request("GET", path, auth=True)

    async def async_get_home(self) -> dict[str, Any]:
        """Fetch the home page (carousels of cards)."""

        return await self.async_get_page("home")

    async def async_get_channels(self) -> dict[str, Any]:
        """Fetch the channel directory page (also carries the Apps section)."""

        return await self.async_get_page("channels")

    async def async_get_all_channels(self) -> dict[str, Any]:
        """Fetch the channel directory page."""

        return await self.async_get_channels()

    async def async_get_live_home_channels(self) -> dict[str, Any]:
        """Fetch the live-tv page (every channel's current programme)."""

        return await self.async_get_page("live-tv")

    async def async_search(self, query: str) -> dict[str, Any]:
        """Search content; results come back as a page of card sections."""

        await self.async_ensure_logged_in()
        return await self._request(
            "GET",
            "papi/v1/search/content",
            auth=True,
            params={"category": "top_results", "fuzzy": "true", "query": query},
        )

    async def async_get_program_details(
        self,
        content_id: str,
        kind: str = "program",
        tab: str | None = "id-tab-about",
    ) -> dict[str, Any]:
        """Fetch a program/series/channel detail page (metadata + about tab)."""

        await self.async_ensure_logged_in()
        if kind not in ("program", "series", "channel"):
            kind = "program"
        params = {"tabID": tab} if tab else None
        return await self._request(
            "GET",
            f"papi/v1/program-details/{kind}/{content_id}",
            auth=True,
            params=params,
        )

    # --- Live guide -----------------------------------------------------

    async def async_get_epg(
        self,
        start: datetime | None = None,
        end: datetime | None = None,
        limit: int | None = None,
    ) -> dict[str, Any]:
        """Fetch the live guide: channels with programmes over a time window."""

        await self.async_ensure_logged_in()
        now = dt_util.utcnow()
        params = {
            "startTime": _rfc3339(start or now),
            "endTime": _rfc3339(end or now + EPG_WINDOW),
            "limit": str(limit or EPG_CHANNEL_LIMIT),
            "ignoreEmpty": "true",
        }
        return await self._request(
            "GET", "epg", auth=True, params=params, timeout=LARGE_RESPONSE_TIMEOUT
        )

    # --- Recordings (DVR) -----------------------------------------------

    async def async_get_all_recordings(self) -> list[dict[str, Any]]:
        """Fetch DVR recordings, merging the recorded and scheduled statuses.

        status=all returns an empty body, so each status is fetched separately
        and merged, deduped by asset id. An account without a DVR quota returns
        400, which surfaces here as an empty list.
        """

        await self.async_ensure_logged_in()
        merged: list[dict[str, Any]] = []
        seen: set[str] = set()
        for status in ("recorded", "scheduled"):
            try:
                data = await self._request(
                    "GET",
                    "dvr/v2/list",
                    auth=True,
                    params={"sort": "date", "status": status},
                )
            except MolotovApiError as err:
                _LOGGER.debug("DVR list (%s) failed: %s", status, err)
                continue
            for entry in data.get("response") or []:
                asset_id = _dvr_entry_asset_id(entry)
                if asset_id is not None:
                    if asset_id in seen:
                        continue
                    seen.add(asset_id)
                merged.append(entry)
        return merged

    async def async_add_recording(
        self, asset_id: str, is_upcoming: bool = False
    ) -> None:
        """Schedule a recording for a live airing (LIVE_xxxxx asset)."""

        await self.async_ensure_logged_in()
        body = {
            "action_name": "add-recording",
            "params": {
                "asset_id": asset_id,
                "is_upcoming": "true" if is_upcoming else "false",
            },
            "metadatas": {"asset.asset_id": asset_id},
        }
        # The response body is unused; do not require a JSON content type.
        await self._do_request(
            "POST",
            "action/v1/add-recording",
            auth=True,
            json=body,
            reader=self._read_discard,
        )

    # --- Playback -------------------------------------------------------

    async def async_get_asset_stream(self, asset_url: str) -> dict[str, Any]:
        """Resolve a playback reference to a tokenized manifest + DRM info."""

        await self.async_ensure_logged_in()
        kind, video_id, _start_over = self._parse_asset_ref(asset_url)
        if not video_id:
            raise MolotovApiError(f"Invalid playback reference: {asset_url}")
        params: dict[str, Any] = {"wants_trackers": "true"}
        if kind == "live":
            params["channelId"] = video_id
            params["type"] = "live"
        elif kind == "dvr":
            params["id"] = video_id
            params["type"] = "dvr"
        else:
            params["id"] = video_id
            params["type"] = "vod"
        # x-user-id is only sent on playback calls, never on page calls.
        headers = {"x-drm-scheme": "widevine"}
        if self._session_state.user_id:
            headers["x-user-id"] = self._session_state.user_id
        return await self._request(
            "GET", "vapi/asset/v1", auth=True, params=params, headers=headers
        )

    # --- Transport ------------------------------------------------------

    def build_headers(self, auth: bool) -> dict[str, str]:
        """Build the Fubo client/device headers for a request."""

        headers = {
            "user-agent": FUBO_USER_AGENT,
            "x-application-id": FUBO_APPLICATION_ID,
            "x-client-version": FUBO_CLIENT_VERSION,
            "x-os": "android",
            "x-os-version": "16",
            "x-device-app": "android",
            "x-device-platform": "android_phone",
            "x-device-type": "phone",
            "x-device-group": "mobile",
            "x-device-brand": "Etincelle",
            "x-device-model": "HA",
            "x-device-id": self._device_id,
            "x-preferred-language": self._preferred_language,
            "x-supported-streaming-protocols": "hls,dash",
            "x-drm-scheme": "widevine",
            "x-supported-features": FUBO_SUPPORTED_FEATURES,
            "accept": "application/json",
        }
        if auth and self._session_state.access_token:
            headers["authorization"] = f"Bearer {self._session_state.access_token}"
            if self._session_state.profile_id:
                headers["x-profile-id"] = self._session_state.profile_id
        return headers

    async def _request(
        self,
        method: str,
        url_or_path: str,
        *,
        auth: bool,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
        timeout: ClientTimeout | None = None,
        _retry: bool = True,
        _retries: int = 0,
    ) -> dict[str, Any]:
        return await self._do_request(
            method,
            url_or_path,
            auth=auth,
            json=json,
            params=params,
            headers=headers,
            timeout=timeout,
            reader=self._read_json,
            _retry=_retry,
            _retries=_retries,
        )

    @staticmethod
    async def _read_json(resp) -> dict[str, Any]:
        content_type = resp.headers.get("content-type", "")
        if "json" not in content_type:
            raise MolotovApiError(
                f"Unexpected response type from backend: {content_type or 'unknown'}"
            )
        data = await resp.json()
        if not isinstance(data, dict):
            raise MolotovApiError(
                f"Unexpected JSON shape from backend: expected object, "
                f"got {type(data).__name__}"
            )
        return data

    @staticmethod
    async def _read_discard(resp) -> None:
        await resp.read()
        return None

    async def _do_request(
        self,
        method: str,
        url_or_path: str,
        *,
        auth: bool,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
        timeout: ClientTimeout | None = None,
        reader,
        _retry: bool = True,
        _retries: int = 0,
    ):
        url = (
            url_or_path
            if url_or_path.startswith("http")
            else urljoin(self._base_api_url, url_or_path)
        )
        req_headers = self.build_headers(auth=auth)
        if headers:
            req_headers.update(headers)

        try:
            async with self._session.request(
                method,
                url,
                headers=req_headers,
                params=params,
                json=json,
                timeout=timeout or DEFAULT_TIMEOUT,
            ) as resp:
                if resp.status == 401 and auth and _retry:
                    await self.async_refresh_token(force=True)
                    return await self._do_request(
                        method,
                        url_or_path,
                        auth=auth,
                        json=json,
                        params=params,
                        headers=headers,
                        timeout=timeout,
                        reader=reader,
                        _retry=False,
                        _retries=_retries,
                    )
                if resp.status == 401:
                    raise MolotovAuthError("Invalid credentials")
                # Decide whether to retry, but back off only after the response
                # is released (below) so a pooled connection is not pinned.
                if resp.status in RETRY_STATUS_CODES and _retries < MAX_RETRIES:
                    _LOGGER.warning(
                        "Retryable error %s for %s %s, attempt %d/%d",
                        resp.status,
                        method,
                        url,
                        _retries + 1,
                        MAX_RETRIES,
                    )
                    retry_after = (
                        RETRY_DELAY_SECONDS * (2**_retries) * (0.5 + random.random())
                    )
                elif resp.status >= 400:
                    reason = resp.reason or "unknown"
                    error_body = await _read_error_body(resp)
                    user_message = _extract_user_message(error_body)
                    _LOGGER.debug(
                        "Backend API error: %s %s (%s %s)%s",
                        method,
                        url,
                        resp.status,
                        reason,
                        f": {error_body}" if error_body else "",
                    )
                    raise MolotovApiError(
                        f"Backend API request failed: {method} {url} "
                        f"({resp.status} {reason})"
                        + (f": {error_body}" if error_body else ""),
                        user_message=user_message,
                    )
                else:
                    return await reader(resp)

            # Transient failure: the response is released here, so the backoff
            # does not pin a connection. Sleep and retry.
            await asyncio.sleep(retry_after)
            return await self._do_request(
                method,
                url_or_path,
                auth=auth,
                json=json,
                params=params,
                headers=headers,
                timeout=timeout,
                reader=reader,
                _retry=_retry,
                _retries=_retries + 1,
            )
        except MolotovApiError:
            raise
        except ClientResponseError as err:
            if err.status == 401:
                raise MolotovAuthError("Invalid credentials") from err
            raise MolotovApiError(
                f"Backend API request failed: {method} {url} ({err.status})"
            ) from err
        except Exception as err:
            _LOGGER.exception("Backend API request crashed: %s %s", method, url)
            raise MolotovApiError(
                f"Backend API request failed: {method} {url}"
            ) from err


def _dvr_entry_asset_id(entry: dict[str, Any]) -> str | None:
    """Return the dvr asset id of a /dvr/v2/list entry, for deduping."""

    data = entry.get("data") if isinstance(entry, dict) else None
    if not isinstance(data, dict):
        return None
    for asset in data.get("assets") or []:
        if isinstance(asset, dict) and asset.get("type") == "dvr":
            asset_id = asset.get("assetId")
            if asset_id:
                return str(asset_id)
    return None
