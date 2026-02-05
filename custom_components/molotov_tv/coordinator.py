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

"""Coordinator for Molotov TV EPG data."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import datetime
import json
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .api import MolotovApi, MolotovApiError
from .const import DEFAULT_SCAN_INTERVAL

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class EpgProgram:
    """Represents a single EPG program entry."""

    title: str
    start: datetime
    end: datetime
    description: str | None = None
    episode_title: str | None = None
    thumbnail: str | None = None
    poster: str | None = None


@dataclass(slots=True)
class EpgChannel:
    """Represents an EPG channel entry."""

    channel_id: str
    label: str
    display_number: int | None = None
    poster: str | None = None
    programs: list[EpgProgram] = field(default_factory=list)


@dataclass(slots=True)
class EpgData:
    """Container for all EPG data."""

    channels: list[EpgChannel]


class MolotovEpgCoordinator(DataUpdateCoordinator[EpgData]):
    """Coordinator for Molotov TV EPG updates."""

    def __init__(self, hass: HomeAssistant, api: MolotovApi) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name="molotov_tv_epg",
            update_interval=DEFAULT_SCAN_INTERVAL,
        )
        self.api = api

    async def _async_update_data(self) -> EpgData:
        # Fetch all 3 sources in parallel:
        # - channels-subbed: 203 channels with posters, 0 programs
        # - live/sections: programs for many/all channels
        # - EPG feed: programs for ~30 channels (backup)
        channels_task = asyncio.create_task(self.api.async_get_channels())
        live_task = asyncio.create_task(self.api.async_get_live_home_channels())
        epg_task = asyncio.create_task(self.api.async_get_epg())

        channels_raw = await channels_task

        # --- DEBUG: dump raw channels-subbed structure ---
        _LOGGER.debug(
            "DEBUG channels-subbed raw type=%s",
            type(channels_raw).__name__,
        )
        if isinstance(channels_raw, dict):
            _LOGGER.debug(
                "DEBUG channels-subbed top-level keys=%s",
                list(channels_raw.keys()),
            )
        _ch_entries = _extract_channel_entries(channels_raw)
        _LOGGER.debug(
            "DEBUG channels-subbed extracted %d entries, first 2:\n%s",
            len(_ch_entries),
            "\n---\n".join(
                json.dumps(e, default=str)[:500] for e in _ch_entries[:2]
            ),
        )
        # --- END DEBUG ---

        channels_data = _parse_epg(channels_raw)

        _LOGGER.debug(
            "Channels endpoint: %d channels, %d with programs, %d with poster",
            len(channels_data.channels),
            sum(1 for c in channels_data.channels if c.programs),
            sum(1 for c in channels_data.channels if c.poster),
        )

        channels_by_id = {
            c.channel_id: c for c in channels_data.channels
        }

        # --- DEBUG: dump first 5 channel IDs from base set ---
        _base_ids = list(channels_by_id.keys())[:5]
        _LOGGER.debug(
            "DEBUG channels_by_id first 5 IDs (total %d): %s",
            len(channels_by_id),
            _base_ids,
        )
        # --- END DEBUG ---

        # Merge live/sections first (likely has programs for most channels)
        for label, task in (("live/sections", live_task), ("EPG", epg_task)):
            try:
                raw = await task

                # --- DEBUG: dump raw source structure ---
                _LOGGER.debug(
                    "DEBUG %s raw type=%s",
                    label,
                    type(raw).__name__,
                )
                if isinstance(raw, dict):
                    _LOGGER.debug(
                        "DEBUG %s top-level keys=%s",
                        label,
                        list(raw.keys()),
                    )
                _src_entries = _extract_channel_entries(raw)
                _LOGGER.debug(
                    "DEBUG %s extracted %d entries, first 2:\n%s",
                    label,
                    len(_src_entries),
                    "\n---\n".join(
                        json.dumps(e, default=str)[:500]
                        for e in _src_entries[:2]
                    ),
                )
                # --- END DEBUG ---

                source = _parse_epg(raw)

                # --- DEBUG: dump first 3 parsed channel IDs from source ---
                _src_ids = [c.channel_id for c in source.channels[:3]]
                _LOGGER.debug(
                    "DEBUG %s parsed %d channels, first 3 IDs: %s",
                    label,
                    len(source.channels),
                    _src_ids,
                )
                matched = 0
                merged_programs = 0
                merged_poster = 0
                for src_ch in source.channels:
                    existing = channels_by_id.get(src_ch.channel_id)
                    if existing is None:
                        continue
                    matched += 1
                    if not existing.programs and src_ch.programs:
                        existing.programs = src_ch.programs
                        merged_programs += 1
                    if existing.poster is None and src_ch.poster is not None:
                        existing.poster = src_ch.poster
                        merged_poster += 1
                    if not existing.label and src_ch.label:
                        existing.label = src_ch.label
                _LOGGER.debug(
                    "%s: %d channels, %d matched, %d got programs, %d got poster",
                    label, len(source.channels), matched,
                    merged_programs, merged_poster,
                )
            except MolotovApiError as err:
                _LOGGER.warning("%s fetch failed: %s", label, err)

        _LOGGER.debug(
            "Final coordinator data: %d channels, %d with programs, %d with poster",
            len(channels_data.channels),
            sum(1 for c in channels_data.channels if c.programs),
            sum(1 for c in channels_data.channels if c.poster),
        )

        return channels_data


def _parse_epg(data: dict[str, Any]) -> EpgData:
    channels: dict[str, EpgChannel] = {}

    for channel_data in _extract_channel_entries(data):
        parsed = _parse_channel_entry(channel_data)
        if parsed is None:
            continue
        existing = channels.get(parsed.channel_id)
        if existing is None:
            channels[parsed.channel_id] = parsed
            continue
        if existing.display_number is None and parsed.display_number is not None:
            existing.display_number = parsed.display_number
        if existing.poster is None and parsed.poster is not None:
            existing.poster = parsed.poster
        if not existing.programs and parsed.programs:
            existing.programs = parsed.programs

    channel_list = list(channels.values())
    channel_list.sort(
        key=lambda item: (item.display_number is None, item.display_number)
    )
    return EpgData(channels=channel_list)


def _extract_channel_entries(data: Any) -> list[dict[str, Any]]:
    if isinstance(data, list):
        return [item for item in data if isinstance(item, dict)]
    if not isinstance(data, dict):
        return []
    channels = data.get("channels")
    if isinstance(channels, list):
        return [item for item in channels if isinstance(item, dict)]
    nested = data.get("data")
    if isinstance(nested, (dict, list)):
        return _extract_channel_entries(nested)
    items = data.get("items")
    if isinstance(items, list):
        return [item for item in items if isinstance(item, dict)]
    sections = data.get("sections")
    if isinstance(sections, list):
        entries: list[dict[str, Any]] = []
        for section in sections:
            if not isinstance(section, dict):
                continue
            section_items = section.get("items")
            if isinstance(section_items, list):
                entries.extend(
                    [item for item in section_items if isinstance(item, dict)]
                )
        return entries
    return []


def _parse_channel_entry(entry: dict[str, Any]) -> EpgChannel | None:
    channel_payload = entry.get("channel")
    if isinstance(channel_payload, dict):
        channel = channel_payload
    else:
        channel = entry

    metadata = channel.get("metadata")
    if not isinstance(metadata, dict):
        metadata = {}

    raw_channel_id = (
        channel.get("id")
        or channel.get("channel_id")
        or channel.get("channelId")
        or metadata.get("channel_id")
        or entry.get("channel_id")
        or entry.get("channelId")
    )
    if raw_channel_id is None:
        return None
    channel_id = str(raw_channel_id)

    label = (
        channel.get("label")
        or channel.get("title")
        or channel.get("name")
        or metadata.get("channel_name")
        or metadata.get("channel_title")
        or channel_id
    )

    display_number = _coerce_int(
        channel.get("displayNumber")
        or channel.get("display_number")
        or metadata.get("displayNumber")
    )

    poster = _extract_channel_logo(channel, entry)

    programs_payload = channel.get("programs")
    if not isinstance(programs_payload, list):
        programs_payload = entry.get("programs")
    programs = _parse_program_entries(programs_payload)

    return EpgChannel(
        channel_id=channel_id,
        label=label,
        display_number=display_number,
        poster=poster,
        programs=programs,
    )


def _parse_program_entries(programs: Any) -> list[EpgProgram]:
    if not isinstance(programs, list):
        return []
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
                or _extract_image_url(program),
                poster=program.get("poster")
                or program.get("posterUrl")
                or _extract_image_url(program, prefer_poster=True),
            )
        )
    return parsed


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


def _coerce_int(value: Any) -> int | None:
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.isdigit():
        return int(value)
    return None


def _extract_image_url(
    payload: dict[str, Any], *, prefer_poster: bool = False
) -> str | None:
    for key in ("poster", "posterUrl", "logo", "logoUrl", "thumbnail", "thumbnailUrl"):
        url = payload.get(key)
        if isinstance(url, str) and url:
            return url

    bundle = payload.get("image_bundle") or payload.get("imageBundle")
    if not isinstance(bundle, dict):
        return None

    if prefer_poster:
        preferred = ("poster_with_channel", "poster", "poster_tv", "landscape")
    else:
        preferred = (
            "logo_light",
            "logo_16_9",
            "poster_with_channel",
            "poster",
            "landscape",
        )
    for key in preferred:
        url = _extract_image_from_bundle(bundle.get(key))
        if url:
            return url
    for value in bundle.values():
        url = _extract_image_from_bundle(value)
        if url:
            return url
    return None


def _extract_channel_logo(channel: dict[str, Any], entry: dict[str, Any]) -> str | None:
    for payload in (channel, entry):
        if not isinstance(payload, dict):
            continue
        bundle = payload.get("image_bundle") or payload.get("imageBundle")
        if isinstance(bundle, dict):
            for key in (
                "logo_16_9",
                "landscape_with_channel",
                "poster_with_channel",
                "landscape",
                "poster",
                "logo_light",
                "logo",
            ):
                url = _extract_image_from_bundle(bundle.get(key))
                if url:
                    return url
            for value in bundle.values():
                url = _extract_image_from_bundle(value)
                if url:
                    return url

    for payload in (channel, entry):
        if not isinstance(payload, dict):
            continue
        for key in (
            "poster",
            "posterUrl",
            "thumbnail",
            "thumbnailUrl",
            "logo",
            "logoUrl",
        ):
            url = payload.get(key)
            if isinstance(url, str) and url:
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
