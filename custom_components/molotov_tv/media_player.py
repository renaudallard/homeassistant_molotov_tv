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

"""Media player entity for Molotov TV."""

from __future__ import annotations

import asyncio
import base64
from dataclasses import dataclass
from datetime import datetime, timedelta
import json
import logging
import re
from typing import Any
from urllib.parse import parse_qs, quote, unquote, urlparse

from homeassistant.components.media_player import (
    BrowseMedia,
    MediaClass,
    MediaPlayerEntity,
    MediaPlayerEntityFeature,
)
from homeassistant.components.zeroconf import async_get_instance
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.const import (
    STATE_IDLE,
    STATE_PLAYING,
    STATE_PAUSED,
    ATTR_ENTITY_ID,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .api import MolotovApi, MolotovApiError
from .chromecast import (
    MolotovCastError,
    async_cast_media,
    async_cast_pause,
    async_cast_play,
    async_cast_stop,
    async_cast_seek,
    async_cast_volume,
    async_cast_volume_up,
    async_cast_volume_down,
    async_cast_mute,
    async_cast_skip_forward,
    async_cast_skip_back,
    async_cast_register_listener,
    async_cast_select_track,
)
from .const import (
    CONF_CAST_TARGET,
    CONF_CAST_TARGETS,
    CONF_CAST_HOSTS,
    DOMAIN,
    MEDIA_CAST_PREFIX,
    MEDIA_CHANNEL_PREFIX,
    MEDIA_CHANNELS,
    MEDIA_EPISODE_PREFIX,
    MEDIA_LIVE_PREFIX,
    MEDIA_NOW_PLAYING,
    MEDIA_PROGRAM_EPISODES_PREFIX,
    MEDIA_PROGRAM_PREFIX,
    MEDIA_RECORDING_PREFIX,
    MEDIA_RECORDINGS,
    MEDIA_REPLAY_PREFIX,
    MEDIA_ROOT,
    MEDIA_SEARCH,
    MEDIA_SEARCH_PREFIX,
    MEDIA_SEARCH_RESULT_PREFIX,
    MEDIA_SEARCH_INPUT_PREFIX,
    MOLOTOV_AGENT,
    CUSTOM_RECEIVER_APP_ID,
)
from .coordinator import (
    EpgChannel,
    EpgData,
    EpgProgram,
    MolotovEpgCoordinator,
    _parse_epg,
)

_LOGGER = logging.getLogger(__name__)

PROGRAM_CACHE_TTL = timedelta(minutes=15)
ASSET_CACHE_TTL = timedelta(minutes=5)  # Reduced for faster refresh of recordings/replays
CAST_DISCOVERY_TTL = timedelta(seconds=30)
SEARCH_CACHE_TTL = timedelta(minutes=10)
MAX_PROGRAM_CACHE_SIZE = 50  # Maximum number of channels to cache programs for


@dataclass(slots=True)
class BrowseAsset:
    """Represents a replay or recording item for browsing."""

    title: str
    asset_url: str
    is_live: bool = False
    description: str | None = None
    episode_title: str | None = None
    thumbnail: str | None = None
    poster: str | None = None
    start: datetime | None = None
    end: datetime | None = None
    program_id: str | None = None
    channel_id: str | None = None
    asset_type: str | None = None
    episode_id: str | None = None
    available_from: datetime | None = None
    available_until: datetime | None = None


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    data = hass.data[DOMAIN][entry.entry_id]
    coordinator: MolotovEpgCoordinator = data["coordinator"]
    api: MolotovApi = data["api"]
    async_add_entities([MolotovTvMediaPlayer(entry, coordinator, api)])


class MolotovTvMediaPlayer(CoordinatorEntity[MolotovEpgCoordinator], MediaPlayerEntity):
    """Molotov TV media player for browsing the EPG and casting."""

    _attr_supported_features = (
        MediaPlayerEntityFeature.BROWSE_MEDIA
        | MediaPlayerEntityFeature.PLAY_MEDIA
        | MediaPlayerEntityFeature.PAUSE
        | MediaPlayerEntityFeature.STOP
        | MediaPlayerEntityFeature.PLAY
        | MediaPlayerEntityFeature.VOLUME_SET
        | MediaPlayerEntityFeature.VOLUME_STEP
        | MediaPlayerEntityFeature.VOLUME_MUTE
        | MediaPlayerEntityFeature.SEEK
        | MediaPlayerEntityFeature.NEXT_TRACK
        | MediaPlayerEntityFeature.PREVIOUS_TRACK
        | MediaPlayerEntityFeature.TURN_OFF
        | MediaPlayerEntityFeature.SELECT_SOUND_MODE
    )
    _attr_state = STATE_IDLE

    def __init__(
        self,
        entry: ConfigEntry,
        coordinator: MolotovEpgCoordinator,
        api: MolotovApi,
    ) -> None:
        super().__init__(coordinator)
        self._entry = entry
        self._api = api
        self._attr_unique_id = entry.entry_id
        self._attr_name = None  # Use device name only (no duplication)
        self._attr_has_entity_name = True
        self._program_cache: dict[str, tuple[datetime, list[EpgProgram]]] = {}
        self._recording_cache: tuple[datetime, list[BrowseAsset]] | None = None
        self._cast_discovery_cache: tuple[datetime, list[str]] | None = None
        self._active_cast_target: str | None = None
        self._active_cast_entity: str | None = None
        self._current_stream: dict[str, Any] | None = None
        self._tracks: dict[str, dict[str, Any]] = {}  # Name -> {id, lang, type}
        self._current_track_id: int | None = None

    @property
    def device_info(self):
        """Return device info."""
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": self._entry.title,
            "manufacturer": "Molotov",
            "model": "Molotov TV",
        }

    @property
    def extra_state_attributes(self):
        """Return entity specific state attributes."""
        attrs = {}
        if self._current_stream:
            stream = self._current_stream.get("stream", {})
            url = stream.get("url")
            _LOGGER.debug(
                "extra_state_attributes: stream keys=%s, url present=%s",
                list(stream.keys()) if stream else None,
                bool(url)
            )
            if url:
                attrs["stream_url"] = url
            
            # Extract DRM info
            drm = self._current_stream.get("drm")
            up_drm = self._current_stream.get("up_drm")
            
            if up_drm:
                # Normalize up_drm to a simpler structure
                wv = up_drm.get("key_systems", {}).get("Widevine", {})
                license_data = wv.get("license", {})
                if license_data:
                    license_url = license_data.get("url")
                    if query_params := license_data.get("query_params"):
                        from urllib.parse import urlencode
                        if "?" in license_url:
                            license_url = f"{license_url}&{urlencode(query_params)}"
                        else:
                            license_url = f"{license_url}?{urlencode(query_params)}"
                            
                    attrs["stream_drm"] = {
                        "type": "widevine",
                        "license_url": license_url,
                        "headers": license_data.get("http_headers", {})
                    }
            elif drm:
                attrs["stream_drm"] = drm
            
            # Extract preferred track info
            config = self._current_stream.get("config", {})
            selected_track = config.get("selected_track", {})
            if selected_track:
                attrs["stream_selected_track"] = selected_track
                
        return attrs

    def _get_search_cache(self) -> tuple[datetime, str, list[BrowseAsset]] | None:
        """Get search cache from shared storage."""
        data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
        return data.get("search_cache")

    def _set_search_cache(
        self, query: str, results: list[BrowseAsset]
    ) -> None:
        """Set search cache in shared storage."""
        data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id)
        if data is not None:
            data["search_cache"] = (dt_util.utcnow(), query, results)

    async def async_browse_media(
        self,
        media_content_type: str | None = None,
        media_content_id: str | None = None,
    ) -> BrowseMedia:
        data = self.coordinator.data
        if data is None:
            raise HomeAssistantError("EPG data is not available yet")

        if media_content_id in (None, MEDIA_ROOT):
            return self._browse_root()

        if media_content_id == MEDIA_NOW_PLAYING:
            # Refresh EPG data for up-to-date listings
            await self.coordinator.async_request_refresh()
            data = self.coordinator.data
            if data is None:
                raise HomeAssistantError("EPG data is not available yet")
            return await self._async_browse_now_playing(data)

        if media_content_id == MEDIA_CHANNELS:
            # Refresh EPG data when browsing channels
            await self.coordinator.async_request_refresh()
            data = self.coordinator.data
            if data is None:
                raise HomeAssistantError("EPG data is not available yet")
            return self._browse_channels(data)

        if media_content_id == MEDIA_RECORDINGS:
            return await self._async_browse_recordings()

        if media_content_id.startswith(f"{MEDIA_CHANNEL_PREFIX}:"):
            channel_id = media_content_id.split(":", 1)[1]
            return await self._async_browse_programs(data, channel_id)

        if media_content_id.startswith(f"{MEDIA_PROGRAM_PREFIX}:"):
            return await self._async_browse_cast_targets(data, media_content_id)

        if media_content_id.startswith(f"{MEDIA_LIVE_PREFIX}:"):
            return await self._async_browse_cast_targets(data, media_content_id)

        if media_content_id.startswith(f"{MEDIA_REPLAY_PREFIX}:"):
            # Check if we can show program episodes
            return await self._async_browse_replay_or_episodes(data, media_content_id)

        if media_content_id.startswith(f"{MEDIA_PROGRAM_EPISODES_PREFIX}:"):
            return await self._async_browse_program_episodes(media_content_id)

        if media_content_id.startswith(f"{MEDIA_EPISODE_PREFIX}:"):
            return await self._async_browse_cast_targets(data, media_content_id)

        if media_content_id.startswith(f"{MEDIA_RECORDING_PREFIX}:"):
            # Check if we can show program episodes (same as replays)
            return await self._async_browse_replay_or_episodes(data, media_content_id)

        if media_content_id.startswith(f"{MEDIA_SEARCH_INPUT_PREFIX}:"):
            buffer = media_content_id.split(":", 1)[1]
            return await self._async_browse_search_input(buffer)

        if media_content_id == MEDIA_SEARCH:
            return await self._async_browse_search_home()

        # Handle search queries - can come as "search:query" or with URL params
        if media_content_id.startswith(f"{MEDIA_SEARCH_PREFIX}:"):
            query = media_content_id.split(":", 1)[1]
            # Check if it's a URL-encoded query
            if "?" in query or "=" in query:
                query = unquote(query)
            return await self._async_browse_search_results(query)

        # Handle search via query parameter (some HA frontends use this)
        if "?" in media_content_id:
            base_id, query_string = media_content_id.split("?", 1)
            params = parse_qs(query_string)
            search_query = params.get("search", params.get("query", [None]))[0]
            if search_query and base_id in (MEDIA_SEARCH, MEDIA_ROOT):
                return await self._async_browse_search_results(unquote(search_query))

        if media_content_id.startswith(f"{MEDIA_SEARCH_RESULT_PREFIX}:"):
            return await self._async_browse_replay_or_episodes(data, media_content_id)

        return self._browse_root()

    async def async_play_media(
        self,
        media_type: str,
        media_id: str,
        **kwargs: Any,
    ) -> None:
        # Handle search queries - store results for browsing
        if media_id.startswith(f"{MEDIA_SEARCH_PREFIX}:"):
            query = media_id.split(":", 1)[1]
            await self._async_perform_search(query)
            return

        if media_id.startswith("play_local:"):
            await self._async_play_local(media_id.split(":", 1)[1])
            return

        if media_id.startswith(f"{MEDIA_CAST_PREFIX}:"):
            # Check for new format: cast:encoded_target:receiver_type:base_media_id
            parts = media_id.split(":", 3)
            
            if len(parts) == 4:
                _, encoded_target, receiver_type, base_media_id = parts
                target = self._decode_cast_target(encoded_target)
                await self._async_cast_media(base_media_id, target, receiver_type=receiver_type)
                return
            
            # Fallback to old format: cast:encoded_target:base_media_id
            if len(parts) == 3:
                _, encoded_target, base_media_id = parts
                target = self._decode_cast_target(encoded_target)
                # Default to native if not specified, but let _async_cast_media handle defaults if needed.
                # However, if we are in this block, it means we are using the browser which now generates explicit types.
                # For backward compatibility, we can assume "native" unless forced otherwise.
                # Actually, if CUSTOM_RECEIVER_APP_ID is set, the previous code defaulted to custom.
                # But now we want explicit control. 
                # Let's assume legacy format means "default/native" unless user specifically chose custom in the past.
                # To be safe and consistent with previous behavior (where CUSTOM_RECEIVER_APP_ID forced custom),
                # we can pass "custom" if CUSTOM_RECEIVER_APP_ID is set, or just "native".
                # But wait, the user wants options. The browser now generates explicit options.
                # So legacy calls might come from scripts?
                # Let's default to "custom" if CUSTOM_RECEIVER_APP_ID is set, to maintain behavior for existing scripts using 'cast:...'
                receiver_type = "custom" if CUSTOM_RECEIVER_APP_ID else "native"
                await self._async_cast_media(base_media_id, target, receiver_type=receiver_type)
                return

        targets = await self._async_get_cast_targets()
        if len(targets) == 1:
            # Auto-cast if only one target
            receiver_type = "custom" if CUSTOM_RECEIVER_APP_ID else "native"
            await self._async_cast_media(media_id, targets[0], receiver_type=receiver_type)
            return

        # If no cast target is selected, play locally (expose stream URL)
        await self._async_play_local(media_id)

    async def _async_play_local(self, media_id: str) -> None:
        """Play media locally by resolving stream URL."""
        try:
            asset_url, title, is_live = self._build_cast_request(media_id)
            asset_data = await self._api.async_get_asset_stream(asset_url)

            _LOGGER.debug("Local play asset data: %s", json.dumps(asset_data, default=str))

            self._current_stream = asset_data
            self._attr_state = STATE_PLAYING
            self._attr_media_title = title
            
            stream = asset_data.get("stream", {})
            self._attr_media_content_id = stream.get("url")
            video_format = stream.get("video_format")
            if video_format == "DASH":
                self._attr_media_content_type = "application/dash+xml"
            elif video_format == "HLS":
                self._attr_media_content_type = "application/x-mpegurl"
            else:
                self._attr_media_content_type = video_format or "application/dash+xml"
            
            self.async_write_ha_state()
            _LOGGER.info("Molotov playing locally: %s", title)

        except MolotovApiError as err:
            self._attr_state = STATE_IDLE
            self._current_stream = None
            raise HomeAssistantError(f"Failed to play locally: {err}") from err

    async def _async_perform_search(self, query: str) -> None:
        """Perform a search and cache results for browsing."""
        if not query.strip():
            return

        try:
            data = await self._api.async_search(query)
            results = _extract_search_results(data, self._api)
            self._set_search_cache(query, results)
            _LOGGER.info(
                "Search for '%s' completed with %d results. "
                "Browse to Search folder to see results.",
                query,
                len(results),
            )
        except MolotovApiError as err:
            _LOGGER.error("Search failed: %s", err)
            raise HomeAssistantError(f"Search failed: {err}") from err

    def _browse_root(self) -> BrowseMedia:
        return BrowseMedia(
            title="Molotov TV",
            media_class=MediaClass.DIRECTORY,
            media_content_id=MEDIA_ROOT,
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            children=[
                BrowseMedia(
                    title="Search",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=MEDIA_SEARCH,
                    media_content_type="directory",
                    can_play=False,
                    can_expand=True,
                ),
                BrowseMedia(
                    title="Now Playing",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=MEDIA_NOW_PLAYING,
                    media_content_type="directory",
                    can_play=False,
                    can_expand=True,
                ),
                BrowseMedia(
                    title="Channels",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=MEDIA_CHANNELS,
                    media_content_type="directory",
                    can_play=False,
                    can_expand=True,
                ),
                BrowseMedia(
                    title="Recordings",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=MEDIA_RECORDINGS,
                    media_content_type="directory",
                    can_play=False,
                    can_expand=True,
                ),
            ],
        )

    async def _async_browse_now_playing(self, data: EpgData) -> BrowseMedia:
        channels = list(data.channels)
        if not channels:
            return BrowseMedia(
                title="Now Playing",
                media_class=MediaClass.DIRECTORY,
                media_content_id=MEDIA_NOW_PLAYING,
                media_content_type="directory",
                can_play=False,
                can_expand=True,
                children=[],
            )

        probe_now = dt_util.utcnow()
        channels_by_id = {channel.channel_id: channel for channel in channels}
        if _count_channels_with_current(channels, probe_now) < len(channels):
            try:
                live_home = await self._api.async_get_live_home_channels()
                live_data = _parse_epg(live_home)
                _merge_epg_channels(channels_by_id, live_data.channels)
            except MolotovApiError as err:
                _LOGGER.debug("Now playing live home refresh failed: %s", err)

        await self._async_populate_now_playing_programs(list(channels_by_id.values()))

        now = dt_util.utcnow()
        children: list[BrowseMedia] = []

        for channel in channels:
            current_program = _find_current_program(channel, now)

            if current_program:
                start_ts = int(current_program.start.timestamp())
                end_ts = int(current_program.end.timestamp())
                title = current_program.title
                if current_program.episode_title:
                    title = f"{title} - {current_program.episode_title}"
                display_title = f"{channel.label} - {title}"
                media_id = (
                    f"{MEDIA_PROGRAM_PREFIX}:{channel.channel_id}:{start_ts}:{end_ts}"
                )
                media_class = MediaClass.TV_SHOW
                thumb = (
                    current_program.thumbnail
                    or current_program.poster
                    or channel.poster
                )
            else:
                display_title = f"{channel.label} - Live"
                media_id = f"{MEDIA_LIVE_PREFIX}:{channel.channel_id}"
                media_class = MediaClass.CHANNEL
                thumb = channel.poster

            children.append(
                BrowseMedia(
                    title=display_title,
                    media_class=media_class,
                    media_content_id=media_id,
                    media_content_type=media_id.split(":", 1)[0],
                    can_play=False,
                    can_expand=True,
                    thumbnail=thumb,
                )
            )

        return BrowseMedia(
            title="Now Playing",
            media_class=MediaClass.DIRECTORY,
            media_content_id=MEDIA_NOW_PLAYING,
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            children=children,
        )

    async def _async_populate_now_playing_programs(
        self, channels: list[EpgChannel]
    ) -> None:
        missing: list[EpgChannel] = []
        probe_now = dt_util.utcnow()
        for channel in channels:
            if _find_current_program(channel, probe_now):
                continue
            cached = self._get_cached_programs(channel.channel_id)
            if cached is not None:
                channel.programs = cached
                if _find_current_program(channel, probe_now):
                    continue
            missing.append(channel)

        if not missing:
            return

        semaphore = asyncio.Semaphore(5)

        async def fetch_programs(channel: EpgChannel) -> None:
            async with semaphore:
                try:
                    raw = await self._api.async_get_channel_programs(
                        channel.channel_id
                    )
                except MolotovApiError as err:
                    _LOGGER.debug(
                        "Now playing programs fetch failed for %s: %s",
                        channel.channel_id,
                        err,
                    )
                    return
                programs = _parse_remote_programs(raw, channel.channel_id)
                if programs:
                    self._set_cached_programs(channel.channel_id, programs)
                    channel.programs = programs

        await asyncio.gather(*(fetch_programs(channel) for channel in missing))

    def _browse_channels(self, data: EpgData) -> BrowseMedia:
        children = [
            BrowseMedia(
                title=channel.label,
                media_class=MediaClass.CHANNEL,
                media_content_id=f"{MEDIA_CHANNEL_PREFIX}:{channel.channel_id}",
                media_content_type=MEDIA_CHANNEL_PREFIX,
                can_play=False,
                can_expand=True,
                thumbnail=channel.poster,
            )
            for channel in data.channels
        ]
        return BrowseMedia(
            title="Channels",
            media_class=MediaClass.DIRECTORY,
            media_content_id=MEDIA_CHANNELS,
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            children=children,
        )

    async def _async_browse_recordings(self) -> BrowseMedia:
        assets = self._get_cached_assets(self._recording_cache)
        if assets is None:
            assets = await self._async_fetch_recordings()
            self._recording_cache = (dt_util.utcnow(), assets)
        return self._browse_assets(
            "Recordings", MEDIA_RECORDINGS, MEDIA_RECORDING_PREFIX, assets
        )

    async def _async_browse_search_home(self) -> BrowseMedia:
        """Browse search home with cached results or suggestions."""
        # Check if we have cached search results
        search_cache = self._get_search_cache()
        if search_cache:
            cached_at, query, results = search_cache
            if dt_util.utcnow() - cached_at < SEARCH_CACHE_TTL:
                browse = self._build_search_results_browse(
                    f"Search: {query}",
                    f"{MEDIA_SEARCH_PREFIX}:{query}",
                    results,
                    show_search=True,
                )
                # Insert the keyboard entry point
                browse.children.insert(0, BrowseMedia(
                    title="⌨️ Type search...",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                    media_content_type="directory",
                    can_play=False,
                    can_expand=True,
                ))
                return browse

        # No cached results - show empty state with keyboard
        children: list[BrowseAsset] = []
        # We don't fetch suggestions anymore to keep it clean

        # Add "Type search" button at the top
        browse = self._build_search_results_browse(
            "Search", MEDIA_SEARCH, children, show_search=True
        )
        
        # Insert the keyboard entry point
        browse.children.insert(0, BrowseMedia(
            title="⌨️ Type search...",
            media_class=MediaClass.DIRECTORY,
            media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
            media_content_type="directory",
            can_play=False,
            can_expand=True,
        ))
        
        return browse

    async def _async_browse_search_input(self, buffer: str) -> BrowseMedia:
        """Browse search input keyboard."""
        children: list[BrowseMedia] = []
        
        # Action buttons - Always present to maintain layout
        if buffer:
            children.append(BrowseMedia(
                title=f"🔎 Search for '{buffer}'",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_PREFIX}:{buffer}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ))
            children.append(BrowseMedia(
                title="⌫ Backspace",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer[:-1]}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ))
            children.append(BrowseMedia(
                title="🗑 Clear",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ))
        else:
            children.append(BrowseMedia(
                title="🔎 Type to search...",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ))
            children.append(BrowseMedia(
                title="⌫ Backspace",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ))
            children.append(BrowseMedia(
                title="🗑 Clear",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ))

        # Space is always useful
        children.append(BrowseMedia(
            title="␣ Space",
            media_class=MediaClass.DIRECTORY,
            media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer} ",
            media_content_type="directory",
            can_play=False,
            can_expand=True,
        ))

        # Keys A-Z
        import string
        for char in string.ascii_uppercase:
            children.append(BrowseMedia(
                title=char,
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer}{char}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ))
            
        # Keys 0-9
        for char in string.digits:
            children.append(BrowseMedia(
                title=char,
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer}{char}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ))

        return BrowseMedia(
            title=f"Search: {buffer}█" if buffer else "Search Keyboard",
            media_class=MediaClass.DIRECTORY,
            media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer}",
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            children=children,
        )

    def _build_search_results_browse(
        self,
        title: str,
        content_id: str,
        assets: list[BrowseAsset],
        show_search: bool = False,
    ) -> BrowseMedia:
        """Build a BrowseMedia with search results."""
        children: list[BrowseMedia] = []

        for asset in assets:
            display_title = asset.title
            if asset.episode_title:
                display_title = f"{asset.title} - {asset.episode_title}"

            # Check if this is a program container (Series/Show) that should be browsed
            if (
                (asset.asset_type in ("program", "serie") or (asset.asset_type == "vod" and not asset.episode_id))
                and asset.program_id
                and asset.channel_id
                and not asset.is_live
            ):
                children.append(
                    BrowseMedia(
                        title=display_title,
                        media_class=MediaClass.TV_SHOW,
                        media_content_id=f"{MEDIA_PROGRAM_EPISODES_PREFIX}:{asset.channel_id}:{asset.program_id}:{asset.title}",
                        media_content_type="directory",
                        can_play=False,
                        can_expand=True,
                        thumbnail=asset.thumbnail or asset.poster,
                    )
                )
            else:
                # Playable item (Movie, Episode, Live)
                payload_data = {
                    "url": asset.asset_url,
                    "title": asset.title,
                    "thumb": asset.thumbnail or asset.poster,
                    "live": asset.is_live,
                }
                if asset.program_id:
                    payload_data["program_id"] = asset.program_id
                if asset.channel_id:
                    payload_data["channel_id"] = asset.channel_id

                payload = _encode_asset_payload(payload_data)
                children.append(
                    BrowseMedia(
                        title=display_title,
                        media_class=MediaClass.VIDEO,
                        media_content_id=f"{MEDIA_SEARCH_RESULT_PREFIX}:{payload}",
                        media_content_type=MEDIA_SEARCH_RESULT_PREFIX,
                        can_play=False,
                        can_expand=True,
                        thumbnail=asset.thumbnail or asset.poster,
                    )
                )

        if not children:
            children.append(
                BrowseMedia(
                    title="No results found",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=MEDIA_SEARCH,
                    media_content_type="directory",
                    can_play=False,
                    can_expand=False,
                )
            )

        browse = BrowseMedia(
            title=title,
            media_class=MediaClass.DIRECTORY,
            media_content_id=content_id,
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            children=children,
        )
        # Enable search box in the UI
        if show_search:
            browse.children_media_class = MediaClass.VIDEO
        return browse

    async def _async_browse_search_results(self, query: str) -> BrowseMedia:
        """Browse search results for a query."""
        if not query.strip():
            return await self._async_browse_search_home()

        # Check cache first
        search_cache = self._get_search_cache()
        if search_cache:
            cached_at, cached_query, cached_results = search_cache
            if (
                cached_query == query
                and dt_util.utcnow() - cached_at < SEARCH_CACHE_TTL
            ):
                return self._build_search_results_browse(
                    f"Search: {query}",
                    f"{MEDIA_SEARCH_PREFIX}:{query}",
                    cached_results,
                    show_search=True,
                )

        # Perform search
        try:
            data = await self._api.async_search(query)
            results = _extract_search_results(data, self._api)
            _LOGGER.debug("Search for '%s' returned %d results", query, len(results))
            # Cache results
            self._set_search_cache(query, results)
            return self._build_search_results_browse(
                f"Search: {query}",
                f"{MEDIA_SEARCH_PREFIX}:{query}",
                results,
                show_search=True,
            )
        except MolotovApiError as err:
            _LOGGER.warning("Search failed: %s", err)
            return BrowseMedia(
                title=f"Search: {query}",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_PREFIX}:{query}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
                children=[
                    BrowseMedia(
                        title=f"Search failed: {err}",
                        media_class=MediaClass.DIRECTORY,
                        media_content_id=MEDIA_SEARCH,
                        media_content_type="directory",
                        can_play=False,
                        can_expand=False,
                    )
                ],
            )

    async def _async_browse_replay_or_episodes(
        self, data: EpgData, media_content_id: str
    ) -> BrowseMedia:
        """Browse replay - show episodes if program_id available, else cast targets."""
        payload = _decode_asset_payload_from_media_id(media_content_id)

        _LOGGER.debug(
            "Replay/recording payload: %s",
            payload if payload else "None",
        )

        if payload:
            program_id = payload.get("program_id")
            channel_id = payload.get("channel_id")

            _LOGGER.debug(
                "Extracted program_id=%s, channel_id=%s from payload",
                program_id,
                channel_id,
            )

            if program_id and channel_id:
                # We have program info - show all episodes
                _LOGGER.debug(
                    "Fetching episodes for program_id=%s, channel_id=%s",
                    program_id,
                    channel_id,
                )
                return await self._async_browse_program_episodes_impl(
                    channel_id, program_id, payload.get("title"), payload.get("thumb")
                )
            else:
                _LOGGER.debug(
                    "Missing program info - program_id=%s, channel_id=%s, falling back to cast targets",
                    program_id,
                    channel_id,
                )

        # No program info - fall back to cast targets
        return await self._async_browse_cast_targets(data, media_content_id)

    async def _async_browse_program_episodes(
        self, media_content_id: str
    ) -> BrowseMedia:
        """Browse episodes for a program from encoded content ID."""
        # Format: program_episodes:channel_id:program_id:title
        parts = media_content_id.split(":", 3)
        if len(parts) < 3:
            raise HomeAssistantError("Invalid program episodes ID")

        channel_id = parts[1]
        program_id = parts[2]
        title = parts[3] if len(parts) > 3 else None

        return await self._async_browse_program_episodes_impl(
            channel_id, program_id, title, None
        )

    async def _async_browse_program_episodes_impl(
        self,
        channel_id: str,
        program_id: str,
        title: str | None,
        thumbnail: str | None,
    ) -> BrowseMedia:
        """Fetch and display all episodes for a program."""
        children: list[BrowseMedia] = []

        try:
            data = await self._api.async_get_program_details(channel_id, program_id)
            episodes = _extract_program_episodes(data, self._api, program_id)
            _LOGGER.debug(
                "Found %d episodes for program %s on channel %s",
                len(episodes),
                program_id,
                channel_id,
            )

            for episode in episodes:
                payload = _encode_asset_payload(
                    {
                        "url": episode.asset_url,
                        "title": episode.title,
                        "thumb": episode.thumbnail or episode.poster,
                        "live": episode.is_live,
                    }
                )
                ep_title = episode.title
                if episode.episode_title:
                    ep_title = f"{episode.episode_title}"
                if episode.start:
                    ep_title = f"{episode.start.strftime('%d/%m %H:%M')} - {ep_title}"

                children.append(
                    BrowseMedia(
                        title=ep_title,
                        media_class=MediaClass.VIDEO,
                        media_content_id=f"{MEDIA_EPISODE_PREFIX}:{payload}",
                        media_content_type=MEDIA_EPISODE_PREFIX,
                        can_play=False,
                        can_expand=True,
                        thumbnail=episode.thumbnail or episode.poster,
                    )
                )
        except MolotovApiError as err:
            _LOGGER.warning("Failed to fetch program episodes: %s", err)

        if not children:
            children.append(
                BrowseMedia(
                    title="No episodes available",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=MEDIA_ROOT,
                    media_content_type="directory",
                    can_play=False,
                    can_expand=False,
                )
            )

        display_title = title or "Episodes"
        return BrowseMedia(
            title=display_title,
            media_class=MediaClass.DIRECTORY,
            media_content_id=f"{MEDIA_PROGRAM_EPISODES_PREFIX}:{channel_id}:{program_id}",
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            children=children,
            thumbnail=thumbnail,
        )

    async def _async_browse_programs(
        self, data: EpgData, channel_id: str
    ) -> BrowseMedia:
        channel = _find_channel(data, channel_id)
        if channel is None:
            raise HomeAssistantError("Channel was not found in the EPG")

        programs = self._get_cached_programs(channel_id)
        if programs is None and not channel.programs:
            try:
                raw = await self._api.async_get_channel_programs(channel_id)
            except MolotovApiError as err:
                if channel.programs:
                    _LOGGER.warning(
                        "Failed to refresh programs for channel %s: %s",
                        channel_id,
                        err,
                    )
                    programs = channel.programs
                else:
                    raise HomeAssistantError(
                        "Failed to fetch channel programs"
                    ) from err
            else:
                programs = _parse_remote_programs(raw, channel_id)
                self._set_cached_programs(channel_id, programs)

        if programs is not None:
            channel.programs = programs

        return await self._async_browse_programs_with_replays(data, channel_id)

    async def _async_browse_programs_with_replays(
        self, data: EpgData, channel_id: str
    ) -> BrowseMedia:
        channel = _find_channel(data, channel_id)
        if channel is None:
            raise HomeAssistantError("Channel was not found in the EPG")

        _LOGGER.debug(
            "Browsing channel %s (%s), has %d programs in EPG",
            channel.label,
            channel_id,
            len(channel.programs),
        )

        now = dt_util.utcnow()
        children: list[BrowseMedia] = []
        if _find_current_program(channel, now) is None:
            children.append(
                BrowseMedia(
                    title=f"▶ Live - {channel.label}",
                    media_class=MediaClass.CHANNEL,
                    media_content_id=f"{MEDIA_LIVE_PREFIX}:{channel.channel_id}",
                    media_content_type=MEDIA_LIVE_PREFIX,
                    can_play=False,
                    can_expand=True,
                    thumbnail=channel.poster,
                )
            )

        # Add current/upcoming programs
        for program in channel.programs:
            start_ts = int(program.start.timestamp())
            end_ts = int(program.end.timestamp())

            # Determine program status
            if program.start <= now < program.end:
                status = "🔴 "  # Currently airing
            elif program.end <= now:
                status = "⏪ "  # Past (replay available)
            else:
                status = ""  # Future

            title = program.title
            if program.episode_title:
                title = f"{program.title} - {program.episode_title}"

            _LOGGER.debug(
                "Program: %s, start=%s, end=%s, now=%s, status=%s",
                title[:30],
                program.start.isoformat(),
                program.end.isoformat(),
                now.isoformat(),
                status.strip() or "future",
            )

            children.append(
                BrowseMedia(
                    title=f"{status}{title}",
                    media_class=MediaClass.TV_SHOW,
                    media_content_id=(
                        f"{MEDIA_PROGRAM_PREFIX}:{channel.channel_id}:{start_ts}:{end_ts}"
                    ),
                    media_content_type=MEDIA_PROGRAM_PREFIX,
                    can_play=False,
                    can_expand=True,
                    thumbnail=program.thumbnail or program.poster,
                )
            )

        # Fetch and add replays for this channel
        replays = await self._async_fetch_channel_replays(channel_id)
        if replays:
            # Add separator
            children.append(
                BrowseMedia(
                    title="━━━ Replays ━━━",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=f"separator:{channel_id}",
                    media_content_type="separator",
                    can_play=False,
                    can_expand=False,
                )
            )
            # Add replay items
            for asset in replays:
                payload_data = {
                    "url": asset.asset_url,
                    "title": asset.title,
                    "live": asset.is_live,
                }
                # Include program info for episode browsing
                if asset.program_id:
                    payload_data["program_id"] = asset.program_id
                if asset.channel_id:
                    payload_data["channel_id"] = asset.channel_id

                payload = _encode_asset_payload(payload_data)
                display_title = asset.title
                if asset.episode_title:
                    display_title = f"{asset.title} - {asset.episode_title}"
                children.append(
                    BrowseMedia(
                        title=display_title,
                        media_class=MediaClass.VIDEO,
                        media_content_id=f"{MEDIA_REPLAY_PREFIX}:{payload}",
                        media_content_type=MEDIA_REPLAY_PREFIX,
                        can_play=False,
                        can_expand=True,
                        thumbnail=asset.thumbnail or asset.poster,
                    )
                )

        return BrowseMedia(
            title=channel.label,
            media_class=MediaClass.CHANNEL,
            media_content_id=f"{MEDIA_CHANNEL_PREFIX}:{channel.channel_id}",
            media_content_type=MEDIA_CHANNEL_PREFIX,
            can_play=False,
            can_expand=True,
            thumbnail=channel.poster,
            children=children,
        )

    async def _async_fetch_channel_replays(self, channel_id: str) -> list[BrowseAsset]:
        """Fetch replays for a specific channel."""
        # First try the dedicated replay API endpoint
        try:
            data = await self._api.async_get_channel_replays(channel_id)
            assets = _extract_replay_assets(data, self._api, channel_id=channel_id)
            if assets:
                assets = [
                    asset
                    for asset in assets
                    if asset.channel_id == channel_id
                ]
            if assets:
                _LOGGER.debug(
                    "Found %d replays from replay API for channel %s",
                    len(assets),
                    channel_id,
                )
                return assets
        except MolotovApiError as err:
            _LOGGER.debug("Failed to fetch channel replays for %s: %s", channel_id, err)

        # Try to get past programs via API
        try:
            data = await self._api.async_get_channel_past_programs(channel_id)
            programs = _parse_past_programs_as_replays(data, channel_id, self._api)
            if programs:
                _LOGGER.debug(
                    "Found %d replays from past programs API for channel %s",
                    len(programs),
                    channel_id,
                )
                return programs
        except MolotovApiError as err:
            _LOGGER.debug(
                "Failed to fetch past programs for %s: %s", channel_id, err
            )

        # Fall back to using past programs from coordinator data
        epg_data = self.coordinator.data
        if epg_data is None:
            _LOGGER.debug("No EPG data available for channel %s replays", channel_id)
            return []

        channel = _find_channel(epg_data, channel_id)
        if channel is None:
            _LOGGER.debug("Channel %s not found in EPG data", channel_id)
            return []

        # Get past programs as replays (programs that ended in the last 7 days)
        now = dt_util.utcnow()
        replay_window = timedelta(days=7)
        replay_cutoff = now - replay_window

        _LOGGER.debug(
            "Checking %d programs in EPG for channel %s, looking for past programs",
            len(channel.programs),
            channel_id,
        )

        replays: list[BrowseAsset] = []
        for program in channel.programs:
            # Skip programs that haven't ended yet (these are live or upcoming)
            if program.end > now:
                _LOGGER.debug(
                    "Skipping future/live program: %s (ends %s)",
                    program.title[:30],
                    program.end.isoformat(),
                )
                continue
            # Skip programs older than replay window
            if program.start < replay_cutoff:
                _LOGGER.debug(
                    "Skipping old program: %s (started %s)",
                    program.title[:30],
                    program.start.isoformat(),
                )
                continue

            # Build replay URL with start_over
            asset_url = self._api.build_asset_url(
                "channel", channel_id, start_over=True
            )

            _LOGGER.debug(
                "Adding replay: %s (start=%s, end=%s)",
                program.title[:30],
                program.start.isoformat(),
                program.end.isoformat(),
            )

            replays.append(
                BrowseAsset(
                    title=program.title,
                    asset_url=asset_url,
                    is_live=False,
                    description=program.description,
                    episode_title=program.episode_title,
                    thumbnail=program.thumbnail,
                    poster=program.poster,
                    start=program.start,
                    end=program.end,
                )
            )

        _LOGGER.debug(
            "Found %d replays from EPG for channel %s", len(replays), channel_id
        )

        return replays

    def _browse_assets(
        self,
        title: str,
        content_id: str,
        prefix: str,
        assets: list[BrowseAsset],
    ) -> BrowseMedia:
        children: list[BrowseMedia] = []
        for asset in assets:
            payload_data = {
                "url": asset.asset_url,
                "title": asset.title,
                "thumb": asset.thumbnail or asset.poster,
                "live": asset.is_live,
            }
            # Include program info for replays so we can show all episodes
            if asset.program_id:
                payload_data["program_id"] = asset.program_id
            if asset.channel_id:
                payload_data["channel_id"] = asset.channel_id

            payload = _encode_asset_payload(payload_data)
            item_title = asset.title
            if asset.episode_title:
                item_title = f"{asset.title} - {asset.episode_title}"
            children.append(
                BrowseMedia(
                    title=item_title,
                    media_class=MediaClass.VIDEO,
                    media_content_id=f"{prefix}:{payload}",
                    media_content_type=prefix,
                    can_play=False,
                    can_expand=True,
                    thumbnail=asset.thumbnail or asset.poster,
                )
            )

        if not children:
            children.append(
                BrowseMedia(
                    title=f"No {title.lower()} available",
                    media_class=MediaClass.DIRECTORY,
                    media_content_id=MEDIA_ROOT,
                    media_content_type="directory",
                    can_play=False,
                    can_expand=False,
                )
            )

        return BrowseMedia(
            title=title,
            media_class=MediaClass.DIRECTORY,
            media_content_id=content_id,
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            children=children,
        )

    async def _async_browse_cast_targets(
        self, data: EpgData, base_media_id: str
    ) -> BrowseMedia:
        title = "Select Chromecast"
        thumbnail = None
        if base_media_id.startswith(f"{MEDIA_PROGRAM_PREFIX}:"):
            parts = base_media_id.split(":")
            if len(parts) >= 4:
                channel_id = parts[1]
                start_ts = int(parts[2])
                program = _find_program(data, channel_id, start_ts)
                if program:
                    title = program.title
                    if program.episode_title:
                        title = f"{title} - {program.episode_title}"
                    thumbnail = program.thumbnail or program.poster
        elif base_media_id.startswith(f"{MEDIA_LIVE_PREFIX}:"):
            channel_id = base_media_id.split(":", 1)[1]
            channel = _find_channel(data, channel_id)
            if channel:
                title = f"Live - {channel.label}"
                thumbnail = channel.poster
        elif base_media_id.startswith(
            (f"{MEDIA_REPLAY_PREFIX}:", f"{MEDIA_RECORDING_PREFIX}:", f"{MEDIA_SEARCH_RESULT_PREFIX}:", f"{MEDIA_EPISODE_PREFIX}:")
        ):
            payload = _decode_asset_payload_from_media_id(base_media_id)
            if payload:
                title = payload.get("title") or title
                thumbnail = payload.get("thumb")

        targets = await self._async_get_cast_targets()
        if not targets:
            targets = []

        children: list[BrowseMedia] = []

        # Add local play option
        children.append(
            BrowseMedia(
                title="Play on this device",
                media_class=MediaClass.VIDEO,
                media_content_id=f"play_local:{base_media_id}",
                media_content_type="video",
                can_play=True,
                can_expand=False,
            )
        )

        native_options = []
        custom_options = []

        for target in targets:
            name = self._cast_target_name(target)
            encoded_target = self._encode_cast_target(target)
            
            if CUSTOM_RECEIVER_APP_ID:
                # Add Native (Molotov) option
                native_options.append(
                    BrowseMedia(
                        title=f"Cast to {name} (Molotov)",
                        media_class=MediaClass.VIDEO,
                        media_content_id=(
                            f"{MEDIA_CAST_PREFIX}:{encoded_target}"
                            f":native:{base_media_id}"
                        ),
                        media_content_type=MEDIA_CAST_PREFIX,
                        can_play=True,
                        can_expand=False,
                    )
                )
                # Add Custom Receiver option (Arnor)
                custom_options.append(
                    BrowseMedia(
                        title=f"Cast to {name} (Arnor)",
                        media_class=MediaClass.VIDEO,
                        media_content_id=(
                            f"{MEDIA_CAST_PREFIX}:{encoded_target}"
                            f":custom:{base_media_id}"
                        ),
                        media_content_type=MEDIA_CAST_PREFIX,
                        can_play=True,
                        can_expand=False,
                    )
                )
            else:
                # Default behavior (Native only)
                native_options.append(
                    BrowseMedia(
                        title=f"Cast to {name}",
                        media_class=MediaClass.VIDEO,
                        media_content_id=(
                            f"{MEDIA_CAST_PREFIX}:{encoded_target}"
                            f":{base_media_id}"
                        ),
                        media_content_type=MEDIA_CAST_PREFIX,
                        can_play=True,
                        can_expand=False,
                    )
                )

        if native_options:
            children.append(
                BrowseMedia(
                    title="Official Receiver",
                    media_class=MediaClass.CHANNEL,
                    media_content_id="separator:native",
                    media_content_type="separator",
                    can_play=False,
                    can_expand=False,
                )
            )
            children.extend(native_options)

        if custom_options:
            children.append(
                BrowseMedia(
                    title="Arnor Receiver",
                    media_class=MediaClass.CHANNEL,
                    media_content_id="separator:custom",
                    media_content_type="separator",
                    can_play=False,
                    can_expand=False,
                )
            )
            children.extend(custom_options)

        if len(children) == 1: # Only local play available, no cast targets
            # We still show the list so user can click "Play on this device"
            pass

        return BrowseMedia(
            title=title,
            media_class=MediaClass.DIRECTORY,
            media_content_id=base_media_id,
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            thumbnail=thumbnail,
            children=children,
        )

    @property
    def sound_mode(self) -> str | None:
        """Return the current sound mode (track)."""
        if self._current_track_id is None:
            return None
        for name, info in self._tracks.items():
            if info["id"] == self._current_track_id:
                return name
        return None

    @property
    def sound_mode_list(self) -> list[str] | None:
        """Return available sound modes."""
        return list(self._tracks.keys()) if self._tracks else None

    async def async_select_sound_mode(self, sound_mode: str) -> None:
        """Select sound mode."""
        info = self._tracks.get(sound_mode)
        if info is not None and self._active_cast_target:
            await async_cast_select_track(self.hass, self._active_cast_target, info["id"])

    def _on_cast_status(self, status: Any) -> None:
        """Handle cast status updates."""
        if not status:
            return
        
        # Parse tracks if available in status
        raw_tracks = getattr(status, "tracks", [])
        active_ids = getattr(status, "active_track_ids", [])
        
        if raw_tracks:
            new_tracks = {}
            for track in raw_tracks:
                # track is usually a dict or object
                t_id = getattr(track, "trackId", track.get("trackId"))
                t_type = getattr(track, "type", track.get("type"))
                t_lang = getattr(track, "language", track.get("language"))
                t_label = getattr(track, "name", track.get("name")) or t_lang
                
                info = {"id": t_id, "lang": t_lang, "type": t_type}
                
                if t_type == "AUDIO":
                    name = f"Audio: {t_label}"
                    if name in new_tracks:
                        name = f"{name} ({t_id})"
                    new_tracks[name] = info
                elif t_type == "TEXT":
                    name = f"Sub: {t_label}"
                    if name in new_tracks:
                        name = f"{name} ({t_id})"
                    new_tracks[name] = info
            
            self._tracks = new_tracks
            
            # Update current track
            if active_ids:
                # Prioritize audio
                for t_name, info in new_tracks.items():
                    if info["id"] in active_ids and "Audio" in t_name:
                        self._current_track_id = info["id"]
                        break
                
            self.schedule_update_ha_state()

    async def _async_cast_media(
        self, 
        media_id: str, 
        cast_target_override: str | None,
        receiver_type: str = "native"
    ) -> None:
        await self._api.async_ensure_logged_in()

        cast_target = cast_target_override
        if not cast_target:
            targets = await self._async_get_cast_targets()
            if len(targets) == 1:
                cast_target = targets[0]
        resolved_target = self._resolve_cast_target(cast_target)
        if not resolved_target:
            if cast_target:
                raise HomeAssistantError(
                    "Chromecast host was not available for the selected target"
                )
            raise HomeAssistantError(
                "No Chromecast target configured in Molotov TV options"
            )

        asset_url, title, is_live = self._build_cast_request(media_id)
        custom_data = self._build_cast_custom_data(asset_url)
        
        # Determine App ID and logic based on receiver_type
        use_custom = (receiver_type == "custom") and (CUSTOM_RECEIVER_APP_ID is not None)
        
        if use_custom:
            _LOGGER.debug("Using custom receiver: %s", CUSTOM_RECEIVER_APP_ID)
            app_id = CUSTOM_RECEIVER_APP_ID
            
            # Resolve stream locally for custom receiver
            try:
                _LOGGER.debug("Resolving asset stream locally for custom receiver...")
                asset_data = await self._api.async_get_asset_stream(asset_url)
                
                stream = asset_data.get("stream", {})
                stream_url = stream.get("url")
                if not stream_url:
                    raise MolotovApiError("No stream URL found in asset response")
                
                # Update asset_url to be the actual stream for the custom receiver
                # But wait, async_cast_media passes asset_url as contentId. 
                # For custom receiver, contentId MUST be the stream URL.
                asset_url = stream_url
                
                # Extract DRM info
                drm = asset_data.get("drm", {})
                license_url = drm.get("license_url")
                token = drm.get("token")
                
                if license_url and token:
                    custom_data["license_url"] = license_url
                    custom_data["drm_token"] = token
                    custom_data["stream_url"] = stream_url
                    
                    # Pass extra DRM fields for headers
                    custom_data["merchant"] = drm.get("merchant")
                    custom_data["user_id"] = drm.get("user_id")
                    custom_data["session_id"] = drm.get("session_id")
                    custom_data["asset_id"] = drm.get("asset_id")
                    
                    _LOGGER.debug("Added DRM info to custom_data: %s", list(custom_data.keys()))

                # Extract preferred track info if available (to mimic official app)
                config = asset_data.get("config", {})
                selected_track = config.get("selected_track", {})
                if selected_track:
                    custom_data["selected_track"] = selected_track
                    _LOGGER.debug("Added selected_track preference: %s", selected_track)
                
                # Update content type if available
                video_format = stream.get("video_format")
                if video_format == "DASH":
                    custom_data["content_type"] = "application/dash+xml"
                elif video_format == "HLS":
                    custom_data["content_type"] = "application/x-mpegurl"
                    
            except Exception as err:
                _LOGGER.error("Failed to resolve stream for custom receiver: %s", err)
                raise HomeAssistantError(f"Failed to resolve stream: {err}") from err
        else:
            # Standard official receiver logic
            app_id = self._api.session_state.cast_app_id
            if not app_id:
                raise HomeAssistantError("Molotov cast app id is not available")

        content_type = custom_data.get("content_type") or self._api.stream_content_type()
        
        _LOGGER.debug(
            "Casting to %s: app_id=%s, asset_url=%s, content_type=%s, title=%s, is_live=%s",
            resolved_target, app_id, asset_url[:100], content_type, title, is_live,
        )
        _LOGGER.debug("Cast custom_data keys: %s", list(custom_data.keys()))

        try:
            await async_cast_media(
                self.hass,
                cast_target=resolved_target,
                app_id=app_id,
                asset_url=asset_url,
                content_type=content_type,
                custom_data=custom_data,
                title=title,
                is_live=is_live,
            )
            # Track the active cast target for remote control
            self._active_cast_target = resolved_target
            self._active_cast_entity = self._find_cast_entity(resolved_target)
            self._attr_state = STATE_PLAYING
            
            # Register status listener for tracks
            await async_cast_register_listener(self.hass, resolved_target, self._on_cast_status)
            
            self.async_write_ha_state()
            _LOGGER.debug(
                "Cast started, tracking entity: %s (target: %s)",
                self._active_cast_entity, resolved_target
            )
        except MolotovCastError as err:
            raise HomeAssistantError(str(err)) from err

    def _find_cast_entity(self, host: str) -> str | None:
        """Find the media_player entity ID for a Chromecast host."""
        _LOGGER.debug("Looking for cast entity with host %s", host)

        # First, try to find by checking entity states directly
        for entity_id in self.hass.states.async_entity_ids("media_player"):
            state = self.hass.states.get(entity_id)
            if not state:
                continue

            # Check various attributes where the host might be stored
            attrs = state.attributes
            entity_host = (
                attrs.get("host")
                or attrs.get("address")
                or attrs.get("ip_address")
                or attrs.get("ip")
            )

            if entity_host == host:
                _LOGGER.debug("Found cast entity %s by host attribute", entity_id)
                return entity_id

            # Check if it's a cast entity and try to match by resolving
            if "cast" in entity_id or attrs.get("app_id"):
                resolved = self._resolve_cast_target(entity_id)
                _LOGGER.debug(
                    "Checking entity %s: resolved=%s, target=%s",
                    entity_id, resolved, host
                )
                if resolved == host:
                    _LOGGER.debug("Found cast entity %s by resolution", entity_id)
                    return entity_id

        # Fallback: check entity registry
        registry = er.async_get(self.hass)
        if hasattr(er, "async_entries_for_domain"):
            entries = er.async_entries_for_domain(registry, "media_player")
        else:
            entries = [
                entry
                for entry in registry.entities.values()
                if entry.domain == "media_player"
            ]

        for entry in entries:
            if entry.platform != "cast":
                continue
            if entry.disabled_by is not None:
                continue
            resolved = self._resolve_cast_target(entry.entity_id)
            _LOGGER.debug(
                "Registry check: entity=%s, resolved=%s, target=%s",
                entry.entity_id, resolved, host
            )
            if resolved == host:
                _LOGGER.debug("Found cast entity %s via registry", entry.entity_id)
                return entry.entity_id

        _LOGGER.warning("No cast entity found for host %s", host)
        return None

    async def _async_call_cast_service(self, service: str, **kwargs: Any) -> None:
        """Call a media_player service on the active cast entity."""
        _LOGGER.debug(
            "Control request: service=%s, active_entity=%s, active_target=%s",
            service, self._active_cast_entity, self._active_cast_target
        )

        if not self._active_cast_entity:
            # Try to find entity again using stored target
            if self._active_cast_target:
                self._active_cast_entity = self._find_cast_entity(self._active_cast_target)
                _LOGGER.debug("Re-found cast entity: %s", self._active_cast_entity)

            if not self._active_cast_entity:
                _LOGGER.warning(
                    "No active cast entity to control (target=%s)",
                    self._active_cast_target
                )
                return

        state = self.hass.states.get(self._active_cast_entity)
        _LOGGER.debug(
            "Cast entity state: %s (state=%s)",
            self._active_cast_entity,
            state.state if state else "None"
        )

        if not state or state.state == "unavailable":
            _LOGGER.warning("Cast entity %s is unavailable", self._active_cast_entity)
            self._active_cast_entity = None
            self._active_cast_target = None
            self._attr_state = STATE_IDLE
            self.async_write_ha_state()
            return

        service_data = {ATTR_ENTITY_ID: self._active_cast_entity, **kwargs}
        _LOGGER.debug("Calling media_player.%s with data: %s", service, service_data)
        try:
            await self.hass.services.async_call("media_player", service, service_data)
            _LOGGER.debug("Service call completed successfully")
        except Exception as err:
            _LOGGER.error("Service call failed: %s", err)

    async def async_media_play(self) -> None:
        """Send play command to active cast."""
        if self._active_cast_target:
            await async_cast_play(self.hass, self._active_cast_target)
            self._attr_state = STATE_PLAYING
            self.async_write_ha_state()
        elif self._current_stream:
            self._attr_state = STATE_PLAYING
            self.async_write_ha_state()

    async def async_media_pause(self) -> None:
        """Send pause command to active cast."""
        if self._active_cast_target:
            await async_cast_pause(self.hass, self._active_cast_target)
            self._attr_state = STATE_PAUSED
            self.async_write_ha_state()
        elif self._current_stream:
            self._attr_state = STATE_PAUSED
            self.async_write_ha_state()

    async def async_media_stop(self) -> None:
        """Send stop command to active cast."""
        if self._active_cast_target:
            await async_cast_stop(self.hass, self._active_cast_target)
        self._active_cast_entity = None
        self._active_cast_target = None
        self._current_stream = None
        self._attr_state = STATE_IDLE
        self.async_write_ha_state()

    async def async_media_next_track(self) -> None:
        """Skip forward 30 seconds."""
        if self._active_cast_target:
            await async_cast_skip_forward(self.hass, self._active_cast_target, 30)

    async def async_media_previous_track(self) -> None:
        """Skip back 10 seconds."""
        if self._active_cast_target:
            await async_cast_skip_back(self.hass, self._active_cast_target, 10)

    async def async_media_seek(self, position: float) -> None:
        """Send seek command to active cast."""
        if self._active_cast_target:
            await async_cast_seek(self.hass, self._active_cast_target, position)

    async def async_set_volume_level(self, volume: float) -> None:
        """Set volume level on active cast."""
        if self._active_cast_target:
            await async_cast_volume(self.hass, self._active_cast_target, volume)

    async def async_volume_up(self) -> None:
        """Turn volume up on active cast."""
        if self._active_cast_target:
            await async_cast_volume_up(self.hass, self._active_cast_target)

    async def async_volume_down(self) -> None:
        """Turn volume down on active cast."""
        if self._active_cast_target:
            await async_cast_volume_down(self.hass, self._active_cast_target)

    async def async_mute_volume(self, mute: bool) -> None:
        """Mute/unmute active cast."""
        if self._active_cast_target:
            await async_cast_mute(self.hass, self._active_cast_target, mute)

    async def async_turn_off(self) -> None:
        """Turn off (stop) the active cast."""
        await self.async_media_stop()

    def _build_cast_request(self, media_id: str) -> tuple[str, str | None, bool]:
        now = dt_util.utcnow()
        if media_id.startswith(f"{MEDIA_PROGRAM_PREFIX}:"):
            parts = media_id.split(":")
            if len(parts) != 4:
                raise HomeAssistantError("Invalid program identifier")
            channel_id = parts[1]
            start_ts = dt_util.utc_from_timestamp(int(parts[2]))
            end_ts = dt_util.utc_from_timestamp(int(parts[3]))
            if start_ts > now:
                raise HomeAssistantError("Program has not started yet")
            if end_ts < now:
                raise HomeAssistantError("Program has already ended")

            program = _find_program(
                self.coordinator.data,
                channel_id,
                int(start_ts.timestamp()),
            )
            title = program.title if program else None
            start_over = start_ts < now <= end_ts
            asset_url = self._api.build_asset_url(
                "channel", channel_id, start_over=start_over
            )
            return asset_url, title, True

        if media_id.startswith(f"{MEDIA_LIVE_PREFIX}:"):
            channel_id = media_id.split(":", 1)[1]
            channel = _find_channel(self.coordinator.data, channel_id)
            title = channel.label if channel else None
            asset_url = self._api.build_asset_url("channel", channel_id)
            return asset_url, title, True

        if media_id.startswith(f"{MEDIA_REPLAY_PREFIX}:") or media_id.startswith(
            f"{MEDIA_RECORDING_PREFIX}:"
        ) or media_id.startswith(f"{MEDIA_SEARCH_RESULT_PREFIX}:") or media_id.startswith(
            f"{MEDIA_EPISODE_PREFIX}:"
        ):
            payload = _decode_asset_payload_from_media_id(media_id)
            if not payload:
                raise HomeAssistantError("Invalid replay, recording, episode, or search result identifier")
            asset_url = payload.get("url")
            if not isinstance(asset_url, str) or not asset_url:
                raise HomeAssistantError("Asset URL is missing")
            title = payload.get("title")
            is_live = bool(payload.get("live", False))
            return asset_url, title, is_live

        if media_id.startswith(f"{MEDIA_CHANNEL_PREFIX}:"):
            channel_id = media_id.split(":", 1)[1]
            channel = _find_channel(self.coordinator.data, channel_id)
            title = channel.label if channel else None
            asset_url = self._api.build_asset_url("channel", channel_id)
            return asset_url, title, True

        raise HomeAssistantError("Unsupported media identifier")

    def _build_cast_custom_data(self, asset_url: str) -> dict[str, Any]:
        session = self._api.session_state
        if not session.access_token or not session.refresh_token:
            raise HomeAssistantError("Molotov session tokens are not available")

        return {
            "version": 7,
            "asset_data": {"url": asset_url},
            "play_ads": False,
            "molotov_agent": MOLOTOV_AGENT,
            "refresh_token": session.refresh_token,
            "cast_connect": {
                "remoteAccessToken": session.access_token,
                "remote_access_token": session.access_token,
            },
        }

    def _get_cached_programs(self, channel_id: str) -> list[EpgProgram] | None:
        cached = self._program_cache.get(channel_id)
        if not cached:
            return None
        fetched_at, programs = cached
        if dt_util.utcnow() - fetched_at > PROGRAM_CACHE_TTL:
            self._program_cache.pop(channel_id, None)
            return None
        return programs

    def _set_cached_programs(self, channel_id: str, programs: list[EpgProgram]) -> None:
        """Cache programs for a channel, enforcing size limit."""
        now = dt_util.utcnow()
        # Evict expired entries first
        expired = [
            cid for cid, (fetched_at, _) in self._program_cache.items()
            if now - fetched_at > PROGRAM_CACHE_TTL
        ]
        for cid in expired:
            self._program_cache.pop(cid, None)
        # If still over limit, remove oldest entries
        while len(self._program_cache) >= MAX_PROGRAM_CACHE_SIZE:
            oldest_id = min(
                self._program_cache,
                key=lambda k: self._program_cache[k][0]
            )
            self._program_cache.pop(oldest_id, None)
        self._program_cache[channel_id] = (now, programs)

    def _get_cached_assets(
        self, cached: tuple[datetime, list[BrowseAsset]] | None
    ) -> list[BrowseAsset] | None:
        if not cached:
            return None
        fetched_at, assets = cached
        if dt_util.utcnow() - fetched_at > ASSET_CACHE_TTL:
            return None
        return assets

    async def _async_fetch_recordings(self) -> list[BrowseAsset]:
        assets: list[BrowseAsset] = []
        seen_urls: set[str] = set()

        # Get all recordings from bookmarks API
        try:
            all_sections = await self._api.async_get_all_recordings()
            _LOGGER.debug("Got %d sections from recordings API", len(all_sections))
            for section in all_sections:
                section_assets = _extract_recording_assets(
                    {"sections": [section]}, self._api
                )
                for asset in section_assets:
                    if asset.asset_url not in seen_urls:
                        seen_urls.add(asset.asset_url)
                        assets.append(asset)
            _LOGGER.debug("Found %d recordings from bookmarks API", len(assets))
        except MolotovApiError as err:
            _LOGGER.debug("Failed to fetch all recordings: %s", err)

        # Also try home sections as fallback
        if not assets:
            _LOGGER.debug("No recordings from bookmarks, trying home sections")
            try:
                data = await self._api.async_get_home_sections()
                home_assets = _extract_recording_assets(data, self._api)
                for asset in home_assets:
                    if asset.asset_url not in seen_urls:
                        seen_urls.add(asset.asset_url)
                        assets.append(asset)
                _LOGGER.debug("Found %d recordings from home sections", len(assets))
            except MolotovApiError as err:
                _LOGGER.warning("Failed to fetch recordings from home: %s", err)

        _LOGGER.debug("Found %d total recordings", len(assets))
        return _sort_assets(assets)

    async def _async_get_cast_targets(self) -> list[str]:
        targets: list[str] = []

        # First get zeroconf discovered targets - these are actually on the network
        discovered_targets = await self._async_discover_cast_targets()
        _LOGGER.debug("Cast targets from zeroconf discovery: %s", discovered_targets)

        # Build a set of discovered IPs/hosts for validation
        discovered_hosts: set[str] = set()
        for target in discovered_targets:
            _, host = _split_manual_target(target)
            if host:
                discovered_hosts.add(host)

        # Only include entity registry targets if they match a discovered host
        registry_targets = self._discover_cast_targets()
        _LOGGER.debug("Cast targets from entity registry: %s", registry_targets)
        for target in registry_targets:
            resolved = self._resolve_cast_target(target)
            if resolved and resolved in discovered_hosts:
                if target not in targets:
                    targets.append(target)
                    _LOGGER.debug("Including registry target %s (host %s is on network)", target, resolved)
            else:
                _LOGGER.debug("Skipping registry target %s (host %s not discovered)", target, resolved)

        # Add discovered targets
        for target in discovered_targets:
            if target not in targets:
                targets.append(target)

        raw_targets = self._entry.options.get(CONF_CAST_TARGETS, [])
        if isinstance(raw_targets, str):
            raw_targets = [raw_targets]
        _LOGGER.debug("Cast targets from CONF_CAST_TARGETS option: %s", raw_targets)
        if isinstance(raw_targets, list):
            for item in raw_targets:
                if isinstance(item, str) and item not in targets:
                    targets.append(item)

        legacy = self._entry.options.get(CONF_CAST_TARGET)
        _LOGGER.debug("Cast target from legacy CONF_CAST_TARGET option: %s", legacy)
        if isinstance(legacy, str) and legacy and legacy not in targets:
            targets.append(legacy)

        manual_targets = self._manual_cast_targets()
        _LOGGER.debug("Cast targets from manual CONF_CAST_HOSTS: %s", manual_targets)
        for target in manual_targets:
            if target not in targets:
                targets.append(target)

        _LOGGER.debug("Final combined cast targets: %s", targets)
        return targets

    def _manual_cast_targets(self) -> list[str]:
        raw_hosts = self._entry.options.get(CONF_CAST_HOSTS)
        return _parse_manual_targets(raw_hosts)

    async def _async_discover_cast_targets(self) -> list[str]:
        cached = self._cast_discovery_cache
        if cached:
            fetched_at, targets = cached
            if dt_util.utcnow() - fetched_at < CAST_DISCOVERY_TTL:
                return targets

        try:
            zconf = await async_get_instance(self.hass)
        except Exception as err:
            _LOGGER.debug("Failed to get Zeroconf instance: %s", err)
            return []

        try:
            targets = await self.hass.async_add_executor_job(
                _discover_cast_targets_blocking, zconf
            )
        except Exception as err:
            _LOGGER.debug("Chromecast discovery failed: %s", err)
            return []

        self._cast_discovery_cache = (dt_util.utcnow(), targets)
        return targets

    def _discover_cast_targets(self) -> list[str]:
        registry = er.async_get(self.hass)
        if hasattr(er, "async_entries_for_domain"):
            entries = er.async_entries_for_domain(registry, "media_player")
        else:
            entries = [
                entry
                for entry in registry.entities.values()
                if entry.domain == "media_player"
            ]
        targets: list[str] = []
        for entry in entries:
            if entry.platform != "cast":
                continue
            if entry.disabled_by is not None:
                continue
            if entry.hidden_by is not None:
                continue
            state = self.hass.states.get(entry.entity_id)
            if not state:
                continue
            # Filter out unavailable Chromecasts
            if state.state in ("unavailable", "unknown"):
                _LOGGER.debug(
                    "Skipping unavailable cast entity: %s (state=%s)",
                    entry.entity_id, state.state,
                )
                continue
            targets.append(entry.entity_id)
        return targets

    def _encode_cast_target(self, cast_target: str) -> str:
        return quote(cast_target, safe="")

    def _decode_cast_target(self, cast_target: str) -> str:
        return unquote(cast_target)

    def _cast_target_name(self, cast_target: str) -> str:
        if cast_target.startswith("media_player."):
            state = self.hass.states.get(cast_target)
            if state:
                return state.attributes.get("friendly_name") or state.name
        alias, host = _split_manual_target(cast_target)
        return alias or host

    def _resolve_cast_target(self, cast_target: str | None) -> str | None:
        if not cast_target:
            return None
        alias, host = _split_manual_target(cast_target)
        if host and host != cast_target:
            return host
        if not cast_target.startswith("media_player."):
            matched = self._match_cast_entity_id(cast_target)
            if matched:
                cast_target = matched
            else:
                return cast_target
        state = self.hass.states.get(cast_target)
        if not state:
            return None
        for key in ("host", "address", "ip_address", "ip"):
            value = state.attributes.get(key)
            if isinstance(value, str) and value:
                return value
        hosts = state.attributes.get("hosts")
        if isinstance(hosts, (list, tuple)):
            for value in hosts:
                if isinstance(value, str) and value:
                    return value
        device_info = state.attributes.get("device_info")
        host_from_info = _extract_host_from_device_info(device_info)
        if host_from_info:
            return host_from_info
        registry = er.async_get(self.hass)
        registry_entry = registry.async_get(cast_target)
        if registry_entry and registry_entry.config_entry_id:
            config_entry = self.hass.config_entries.async_get_entry(
                registry_entry.config_entry_id
            )
            if config_entry:
                for key in ("host", "address", "ip_address", "ip"):
                    value = config_entry.data.get(key)
                    if isinstance(value, str) and value:
                        return value
            if registry_entry and registry_entry.device_id:
                host = _extract_host_from_device_registry(self.hass, registry_entry.device_id)
                if host:
                    return host
        return None

    def _match_cast_entity_id(self, name: str) -> str | None:
        target = name.casefold()
        for entity_id in self._discover_cast_targets():
            state = self.hass.states.get(entity_id)
            if not state:
                continue
            if state.name.casefold() == target:
                return entity_id
            friendly = state.attributes.get("friendly_name")
            if isinstance(friendly, str) and friendly.casefold() == target:
                return entity_id
        return None


def _parse_manual_targets(raw_hosts: Any) -> list[str]:
    if raw_hosts is None:
        return []
    if isinstance(raw_hosts, list):
        raw_text = "\n".join(item for item in raw_hosts if isinstance(item, str))
    elif isinstance(raw_hosts, str):
        raw_text = raw_hosts
    else:
        return []

    entries: list[str] = []
    for line in raw_text.splitlines():
        for chunk in line.split(","):
            value = chunk.strip()
            if value:
                entries.append(value)
    return entries


def _split_manual_target(value: str) -> tuple[str | None, str]:
    trimmed = value.strip()
    for sep in ("=", "@"):
        if sep in trimmed:
            name, host = trimmed.split(sep, 1)
            name = name.strip()
            host = host.strip()
            if name and host:
                return name, host
    return None, trimmed


def _encode_asset_payload(payload: dict[str, Any]) -> str:
    raw = json.dumps(payload, separators=(",", ":"), ensure_ascii=True).encode("utf-8")
    encoded = base64.urlsafe_b64encode(raw).decode("ascii")
    return encoded.rstrip("=")


def _decode_asset_payload(encoded: str) -> dict[str, Any] | None:
    if not encoded:
        return None
    padding = "=" * (-len(encoded) % 4)
    try:
        raw = base64.urlsafe_b64decode(encoded + padding)
        data = json.loads(raw.decode("utf-8"))
    except Exception:
        return None
    if isinstance(data, dict):
        return data
    return None


def _decode_asset_payload_from_media_id(media_id: str) -> dict[str, Any] | None:
    parts = media_id.split(":", 1)
    if len(parts) != 2:
        return None
    return _decode_asset_payload(parts[1])


def _extract_sections(data: Any) -> list[dict[str, Any]]:
    if isinstance(data, list):
        return [item for item in data if isinstance(item, dict)]
    if not isinstance(data, dict):
        return []
    sections = data.get("sections")
    if isinstance(sections, list):
        return [item for item in sections if isinstance(item, dict)]
    catalog = data.get("catalog")
    if isinstance(catalog, list):
        return [item for item in catalog if isinstance(item, dict)]
    section = data.get("section")
    if isinstance(section, dict):
        return [section]
    items = data.get("items")
    if isinstance(items, list):
        return [data]
    nested = data.get("data")
    if isinstance(nested, (dict, list)):
        return _extract_sections(nested)
    return []


def _extract_item_payload(item: dict[str, Any]) -> dict[str, Any]:
    data = item.get("data")
    if isinstance(data, dict):
        return data
    return item


def _extract_item_actions(
    item: dict[str, Any], payload: dict[str, Any]
) -> dict[str, Any]:
    actions = payload.get("actions")
    if isinstance(actions, dict):
        return actions
    actions = item.get("actions")
    if isinstance(actions, dict):
        return actions
    return {}


def _parse_asset_reference_from_url(url: str | None) -> tuple[str, str, bool] | None:
    if not url:
        return None
    parsed = urlparse(url)
    if not parsed.query:
        return None
    params = parse_qs(parsed.query)
    asset_id = _first_query_value(params.get("id"))
    asset_type = _first_query_value(params.get("type"))
    if not asset_id or not asset_type:
        return None
    start_over = _coerce_bool(_first_query_value(params.get("start_over")))
    return asset_type, asset_id, start_over


def _parse_channel_id_from_url(url: str | None) -> str | None:
    if not url:
        return None
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    for key in ("channel_id", "channelId"):
        value = _first_query_value(params.get(key))
        if value:
            return value
    match = re.search(r"/channels/([^/]+)", parsed.path or "")
    if match:
        return match.group(1)
    return None


def _extract_channel_id_from_actions(actions: dict[str, Any]) -> str | None:
    for action in actions.values():
        if not isinstance(action, dict):
            continue
        channel_id = _parse_channel_id_from_url(action.get("url"))
        if channel_id:
            return channel_id
    return None


def _first_query_value(values: list[str] | None) -> str | None:
    if not values:
        return None
    value = values[0]
    if isinstance(value, str) and value:
        return value
    return None


def _coerce_bool(value: str | None) -> bool:
    if not value:
        return False
    if isinstance(value, str):
        return value.strip().lower() in ("1", "true", "yes", "y")
    return bool(value)


def _extract_asset_reference(item: dict[str, Any]) -> tuple[str, str, bool] | None:
    payload = _extract_item_payload(item)
    actions = _extract_item_actions(item, payload)

    # First try to get from play/cast action URLs
    for key in ("play", "play_start_over", "cast", "cast_start_over"):
        action = actions.get(key)
        if not isinstance(action, dict):
            continue
        ref = _parse_asset_reference_from_url(action.get("url"))
        if ref:
            return ref

    # Fall back to video object (for VOD and record items)
    video = payload.get("video")
    if isinstance(video, dict):
        video_type = video.get("type")
        video_id = video.get("id")
        if video_type and video_id:
            # VOD and record items support start_over
            start_over = video_type in ("vod", "record")
            return str(video_type), str(video_id), start_over

    # Log why we couldn't extract a reference
    _LOGGER.debug(
        "No asset reference found: title=%s, actions_keys=%s, video=%s",
        payload.get("title", "unknown"),
        list(actions.keys()) if actions else None,
        video if isinstance(video, dict) else type(video),
    )
    return None


def _parse_asset_item(
    item: dict[str, Any], api: MolotovApi
) -> BrowseAsset | None:
    payload = _extract_item_payload(item)
    actions = _extract_item_actions(item, payload)
    ref = _extract_asset_reference(item)

    # Only skip if there's no playback reference at all
    # Don't filter on is_available=False alone since items may still be playable
    # via start-over or other mechanisms
    if not ref:
        if payload.get("is_available") is False:
            _LOGGER.debug(
                "Skipping asset without playback ref (is_available=False): %s",
                payload.get("title")
            )
        return None
    asset_type, asset_id, start_over = ref
    asset_url = api.build_asset_url(asset_type, asset_id, start_over=start_over)

    title = (
        payload.get("title")
        or _format_value(payload.get("title_formatter"))
        or payload.get("name")
        or "Untitled"
    )
    episode_title = (
        payload.get("episodeTitle")
        or payload.get("episode_title")
        or payload.get("subtitle")
        or _format_value(payload.get("subtitle_formatter"))
        or _format_value(payload.get("subtitleFormatter"))
    )
    description = payload.get("description") or _format_value(
        payload.get("description_formatter")
    )

    thumbnail = _extract_item_image(payload)
    poster = _extract_item_image(payload, prefer_poster=True)
    if not thumbnail or not poster:
        channel_payload = payload.get("channel")
        if isinstance(channel_payload, dict):
            if not thumbnail:
                thumbnail = _extract_item_image(channel_payload)
            if not poster:
                poster = _extract_item_image(channel_payload, prefer_poster=True)

    video = payload.get("video")
    metadata = payload.get("metadata")
    program_id: str | None = None
    channel_id: str | None = None
    episode_id: str | None = None

    _LOGGER.debug(
        "Parsing asset - title=%s, has video=%s, video keys=%s",
        title[:30] if title else "untitled",
        video is not None,
        list(video.keys()) if isinstance(video, dict) else None,
    )

    # Parse availability window separately from broadcast times
    available_from: datetime | None = None
    available_until: datetime | None = None

    if isinstance(video, dict):
        start = _parse_timestamp(
            video.get("start_at") or video.get("start")
        )
        end = _parse_timestamp(
            video.get("end_at") or video.get("end")
        )
        available_from = _parse_timestamp(video.get("available_from"))
        available_until = _parse_timestamp(video.get("available_until"))
        # Extract IDs
        program_id = str(video.get("program_id")) if video.get("program_id") else None
        episode_id = str(video.get("episode_id")) if video.get("episode_id") else None
        channel_id = str(video.get("channel_id")) if video.get("channel_id") else None
        _LOGGER.debug(
            "Video object: type=%s, program_id=%s, episode_id=%s, channel_id=%s",
            video.get("type"),
            program_id,
            episode_id,
            channel_id,
        )
    else:
        start = _parse_timestamp(payload.get("start_at") or payload.get("start"))
        end = _parse_timestamp(payload.get("end_at") or payload.get("end"))
        available_from = _parse_timestamp(payload.get("available_from"))
        available_until = _parse_timestamp(payload.get("available_until"))

    # Try to get program/channel/episode id from metadata
    if isinstance(metadata, dict):
        if not program_id and metadata.get("program_id"):
            program_id = str(metadata.get("program_id"))
        if not episode_id and metadata.get("episode_id"):
            episode_id = str(metadata.get("episode_id"))
        if not channel_id:
            channel_id = (
                str(metadata.get("channel_id") or metadata.get("channelId"))
                if metadata.get("channel_id") or metadata.get("channelId")
                else None
            )

    # Try explicit channel_id fields before falling back to actions or channel payload
    if not channel_id:
        channel_id = (
            str(payload.get("channel_id") or payload.get("channelId"))
            if payload.get("channel_id") or payload.get("channelId")
            else None
        )

    if not channel_id:
        channel_id = _extract_channel_id_from_actions(actions)

    if not channel_id:
        channel_payload = payload.get("channel")
        if isinstance(channel_payload, dict) and channel_payload.get("id"):
            channel_id = str(channel_payload.get("id"))

    # If asset is a program/serie container, the asset_id IS the program_id
    if not program_id and asset_type in ("program", "serie"):
        program_id = asset_id

    if program_id or channel_id:
        _LOGGER.debug(
            "Parsed asset '%s': program_id=%s, episode_id=%s, channel_id=%s, type=%s",
            title[:30] if title else "untitled",
            program_id,
            episode_id,
            channel_id,
            asset_type,
        )

    return BrowseAsset(
        title=title,
        asset_url=asset_url,
        is_live=start is not None and end is not None and start <= dt_util.utcnow() < end,
        description=description,
        episode_title=episode_title,
        thumbnail=thumbnail,
        poster=poster,
        start=start,
        end=end,
        program_id=program_id,
        channel_id=channel_id,
        asset_type=asset_type,
        episode_id=episode_id,
        available_from=available_from,
        available_until=available_until,
    )


def _parse_past_programs_as_replays(
    data: dict[str, Any], channel_id: str, api: MolotovApi
) -> list[BrowseAsset]:
    """Parse past programs data into replay assets."""
    replays: list[BrowseAsset] = []
    now = dt_util.utcnow()
    replay_window = timedelta(days=7)
    replay_cutoff = now - replay_window

    # Try to extract programs from various response formats
    programs: list[dict[str, Any]] = []

    # Direct programs array
    if data.get("programs"):
        programs = data.get("programs", [])
        _LOGGER.debug("Found programs directly: %d", len(programs))

    # Items array
    if not programs and data.get("items"):
        programs = data.get("items", [])
        _LOGGER.debug("Found items directly: %d", len(programs))

    # Sections with items
    if not programs:
        sections = data.get("sections", [])
        _LOGGER.debug("Found %d sections", len(sections))
        for section in sections:
            if isinstance(section, dict):
                section_items = section.get("items", [])
                _LOGGER.debug(
                    "Section '%s' has %d items",
                    section.get("title", section.get("slug", "unknown")),
                    len(section_items),
                )
                programs.extend(section_items)

    _LOGGER.debug("Parsing %d programs for replays", len(programs))

    # Log first program structure for debugging
    if programs:
        first = programs[0]
        _LOGGER.debug(
            "First program keys: %s",
            list(first.keys()) if isinstance(first, dict) else type(first),
        )
        if isinstance(first, dict):
            # Check for nested data
            if first.get("data"):
                _LOGGER.debug("First program has 'data' key with: %s", list(first["data"].keys()))
            if first.get("video"):
                video = first["video"]
                _LOGGER.debug("First program has 'video' key with: %s", list(video.keys()))
                _LOGGER.debug(
                    "First program video times: start_at=%s, end_at=%s, available_from=%s, available_until=%s",
                    video.get("start_at"),
                    video.get("end_at"),
                    video.get("available_from"),
                    video.get("available_until"),
                )
            _LOGGER.debug("First program title: %s", first.get("title", "no title"))

    parsed_count = 0
    skipped_no_time = 0
    skipped_future = 0
    skipped_not_available = 0

    for program in programs:
        if not isinstance(program, dict):
            continue

        # Extract nested data if present
        payload = program.get("data", program)
        video = payload.get("video", {})
        if not isinstance(video, dict):
            video = {}

        metadata = payload.get("metadata")
        raw_channel_id = (
            video.get("channel_id")
            or payload.get("channel_id")
            or program.get("channel_id")
        )
        if raw_channel_id is None and isinstance(metadata, dict):
            raw_channel_id = metadata.get("channel_id") or metadata.get("channelId")
        if raw_channel_id is None:
            channel_payload = payload.get("channel")
            if isinstance(channel_payload, dict):
                raw_channel_id = channel_payload.get("id")
        # Relax channel_id check for group channels (e.g. france.tv, M6+)
        # where items have individual channel IDs different from the group ID.
        # Since we fetched this data specifically for this channel_id, we trust it.
        # if raw_channel_id is not None and str(raw_channel_id) != channel_id:
        #     continue

        # Parse program timestamps
        start = _parse_timestamp(
            video.get("start_at")
            or video.get("start")
            or payload.get("startUTCMillis")
            or payload.get("start_at")
            or payload.get("start")
            or program.get("startUTCMillis")
            or program.get("start_at")
            or program.get("start")
        )
        end = _parse_timestamp(
            video.get("end_at")
            or video.get("end")
            or payload.get("endUTCMillis")
            or payload.get("end_at")
            or payload.get("end")
            or program.get("endUTCMillis")
            or program.get("end_at")
            or program.get("end")
        )

        # Parse replay availability window
        available_from = _parse_timestamp(
            video.get("available_from")
            or payload.get("available_from")
            or program.get("available_from")
        )
        available_until = _parse_timestamp(
            video.get("available_until")
            or payload.get("available_until")
            or program.get("available_until")
        )

        if start is None or end is None:
            skipped_no_time += 1
            continue

        # Skip programs that haven't started yet (future programs)
        if start > now:
            skipped_future += 1
            continue

        # Check if replay is currently available
        if available_from and available_until:
            if not (available_from <= now <= available_until):
                skipped_not_available += 1
                continue
        elif end < replay_cutoff:
            # No availability info, use 7-day window from end time
            skipped_not_available += 1
            continue

        parsed_count += 1

        title = (
            payload.get("title")
            or _format_value(payload.get("title_formatter"))
            or payload.get("name")
            or program.get("title")
            or "Untitled"
        )
        episode_title = (
            payload.get("episodeTitle")
            or payload.get("episode_title")
            or payload.get("subtitle")
            or _format_value(payload.get("subtitle_formatter"))
        )

        # Build replay URL - use video type and id if available
        video_type = video.get("type", "channel")
        video_id = video.get("id") or video.get("program_id") or channel_id
        asset_url = api.build_asset_url(video_type, str(video_id), start_over=True)

        # Extract program_id and channel_id for episode browsing
        program_id = str(video.get("program_id")) if video.get("program_id") else None
        item_channel_id = str(video.get("channel_id")) if video.get("channel_id") else channel_id

        replays.append(
            BrowseAsset(
                title=title,
                asset_url=asset_url,
                is_live=False,
                description=payload.get("description"),
                episode_title=episode_title,
                thumbnail=payload.get("thumbnail") or _extract_item_image(payload),
                poster=payload.get("poster")
                or _extract_item_image(payload, prefer_poster=True),
                start=start,
                end=end,
                program_id=program_id,
                channel_id=item_channel_id,
                available_from=available_from,
                available_until=available_until,
            )
        )

    _LOGGER.debug(
        "Replay parsing: total=%d, parsed=%d, no_time=%d, future=%d, not_available=%d",
        len(programs),
        parsed_count,
        skipped_no_time,
        skipped_future,
        skipped_not_available,
    )

    return replays


def _extract_replay_assets(
    data: Any, api: MolotovApi, *, channel_id: str | None = None
) -> list[BrowseAsset]:
    assets: list[BrowseAsset] = []
    now = dt_util.utcnow()
    
    for section in _extract_sections(data):
        if not _is_replay_section(section):
            continue
        for item in _extract_section_items(section):
            if not isinstance(item, dict):
                continue
            # Skip items that do not match the requested channel when possible.
            if channel_id:
                item_channel = _extract_item_channel_id_strict(item)
                if item_channel and item_channel != channel_id:
                    continue

            asset = _parse_asset_item(item, api)
            if asset:
                # Filter out future broadcasts (only allow VOD or past/live items)
                if asset.start:
                    is_future = asset.start > now
                    if is_future:
                        _LOGGER.debug("Filtering future asset '%s': start=%s > now=%s", asset.title, asset.start, now)
                        continue

                # If broadcast and no start time, suspicious
                if asset.asset_type == "broadcast" and not asset.start:
                    _LOGGER.debug("Filtering broadcast without start time: %s", asset.title)
                    continue

                # Check if replay is within availability window
                if asset.available_from and asset.available_until:
                    if not (asset.available_from <= now <= asset.available_until):
                        _LOGGER.debug(
                            "Filtering unavailable asset '%s': now=%s not in [%s, %s]",
                            asset.title, now, asset.available_from, asset.available_until
                        )
                        continue
                elif asset.available_until and asset.available_until < now:
                    # Replay has expired
                    _LOGGER.debug(
                        "Filtering expired asset '%s': available_until=%s < now=%s",
                        asset.title, asset.available_until, now
                    )
                    continue

                assets.append(asset)

    return _dedupe_assets(assets)


def _extract_item_channel_id_strict(item: dict[str, Any]) -> str | None:
    payload = _extract_item_payload(item)
    video = payload.get("video")
    if isinstance(video, dict) and video.get("channel_id"):
        return str(video.get("channel_id"))

    metadata = payload.get("metadata")
    if isinstance(metadata, dict):
        if metadata.get("channel_id"):
            return str(metadata.get("channel_id"))
        if metadata.get("channelId"):
            return str(metadata.get("channelId"))

    actions = _extract_item_actions(item, payload)
    channel_id = _extract_channel_id_from_actions(actions)
    if channel_id:
        return channel_id

    channel_payload = payload.get("channel")
    if isinstance(channel_payload, dict) and channel_payload.get("id"):
        return str(channel_payload.get("id"))

    return None


def _extract_search_suggestions(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Extract search suggestions from search home data."""
    assets: list[BrowseAsset] = []
    for section in _extract_sections(data):
        for item in _extract_section_items(section):
            if not isinstance(item, dict):
                continue
            asset = _parse_asset_item(item, api)
            if asset:
                assets.append(asset)
    return _dedupe_assets(assets)


def _extract_search_results(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Extract search results from search response."""
    assets: list[BrowseAsset] = []

    # Handle direct results array
    if isinstance(data, dict):
        results = data.get("results") or data.get("items") or data.get("data")
        if isinstance(results, list):
            for item in results:
                if not isinstance(item, dict):
                    continue
                asset = _parse_asset_item(item, api)
                if asset:
                    assets.append(asset)
            if assets:
                return _dedupe_assets(assets)

    # Fall back to section-based extraction
    for section in _extract_sections(data):
        for item in _extract_section_items(section):
            if not isinstance(item, dict):
                continue
            asset = _parse_asset_item(item, api)
            if asset:
                assets.append(asset)

    return _dedupe_assets(assets)


def _extract_program_episodes(
    data: Any, api: MolotovApi, filter_program_id: str | None = None
) -> list[BrowseAsset]:
    """Extract available episodes from program details response."""
    assets: list[BrowseAsset] = []
    seen_titles: set[str] = set()  # Dedupe by title since same ep can have different URLs

    if not isinstance(data, dict):
        return assets

    _LOGGER.debug(
        "Extracting episodes from data with keys: %s",
        list(data.keys()) if data else "empty"
    )

    # Only look at sections that contain playable episodes
    # Priority: program_episode_sections first (program-specific), then channel
    # Check both snake_case and camelCase variants
    for section_key in (
        "program_episode_sections",
        "programEpisodeSections",
        "channel_episode_sections",
        "channelEpisodeSections",
        "sections",
        "episodes",
    ):
        sections = data.get(section_key)
        if not isinstance(sections, list):
            continue

        for section in sections:
            if not isinstance(section, dict):
                continue

            section_slug = (section.get("slug") or "").lower()
            section_title = section.get("title") or section.get("slug") or "unknown"

            # Skip sections that aren't playable content
            if any(skip in section_slug for skip in ("a-venir", "bientot", "upcoming", "soon")):
                continue

            items = _extract_section_items(section)

            _LOGGER.debug(
                "Processing section '%s' (slug=%s) with %d items",
                section_title, section_slug, len(items)
            )

            for item in items:
                if not isinstance(item, dict):
                    continue

                # Filter by program_id if specified - but allow items without program_id
                # since they came from the program's endpoint anyway
                if filter_program_id:
                    payload = _extract_item_payload(item)
                    video = payload.get("video", {})
                    item_program_id = str(video.get("program_id")) if video.get("program_id") else None
                    # Only skip if item has a different program_id, not if it's missing
                    if item_program_id is not None and item_program_id != filter_program_id:
                        _LOGGER.debug(
                            "Skipping item with different program_id: %s != %s",
                            item_program_id, filter_program_id
                        )
                        continue

                asset = _parse_asset_item(item, api)
                if asset:
                    # Filter out future broadcasts that can't be played yet
                    now = dt_util.utcnow()
                    if asset.start and asset.start > now:
                        _LOGGER.debug(
                            "Skipping future episode '%s': start=%s > now=%s",
                            asset.title, asset.start, now
                        )
                        continue

                    # Dedupe by episode_title to avoid duplicates
                    dedup_key = asset.episode_title or asset.title
                    if dedup_key not in seen_titles:
                        seen_titles.add(dedup_key)
                        assets.append(asset)
                    else:
                        _LOGGER.debug("Skipping duplicate episode: %s", dedup_key)
                else:
                    # Log why asset was not parsed
                    payload = _extract_item_payload(item)
                    _LOGGER.debug(
                        "Failed to parse item: title=%s, is_available=%s",
                        payload.get("title", "unknown"),
                        payload.get("is_available"),
                    )

    _LOGGER.debug("Total unique episodes for program %s: %d", filter_program_id, len(assets))
    # Sort by start date, newest first, limit to 50
    sorted_assets = _sort_assets(assets)
    return sorted_assets[:50]


def _extract_recording_assets(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    assets: list[BrowseAsset] = []
    sections = _extract_sections(data)
    _LOGGER.debug("Extracting recordings from %d sections", len(sections))

    for section in sections:
        section_title = section.get("title") or section.get("slug") or "unknown"
        is_recording_section = _is_recording_section(section)
        items = _extract_section_items(section)

        _LOGGER.debug(
            "Section '%s': is_recording=%s, %d items",
            section_title[:30],
            is_recording_section,
            len(items),
        )

        for item in items:
            if not isinstance(item, dict):
                continue

            # Check both item and its payload for recording type
            payload = _extract_item_payload(item)
            is_recording = _is_recording_item(item) or _is_recording_item(payload)

            if not is_recording_section and not is_recording:
                continue

            asset = _parse_asset_item(item, api)
            if asset:
                _LOGGER.debug(
                    "Found recording: %s (url=%s)",
                    asset.title[:30] if asset.title else "untitled",
                    asset.asset_url[:50] if asset.asset_url else "no url",
                )
                assets.append(asset)

    _LOGGER.debug("Total recordings extracted: %d", len(assets))
    return _dedupe_assets(assets)


def _dedupe_assets(assets: list[BrowseAsset]) -> list[BrowseAsset]:
    seen: set[str] = set()
    unique: list[BrowseAsset] = []
    for asset in assets:
        if asset.asset_url in seen:
            continue
        seen.add(asset.asset_url)
        unique.append(asset)
    return unique


def _sort_assets(assets: list[BrowseAsset]) -> list[BrowseAsset]:
    assets.sort(
        key=lambda asset: asset.start
        or asset.end
        or dt_util.utc_from_timestamp(0),
        reverse=True,
    )
    return assets


def _is_replay_section(section: dict[str, Any]) -> bool:
    context = section.get("context")
    if isinstance(context, dict):
        if context.get("is_catchup") or context.get("is_replay"):
            return True
    slug = section.get("slug")
    title = section.get("title")
    text = f"{slug or ''} {title or ''}".casefold()
    return any(
        keyword in text for keyword in ("replay", "catchup", "rattrapage", "revoir")
    )


def _is_recording_section(section: dict[str, Any]) -> bool:
    slug = section.get("slug")
    title = section.get("title")
    text = f"{slug or ''} {title or ''}".casefold()
    return "record" in text or "enregistr" in text


def _is_recording_item(item: dict[str, Any]) -> bool:
    # Check video.type = "record"
    video = item.get("video")
    if isinstance(video, dict):
        video_type = video.get("type", "")
        if video_type == "record":
            return True

    # Check item type
    item_type = item.get("type") or item.get("item_type")
    if isinstance(item_type, str) and "record" in item_type.casefold():
        return True

    # Check bookmark style
    bookmark_style = item.get("bookmark_style") or item.get("bookmarkStyle")
    if isinstance(bookmark_style, str) and "record" in bookmark_style.casefold():
        return True

    # Check nested data
    data = item.get("data")
    if isinstance(data, dict):
        return _is_recording_item(data)

    return False


def _discover_cast_targets_blocking(zconf: Any) -> list[str]:
    try:
        import pychromecast
    except Exception:
        _LOGGER.debug("pychromecast import failed")
        return []

    _LOGGER.debug(
        "Discovering chromecasts, pychromecast version: %s",
        getattr(pychromecast, "__version__", "unknown"),
    )

    stop_discovery = None
    try:
        from pychromecast.discovery import stop_discovery
    except ImportError:
        _LOGGER.debug("stop_discovery not available")

    browser = None
    chromecasts = None

    try:
        # Method 1: get_chromecasts (modern API)
        if hasattr(pychromecast, "get_chromecasts"):
            _LOGGER.debug("Trying get_chromecasts()")
            try:
                import inspect
                sig = inspect.signature(pychromecast.get_chromecasts)
                params = list(sig.parameters.keys())
                _LOGGER.debug("get_chromecasts params: %s", params)

                result = pychromecast.get_chromecasts(timeout=10)
                if isinstance(result, tuple) and len(result) >= 2:
                    chromecasts, browser = result[0], result[1]
                else:
                    chromecasts = result
                _LOGGER.debug("get_chromecasts found %d devices", len(chromecasts) if chromecasts else 0)
            except Exception as err:
                _LOGGER.debug("get_chromecasts failed: %s", err)

        # Method 2: get_listed_chromecasts (older API)
        if chromecasts is None and hasattr(pychromecast, "get_listed_chromecasts"):
            _LOGGER.debug("Trying get_listed_chromecasts()")
            try:
                import inspect
                sig = inspect.signature(pychromecast.get_listed_chromecasts)
                params = list(sig.parameters.keys())
                _LOGGER.debug("get_listed_chromecasts params: %s", params)

                # Try without zconf first
                result = pychromecast.get_listed_chromecasts()
                if isinstance(result, tuple) and len(result) >= 2:
                    chromecasts, browser = result[0], result[1]
                else:
                    chromecasts = result
                _LOGGER.debug("get_listed_chromecasts found %d devices", len(chromecasts) if chromecasts else 0)
            except Exception as err:
                _LOGGER.debug("get_listed_chromecasts failed: %s", err)

        if not chromecasts:
            _LOGGER.debug("No chromecasts discovered")
            return []

        targets: list[str] = []
        for cast in chromecasts:
            host = getattr(cast, "host", None)
            if not host and hasattr(cast, "cast_info"):
                host = getattr(cast.cast_info, "host", None)
            if not host and getattr(cast, "socket_client", None):
                host = getattr(cast.socket_client, "host", None)
            if not host:
                _LOGGER.debug("Skipping cast without host: %s", cast)
                continue

            name = getattr(cast, "name", None)
            if not name and hasattr(cast, "cast_info"):
                name = getattr(cast.cast_info, "friendly_name", None)
            if not name and getattr(cast, "device", None):
                name = getattr(cast.device, "friendly_name", None)

            if isinstance(name, str) and name:
                targets.append(f"{name}={host}")
                _LOGGER.debug("Discovered: %s=%s", name, host)
            else:
                targets.append(str(host))
                _LOGGER.debug("Discovered: %s", host)
        return targets

    except Exception as err:
        _LOGGER.debug("Chromecast discovery failed: %s", err)
        return []
    finally:
        if browser is not None and stop_discovery is not None:
            try:
                stop_discovery(browser)
            except Exception:
                pass


def _find_channel(data: EpgData | None, channel_id: str) -> EpgChannel | None:
    if data is None:
        return None
    for channel in data.channels:
        if channel.channel_id == channel_id:
            return channel
    return None


def _find_program(
    data: EpgData | None, channel_id: str, start_ts: int
) -> EpgProgram | None:
    channel = _find_channel(data, channel_id)
    if channel is None:
        return None
    for program in channel.programs:
        if int(program.start.timestamp()) == start_ts:
            return program
    return None


def _find_current_program(channel: EpgChannel, now: datetime) -> EpgProgram | None:
    for program in channel.programs:
        if program.start <= now < program.end:
            return program
    return None


def _count_channels_with_current(
    channels: list[EpgChannel], now: datetime
) -> int:
    return sum(1 for channel in channels if _find_current_program(channel, now))


def _merge_epg_channels(
    base_channels: dict[str, EpgChannel], incoming: list[EpgChannel]
) -> None:
    for channel in incoming:
        existing = base_channels.get(channel.channel_id)
        if existing is None:
            continue
        if not existing.programs and channel.programs:
            existing.programs = channel.programs
        if existing.poster is None and channel.poster is not None:
            existing.poster = channel.poster
        if not existing.label and channel.label:
            existing.label = channel.label


def _parse_remote_programs(
    data: dict[str, Any], channel_id: str
) -> list[EpgProgram]:
    if not isinstance(data, dict):
        return []
    programs_payload = data.get("programs")
    if isinstance(programs_payload, list):
        parsed = _parse_epg_programs(programs_payload)
        if parsed:
            return parsed

    items = _extract_section_items(data)
    parsed: list[EpgProgram] = []
    for item in items:
        program = _parse_program_item(item, channel_id)
        if program is not None:
            parsed.append(program)
    return parsed


def _extract_section_items(data: dict[str, Any]) -> list[dict[str, Any]]:
    items = data.get("items")
    if isinstance(items, list):
        return [item for item in items if isinstance(item, dict)]
    sections = data.get("sections")
    if isinstance(sections, list):
        collected: list[dict[str, Any]] = []
        for section in sections:
            if not isinstance(section, dict):
                continue
            section_items = section.get("items")
            if isinstance(section_items, list):
                collected.extend(
                    [item for item in section_items if isinstance(item, dict)]
                )
        return collected
    return []


def _parse_epg_programs(programs: list[Any]) -> list[EpgProgram]:
    parsed: list[EpgProgram] = []
    for program in programs:
        if not isinstance(program, dict):
            continue
        start = _parse_timestamp(
            program.get("startUTCMillis")
            or program.get("start_at")
            or program.get("start")
        )
        end = _parse_timestamp(
            program.get("endUTCMillis") or program.get("end_at") or program.get("end")
        )
        if start is None or end is None:
            continue
        title = program.get("title") or program.get("name") or "Untitled"
        parsed.append(
            EpgProgram(
                title=title,
                start=start,
                end=end,
                description=program.get("description"),
                episode_title=program.get("episodeTitle")
                or program.get("episode_title")
                or program.get("subtitle"),
                thumbnail=program.get("thumbnail")
                or program.get("thumbnailUrl")
                or _extract_item_image(program),
                poster=program.get("poster")
                or program.get("posterUrl")
                or _extract_item_image(program, prefer_poster=True),
            )
        )
    return parsed


def _parse_program_item(item: dict[str, Any], channel_id: str) -> EpgProgram | None:
    video = item.get("video")
    if isinstance(video, dict):
        source = video
    else:
        source = item

    raw_channel_id = (
        source.get("channel_id")
        or source.get("channelId")
        or item.get("channel_id")
        or item.get("channelId")
    )
    if raw_channel_id is not None and str(raw_channel_id) != channel_id:
        return None

    start = _parse_timestamp(source.get("start_at") or source.get("start"))
    end = _parse_timestamp(source.get("end_at") or source.get("end"))
    if start is None or end is None:
        return None

    title = (
        item.get("title")
        or _format_value(item.get("title_formatter"))
        or _format_value(item.get("titleFormatter"))
        or item.get("name")
        or "Untitled"
    )
    episode_title = (
        item.get("episodeTitle")
        or item.get("episode_title")
        or item.get("subtitle")
        or _format_value(item.get("subtitle_formatter"))
        or _format_value(item.get("subtitleFormatter"))
    )
    description = item.get("description") or _format_value(
        item.get("description_formatter")
    )

    thumbnail = _extract_item_image(item)
    poster = _extract_item_image(item, prefer_poster=True)
    if not thumbnail or not poster:
        channel_payload = item.get("channel")
        if isinstance(channel_payload, dict):
            if not thumbnail:
                thumbnail = _extract_item_image(channel_payload)
            if not poster:
                poster = _extract_item_image(channel_payload, prefer_poster=True)

    return EpgProgram(
        title=title,
        start=start,
        end=end,
        description=description,
        episode_title=episode_title,
        thumbnail=thumbnail,
        poster=poster,
    )


def _parse_timestamp(value: Any) -> datetime | None:
    if isinstance(value, str):
        if value.isdigit():
            value = int(value)
        else:
            return None
    if not isinstance(value, (int, float)):
        return None
    seconds = value / 1000 if value > 10**11 else value
    return dt_util.utc_from_timestamp(seconds)


def _extract_item_image(payload: dict[str, Any], *, prefer_poster: bool = False) -> str | None:
    for key in ("thumbnail", "thumbnailUrl", "poster", "posterUrl", "logo", "logoUrl"):
        url = payload.get(key)
        if isinstance(url, str) and url:
            return url

    bundle = payload.get("image_bundle") or payload.get("imageBundle")
    if not isinstance(bundle, dict):
        return None

    if prefer_poster:
        preferred = ("poster_with_channel", "poster", "poster_tv", "landscape")
    else:
        preferred = ("poster_with_channel", "poster", "landscape", "backdrop")
    for key in preferred:
        url = _extract_image_from_bundle(bundle.get(key))
        if url:
            return url
    for value in bundle.values():
        url = _extract_image_from_bundle(value)
        if url:
            return url
    return None


def _extract_image_from_bundle(value: Any) -> str | None:
    if isinstance(value, str):
        return value
    if not isinstance(value, dict):
        return None
    for key in ("source", "small", "medium", "large"):
        candidate = value.get(key)
        if isinstance(candidate, dict):
            url = candidate.get("url")
            if isinstance(url, str) and url:
                return url
        elif isinstance(candidate, str) and candidate:
            return candidate
    return None


def _format_value(payload: Any) -> str | None:
    if isinstance(payload, dict):
        value = payload.get("format")
        if isinstance(value, str):
            return value
    return None


def _extract_host_from_device_info(device_info: Any) -> str | None:
    if not isinstance(device_info, dict):
        return None
    connections = device_info.get("connections")
    return _extract_host_from_connections(connections)


def _extract_host_from_device_registry(
    hass: HomeAssistant, device_id: str
) -> str | None:
    from homeassistant.helpers import device_registry as dr

    registry = dr.async_get(hass)
    device = registry.async_get(device_id)
    if not device:
        return None
    return _extract_host_from_connections(device.connections)


def _extract_host_from_connections(connections: Any) -> str | None:
    if not connections:
        return None
    for connection in connections:
        if not isinstance(connection, (list, tuple)) or len(connection) < 2:
            continue
        conn_type, value = connection[0], connection[1]
        if conn_type in ("ip", "ipv4", "ipv6", "host") and isinstance(value, str):
            return value
    return None
