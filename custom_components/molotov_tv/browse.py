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

"""Browse media helpers for Molotov TV."""

from __future__ import annotations

import logging
import string
from typing import Any

from homeassistant.components.media_player import BrowseMedia, MediaClass

from .api import MolotovApi, MolotovApiError
from .const import (
    MEDIA_CHANNEL_PREFIX,
    MEDIA_CHANNELS,
    MEDIA_EPISODE_PREFIX,
    MEDIA_NOW_PLAYING,
    MEDIA_PROGRAM_EPISODES_PREFIX,
    MEDIA_RECORDINGS,
    MEDIA_ROOT,
    MEDIA_SEARCH,
    MEDIA_SEARCH_INPUT_PREFIX,
    MEDIA_SEARCH_PREFIX,
    MEDIA_SEARCH_RESULT_PREFIX,
)
from .models import EpgData
from .helpers import (
    encode_asset_payload,
    find_on_demand_copy,
    parse_papi_channel_replays,
    parse_papi_episodes,
    parse_papi_on_air,
    parse_papi_recordings,
)
from .models import BrowseAsset

_LOGGER = logging.getLogger(__name__)


def build_root_browse() -> BrowseMedia:
    """Build the root browse menu."""
    return BrowseMedia(
        title="Molotov TV",
        media_class=MediaClass.DIRECTORY,
        media_content_id=MEDIA_ROOT,
        media_content_type="directory",
        can_play=False,
        can_expand=True,
        children=[
            BrowseMedia(
                title="Recherche",
                media_class=MediaClass.DIRECTORY,
                media_content_id=MEDIA_SEARCH,
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ),
            BrowseMedia(
                title="En direct",
                media_class=MediaClass.DIRECTORY,
                media_content_id=MEDIA_NOW_PLAYING,
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ),
            BrowseMedia(
                title="Chaînes",
                media_class=MediaClass.DIRECTORY,
                media_content_id=MEDIA_CHANNELS,
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ),
            BrowseMedia(
                title="Enregistrements",
                media_class=MediaClass.DIRECTORY,
                media_content_id=MEDIA_RECORDINGS,
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            ),
        ],
    )


def build_channels_browse(data: EpgData) -> BrowseMedia:
    """Build the channels browse list."""
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
        title="Chaînes",
        media_class=MediaClass.DIRECTORY,
        media_content_id=MEDIA_CHANNELS,
        media_content_type="directory",
        can_play=False,
        can_expand=True,
        children=children,
    )


def _asset_to_browse_child(asset: BrowseAsset, prefix: str) -> BrowseMedia:
    """Build one browse child from an asset.

    A series (or a programme container) is browsed into for its episodes; an
    episode, movie, or live item is a playable leaf carrying a payload.
    """
    display_title = asset.title
    if asset.episode_title:
        display_title = f"{asset.title} - {asset.episode_title}"

    if asset.is_locked:
        # Reserved for the paid Molotov Extra add-on: show it but make it a
        # dead node so it can be neither played nor browsed into.
        return BrowseMedia(
            title=f"🔒 {display_title}",
            media_class=MediaClass.VIDEO,
            media_content_id=MEDIA_ROOT,
            media_content_type="directory",
            can_play=False,
            can_expand=False,
            thumbnail=asset.thumbnail or asset.poster,
        )

    if asset.asset_type == "recording_folder":
        # A show's folder of recordings, browsed into for its episodes.
        folder = encode_asset_payload(
            {"folder": asset.program_id, "title": asset.title, "thumb": asset.thumbnail}
        )
        return BrowseMedia(
            title=display_title,
            media_class=MediaClass.TV_SHOW,
            media_content_id=f"{prefix}:{folder}",
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            thumbnail=asset.thumbnail,
        )

    is_container = (
        (
            asset.asset_type in ("program", "serie")
            or (asset.asset_type == "vod" and not asset.episode_id)
        )
        and asset.program_id
        and not asset.is_live
    )
    if is_container:
        return BrowseMedia(
            title=display_title,
            media_class=MediaClass.TV_SHOW,
            media_content_id=(
                f"{MEDIA_PROGRAM_EPISODES_PREFIX}:{asset.channel_id or ''}:"
                f"{asset.program_id}:{asset.title}"
            ),
            media_content_type="directory",
            can_play=False,
            can_expand=True,
            thumbnail=asset.thumbnail or asset.poster,
        )

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
    if asset.description:
        payload_data["desc"] = asset.description
    payload = encode_asset_payload(payload_data)
    return BrowseMedia(
        title=display_title,
        media_class=MediaClass.VIDEO,
        media_content_id=f"{prefix}:{payload}",
        media_content_type=prefix,
        can_play=False,
        can_expand=True,
        thumbnail=asset.thumbnail or asset.poster,
    )


def build_assets_browse(
    title: str,
    content_id: str,
    prefix: str,
    assets: list[BrowseAsset],
    empty: str | None = None,
) -> BrowseMedia:
    """Build a browse list from assets, saying [empty] when there are none."""
    children: list[BrowseMedia] = [
        _asset_to_browse_child(asset, prefix) for asset in assets
    ]

    if not children:
        children.append(
            BrowseMedia(
                title=empty or f"Aucun {title.lower()} disponible",
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


def build_search_results_browse(
    title: str,
    content_id: str,
    assets: list[BrowseAsset],
    show_search: bool = False,
) -> BrowseMedia:
    """Build a BrowseMedia with search results."""
    children: list[BrowseMedia] = [
        _asset_to_browse_child(asset, MEDIA_SEARCH_RESULT_PREFIX) for asset in assets
    ]

    if not children:
        children.append(
            BrowseMedia(
                title="Aucun résultat trouvé",
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
    # Enable the in-browser search box (serviced by async_search_media).
    if show_search:
        browse.can_search = True
    return browse


def build_search_input_browse(buffer: str) -> BrowseMedia:
    """Build the search input keyboard browse."""
    children: list[BrowseMedia] = []

    # Action buttons - Always present to maintain layout
    if buffer:
        children.append(
            BrowseMedia(
                title=f"🔎 Recherche pour '{buffer}'",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_PREFIX}:{buffer}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            )
        )
        children.append(
            BrowseMedia(
                title="⌫ Retour arrière",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer[:-1]}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            )
        )
        children.append(
            BrowseMedia(
                title="🗑 Effacer",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            )
        )
    else:
        children.append(
            BrowseMedia(
                title="🔎 Taper pour rechercher...",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            )
        )
        children.append(
            BrowseMedia(
                title="⌫ Retour arrière",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            )
        )
        children.append(
            BrowseMedia(
                title="🗑 Effacer",
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            )
        )

    # Space is always useful
    children.append(
        BrowseMedia(
            title="␣ Espace",
            media_class=MediaClass.DIRECTORY,
            media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer} ",
            media_content_type="directory",
            can_play=False,
            can_expand=True,
        )
    )

    # Keys A-Z
    for char in string.ascii_uppercase:
        children.append(
            BrowseMedia(
                title=char,
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer}{char}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            )
        )

    # Keys 0-9
    for char in string.digits:
        children.append(
            BrowseMedia(
                title=char,
                media_class=MediaClass.DIRECTORY,
                media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer}{char}",
                media_content_type="directory",
                can_play=False,
                can_expand=True,
            )
        )

    return BrowseMedia(
        title=f"Recherche: {buffer}█" if buffer else "Clavier de recherche",
        media_class=MediaClass.DIRECTORY,
        media_content_id=f"{MEDIA_SEARCH_INPUT_PREFIX}:{buffer}",
        media_content_type="directory",
        can_play=False,
        can_expand=True,
        children=children,
    )


async def async_fetch_channel_catch_up(
    api: MolotovApi, channel_id: str
) -> tuple[list[BrowseAsset], BrowseAsset | None]:
    """Fetch a channel's replays, and the on-demand copy of what airs on it.

    The channel detail page carries an "En replay sur ..." card section whose
    cards are catch-up programmes and series, resolved as VOD like episodes. It
    also names the programme on air and its show, whose on-demand episodes may
    hold that programme already, to watch from its beginning.
    """
    try:
        data = await api.async_get_program_details(channel_id, kind="channel", tab=None)
    except MolotovApiError as err:
        _LOGGER.debug("Failed to fetch channel replays for %s: %s", channel_id, err)
        return [], None
    assets = parse_papi_channel_replays(data, api)
    _LOGGER.debug("Found %d replays for channel %s", len(assets), channel_id)
    on_air = parse_papi_on_air(data)
    if on_air is None:
        return assets, None
    name, series_id = on_air
    try:
        episodes = parse_papi_episodes(
            await api.async_get_program_details(
                series_id, kind="series", tab="id-tab-watch-now"
            ),
            api,
        )
    except MolotovApiError as err:
        _LOGGER.debug("Failed to fetch the show on air on %s: %s", channel_id, err)
        return assets, None
    return assets, find_on_demand_copy(episodes, name)


def episode_browse_child(
    episode: BrowseAsset, *, title: str | None = None, from_start: bool = False
) -> BrowseMedia:
    """Build the browse entry of an on-demand episode.

    [from_start] plays it from its beginning, wherever it was left before.
    """
    payload_data: dict[str, Any] = {
        "url": episode.asset_url,
        "title": episode.title,
        "thumb": episode.thumbnail or episode.poster,
        "live": episode.is_live,
    }
    if episode.description:
        payload_data["desc"] = episode.description
    if from_start:
        payload_data["from_start"] = True
    payload = encode_asset_payload(payload_data)
    if title is None:
        title = episode.title
        if episode.episode_title:
            title = f"{episode.episode_title} - {episode.title}"
        if episode.start:
            title = f"{episode.start.strftime('%d/%m %H:%M')} - {title}"
    return BrowseMedia(
        title=title,
        media_class=MediaClass.VIDEO,
        media_content_id=f"{MEDIA_EPISODE_PREFIX}:{payload}",
        media_content_type=MEDIA_EPISODE_PREFIX,
        can_play=False,
        can_expand=True,
        thumbnail=episode.thumbnail or episode.poster,
    )


async def async_fetch_recordings(
    api: MolotovApi, folder_id: str | None = None
) -> list[BrowseAsset]:
    """Fetch the recordings, or those in the folder of one show."""
    try:
        if folder_id is None:
            data = await api.async_get_recordings()
        else:
            data = await api.async_get_recordings_folder(folder_id)
    except MolotovApiError as err:
        _LOGGER.warning("Failed to fetch recordings: %s", err)
        return []
    assets = parse_papi_recordings(data, api)
    _LOGGER.debug("Found %d recordings", len(assets))
    return assets


async def async_fetch_program_episodes(
    api: MolotovApi,
    channel_id: str,
    program_id: str,
    title: str | None,
    thumbnail: str | None,
) -> BrowseMedia:
    """Fetch and display all episodes for a series."""
    children: list[BrowseMedia] = []

    try:
        # Fubo series carry their catch-up episodes on a watch-now tab; the
        # series id is the program_id, so no channel id is needed.
        data = await api.async_get_program_details(
            program_id, kind="series", tab="id-tab-watch-now"
        )
        episodes = parse_papi_episodes(data, api)
        _LOGGER.debug("Found %d episodes for series %s", len(episodes), program_id)

        children.extend(episode_browse_child(episode) for episode in episodes)
    except MolotovApiError as err:
        _LOGGER.warning("Failed to fetch series episodes: %s", err)

    if not children:
        children.append(
            BrowseMedia(
                title="Aucun épisode disponible",
                media_class=MediaClass.DIRECTORY,
                media_content_id=MEDIA_ROOT,
                media_content_type="directory",
                can_play=False,
                can_expand=False,
            )
        )

    display_title = title or "Épisodes"
    return BrowseMedia(
        title=display_title,
        media_class=MediaClass.DIRECTORY,
        media_content_id=(
            f"{MEDIA_PROGRAM_EPISODES_PREFIX}:{channel_id}:{program_id}:{title or ''}"
        ),
        media_content_type="directory",
        can_play=False,
        can_expand=True,
        children=children,
        thumbnail=thumbnail,
    )
