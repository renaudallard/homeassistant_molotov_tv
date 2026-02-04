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
from datetime import datetime, timedelta
import json
import logging
from typing import Any
from urllib.parse import parse_qs, quote, unquote

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
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .api import MolotovApi, MolotovApiError
from .browse import (
    async_fetch_channel_replays,
    async_fetch_program_episodes,
    async_fetch_recordings,
    build_assets_browse,
    build_channels_browse,
    build_root_browse,
    build_search_input_browse,
    build_search_results_browse,
)
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
    async_check_cast_health,
    async_attempt_reconnect,
    async_cast_switch_media,
    async_get_cast_position,
    async_get_cast_volume,
    async_is_our_app_running,
    register_connection_callback,
    unregister_connection_callback,
)
from .const import (
    CAST_HEALTH_CHECK_INTERVAL,
    CONF_CAST_TARGET,
    CONF_CAST_TARGETS,
    CONF_CAST_HOSTS,
    DOMAIN,
    MAX_CONCURRENT_STREAMS,
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
from .helpers import (
    decode_asset_payload_from_media_id,
    discover_cast_targets_blocking,
    encode_asset_payload,
    extract_host_from_device_info,
    extract_host_from_device_registry,
    extract_search_results,
    find_channel,
    find_current_program,
    find_program,
    count_channels_with_current,
    merge_epg_channels,
    parse_manual_targets,
    parse_remote_programs,
    split_manual_target,
)
from .models import BrowseAsset
from .storage import ResumePositionStore

_LOGGER = logging.getLogger(__name__)

PROGRAM_CACHE_TTL = timedelta(minutes=15)
ASSET_CACHE_TTL = timedelta(minutes=5)
CAST_DISCOVERY_TTL = timedelta(seconds=30)
SEARCH_CACHE_TTL = timedelta(minutes=10)
MAX_PROGRAM_CACHE_SIZE = 50


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    data = hass.data[DOMAIN][entry.entry_id]
    coordinator: MolotovEpgCoordinator = data["coordinator"]
    api: MolotovApi = data["api"]
    resume_store: ResumePositionStore = data["resume_store"]
    async_add_entities([MolotovTvMediaPlayer(entry, coordinator, api, resume_store)])


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
        resume_store: ResumePositionStore,
    ) -> None:
        super().__init__(coordinator)
        self._entry = entry
        self._api = api
        self._resume_store = resume_store
        self._attr_unique_id = entry.entry_id
        self._attr_name = None
        self._attr_has_entity_name = True
        self._program_cache: dict[str, tuple[datetime, list[EpgProgram]]] = {}
        self._recording_cache: tuple[datetime, list[BrowseAsset]] | None = None
        self._cast_discovery_cache: tuple[datetime, list[str]] | None = None
        self._active_cast_target: str | None = None
        self._active_cast_entity: str | None = None
        self._current_stream: dict[str, Any] | None = None
        self._tracks: dict[str, dict[str, Any]] = {}
        self._current_track_id: int | None = None
        # Connection reliability tracking
        self._cast_connected: bool = False
        self._cast_connection_error: str | None = None
        self._health_check_unsub: Any = None
        # Content tracking for quick switch and resume
        self._current_content_id: str | None = None
        self._current_is_live: bool = False
        # Media position tracking
        self._media_position: float | None = None
        self._media_duration: float | None = None
        self._media_position_updated_at: datetime | None = None
        # Volume tracking
        self._volume_level: float | None = None
        self._is_volume_muted: bool = False
        # Stream slot tracking
        self._stream_id: str | None = None

    def _get_active_streams(self) -> set[str]:
        """Get the set of active stream IDs for this account."""
        data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
        return data.get("active_streams", set())

    def _acquire_stream_slot(self) -> str:
        """Acquire a stream slot. Raises if limit reached."""
        import uuid

        active_streams = self._get_active_streams()

        # Release any existing stream for this player first
        if self._stream_id and self._stream_id in active_streams:
            active_streams.discard(self._stream_id)

        if len(active_streams) >= MAX_CONCURRENT_STREAMS:
            raise HomeAssistantError(
                f"Limite de {MAX_CONCURRENT_STREAMS} flux simultanés atteinte. "
                "Arrêtez un autre flux avant d'en démarrer un nouveau."
            )

        stream_id = str(uuid.uuid4())
        active_streams.add(stream_id)
        self._stream_id = stream_id
        _LOGGER.debug(
            "Acquired stream slot %s (%d/%d active)",
            stream_id[:8],
            len(active_streams),
            MAX_CONCURRENT_STREAMS,
        )
        return stream_id

    def _release_stream_slot(self) -> None:
        """Release the current stream slot."""
        if not self._stream_id:
            return

        active_streams = self._get_active_streams()
        active_streams.discard(self._stream_id)
        _LOGGER.debug(
            "Released stream slot %s (%d/%d active)",
            self._stream_id[:8],
            len(active_streams),
            MAX_CONCURRENT_STREAMS,
        )
        self._stream_id = None

    @property
    def device_info(self):
        """Return device info."""
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": self._entry.title,
            "manufacturer": "Molotov",
            "model": "Molotov TV",
        }

    async def async_added_to_hass(self) -> None:
        """Called when entity is added to hass."""
        await super().async_added_to_hass()
        # Register for cast connection status updates
        register_connection_callback(self._on_cast_connection_change)

    async def async_will_remove_from_hass(self) -> None:
        """Called when entity is about to be removed from hass."""
        await super().async_will_remove_from_hass()
        # Unregister callback
        unregister_connection_callback(self._on_cast_connection_change)
        # Stop health monitor
        await self._async_stop_health_monitor()

    def _on_cast_connection_change(self, host: str, connected: bool) -> None:
        """Handle cast connection status changes from chromecast module."""
        if host != self._active_cast_target:
            return

        _LOGGER.debug("Cast connection change for %s: connected=%s", host, connected)

        self._cast_connected = connected
        if not connected:
            self._cast_connection_error = "Connection lost"
            # Don't change state to IDLE immediately - health check will handle reconnect
        else:
            self._cast_connection_error = None

        # Schedule state update (callback may be called from executor thread)
        self.hass.loop.call_soon_threadsafe(self.async_schedule_update_ha_state)

    async def _async_end_session_takeover(self) -> None:
        """End session gracefully when another app takes over."""
        _LOGGER.debug("Cleaning up session after app takeover")
        await self._async_stop_health_monitor()

        # Save resume position if applicable
        if (
            self._current_content_id
            and not self._current_is_live
            and self._media_position is not None
            and self._media_duration is not None
        ):
            await self._resume_store.async_save_position(
                self._current_content_id,
                self._media_position,
                self._media_duration,
                self._attr_media_title,
            )

        # Clear cast state
        self._active_cast_entity = None
        self._active_cast_target = None
        self._current_stream = None
        self._cast_connected = False
        self._cast_connection_error = "Session ended: another app took over"
        self._current_content_id = None
        self._current_is_live = False
        self._media_position = None
        self._media_duration = None
        self._media_position_updated_at = None
        self._volume_level = None
        self._is_volume_muted = False
        self._attr_state = STATE_IDLE
        self.async_write_ha_state()

    async def _async_start_health_monitor(self) -> None:
        """Start periodic cast health monitoring."""
        if self._health_check_unsub is not None:
            return

        _LOGGER.debug("Starting cast health monitor for %s", self._active_cast_target)
        self._health_check_unsub = async_track_time_interval(
            self.hass,
            self._async_health_check,
            CAST_HEALTH_CHECK_INTERVAL,
        )

    async def _async_stop_health_monitor(self) -> None:
        """Stop health monitoring."""
        if self._health_check_unsub is not None:
            _LOGGER.debug("Stopping cast health monitor")
            self._health_check_unsub()
            self._health_check_unsub = None

    async def _async_health_check(self, now: datetime | None = None) -> None:
        """Periodic health check of cast connection."""
        if not self._active_cast_target:
            await self._async_stop_health_monitor()
            return

        # First check if our app is still running (detects app takeover)
        our_app_running = await async_is_our_app_running(
            self.hass, self._active_cast_target
        )

        if not our_app_running and self._cast_connected:
            # Check if it's a connection issue or app takeover
            connected = await async_check_cast_health(
                self.hass, self._active_cast_target
            )

            if connected:
                # Connection OK but different app - another app took over
                _LOGGER.info(
                    "Another app took over Chromecast %s, ending session",
                    self._active_cast_target,
                )
                await self._async_end_session_takeover()
                return

            # Connection lost - try to reconnect
            _LOGGER.warning(
                "Cast connection lost to %s, attempting reconnect",
                self._active_cast_target,
            )
            self._cast_connected = False
            self._cast_connection_error = "Connection lost - reconnecting..."
            self.async_write_ha_state()

            # Attempt reconnect
            if await async_attempt_reconnect(self.hass, self._active_cast_target):
                _LOGGER.info("Reconnected to %s", self._active_cast_target)
                self._cast_connected = True
                self._cast_connection_error = None
                self._attr_state = STATE_PLAYING
                self.async_write_ha_state()
            else:
                _LOGGER.warning(
                    "Failed to reconnect to %s - device may be powered off",
                    self._active_cast_target,
                )
                await self._async_end_session_unreachable()

        elif our_app_running and not self._cast_connected:
            # Connection restored (possibly from external reconnect)
            _LOGGER.info("Cast connection restored to %s", self._active_cast_target)
            self._cast_connected = True
            self._cast_connection_error = None
            self.async_write_ha_state()

    async def _async_end_session_unreachable(self) -> None:
        """End session when Chromecast becomes unreachable."""
        _LOGGER.debug("Cleaning up session - Chromecast unreachable")
        await self._async_stop_health_monitor()

        # Save resume position if applicable
        if (
            self._current_content_id
            and not self._current_is_live
            and self._media_position is not None
            and self._media_duration is not None
        ):
            await self._resume_store.async_save_position(
                self._current_content_id,
                self._media_position,
                self._media_duration,
                self._attr_media_title,
            )

        # Clear cast state
        self._active_cast_entity = None
        self._active_cast_target = None
        self._current_stream = None
        self._cast_connected = False
        self._cast_connection_error = "Session ended: Chromecast unreachable"
        self._current_content_id = None
        self._current_is_live = False
        self._media_position = None
        self._media_duration = None
        self._media_position_updated_at = None
        self._volume_level = None
        self._is_volume_muted = False
        self._attr_state = STATE_IDLE
        self.async_write_ha_state()

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
                bool(url),
            )
            if url:
                attrs["stream_url"] = url

            drm = self._current_stream.get("drm")
            up_drm = self._current_stream.get("up_drm")

            if up_drm:
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
                        "headers": license_data.get("http_headers", {}),
                    }
            elif drm:
                attrs["stream_drm"] = drm

            config = self._current_stream.get("config", {})
            selected_track = config.get("selected_track", {})
            if selected_track:
                attrs["stream_selected_track"] = selected_track

        # Cast connection status
        if self._active_cast_target:
            attrs["cast_target"] = self._active_cast_target
            attrs["cast_connected"] = self._cast_connected
            if self._cast_connection_error:
                attrs["cast_error"] = self._cast_connection_error

        return attrs

    def _get_search_cache(self) -> tuple[datetime, str, list[BrowseAsset]] | None:
        """Get search cache from shared storage."""
        data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
        return data.get("search_cache")

    def _set_search_cache(self, query: str, results: list[BrowseAsset]) -> None:
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
            return build_root_browse()

        if media_content_id == MEDIA_NOW_PLAYING:
            await self.coordinator.async_request_refresh()
            data = self.coordinator.data
            if data is None:
                raise HomeAssistantError("EPG data is not available yet")
            return await self._async_browse_now_playing(data)

        if media_content_id == MEDIA_CHANNELS:
            await self.coordinator.async_request_refresh()
            data = self.coordinator.data
            if data is None:
                raise HomeAssistantError("EPG data is not available yet")
            return build_channels_browse(data)

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
            return await self._async_browse_replay_or_episodes(data, media_content_id)

        if media_content_id.startswith(f"{MEDIA_PROGRAM_EPISODES_PREFIX}:"):
            return await self._async_browse_program_episodes(media_content_id)

        if media_content_id.startswith(f"{MEDIA_EPISODE_PREFIX}:"):
            return await self._async_browse_cast_targets(data, media_content_id)

        if media_content_id.startswith(f"{MEDIA_RECORDING_PREFIX}:"):
            return await self._async_browse_replay_or_episodes(data, media_content_id)

        if media_content_id.startswith(f"{MEDIA_SEARCH_INPUT_PREFIX}:"):
            buffer = media_content_id.split(":", 1)[1]
            return build_search_input_browse(buffer)

        if media_content_id == MEDIA_SEARCH:
            return await self._async_browse_search_home()

        if media_content_id.startswith(f"{MEDIA_SEARCH_PREFIX}:"):
            query = media_content_id.split(":", 1)[1]
            if "?" in query or "=" in query:
                query = unquote(query)
            return await self._async_browse_search_results(query)

        if "?" in media_content_id:
            base_id, query_string = media_content_id.split("?", 1)
            params = parse_qs(query_string)
            search_query = params.get("search", params.get("query", [None]))[0]
            if search_query and base_id in (MEDIA_SEARCH, MEDIA_ROOT):
                return await self._async_browse_search_results(unquote(search_query))

        if media_content_id.startswith(f"{MEDIA_SEARCH_RESULT_PREFIX}:"):
            return await self._async_browse_replay_or_episodes(data, media_content_id)

        return build_root_browse()

    async def async_play_media(
        self,
        media_type: str,
        media_id: str,
        **kwargs: Any,
    ) -> None:
        if media_id.startswith(f"{MEDIA_SEARCH_PREFIX}:"):
            query = media_id.split(":", 1)[1]
            await self._async_perform_search(query)
            return

        if media_id.startswith("play_local:"):
            await self._async_play_local(media_id.split(":", 1)[1])
            return

        if media_id.startswith(f"{MEDIA_CAST_PREFIX}:"):
            parts = media_id.split(":", 3)

            if len(parts) == 4:
                _, encoded_target, receiver_type, base_media_id = parts
                target = self._decode_cast_target(encoded_target)
                await self._async_cast_or_switch(
                    base_media_id, target, receiver_type=receiver_type
                )
                return

            if len(parts) == 3:
                _, encoded_target, base_media_id = parts
                target = self._decode_cast_target(encoded_target)
                receiver_type = "custom" if CUSTOM_RECEIVER_APP_ID else "native"
                await self._async_cast_or_switch(
                    base_media_id, target, receiver_type=receiver_type
                )
                return

        # If already casting, try quick switch to same target
        if self._active_cast_target and self._cast_connected:
            receiver_type = "custom" if CUSTOM_RECEIVER_APP_ID else "native"
            if await self._async_try_quick_switch(media_id, receiver_type):
                return

        targets = await self._async_get_cast_targets()
        if len(targets) == 1:
            receiver_type = "custom" if CUSTOM_RECEIVER_APP_ID else "native"
            await self._async_cast_or_switch(
                media_id, targets[0], receiver_type=receiver_type
            )
            return

        await self._async_play_local(media_id)

    async def _async_cast_or_switch(
        self,
        media_id: str,
        target: str,
        receiver_type: str = "native",
    ) -> None:
        """Cast media, using quick switch if already connected to same target."""
        resolved_target = self._resolve_cast_target(target)

        # If already casting to this target, try quick switch
        if (
            self._active_cast_target
            and self._active_cast_target == resolved_target
            and self._cast_connected
        ):
            if await self._async_try_quick_switch(media_id, receiver_type):
                return

        # Fall back to full cast
        await self._async_cast_media(media_id, target, receiver_type=receiver_type)

    async def _async_try_quick_switch(self, media_id: str, receiver_type: str) -> bool:
        """Try to quick switch media on active cast. Returns True if successful."""
        if not self._active_cast_target or not self._cast_connected:
            return False

        try:
            asset_url, title, is_live = self._build_cast_request(media_id)
            custom_data = self._build_cast_custom_data(asset_url)

            use_custom = (receiver_type == "custom") and (
                CUSTOM_RECEIVER_APP_ID is not None
            )

            if use_custom:
                # For custom receiver, resolve stream locally
                asset_data = await self._api.async_get_asset_stream(asset_url)
                stream = asset_data.get("stream", {})
                stream_url = stream.get("url")
                if not stream_url:
                    return False
                asset_url = stream_url

                video_format = stream.get("video_format")
                if video_format == "DASH":
                    content_type = "application/dash+xml"
                elif video_format == "HLS":
                    content_type = "application/x-mpegurl"
                else:
                    content_type = "application/dash+xml"
            else:
                content_type = self._api.stream_content_type()

            _LOGGER.debug(
                "Attempting quick switch to %s on %s",
                title,
                self._active_cast_target,
            )

            success = await async_cast_switch_media(
                self.hass,
                self._active_cast_target,
                asset_url,
                content_type,
                custom_data,
                title,
                is_live,
            )

            if success:
                self._attr_media_title = title
                self._attr_state = STATE_PLAYING
                self._current_content_id = media_id
                self._current_is_live = is_live
                # Reset position tracking for new content
                self._media_position = 0.0
                self._media_duration = None
                self._media_position_updated_at = dt_util.utcnow()
                self.async_write_ha_state()
                _LOGGER.info("Quick switched to: %s", title)
                return True

        except Exception as err:
            _LOGGER.debug("Quick switch preparation failed: %s", err)

        return False

    async def _async_play_local(self, media_id: str) -> None:
        """Play media locally by resolving stream URL."""
        # Acquire stream slot before starting playback
        self._acquire_stream_slot()

        try:
            asset_url, title, is_live = self._build_cast_request(media_id)
            asset_data = await self._api.async_get_asset_stream(asset_url)

            _LOGGER.debug(
                "Local play asset data: %s", json.dumps(asset_data, default=str)
            )

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
            self._release_stream_slot()
            _LOGGER.debug(
                "MolotovApiError caught: user_message=%r, str=%s",
                err.user_message,
                str(err)[:200],
            )
            message = err.user_message or str(err)
            raise HomeAssistantError(f"Échec de lecture: {message}") from err

    async def _async_perform_search(self, query: str) -> None:
        """Perform a search and cache results for browsing."""
        if not query.strip():
            return

        try:
            data = await self._api.async_search(query)
            results = extract_search_results(data, self._api)
            self._set_search_cache(query, results)
            _LOGGER.info(
                "Search for '%s' completed with %d results. "
                "Browse to Search folder to see results.",
                query,
                len(results),
            )
        except MolotovApiError as err:
            _LOGGER.error("Search failed: %s", err)
            raise HomeAssistantError(f"La recherche a échoué: {err}") from err

    async def _async_browse_now_playing(self, data: EpgData) -> BrowseMedia:
        channels = list(data.channels)
        if not channels:
            return BrowseMedia(
                title="En direct",
                media_class=MediaClass.DIRECTORY,
                media_content_id=MEDIA_NOW_PLAYING,
                media_content_type="directory",
                can_play=False,
                can_expand=True,
                children=[],
            )
        probe_now = dt_util.utcnow()
        channels_by_id = {channel.channel_id: channel for channel in channels}
        if count_channels_with_current(channels, probe_now) < len(channels):
            # First try live_home which often includes program data
            try:
                live_home = await self._api.async_get_live_home_channels()
                live_data = _parse_epg(live_home)
                merge_epg_channels(channels_by_id, live_data.channels)
            except MolotovApiError as err:
                _LOGGER.debug("Now playing live home refresh failed: %s", err)

            # Check if we still need per-channel program fetches
            channels_list = list(channels_by_id.values())
            channels_with_programs = sum(
                1 for c in channels_list if c.programs and len(c.programs) > 0
            )
            coverage = (
                channels_with_programs / len(channels_list) if channels_list else 0
            )

            if coverage < 0.7:
                # Less than 70% have programs, fetch missing ones
                _LOGGER.debug(
                    "Program coverage %.0f%%, fetching missing programs",
                    coverage * 100,
                )
                await self._async_populate_now_playing_programs(channels_list)
            else:
                _LOGGER.debug(
                    "Program coverage %.0f%%, skipping per-channel fetch",
                    coverage * 100,
                )
        else:
            await self._async_populate_now_playing_programs(
                list(channels_by_id.values())
            )

        now = dt_util.utcnow()
        children: list[BrowseMedia] = []

        for channel in channels:
            current_program = find_current_program(channel, now)

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
                # Append description if available (base64 encoded after |)
                if current_program.description:
                    import base64

                    desc_encoded = base64.urlsafe_b64encode(
                        current_program.description.encode("utf-8")
                    ).decode("ascii").rstrip("=")
                    media_id = f"{media_id}|{desc_encoded}"
                media_class = MediaClass.TV_SHOW
                thumb = (
                    current_program.thumbnail
                    or current_program.poster
                    or channel.poster
                )
            else:
                display_title = f"{channel.label} - Direct"
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
            title="En direct",
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
            if find_current_program(channel, probe_now):
                continue
            cached = self._get_cached_programs(channel.channel_id)
            if cached is not None:
                channel.programs = cached
                if find_current_program(channel, probe_now):
                    continue
            missing.append(channel)

        if not missing:
            return

        semaphore = asyncio.Semaphore(10)  # Increased for faster fetching

        async def fetch_programs(channel: EpgChannel) -> None:
            async with semaphore:
                try:
                    raw = await self._api.async_get_channel_programs(channel.channel_id)
                except MolotovApiError as err:
                    _LOGGER.debug(
                        "Now playing programs fetch failed for %s: %s",
                        channel.channel_id,
                        err,
                    )
                    return
                programs = parse_remote_programs(raw, channel.channel_id)
                if programs:
                    self._set_cached_programs(channel.channel_id, programs)
                    channel.programs = programs

        await asyncio.gather(*(fetch_programs(channel) for channel in missing))

    async def _async_browse_recordings(self) -> BrowseMedia:
        assets = self._get_cached_assets(self._recording_cache)
        if assets is None:
            assets = await async_fetch_recordings(self._api)
            self._recording_cache = (dt_util.utcnow(), assets)
        return build_assets_browse(
            "Enregistrements", MEDIA_RECORDINGS, MEDIA_RECORDING_PREFIX, assets
        )

    async def _async_browse_search_home(self) -> BrowseMedia:
        """Browse search home with cached results or suggestions."""
        search_cache = self._get_search_cache()
        if search_cache:
            cached_at, query, results = search_cache
            if dt_util.utcnow() - cached_at < SEARCH_CACHE_TTL:
                browse = build_search_results_browse(
                    f"Recherche: {query}",
                    f"{MEDIA_SEARCH_PREFIX}:{query}",
                    results,
                    show_search=True,
                )
                browse.children.insert(
                    0,
                    BrowseMedia(
                        title="⌨️ Taper votre recherche...",
                        media_class=MediaClass.DIRECTORY,
                        media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                        media_content_type="directory",
                        can_play=False,
                        can_expand=True,
                    ),
                )
                return browse

        children: list[BrowseAsset] = []
        browse = build_search_results_browse(
            "Recherche", MEDIA_SEARCH, children, show_search=True
        )

        browse.children.insert(
            0,
            BrowseMedia(
                title="⌨️ Taper votre recherche...",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ),
        )

        return browse

    async def _async_browse_search_results(self, query: str) -> BrowseMedia:
        """Browse search results for a query."""
        if not query.strip():
            return await self._async_browse_search_home()

        search_cache = self._get_search_cache()
        if search_cache:
            cached_at, cached_query, cached_results = search_cache
            if (
                cached_query == query
                and dt_util.utcnow() - cached_at < SEARCH_CACHE_TTL
            ):
                return build_search_results_browse(
                    f"Recherche: {query}",
                    f"{MEDIA_SEARCH_PREFIX}:{query}",
                    cached_results,
                    show_search=True,
                )

        try:
            data = await self._api.async_search(query)
            results = extract_search_results(data, self._api)
            _LOGGER.debug("Search for '%s' returned %d results", query, len(results))
            self._set_search_cache(query, results)
            return build_search_results_browse(
                f"Recherche: {query}",
                f"{MEDIA_SEARCH_PREFIX}:{query}",
                results,
                show_search=True,
            )
        except MolotovApiError as err:
            _LOGGER.warning("Search failed: %s", err)
            return BrowseMedia(
                title=f"Recherche: {query}",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_PREFIX}:{query}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
                children=[
                    BrowseMedia(
                        title=f"Échec de la recherche: {err}",
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
        payload = decode_asset_payload_from_media_id(media_content_id)

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
                _LOGGER.debug(
                    "Fetching episodes for program_id=%s, channel_id=%s",
                    program_id,
                    channel_id,
                )
                return await async_fetch_program_episodes(
                    self._api,
                    channel_id,
                    program_id,
                    payload.get("title"),
                    payload.get("thumb"),
                )
            else:
                _LOGGER.debug(
                    "Missing program info - program_id=%s, channel_id=%s, falling back to cast targets",
                    program_id,
                    channel_id,
                )

        return await self._async_browse_cast_targets(data, media_content_id)

    async def _async_browse_program_episodes(
        self, media_content_id: str
    ) -> BrowseMedia:
        """Browse episodes for a program from encoded content ID."""
        parts = media_content_id.split(":", 3)
        if len(parts) < 3:
            raise HomeAssistantError("Invalid program episodes ID")

        channel_id = parts[1]
        program_id = parts[2]
        title = parts[3] if len(parts) > 3 else None

        return await async_fetch_program_episodes(
            self._api, channel_id, program_id, title, None
        )

    async def _async_browse_programs(
        self, data: EpgData, channel_id: str
    ) -> BrowseMedia:
        channel = find_channel(data, channel_id)
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
                programs = parse_remote_programs(raw, channel_id)
                self._set_cached_programs(channel_id, programs)

        if programs is not None:
            channel.programs = programs

        return await self._async_browse_programs_with_replays(data, channel_id)

    async def _async_browse_programs_with_replays(
        self, data: EpgData, channel_id: str
    ) -> BrowseMedia:
        channel = find_channel(data, channel_id)
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
        if find_current_program(channel, now) is None:
            children.append(
                BrowseMedia(
                    title=f"▶ Direct - {channel.label}",
                    media_class=MediaClass.CHANNEL,
                    media_content_id=f"{MEDIA_LIVE_PREFIX}:{channel.channel_id}",
                    media_content_type=MEDIA_LIVE_PREFIX,
                    can_play=False,
                    can_expand=True,
                    thumbnail=channel.poster,
                )
            )

        for program in channel.programs:
            start_ts = int(program.start.timestamp())
            end_ts = int(program.end.timestamp())

            if program.start <= now < program.end:
                status = "🔴 "
            elif program.end <= now:
                status = "⏪ "
            else:
                status = ""

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

        replays = await async_fetch_channel_replays(self._api, channel_id, data)
        if replays:
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
            for asset in replays:
                payload_data = {
                    "url": asset.asset_url,
                    "title": asset.title,
                    "live": asset.is_live,
                }
                if asset.program_id:
                    payload_data["program_id"] = asset.program_id
                if asset.channel_id:
                    payload_data["channel_id"] = asset.channel_id

                payload = encode_asset_payload(payload_data)
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

    async def _async_browse_cast_targets(
        self, data: EpgData, base_media_id: str
    ) -> BrowseMedia:
        title = "Sélectionner un Chromecast"
        thumbnail = None
        if base_media_id.startswith(f"{MEDIA_PROGRAM_PREFIX}:"):
            parts = base_media_id.split(":")
            if len(parts) >= 4:
                channel_id = parts[1]
                start_ts = int(parts[2])
                program = find_program(data, channel_id, start_ts)
                if program:
                    title = program.title
                    if program.episode_title:
                        title = f"{title} - {program.episode_title}"
                    thumbnail = program.thumbnail or program.poster
        elif base_media_id.startswith(f"{MEDIA_LIVE_PREFIX}:"):
            channel_id = base_media_id.split(":", 1)[1]
            channel = find_channel(data, channel_id)
            if channel:
                title = f"Direct - {channel.label}"
                thumbnail = channel.poster
        elif base_media_id.startswith(
            (
                f"{MEDIA_REPLAY_PREFIX}:",
                f"{MEDIA_RECORDING_PREFIX}:",
                f"{MEDIA_SEARCH_RESULT_PREFIX}:",
                f"{MEDIA_EPISODE_PREFIX}:",
            )
        ):
            payload = decode_asset_payload_from_media_id(base_media_id)
            if payload:
                title = payload.get("title") or title
                thumbnail = payload.get("thumb")

        targets = await self._async_get_cast_targets()
        if not targets:
            targets = []

        children: list[BrowseMedia] = []

        children.append(
            BrowseMedia(
                title="Lire sur cet appareil",
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
                native_options.append(
                    BrowseMedia(
                        title=f"Caster sur {name} (Molotov)",
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
                custom_options.append(
                    BrowseMedia(
                        title=f"Caster sur {name} (Arnor)",
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
                native_options.append(
                    BrowseMedia(
                        title=f"Caster sur {name}",
                        media_class=MediaClass.VIDEO,
                        media_content_id=(
                            f"{MEDIA_CAST_PREFIX}:{encoded_target}:{base_media_id}"
                        ),
                        media_content_type=MEDIA_CAST_PREFIX,
                        can_play=True,
                        can_expand=False,
                    )
                )

        if native_options:
            children.append(
                BrowseMedia(
                    title="Récepteur officiel",
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
                    title="Récepteur Arnor",
                    media_class=MediaClass.CHANNEL,
                    media_content_id="separator:custom",
                    media_content_type="separator",
                    can_play=False,
                    can_expand=False,
                )
            )
            children.extend(custom_options)

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

    @property
    def media_position(self) -> float | None:
        """Return current playback position in seconds."""
        return self._media_position

    @property
    def media_duration(self) -> float | None:
        """Return total media duration in seconds."""
        return self._media_duration

    @property
    def media_position_updated_at(self) -> datetime | None:
        """Return when position was last updated."""
        return self._media_position_updated_at

    @property
    def volume_level(self) -> float | None:
        """Return the volume level (0.0 to 1.0)."""
        return self._volume_level

    @property
    def is_volume_muted(self) -> bool:
        """Return True if volume is muted."""
        return self._is_volume_muted

    async def async_select_sound_mode(self, sound_mode: str) -> None:
        """Select sound mode."""
        info = self._tracks.get(sound_mode)
        if info is not None and self._active_cast_target:
            await async_cast_select_track(
                self.hass, self._active_cast_target, info["id"]
            )

    def _on_cast_status(self, status: Any) -> None:
        """Handle cast status updates."""
        if not status:
            return

        # Update media position and duration
        current_time = getattr(status, "current_time", None)
        duration = getattr(status, "duration", None)

        if current_time is not None:
            self._media_position = float(current_time)
            self._media_position_updated_at = dt_util.utcnow()

        if duration is not None and duration > 0:
            self._media_duration = float(duration)

        # Update player state from cast status
        player_state = getattr(status, "player_state", None)
        if player_state == "PLAYING":
            self._attr_state = STATE_PLAYING
        elif player_state == "PAUSED":
            self._attr_state = STATE_PAUSED
        elif player_state == "IDLE" and self._active_cast_target:
            # Media finished or stopped
            self._attr_state = STATE_IDLE
            self._media_position = None
            self._media_duration = None
            self._media_position_updated_at = None

        # Handle track information
        raw_tracks = getattr(status, "tracks", [])
        active_ids = getattr(status, "active_track_ids", [])

        if raw_tracks:
            new_tracks = {}
            for track in raw_tracks:
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

            if active_ids:
                for t_name, info in new_tracks.items():
                    if info["id"] in active_ids and "Audio" in t_name:
                        self._current_track_id = info["id"]
                        break

        self.schedule_update_ha_state()

    async def _async_cast_media(
        self,
        media_id: str,
        cast_target_override: str | None,
        receiver_type: str = "native",
    ) -> None:
        # Acquire stream slot before starting playback
        self._acquire_stream_slot()

        await self._api.async_ensure_logged_in()

        cast_target = cast_target_override
        if not cast_target:
            targets = await self._async_get_cast_targets()
            if len(targets) == 1:
                cast_target = targets[0]
        resolved_target = self._resolve_cast_target(cast_target)
        if not resolved_target:
            self._release_stream_slot()
            if cast_target:
                raise HomeAssistantError(
                    "Chromecast host was not available for the selected target"
                )
            raise HomeAssistantError(
                "No Chromecast target configured in Molotov TV options"
            )

        asset_url, title, is_live = self._build_cast_request(media_id)
        custom_data = self._build_cast_custom_data(asset_url)

        use_custom = (receiver_type == "custom") and (
            CUSTOM_RECEIVER_APP_ID is not None
        )

        if use_custom:
            _LOGGER.debug("Using custom receiver: %s", CUSTOM_RECEIVER_APP_ID)
            app_id = CUSTOM_RECEIVER_APP_ID

            try:
                _LOGGER.debug("Resolving asset stream locally for custom receiver...")
                asset_data = await self._api.async_get_asset_stream(asset_url)

                stream = asset_data.get("stream", {})
                stream_url = stream.get("url")
                if not stream_url:
                    raise MolotovApiError("No stream URL found in asset response")

                asset_url = stream_url

                drm = asset_data.get("drm", {})
                license_url = drm.get("license_url")
                token = drm.get("token")

                if license_url and token:
                    custom_data["license_url"] = license_url
                    custom_data["drm_token"] = token
                    custom_data["stream_url"] = stream_url

                    custom_data["merchant"] = drm.get("merchant")
                    custom_data["user_id"] = drm.get("user_id")
                    custom_data["session_id"] = drm.get("session_id")
                    custom_data["asset_id"] = drm.get("asset_id")

                    _LOGGER.debug(
                        "Added DRM info to custom_data: %s", list(custom_data.keys())
                    )

                config = asset_data.get("config", {})
                selected_track = config.get("selected_track", {})
                if selected_track:
                    custom_data["selected_track"] = selected_track
                    _LOGGER.debug("Added selected_track preference: %s", selected_track)

                video_format = stream.get("video_format")
                if video_format == "DASH":
                    custom_data["content_type"] = "application/dash+xml"
                elif video_format == "HLS":
                    custom_data["content_type"] = "application/x-mpegurl"

            except MolotovApiError as err:
                self._release_stream_slot()
                _LOGGER.error("Failed to resolve stream for custom receiver: %s", err)
                message = err.user_message or str(err)
                raise HomeAssistantError(f"Échec de lecture: {message}") from err
            except Exception as err:
                self._release_stream_slot()
                _LOGGER.error("Failed to resolve stream for custom receiver: %s", err)
                raise HomeAssistantError(f"Échec de lecture: {err}") from err
        else:
            app_id = self._api.session_state.cast_app_id
            if not app_id:
                self._release_stream_slot()
                raise HomeAssistantError("Molotov cast app id is not available")

        content_type = (
            custom_data.get("content_type") or self._api.stream_content_type()
        )

        _LOGGER.debug(
            "Casting to %s: app_id=%s, asset_url=%s, content_type=%s, title=%s, is_live=%s",
            resolved_target,
            app_id,
            asset_url[:100],
            content_type,
            title,
            is_live,
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
            self._active_cast_target = resolved_target
            self._active_cast_entity = self._find_cast_entity(resolved_target)
            self._attr_state = STATE_PLAYING
            self._attr_media_title = title
            self._cast_connected = True
            self._cast_connection_error = None
            self._current_content_id = media_id
            self._current_is_live = is_live
            # Initialize position (will be updated by status callback)
            self._media_position = 0.0
            self._media_position_updated_at = dt_util.utcnow()
            self._media_duration = None  # Will be set by status callback

            # Get initial volume from Chromecast
            volume_info = await async_get_cast_volume(self.hass, resolved_target)
            if volume_info:
                self._volume_level, self._is_volume_muted = volume_info

            await async_cast_register_listener(
                self.hass, resolved_target, self._on_cast_status
            )
            await self._async_start_health_monitor()

            # Check for resume position (VOD only)
            if not is_live:
                resume_data = await self._resume_store.async_get_position(media_id)
                if resume_data:
                    saved_position = resume_data.get("position", 0)
                    if saved_position > 0:
                        _LOGGER.info(
                            "Resuming %s at position %.1f",
                            title,
                            saved_position,
                        )
                        # Small delay to let cast stabilize
                        await asyncio.sleep(1)
                        await async_cast_seek(
                            self.hass, resolved_target, saved_position
                        )

            self.async_write_ha_state()
            _LOGGER.debug(
                "Cast started, tracking entity: %s (target: %s)",
                self._active_cast_entity,
                resolved_target,
            )
        except MolotovCastError as err:
            self._release_stream_slot()
            raise HomeAssistantError(str(err)) from err

    def _find_cast_entity(self, host: str) -> str | None:
        """Find the media_player entity ID for a Chromecast host."""
        _LOGGER.debug("Looking for cast entity with host %s", host)

        for entity_id in self.hass.states.async_entity_ids("media_player"):
            state = self.hass.states.get(entity_id)
            if not state:
                continue

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

            if "cast" in entity_id or attrs.get("app_id"):
                resolved = self._resolve_cast_target(entity_id)
                _LOGGER.debug(
                    "Checking entity %s: resolved=%s, target=%s",
                    entity_id,
                    resolved,
                    host,
                )
                if resolved == host:
                    _LOGGER.debug("Found cast entity %s by resolution", entity_id)
                    return entity_id

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
                entry.entity_id,
                resolved,
                host,
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
            service,
            self._active_cast_entity,
            self._active_cast_target,
        )

        if not self._active_cast_entity:
            if self._active_cast_target:
                self._active_cast_entity = self._find_cast_entity(
                    self._active_cast_target
                )
                _LOGGER.debug("Re-found cast entity: %s", self._active_cast_entity)

            if not self._active_cast_entity:
                _LOGGER.warning(
                    "No active cast entity to control (target=%s)",
                    self._active_cast_target,
                )
                return

        state = self.hass.states.get(self._active_cast_entity)
        _LOGGER.debug(
            "Cast entity state: %s (state=%s)",
            self._active_cast_entity,
            state.state if state else "None",
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
        # Save position for resume (will be implemented with resume store)
        if self._active_cast_target and not self._current_is_live:
            position_data = await async_get_cast_position(
                self.hass, self._active_cast_target
            )
            if position_data:
                position, duration = position_data
                _LOGGER.debug(
                    "Saving position %.1f/%.1f for %s",
                    position,
                    duration,
                    self._current_content_id,
                )
                await self._resume_store.async_save_position(
                    self._current_content_id,
                    position,
                    duration,
                    self._attr_media_title,
                )

        if self._active_cast_target:
            await async_cast_stop(self.hass, self._active_cast_target)
        await self._async_stop_health_monitor()
        self._active_cast_entity = None
        self._active_cast_target = None
        self._current_stream = None
        self._cast_connected = False
        self._cast_connection_error = None
        self._current_content_id = None
        self._current_is_live = False
        self._media_position = None
        self._media_duration = None
        self._media_position_updated_at = None
        self._volume_level = None
        self._is_volume_muted = False
        self._attr_state = STATE_IDLE
        # Release stream slot when stopping playback
        self._release_stream_slot()
        self.async_write_ha_state()

    async def async_media_next_track(self) -> None:
        """Skip forward 30 seconds."""
        if self._active_cast_target:
            await async_cast_skip_forward(self.hass, self._active_cast_target, 30)

    async def async_media_previous_track(self) -> None:
        """Restart from beginning, or skip back 30s if already at start."""
        if self._active_cast_target:
            # If more than 5 seconds in, restart from beginning
            if self._media_position and self._media_position > 5:
                await async_cast_seek(self.hass, self._active_cast_target, 0)
                self._media_position = 0
                self._media_position_updated_at = dt_util.utcnow()
                self.async_write_ha_state()
            else:
                # Already near start, skip back further
                await async_cast_skip_back(self.hass, self._active_cast_target, 30)

    async def async_media_seek(self, position: float) -> None:
        """Send seek command to active cast."""
        if self._active_cast_target:
            await async_cast_seek(self.hass, self._active_cast_target, position)
            # Update local position immediately for responsive UI
            self._media_position = position
            self._media_position_updated_at = dt_util.utcnow()
            self.async_write_ha_state()

    async def async_set_volume_level(self, volume: float) -> None:
        """Set volume level on active cast."""
        if self._active_cast_target:
            await async_cast_volume(self.hass, self._active_cast_target, volume)
            # Update local state immediately for responsive UI
            self._volume_level = volume
            self.async_write_ha_state()

    async def async_volume_up(self) -> None:
        """Turn volume up on active cast."""
        if self._active_cast_target:
            await async_cast_volume_up(self.hass, self._active_cast_target)
            # Update local state (estimate +10%)
            if self._volume_level is not None:
                self._volume_level = min(1.0, self._volume_level + 0.1)
                self.async_write_ha_state()

    async def async_volume_down(self) -> None:
        """Turn volume down on active cast."""
        if self._active_cast_target:
            await async_cast_volume_down(self.hass, self._active_cast_target)
            # Update local state (estimate -10%)
            if self._volume_level is not None:
                self._volume_level = max(0.0, self._volume_level - 0.1)
                self.async_write_ha_state()

    async def async_mute_volume(self, mute: bool) -> None:
        """Mute/unmute active cast."""
        if self._active_cast_target:
            await async_cast_mute(self.hass, self._active_cast_target, mute)
            # Update local state immediately for responsive UI
            self._is_volume_muted = mute
            self.async_write_ha_state()

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

            program = find_program(
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
            channel = find_channel(self.coordinator.data, channel_id)
            title = channel.label if channel else None
            asset_url = self._api.build_asset_url("channel", channel_id)
            return asset_url, title, True

        if (
            media_id.startswith(f"{MEDIA_REPLAY_PREFIX}:")
            or media_id.startswith(f"{MEDIA_RECORDING_PREFIX}:")
            or media_id.startswith(f"{MEDIA_SEARCH_RESULT_PREFIX}:")
            or media_id.startswith(f"{MEDIA_EPISODE_PREFIX}:")
        ):
            payload = decode_asset_payload_from_media_id(media_id)
            if not payload:
                raise HomeAssistantError(
                    "Invalid replay, recording, episode, or search result identifier"
                )
            asset_url = payload.get("url")
            if not isinstance(asset_url, str) or not asset_url:
                raise HomeAssistantError("Asset URL is missing")
            title = payload.get("title")
            is_live = bool(payload.get("live", False))
            return asset_url, title, is_live

        if media_id.startswith(f"{MEDIA_CHANNEL_PREFIX}:"):
            channel_id = media_id.split(":", 1)[1]
            channel = find_channel(self.coordinator.data, channel_id)
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
        expired = [
            cid
            for cid, (fetched_at, _) in self._program_cache.items()
            if now - fetched_at > PROGRAM_CACHE_TTL
        ]
        for cid in expired:
            self._program_cache.pop(cid, None)
        while len(self._program_cache) >= MAX_PROGRAM_CACHE_SIZE:
            oldest_id = min(
                self._program_cache, key=lambda k: self._program_cache[k][0]
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

    async def _async_get_cast_targets(self) -> list[str]:
        targets: list[str] = []

        discovered_targets = await self._async_discover_cast_targets()
        _LOGGER.debug("Cast targets from zeroconf discovery: %s", discovered_targets)

        discovered_hosts: set[str] = set()
        for target in discovered_targets:
            _, host = split_manual_target(target)
            if host:
                discovered_hosts.add(host)

        registry_targets = self._discover_cast_targets()
        _LOGGER.debug("Cast targets from entity registry: %s", registry_targets)
        for target in registry_targets:
            resolved = self._resolve_cast_target(target)
            if resolved and resolved in discovered_hosts:
                if target not in targets:
                    targets.append(target)
                    _LOGGER.debug(
                        "Including registry target %s (host %s is on network)",
                        target,
                        resolved,
                    )
            else:
                _LOGGER.debug(
                    "Skipping registry target %s (host %s not discovered)",
                    target,
                    resolved,
                )

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
        return parse_manual_targets(raw_hosts)

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
                discover_cast_targets_blocking, zconf
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
            if state.state in ("unavailable", "unknown"):
                _LOGGER.debug(
                    "Skipping unavailable cast entity: %s (state=%s)",
                    entry.entity_id,
                    state.state,
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
        alias, host = split_manual_target(cast_target)
        return alias or host

    def _resolve_cast_target(self, cast_target: str | None) -> str | None:
        if not cast_target:
            return None
        alias, host = split_manual_target(cast_target)
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
        host_from_info = extract_host_from_device_info(device_info)
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
                host = extract_host_from_device_registry(
                    self.hass, registry_entry.device_id
                )
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
