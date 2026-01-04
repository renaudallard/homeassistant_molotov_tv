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

"""API client for Molotov TV."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import timedelta
import gzip
import io
import json
import logging
from typing import Any
from urllib.parse import urlencode, urljoin
import zipfile

from aiohttp import BasicAuth, ClientResponseError, ClientSession
from homeassistant.util import dt as dt_util

from .const import CONTENT_TYPE_DASH, DEFAULT_ENVIRONMENT, ENVIRONMENTS, MOLOTOV_AGENT

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


def _extract_json_from_zip(raw: bytes) -> bytes:
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        json_entries = [
            entry
            for entry in archive.infolist()
            if entry.filename.lower().endswith(".json")
        ]
        if json_entries:
            target = max(json_entries, key=lambda entry: entry.file_size)
        else:
            entries = archive.infolist()
            if not entries:
                raise MolotovApiError("EPG zip payload is empty")
            target = entries[0]
        return archive.read(target.filename)


def _decode_epg_payload(raw: bytes) -> dict[str, Any]:
    if raw.startswith(b"\x1f\x8b"):
        raw = gzip.decompress(raw)
    elif raw.startswith((b"PK\x03\x04", b"PK\x05\x06", b"PK\x07\x08")):
        raw = _extract_json_from_zip(raw)

    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("utf-8", errors="replace")

    try:
        data = json.loads(text)
    except json.JSONDecodeError as err:
        raise MolotovApiError("EPG payload is not valid JSON") from err

    if isinstance(data, list):
        return {"channels": data}
    if not isinstance(data, dict):
        raise MolotovApiError("EPG response is not a JSON object")
    return data


def _extract_config_url(data: dict[str, Any], key: str) -> str | None:
    value = data.get(key)
    if not isinstance(value, dict):
        return None
    url = value.get("url")
    if isinstance(url, str) and url:
        return url
    return None


class MolotovApiError(Exception):
    """Generic Molotov API error."""


class MolotovAuthError(MolotovApiError):
    """Authentication failed."""


@dataclass
class MolotovSession:
    """Holds session-level data for Molotov."""

    access_token: str | None = None
    refresh_token: str | None = None
    access_token_expires_at: int | None = None
    user_id: str | None = None
    cast_app_id: str | None = None
    remote_url: str | None = None
    remote_subbed_url: str | None = None
    live_home_url: str | None = None
    home_url: str | None = None
    bookmark_url: str | None = None


class MolotovApi:
    """Minimal Molotov API client for Home Assistant."""

    def __init__(
        self,
        session: ClientSession,
        email: str,
        password: str,
        environment: str,
        language: str,
    ) -> None:
        self._session = session
        self._email = email
        self._password = password
        if environment not in ENVIRONMENTS:
            environment = DEFAULT_ENVIRONMENT
        self._environment = environment
        env = ENVIRONMENTS[environment]
        self._base_api_url = env["base_api_url"]
        self._live_channel_api_url = env["live_channel_api_url"]
        self._live_channel_auth = BasicAuth(
            env["live_channel_json_user"], env["live_channel_json_password"]
        )
        self._session_state = MolotovSession(
            cast_app_id=env.get("cast_app_id"),
            remote_url=urljoin(self._base_api_url, "v2/remote/channels"),
            remote_subbed_url=urljoin(self._base_api_url, "v2/remote/channels-subbed"),
            live_home_url=urljoin(self._base_api_url, "v2/channels/live/sections"),
            home_url=urljoin(self._base_api_url, "v3/me/home/sections"),
            bookmark_url=urljoin(self._base_api_url, "v2/me/bookmarks/sections"),
        )
        self._language = language
        self._lock = asyncio.Lock()

    @property
    def session_state(self) -> MolotovSession:
        """Return the current session state."""

        return self._session_state

    @property
    def base_api_url(self) -> str:
        """Return the base API URL for the selected environment."""

        return self._base_api_url

    def build_asset_url(
        self, video_type: str, video_id: str, start_over: bool = False
    ) -> str:
        """Build a Molotov asset URL for the given video reference."""

        params: dict[str, str] = {
            "type": video_type,
            "id": video_id,
            "video_format": "DASH",
        }
        if start_over:
            params["start_over"] = "true"
        return f"{urljoin(self._base_api_url, 'v2/me/assets')}?{urlencode(params)}"

    def stream_content_type(self) -> str:
        """Return the content type for cast playback."""

        return CONTENT_TYPE_DASH

    async def async_login(self) -> None:
        """Authenticate and cache tokens."""

        async with self._lock:
            payload = {
                "grant_type": "password",
                "email": self._email,
                "password": self._password,
            }
            data = await self._request(
                "POST",
                "v3.1/auth/login",
                auth=False,
                json=payload,
            )
            self._update_session_from_auth(data)
            if not self._session_state.access_token:
                raise MolotovAuthError("Login response did not include access token")
            if not self._session_state.user_id:
                raise MolotovAuthError("Login response did not include user id")
            try:
                await self.async_fetch_config()
            except MolotovApiError as err:
                _LOGGER.warning(
                    "Molotov config fetch failed; using defaults: %s",
                    err,
                )

    async def async_fetch_config(self) -> None:
        """Fetch dynamic config data."""

        data = await self._request("GET", "v2/config", auth=False)
        cast_app_id = data.get("cast_app_id")
        if cast_app_id:
            self._session_state.cast_app_id = cast_app_id
        remote_url = _extract_config_url(data, "remote")
        if remote_url:
            self._session_state.remote_url = remote_url
        remote_subbed_url = _extract_config_url(data, "remote_subbed")
        if remote_subbed_url:
            self._session_state.remote_subbed_url = remote_subbed_url
        live_home_url = _extract_config_url(data, "live_home")
        if live_home_url:
            self._session_state.live_home_url = live_home_url
        home_url = _extract_config_url(data, "v3_home") or _extract_config_url(
            data, "home"
        )
        if home_url:
            self._session_state.home_url = home_url
        bookmark_url = _extract_config_url(data, "bookmark") or _extract_config_url(
            data, "bookmarks"
        )
        if bookmark_url:
            self._session_state.bookmark_url = bookmark_url

    async def async_get_channels(self) -> dict[str, Any]:
        """Fetch the channel list with EPG data when available."""

        await self.async_ensure_logged_in()
        urls: list[str] = []
        session = self._session_state
        if session.remote_subbed_url:
            urls.append(session.remote_subbed_url)
        if session.remote_url and session.remote_url not in urls:
            urls.append(session.remote_url)
        if session.live_home_url and session.live_home_url not in urls:
            urls.append(session.live_home_url)

        last_error: MolotovApiError | None = None
        for url in urls:
            try:
                _LOGGER.debug("Fetching Molotov channels from %s", url)
                return await self._request("GET", url, auth=True)
            except MolotovApiError as err:
                last_error = err
                _LOGGER.warning("Molotov channel fetch failed for %s: %s", url, err)

        _LOGGER.warning("Falling back to Live Channels EPG feed")
        try:
            return await self.async_get_epg()
        except MolotovApiError as err:
            if last_error:
                _LOGGER.error(
                    "Molotov channel fetch failed for all endpoints; fallback failed: %s",
                    err,
                )
            raise

    async def async_get_home_sections(self) -> dict[str, Any]:
        """Fetch the home sections feed."""

        await self.async_ensure_logged_in()
        url = self._session_state.home_url or urljoin(
            self._base_api_url, "v3/me/home/sections"
        )
        return await self._request("GET", url, auth=True)

    async def async_get_bookmarks(self) -> dict[str, Any]:
        """Fetch the bookmarks sections feed."""

        await self.async_ensure_logged_in()
        url = self._session_state.bookmark_url or urljoin(
            self._base_api_url, "v2/me/bookmarks/sections"
        )
        return await self._request("GET", url, auth=True)

    async def async_get_channel_programs(self, channel_id: str) -> dict[str, Any]:
        """Fetch program data for a single channel."""

        await self.async_ensure_logged_in()
        return await self._request(
            "GET",
            f"v3.1/remote/programs/from-channel/{channel_id}",
            auth=True,
        )

    async def async_get_channel_replays(self, channel_id: str) -> dict[str, Any]:
        """Fetch replay/catchup content for a channel from home sections."""

        await self.async_ensure_logged_in()

        # Replays in Molotov come from home sections, filtered by channel
        # The home sections contain VOD items with video.type="vod"
        try:
            home_data = await self.async_get_home_sections()
        except MolotovApiError as err:
            _LOGGER.debug("Failed to fetch home sections for replays: %s", err)
            return {"sections": [], "channel_id": channel_id}

        # Filter sections and items by channel_id
        filtered_sections: list[dict[str, Any]] = []
        for section in home_data.get("sections", []):
            if not isinstance(section, dict):
                continue

            context = section.get("context", {})
            # Look for catchup/replay sections
            is_catchup = context.get("is_catchup", False)
            is_replay = context.get("is_replay", False)

            if not (is_catchup or is_replay):
                # Also check section slug/title for replay indicators
                slug = section.get("slug", "")
                title = section.get("title", "")
                if not any(
                    kw in (slug + title).lower()
                    for kw in ["replay", "catchup", "vod", "revoir", "rattrapage"]
                ):
                    continue

            # Filter items by channel_id
            items = section.get("items", [])
            channel_items = []
            for item in items:
                if not isinstance(item, dict):
                    continue

                # Check channel_id in metadata or video
                metadata = item.get("metadata", {})
                video = item.get("video", {})
                item_channel = (
                    metadata.get("channel_id")
                    or video.get("channel_id")
                    or item.get("channel_id")
                )

                if str(item_channel) == str(channel_id):
                    # Only include VOD type items
                    video_type = video.get("type", "")
                    if video_type == "vod":
                        channel_items.append(item)
                        _LOGGER.debug(
                            "Found VOD item for channel %s: %s (vod_id=%s)",
                            channel_id,
                            item.get("title", "unknown")[:30],
                            video.get("id"),
                        )

            if channel_items:
                filtered_section = {**section, "items": channel_items}
                filtered_sections.append(filtered_section)

        _LOGGER.debug(
            "Found %d replay sections with %d items for channel %s",
            len(filtered_sections),
            sum(len(s.get("items", [])) for s in filtered_sections),
            channel_id,
        )

        return {"sections": filtered_sections, "channel_id": channel_id}

    async def async_get_channel_past_programs(
        self, channel_id: str, days: int = 7
    ) -> dict[str, Any]:
        """Fetch programs for a channel including past ones (for replay)."""

        await self.async_ensure_logged_in()

        # Calculate time range: 7 days ago to now
        # Also try without time params to see what we get
        now = dt_util.utcnow()
        from_ts = int((now - timedelta(days=days)).timestamp() * 1000)
        to_ts = int(now.timestamp() * 1000)

        _LOGGER.debug(
            "Fetching programs for channel %s: from=%s (%s) to=%s (%s)",
            channel_id,
            from_ts,
            (now - timedelta(days=days)).isoformat(),
            to_ts,
            now.isoformat(),
        )

        # Try different endpoints for programs
        endpoints = [
            # Without time params first - see what we get
            f"v3.1/remote/programs/from-channel/{channel_id}",
            # With time params
            f"v3.1/remote/programs/from-channel/{channel_id}?from={from_ts}&to={to_ts}",
            # Try start/end params instead
            f"v3.1/remote/programs/from-channel/{channel_id}?start={from_ts}&end={to_ts}",
        ]

        for endpoint in endpoints:
            try:
                url = urljoin(self._base_api_url, endpoint)
                _LOGGER.debug("Trying programs endpoint: %s", url)
                result = await self._request("GET", url, auth=True)
                _LOGGER.debug(
                    "Programs response for channel %s: keys=%s",
                    channel_id,
                    list(result.keys()) if isinstance(result, dict) else type(result),
                )
                # Check if we got any content
                sections = result.get("sections", [])
                if sections:
                    items_count = sum(
                        len(s.get("items", [])) for s in sections if isinstance(s, dict)
                    )
                    _LOGGER.debug(
                        "Endpoint %s returned %d sections with %d total items",
                        endpoint.split("?")[0],
                        len(sections),
                        items_count,
                    )
                    if items_count > 0:
                        return result
            except MolotovApiError as err:
                _LOGGER.debug("Programs endpoint %s failed: %s", endpoint, err)

        return {"programs": []}

    async def async_get_all_recordings(self) -> list[dict[str, Any]]:
        """Fetch all recordings with pagination."""

        await self.async_ensure_logged_in()
        all_sections: list[dict[str, Any]] = []

        # First get bookmarks
        try:
            data = await self.async_get_bookmarks()
            if isinstance(data, dict) and "sections" in data:
                all_sections.extend(data.get("sections", []))
        except MolotovApiError as err:
            _LOGGER.debug("Failed to fetch bookmarks: %s", err)

        # Also try follow sections which may have recordings
        try:
            url = urljoin(self._base_api_url, "v3/me/follow/sections")
            data = await self._request("GET", url, auth=True)
            if isinstance(data, dict) and "sections" in data:
                all_sections.extend(data.get("sections", []))
        except MolotovApiError as err:
            _LOGGER.debug("Failed to fetch follow sections: %s", err)

        return all_sections

    async def async_refresh_token(self) -> None:
        """Refresh access token using the refresh token."""

        refresh_token = self._session_state.refresh_token
        if not refresh_token:
            raise MolotovAuthError("Missing refresh token")

        data = await self._request(
            "GET",
            f"v3/auth/refresh/{refresh_token}",
            auth=False,
        )
        self._update_session_from_auth(data)

    async def async_ensure_logged_in(self) -> None:
        """Ensure a valid access token is present."""

        if not self._session_state.access_token:
            await self.async_login()
            return

        expires_at = self._session_state.access_token_expires_at
        if expires_at:
            now = int(dt_util.utcnow().timestamp())
            if now >= expires_at - 60:
                await self.async_refresh_token()

    async def async_get_epg(self) -> dict[str, Any]:
        """Fetch the EPG JSON payload."""

        await self.async_ensure_logged_in()
        user_id = self._session_state.user_id
        if not user_id:
            raise MolotovApiError("Missing user id for EPG request")

        link_data = await self._request(
            "GET",
            f"{self._live_channel_api_url.rstrip('/')}/v1/{user_id}/firestick/download-link-epg-files",
            auth=False,
            basic_auth=self._live_channel_auth,
        )
        link = link_data.get("link")
        if not link:
            raise MolotovApiError("EPG link not returned by live channel API")

        live_channel_base = self._live_channel_api_url.rstrip("/")
        use_basic_auth = link.startswith(live_channel_base)
        epg_raw = await self._request_raw_bytes(
            "GET",
            link,
            auth=False,
            basic_auth=self._live_channel_auth if use_basic_auth else None,
        )
        return _decode_epg_payload(epg_raw)

    def build_headers(self, auth: bool) -> dict[str, str]:
        """Build request headers for Molotov."""

        headers = {
            "User-Agent": "Android",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": self._language,
            "logged_in": "true" if auth else "false",
            "orientation": "portrait",
            "X-Molotov-Agent": MOLOTOV_AGENT,
        }
        if auth and self._session_state.access_token:
            headers["Authorization"] = f"Bearer {self._session_state.access_token}"
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
        basic_auth: BasicAuth | None = None,
        _retry: bool = True,
    ) -> dict[str, Any]:
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
                auth=basic_auth,
            ) as resp:
                if resp.status == 401 and auth and _retry:
                    await self.async_refresh_token()
                    return await self._request(
                        method,
                        url_or_path,
                        auth=auth,
                        json=json,
                        params=params,
                        headers=headers,
                        basic_auth=basic_auth,
                        _retry=False,
                    )
                if resp.status == 401:
                    raise MolotovAuthError("Invalid credentials")
                if resp.status >= 400:
                    reason = resp.reason or "unknown"
                    error_body = await _read_error_body(resp)
                    if error_body:
                        _LOGGER.error(
                            "Molotov API error: %s %s (%s %s): %s",
                            method,
                            url,
                            resp.status,
                            reason,
                            error_body,
                        )
                    else:
                        _LOGGER.error(
                            "Molotov API error: %s %s (%s %s)",
                            method,
                            url,
                            resp.status,
                            reason,
                        )
                    raise MolotovApiError(
                        f"Molotov API request failed: {method} {url} ({resp.status} {reason})"
                        + (f": {error_body}" if error_body else "")
                    )
                content_type = resp.headers.get("content-type", "")
                if "json" not in content_type:
                    raise MolotovApiError(
                        f"Unexpected response type from Molotov: {content_type or 'unknown'}"
                    )
                return await resp.json()
        except ClientResponseError as err:
            if err.status == 401:
                raise MolotovAuthError("Invalid credentials") from err
            raise MolotovApiError(
                f"Molotov API request failed: {method} {url} ({err.status})"
            ) from err
        except Exception as err:
            _LOGGER.exception("Molotov API request crashed: %s %s", method, url)
            raise MolotovApiError(
                f"Molotov API request failed: {method} {url}"
            ) from err

    async def _request_raw_bytes(
        self,
        method: str,
        url_or_path: str,
        *,
        auth: bool,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
        basic_auth: BasicAuth | None = None,
        _retry: bool = True,
    ) -> bytes:
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
                auth=basic_auth,
            ) as resp:
                if resp.status == 401 and auth and _retry:
                    await self.async_refresh_token()
                    return await self._request_raw_bytes(
                        method,
                        url_or_path,
                        auth=auth,
                        json=json,
                        params=params,
                        headers=headers,
                        basic_auth=basic_auth,
                        _retry=False,
                    )
                if resp.status == 401:
                    raise MolotovAuthError("Invalid credentials")
                if resp.status >= 400:
                    reason = resp.reason or "unknown"
                    error_body = await _read_error_body(resp)
                    if error_body:
                        _LOGGER.error(
                            "Molotov API error: %s %s (%s %s): %s",
                            method,
                            url,
                            resp.status,
                            reason,
                            error_body,
                        )
                    else:
                        _LOGGER.error(
                            "Molotov API error: %s %s (%s %s)",
                            method,
                            url,
                            resp.status,
                            reason,
                        )
                    raise MolotovApiError(
                        f"Molotov API request failed: {method} {url} ({resp.status} {reason})"
                        + (f": {error_body}" if error_body else "")
                    )
                return await resp.read()
        except ClientResponseError as err:
            if err.status == 401:
                raise MolotovAuthError("Invalid credentials") from err
            raise MolotovApiError(
                f"Molotov API request failed: {method} {url} ({err.status})"
            ) from err
        except Exception as err:
            _LOGGER.exception("Molotov API request crashed: %s %s", method, url)
            raise MolotovApiError(
                f"Molotov API request failed: {method} {url}"
            ) from err

    def _update_session_from_auth(self, data: dict[str, Any]) -> None:
        auth = data.get("auth") if isinstance(data, dict) else None
        auth_data = auth if isinstance(auth, dict) else data
        access_token = auth_data.get("access_token")
        refresh_token = auth_data.get("refresh_token")
        expires_at = auth_data.get("access_token_expires_at")

        if access_token:
            self._session_state.access_token = access_token
        if refresh_token:
            self._session_state.refresh_token = refresh_token
        if isinstance(expires_at, int):
            self._session_state.access_token_expires_at = expires_at

        account = data.get("account") if isinstance(data, dict) else None
        if isinstance(account, dict):
            user_id = account.get("id")
            if user_id is not None:
                self._session_state.user_id = str(user_id)
