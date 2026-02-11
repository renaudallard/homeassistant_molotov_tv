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
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .api import MolotovApi, MolotovApiError
from .const import DEFAULT_SCAN_INTERVAL
from .helpers import extract_image_from_bundle, parse_epg_programs, parse_timestamp
from .models import EpgChannel, EpgData, EpgProgram

_LOGGER = logging.getLogger(__name__)


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
        # - live/sections: currently-airing programs (items are programs, not channels)
        # - EPG feed: programs for ~30 channels (backup)
        channels_task = asyncio.create_task(self.api.async_get_channels())
        live_task = asyncio.create_task(self.api.async_get_live_home_channels())
        epg_task = asyncio.create_task(self.api.async_get_epg())

        channels_raw = await channels_task
        channels_data = _parse_epg(channels_raw)

        _LOGGER.debug(
            "Channels endpoint: %d channels, %d with programs, %d with poster",
            len(channels_data.channels),
            sum(1 for c in channels_data.channels if c.programs),
            sum(1 for c in channels_data.channels if c.poster),
        )

        channels_by_id = {c.channel_id: c for c in channels_data.channels}

        # Merge live/sections: items are programs grouped by channel_id
        try:
            live_raw = await live_task
            live_programs = _parse_live_sections(live_raw)
            live_matched = 0
            live_merged = 0
            for channel_id, programs in live_programs.items():
                existing = channels_by_id.get(channel_id)
                if existing is None:
                    continue
                live_matched += 1
                if not existing.programs and programs:
                    existing.programs = programs
                    live_merged += 1
            _LOGGER.debug(
                "live/sections: %d channel_ids, %d matched, %d got programs",
                len(live_programs),
                live_matched,
                live_merged,
            )
        except MolotovApiError as err:
            _LOGGER.warning("live/sections fetch failed: %s", err)

        # Merge EPG feed (backup, ~30 channels with full schedules)
        try:
            epg_raw = await epg_task
            source = _parse_epg(epg_raw)
            epg_matched = 0
            epg_merged_programs = 0
            epg_merged_poster = 0
            for src_ch in source.channels:
                existing = channels_by_id.get(src_ch.channel_id)
                if existing is None:
                    continue
                epg_matched += 1
                if not existing.programs and src_ch.programs:
                    existing.programs = src_ch.programs
                    epg_merged_programs += 1
                if existing.poster is None and src_ch.poster is not None:
                    existing.poster = src_ch.poster
                    epg_merged_poster += 1
                if not existing.label and src_ch.label:
                    existing.label = src_ch.label
            _LOGGER.debug(
                "EPG: %d channels, %d matched, %d got programs, %d got poster",
                len(source.channels),
                epg_matched,
                epg_merged_programs,
                epg_merged_poster,
            )
        except MolotovApiError as err:
            _LOGGER.warning("EPG fetch failed: %s", err)

        _LOGGER.debug(
            "Final coordinator data: %d channels, %d with programs, %d with poster",
            len(channels_data.channels),
            sum(1 for c in channels_data.channels if c.programs),
            sum(1 for c in channels_data.channels if c.poster),
        )

        return channels_data


def _parse_live_sections(data: dict[str, Any]) -> dict[str, list[EpgProgram]]:
    """Parse live/sections response where items are programs, not channels.

    Returns a dict mapping channel_id -> list of EpgProgram.
    """
    programs_by_channel: dict[str, list[EpgProgram]] = {}

    for item in _extract_channel_entries(data):
        channel_id = _extract_live_item_channel_id(item)
        if channel_id is None:
            continue

        # Extract timing from video object
        video = item.get("video")
        if isinstance(video, dict):
            start = parse_timestamp(video.get("start_at") or video.get("start"))
            end = parse_timestamp(video.get("end_at") or video.get("end"))
        else:
            start = parse_timestamp(item.get("start_at") or item.get("start"))
            end = parse_timestamp(item.get("end_at") or item.get("end"))

        if start is None or end is None:
            continue

        title = item.get("title") or item.get("name") or "Untitled"
        episode_title = (
            item.get("episodeTitle")
            or item.get("episode_title")
            or item.get("subtitle")
        )
        if not episode_title:
            formatter = item.get("subtitle_formatter") or item.get("subtitleFormatter")
            if isinstance(formatter, dict):
                episode_title = formatter.get("format")

        description = item.get("description")
        if not description:
            formatter = item.get("description_formatter")
            if isinstance(formatter, dict):
                description = formatter.get("format")

        thumbnail = _extract_image_url(item)
        poster = _extract_image_url(item, prefer_poster=True)

        program = EpgProgram(
            title=title,
            start=start,
            end=end,
            description=description,
            episode_title=episode_title,
            thumbnail=thumbnail,
            poster=poster,
        )

        programs_by_channel.setdefault(channel_id, []).append(program)

    return programs_by_channel


def _extract_live_item_channel_id(item: dict[str, Any]) -> str | None:
    """Extract channel_id from a live/sections program item."""
    video = item.get("video")
    if isinstance(video, dict):
        channel_id = video.get("channel_id") or video.get("channelId")
        if channel_id is not None:
            return str(channel_id)

    metadata = item.get("metadata")
    if isinstance(metadata, dict):
        channel_id = metadata.get("channel_id") or metadata.get("channelId")
        if channel_id is not None:
            return str(channel_id)

    channel = item.get("channel")
    if isinstance(channel, dict):
        channel_id = channel.get("id")
        if channel_id is not None:
            return str(channel_id)

    return None


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
    programs = (
        parse_epg_programs(programs_payload)
        if isinstance(programs_payload, list)
        else []
    )

    return EpgChannel(
        channel_id=channel_id,
        label=label,
        display_number=display_number,
        poster=poster,
        programs=programs,
    )


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
        url = extract_image_from_bundle(bundle.get(key))
        if url:
            return url
    for value in bundle.values():
        url = extract_image_from_bundle(value)
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
                url = extract_image_from_bundle(bundle.get(key))
                if url:
                    return url
            for value in bundle.values():
                url = extract_image_from_bundle(value)
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
