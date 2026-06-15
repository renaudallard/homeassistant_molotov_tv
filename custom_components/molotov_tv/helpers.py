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
from datetime import datetime
import json
import logging
import re
from typing import Any
from urllib.parse import unquote_plus

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .api import MolotovApi
from .models import BrowseAsset, EpgChannel, EpgData, EpgProgram

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


# --- Timestamp parsing ---


def parse_timestamp(value: Any) -> datetime | None:
    """Parse a timestamp from epoch (ms or seconds) or an RFC3339 string."""
    if isinstance(value, str):
        text = value.strip()
        if text.isdigit():
            value = int(text)
        elif text:
            # Fubo /epg and /dvr emit RFC3339 UTC strings (2026-06-13T19:10:00Z).
            parsed = dt_util.parse_datetime(text)
            if parsed is None:
                return None
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=dt_util.UTC)
            return dt_util.as_utc(parsed)
        else:
            return None
    if not isinstance(value, (int, float)):
        return None
    seconds = value / 1000 if value > 10**11 else value
    return dt_util.utc_from_timestamp(seconds)


def parse_fubo_epg(data: Any) -> EpgData:
    """Parse a Fubo /epg response into EpgData.

    Shape: response[].data.{channel, programsWithAssets[].{program, assets[]}}.
    The channel id later feeds the live /vapi/asset/v1 call.
    """
    channels: list[EpgChannel] = []
    if not isinstance(data, dict):
        return EpgData(channels=channels)
    for entry in data.get("response") or []:
        if not isinstance(entry, dict):
            continue
        entry_data = entry.get("data")
        if not isinstance(entry_data, dict):
            continue
        channel_raw = entry_data.get("channel")
        if not isinstance(channel_raw, dict):
            continue
        raw_id = channel_raw.get("id")
        if raw_id is None:
            continue
        channel_id = str(raw_id)
        label = (
            channel_raw.get("displayName")
            or channel_raw.get("name")
            or channel_raw.get("callSign")
            or channel_id
        )
        poster = channel_raw.get("logoOnDarkUrl") or channel_raw.get("logoOnWhiteUrl")
        programs = _parse_fubo_programs(entry_data.get("programsWithAssets"))
        channels.append(
            EpgChannel(
                channel_id=channel_id,
                label=label,
                poster=poster,
                programs=programs,
            )
        )
    return EpgData(channels=channels)


def _parse_fubo_programs(items: Any) -> list[EpgProgram]:
    """Parse a Fubo programsWithAssets list into EpgProgram objects."""
    programs: list[EpgProgram] = []
    if not isinstance(items, list):
        return programs
    for item in items:
        if not isinstance(item, dict):
            continue
        prog = item.get("program")
        if not isinstance(prog, dict):
            continue
        access: dict[str, Any] | None = None
        assets = item.get("assets")
        if isinstance(assets, list):
            for asset in assets:
                if isinstance(asset, dict) and isinstance(
                    asset.get("accessRights"), dict
                ):
                    access = asset["accessRights"]
                    break
        if access is None:
            continue
        start = parse_timestamp(access.get("startTime"))
        end = parse_timestamp(access.get("endTime"))
        if start is None or end is None:
            continue
        # /epg uses heading for the show name and title for the episode; the
        # guide shows the show name, with the episode as the subtitle.
        title = prog.get("heading") or prog.get("title")
        if not title:
            continue
        programs.append(
            EpgProgram(
                title=title,
                start=start,
                end=end,
                description=prog.get("shortDescription") or prog.get("longDescription"),
                episode_title=prog.get("subheading"),
                thumbnail=prog.get("horizontalImage"),
                poster=prog.get("verticalImage"),
            )
        )
    return programs


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


# --- Fubo papi (server-driven page) parsing ---

_PAPI_CHANNEL_RE = re.compile(r"program-details/channel/(\d+)")
_PAPI_CHANNEL_DETAILS_RE = re.compile(r"channel-details/(\d+)")
_PAPI_PROGRAM_RE = re.compile(r"program-details/program/([\w-]+)")
_PAPI_SERIES_RE = re.compile(r"program-details/series/([\w-]+)")
# UI chrome components carry no playable content; skip them.
_PAPI_SKIP_TYPES = frozenset(
    {
        "banner",
        "chip-navigation",
        "chip-filter",
        "tab",
        "picture",
        "progress_bar",
        "tag",
        "text",
        "list-item-suggestion",
    }
)


def _as_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _papi_text(node: Any) -> str | None:
    if isinstance(node, dict):
        text = node.get("text")
        if isinstance(text, str) and text.strip():
            return text.strip()
    return None


def _papi_image(component: dict[str, Any]) -> str | None:
    body = _as_dict(component.get("body"))
    for node in (
        component.get("picture"),
        body.get("picture"),
        component.get("image"),
        component.get("image_compact"),
        body.get("station_logo"),
    ):
        if isinstance(node, dict):
            url = node.get("url")
            if isinstance(url, str) and url:
                return url
    return None


def _papi_action_url(component: dict[str, Any]) -> str | None:
    actions = component.get("actions")
    if not isinstance(actions, dict):
        return None
    on_click = actions.get("on_click")
    if not isinstance(on_click, list):
        return None
    # A card often lists a tracking action before the navigation one; prefer
    # the navigation target, falling back to the first endpoint url present.
    first: str | None = None
    for item in on_click:
        if not isinstance(item, dict):
            continue
        endpoint = item.get("endpoint")
        url = endpoint.get("url") if isinstance(endpoint, dict) else None
        if not isinstance(url, str) or not url:
            continue
        if item.get("type") == "navigation":
            return url
        if first is None:
            first = url
    return first


def _trk_title(url: str | None) -> str | None:
    # Poster cards carry no title field; their display name rides in the
    # action url's trkOriginElement tracking parameter.
    if not url:
        return None
    match = re.search(r"[?&]trkOriginElement=([^&]+)", url)
    if not match:
        return None
    # The tracking param is form-encoded, so spaces arrive as '+'.
    value = unquote_plus(match.group(1)).strip()
    return value or None


def parse_papi_card(component: Any, api: MolotovApi) -> BrowseAsset | None:
    """Map a papi page card component to a BrowseAsset, or None if not content."""
    if not isinstance(component, dict):
        return None
    ctype = str(component.get("type") or component.get("component_type") or "")
    if ctype in _PAPI_SKIP_TYPES:
        return None

    image = _papi_image(component)
    action_url = _papi_action_url(component)
    footer = _as_dict(component.get("footer"))
    label = (
        _papi_text(component.get("title"))
        or _papi_text(component.get("heading"))
        or _papi_text(footer.get("title"))
        or _trk_title(action_url)
    )
    if image is None and label is None:
        return None

    channel_id = series_id = program_id = None
    if action_url:
        match = _PAPI_CHANNEL_RE.search(action_url) or _PAPI_CHANNEL_DETAILS_RE.search(
            action_url
        )
        channel_id = match.group(1) if match else None
        match = _PAPI_SERIES_RE.search(action_url)
        series_id = match.group(1) if match else None
        match = _PAPI_PROGRAM_RE.search(action_url)
        program_id = match.group(1) if match else None
    if channel_id is None:
        raw = component.get("channel_id")
        if isinstance(raw, (str, int)):
            channel_id = str(raw)

    subtitle = _papi_text(footer.get("subtitle"))

    if channel_id:
        return BrowseAsset(
            title=label or channel_id,
            asset_url=api.build_asset_url("channel", channel_id),
            is_live=True,
            asset_type="live",
            channel_id=channel_id,
            episode_title=subtitle,
            thumbnail=image,
        )
    if series_id:
        # A series is a container browsed into for its episodes (catch-up).
        return BrowseAsset(
            title=label or series_id,
            asset_url="",
            asset_type="serie",
            program_id=series_id,
            episode_title=subtitle,
            thumbnail=image,
        )
    if program_id:
        # A program-details/program/{id} is a single playable item (movie or
        # episode), not a container; episode_id marks it as a playable leaf.
        return BrowseAsset(
            title=label or program_id,
            asset_url=api.build_asset_url("program", program_id),
            asset_type="vod",
            program_id=program_id,
            episode_id=program_id,
            episode_title=subtitle,
            thumbnail=image,
        )
    return None


def parse_papi_episodes(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Parse a series' watch-now tab (list-item-wide) into playable episodes."""
    episodes: list[BrowseAsset] = []
    content = data.get("content") if isinstance(data, dict) else None
    sections = content.get("sections") if isinstance(content, dict) else None
    if not isinstance(sections, list):
        return episodes
    for section in sections:
        if not isinstance(section, dict):
            continue
        if str(section.get("component_type") or "") != "list-item-wide":
            continue
        for component in section.get("components") or []:
            asset = parse_papi_card(component, api)
            if asset is not None and asset.program_id:
                asset.asset_type = "episode"
                episodes.append(asset)
    return episodes


def parse_papi_channel_replays(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Parse the 'En replay' catch-up section of a channel detail page."""
    assets: list[BrowseAsset] = []
    content = data.get("content") if isinstance(data, dict) else None
    sections = content.get("sections") if isinstance(content, dict) else None
    if not isinstance(sections, list):
        return assets
    for section in sections:
        if not isinstance(section, dict):
            continue
        title = (_papi_text(section.get("title")) or "").lower()
        if "replay" not in title:
            continue
        for component in section.get("components") or []:
            asset = parse_papi_card(component, api)
            if asset is not None and not asset.is_live:
                assets.append(asset)
    return assets


def parse_fubo_recordings(entries: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Parse /dvr/v2/list entries (programWithAssets) into playable recordings."""
    assets: list[BrowseAsset] = []
    if not isinstance(entries, list):
        return assets
    for entry in entries:
        data = entry.get("data") if isinstance(entry, dict) else None
        if not isinstance(data, dict):
            continue
        program = data.get("program")
        if not isinstance(program, dict):
            continue
        dvr_asset = None
        for asset in data.get("assets") or []:
            if isinstance(asset, dict) and asset.get("type") == "dvr":
                dvr_asset = asset
                break
        if dvr_asset is None:
            continue
        asset_id = dvr_asset.get("assetId")
        if not asset_id:
            continue
        asset_id = str(asset_id)
        channel = _as_dict(dvr_asset.get("channel"))
        title = program.get("heading") or program.get("title") or asset_id
        assets.append(
            BrowseAsset(
                # A recording is one captured airing, so it plays directly.
                title=title,
                asset_url=api.build_asset_url("recording", asset_id),
                asset_type="dvr",
                episode_id=asset_id,
                episode_title=program.get("subheading"),
                description=program.get("shortDescription"),
                thumbnail=program.get("horizontalImage")
                or program.get("verticalImage"),
                channel_id=str(channel.get("id")) if channel.get("id") else None,
                program_id=program.get("programId"),
            )
        )
    return assets


def parse_papi_sections(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Parse every card across a papi page's content.sections into BrowseAssets."""
    assets: list[BrowseAsset] = []
    if not isinstance(data, dict):
        return assets
    content = data.get("content")
    if not isinstance(content, dict):
        return assets
    sections = content.get("sections")
    if not isinstance(sections, list):
        return assets
    for section in sections:
        if not isinstance(section, dict):
            continue
        if str(section.get("component_type") or "") == "banner":
            continue
        for component in section.get("components") or []:
            asset = parse_papi_card(component, api)
            if asset is not None:
                assets.append(asset)
    return assets


def parse_papi_search(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Parse a /papi/v1/search/content grid into deduped search results."""
    seen: set[str] = set()
    unique: list[BrowseAsset] = []
    # Search returns the same show once per channel; keep one card per title.
    for asset in parse_papi_sections(data, api):
        key = (asset.title or "").strip().lower()
        if key and key in seen:
            continue
        if key:
            seen.add(key)
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

    try:
        from pychromecast.discovery import stop_discovery
    except ImportError:
        stop_discovery = None
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

            # Strip the separators that split_manual_target uses (= and @) so
            # a name containing one does not corrupt the alias=host round-trip.
            safe_name = name.replace("=", " ").replace("@", " ").strip() if name else ""
            if safe_name:
                targets.append(f"{safe_name}={host}")
                _LOGGER.debug("Discovered: %s=%s", safe_name, host)
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
