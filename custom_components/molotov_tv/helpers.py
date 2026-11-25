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
import time
from typing import Any
import uuid
from urllib.parse import unquote_plus

from homeassistant.core import HomeAssistant
from homeassistant.helpers import instance_id
from homeassistant.util import dt as dt_util

from .api import MolotovApi
from .models import BrowseAsset, EpgChannel, EpgData, EpgProgram

_LOGGER = logging.getLogger(__name__)


# --- Backend identity ---


async def async_device_id(hass: HomeAssistant, email: str) -> str:
    """Return the device id this installation presents to the backend.

    The backend treats every unseen x-device-id as a new device, adds it to
    the account and mails the owner about it, so the id has to be the same on
    every sign-in. Deriving it from the Home Assistant instance id and the
    account email gives one id per installation and account without storing
    anything: the config flow and the entry setup compute the same value, and
    it survives restarts, reloads and re-authentication.
    """

    instance = await instance_id.async_get(hass)
    name = f"{instance}:{email.strip().lower()}"
    return f"etincelle-{uuid.uuid5(uuid.NAMESPACE_DNS, name)}"


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
            # Fubo /epg emits RFC3339 UTC strings (2026-06-13T19:10:00Z).
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
    # The guide comes in pages; a channel listed again on a later page is kept once.
    seen: set[str] = set()
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
        if channel_id in seen:
            continue
        seen.add(channel_id)
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
        asset_id: str | None = None
        assets = item.get("assets")
        if isinstance(assets, list):
            for asset in assets:
                if isinstance(asset, dict) and isinstance(
                    asset.get("accessRights"), dict
                ):
                    access = asset["accessRights"]
                    raw_asset_id = asset.get("assetId")
                    asset_id = str(raw_asset_id) if raw_asset_id else None
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
                asset_id=asset_id,
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
_PAPI_RECORDINGS_FOLDER_RE = re.compile(r"my-stuff/folder/seriesId/([\w-]+)")
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
    locked = component.get("is_locked")
    if locked is None:
        locked = _as_dict(component.get("state")).get("is_locked")
    is_locked = bool(locked)

    if channel_id:
        return BrowseAsset(
            title=label or channel_id,
            asset_url=api.build_asset_url("channel", channel_id),
            is_live=True,
            asset_type="live",
            channel_id=channel_id,
            episode_title=subtitle,
            thumbnail=image,
            is_locked=is_locked,
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
            is_locked=is_locked,
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
            is_locked=is_locked,
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


def _on_click_urls(node: Any) -> list[str]:
    actions = _as_dict(_as_dict(node).get("actions"))
    urls: list[str] = []
    for item in actions.get("on_click") or []:
        url = _as_dict(_as_dict(item).get("endpoint")).get("url")
        if isinstance(url, str) and url:
            urls.append(url)
    return urls


def parse_papi_on_air(data: Any) -> tuple[str, str] | None:
    """Return the name and show id of what airs, from a channel detail page.

    The name is the episode label the page gives ("S26 E16 Dans le coma"), or
    the title of a programme that is no episode; the show is the one of its
    "Détails du programme" link. The recommendation rows of the page link
    other shows (tagged trkOriginComponent=section-), so they are passed over.
    """
    content = _as_dict(_as_dict(data).get("content"))
    meta = _as_dict(content.get("metadata"))
    name = _papi_text(meta.get("subtitle")) or _papi_text(meta.get("title"))
    if not name:
        return None
    urls: list[str] = []
    for cta in meta.get("ctas") or []:
        for item in _as_dict(cta).get("action_items") or []:
            urls.extend(_on_click_urls(item))
    for section in content.get("sections") or []:
        for component in _as_dict(section).get("components") or []:
            urls.extend(_on_click_urls(component))
    for url in urls:
        if "trkOriginComponent=section-" in url:
            continue
        match = _PAPI_SERIES_RE.search(url)
        if match:
            return name, match.group(1)
    return None


def find_on_demand_copy(episodes: list[BrowseAsset], name: str) -> BrowseAsset | None:
    """Return the on-demand episode of a show that goes by [name], if any.

    A show's episodes list the airing on now as well, under the same name: an
    airing (an id in LIVE_) is no copy of itself.
    """
    for episode in episodes:
        program_id = episode.program_id or ""
        if episode.title == name and program_id and not program_id.startswith("LIVE_"):
            return episode
    return None


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


def parse_papi_recordings(data: Any, api: MolotovApi) -> list[BrowseAsset]:
    """Parse a "Mes vidéos" recordings page or a show's folder of recordings.

    A card linking my-stuff/folder/seriesId/{id} is the folder of a show's
    recorded episodes ("14 épisodes"); one linking program-details/program/
    LIVE_... is a recording, played from the DVR. A folder's rows say when
    each was recorded ("Enregistré: 30 sept.").
    """
    assets: list[BrowseAsset] = []
    content = _as_dict(_as_dict(data).get("content"))
    for section in content.get("sections") or []:
        for component in _as_dict(section).get("components") or []:
            asset = _parse_papi_recording(component, api)
            if asset is not None:
                assets.append(asset)
    return assets


def _parse_papi_recording(component: Any, api: MolotovApi) -> BrowseAsset | None:
    if not isinstance(component, dict):
        return None
    if str(component.get("type") or "") in _PAPI_SKIP_TYPES:
        return None
    action_url = _papi_action_url(component)
    if not action_url:
        return None
    path = action_url.split("?", 1)[0]
    footer = _as_dict(component.get("footer"))
    label = (
        _papi_text(component.get("title"))
        or _papi_text(footer.get("title"))
        or _trk_title(action_url)
    )
    subtitle = _papi_text(footer.get("subtitle")) or _papi_text(component.get("info"))
    image = _papi_image(component)
    match = _PAPI_RECORDINGS_FOLDER_RE.search(path)
    if match:
        folder_id = match.group(1)
        return BrowseAsset(
            title=label or folder_id,
            asset_url="",
            asset_type="recording_folder",
            program_id=folder_id,
            episode_title=subtitle,
            thumbnail=image,
        )
    match = _PAPI_PROGRAM_RE.search(path)
    if match is None or not match.group(1).startswith("LIVE_"):
        return None
    asset_id = match.group(1)
    return BrowseAsset(
        # A recording is one captured airing, so it plays directly.
        title=label or asset_id,
        asset_url=api.build_asset_url("recording", asset_id),
        asset_type="dvr",
        episode_id=asset_id,
        episode_title=subtitle,
        thumbnail=image,
    )


def parse_papi_credits_start(data: Any) -> int | None:
    """Return when an episode's credits start, in seconds, or None.

    An episode page's player carries an end slate offering the next episode
    from [position] seconds into the episode, as its credits roll. A film or
    the last episode of a show has none.
    """
    player = _as_dict(_as_dict(_as_dict(data).get("content")).get("player"))
    slate = _as_dict(player.get("end_slate"))
    position = slate.get("position")
    if (
        not isinstance(position, (int, float))
        or isinstance(position, bool)
        or position <= 0
    ):
        return None
    for action in slate.get("actions") or []:
        action = _as_dict(action)
        if (
            action.get("type") == "show_video_slate"
            and _as_dict(action.get("content")).get("type") == "up-next"
        ):
            return int(position)
    return None


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


# --- Cast discovery helpers ---


def discover_cast_targets_blocking(zconf: Any) -> list[str]:
    """Return the Chromecasts announced on the network, as name=host.

    Read from their mDNS announcements alone, which carry name and address:
    nothing is connected to, and no device is asked anything.
    """
    try:
        from pychromecast.discovery import (
            DISCOVER_TIMEOUT,
            CastBrowser,
            SimpleCastListener,
        )
    except ImportError:
        _LOGGER.debug("pychromecast import failed")
        return []
    if zconf is None:
        return []
    browser = CastBrowser(SimpleCastListener(), zconf)
    browser.start_discovery()
    try:
        time.sleep(DISCOVER_TIMEOUT)
        devices = list(browser.devices.values())
    finally:
        browser.stop_discovery()
    targets: list[str] = []
    for info in devices:
        if not info.host:
            continue
        # Strip the separators that split_manual_target uses (= and @) so a
        # name containing one does not corrupt the alias=host round-trip.
        name = (info.friendly_name or "").replace("=", " ").replace("@", " ").strip()
        targets.append(f"{name}={info.host}" if name else str(info.host))
        _LOGGER.debug("Discovered: %s at %s", name, info.host)
    return targets


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
