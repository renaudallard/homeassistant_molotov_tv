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

"""Config flow for Molotov TV."""

from __future__ import annotations

import logging

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.helpers import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import MolotovApi, MolotovApiError, MolotovAuthError
from .const import (
    CONF_CAST_TARGET,
    CONF_CAST_TARGETS,
    CONF_CAST_HOSTS,
    CONF_EMAIL,
    CONF_PASSWORD,
    DEFAULT_ENVIRONMENT,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)


class MolotovTvConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Molotov TV."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None):
        errors: dict[str, str] = {}

        if user_input is not None:
            try:
                await _async_validate_input(self.hass, user_input)
            except MolotovAuthError:
                errors["base"] = "invalid_auth"
                _LOGGER.warning("Molotov authentication failed during config flow")
            except MolotovApiError as err:
                errors["base"] = "cannot_connect"
                _LOGGER.exception(
                    "Molotov API error during config flow validation: %s",
                    err,
                )
            else:
                email = user_input[CONF_EMAIL].strip()
                for entry in self._async_current_entries():
                    if entry.data.get(CONF_EMAIL, "").lower() == email.lower():
                        return self.async_abort(reason="already_configured")
                await self.async_set_unique_id(email.lower())
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=f"Molotov TV ({email})",
                    data={
                        CONF_EMAIL: email,
                        CONF_PASSWORD: user_input[CONF_PASSWORD],
                    },
                )

        data_schema = vol.Schema(
            {
                vol.Required(CONF_EMAIL): str,
                vol.Required(CONF_PASSWORD): str,
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
            errors=errors,
        )

    @staticmethod
    def async_get_options_flow(config_entry: config_entries.ConfigEntry):
        return MolotovTvOptionsFlowHandler(config_entry)


class MolotovTvOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle Molotov TV options."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self._config_entry = config_entry

    async def async_step_init(self, user_input: dict | None = None):
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        existing_targets = self._config_entry.options.get(CONF_CAST_TARGETS)
        if not existing_targets:
            legacy_target = self._config_entry.options.get(CONF_CAST_TARGET)
            if legacy_target:
                existing_targets = [legacy_target]

        existing_hosts = self._config_entry.options.get(CONF_CAST_HOSTS, "")
        if isinstance(existing_hosts, list):
            existing_hosts = "\n".join(
                item for item in existing_hosts if isinstance(item, str)
            )
        elif not isinstance(existing_hosts, str):
            existing_hosts = ""

        data_schema = vol.Schema(
            {
                vol.Optional(
                    CONF_CAST_TARGETS,
                    default=existing_targets or [],
                ): selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain=["media_player"], multiple=True
                    )
                ),
                vol.Optional(
                    CONF_CAST_HOSTS,
                    default=existing_hosts or "",
                ): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                ),
            }
        )

        return self.async_show_form(step_id="init", data_schema=data_schema)


async def _async_validate_input(hass: HomeAssistant, data: dict) -> None:
    session = async_get_clientsession(hass)
    api = MolotovApi(
        session,
        email=data[CONF_EMAIL],
        password=data[CONF_PASSWORD],
        environment=DEFAULT_ENVIRONMENT,
        language=hass.config.language,
    )
    await api.async_login()
