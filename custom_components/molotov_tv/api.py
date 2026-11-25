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
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import json
import logging
import random
from typing import Any
import uuid
from urllib.parse import quote, urljoin

from aiohttp import ClientResponseError, ClientSession, ClientTimeout
from homeassistant.util import dt as dt_util

from .const import (
    CONTENT_TYPE_DASH,
    DEFAULT_ENVIRONMENT,
    ENVIRONMENTS,
    FUBO_APPLICATION_ID,
    FUBO_CLIENT_VERSION,
    FUBO_DEVICE_NAME,
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


def _parse_error(error_body: str | None) -> tuple[str | None, str | None]:
    """Return the (code, human-readable message) of a JSON error body.

    The backend answers `{"error": {"code", "message", "lc_message"}}`;
    lc_message is the message localised to x-preferred-language.
    """
    if not error_body:
        return None, None
    try:
        data = json.loads(error_body)
    except (json.JSONDecodeError, TypeError) as err:
        _LOGGER.debug("Failed to parse error body: %s", err)
        return None, None
    if not isinstance(data, dict):
        return None, None
    error = data.get("error", data)
    if not isinstance(error, dict):
        return None, None
    code = error.get("code")
    message = (
        error.get("user_message") or error.get("lc_message") or error.get("message")
    )
    return (str(code) if code else None), (str(message) if message else None)


def _epg_next_offset(page: dict[str, Any]) -> int | None:
    """Return where the next page of the guide starts, or None on the last one."""

    for meta in page.get("metadata") or []:
        if not isinstance(meta, dict) or meta.get("type") != "paginationState":
            continue
        data = meta.get("data")
        value = data.get("nextOffset") if isinstance(data, dict) else None
        if isinstance(value, int) and not isinstance(value, bool):
            return value
    return None


def _rfc3339(value: datetime) -> str:
    """Format a datetime as the RFC3339 UTC string /epg requires."""
    return value.astimezone(dt_util.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


# HTTP request timeouts (seconds)
DEFAULT_TIMEOUT = ClientTimeout(total=20, connect=10)
LARGE_RESPONSE_TIMEOUT = ClientTimeout(total=45, connect=10)

# Retry configuration
MAX_RETRIES = 3
RETRY_STATUS_CODES = {502, 503, 504, 429}  # Gateway errors and rate limiting, GET only
RETRY_DELAY_SECONDS = 1.0

# Live guide window: how far ahead to fetch, and how many channels per page.
EPG_WINDOW = timedelta(hours=6)
EPG_CHANNEL_LIMIT = 100
# The guide pages its channels (about 180 in November 2026). Bounds the paging
# should the backend ever hand back an offset that does not move on.
EPG_MAX_PAGES = 10

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

    def __init__(
        self,
        message: str,
        user_message: str | None = None,
        code: str | None = None,
        status: int | None = None,
    ) -> None:
        super().__init__(message)
        self.user_message = user_message
        # The HTTP status, which tells a region block (451) or a blocked
        # account (403) from a failure to reach the backend.
        self.status = status
        # The backend error code, e.g. INVALID_USERNAME_PASSWORD. Only one of
        # the codes the backend answers 401 with actually means a wrong
        # password, so keep it for callers and for the logs.
        self.code = code


class MolotovAuthError(MolotovApiError):
    """Authentication failed."""


# Why a session could not be opened without the user: the backend asks for a
# code it sent by email, or there is no password to sign in with (an entry
# linked by code). Either way the account has to be linked again.
MFA_REQUIRED = "MFA_REQUIRED"
LINK_REQUIRED = "LINK_REQUIRED"


@dataclass
class MolotovSession:
    """Holds session-level data for the Fubo backend."""

    access_token: str | None = None
    refresh_token: str | None = None
    user_id: str | None = None
    # The account's email, when the backend gives it with the user.
    email: str | None = None
    # The account's profiles, as (id, name), the one in use among them.
    profiles: list[tuple[str, str]] = field(default_factory=list)
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
        email: str | None,
        password: str | None,
        environment: str,
        language: str,
        device_id: str,
        refresh_token: str | None = None,
        on_refresh_token: Callable[[str], None] | None = None,
        profile_id: str | None = None,
    ) -> None:
        self._session = session
        self._email = email
        # None for an account linked by code, which signs in only with its
        # refresh token.
        self._password = password
        # Told each new refresh token, for the caller to keep: the next start
        # opens its session with it rather than by signing in.
        self._on_refresh_token = on_refresh_token
        # The profile chosen in the options, used while the account has it; the
        # backend answers continue watching and the home pages for it.
        self._chosen_profile = profile_id
        if environment not in ENVIRONMENTS:
            environment = DEFAULT_ENVIRONMENT
        self._environment = environment
        env = ENVIRONMENTS[environment]
        self._base_api_url = env["base_api_url"]
        self._language = language
        # Fubo expects a BCP-47 tag; the integration stores a short code.
        self._preferred_language = "fr-FR" if language.startswith("fr") else language
        # The backend registers a device per x-device-id and warns the account
        # owner by mail when an unknown one signs in, so the caller has to hand
        # over an id that survives restarts. It is required rather than
        # defaulted to keep a forgetful caller from silently registering a new
        # device on every setup.
        self._device_id = device_id
        self._session_state = MolotovSession(
            device_id=self._device_id, refresh_token=refresh_token
        )
        self._lock = asyncio.Lock()
        # The device id the last link code was asked for with (see
        # async_request_link_code).
        self._link_device_id = device_id

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
    def parse_asset_ref(ref: str) -> tuple[str, str, bool]:
        """Parse a build_asset_url reference into (kind, id, start_over)."""

        if not ref.startswith(_REF_PREFIX):
            # Fall back to treating an unknown reference as a VOD id.
            return "vod", ref, False
        parts = ref.split(":")
        kind = parts[1] if len(parts) > 1 else "vod"
        start_over = parts[-1] == "startover"
        id_parts = parts[2:-1] if start_over else parts[2:]
        return kind, ":".join(id_parts), start_over

    @classmethod
    def vod_id(cls, ref: str) -> str | None:
        """Return the id of the on-demand item a playback reference plays."""

        if not ref.startswith(_REF_PREFIX):
            return None
        kind, video_id, _start_over = cls.parse_asset_ref(ref)
        return video_id if kind == "vod" and video_id else None

    def stream_content_type(self) -> str:
        """Return the default content type for cast playback."""

        return CONTENT_TYPE_DASH

    # --- Authentication -------------------------------------------------

    async def async_start_session(self) -> None:
        """Open a session: with the kept refresh token, else by signing in."""

        async with self._lock:
            refresh_token = self._session_state.refresh_token
            if refresh_token:
                try:
                    if await self._async_refresh(refresh_token):
                        await self._async_load_user()
                        return
                except MolotovAuthError as err:
                    _LOGGER.debug("Kept refresh token rejected: %s", err)
            await self._async_login()

    async def _async_login(self) -> None:
        """Sign in and load the user/profile ids; the caller holds the lock."""

        if not self._email or not self._password:
            raise MolotovAuthError(
                "No session left and no password to sign in with: link again",
                code=LINK_REQUIRED,
            )

        # The account email goes in a "username" field and the tokens come
        # back wrapped in a {type, payload} envelope. The older flat
        # PUT /signin {email,password} answers 401 INVALID_USERNAME_PASSWORD
        # for accounts the backend has since migrated.
        data = await self._request(
            "PUT",
            "v2/signin",
            auth=False,
            json={"username": self._email, "password": self._password},
        )
        if str(data.get("type", "")).upper() == "MFA":
            # The account wants a code it sent by email, which a sign-in
            # without the user cannot give: it has to be linked by code.
            raise MolotovAuthError(
                "Molotov asks for a code sent by email: link again",
                code=MFA_REQUIRED,
            )
        tokens = data.get("payload", data)
        access_token = tokens.get("access_token")
        if not access_token:
            raise MolotovAuthError("Login response did not include access token")
        self._set_tokens(access_token, tokens.get("refresh_token"))
        await self._async_load_user()

    async def _async_load_user(self) -> None:
        """Load the user and profile ids for a fresh access token."""

        # The fresh token cannot 401, so disable the refresh-and-retry path
        # here to avoid re-entering the auth lock we already hold.
        user = await self._request("GET", "user", auth=True, _retry=False)
        account = user.get("data") or {}
        user_id = account.get("id")
        if not user_id:
            raise MolotovAuthError("Login response did not include user id")
        profiles = [
            (str(p["id"]), str(p.get("name") or p["id"]))
            for p in account.get("profiles") or []
            if isinstance(p, dict) and p.get("id")
        ]
        if not profiles:
            raise MolotovAuthError("Account has no usable profile")
        ids = [profile_id for profile_id, _name in profiles]
        profile_id = ids[0]
        if self._chosen_profile in ids:
            profile_id = self._chosen_profile
        elif self._chosen_profile:
            _LOGGER.warning(
                "The Molotov profile chosen in the options is gone, using %s",
                profiles[0][1],
            )
        self._session_state.user_id = str(user_id)
        self._session_state.profile_id = profile_id
        self._session_state.profiles = profiles
        email = account.get("email")
        self._session_state.email = email if isinstance(email, str) and email else None

    def _set_tokens(self, access_token: str, refresh_token: str | None) -> None:
        """Take a fresh pair of tokens; a new refresh token is passed on."""

        self._session_state.access_token = access_token
        if refresh_token and refresh_token != self._session_state.refresh_token:
            self._session_state.refresh_token = refresh_token
            if self._on_refresh_token is not None:
                self._on_refresh_token(refresh_token)

    # --- Linking by code, as a TV does ----------------------------------

    async def async_request_link_code(self) -> tuple[str, int]:
        """Ask for a code to confirm on molotov.tv/tv, and how long it lasts (s).

        The backend ties a code to the device id it is asked with, and asked
        again with the same id it hands back the same code, expired or not:
        each code is asked for with an id of its own, as the TV apps do, which
        only its poll uses. The session it opens goes on with this client's
        device id.
        """

        self._link_device_id = str(uuid.uuid4())
        data = await self._request(
            "GET",
            "signin/code",
            auth=False,
            headers={"x-device-id": self._link_device_id},
        )
        code = data.get("code")
        if not isinstance(code, str) or not code:
            raise MolotovApiError("No link code in the backend's answer")
        try:
            lifetime = int(data["expires_at"]) - int(data["issued_at"])
        except (KeyError, TypeError, ValueError):
            lifetime = 0
        return code, max(lifetime, 60)

    async def async_poll_link_code(self, code: str) -> bool:
        """Whether [code] was confirmed; the session is then open.

        While it waits the backend answers without tokens, or with an error,
        which the caller takes as not yet.
        """

        data = await self._request(
            "POST",
            "signin/code",
            auth=False,
            json={"code": code},
            headers={"x-device-id": self._link_device_id},
            _retry=False,
        )
        signin = data.get("data")
        if not isinstance(signin, dict):
            return False
        tokens = signin.get("payload", signin)
        access_token = tokens.get("access_token") if isinstance(tokens, dict) else None
        if not access_token:
            return False
        async with self._lock:
            self._set_tokens(access_token, tokens.get("refresh_token"))
            await self._async_load_user()
        return True

    async def async_refresh_token(
        self, force: bool = False, used_token: str | None = None
    ) -> None:
        """Renew the access token, signing in again if the refresh fails.

        [used_token] is the token a refused request carried: when the session
        holds another one by now, it was renewed meanwhile and is kept.
        """

        token_before = used_token or self._session_state.access_token
        async with self._lock:
            # Another caller may have refreshed while we waited for the lock.
            if force and self._session_state.access_token != token_before:
                return

            refresh_token = self._session_state.refresh_token
            if refresh_token:
                try:
                    if await self._async_refresh(refresh_token):
                        return
                except MolotovAuthError as err:
                    # A transient backend error is not an auth problem and
                    # propagates; only a rejected token falls through.
                    _LOGGER.debug("Refresh token rejected: %s", err)

            # The refresh token is missing or no longer accepted. Stored
            # credentials, where there are any, are still good, so open a new
            # session rather than making the user re-enter a password that has
            # not changed. An account linked by code has none: it is linked
            # again (LINK_REQUIRED).
            _LOGGER.debug("Signing in again to replace the expired session")
            await self._async_login()

    async def _async_refresh(self, refresh_token: str) -> bool:
        """Exchange the refresh token for a fresh access token."""

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
            return False
        self._set_tokens(access_token, tokens.get("refresh_token"))
        return True

    async def async_ensure_logged_in(self) -> None:
        """Ensure an access token is present; a stale one is refreshed on 401."""

        if not self._session_state.access_token:
            await self.async_start_session()

    # --- Content (server-driven page API) -------------------------------

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
        """Fetch the live guide: channels with programmes over a time window.

        The guide comes in pages of [limit] channels: they are followed to the
        last one and returned as one guide, with every channel in "response".
        """

        await self.async_ensure_logged_in()
        now = dt_util.utcnow()
        params = {
            "startTime": _rfc3339(start or now),
            "endTime": _rfc3339(end or now + EPG_WINDOW),
            "limit": str(limit or EPG_CHANNEL_LIMIT),
            "ignoreEmpty": "true",
        }
        entries: list[Any] = []
        offset = 0
        for _page in range(EPG_MAX_PAGES):
            page_params = {**params, "offset": str(offset)} if offset else params
            page = await self._request(
                "GET",
                "epg",
                auth=True,
                params=page_params,
                timeout=LARGE_RESPONSE_TIMEOUT,
            )
            entries.extend(page.get("response") or [])
            next_offset = _epg_next_offset(page)
            if next_offset is None or next_offset <= offset:
                break
            offset = next_offset
        return {"response": entries}

    # --- Recordings (DVR) -----------------------------------------------

    async def async_get_recordings(self) -> dict[str, Any]:
        """Fetch the recordings page of "Mes vidéos".

        It holds one card per show, linking the folder of its recorded
        episodes, and one per recording that belongs to no show. The DVR list
        that served this before answers 404 since November 2026.
        """

        await self.async_ensure_logged_in()
        return await self._request(
            "GET", "papi/v1/my-stuff/status/recordings", auth=True
        )

    async def async_get_recordings_folder(self, series_id: str) -> dict[str, Any]:
        """Fetch the folder of a show's recordings: one row per episode."""

        await self.async_ensure_logged_in()
        return await self._request(
            "GET",
            f"papi/v1/my-stuff/folder/seriesId/{quote(series_id, safe='')}",
            auth=True,
        )

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
        kind, video_id, _start_over = self.parse_asset_ref(asset_url)
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
            "x-device-name": FUBO_DEVICE_NAME,
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
        # The token this request carries, read before it goes out: by the time
        # it is refused, another request may already have renewed the session.
        used_token = self._session_state.access_token if auth else None
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
                    await self.async_refresh_token(force=True, used_token=used_token)
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
                    error_body = await _read_error_body(resp)
                    code, user_message = _parse_error(error_body)
                    raise MolotovAuthError(
                        f"Backend rejected the credentials: {method} {url} "
                        f"(401 {code or 'no code'})"
                        + (f": {user_message}" if user_message else ""),
                        user_message=user_message,
                        code=code,
                        status=401,
                    )
                # Decide whether to retry, but back off only after the response
                # is released (below) so a pooled connection is not pinned.
                # Only a GET is sent again: a gateway error does not say whether
                # a POST or PUT (a recording scheduled) reached the backend.
                if (
                    resp.status in RETRY_STATUS_CODES
                    and method == "GET"
                    and _retries < MAX_RETRIES
                ):
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
                    code, user_message = _parse_error(error_body)
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
                        code=code,
                        status=resp.status,
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
                raise MolotovAuthError(
                    f"Backend rejected the credentials: {method} {url} (401)"
                ) from err
            raise MolotovApiError(
                f"Backend API request failed: {method} {url} ({err.status})"
            ) from err
        except Exception as err:
            _LOGGER.exception("Backend API request crashed: %s %s", method, url)
            raise MolotovApiError(
                f"Backend API request failed: {method} {url}"
            ) from err
