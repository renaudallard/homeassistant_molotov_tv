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

"""Helper functions for Molotov TV media player."""

from __future__ import annotations

import base64
from datetime import datetime, timedelta
import json
import logging
import re
from typing import Any
from urllib.parse import parse_qs, urlparse

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .api import MolotovApi
from .coordinator import EpgChannel, EpgData, EpgProgram
from .models import BrowseAsset

_LOGGER = logging.getLogger(__name__)


# --- Encoding/Decoding helpers ---


def parse_manual_targets(raw_hosts: Any) -> list[str]:
    """Parse manual cast targets from config option."""
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


def split_manual_target(value: str) -> tuple[str | None, str]:
    """Split a manual target into (alias, host)."""
    trimmed = value.strip()
    for sep in ("=", "@"):
        if sep in trimmed:
            name, host = trimmed.split(sep, 1)
            name = name.strip()
            host = host.strip()
            if name and host:
                return name, host
    return None, trimmed


def encode_asset_payload(payload: dict[str, Any]) -> str:
    """Encode asset payload as URL-safe base64."""
    raw = json.dumps(payload, separators=(",", ":"), ensure_ascii=True).encode("utf-8")
    encoded = base64.urlsafe_b64encode(raw).decode("ascii")
    return encoded.rstrip("=")


def decode_asset_payload(encoded: str) -> dict[str, Any] | None:
    """Decode asset payload from URL-safe base64."""
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


def decode_asset_payload_from_media_id(media_id: str) -> dict[str, Any] | None:
    """Extract and decode asset payload from media ID."""
    parts = media_id.split(":", 1)
    if len(parts) != 2:
        return None
    return decode_asset_payload(parts[1])


# --- Section/Item extraction helpers ---


def extract_sections(data: Any) -> list[dict[str, Any]]:
    """Extract sections from API response data."""
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
        return extract_sections(nested)
    return []


def extract_item_payload(item: dict[str, Any]) -> dict[str, Any]:
    """Extract the payload from an item, handling nested data."""
    data = item.get("data")
    if isinstance(data, dict):
        return data
    return item


def extract_item_actions(
    item: dict[str, Any], payload: dict[str, Any]
) -> dict[str, Any]:
    """Extract actions from an item or its payload."""
    actions = payload.get("actions")
    if isinstance(actions, dict):
        return actions
    actions = item.get("actions")
    if isinstance(actions, dict):
        return actions
    return {}


def extract_section_items(data: dict[str, Any]) -> list[dict[str, Any]]:
    """Extract items from a section or nested structure."""
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


# --- URL parsing helpers ---


def parse_asset_reference_from_url(url: str | None) -> tuple[str, str, bool] | None:
    """Parse asset type, id, and start_over from a URL."""
    if not url:
        return None
    parsed = urlparse(url)
    if not parsed.query:
        return None
    params = parse_qs(parsed.query)
    asset_id = first_query_value(params.get("id"))
    asset_type = first_query_value(params.get("type"))
    if not asset_id or not asset_type:
        return None
    start_over = coerce_bool(first_query_value(params.get("start_over")))
    return asset_type, asset_id, start_over


def parse_channel_id_from_url(url: str | None) -> str | None:
    """Extract channel ID from a URL."""
    if not url:
        return None
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    for key in ("channel_id", "channelId"):
        value = first_query_value(params.get(key))
        if value:
            return value
    match = re.search(r"/channels/([^/]+)", parsed.path or "")
    if match:
        return match.group(1)
    return None


def extract_channel_id_from_actions(actions: dict[str, Any]) -> str | None:
    """Extract channel ID from action URLs."""
    for action in actions.values():
        if not isinstance(action, dict):
            continue
        channel_id = parse_channel_id_from_url(action.get("url"))
        if channel_id:
            return channel_id
    return None


def first_query_value(values: list[str] | None) -> str | None:
    """Get first non-empty value from query parameter list."""
    if not values:
        return None
    value = values[0]
    if isinstance(value, str) and value:
        return value
    return None


def coerce_bool(value: str | None) -> bool:
    """Coerce a string value to boolean."""
    if not value:
        return False
    if isinstance(value, str):
        return value.strip().lower() in ("1", "true", "yes", "y")
    return bool(value)


# --- Asset reference extraction ---


def extract_asset_reference(item: dict[str, Any]) -> tuple[str, str, bool] | None:
    """Extract asset type, id, and start_over from an item."""
    payload = extract_item_payload(item)
    actions = extract_item_actions(item, payload)

    # First try to get from play/cast action URLs
    for key in ("play", "play_start_over", "cast", "cast_start_over"):
        action = actions.get(key)
        if not isinstance(action, dict):
            continue
        ref = parse_asset_reference_from_url(action.get("url"))
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


# --- Image extraction ---


def extract_item_image(
    payload: dict[str, Any], *, prefer_poster: bool = False
) -> str | None:
    """Extract image URL from item payload."""
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
        url = extract_image_from_bundle(bundle.get(key))
        if url:
            return url
    for value in bundle.values():
        url = extract_image_from_bundle(value)
        if url:
            return url
    return None


def extract_image_from_bundle(value: Any) -> str | None:
    """Extract image URL from bundle value."""
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


def format_value(payload: Any) -> str | None:
    """Extract format value from a formatter payload."""
    if isinstance(payload, dict):
        value = payload.get("format")
        if isinstance(value, str):
            return value
    return None


# --- Timestamp parsing ---


def parse_timestamp(value: Any) -> datetime | None:
    """Parse timestamp from various formats (ms or seconds)."""
    if isinstance(value, str):
        if value.isdigit():
            value = int(value)
        else:
            return None
    if not isinstance(value, (int, float)):
        return None
    seconds = value / 1000 if value > 10**11 else value
    return dt_util.utc_from_timestamp(seconds)


# --- EPG helpers ---


def find_channel(data: EpgData | None, channel_id: str) -> EpgChannel | None:
    """Find a channel by ID in EPG data."""
    if data is None:
        return None
    for channel in data.channels:
        if channel.channel_id == channel_id:
            return channel
    return None


def find_program(
    data: EpgData | None, channel_id: str, start_ts: int
) -> EpgProgram | None:
    """Find a program by channel ID and start timestamp."""
    channel = find_channel(data, channel_id)
    if channel is None:
        return None
    for program in channel.programs:
        if int(program.start.timestamp()) == start_ts:
            return program
    return None


def find_current_program(channel: EpgChannel, now: datetime) -> EpgProgram | None:
    """Find the currently airing program for a channel."""
    for program in channel.programs:
        if program.start <= now < program.end:
            return program
    return None


def count_channels_with_current(channels: list[EpgChannel], now: datetime) -> int:
    """Count channels that have a current program."""
    return sum(1 for channel in channels if find_current_program(channel, now))


def merge_epg_channels(
    base_channels: dict[str, EpgChannel], incoming: list[EpgChannel]
) -> None:
    """Merge incoming channels into base channels dict."""
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


def parse_remote_programs(data: dict[str, Any], channel_id: str) -> list[EpgProgram]:
    """Parse programs from remote API response."""
    if not isinstance(data, dict):
        return []
    programs_payload = data.get("programs")
    if isinstance(programs_payload, list):
        parsed = parse_epg_programs(programs_payload)
        if parsed:
            return parsed

    items = extract_section_items(data)
    parsed_list: list[EpgProgram] = []
    for item in items:
        program = parse_program_item(item, channel_id)
        if program is not None:
            parsed_list.append(program)
    return parsed_list


def parse_epg_programs(programs: list[Any]) -> list[EpgProgram]:
    """Parse list of program dicts into EpgProgram objects."""
    parsed: list[EpgProgram] = []
    for program in programs:
        if not isinstance(program, dict):
            continue
        start = parse_timestamp(
            program.get("startUTCMillis")
            or program.get("start_at")
            or program.get("start")
        )
        end = parse_timestamp(
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
                or extract_item_image(program),
                poster=program.get("poster")
                or program.get("posterUrl")
                or extract_item_image(program, prefer_poster=True),
            )
        )
    return parsed


def parse_program_item(item: dict[str, Any], channel_id: str) -> EpgProgram | None:
    """Parse a single program item into EpgProgram."""
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

    start = parse_timestamp(source.get("start_at") or source.get("start"))
    end = parse_timestamp(source.get("end_at") or source.get("end"))
    if start is None or end is None:
        return None

    title = (
        item.get("title")
        or format_value(item.get("title_formatter"))
        or format_value(item.get("titleFormatter"))
        or item.get("name")
        or "Untitled"
    )
    episode_title = (
        item.get("episodeTitle")
        or item.get("episode_title")
        or item.get("subtitle")
        or format_value(item.get("subtitle_formatter"))
        or format_value(item.get("subtitleFormatter"))
    )
    description = item.get("description") or format_value(
        item.get("description_formatter")
    )

    thumbnail = extract_item_image(item)
    poster = extract_item_image(item, prefer_poster=True)
    if not thumbnail or not poster:
        channel_payload = item.get("channel")
        if isinstance(channel_payload, dict):
            if not thumbnail:
                thumbnail = extract_item_image(channel_payload)
            if not poster:
                poster = extract_item_image(channel_payload, prefer_poster=True)

    return EpgProgram(
        title=title,
        start=start,
        end=end,
        description=description,
        episode_title=episode_title,
        thumbnail=thumbnail,
        poster=poster,
    )


# --- Asset parsing ---


def parse_asset_item(item: dict[str, Any], api: MolotovApi) -> BrowseAsset | None:
    """Parse an item dict into a BrowseAsset."""
    payload = extract_item_payload(item)
    actions = extract_item_actions(item, payload)
    ref = extract_asset_reference(item)

    # Only skip if there's no playback reference at all
    if not ref:
        if payload.get("is_available") is False:
            _LOGGER.debug(
                "Skipping asset without playback ref (is_available=False): %s",
                payload.get("title"),
            )
        return None
    asset_type, asset_id, start_over = ref
    asset_url = api.build_asset_url(asset_type, asset_id, start_over=start_over)

    title = (
        payload.get("title")
        or format_value(payload.get("title_formatter"))
        or payload.get("name")
        or "Untitled"
    )
    episode_title = (
        payload.get("episodeTitle")
        or payload.get("episode_title")
        or payload.get("subtitle")
        or format_value(payload.get("subtitle_formatter"))
        or format_value(payload.get("subtitleFormatter"))
    )
    description = payload.get("description") or format_value(
        payload.get("description_formatter")
    )

    thumbnail = extract_item_image(payload)
    poster = extract_item_image(payload, prefer_poster=True)
    if not thumbnail or not poster:
        channel_payload = payload.get("channel")
        if isinstance(channel_payload, dict):
            if not thumbnail:
                thumbnail = extract_item_image(channel_payload)
            if not poster:
                poster = extract_item_image(channel_payload, prefer_poster=True)

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
        start = parse_timestamp(video.get("start_at") or video.get("start"))
        end = parse_timestamp(video.get("end_at") or video.get("end"))
        available_from = parse_timestamp(video.get("available_from"))
        available_until = parse_timestamp(video.get("available_until"))
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
        start = parse_timestamp(payload.get("start_at") or payload.get("start"))
        end = parse_timestamp(payload.get("end_at") or payload.get("end"))
        available_from = parse_timestamp(payload.get("available_from"))
        available_until = parse_timestamp(payload.get("available_until"))

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
        channel_id = extract_channel_id_from_actions(actions)

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
        is_live=start is not None
        and end is not None
        and start <= dt_util.utcnow() < end,
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


# --- Replay/Recording extraction ---


def parse_past_programs_as_replays(
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
            if first.get("data"):
                _LOGGER.debug(
                    "First program has 'data' key with: %s", list(first["data"].keys())
                )
            if first.get("video"):
                video = first["video"]
                _LOGGER.debug(
                    "First program has 'video' key with: %s", list(video.keys())
                )
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

        # Parse program timestamps
        start = parse_timestamp(
            video.get("start_at")
            or video.get("start")
            or payload.get("startUTCMillis")
            or payload.get("start_at")
            or payload.get("start")
            or program.get("startUTCMillis")
            or program.get("start_at")
            or program.get("start")
        )
        end = parse_timestamp(
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
        available_from = parse_timestamp(
            video.get("available_from")
            or payload.get("available_from")
            or program.get("available_from")
        )
        available_until = parse_timestamp(
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
            or format_value(payload.get("title_formatter"))
            or payload.get("name")
            or program.get("title")
            or "Untitled"
        )
        episode_title = (
            payload.get("episodeTitle")
            or payload.get("episode_title")
            or payload.get("subtitle")
            or format_value(payload.get("subtitle_formatter"))
        )

        # Build replay URL - use video type and id if available
        video_type = video.get("type", "channel")
        video_id = video.get("id") or video.get("program_id") or channel_id
        asset_url = api.build_asset_url(video_type, str(video_id), start_over=True)

        # Extract program_id and channel_id for episode browsing
        program_id = str(video.get("program_id")) if video.get("program_id") else None
        item_channel_id = (
            str(video.get("channel_id")) if video.get("channel_id") else channel_id
        )

        replays.append(
            BrowseAsset(
                title=title,
                asset_url=asset_url,
                is_live=False,
                description=payload.get("description"),
                episode_title=episode_title,
                thumbnail=payload.get("thumbnail") or extract_item_image(payload),
                poster=payload.get("poster")
                or extract_item_image(payload, prefer_poster=True),
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


def extract_item_channel_id_strict(item: dict[str, Any]) -> str | None:
    """Extract channel ID strictly from item (no fallbacks)."""
    payload = extract_item_payload(item)
    video = payload.get("video")
    if isinstance(video, dict) and video.get("channel_id"):
        return str(video.get("channel_id"))

    metadata = payload.get("metadata")
    if isinstance(metadata, dict):
        if metadata.get("channel_id"):
            return str(metadata.get("channel_id"))
        if metadata.get("channelId"):
            return str(metadata.get("channelId"))

    actions = extract_item_actions(item, payload)
    channel_id = extract_channel_id_from_actions(actions)
    if channel_id:
        return channel_id

    channel_payload = payload.get("channel")
    if isinstance(channel_payload, dict) and channel_payload.get("id"):
        return str(channel_payload.get("id"))

    return None


def extract_replay_assets(
    data: Any, api: MolotovApi, *, channel_id: str | None = None
) -> list[BrowseAsset]:
    """Extract replay assets from API response."""
    assets: list[BrowseAsset] = []
    now = dt_util.utcnow()

    for section in extract_sections(data):
        if not is_replay_section(section):
            continue
        for item in extract_section_items(section):
            if not isinstance(item, dict):
                continue
            # Skip items that do not match the requested channel when possible
            if channel_id:
                item_channel = extract_item_channel_id_strict(item)
                if item_channel and item_channel != channel_id:
                    continue

            asset = parse_asset_item(item, api)
            if asset:
                # Filter out future broadcasts (only allow VOD or past/live items)
                if asset.start:
                    is_future = asset.start > now
                    if is_future:
                        _LOGGER.debug(
                            "Filtering future asset '%s': start=%s > now=%s",
                            asset.title,
                            asset.start,
                            now,
                        )
                        continue

                # If broadcast and no start time, suspicious
                if asset.asset_type == "broadcast" and not asset.start:
                    _LOGGER.debug(
                        "Filtering broadcast without start time: %s", asset.title
                    )
                    continue

                # Check if replay is within availability window
                if asset.available_from and asset.available_until:
                    if not (asset.available_from <= now <= asset.available_until):
                        _LOGGER.debug(
                            "Filtering unavailable asset '%s': now=%s not in [%s, %s]",
                            asset.title,
                            now,
                            asset.available_from,
                            asset.available_until,
                        )
                        continue
                elif asset.available_until and asset.available_until < now:
                    # Replay has expired
                    _LOGGER.debug(
                        "Filtering expired asset '%s': available_until=%s < now=%s",
                        asset.title,
                        asset.available_until,
                        now,
                    )
                    continue

                assets.append(asset)

    return dedupe_assets(assets)


def extract_search_suggestions(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Extract search suggestions from search home data."""
    assets: list[BrowseAsset] = []
    for section in extract_sections(data):
        for item in extract_section_items(section):
            if not isinstance(item, dict):
                continue
            asset = parse_asset_item(item, api)
            if asset:
                assets.append(asset)
    return dedupe_assets(assets)


def extract_search_results(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Extract search results from search response."""
    assets: list[BrowseAsset] = []

    # Handle direct results array
    if isinstance(data, dict):
        results = data.get("results") or data.get("items") or data.get("data")
        if isinstance(results, list):
            for item in results:
                if not isinstance(item, dict):
                    continue
                asset = parse_asset_item(item, api)
                if asset:
                    assets.append(asset)
            if assets:
                return dedupe_assets(assets)

    # Fall back to section-based extraction
    for section in extract_sections(data):
        for item in extract_section_items(section):
            if not isinstance(item, dict):
                continue
            asset = parse_asset_item(item, api)
            if asset:
                assets.append(asset)

    return dedupe_assets(assets)


def extract_program_episodes(
    data: Any, api: MolotovApi, filter_program_id: str | None = None
) -> list[BrowseAsset]:
    """Extract available episodes from program details response."""
    assets: list[BrowseAsset] = []
    seen_titles: set[str] = set()

    if not isinstance(data, dict):
        return assets

    _LOGGER.debug(
        "Extracting episodes from data with keys: %s",
        list(data.keys()) if data else "empty",
    )

    # Only look at sections that contain playable episodes
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
            if any(
                skip in section_slug
                for skip in ("a-venir", "bientot", "upcoming", "soon")
            ):
                continue

            items = extract_section_items(section)

            _LOGGER.debug(
                "Processing section '%s' (slug=%s) with %d items",
                section_title,
                section_slug,
                len(items),
            )

            for item in items:
                if not isinstance(item, dict):
                    continue

                # Filter by program_id if specified
                if filter_program_id:
                    payload = extract_item_payload(item)
                    video = payload.get("video", {})
                    item_program_id = (
                        str(video.get("program_id"))
                        if video.get("program_id")
                        else None
                    )
                    if (
                        item_program_id is not None
                        and item_program_id != filter_program_id
                    ):
                        _LOGGER.debug(
                            "Skipping item with different program_id: %s != %s",
                            item_program_id,
                            filter_program_id,
                        )
                        continue

                asset = parse_asset_item(item, api)
                if asset:
                    # Filter out future broadcasts
                    now = dt_util.utcnow()
                    if asset.start and asset.start > now:
                        _LOGGER.debug(
                            "Skipping future episode '%s': start=%s > now=%s",
                            asset.title,
                            asset.start,
                            now,
                        )
                        continue

                    # Dedupe by episode_title
                    dedup_key = asset.episode_title or asset.title
                    if dedup_key not in seen_titles:
                        seen_titles.add(dedup_key)
                        assets.append(asset)
                    else:
                        _LOGGER.debug("Skipping duplicate episode: %s", dedup_key)
                else:
                    payload = extract_item_payload(item)
                    _LOGGER.debug(
                        "Failed to parse item: title=%s, is_available=%s",
                        payload.get("title", "unknown"),
                        payload.get("is_available"),
                    )

    _LOGGER.debug(
        "Total unique episodes for program %s: %d", filter_program_id, len(assets)
    )
    sorted_assets = sort_assets(assets)
    return sorted_assets[:50]


def extract_recording_assets(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Extract recording assets from API response."""
    assets: list[BrowseAsset] = []
    sections = extract_sections(data)
    _LOGGER.debug("Extracting recordings from %d sections", len(sections))

    for section in sections:
        section_title = section.get("title") or section.get("slug") or "unknown"
        is_rec_section = is_recording_section(section)
        items = extract_section_items(section)

        _LOGGER.debug(
            "Section '%s': is_recording=%s, %d items",
            section_title[:30],
            is_rec_section,
            len(items),
        )

        for item in items:
            if not isinstance(item, dict):
                continue

            # Check both item and its payload for recording type
            payload = extract_item_payload(item)
            is_recording = is_recording_item(item) or is_recording_item(payload)

            if not is_rec_section and not is_recording:
                continue

            asset = parse_asset_item(item, api)
            if asset:
                _LOGGER.debug(
                    "Found recording: %s (url=%s)",
                    asset.title[:30] if asset.title else "untitled",
                    asset.asset_url[:50] if asset.asset_url else "no url",
                )
                assets.append(asset)

    _LOGGER.debug("Total recordings extracted: %d", len(assets))
    return dedupe_assets(assets)


# --- Classification helpers ---


def is_replay_section(section: dict[str, Any]) -> bool:
    """Check if a section contains replay content."""
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


def is_recording_section(section: dict[str, Any]) -> bool:
    """Check if a section contains recording content."""
    slug = section.get("slug")
    title = section.get("title")
    text = f"{slug or ''} {title or ''}".casefold()
    return "record" in text or "enregistr" in text


def is_recording_item(item: dict[str, Any]) -> bool:
    """Check if an item is a recording."""
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
        return is_recording_item(data)

    return False


# --- Asset utilities ---


def dedupe_assets(assets: list[BrowseAsset]) -> list[BrowseAsset]:
    """Deduplicate assets by URL."""
    seen: set[str] = set()
    unique: list[BrowseAsset] = []
    for asset in assets:
        if asset.asset_url in seen:
            continue
        seen.add(asset.asset_url)
        unique.append(asset)
    return unique


def sort_assets(assets: list[BrowseAsset]) -> list[BrowseAsset]:
    """Sort assets by start date, newest first."""
    assets.sort(
        key=lambda asset: asset.start or asset.end or dt_util.utc_from_timestamp(0),
        reverse=True,
    )
    return assets


# --- Cast discovery helpers ---


def discover_cast_targets_blocking(zconf: Any) -> list[str]:
    """Discover Chromecast targets using pychromecast (blocking)."""
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

                kwargs: dict[str, Any] = {"timeout": 10}
                if zconf is not None and "zeroconf_instance" in params:
                    kwargs["zeroconf_instance"] = zconf
                result = pychromecast.get_chromecasts(**kwargs)
                if isinstance(result, tuple) and len(result) >= 2:
                    chromecasts, browser = result[0], result[1]
                else:
                    chromecasts = result
                _LOGGER.debug(
                    "get_chromecasts found %d devices",
                    len(chromecasts) if chromecasts else 0,
                )
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

                kwargs2: dict[str, Any] = {}
                if zconf is not None and "zeroconf_instance" in params:
                    kwargs2["zeroconf_instance"] = zconf
                result = pychromecast.get_listed_chromecasts(**kwargs2)
                if isinstance(result, tuple) and len(result) >= 2:
                    chromecasts, browser = result[0], result[1]
                else:
                    chromecasts = result
                _LOGGER.debug(
                    "get_listed_chromecasts found %d devices",
                    len(chromecasts) if chromecasts else 0,
                )
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


# --- Device registry helpers ---


def extract_host_from_device_info(device_info: Any) -> str | None:
    """Extract host from device info dict."""
    if not isinstance(device_info, dict):
        return None
    connections = device_info.get("connections")
    return extract_host_from_connections(connections)


def extract_host_from_device_registry(
    hass: HomeAssistant, device_id: str
) -> str | None:
    """Extract host from device registry by device ID."""
    from homeassistant.helpers import device_registry as dr

    registry = dr.async_get(hass)
    device = registry.async_get(device_id)
    if not device:
        return None
    return extract_host_from_connections(device.connections)


def extract_host_from_connections(connections: Any) -> str | None:
    """Extract host from connections list."""
    if not connections:
        return None
    for connection in connections:
        if not isinstance(connection, (list, tuple)) or len(connection) < 2:
            continue
        conn_type, value = connection[0], connection[1]
        if conn_type in ("ip", "ipv4", "ipv6", "host") and isinstance(value, str):
            return value
    return None
