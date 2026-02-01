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

"""Chromecast casting helpers for Molotov TV.

Official Receiver URL: https://chromecast.cloud-01.molotov.tv/
"""

from __future__ import annotations

from dataclasses import dataclass, field
import logging
import threading
import time
from typing import Any, Callable

from homeassistant.core import HomeAssistant

from .const import CAST_RECONNECT_ATTEMPTS, CAST_RECONNECT_DELAY

_LOGGER = logging.getLogger(__name__)

# Timeout for blocking Chromecast operations (seconds)
CAST_CONNECT_TIMEOUT = 30
CAST_MEDIA_TIMEOUT = 15

# Connection management
MAX_ACTIVE_CASTS = 5  # Maximum number of cached cast connections
CAST_CONNECTION_TTL = 3600  # Seconds before a connection is considered stale (1 hour)


@dataclass
class CastConnection:
    """Stores cast connection with metadata for reconnection."""

    cast: Any
    timestamp: float
    app_id: str | None = None
    last_asset_url: str | None = None
    last_content_type: str | None = None
    last_custom_data: dict[str, Any] | None = None
    last_title: str | None = None
    is_live: bool = False
    listeners: list[Any] = field(default_factory=list)


# Store active cast connections for control: host -> CastConnection
_active_casts: dict[str, CastConnection] = {}
_cast_lock = threading.Lock()

# Connection status callbacks: list of (host, connected) -> None
ConnectionStatusCallback = Callable[[str, bool], None]
_connection_callbacks: list[ConnectionStatusCallback] = []
_callbacks_lock = threading.Lock()

# App takeover callbacks: list of (host, new_app_id) -> None
AppTakeoverCallback = Callable[[str, str | None], None]
_app_takeover_callbacks: list[AppTakeoverCallback] = []
_app_callbacks_lock = threading.Lock()


class MolotovCastError(Exception):
    """Raised when Chromecast casting fails."""


def _cleanup_stale_casts() -> None:
    """Remove stale cast connections. Must be called with _cast_lock held."""
    now = time.time()
    stale = [
        host
        for host, conn in _active_casts.items()
        if now - conn.timestamp > CAST_CONNECTION_TTL
    ]
    for host in stale:
        conn = _active_casts.pop(host)
        try:
            conn.cast.disconnect()
        except Exception:
            pass
        _LOGGER.debug("Cleaned up stale cast connection for %s", host)


def get_active_cast(host: str) -> Any | None:
    """Get an active cast connection for a host."""
    with _cast_lock:
        conn = _active_casts.get(host)
        if conn is None:
            return None
        return conn.cast


def get_cast_connection(host: str) -> CastConnection | None:
    """Get the full CastConnection for a host."""
    with _cast_lock:
        return _active_casts.get(host)


def set_active_cast(
    host: str,
    cast: Any,
    app_id: str | None = None,
    asset_url: str | None = None,
    content_type: str | None = None,
    custom_data: dict[str, Any] | None = None,
    title: str | None = None,
    is_live: bool = False,
) -> None:
    """Store an active cast connection with metadata."""
    with _cast_lock:
        # Cleanup stale connections first
        _cleanup_stale_casts()
        # If at capacity, remove oldest connection
        while len(_active_casts) >= MAX_ACTIVE_CASTS and host not in _active_casts:
            oldest_host = min(_active_casts, key=lambda h: _active_casts[h].timestamp)
            old_conn = _active_casts.pop(oldest_host)
            try:
                old_conn.cast.disconnect()
            except Exception:
                pass
            _LOGGER.debug("Evicted oldest cast connection for %s", oldest_host)

        # Preserve existing listeners if updating
        existing = _active_casts.get(host)
        listeners = existing.listeners if existing else []

        _active_casts[host] = CastConnection(
            cast=cast,
            timestamp=time.time(),
            app_id=app_id,
            last_asset_url=asset_url,
            last_content_type=content_type,
            last_custom_data=custom_data,
            last_title=title,
            is_live=is_live,
            listeners=listeners,
        )


def remove_active_cast(host: str) -> None:
    """Remove an active cast connection."""
    with _cast_lock:
        conn = _active_casts.pop(host, None)
        if conn:
            try:
                conn.cast.disconnect()
            except Exception:
                pass


def register_connection_callback(callback: ConnectionStatusCallback) -> None:
    """Register a callback for connection status changes."""
    with _callbacks_lock:
        if callback not in _connection_callbacks:
            _connection_callbacks.append(callback)


def unregister_connection_callback(callback: ConnectionStatusCallback) -> None:
    """Unregister a connection status callback."""
    with _callbacks_lock:
        if callback in _connection_callbacks:
            _connection_callbacks.remove(callback)


def _notify_connection_status(host: str, connected: bool) -> None:
    """Notify all registered callbacks of connection status change."""
    with _callbacks_lock:
        callbacks = list(_connection_callbacks)
    for callback in callbacks:
        try:
            callback(host, connected)
        except Exception as err:
            _LOGGER.warning("Connection callback failed: %s", err)


def register_app_takeover_callback(callback: AppTakeoverCallback) -> None:
    """Register a callback for app takeover events."""
    with _app_callbacks_lock:
        if callback not in _app_takeover_callbacks:
            _app_takeover_callbacks.append(callback)


def unregister_app_takeover_callback(callback: AppTakeoverCallback) -> None:
    """Unregister an app takeover callback."""
    with _app_callbacks_lock:
        if callback in _app_takeover_callbacks:
            _app_takeover_callbacks.remove(callback)


def _notify_app_takeover(host: str, new_app_id: str | None) -> None:
    """Notify all registered callbacks of app takeover."""
    with _app_callbacks_lock:
        callbacks = list(_app_takeover_callbacks)
    for callback in callbacks:
        try:
            callback(host, new_app_id)
        except Exception as err:
            _LOGGER.warning("App takeover callback failed: %s", err)


def get_current_app_id(host: str) -> str | None:
    """Get the app ID currently running on the Chromecast."""
    conn = get_cast_connection(host)
    if not conn or not conn.cast:
        return None
    try:
        cast = conn.cast
        # Check receiver status for current app
        if hasattr(cast, "status") and cast.status:
            app_id = getattr(cast.status, "app_id", None)
            return app_id
        return None
    except Exception as err:
        _LOGGER.debug("Failed to get current app ID for %s: %s", host, err)
        return None


def is_our_app_running(host: str) -> bool:
    """Check if our expected app is still running on the Chromecast.

    Returns True if:
    - We have an active connection with an expected app_id
    - The current running app matches our expected app
    Returns False if another app has taken over or connection lost.
    """
    conn = get_cast_connection(host)
    if not conn:
        return False

    expected_app = conn.app_id
    if not expected_app:
        # No expected app set, assume OK if connected
        return is_cast_connected(host)

    current_app = get_current_app_id(host)
    if current_app is None:
        # Can't determine, check connection instead
        return is_cast_connected(host)

    if current_app != expected_app:
        _LOGGER.debug(
            "App takeover detected on %s: expected %s, got %s",
            host,
            expected_app,
            current_app,
        )
        return False

    return True


async def async_is_our_app_running(hass: HomeAssistant, host: str) -> bool:
    """Check if our app is still running asynchronously."""
    return await hass.async_add_executor_job(is_our_app_running, host)


def is_cast_connected(host: str) -> bool:
    """Check if cast connection is still alive."""
    conn = get_cast_connection(host)
    if not conn:
        return False
    try:
        cast = conn.cast
        return (
            cast is not None
            and cast.socket_client is not None
            and cast.socket_client.is_connected
        )
    except Exception:
        return False


async def async_check_cast_health(hass: HomeAssistant, host: str) -> bool:
    """Check cast connection health asynchronously."""
    return await hass.async_add_executor_job(is_cast_connected, host)


def _attempt_reconnect(host: str) -> bool:
    """Attempt to reconnect a cast connection. Returns True if successful."""
    conn = get_cast_connection(host)
    if not conn:
        return False

    _LOGGER.info("Attempting to reconnect to %s", host)

    for attempt in range(CAST_RECONNECT_ATTEMPTS):
        try:
            cast = _connect_to_chromecast(host)
            if cast is None:
                raise MolotovCastError(f"Could not connect to {host}")

            # Re-launch app if we had one
            if conn.app_id:
                _launch_cast_app(cast, conn.app_id)

            # Re-register listeners
            for listener in conn.listeners:
                try:
                    cast.media_controller.register_status_listener(listener)
                except Exception as err:
                    _LOGGER.debug("Failed to re-register listener: %s", err)

            # Update connection
            with _cast_lock:
                conn.cast = cast
                conn.timestamp = time.time()

            _LOGGER.info("Successfully reconnected to %s", host)
            _notify_connection_status(host, True)
            return True

        except Exception as err:
            _LOGGER.warning(
                "Reconnect attempt %d/%d to %s failed: %s",
                attempt + 1,
                CAST_RECONNECT_ATTEMPTS,
                host,
                err,
            )
            if attempt < CAST_RECONNECT_ATTEMPTS - 1:
                time.sleep(CAST_RECONNECT_DELAY)

    _LOGGER.error(
        "Failed to reconnect to %s after %d attempts", host, CAST_RECONNECT_ATTEMPTS
    )
    return False


async def async_attempt_reconnect(hass: HomeAssistant, host: str) -> bool:
    """Attempt to reconnect asynchronously."""
    return await hass.async_add_executor_job(_attempt_reconnect, host)


def _connect_to_chromecast(host: str) -> Any | None:
    """Connect to a Chromecast by host. Returns cast object or None."""
    try:
        import pychromecast
    except ImportError:
        _LOGGER.error("pychromecast is not available")
        return None

    cast = None
    browser = None

    try:
        # Try get_chromecasts with known_hosts
        if hasattr(pychromecast, "get_chromecasts"):
            try:
                result = pychromecast.get_chromecasts(known_hosts=[host], timeout=10)
                if isinstance(result, tuple) and len(result) >= 2:
                    chromecasts, browser = result[0], result[1]
                else:
                    chromecasts = result

                for cc in chromecasts:
                    cc_host = None
                    if hasattr(cc, "host"):
                        cc_host = cc.host
                    elif hasattr(cc, "cast_info") and hasattr(cc.cast_info, "host"):
                        cc_host = cc.cast_info.host

                    if cc_host == host:
                        cast = cc
                        break

                if cast is None and chromecasts:
                    cast = chromecasts[0]

            except Exception as err:
                _LOGGER.debug("get_chromecasts failed: %s", err)

        # Fallback: direct instantiation
        if cast is None:
            try:
                cast = pychromecast.Chromecast(host)
            except Exception:
                try:
                    cast = pychromecast.Chromecast(host=host)
                except Exception as err:
                    _LOGGER.debug("Direct Chromecast instantiation failed: %s", err)
                    return None

        if cast:
            cast.wait(timeout=CAST_CONNECT_TIMEOUT)
            if not cast.socket_client or not cast.socket_client.is_connected:
                _LOGGER.warning("Chromecast %s connection timed out", host)
                return None

        return cast

    finally:
        if browser is not None:
            try:
                from pychromecast.discovery import stop_discovery

                stop_discovery(browser)
            except Exception:
                pass


async def async_cast_media(
    hass: HomeAssistant,
    *,
    cast_target: str,
    app_id: str,
    asset_url: str,
    content_type: str,
    custom_data: dict[str, Any],
    title: str | None,
    is_live: bool,
) -> None:
    """Cast media to a Chromecast using the Molotov receiver."""

    await hass.async_add_executor_job(
        _cast_media_blocking,
        cast_target,
        app_id,
        asset_url,
        content_type,
        custom_data,
        title,
        is_live,
    )


def _cast_media_blocking(
    cast_target: str,
    app_id: str,
    asset_url: str,
    content_type: str,
    custom_data: dict[str, Any],
    title: str | None,
    is_live: bool,
) -> None:
    try:
        import pychromecast
        from pychromecast.controllers import media
    except Exception as err:  # pragma: no cover - dependency import
        raise MolotovCastError("pychromecast is not available") from err

    _LOGGER.debug(
        "pychromecast version: %s, available attrs: %s",
        getattr(pychromecast, "__version__", "unknown"),
        [a for a in dir(pychromecast) if not a.startswith("_")],
    )

    cast = None
    browser = None
    stop_discovery = None

    try:
        # Try to get stop_discovery function
        try:
            from pychromecast.discovery import stop_discovery
        except ImportError:
            _LOGGER.debug("stop_discovery not in pychromecast.discovery")
            stop_discovery = None

        # Try different pychromecast APIs
        chromecasts = None

        # Method 1: get_chromecasts with known_hosts (pychromecast 14+)
        if chromecasts is None and hasattr(pychromecast, "get_chromecasts"):
            _LOGGER.debug("Trying get_chromecasts(known_hosts=[%s])", cast_target)
            try:
                import inspect

                sig = inspect.signature(pychromecast.get_chromecasts)
                params = list(sig.parameters.keys())
                _LOGGER.debug("get_chromecasts params: %s", params)

                if "known_hosts" in params:
                    result = pychromecast.get_chromecasts(
                        known_hosts=[cast_target], timeout=10
                    )
                    if isinstance(result, tuple) and len(result) >= 2:
                        chromecasts, browser = result[0], result[1]
                    else:
                        chromecasts = result
                    _LOGGER.debug(
                        "get_chromecasts result: chromecasts=%s, browser=%s",
                        chromecasts,
                        browser,
                    )
            except Exception as err:
                _LOGGER.debug("get_chromecasts failed: %s", err)

        # Method 2: get_listed_chromecasts (older API)
        if chromecasts is None and hasattr(pychromecast, "get_listed_chromecasts"):
            _LOGGER.debug("Trying get_listed_chromecasts")
            try:
                import inspect

                sig = inspect.signature(pychromecast.get_listed_chromecasts)
                params = list(sig.parameters.keys())
                _LOGGER.debug("get_listed_chromecasts params: %s", params)

                result = pychromecast.get_listed_chromecasts()
                if isinstance(result, tuple) and len(result) >= 2:
                    chromecasts, browser = result[0], result[1]
                else:
                    chromecasts = result
                _LOGGER.debug(
                    "get_listed_chromecasts result: %d devices",
                    len(chromecasts) if chromecasts else 0,
                )
            except Exception as err:
                _LOGGER.debug("get_listed_chromecasts failed: %s", err)

        # Method 3: Direct Chromecast instantiation (legacy)
        if chromecasts is None:
            _LOGGER.debug("Trying direct Chromecast(%s)", cast_target)
            try:
                cast = pychromecast.Chromecast(cast_target)
                chromecasts = [cast]
                _LOGGER.debug("Direct Chromecast instantiation succeeded")
            except Exception as err:
                _LOGGER.debug("Direct Chromecast failed: %s", err)

        # Method 4: Chromecast with host kwarg
        if chromecasts is None:
            _LOGGER.debug("Trying Chromecast(host=%s)", cast_target)
            try:
                cast = pychromecast.Chromecast(host=cast_target)
                chromecasts = [cast]
                _LOGGER.debug("Chromecast(host=) succeeded")
            except Exception as err:
                _LOGGER.debug("Chromecast(host=) failed: %s", err)

        if not chromecasts:
            raise MolotovCastError(
                f"Chromecast '{cast_target}' was not found on the network. "
                f"pychromecast version: {getattr(pychromecast, '__version__', 'unknown')}"
            )

        # Find matching chromecast by host
        cast = None
        for cc in chromecasts:
            cc_host = None
            if hasattr(cc, "host"):
                cc_host = cc.host
            elif hasattr(cc, "cast_info") and hasattr(cc.cast_info, "host"):
                cc_host = cc.cast_info.host
            elif hasattr(cc, "socket_client") and hasattr(cc.socket_client, "host"):
                cc_host = cc.socket_client.host

            _LOGGER.debug(
                "Found chromecast: name=%s, host=%s, type=%s, attrs=%s",
                getattr(cc, "name", getattr(cc, "friendly_name", "unknown")),
                cc_host,
                type(cc).__name__,
                [a for a in dir(cc) if not a.startswith("_")][:20],
            )

            if cc_host == cast_target or cast is None:
                cast = cc
                if cc_host == cast_target:
                    break

        if cast is None:
            raise MolotovCastError(
                f"Chromecast '{cast_target}' not in discovered devices"
            )

        _LOGGER.debug("Using chromecast: %s", cast)
        _LOGGER.debug("Waiting for chromecast connection...")
        cast.wait(timeout=CAST_CONNECT_TIMEOUT)
        if not cast.socket_client or not cast.socket_client.is_connected:
            raise MolotovCastError(
                f"Chromecast '{cast_target}' connection timed out after {CAST_CONNECT_TIMEOUT}s"
            )
        _LOGGER.debug("Chromecast connected, device=%s", getattr(cast, "device", None))

        if "cast_agent" not in custom_data and getattr(cast, "device", None):
            device = cast.device
            custom_data = {
                **custom_data,
                "cast_agent": {
                    "model": getattr(device, "model_name", None)
                    or getattr(device, "friendly_name", None)
                    or "",
                    "serial": str(getattr(device, "uuid", "")),
                    "osVersion": str(getattr(device, "cast_type", "")),
                },
            }

        _LOGGER.debug("Launching cast app: %s", app_id)
        _launch_cast_app(cast, app_id)

        stream_type = media.STREAM_TYPE_LIVE if is_live else media.STREAM_TYPE_BUFFERED
        _LOGGER.debug(
            "Playing media: url=%s, type=%s, stream_type=%s",
            asset_url[:100],
            content_type,
            stream_type,
        )

        # custom_data must be passed via media_info in newer pychromecast
        media_info = {"customData": custom_data}
        _LOGGER.debug(
            "media_info keys: %s", list(media_info.get("customData", {}).keys())
        )

        if title:
            cast.media_controller.play_media(
                asset_url,
                content_type,
                title=title,
                stream_type=stream_type,
                media_info=media_info,
            )
        else:
            cast.media_controller.play_media(
                asset_url,
                content_type,
                stream_type=stream_type,
                media_info=media_info,
            )

        _LOGGER.debug("Waiting for media controller to become active...")
        cast.media_controller.block_until_active(timeout=CAST_MEDIA_TIMEOUT)
        _LOGGER.debug("Cast complete")

        # Store the cast connection for later control with metadata for reconnection
        set_active_cast(
            cast_target,
            cast,
            app_id=app_id,
            asset_url=asset_url,
            content_type=content_type,
            custom_data=custom_data,
            title=title,
            is_live=is_live,
        )
        _LOGGER.debug("Stored active cast for %s", cast_target)
        _notify_connection_status(cast_target, True)
        # Don't disconnect - keep connection for controls
        cast = None  # Prevent finally from disconnecting

    except MolotovCastError:
        raise
    except Exception as err:
        _LOGGER.exception("Unexpected error during cast")
        raise MolotovCastError(f"Cast failed: {err}") from err
    finally:
        if browser is not None and stop_discovery is not None:
            try:
                _LOGGER.debug("Stopping discovery browser")
                stop_discovery(browser)
            except Exception as err:
                _LOGGER.debug("Failed to stop discovery: %s", err)
        if cast is not None:
            try:
                _LOGGER.debug("Disconnecting chromecast")
                cast.disconnect()
            except Exception as err:
                _LOGGER.debug("Failed to disconnect: %s", err)


def _launch_cast_app(cast: Any, app_id: str) -> None:
    if hasattr(cast, "receiver_controller"):
        _LOGGER.debug("Using receiver_controller.launch_app")
        cast.receiver_controller.launch_app(app_id)
        return
    if hasattr(cast, "start_app"):
        _LOGGER.debug("Using start_app")
        cast.start_app(app_id)
        return
    if hasattr(cast, "launch_app"):
        _LOGGER.debug("Using launch_app")
        cast.launch_app(app_id)
        return
    raise MolotovCastError("Chromecast does not support launching apps")


async def async_cast_switch_media(
    hass: HomeAssistant,
    host: str,
    asset_url: str,
    content_type: str,
    custom_data: dict[str, Any],
    title: str | None,
    is_live: bool,
) -> bool:
    """Switch media on an existing cast connection without reconnecting.

    Returns True if switch succeeded, False if a full reconnect is needed.
    """
    return await hass.async_add_executor_job(
        _cast_switch_media_blocking,
        host,
        asset_url,
        content_type,
        custom_data,
        title,
        is_live,
    )


def _cast_switch_media_blocking(
    host: str,
    asset_url: str,
    content_type: str,
    custom_data: dict[str, Any],
    title: str | None,
    is_live: bool,
) -> bool:
    """Switch media on existing connection. Returns True on success."""
    conn = get_cast_connection(host)
    if not conn or not is_cast_connected(host):
        _LOGGER.debug("No active connection for %s, cannot quick switch", host)
        return False

    try:
        from pychromecast.controllers import media

        cast = conn.cast
        stream_type = media.STREAM_TYPE_LIVE if is_live else media.STREAM_TYPE_BUFFERED

        _LOGGER.debug(
            "Quick switching media on %s: url=%s, type=%s",
            host,
            asset_url[:80] if asset_url else None,
            content_type,
        )

        media_info = {"customData": custom_data}

        if title:
            cast.media_controller.play_media(
                asset_url,
                content_type,
                title=title,
                stream_type=stream_type,
                media_info=media_info,
            )
        else:
            cast.media_controller.play_media(
                asset_url,
                content_type,
                stream_type=stream_type,
                media_info=media_info,
            )

        cast.media_controller.block_until_active(timeout=CAST_MEDIA_TIMEOUT)

        # Update connection metadata
        with _cast_lock:
            conn.last_asset_url = asset_url
            conn.last_content_type = content_type
            conn.last_custom_data = custom_data
            conn.last_title = title
            conn.is_live = is_live
            conn.timestamp = time.time()

        _LOGGER.info("Quick switch successful on %s: %s", host, title)
        return True

    except Exception as err:
        _LOGGER.warning("Quick switch failed on %s: %s", host, err)
        return False


def get_cast_position(host: str) -> tuple[float, float] | None:
    """Get current playback position and duration from cast.

    Returns (position, duration) tuple or None if not available.
    """
    conn = get_cast_connection(host)
    if not conn:
        return None

    try:
        status = conn.cast.media_controller.status
        if status and status.current_time is not None:
            duration = status.duration if status.duration else 0.0
            return (float(status.current_time), float(duration))
    except Exception as err:
        _LOGGER.debug("Failed to get cast position: %s", err)

    return None


async def async_get_cast_position(
    hass: HomeAssistant, host: str
) -> tuple[float, float] | None:
    """Get current playback position asynchronously."""
    return await hass.async_add_executor_job(get_cast_position, host)


async def async_cast_pause(hass: HomeAssistant, host: str) -> None:
    """Pause playback on a Chromecast."""
    await hass.async_add_executor_job(_cast_control, host, "pause")


async def async_cast_play(hass: HomeAssistant, host: str) -> None:
    """Resume playback on a Chromecast."""
    await hass.async_add_executor_job(_cast_control, host, "play")


async def async_cast_stop(hass: HomeAssistant, host: str) -> None:
    """Stop playback on a Chromecast."""
    await hass.async_add_executor_job(_cast_control, host, "stop")


async def async_cast_seek(hass: HomeAssistant, host: str, position: float) -> None:
    """Seek to position on a Chromecast."""
    await hass.async_add_executor_job(_cast_control, host, "seek", position)


async def async_cast_volume(hass: HomeAssistant, host: str, level: float) -> None:
    """Set volume on a Chromecast."""
    await hass.async_add_executor_job(_cast_control, host, "volume", level)


async def async_cast_mute(hass: HomeAssistant, host: str, mute: bool) -> None:
    """Mute/unmute a Chromecast."""
    await hass.async_add_executor_job(_cast_control, host, "mute", mute)


async def async_cast_volume_up(
    hass: HomeAssistant, host: str, step: float = 0.1
) -> None:
    """Increase volume on a Chromecast by step (default 10%)."""
    await hass.async_add_executor_job(_cast_control, host, "volume_up", step)


async def async_cast_volume_down(
    hass: HomeAssistant, host: str, step: float = 0.1
) -> None:
    """Decrease volume on a Chromecast by step (default 10%)."""
    await hass.async_add_executor_job(_cast_control, host, "volume_down", step)


async def async_cast_skip_forward(
    hass: HomeAssistant, host: str, seconds: float = 30
) -> None:
    """Skip forward on a Chromecast."""
    await hass.async_add_executor_job(_cast_control, host, "skip_forward", seconds)


async def async_cast_skip_back(
    hass: HomeAssistant, host: str, seconds: float = 10
) -> None:
    """Skip back on a Chromecast."""
    await hass.async_add_executor_job(_cast_control, host, "skip_back", seconds)


async def async_cast_register_listener(
    hass: HomeAssistant, host: str, callback: Any
) -> None:
    """Register a status listener for the active cast."""
    await hass.async_add_executor_job(_cast_register_listener, host, callback)


async def async_cast_select_track(
    hass: HomeAssistant, host: str, track_id: int
) -> None:
    """Select a specific track (audio/subtitle) on the Chromecast."""
    await hass.async_add_executor_job(_cast_select_track, host, track_id)


def _cast_register_listener(host: str, callback: Any) -> None:
    conn = get_cast_connection(host)
    if not conn:
        return
    try:
        conn.cast.media_controller.register_status_listener(callback)
        # Store listener for reconnection
        with _cast_lock:
            if callback not in conn.listeners:
                conn.listeners.append(callback)
        _LOGGER.debug("Registered status listener for %s", host)
    except Exception as err:
        _LOGGER.warning("Failed to register listener: %s", err)


def _cast_select_track(host: str, track_id: int) -> None:
    cast = get_active_cast(host)
    if not cast:
        return
    try:
        # Enable the track (activates it)
        cast.media_controller.enable_subtitle(
            track_id
        )  # enable_subtitle works for audio too in some versions, or update_active_track_ids
        # Explicitly update active tracks
        cast.media_controller.update_active_track_ids([track_id])
        _LOGGER.debug("Selected track %s on %s", track_id, host)
    except Exception as err:
        _LOGGER.error("Failed to select track: %s", err)


def _cast_control(host: str, action: str, *args: Any) -> bool:
    """Execute a control action on a Chromecast. Returns True if successful."""
    conn = get_cast_connection(host)
    if not conn:
        _LOGGER.warning("No active cast for %s, cannot %s", host, action)
        return False

    # Health check before operation
    if not is_cast_connected(host):
        _LOGGER.warning("Cast connection lost for %s, attempting reconnect", host)
        _notify_connection_status(host, False)

        if _attempt_reconnect(host):
            _LOGGER.info("Reconnected to %s, retrying %s", host, action)
            # Refresh connection reference after reconnect
            conn = get_cast_connection(host)
            if not conn:
                return False
        else:
            _LOGGER.error("Failed to reconnect to %s, cannot %s", host, action)
            remove_active_cast(host)
            return False

    cast = conn.cast
    try:
        mc = cast.media_controller
        _LOGGER.debug("Executing %s on %s", action, host)

        if action == "pause":
            mc.pause()
        elif action == "play":
            mc.play()
        elif action == "stop":
            mc.stop()
            _notify_connection_status(host, False)
            # Clean up after stop
            try:
                cast.disconnect()
            except Exception:
                pass
            remove_active_cast(host)
        elif action == "seek" and args:
            mc.seek(args[0])
        elif action == "volume" and args:
            cast.set_volume(args[0])
        elif action == "mute" and args:
            cast.set_volume_muted(args[0])
        elif action == "skip_forward" and args:
            status = mc.status
            if status and status.current_time is not None:
                new_pos = status.current_time + args[0]
                mc.seek(new_pos)
            else:
                _LOGGER.warning("Cannot skip forward: no current position")
        elif action == "skip_back" and args:
            status = mc.status
            if status and status.current_time is not None:
                new_pos = max(0, status.current_time - args[0])
                mc.seek(new_pos)
            else:
                _LOGGER.warning("Cannot skip back: no current position")
        elif action == "volume_up" and args:
            current = cast.status.volume_level if cast.status else 0.5
            new_level = min(1.0, current + args[0])
            cast.set_volume(new_level)
        elif action == "volume_down" and args:
            current = cast.status.volume_level if cast.status else 0.5
            new_level = max(0.0, current - args[0])
            cast.set_volume(new_level)
        else:
            _LOGGER.warning("Unknown cast action: %s", action)
            return False

        _LOGGER.debug("Cast %s completed", action)
        return True
    except Exception as err:
        _LOGGER.error("Cast %s failed: %s", action, err)
        # Check if this was a connection issue
        if not is_cast_connected(host):
            _notify_connection_status(host, False)
        return False
