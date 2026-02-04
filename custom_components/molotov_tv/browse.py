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

from datetime import timedelta
import logging
import string

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
from .coordinator import EpgData
from .helpers import (
    encode_asset_payload,
    extract_program_episodes,
    extract_recording_assets,
    extract_replay_assets,
    find_channel,
    parse_past_programs_as_replays,
    sort_assets,
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


def build_assets_browse(
    title: str,
    content_id: str,
    prefix: str,
    assets: list[BrowseAsset],
) -> BrowseMedia:
    """Build a browse list from assets."""
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
        if asset.description:
            payload_data["desc"] = asset.description

        payload = encode_asset_payload(payload_data)
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
                title=f"Aucun {title.lower()} disponible",
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
    children: list[BrowseMedia] = []

    for asset in assets:
        display_title = asset.title
        if asset.episode_title:
            display_title = f"{asset.title} - {asset.episode_title}"

        # Check if this is a program container (Series/Show) that should be browsed
        if (
            (
                asset.asset_type in ("program", "serie")
                or (asset.asset_type == "vod" and not asset.episode_id)
            )
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
            if asset.description:
                payload_data["desc"] = asset.description

            payload = encode_asset_payload(payload_data)
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
    # Enable search box in the UI
    if show_search:
        browse.children_media_class = MediaClass.VIDEO
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


async def async_fetch_channel_replays(
    api: MolotovApi, channel_id: str, epg_data: EpgData | None
) -> list[BrowseAsset]:
    """Fetch replays for a specific channel."""
    from homeassistant.util import dt as dt_util

    # First try the dedicated replay API endpoint
    try:
        data = await api.async_get_channel_replays(channel_id)
        assets = extract_replay_assets(data, api, channel_id=channel_id)
        if assets:
            assets = [asset for asset in assets if asset.channel_id == channel_id]
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
        data = await api.async_get_channel_past_programs(channel_id)
        programs = parse_past_programs_as_replays(data, channel_id, api)
        if programs:
            _LOGGER.debug(
                "Found %d replays from past programs API for channel %s",
                len(programs),
                channel_id,
            )
            return programs
    except MolotovApiError as err:
        _LOGGER.debug("Failed to fetch past programs for %s: %s", channel_id, err)

    # Fall back to using past programs from coordinator data
    if epg_data is None:
        _LOGGER.debug("No EPG data available for channel %s replays", channel_id)
        return []

    channel = find_channel(epg_data, channel_id)
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
        asset_url = api.build_asset_url("channel", channel_id, start_over=True)

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

    _LOGGER.debug("Found %d replays from EPG for channel %s", len(replays), channel_id)

    return replays


async def async_fetch_recordings(api: MolotovApi) -> list[BrowseAsset]:
    """Fetch all recordings."""
    assets: list[BrowseAsset] = []
    seen_urls: set[str] = set()

    # Get all recordings from bookmarks API
    try:
        all_sections = await api.async_get_all_recordings()
        _LOGGER.debug("Got %d sections from recordings API", len(all_sections))
        for section in all_sections:
            section_assets = extract_recording_assets({"sections": [section]}, api)
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
            data = await api.async_get_home_sections()
            home_assets = extract_recording_assets(data, api)
            for asset in home_assets:
                if asset.asset_url not in seen_urls:
                    seen_urls.add(asset.asset_url)
                    assets.append(asset)
            _LOGGER.debug("Found %d recordings from home sections", len(assets))
        except MolotovApiError as err:
            _LOGGER.warning("Failed to fetch recordings from home: %s", err)

    _LOGGER.debug("Found %d total recordings", len(assets))
    return sort_assets(assets)


async def async_fetch_program_episodes(
    api: MolotovApi,
    channel_id: str,
    program_id: str,
    title: str | None,
    thumbnail: str | None,
) -> BrowseMedia:
    """Fetch and display all episodes for a program."""
    children: list[BrowseMedia] = []

    try:
        data = await api.async_get_program_details(channel_id, program_id)
        episodes = extract_program_episodes(data, api, program_id)
        _LOGGER.debug(
            "Found %d episodes for program %s on channel %s",
            len(episodes),
            program_id,
            channel_id,
        )

        for episode in episodes:
            payload_data = {
                "url": episode.asset_url,
                "title": episode.title,
                "thumb": episode.thumbnail or episode.poster,
                "live": episode.is_live,
            }
            if episode.description:
                payload_data["desc"] = episode.description
            payload = encode_asset_payload(payload_data)
            ep_title = episode.episode_title or episode.title
            if episode.description:
                ep_title = f"{ep_title} - {episode.description}"
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
        media_content_id=f"{MEDIA_PROGRAM_EPISODES_PREFIX}:{channel_id}:{program_id}",
        media_content_type="directory",
        can_play=False,
        can_expand=True,
        children=children,
        thumbnail=thumbnail,
    )
