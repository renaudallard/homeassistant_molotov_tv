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

"""Persistent storage for Molotov TV integration."""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    DOMAIN,
    RESUME_EXPIRY_DAYS,
    RESUME_MAX_PERCENT,
    RESUME_MIN_POSITION,
    RESUME_STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)


class ResumePositionStore:
    """Manages resume position storage for VOD content."""

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        """Initialize the resume position store."""
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(
            hass, RESUME_STORAGE_VERSION, f"{DOMAIN}.{entry_id}.resume"
        )
        self._data: dict[str, dict[str, Any]] = {}
        self._loaded = False

    async def async_load(self) -> None:
        """Load stored positions from disk."""
        data = await self._store.async_load()
        if data and isinstance(data, dict):
            self._data = data.get("positions", {})
        else:
            self._data = {}
        self._loaded = True
        _LOGGER.debug("Loaded %d resume positions", len(self._data))

        # Cleanup expired entries on load
        await self.async_cleanup_expired()

    async def _async_save(self) -> None:
        """Save positions to disk."""
        await self._store.async_save({"positions": self._data})

    async def async_save_position(
        self,
        content_id: str,
        position: float,
        duration: float,
        title: str | None = None,
    ) -> None:
        """Save playback position for content.

        Only saves if position meets criteria:
        - Position > RESUME_MIN_POSITION seconds
        - Position < RESUME_MAX_PERCENT of duration
        """
        if not content_id:
            return

        # Don't save if position is too early
        if position < RESUME_MIN_POSITION:
            _LOGGER.debug(
                "Not saving position %.1f for %s (< %d seconds)",
                position,
                content_id,
                RESUME_MIN_POSITION,
            )
            return

        # Don't save if nearly finished watching
        if duration > 0 and (position / duration) >= RESUME_MAX_PERCENT:
            _LOGGER.debug(
                "Not saving position %.1f/%.1f for %s (>= %.0f%% watched)",
                position,
                duration,
                content_id,
                RESUME_MAX_PERCENT * 100,
            )
            # Clear any existing position since they finished
            await self.async_clear_position(content_id)
            return

        self._data[content_id] = {
            "position": position,
            "duration": duration,
            "title": title,
            "saved_at": dt_util.utcnow().isoformat(),
        }

        await self._async_save()
        _LOGGER.debug(
            "Saved resume position %.1f/%.1f for %s (%s)",
            position,
            duration,
            content_id,
            title,
        )

    async def async_get_position(self, content_id: str) -> dict[str, Any] | None:
        """Get saved position for content.

        Returns dict with 'position', 'duration', 'title', 'saved_at' or None.
        """
        if not content_id:
            return None

        data = self._data.get(content_id)
        if not data:
            return None

        # Check if expired
        saved_at_str = data.get("saved_at")
        if saved_at_str:
            try:
                saved_at = datetime.fromisoformat(saved_at_str)
                if dt_util.utcnow() - saved_at > timedelta(days=RESUME_EXPIRY_DAYS):
                    _LOGGER.debug("Resume position for %s expired", content_id)
                    await self.async_clear_position(content_id)
                    return None
            except (ValueError, TypeError):
                pass

        return data

    async def async_clear_position(self, content_id: str) -> None:
        """Clear saved position for content."""
        if content_id in self._data:
            del self._data[content_id]
            await self._async_save()
            _LOGGER.debug("Cleared resume position for %s", content_id)

    async def async_cleanup_expired(self) -> None:
        """Remove positions older than RESUME_EXPIRY_DAYS."""
        now = dt_util.utcnow()
        expired = []

        for content_id, data in self._data.items():
            saved_at_str = data.get("saved_at")
            if not saved_at_str:
                continue
            try:
                saved_at = datetime.fromisoformat(saved_at_str)
                if now - saved_at > timedelta(days=RESUME_EXPIRY_DAYS):
                    expired.append(content_id)
            except (ValueError, TypeError):
                continue

        if expired:
            for content_id in expired:
                del self._data[content_id]
            await self._async_save()
            _LOGGER.debug("Cleaned up %d expired resume positions", len(expired))

    def get_all_positions(self) -> dict[str, dict[str, Any]]:
        """Get all stored positions (for debugging)."""
        return dict(self._data)
