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

"""Text entity for Molotov TV search."""

from __future__ import annotations

import logging

from homeassistant.components.text import TextEntity, TextMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .api import MolotovApi, MolotovApiError
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Molotov TV text entities."""
    data = hass.data[DOMAIN][entry.entry_id]
    api: MolotovApi = data["api"]
    async_add_entities([MolotovSearchText(entry, api, hass)])


class MolotovSearchText(TextEntity):
    """Text entity for searching Molotov TV content."""

    _attr_has_entity_name = True
    _attr_name = "Recherche"
    _attr_icon = "mdi:magnify"
    _attr_mode = TextMode.TEXT
    _attr_native_max = 100
    _attr_native_min = 0

    def __init__(self, entry: ConfigEntry, api: MolotovApi, hass: HomeAssistant) -> None:
        """Initialize the search text entity."""
        self._entry = entry
        self._api = api
        self._hass = hass
        self._attr_unique_id = f"{entry.entry_id}_search"
        self._attr_native_value = ""

    @property
    def device_info(self):
        """Return device info."""
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": self._entry.title,
            "manufacturer": "Molotov",
            "model": "Molotov TV",
        }

    async def async_set_value(self, value: str) -> None:
        """Handle search query input."""
        self._attr_native_value = value

        if not value.strip():
            # Clear search cache
            self._hass.data[DOMAIN][self._entry.entry_id]["search_cache"] = None
            self.async_write_ha_state()
            return

        # Perform search and store results in shared cache
        try:
            from .media_player import _extract_search_results

            data = await self._api.async_search(value)
            results = _extract_search_results(data, self._api)

            # Store in shared cache
            self._hass.data[DOMAIN][self._entry.entry_id]["search_cache"] = (
                dt_util.utcnow(),
                value,
                results,
            )

            _LOGGER.info(
                "Search for '%s' found %d results. Open Media Browser > Search to view.",
                value,
                len(results),
            )
            self.async_write_ha_state()

        except MolotovApiError as err:
            _LOGGER.error("Search failed: %s", err)
            self._hass.data[DOMAIN][self._entry.entry_id]["search_cache"] = None
            self.async_write_ha_state()
