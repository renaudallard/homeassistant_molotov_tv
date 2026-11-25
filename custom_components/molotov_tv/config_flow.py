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

"""Config flow for Molotov TV.

The account is linked as a TV is: the flow shows a code, the user confirms it
on molotov.tv/tv (or in etincelle, under Connecter une TV), and the backend
hands over a session. No password is asked for or kept, and an account that
asks for a code by email at each sign-in links all the same. Only the refresh
token is kept, with a device id made for the entry.
"""

from __future__ import annotations

import asyncio
import logging
import time
import uuid
from collections.abc import Mapping
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import MolotovApi, MolotovApiError
from .const import (
    CONF_CAST_HOSTS,
    CONF_CAST_TARGET,
    CONF_CAST_TARGETS,
    CONF_DEVICE_ID,
    CONF_EMAIL,
    CONF_PASSWORD,
    CONF_PROFILE,
    CONF_REFRESH_TOKEN,
    DEFAULT_ENVIRONMENT,
    DOMAIN,
)
from .helpers import async_device_id

_LOGGER = logging.getLogger(__name__)

# Where the user confirms the code, as shown in the flow.
LINK_URL = "molotov.tv/tv"

# How often the flow asks whether the code was confirmed, and how long before
# the code runs out it stops asking (a confirmation then would come too late).
LINK_POLL_S = 4
LINK_MARGIN_S = 10


def _request_error(err: MolotovApiError) -> str:
    """Return the abort reason for a code that could not be had."""

    if err.status == 451:
        # Region, VPN or subscription: the service is refused from here.
        return "unavailable_here"
    return "cannot_connect"


class MolotovTvConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Molotov TV."""

    VERSION = 1

    def __init__(self) -> None:
        self._api: MolotovApi | None = None
        self._device_id: str | None = None
        self._code = ""
        self._lifetime = 0
        self._wait: asyncio.Task[bool] | None = None

    async def async_step_user(self, user_input: dict | None = None):
        """Link a new account with a device id of its own."""
        self._device_id = str(uuid.uuid4())
        return await self.async_step_link()

    async def async_step_reauth(self, entry_data: Mapping[str, Any]):
        """Link the account again when its session can no longer be renewed."""
        # The same device as before: an entry set up with a password has its
        # id derived from the email.
        self._device_id = entry_data.get(CONF_DEVICE_ID) or await async_device_id(
            self.hass, entry_data.get(CONF_EMAIL) or ""
        )
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(self, user_input: dict | None = None):
        """Say why the account is to be linked again, then show a code."""
        if user_input is not None:
            return await self.async_step_link()
        return self.async_show_form(
            step_id="reauth_confirm", description_placeholders={"url": LINK_URL}
        )

    async def async_step_link(self, user_input: dict | None = None):
        """Show a code and wait for the user to confirm it."""
        if self._wait is None:
            assert self._device_id is not None
            self._api = MolotovApi(
                async_get_clientsession(self.hass),
                email=None,
                password=None,
                environment=DEFAULT_ENVIRONMENT,
                language="fr",
                device_id=self._device_id,
            )
            try:
                self._code, self._lifetime = await self._api.async_request_link_code()
            except MolotovApiError as err:
                _LOGGER.warning("Could not get a Molotov link code: %s", err)
                return self.async_abort(
                    reason=_request_error(err),
                    description_placeholders={"message": err.user_message or ""},
                )
            self._wait = self.hass.async_create_task(self._async_wait_for_link())
        if not self._wait.done():
            return self.async_show_progress(
                step_id="link",
                progress_action="link",
                progress_task=self._wait,
                description_placeholders={
                    "code": self._code,
                    "url": LINK_URL,
                    "minutes": str(max(1, self._lifetime // 60)),
                },
            )
        try:
            linked = self._wait.result()
        except Exception:  # a failed wait is a code not confirmed
            _LOGGER.exception("Waiting for the Molotov link code failed")
            linked = False
        self._wait = None
        return self.async_show_progress_done(
            next_step_id="finish" if linked else "expired"
        )

    async def async_step_expired(self, user_input: dict | None = None):
        """The code ran out before it was confirmed: offer a new one."""
        if user_input is not None:
            return await self.async_step_link()
        return self.async_show_form(step_id="expired")

    async def async_step_finish(self, user_input: dict | None = None):
        """Keep what the linked session needs and create or update the entry."""
        assert self._api is not None
        state = self._api.session_state
        if not state.user_id or not state.refresh_token:
            return self.async_abort(reason="cannot_connect")
        data: dict[str, Any] = {
            CONF_DEVICE_ID: self._device_id,
            CONF_REFRESH_TOKEN: state.refresh_token,
        }
        if self.source == config_entries.SOURCE_REAUTH:
            entry = self._get_reauth_entry()
            if not _same_account(entry, state.user_id, state.email):
                return self.async_abort(reason="wrong_account")
            # A password kept from before linking existed is not needed any more.
            kept = {k: v for k, v in entry.data.items() if k != CONF_PASSWORD}
            return self.async_update_reload_and_abort(entry, data={**kept, **data})
        await self.async_set_unique_id(state.user_id)
        self._abort_if_unique_id_configured()
        if state.email:
            for entry in self._async_current_entries():
                if entry.data.get(CONF_EMAIL, "").lower() == state.email.lower():
                    return self.async_abort(reason="already_configured")
            data[CONF_EMAIL] = state.email
        title = f"Molotov TV ({state.email})" if state.email else "Molotov TV"
        return self.async_create_entry(title=title, data=data)

    async def _async_wait_for_link(self) -> bool:
        """Ask whether the code was confirmed until it is, or runs out."""
        assert self._api is not None
        deadline = time.monotonic() + max(LINK_POLL_S, self._lifetime - LINK_MARGIN_S)
        while time.monotonic() < deadline:
            await asyncio.sleep(LINK_POLL_S)
            try:
                if await self._api.async_poll_link_code(self._code):
                    return True
            except MolotovApiError as err:
                _LOGGER.debug("Molotov link code not confirmed yet: %s", err)
        return False

    @callback
    def async_remove(self) -> None:
        """Stop waiting for a code when the flow is closed."""
        if self._wait is not None and not self._wait.done():
            self._wait.cancel()

    @staticmethod
    def async_get_options_flow(config_entry: config_entries.ConfigEntry):
        return MolotovTvOptionsFlowHandler(config_entry)


def _same_account(
    entry: config_entries.ConfigEntry, user_id: str, email: str | None
) -> bool:
    """Whether the account just linked is the one [entry] is for.

    An entry linked by code is known by the account id; one set up with a
    password by its email, which the backend may not give back: it is then
    taken on trust.
    """
    if entry.unique_id == user_id:
        return True
    known = entry.data.get(CONF_EMAIL)
    if not known:
        return False
    return email is None or bool(known.lower() == email.lower())


class MolotovTvOptionsFlowHandler(config_entries.OptionsFlowWithReload):
    """Handle Molotov TV options; a change reloads the entry."""

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

        fields: dict[Any, Any] = {}
        # The profile, among those the running entry's session knows of: only
        # an account with more than one has a choice to make.
        loaded = self.hass.data.get(DOMAIN, {}).get(self._config_entry.entry_id)
        state = loaded["api"].session_state if loaded else None
        if state is not None and len(state.profiles) > 1:
            fields[
                vol.Optional(
                    CONF_PROFILE,
                    default=self._config_entry.options.get(CONF_PROFILE)
                    or state.profile_id,
                )
            ] = selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        selector.SelectOptionDict(value=profile_id, label=name)
                        for profile_id, name in state.profiles
                    ],
                    mode=selector.SelectSelectorMode.DROPDOWN,
                )
            )
        data_schema = vol.Schema(
            {
                **fields,
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
