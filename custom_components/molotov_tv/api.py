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

from aiohttp import BasicAuth, ClientResponseError, ClientSession, ClientTimeout
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


def _extract_user_message(error_body: str | None) -> str | None:
    """Extract user_message from JSON error body if present."""
    if not error_body:
        return None
    try:
        data = json.loads(error_body)
        if isinstance(data, dict):
            error = data.get("error", data)
            if isinstance(error, dict):
                user_msg = error.get("user_message")
                if user_msg:
                    _LOGGER.debug("Extracted user_message: %s", user_msg[:100] if user_msg else None)
                return user_msg
    except (json.JSONDecodeError, TypeError) as err:
        _LOGGER.debug("Failed to extract user_message from error body: %s", err)
    return None


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


# HTTP request timeouts (seconds)
DEFAULT_TIMEOUT = ClientTimeout(total=30, connect=10)
LARGE_RESPONSE_TIMEOUT = ClientTimeout(total=60, connect=10)  # For EPG downloads

# Retry configuration
MAX_RETRIES = 3
RETRY_STATUS_CODES = {502, 503, 504, 429}  # Gateway errors and rate limiting
RETRY_DELAY_SECONDS = 1.0


class MolotovApiError(Exception):
    """Generic Molotov API error."""

    def __init__(self, message: str, user_message: str | None = None) -> None:
        super().__init__(message)
        self.user_message = user_message


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
    search_url: str | None = None
    search_home_url: str | None = None
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
        
        api_root = data.get("apiRoot")
        if api_root and isinstance(api_root, str):
            _LOGGER.debug("Configured apiRoot: %s", api_root)
            # Potentially update base_api_url if we want to trust the config
            # self._base_api_url = api_root 
            
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
        
        search_url = (
            _extract_config_url(data, "search")
            or _extract_config_url(data, "search_legacy")
            or _extract_config_url(data, "search_universal")
            or _extract_config_url(data, "globalSearchUrl")
            or _extract_config_url(data, "searchUrl")
        )
        if search_url:
            self._session_state.search_url = search_url
        search_home_url = (
            _extract_config_url(data, "v3_search_home")
            or _extract_config_url(data, "search_home")
            or _extract_config_url(data, "searchHome")
        )
        if search_home_url:
            self._session_state.search_home_url = search_home_url

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

    async def async_get_live_home_channels(self) -> dict[str, Any]:
        """Fetch live home sections (includes per-channel programs when available)."""
        await self.async_ensure_logged_in()
        url = self._session_state.live_home_url or urljoin(
            self._base_api_url, "v2/channels/live/sections"
        )
        return await self._request("GET", url, auth=True)

    async def async_get_home_sections(self) -> dict[str, Any]:
        """Fetch the home sections feed."""

        await self.async_ensure_logged_in()
        url = self._session_state.home_url or urljoin(
            self._base_api_url, "v3/me/home/sections"
        )
        return await self._request("GET", url, auth=True)

    async def async_search(self, query: str) -> dict[str, Any]:
        """Search for content.

        Args:
            query: The search query string.

        Returns:
            Search results with sections containing matching items.
        """
        await self.async_ensure_logged_in()
        _LOGGER.debug("Performing search with base_api_url: %s", self._base_api_url)

        # Try different search endpoints
        endpoints = []
        
        # Use dynamic search URL if available (preferred)
        # Note: globalSearchUrl typically returns a list of SearchTile objects
        if self._session_state.search_url:
            _LOGGER.debug("Using dynamic search URL: %s", self._session_state.search_url)
            endpoints.append(("POST", self._session_state.search_url, {"query": query}))
            
        endpoints.extend([
            ("POST", "v2/search", {"query": query}),
            ("POST", "v2/universal-search", {"query": query}),
            ("POST", "v2/me/search", {"query": query}), # Try without /query
            ("POST", "v2/me/search/query", {"query": query}),
            ("POST", "v3/me/search/query", {"query": query}),
            ("POST", "v2/search/query", {"query": query}),  # Try without /me/
            ("POST", "v3/search/query", {"query": query}),
            ("GET", f"v2/me/search?query={query}", None),
            ("GET", f"v3/search?q={query}", None),
        ])

        last_error: MolotovApiError | None = None
        for method, endpoint, body in endpoints:
            try:
                url = endpoint if endpoint.startswith("http") else urljoin(self._base_api_url, endpoint)
                _LOGGER.debug("Trying search endpoint: %s %s", method, url)

                if method == "POST" and body:
                    result = await self._request(method, url, auth=True, json=body)
                else:
                    result = await self._request(method, url, auth=True)

                _LOGGER.debug(
                    "Search response keys: %s",
                    list(result.keys()) if isinstance(result, dict) else type(result),
                )

                # Check if we got useful results
                if isinstance(result, dict):
                    has_sections = bool(result.get("sections"))
                    has_items = bool(result.get("items"))
                    has_results = bool(result.get("results"))
                    
                    if has_sections or has_items or has_results:
                        return result
                        
                elif isinstance(result, list):
                     # Global search returns a list of items directly
                     # Wrap it in a section for compatibility
                     _LOGGER.debug("Got list response with %d items", len(result))
                     return {
                         "sections": [
                             {
                                 "title": "Results",
                                 "items": result,
                                 "type": "search_results" 
                             }
                         ], 
                         "query": query
                     }

            except MolotovApiError as err:
                _LOGGER.debug("Search endpoint %s failed: %s", endpoint, err)
                last_error = err

        # Raise error if all endpoints failed
        if last_error:
            _LOGGER.warning("All search endpoints failed: %s", last_error)
            raise MolotovApiError(f"Search failed: {last_error}") from last_error
        # No error but no results found
        return {"sections": [], "query": query}

    async def async_get_search_home(self) -> dict[str, Any]:
        """Get search home page with suggestions and popular content."""
        await self.async_ensure_logged_in()
        endpoints = []
        if self._session_state.search_home_url:
            endpoints.append(self._session_state.search_home_url)
        endpoints.extend([
            "v3/search-home",
            "v2/me/search/home",
        ])
        last_error: MolotovApiError | None = None
        for endpoint in endpoints:
            url = endpoint if endpoint.startswith("http") else urljoin(self._base_api_url, endpoint)
            try:
                return await self._request("GET", url, auth=True)
            except MolotovApiError as err:
                _LOGGER.debug("Search home endpoint %s failed: %s", url, err)
                last_error = err
        if last_error:
            raise last_error
        return {}

    async def async_get_program_details(
        self, channel_id: str, program_id: str
    ) -> dict[str, Any]:
        """Fetch program details including all episodes.

        Args:
            channel_id: The channel ID.
            program_id: The program ID.

        Returns:
            Program details with channelEpisodeSections and programEpisodeSections.
        """
        await self.async_ensure_logged_in()

        # Try v2 endpoint first
        endpoints = [
            f"v2/channels/{channel_id}/programs/{program_id}/view",
            f"v3/channels/{channel_id}/programs/{program_id}/view",
            f"v2/channels/{channel_id}/programs/{program_id}",
        ]

        for endpoint in endpoints:
            try:
                url = urljoin(self._base_api_url, endpoint)
                result = await self._request("GET", url, auth=True)
                if isinstance(result, dict):
                    _LOGGER.debug(
                        "Program details from %s: keys=%s",
                        endpoint,
                        list(result.keys()),
                    )
                    return result
            except MolotovApiError as err:
                _LOGGER.debug("Program details endpoint %s failed: %s", endpoint, err)

        return {"program": None, "channelEpisodeSections": [], "programEpisodeSections": []}

    async def async_get_asset_stream(self, asset_url: str) -> dict[str, Any]:
        """Resolve asset URL to stream data."""
        await self.async_ensure_logged_in()

        # 1. Get asset metadata
        asset_data = await self._request("GET", asset_url, auth=True)

        _LOGGER.debug(
            "Asset response keys: %s", list(asset_data.keys()) if isinstance(asset_data, dict) else type(asset_data)
        )

        # 2. Check CDN decision - stream might be at top level or nested
        stream = asset_data.get("stream", {})
        if not stream or not stream.get("url"):
            # Try alternative locations for stream URL
            _LOGGER.debug("No 'stream.url' key, checking alternatives in: %s", list(asset_data.keys()))
            for key in ["manifest_url", "url", "playback_url", "dash_url", "mpd_url", "content_url"]:
                if key in asset_data and asset_data[key]:
                    stream = {"url": asset_data[key]}
                    _LOGGER.debug("Found stream URL in '%s'", key)
                    break

        cdn_url = stream.get("cdn_decision_url")
        suffix_url = stream.get("suffix_url")
        final_url = stream.get("url")

        if cdn_url:
            try:
                _LOGGER.debug("Resolving CDN decision from %s", cdn_url)
                providers_data = await self._request("GET", cdn_url, auth=True)

                # Expecting a list of base URLs
                if isinstance(providers_data, list) and providers_data:
                    base_url = providers_data[0]
                    if isinstance(base_url, str):
                        if suffix_url:
                            final_url = f"{base_url.rstrip('/')}/{suffix_url.lstrip('/')}"
                        else:
                            final_url = base_url
                        _LOGGER.debug("Resolved stream URL: %s", final_url)
            except MolotovAuthError:
                raise
            except (MolotovApiError, KeyError, TypeError, IndexError, ValueError) as err:
                _LOGGER.warning("Failed to resolve CDN decision: %s", err)

        # Update the stream dict with the resolved URL
        if final_url:
            stream["url"] = final_url
            _LOGGER.debug("Final stream URL: %s", final_url[:100] if final_url else None)
        else:
            _LOGGER.warning("No stream URL found in asset response")

        asset_data["stream"] = stream
        return asset_data

    async def async_get_bookmarks(self) -> dict[str, Any]:
        """Fetch the bookmarks sections feed (recordings)."""

        await self.async_ensure_logged_in()

        # Try multiple endpoints - v3 for TV, v4 for mobile, v2 as fallback
        endpoints = [
            self._session_state.bookmark_url,
            urljoin(self._base_api_url, "v3/me/bookmarks/sections"),
            urljoin(self._base_api_url, "v4/me/bookmarks/sections"),
            urljoin(self._base_api_url, "v2/me/bookmarks/sections"),
        ]

        for url in endpoints:
            if not url:
                continue
            try:
                result = await self._request("GET", url, auth=True)
                if isinstance(result, dict):
                    sections = result.get("sections", [])
                    _LOGGER.debug(
                        "Bookmarks from %s: %d sections",
                        url.split("/")[-2] if "/" in url else url,
                        len(sections) if isinstance(sections, list) else 0,
                    )
                    if sections:
                        return result
            except MolotovApiError as err:
                _LOGGER.debug("Bookmarks endpoint %s failed: %s", url, err)

        return {"sections": []}

    async def async_get_channel_programs(self, channel_id: str) -> dict[str, Any]:
        """Fetch program data for a single channel."""

        await self.async_ensure_logged_in()
        return await self._request(
            "GET",
            f"v3.1/remote/programs/from-channel/{channel_id}",
            auth=True,
        )

    async def async_get_channel_replays(self, channel_id: str) -> dict[str, Any]:
        """Fetch replay/catchup content for a channel."""

        await self.async_ensure_logged_in()

        # Channel pages in the app use the channel sections endpoint.
        try:
            url = urljoin(self._base_api_url, f"v2/channels/{channel_id}/sections")
            _LOGGER.debug("Fetching channel sections for replays: %s", url)
            result = await self._request("GET", url, auth=True)
            if result and result.get("sections"):
                _LOGGER.debug("Found %d sections for channel %s via dedicated endpoint", len(result.get("sections")), channel_id)
                return result
            _LOGGER.debug("Channel sections endpoint returned no sections for %s", channel_id)
        except MolotovApiError as err:
            _LOGGER.debug(
                "Channel sections endpoint failed for %s: %s", channel_id, err
            )

        # Fall back to home sections filtered by channel.
        # Home sections contain VOD items with video.type="vod".
        try:
            home_data = await self.async_get_home_sections()
        except MolotovApiError as err:
            _LOGGER.debug("Failed to fetch home sections for replays: %s", err)
            return {"sections": [], "channel_id": channel_id}

        # Filter sections and items by channel_id.
        filtered_sections: list[dict[str, Any]] = []
        for section in home_data.get("sections", []):
            if not isinstance(section, dict):
                continue

            # Check if section itself is for this channel
            context = section.get("context", {})
            section_channel = (
                section.get("channel_id")
                or context.get("channel_id")
                or section.get("id")
            )
            is_channel_section = str(section_channel) == str(channel_id)

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

                # Match if item belongs to channel OR the whole section belongs to channel
                if is_channel_section or str(item_channel) == str(channel_id):
                    # Only include VOD type items
                    video_type = video.get("type", "")
                    if video_type == "vod":
                        channel_items.append(item)
                        _LOGGER.debug(
                            "Found VOD item for channel %s: %s (vod_id=%s, section=%s)",
                            channel_id,
                            item.get("title", "unknown")[:30],
                            video.get("id"),
                            section.get("title", "unknown")
                        )
                elif item_channel:
                     _LOGGER.debug(
                         "Skipping item '%s': Item channel_id=%s != Target %s",
                         item.get("title", "unknown")[:30],
                         item_channel,
                         channel_id
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

        async with self._lock:
            # Re-check expiration inside lock to avoid redundant refreshes
            expires_at = self._session_state.access_token_expires_at
            if expires_at:
                now = int(dt_util.utcnow().timestamp())
                if now < expires_at - 60:
                    return  # Token was already refreshed by another call

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
            timeout=LARGE_RESPONSE_TIMEOUT,
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
        timeout: ClientTimeout | None = None,
        _retry: bool = True,
        _retries: int = 0,
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
                timeout=timeout or DEFAULT_TIMEOUT,
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
                        timeout=timeout,
                        _retry=False,
                        _retries=_retries,
                    )
                if resp.status == 401:
                    raise MolotovAuthError("Invalid credentials")
                # Retry on transient failures
                if resp.status in RETRY_STATUS_CODES and _retries < MAX_RETRIES:
                    _LOGGER.warning(
                        "Retryable error %s for %s %s, attempt %d/%d",
                        resp.status, method, url, _retries + 1, MAX_RETRIES
                    )
                    await asyncio.sleep(RETRY_DELAY_SECONDS * (2 ** _retries))
                    return await self._request(
                        method,
                        url_or_path,
                        auth=auth,
                        json=json,
                        params=params,
                        headers=headers,
                        basic_auth=basic_auth,
                        timeout=timeout,
                        _retry=_retry,
                        _retries=_retries + 1,
                    )
                if resp.status >= 400:
                    reason = resp.reason or "unknown"
                    error_body = await _read_error_body(resp)
                    user_message = _extract_user_message(error_body)
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
                        + (f": {error_body}" if error_body else ""),
                        user_message=user_message,
                    )
                content_type = resp.headers.get("content-type", "")
                if "json" not in content_type:
                    raise MolotovApiError(
                        f"Unexpected response type from Molotov: {content_type or 'unknown'}"
                    )
                return await resp.json()
        except MolotovApiError:
            raise
        except MolotovAuthError:
            raise
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
        timeout: ClientTimeout | None = None,
        _retry: bool = True,
        _retries: int = 0,
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
                timeout=timeout or DEFAULT_TIMEOUT,
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
                        timeout=timeout,
                        _retry=False,
                        _retries=_retries,
                    )
                if resp.status == 401:
                    raise MolotovAuthError("Invalid credentials")
                # Retry on transient failures
                if resp.status in RETRY_STATUS_CODES and _retries < MAX_RETRIES:
                    _LOGGER.warning(
                        "Retryable error %s for %s %s, attempt %d/%d",
                        resp.status, method, url, _retries + 1, MAX_RETRIES
                    )
                    await asyncio.sleep(RETRY_DELAY_SECONDS * (2 ** _retries))
                    return await self._request_raw_bytes(
                        method,
                        url_or_path,
                        auth=auth,
                        json=json,
                        params=params,
                        headers=headers,
                        basic_auth=basic_auth,
                        timeout=timeout,
                        _retry=_retry,
                        _retries=_retries + 1,
                    )
                if resp.status >= 400:
                    reason = resp.reason or "unknown"
                    error_body = await _read_error_body(resp)
                    user_message = _extract_user_message(error_body)
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
                        + (f": {error_body}" if error_body else ""),
                        user_message=user_message,
                    )
                return await resp.read()
        except MolotovApiError:
            raise
        except MolotovAuthError:
            raise
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
            
            # Check for premium status
            user_type = account.get("user_type")
            if user_type not in ("premium", "vip"):
                raise MolotovAuthError(
                    f"User type is '{user_type}'. Please subscribe to a paid plan to use this integration."
                )
