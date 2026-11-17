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

from collections.abc import Mapping
import logging
from typing import Any

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
from .helpers import async_device_id

_LOGGER = logging.getLogger(__name__)

# The backend error code that alone means a wrong email or password: it also
# answers 401 for an expired session, an expired two-factor code and more.
WRONG_CREDENTIALS = "INVALID_USERNAME_PASSWORD"


def _sign_in_error(err: MolotovApiError) -> tuple[str, str]:
    """Return the form error key for a failed sign-in, and the backend's words.

    The backend's own message comes in the language asked for (French), and
    says more than a guess would: it is shown where the backend gave one.
    """

    said = err.user_message or err.code or (f"HTTP {err.status}" if err.status else "")
    if err.status == 451:
        # Region, VPN or subscription: the service is refused from here.
        return "unavailable_here", said
    if err.status == 403:
        return "account_blocked", said
    if isinstance(err, MolotovAuthError):
        if err.code in (None, WRONG_CREDENTIALS):
            return "invalid_auth", said
        return "sign_in_refused", said
    return "cannot_connect", said


class MolotovTvConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Molotov TV."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None):
        errors: dict[str, str] = {}
        said = ""

        if user_input is not None:
            try:
                await _async_validate_input(self.hass, user_input)
            except MolotovAuthError as err:
                errors["base"], said = _sign_in_error(err)
                _LOGGER.warning(
                    "Molotov authentication failed during config flow: %s", err
                )
            except MolotovApiError as err:
                errors["base"], said = _sign_in_error(err)
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
            description_placeholders={"message": said},
            errors=errors,
        )

    async def async_step_reauth(self, entry_data: Mapping[str, Any]):
        """Handle re-authentication when the stored credentials stop working."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(self, user_input: dict | None = None):
        """Prompt for the password and update the existing entry."""
        errors: dict[str, str] = {}
        said = ""
        reauth_entry = self._get_reauth_entry()
        email = reauth_entry.data.get(CONF_EMAIL, "")

        if user_input is not None:
            data = {CONF_EMAIL: email, CONF_PASSWORD: user_input[CONF_PASSWORD]}
            try:
                await _async_validate_input(self.hass, data)
            except MolotovAuthError as err:
                errors["base"], said = _sign_in_error(err)
                _LOGGER.warning("Molotov re-authentication failed: %s", err)
            except MolotovApiError as err:
                errors["base"], said = _sign_in_error(err)
                _LOGGER.exception("Molotov API error during reauth: %s", err)
            else:
                return self.async_update_reload_and_abort(reauth_entry, data=data)

        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema({vol.Required(CONF_PASSWORD): str}),
            description_placeholders={"email": email, "message": said},
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
                ): selector.TextSelector(selector.TextSelectorConfig(multiline=True)),
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
        language="fr",
        device_id=await async_device_id(hass, data[CONF_EMAIL]),
    )
    await api.async_login()
