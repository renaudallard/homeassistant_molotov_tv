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
import json

from homeassistant.const import Platform

DOMAIN = "molotov_tv"
PLATFORMS: list[Platform] = [Platform.MEDIA_PLAYER, Platform.TEXT]

CONF_EMAIL = "email"
CONF_PASSWORD = "password"
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

# Resume position storage
RESUME_STORAGE_VERSION = 1
RESUME_MIN_POSITION = 60  # Don't save if watched less than 60 seconds
RESUME_MAX_PERCENT = 0.95  # Don't save if watched more than 95%
RESUME_EXPIRY_DAYS = 30  # Clear positions older than 30 days

ENVIRONMENTS: dict[str, dict[str, str]] = {
    "prod": {
        "base_api_url": "https://fapi.molotov.tv/",
        "live_channel_api_url": "https://umc.molotov.tv/",
        "live_channel_json_user": "mtv",
        "live_channel_json_password": "1sGvyQaaLZ",
        "cast_app_id": "F8EFD38B",
    }
}

# To use a custom receiver:
# 1. Host the file in receiver/index.html on an HTTPS server (e.g. GitHub Pages)
# 2. Register a new Custom Receiver in Google Cast SDK Console pointing to that URL
# 3. Replace the ID below with your new App ID
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
MEDIA_PROGRAM_EPISODES_PREFIX = "program_episodes"
MEDIA_EPISODE_PREFIX = "episode"
MEDIA_SEARCH = "search"
MEDIA_SEARCH_PREFIX = "search"
MEDIA_SEARCH_RESULT_PREFIX = "search_result"
MEDIA_SEARCH_INPUT_PREFIX = "search_input"

CONTENT_TYPE_DASH = "application/dash+xml"

MOLOTOV_AGENT = json.dumps(
    {
        "app_name": "Molotov",
        "app_version_name": "4.27.0",
        "app_id": "android_tv_app",
        "api_version": 8,
        "advertising_id": None,
        "app_build": 8881,
        "os": "Android",
        "os_version": "12",
        "os_sdk_version": 31,
        "rating": "HIGH",
        "type": "tv",
        "features_supported": [],
        "screen_reader_enabled": False,
        "model": "HA",
        "device": "Molotov HA",
        "brand": "Molotov",
        "manufacturer": "Molotov",
        "display": "Molotov HA",
        "serial": None,
        "serial_software": None,
        "store": "google",
        "rooted": False,
    },
    separators=(",", ":"),
    ensure_ascii=True,
)
