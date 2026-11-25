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

"""Constants for the Molotov TV integration."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.const import Platform

DOMAIN = "molotov_tv"
PLATFORMS: list[Platform] = [Platform.MEDIA_PLAYER, Platform.TEXT]

CONF_EMAIL = "email"
CONF_PASSWORD = "password"
CONF_DEVICE_ID = "device_id"
CONF_REFRESH_TOKEN = "refresh_token"
CONF_PROFILE = "profile"
CONF_ENVIRONMENT = "environment"
CONF_CAST_TARGET = "cast_target"
CONF_CAST_TARGETS = "cast_targets"
CONF_CAST_HOSTS = "cast_hosts"

DEFAULT_ENVIRONMENT = "prod"
DEFAULT_SCAN_INTERVAL = timedelta(minutes=15)

# Cast connection reliability
CAST_HEALTH_CHECK_INTERVAL = timedelta(seconds=30)
CAST_RECONNECT_ATTEMPTS = 3
CAST_RECONNECT_DELAY = 5  # seconds

# Stream limits
MAX_CONCURRENT_STREAMS = 4  # Molotov account limit

# Resume position storage
RESUME_STORAGE_VERSION = 1
RESUME_MIN_POSITION = 60  # Don't save if watched less than 60 seconds
RESUME_MAX_PERCENT = 0.95  # Don't save if watched more than 95%
RESUME_EXPIRY_DAYS = 30  # Clear positions older than 30 days

ENVIRONMENTS: dict[str, dict[str, str]] = {
    "prod": {
        # Fubo is the backend Molotov 5.51 runs on; the EU host serves the
        # French market (the content market follows the request egress IP).
        "base_api_url": "https://api-eu.fubo.tv/",
    }
}

# Fubo (Molotov tenant) client identity sent on every request. x-application-id
# is mandatory: without it the backend returns NO_SERVICE_FOR_SUBSCRIPTION.
FUBO_APPLICATION_ID = "molotov"
FUBO_CLIENT_VERSION = "5.51.0"
FUBO_USER_AGENT = "MolotovTV/5.51.0 (Linux; U; ANDROID; fr-FR; etincelle)"
# The name the account lists the device under. The Android app sends the name
# the owner gave the handset; without it the device shows up unnamed.
FUBO_DEVICE_NAME = "Home Assistant"
# use_drm_v2_response makes /vapi/asset include drm_v2 (license url + headers);
# auto_play_up_next makes an episode page say when its credits start.
FUBO_SUPPORTED_FEATURES = (
    "use_drm_v2_response,playback_template_v2,"
    "play_start_from_offset,load_channels_in_guide,auto_play_up_next"
)

# The custom Cast receiver lives in its own repository:
#   https://github.com/renaudallard/etincelle_receiver
# To use your own: host that receiver over HTTPS, register it as a Custom Receiver
# in the Google Cast SDK Console (https://cast.google.com/publish/), then set the
# App ID it issues below.
CUSTOM_RECEIVER_APP_ID = "9527437F"  # Set to "1234ABCD" to enable custom receiver logic

MEDIA_ROOT = "root"
MEDIA_CHANNELS = "channels"
MEDIA_REPLAYS = "replays"
MEDIA_RECORDINGS = "recordings"
MEDIA_NOW_PLAYING = "now_playing"
MEDIA_CHANNEL_PREFIX = "channel"
MEDIA_PROGRAM_PREFIX = "program"
MEDIA_LIVE_PREFIX = "live"
MEDIA_CAST_PREFIX = "cast"
MEDIA_REPLAY_PREFIX = "replay"
MEDIA_RECORDING_PREFIX = "recording"
MEDIA_RECORD_PREFIX = "record"
MEDIA_RECORD_ACTION_PREFIX = "record_action"
MEDIA_PROGRAM_EPISODES_PREFIX = "program_episodes"
MEDIA_EPISODE_PREFIX = "episode"
MEDIA_SEARCH = "search"
MEDIA_SEARCH_PREFIX = "search"
MEDIA_SEARCH_RESULT_PREFIX = "search_result"
MEDIA_SEARCH_INPUT_PREFIX = "search_input"
MEDIA_TONIGHT_EPG = "tonight_epg"

# The channels whose ad breaks the custom receiver is not to guess from their pictures: TF1, TMC,
# TFX, TF1 Séries Films, LCI, France 2, 3 and 5 mark their breaks in the stream, exactly; France 4,
# franceinfo and Arte show no advert breaks, and a guess there offered trailers, the weather or a
# short programme. Kept the same as etincelle's (core/model Playback.kt).
NO_GUESS_CHANNELS = frozenset(
    {
        "600046",
        "600036",
        "600040",
        "600067",
        "600005",
        "600019",
        "600049",
        "600018",
        "600042",
        "600136",
        "600034",
    }
)

# M6, Gulli, Canal J, TIJI, Paris Première, Automoto, Toute l'Histoire and AB 1:
# 0.48 s of black between two adverts, which the custom receiver and the panel
# find the breaks by (as etincelle's Playback.kt). Not W9 or 6ter.
SEPARATED_CHANNELS = frozenset(
    {"600045", "600058", "600137", "600138", "600021", "600027", "600052", "600006"}
)

# The receiver reads a channel's pictures for its logo only one every this many seconds, as the
# service keeps them.
LIVE_PICTURE_EVERY_S = 4

# Panel configuration
PANEL_URL_PATH = "molotov-tv"
PANEL_TITLE = "Molotov TV"
PANEL_ICON = "mdi:television-play"

CONTENT_TYPE_DASH = "application/dash+xml"
CONTENT_TYPE_HLS = "application/x-mpegurl"
