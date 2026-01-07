# Molotov TV for Home Assistant

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/renaudallard/homeassistant_molotov.tv)

Unofficial custom integration that brings **Molotov TV** to your Home Assistant media browser. Browse channels, watch live TV, access replays, and cast content directly to your Chromecast devices.

---

## ✨ Features

*   **📺 Live TV & EPG:** Browse all your channels with real-time program guides.
*   **⏪ Replay & VOD:** Access catch-up TV and Video on Demand content associated with your channels.
*   **📼 Recordings:** View and play your cloud recordings (Bookmarks).
*   **🔍 Search:** Integrated search for programs, personalities, and channels.
*   **📲 Casting:** Seamlessly cast to Chromecast devices with support for:
    *   **Official Receiver:** Uses Molotov's native receiver for full DRM support (Live TV).
    *   **Arnor Receiver:** A custom, lightweight receiver option (experimental).
*   **💻 Local Playback:** Watch directly in your Home Assistant dashboard browser with a custom video card.
*   **🔄 Auto-Discovery:** Automatically finds Chromecast devices on your network.

## 📋 Requirements

*   **Home Assistant** (version 2025.10.0 or later).
*   **Molotov Premium or VIP Account:** This integration requires a paid subscription. Free accounts are not supported.
*   **Chromecast Device:** Required for casting content to your TV.

## 🚀 Installation

### Option 1: HACS (Recommended)

1.  Open **HACS** in Home Assistant.
2.  Click the menu icon (top right) > **Custom repositories**.
3.  Add `https://github.com/renaudallard/homeassistant_molotov.tv` as an **Integration**.
4.  Click **Download** on the "Molotov TV" card.
5.  Restart Home Assistant.

### Option 2: Manual Installation

1.  Download the latest release.
2.  Copy the `custom_components/molotov_tv` folder into your Home Assistant's `config/custom_components/` directory.
3.  Restart Home Assistant.

## ⚙️ Configuration

1.  Navigate to **Settings** > **Devices & Services**.
2.  Click **+ Add Integration** and search for **Molotov TV**.
3.  Enter your **Molotov Email** and **Password**.
    *   *Note: If your account is not Premium/VIP, setup will fail with an error message.*

### Options & Tuning

Click **Configure** on the integration entry to access settings:
*   **Cast Targets:** Manually select specific `media_player` entities if auto-discovery misses them.
*   **Cast Hosts:** Manually add IP addresses of Chromecast devices (one per line) if they are on a different subnet.

## 🎮 Usage

### Media Browser
1.  Open the **Media** tab in Home Assistant.
2.  Select **Molotov TV**.
3.  Browse by **Channels**, **Recordings**, or use **Search**.
4.  Click on a program to see details and playback options.

### Casting
When you select a program, you will see a list of targets:
*   **Play on this device:** Plays locally in your browser.
*   **📺 Official Receiver:** Casts using the official Molotov application. **Use this for Live TV and encrypted content.**
*   **🏰 Arnor Receiver:** Casts using the custom integration receiver. Useful for unencrypted content or debugging.

> **Tip:** Use the **Refresh Chromecasts** button in the root folder if your device doesn't appear immediately.

### Dashboard Card
The integration automatically registers a custom frontend card. When playing locally, the card provides:
*   Standard video controls.
*   Improved buffering settings for stability.
*   Error messages directly on the video overlay if playback fails.

## 🛠️ Advanced

### Custom Receiver Hosting
The "Arnor Receiver" uses a hosted web receiver. The source code is available in the `receiver/` directory of this repository. Advanced users can host their own version by modifying `const.py` and registering a new App ID with Google.

## ⚠️ Disclaimer

This project is an unofficial integration and is **not affiliated with, endorsed by, or associated with Molotov TV**. All product names, logos, and brands are property of their respective owners.

## 📄 License

This project is licensed under the BSD 2-Clause License. See the [LICENSE](LICENSE) file for details.