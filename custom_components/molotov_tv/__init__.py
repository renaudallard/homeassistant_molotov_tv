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

"""Molotov TV integration."""

from __future__ import annotations

import logging

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import MolotovApi, MolotovApiError, MolotovAuthError
from .const import (
    CONF_EMAIL,
    CONF_ENVIRONMENT,
    CONF_PASSWORD,
    DEFAULT_ENVIRONMENT,
    DOMAIN,
    ENVIRONMENTS,
    PLATFORMS,
)
from .coordinator import MolotovEpgCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Molotov TV from a config entry."""

    data = entry.data
    email = data[CONF_EMAIL]
    password = data[CONF_PASSWORD]
    environment = data.get(CONF_ENVIRONMENT, DEFAULT_ENVIRONMENT)
    if environment not in ENVIRONMENTS:
        _LOGGER.warning(
            "Unsupported environment '%s' configured; falling back to prod",
            environment,
        )
        environment = DEFAULT_ENVIRONMENT
    session = async_get_clientsession(hass)

    api = MolotovApi(
        session,
        email=email,
        password=password,
        environment=environment,
        language=hass.config.language,
    )

    try:
        await api.async_login()
    except MolotovAuthError as err:
        raise ConfigEntryAuthFailed("Invalid credentials") from err
    except MolotovApiError as err:
        _LOGGER.error("Failed to set up Molotov TV: %s", err)
        raise

    coordinator = MolotovEpgCoordinator(hass, api)
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        "api": api,
        "coordinator": coordinator,
        "search_cache": None,  # Shared search cache: (timestamp, query, results)
    }

    # Register static path and load custom card automatically
    path = hass.config.path("custom_components/molotov_tv/www")
    _LOGGER.debug("Registering Molotov TV static path: %s", path)
    await hass.http.async_register_static_paths([
        StaticPathConfig("/molotov_tv/www", path, cache_headers=True)
    ])
    try:
        # Fixed version string for easier debugging/caching control
        add_extra_js_url(hass, "/molotov_tv/www/molotov-card.js?v=0.1.34")
        _LOGGER.info("Molotov TV frontend player registered")
    except Exception as err:
        _LOGGER.warning("Failed to register custom card JS: %s", err)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok
