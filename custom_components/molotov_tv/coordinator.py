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

"""Coordinator for Molotov TV EPG data (Fubo backend)."""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import MolotovApi, MolotovApiError, MolotovAuthError
from .const import DEFAULT_SCAN_INTERVAL
from .helpers import parse_fubo_epg
from .models import EpgData

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
        # Fubo serves channels and their programmes from a single /epg call.
        try:
            raw = await self.api.async_get_epg()
        except MolotovAuthError as err:
            raise ConfigEntryAuthFailed(str(err)) from err
        except MolotovApiError as err:
            raise UpdateFailed(f"Error fetching Molotov EPG: {err}") from err

        data = parse_fubo_epg(raw)
        _LOGGER.debug(
            "EPG: %d channels, %d with programmes",
            len(data.channels),
            sum(1 for channel in data.channels if channel.programs),
        )
        return data
