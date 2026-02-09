/**
 * Molotov TV Sidebar Panel
 * LitElement panel with channel list, EPG info, and embedded dash.js player
 */

import { LitElement, html, css } from "lit-element";

const VERSION = "0.1.21";

// Detect mobile/WebView where Widevine DRM doesn't work
function isMobileOrWebView() {
  const ua = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const isWebView = /wv|WebView/i.test(ua) || (window.navigator.standalone === true);
  return isMobile || isWebView;
}

// Language code to display name mapping
const LANG_NAMES = {
  fr: "Francais",
  fra: "Francais",
  fre: "Francais",
  en: "English",
  eng: "English",
  de: "Deutsch",
  deu: "Deutsch",
  ger: "Deutsch",
  es: "Espanol",
  spa: "Espanol",
  it: "Italiano",
  ita: "Italiano",
  pt: "Portugues",
  por: "Portugues",
  qaa: "Original",
  und: "Indefini",
  mul: "Multiple",
};

function getLangName(code) {
  if (!code) return "Inconnu";
  const lower = code.toLowerCase();
  return LANG_NAMES[lower] || code.toUpperCase();
}

function decodeAssetPayload(mediaContentId) {
  // Format: prefix:base64_payload
  const parts = mediaContentId.split(":");
  if (parts.length < 2) return null;
  const encoded = parts.slice(1).join(":");
  try {
    // Add padding if needed
    let padded = encoded;
    const padding = encoded.length % 4;
    if (padding) {
      padded += "=".repeat(4 - padding);
    }
    // URL-safe base64 decode
    const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

class MolotovPanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      panel: { type: Object },
      _channels: { type: Array },
      _loading: { type: Boolean },
      _error: { type: String },
      _playing: { type: Boolean },
      _selectedChannel: { type: Object },
      _streamData: { type: Object },
      _isFullscreen: { type: Boolean },
      _playerError: { type: String },
      _playerLoading: { type: Boolean },
      // Player state
      _currentTime: { type: Number },
      _duration: { type: Number },
      _volume: { type: Number },
      _muted: { type: Boolean },
      _paused: { type: Boolean },
      _audioTracks: { type: Array },
      _textTracks: { type: Array },
      _selectedAudioIndex: { type: Number },
      _selectedTextIndex: { type: Number },
      _isLive: { type: Boolean },
      _programStart: { type: Number },
      _programEnd: { type: Number },
      _showAudioMenu: { type: Boolean },
      _showTextMenu: { type: Boolean },
      _expandedChannels: { type: Object },
      _channelPrograms: { type: Object },
      _loadingPrograms: { type: Object },
      _searchQuery: { type: String },
      _searchResults: { type: Array },
      _searching: { type: Boolean },
      _showingSearch: { type: Boolean },
      _expandedResults: { type: Object },
      _resultEpisodes: { type: Object },
      _loadingEpisodes: { type: Object },
      _castTargets: { type: Array },
      _selectedTarget: { type: String },
      _activeTab: { type: String },
      _recordings: { type: Array },
      _loadingRecordings: { type: Boolean },
      _expandedRecordings: { type: Object },
      _recordingEpisodes: { type: Object },
      _loadingRecordingEpisodes: { type: Object },
      // Cast playback state
      _castPlaying: { type: Boolean },
      _castTarget: { type: String },
      _castTitle: { type: String },
      // Multi-cast state
      _activeCasts: { type: Object },
      _focusedCastHost: { type: String },
      // Track if this session initiated local playback
      _localPlaybackInitiated: { type: Boolean },
      _localMinimized: { type: Boolean },
      _castMinimized: { type: Boolean },
      _castLoading: { type: Boolean },
      // Tonight EPG
      _tonightChannels: { type: Array },
      _loadingTonight: { type: Boolean },
      // Episode auto-play
      _episodePlaylist: { type: Array },
      _episodeIndex: { type: Number },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        background: var(--primary-background-color);
        overflow: hidden;
      }

      .container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .cast-select {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        min-width: 100px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      /* Tabs */
      .tabs {
        display: flex;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .tabs::-webkit-scrollbar {
        display: none;
      }

      .tab {
        flex: 0 0 auto;
        padding: 12px 16px;
        white-space: nowrap;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--secondary-text-color);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .tab:hover {
        color: var(--primary-text-color);
        background: var(--secondary-background-color);
      }

      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      /* Recording item */
      .recording-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .recording-item:hover {
        background: var(--secondary-background-color);
      }

      .recording-thumb {
        width: 100px;
        height: 56px;
        object-fit: cover;
        border-radius: 4px;
        background: #000;
        flex-shrink: 0;
      }

      .recording-info {
        flex: 1;
        min-width: 0;
      }

      .recording-title {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .recording-subtitle {
        font-size: 12px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      button {
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      button:hover {
        opacity: 0.9;
      }

      button.secondary {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
      }

      button.danger {
        background: #f44336;
      }

      button.icon-btn {
        padding: 8px;
        background: transparent;
        color: #fff;
      }

      button.icon-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .pubs-btn {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .pubs-label {
        font-size: 10px;
        opacity: 0.8;
      }

      .content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .loading,
      .error {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: var(--secondary-text-color);
      }

      .error {
        color: var(--error-color);
        flex-direction: column;
        gap: 16px;
      }

      .channel-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }


      .channel-logo {
        width: 48px;
        height: 48px;
        object-fit: contain;
        border-radius: 4px;
        background: #000;
        flex-shrink: 0;
      }

      .channel-info {
        flex: 1;
        min-width: 0;
      }

      .channel-name {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .program-info {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .program-now {
        margin-bottom: 2px;
      }

      .program-next {
        opacity: 0.7;
        font-size: 12px;
      }

      .program-time {
        color: var(--primary-color);
        font-weight: 500;
      }

      /* Player view */
      .player-view {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      .player-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
        flex-shrink: 0;
      }

      .player-header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .player-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #000;
        position: relative;
        min-height: 0;
        overflow: hidden;
      }

      .video-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: 0;
        overflow: hidden;
      }

      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
      }

      .player-info {
        padding: 12px 16px;
        background: var(--card-background-color);
        flex-shrink: 0;
      }

      .now-playing-title {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .now-playing-program {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .player-error {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 16px 24px;
        border-radius: 8px;
        text-align: center;
        max-width: 80%;
      }

      .player-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        z-index: 5;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: var(--primary-color, #03a9f4);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .loading-text {
        color: #fff;
        font-size: 14px;
      }

      .cast-loading-banner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: var(--primary-color);
        color: #fff;
        font-size: 14px;
      }

      .cast-loading-banner .loading-spinner {
        width: 20px;
        height: 20px;
        border-width: 2px;
        flex-shrink: 0;
      }

      .play-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
      }

      .play-overlay:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      .play-overlay svg {
        width: 40px;
        height: 40px;
        fill: #fff;
      }

      /* Custom controls */
      .custom-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        opacity: 1;
        transition: opacity 0.3s;
      }

      .video-wrapper:not(:hover) .custom-controls.autohide {
        opacity: 0;
      }

      .progress-container {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        font-size: 12px;
      }

      .progress-bar {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        cursor: pointer;
        position: relative;
      }

      .progress-bar:hover {
        height: 6px;
      }

      .progress-filled {
        height: 100%;
        background: var(--primary-color);
        border-radius: 2px;
        position: relative;
      }

      .progress-filled::after {
        content: "";
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .progress-bar:hover .progress-filled::after {
        opacity: 1;
      }

      .controls-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .controls-left,
      .controls-right {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .volume-container {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .volume-slider {
        width: 60px;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        cursor: pointer;
      }

      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
      }

      .track-menu-container {
        position: relative;
      }

      .track-menu {
        position: absolute;
        bottom: 100%;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 4px;
        padding: 4px 0;
        min-width: 120px;
        margin-bottom: 8px;
      }

      .track-menu-item {
        padding: 8px 16px;
        color: #fff;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .track-menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .track-menu-item.selected {
        color: var(--primary-color);
      }

      .track-menu-item.selected::before {
        content: "\\2713";
      }

      .live-badge {
        background: #f44336;
        color: #fff;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
        margin-left: 8px;
      }

      .hidden {
        display: none !important;
      }

      /* Channel row with replay button */
      .channel-row {
        display: flex;
        flex-direction: column;
        background: var(--card-background-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .channel-main {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .channel-main:hover {
        background: var(--secondary-background-color);
      }

      .channel-actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-left: auto;
        flex-shrink: 0;
      }

      .replay-btn {
        background: transparent;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .replay-btn:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .replay-btn.expanded {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .replay-list {
        background: var(--secondary-background-color);
        padding: 8px 12px 12px 72px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .replay-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--card-background-color);
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
      }

      .replay-item:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .replay-thumb {
        width: 60px;
        height: 34px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .replay-item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .replay-item-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .replay-item-desc {
        font-size: 11px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
      }

      .replay-loading {
        padding: 12px;
        color: var(--secondary-text-color);
        font-size: 13px;
      }

      .replay-empty {
        padding: 12px;
        color: var(--secondary-text-color);
        font-size: 13px;
        font-style: italic;
      }

      /* Search bar */
      .search-bar {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .search-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .search-input::placeholder {
        color: var(--secondary-text-color);
      }

      .search-btn {
        padding: 10px 16px;
      }

      .search-results-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--secondary-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .search-results-title {
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .search-result-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .search-result-item:hover {
        background: var(--secondary-background-color);
      }

      .search-result-thumb {
        width: 80px;
        height: 45px;
        object-fit: cover;
        border-radius: 4px;
        background: #000;
        flex-shrink: 0;
      }

      .search-result-info {
        flex: 1;
        min-width: 0;
      }

      .search-result-title {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .search-result-subtitle {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      /* Search result row with expand */
      .search-result-row {
        background: var(--card-background-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .search-result-main {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .search-result-main:hover {
        background: var(--secondary-background-color);
      }

      .expand-icon {
        color: var(--secondary-text-color);
        transition: transform 0.2s;
      }

      .expand-icon.expanded {
        transform: rotate(90deg);
      }

      .episodes-list {
        background: var(--secondary-background-color);
        padding: 8px 12px 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .episode-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: var(--card-background-color);
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .episode-item:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .episode-thumb {
        width: 80px;
        height: 45px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
        background: #000;
      }

      .episode-info {
        flex: 1;
        min-width: 0;
      }

      .episode-title {
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .episode-desc {
        font-size: 11px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
      }

      .episodes-loading,
      .episodes-empty {
        padding: 12px;
        color: var(--secondary-text-color);
        font-size: 13px;
      }

      /* Tonight EPG styles */
      .tonight-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .tonight-channel {
        background: var(--card-background-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .tonight-channel-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--secondary-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .tonight-channel-logo {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 4px;
        background: #000;
      }

      .tonight-channel-name {
        font-weight: 500;
        font-size: 16px;
        color: var(--primary-text-color);
      }

      .tonight-programs {
        display: flex;
        flex-direction: column;
      }

      .tonight-program {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid var(--divider-color);
        transition: background 0.2s;
      }

      .tonight-program-thumb {
        width: 50px;
        height: 70px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .tonight-program-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
      }

      .tonight-program:last-child {
        border-bottom: none;
      }

      .tonight-program:hover {
        background: var(--secondary-background-color);
      }

      .tonight-program.live {
        background: rgba(var(--rgb-primary-color), 0.1);
        border-left: 3px solid var(--primary-color);
      }

      .tonight-program.past {
        opacity: 0.5;
      }

      .tonight-program-time {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .tonight-program-title {
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .tonight-program-description {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        line-height: 1.4;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .live-indicator {
        background: #f44336;
        color: #fff;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
      }

      /* Cast player placeholder */
      .cast-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      }

      .cast-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-align: center;
        padding: 32px;
        flex: 1;
      }

      .cast-info ha-icon {
        --mdc-icon-size: 64px;
        color: var(--primary-color);
        margin-bottom: 16px;
      }

      .cast-title {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .cast-target {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }

      /* Mini cast bar (shown over channel list while casting) */
      .mini-cast-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: var(--card-background-color);
        border-top: 2px solid var(--primary-color);
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
        flex-shrink: 0;
      }

      .mini-cast-info {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        flex: 1;
      }

      .mini-cast-title {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mini-cast-controls {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
      }

      .mini-live-badge {
        background: #e53935;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
      }

      /* Multi-cast bar */
      .multi-cast-bar {
        display: flex;
        gap: 8px;
        padding: 8px 16px;
        background: var(--card-background-color);
        border-top: 1px solid var(--divider-color);
        overflow-x: auto;
        flex-shrink: 0;
      }

      .cast-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: var(--secondary-background-color);
        border: 2px solid transparent;
        border-radius: 20px;
        cursor: pointer;
        font-size: 13px;
        color: var(--primary-text-color);
        white-space: nowrap;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .cast-chip:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .cast-chip.focused {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color), 0.15);
      }

      .cast-chip .chip-icon {
        display: flex;
        align-items: center;
      }

      .cast-chip .chip-stop {
        display: flex;
        align-items: center;
        padding: 2px;
        border-radius: 50%;
        cursor: pointer;
        color: var(--error-color);
      }

      .cast-chip .chip-stop:hover {
        background: var(--error-color);
        color: #fff;
      }
    `;
  }

  constructor() {
    super();
    this._boundOnFullscreenChange = this._onFullscreenChange.bind(this);
    this._boundOnDocumentClick = this._onDocumentClick.bind(this);
    this._channels = [];
    this._loading = true;
    this._error = null;
    this._playing = false;
    this._selectedChannel = null;
    this._streamData = null;
    this._isFullscreen = false;
    this._playerError = null;
    this._playerLoading = false;
    this._player = null;
    this._entityUnsubscribe = null;
    this._showPlayOverlay = false;
    // Player state
    this._currentTime = 0;
    this._duration = 0;
    this._volume = 0.5;
    this._muted = false;
    this._paused = false;
    this._audioTracks = [];
    this._textTracks = [];
    this._selectedAudioIndex = -1;
    this._selectedTextIndex = -1;
    this._isLive = false;
    this._programStart = null;
    this._programEnd = null;
    this._liveDelay = 0;
    this._liveDelay = 0;
    this._showAudioMenu = false;
    this._showTextMenu = false;
    this._updateInterval = null;
    this._expandedChannels = {};
    this._channelPrograms = {};
    this._loadingPrograms = {};
    this._searchQuery = "";
    this._searchResults = [];
    this._searching = false;
    this._showingSearch = false;
    this._expandedResults = {};
    this._resultEpisodes = {};
    this._loadingEpisodes = {};
    this._castTargets = [];
    this._isMobile = isMobileOrWebView();
    // On mobile/WebView, don't default to local (Widevine DRM doesn't work)
    this._selectedTarget = this._isMobile ? "" : "local";
    this._activeTab = "live";
    this._recordings = [];
    this._loadingRecordings = false;
    this._expandedRecordings = {};
    this._recordingEpisodes = {};
    this._loadingRecordingEpisodes = {};
    // Cast playback state
    this._castPlaying = false;
    this._castTarget = null;
    this._castTitle = null;
    // Multi-cast state
    this._activeCasts = {};
    this._focusedCastHost = null;
    this._castProgressInterval = null;
    this._castBasePosition = 0;
    this._castPositionUpdatedAt = null;
    // Track if this session initiated local playback
    this._localPlaybackInitiated = false;
    this._localMinimized = false;
    this._castMinimized = false;
    this._castLoading = false;
    // Tonight EPG
    this._tonightChannels = [];
    this._loadingTonight = false;
    // Episode auto-play
    this._episodePlaylist = [];
    this._episodeIndex = -1;
    this._episodeParentTitle = "";
    this._episodeIsRecording = false;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log(`[Molotov Panel] Connected - v${VERSION}`);
    this._hasLoadedChannels = false;
    document.addEventListener("fullscreenchange", this._boundOnFullscreenChange);
    document.addEventListener("click", this._boundOnDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupPlayer();
    this._stopCastProgressUpdate();
    document.removeEventListener("fullscreenchange", this._boundOnFullscreenChange);
    document.removeEventListener("click", this._boundOnDocumentClick);
    if (this._entityUnsubscribe) {
      this._entityUnsubscribe();
      this._entityUnsubscribe = null;
    }
  }

  _onDocumentClick(e) {
    // Close menus when clicking outside
    if (!e.composedPath().some((el) => el.classList?.contains("track-menu-container"))) {
      this._showAudioMenu = false;
      this._showTextMenu = false;
      this.requestUpdate();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has("hass") && this.hass) {
      // Load channels once hass is available
      if (!this._hasLoadedChannels) {
        this._hasLoadedChannels = true;
        this._loadChannels();
      }
      this._syncWithEntity();
    }
  }

  async _loadChannels() {
    this._loading = true;
    this._error = null;

    try {
      const entityId = this._findMolotovEntity();

      if (!entityId) {
        throw new Error("Entite Molotov TV introuvable");
      }

      console.log(`[Molotov Panel] Loading channels for ${entityId}`);

      // Use browse_media to get channels with EPG
      const result = await this.hass.callWS({
        type: "media_player/browse_media",
        entity_id: entityId,
        media_content_id: "now_playing",
        media_content_type: "directory",
      });

      if (result && result.children) {
        this._channels = result.children.map((child) => this._parseChannel(child));
        console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`);

        // Fetch cast targets using first channel
        if (this._channels.length > 0) {
          await this._fetchCastTargets(entityId, this._channels[0].mediaContentId);
        }
      } else {
        this._channels = [];
      }

      this._loading = false;
    } catch (err) {
      console.error("[Molotov Panel] Failed to load channels:", err);
      this._error = err.message || "Erreur lors du chargement des chaines";
      this._loading = false;
    }
  }

  async _fetchCastTargets(entityId, sampleMediaId) {
    try {
      // Browse a channel to get cast targets
      const result = await this.hass.callWS({
        type: "media_player/browse_media",
        entity_id: entityId,
        media_content_id: sampleMediaId,
        media_content_type: "program",
      });

      if (result && result.children) {
        // Extract cast targets from children (those starting with "cast:")
        const targets = result.children
          .filter((item) => item.media_content_id.startsWith("cast:"))
          .map((item) => ({
            mediaContentId: item.media_content_id,
            title: item.title,
          }));

        this._castTargets = targets;
        // On mobile, auto-select first cast target (local playback unavailable)
        if (this._isMobile && targets.length > 0 && (!this._selectedTarget || this._selectedTarget === "local")) {
          this._selectedTarget = targets[0].mediaContentId;
        }
        console.log(`[Molotov Panel] Found ${targets.length} cast targets`);
      }
    } catch (err) {
      console.error("[Molotov Panel] Failed to fetch cast targets:", err);
      this._castTargets = [];
    }
  }

  _handleTargetChange(e) {
    const value = e.target.value;
    // Prevent selecting local on mobile
    if (this._isMobile && value === "local") return;
    this._selectedTarget = value;
    console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`);
  }

  _switchTab(tab) {
    this._activeTab = tab;
    if (tab === "recordings" && this._recordings.length === 0) {
      this._loadRecordings();
    }
    if (tab === "tonight" && this._tonightChannels.length === 0) {
      this._loadTonight();
    }
    this.requestUpdate();
  }

  async _loadRecordings() {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    this._loadingRecordings = true;
    this._expandedRecordings = {};
    this._recordingEpisodes = {};
    this._loadingRecordingEpisodes = {};
    this.requestUpdate();

    try {
      const result = await this.hass.callWS({
        type: "media_player/browse_media",
        entity_id: entityId,
        media_content_id: "recordings",
        media_content_type: "directory",
      });

      if (result && result.children) {
        this._recordings = result.children.map((item) => {
          // Decode payload to get description
          const payload = decodeAssetPayload(item.media_content_id);
          return {
            mediaContentId: item.media_content_id,
            title: item.title,
            thumbnail: item.thumbnail,
            description: payload?.desc || null,
          };
        });
        console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`);
      } else {
        this._recordings = [];
      }
    } catch (err) {
      console.error("[Molotov Panel] Failed to load recordings:", err);
      this._recordings = [];
    }

    this._loadingRecordings = false;
    this.requestUpdate();

    // Pre-fetch episodes for all recordings in parallel so we know counts
    if (this._recordings.length > 0) {
      await Promise.all(
        this._recordings.map((rec) => this._fetchRecordingEpisodes(rec))
      );
      this.requestUpdate();
    }
  }

  async _loadTonight() {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    this._loadingTonight = true;
    this.requestUpdate();

    try {
      // Use the tonight_epg browse endpoint which fetches and filters programs server-side
      const result = await this.hass.callWS({
        type: "media_player/browse_media",
        entity_id: entityId,
        media_content_id: "tonight_epg",
        media_content_type: "directory",
      });

      if (result && result.children && result.children.length > 0) {
        // Group programs by channel (flat structure from server)
        // Format: tonight_program:channel_id:channel_name:channel_thumb:start_ts:end_ts:description
        const channelMap = new Map();

        for (const item of result.children) {
          // Skip placeholder messages
          if (!item.media_content_id.startsWith("tonight_program:")) {
            continue;
          }

          const parts = item.media_content_id.split(":");
          if (parts.length < 6) continue;

          const channelId = parts[1];
          const channelName = decodeURIComponent(parts[2]);
          const channelThumb = decodeURIComponent(parts[3]);
          const startTs = parseInt(parts[4]) * 1000;
          const endTs = parseInt(parts[5]) * 1000;
          // Description is everything after the 6th colon (may contain colons)
          const description = parts.length > 6 ? decodeURIComponent(parts.slice(6).join(":")) : "";

          // Parse title: "Status HH:MM-HH:MM Title" - extract just the title part
          let title = item.title;
          // Remove live indicator if present
          if (title.startsWith("🔴 ")) title = title.substring(3);
          // The format is "HH:MM-HH:MM Title" - remove the time prefix
          const timeMatch = title.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);
          if (timeMatch) {
            title = timeMatch[1];
          }

          const program = {
            mediaContentId: item.media_content_id,
            title: title,
            thumbnail: item.thumbnail,
            start: startTs,
            end: endTs,
            description: description,
          };

          if (!channelMap.has(channelId)) {
            channelMap.set(channelId, {
              id: channelId,
              name: channelName,
              thumbnail: channelThumb,
              programs: [],
            });
          }
          channelMap.get(channelId).programs.push(program);
        }

        // Convert map to array and sort programs within each channel
        const tonightChannels = Array.from(channelMap.values());
        for (const channel of tonightChannels) {
          channel.programs.sort((a, b) => a.start - b.start);
        }

        this._tonightChannels = tonightChannels;
        console.log(`[Molotov Panel] Loaded tonight EPG for ${tonightChannels.length} channels`);
      } else {
        this._tonightChannels = [];
      }
    } catch (err) {
      console.error("[Molotov Panel] Failed to load tonight EPG:", err);
      this._tonightChannels = [];
    }

    this._loadingTonight = false;
    this.requestUpdate();
  }

  async _toggleRecordingExpand(e, recording) {
    e.stopPropagation();
    const recordingId = recording.mediaContentId;

    if (this._expandedRecordings[recordingId]) {
      // Collapse
      this._expandedRecordings = { ...this._expandedRecordings, [recordingId]: false };
      this.requestUpdate();
      return;
    }

    // Fetch episodes if not cached
    if (!this._recordingEpisodes[recordingId]) {
      await this._fetchRecordingEpisodes(recording);
    }

    // If no episodes found (or only 1), play the recording directly
    const episodes = this._recordingEpisodes[recordingId] || [];
    if (episodes.length === 0) {
      console.log("[Molotov Panel] No episodes found, playing recording directly");
      await this._playRecordingDirectly(recording);
      return;
    }
    if (episodes.length === 1) {
      console.log("[Molotov Panel] Only 1 episode found, playing it directly");
      await this._playRecordingEpisode(episodes[0], recording.title);
      return;
    }

    // Multiple episodes - expand to show list
    this._expandedRecordings = { ...this._expandedRecordings, [recordingId]: true };
    this.requestUpdate();
  }

  async _playRecordingDirectly(recording) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    this._episodePlaylist = [];
    this._episodeIndex = -1;

    this._selectedChannel = {
      name: "",
      currentProgram: {
        title: recording.title,
        start: null,
        end: null,
      },
    };
    this._playerError = null;
    this._isLive = false;
    this._programStart = null;
    this._programEnd = null;
    this._liveDelay = 0;

    this._initPlaybackFlags();

    try {
      // Extract the base media ID from the recording (remove "recording:" prefix if present)
      let baseMediaId = recording.mediaContentId;
      if (baseMediaId.startsWith("recording:")) {
        baseMediaId = baseMediaId.substring("recording:".length);
      }
      const mediaContentId = this._buildPlayMediaId(`replay:${baseMediaId}`);
      await this.hass.callService("media_player", "play_media", {
        entity_id: entityId,
        media_content_id: mediaContentId,
        media_content_type: "video",
      });
    } catch (err) {
      console.error("[Molotov Panel] Play recording failed:", err);
      this._playerError = err.message || "Erreur de lecture";
      this._castLoading = false;
    }
  }

  async _fetchRecordingEpisodes(recording) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    const recordingId = recording.mediaContentId;
    this._loadingRecordingEpisodes = { ...this._loadingRecordingEpisodes, [recordingId]: true };
    this.requestUpdate();

    try {
      // Browse the recording to get its episodes
      const result = await this.hass.callWS({
        type: "media_player/browse_media",
        entity_id: entityId,
        media_content_id: recordingId,
        media_content_type: "recording",
      });

      if (result && result.children) {
        const episodes = this._parseEpisodeChildren(result.children, { allowCast: true });

        this._recordingEpisodes = { ...this._recordingEpisodes, [recordingId]: episodes };
        console.log(`[Molotov Panel] Found ${episodes.length} episodes for recording "${recording.title}"`);
      } else {
        this._recordingEpisodes = { ...this._recordingEpisodes, [recordingId]: [] };
      }
    } catch (err) {
      console.error("[Molotov Panel] Failed to fetch recording episodes:", err);
      this._recordingEpisodes = { ...this._recordingEpisodes, [recordingId]: [] };
    }

    this._loadingRecordingEpisodes = { ...this._loadingRecordingEpisodes, [recordingId]: false };
    this.requestUpdate();
  }

  async _playRecordingEpisode(episode, parentTitle) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    this._setEpisodePlaylist(episode, parentTitle, this._recordingEpisodes, true);

    this._selectedChannel = {
      name: "",
      currentProgram: {
        title: episode.title || parentTitle,
        start: null,
        end: null,
      },
    };
    this._playerError = null;
    this._isLive = false;
    this._programStart = null;
    this._programEnd = null;
    this._liveDelay = 0;

    this._initPlaybackFlags();

    try {
      const mediaContentId = this._buildPlayMediaId(episode.mediaContentId);
      await this.hass.callService("media_player", "play_media", {
        entity_id: entityId,
        media_content_id: mediaContentId,
        media_content_type: "video",
      });
    } catch (err) {
      console.error("[Molotov Panel] Play recording episode failed:", err);
      this._playerError = err.message || "Erreur de lecture";
      this._castLoading = false;
    }
  }

  _buildPlayMediaId(baseMediaId) {
    if (this._selectedTarget === "local") {
      return `play_local:${baseMediaId}`;
    }
    // For cast targets, extract the encoded target and build cast media ID
    // Cast target format: cast:{encoded_target}:native:{base_media_id} or cast:{encoded_target}:{base_media_id}
    const parts = this._selectedTarget.split(":");
    if (parts.length >= 2) {
      const encodedTarget = parts[1];
      const receiverType = parts.length >= 3 && parts[2] !== "native" && parts[2] !== "custom" ? "" : parts[2];
      if (receiverType) {
        return `cast:${encodedTarget}:${receiverType}:${baseMediaId}`;
      }
      return `cast:${encodedTarget}:${baseMediaId}`;
    }
    // Fallback to local
    return `play_local:${baseMediaId}`;
  }

  _isLocalPlayback() {
    return this._selectedTarget === "local";
  }

  _parseEpisodeChildren(children, { allowCast = false } = {}) {
    return children
      .filter((item) =>
        item.media_content_id.startsWith("episode:") ||
        item.media_content_id.startsWith("replay:") ||
        (allowCast && item.media_content_id.startsWith("cast:")) ||
        item.can_play
      )
      .map((item) => {
        const payload = decodeAssetPayload(item.media_content_id);
        return {
          mediaContentId: item.media_content_id,
          title: item.title,
          thumbnail: item.thumbnail,
          description: payload?.desc || null,
        };
      });
  }

  _initPlaybackFlags() {
    if (this._isLocalPlayback()) {
      this._localPlaybackInitiated = true;
      this._localMinimized = false;
    } else {
      this._castLoading = true;
    }
  }

  _parseChannel(browseItem) {
    // Parse the media_content_id to extract channel info
    // Format: "program:channel_id:start_ts:end_ts|base64_desc" or "live:channel_id"
    const fullId = browseItem.media_content_id;

    // Split description from main ID (separated by |)
    const [id, encodedDesc] = fullId.split("|");
    let description = null;
    if (encodedDesc) {
      try {
        let padded = encodedDesc;
        const padding = encodedDesc.length % 4;
        if (padding) {
          padded += "=".repeat(4 - padding);
        }
        description = decodeURIComponent(escape(atob(padded.replace(/-/g, "+").replace(/_/g, "/"))));
      } catch (e) {
        // Ignore decode errors
      }
    }

    const parts = id.split(":");

    let channelId, programStart, programEnd;
    if (parts[0] === "program") {
      channelId = parts[1];
      programStart = parts[2] ? parseInt(parts[2]) * 1000 : null;
      programEnd = parts[3] ? parseInt(parts[3]) * 1000 : null;
    } else if (parts[0] === "live") {
      channelId = parts[1];
    }

    // Parse title: "Channel Name - Program Title"
    const titleParts = browseItem.title.split(" - ");
    const channelName = titleParts[0];
    const programTitle = titleParts.slice(1).join(" - ") || "Direct";

    return {
      id: channelId,
      name: channelName,
      thumbnail: browseItem.thumbnail,
      mediaContentId: id,  // Use ID without description suffix for playback
      currentProgram: {
        title: programTitle,
        description: description,
        start: programStart,
        end: programEnd,
      },
      nextProgram: null,
    };
  }

  _findMolotovEntity() {
    if (!this.hass || !this.hass.states) return null;
    for (const entityId in this.hass.states) {
      if (entityId.startsWith("media_player.molotov")) {
        return entityId;
      }
    }
    return null;
  }

  async _toggleChannelExpand(e, channel) {
    e.stopPropagation();
    const channelId = channel.id;

    if (this._expandedChannels[channelId]) {
      // Collapse
      this._expandedChannels = { ...this._expandedChannels, [channelId]: false };
      this.requestUpdate();
      return;
    }

    // Expand and fetch programs if not cached
    this._expandedChannels = { ...this._expandedChannels, [channelId]: true };

    if (!this._channelPrograms[channelId]) {
      await this._fetchChannelPrograms(channel);
    }

    this.requestUpdate();
  }

  async _fetchChannelPrograms(channel) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    const channelId = channel.id;
    this._loadingPrograms = { ...this._loadingPrograms, [channelId]: true };
    this.requestUpdate();

    try {
      // Browse the channel to get its content including replays
      const result = await this.hass.callWS({
        type: "media_player/browse_media",
        entity_id: entityId,
        media_content_id: `channel:${channelId}`,
        media_content_type: "channel",
      });

      if (result && result.children) {
        // Filter to get actual replays (items after separator with replay: prefix)
        const replays = result.children
          .filter((item) => item.media_content_id.startsWith("replay:"))
          .map((item) => this._parseReplayItem(item, channel));

        this._channelPrograms = { ...this._channelPrograms, [channelId]: replays };
      }
    } catch (err) {
      console.error("[Molotov Panel] Failed to fetch channel replays:", err);
      this._channelPrograms = { ...this._channelPrograms, [channelId]: [] };
    }

    this._loadingPrograms = { ...this._loadingPrograms, [channelId]: false };
    this.requestUpdate();
  }

  _parseReplayItem(item, channel) {
    const payload = decodeAssetPayload(item.media_content_id);
    return {
      mediaContentId: item.media_content_id,
      title: item.title,
      thumbnail: item.thumbnail,
      channelName: channel.name,
      description: payload?.desc || null,
    };
  }

  async _playReplay(replay) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    this._episodePlaylist = [];
    this._episodeIndex = -1;

    this._selectedChannel = {
      name: replay.channelName,
      currentProgram: {
        title: replay.title,
        start: null,
        end: null,
      },
    };
    this._playerError = null;
    this._isLive = false;
    this._programStart = null;
    this._programEnd = null;
    this._liveDelay = 0;

    this._initPlaybackFlags();

    try {
      const mediaContentId = this._buildPlayMediaId(replay.mediaContentId);
      await this.hass.callService("media_player", "play_media", {
        entity_id: entityId,
        media_content_id: mediaContentId,
        media_content_type: "video",
      });
    } catch (err) {
      console.error("[Molotov Panel] Play replay failed:", err);
      this._playerError = err.message || "Erreur de lecture";
      this._castLoading = false;
    }
  }

  _handleSearchInput(e) {
    this._searchQuery = e.target.value;
  }

  _handleSearchKeydown(e) {
    if (e.key === "Enter") {
      this._performSearch();
    }
  }

  async _performSearch() {
    const query = this._searchQuery.trim();
    if (!query) return;

    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    this._searching = true;
    this._showingSearch = true;
    this._searchResults = [];
    this._expandedResults = {};
    this._resultEpisodes = {};
    this.requestUpdate();

    try {
      const result = await this.hass.callWS({
        type: "media_player/browse_media",
        entity_id: entityId,
        media_content_id: `search:${encodeURIComponent(query)}`,
        media_content_type: "search",
      });

      if (result && result.children) {
        const rawResults = result.children
          .filter((item) => item.media_content_id.startsWith("search_result:"))
          .map((item) => this._parseSearchResult(item));

        // Pre-fetch episodes for all results and filter out those with none
        const resultsWithEpisodes = await this._filterResultsWithEpisodes(rawResults, entityId);
        this._searchResults = resultsWithEpisodes;
        console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${query}"`);
      } else {
        this._searchResults = [];
      }
    } catch (err) {
      console.error("[Molotov Panel] Search failed:", err);
      this._searchResults = [];
    }

    this._searching = false;
    this.requestUpdate();
  }

  async _filterResultsWithEpisodes(results, entityId) {
    const validResults = [];

    // Fetch episodes for all results in parallel
    const episodePromises = results.map(async (result) => {
      try {
        const browseResult = await this.hass.callWS({
          type: "media_player/browse_media",
          entity_id: entityId,
          media_content_id: result.mediaContentId,
          media_content_type: "search_result",
        });

        if (browseResult && browseResult.children) {
          const episodes = this._parseEpisodeChildren(browseResult.children);

          if (episodes.length > 0) {
            // Cache the episodes
            this._resultEpisodes = { ...this._resultEpisodes, [result.mediaContentId]: episodes };
            return result;
          }
        }
        return null;
      } catch (err) {
        console.error(`[Molotov Panel] Failed to check episodes for "${result.title}":`, err);
        return null;
      }
    });

    const resolvedResults = await Promise.all(episodePromises);
    return resolvedResults.filter((r) => r !== null);
  }

  _parseSearchResult(item) {
    // Decode payload to get description
    const payload = decodeAssetPayload(item.media_content_id);
    return {
      mediaContentId: item.media_content_id,
      title: item.title,
      thumbnail: item.thumbnail,
      mediaClass: item.media_class,
      description: payload?.desc || null,
    };
  }

  _clearSearch() {
    this._searchQuery = "";
    this._searchResults = [];
    this._showingSearch = false;
    this._expandedResults = {};
    this._resultEpisodes = {};
    this._loadingEpisodes = {};
    this.requestUpdate();
  }

  async _toggleResultExpand(e, result) {
    e.stopPropagation();
    const resultId = result.mediaContentId;

    if (this._expandedResults[resultId]) {
      this._expandedResults = { ...this._expandedResults, [resultId]: false };
      this.requestUpdate();
      return;
    }

    this._expandedResults = { ...this._expandedResults, [resultId]: true };

    if (!this._resultEpisodes[resultId]) {
      await this._fetchResultEpisodes(result);
    }

    this.requestUpdate();
  }

  async _fetchResultEpisodes(result) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    const resultId = result.mediaContentId;
    this._loadingEpisodes = { ...this._loadingEpisodes, [resultId]: true };
    this.requestUpdate();

    try {
      // Browse the search result to get its episodes
      const browseResult = await this.hass.callWS({
        type: "media_player/browse_media",
        entity_id: entityId,
        media_content_id: resultId,
        media_content_type: "search_result",
      });

      if (browseResult && browseResult.children) {
        const episodes = this._parseEpisodeChildren(browseResult.children);

        this._resultEpisodes = { ...this._resultEpisodes, [resultId]: episodes };
        console.log(`[Molotov Panel] Found ${episodes.length} episodes for "${result.title}"`);
      } else {
        this._resultEpisodes = { ...this._resultEpisodes, [resultId]: [] };
      }
    } catch (err) {
      console.error("[Molotov Panel] Failed to fetch episodes:", err);
      this._resultEpisodes = { ...this._resultEpisodes, [resultId]: [] };
    }

    this._loadingEpisodes = { ...this._loadingEpisodes, [resultId]: false };
    this.requestUpdate();
  }

  _setEpisodePlaylist(episode, parentTitle, episodeMaps, isRecording) {
    for (const episodes of Object.values(episodeMaps)) {
      const idx = episodes.findIndex(ep => ep.mediaContentId === episode.mediaContentId);
      if (idx !== -1) {
        this._episodePlaylist = episodes;
        this._episodeIndex = idx;
        this._episodeParentTitle = parentTitle;
        this._episodeIsRecording = isRecording;
        return;
      }
    }
    // Not found in any list — no auto-play
    this._episodePlaylist = [];
    this._episodeIndex = -1;
  }

  async _playEpisode(episode, parentTitle) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    this._setEpisodePlaylist(episode, parentTitle, this._resultEpisodes, false);

    this._selectedChannel = {
      name: "",
      currentProgram: {
        title: episode.title || parentTitle,
        start: null,
        end: null,
      },
    };
    this._playerError = null;
    this._isLive = false;
    this._programStart = null;
    this._programEnd = null;
    this._liveDelay = 0;

    this._initPlaybackFlags();

    try {
      const mediaContentId = this._buildPlayMediaId(episode.mediaContentId);
      await this.hass.callService("media_player", "play_media", {
        entity_id: entityId,
        media_content_id: mediaContentId,
        media_content_type: "video",
      });
    } catch (err) {
      console.error("[Molotov Panel] Play episode failed:", err);
      this._playerError = err.message || "Erreur de lecture";
    }
  }

  _syncWithEntity() {
    const entityId = this._findMolotovEntity();
    if (!entityId || !this.hass?.states?.[entityId]) return;

    const state = this.hass.states[entityId];

    // Track local playback (stream URL present + this session initiated it)
    if (state.attributes.stream_url && this._localPlaybackInitiated) {
      const streamUrl = state.attributes.stream_url;
      const drm = state.attributes.stream_drm;
      const selectedTrack = state.attributes.stream_selected_track;

      // Only reinitialize if stream changed
      if (!this._playing || this._currentStreamUrl !== streamUrl) {
        this._currentStreamUrl = streamUrl;
        this._streamData = {
          url: streamUrl,
          drm: drm,
          selectedTrack: selectedTrack,
          title: state.attributes.media_title || "En direct",
        };
        this._playing = true;
        this._localMinimized = false;
        this._playerError = null;
        this._playerLoading = true;

        // Determine if this is live content
        const channel = this._selectedChannel;
        if (channel?.currentProgram?.start && channel?.currentProgram?.end) {
          this._isLive = true;
          this._programStart = channel.currentProgram.start;
          this._programEnd = channel.currentProgram.end;
        } else {
          this._isLive = true; // Assume live if no program info
          this._programStart = null;
          this._programEnd = null;
        }

        // Initialize player after render
        this.updateComplete.then(() => this._initDashPlayer());
      }
    } else if (this._playing) {
      // Stream URL gone but we were playing locally — stopped
      this._cleanupPlayer();
      this._playing = false;
      this._streamData = null;
      this._currentStreamUrl = null;
      this._localPlaybackInitiated = false;
      this._localMinimized = false;
    }

    // Track cast playback independently
    if (state.attributes.active_casts && Object.keys(state.attributes.active_casts).length > 0) {
      const activeCasts = state.attributes.active_casts;
      const castTarget = state.attributes.cast_target;

      this._activeCasts = activeCasts;
      this._focusedCastHost = castTarget || null;

      if (!this._castPlaying || this._castTarget !== castTarget) {
        this._castPlaying = true;
        this._castMinimized = this._isMobile;
        this._castLoading = false;
        this._castTarget = castTarget;
        this._castTitle = state.attributes.media_title || "En cours de lecture";
        this._startCastProgressUpdate();
        console.log("[Molotov Panel] Cast playback detected:", castTarget, "total casts:", Object.keys(activeCasts).length);
      }
      // Update playback state from entity (focused cast)
      this._castPositionUpdatedAt = state.attributes.media_position_updated_at
        ? new Date(state.attributes.media_position_updated_at).getTime() / 1000
        : null;
      this._castBasePosition = state.attributes.media_position || 0;
      this._duration = state.attributes.media_duration || 0;
      this._volume = state.attributes.volume_level ?? 0.5;
      this._muted = state.attributes.is_volume_muted || false;
      this._paused = state.state === "paused";
      this._castTitle = state.attributes.media_title || this._castTitle;
      this._isLive = state.attributes.is_live || false;
    } else if (this._castPlaying) {
      // No active casts but we were casting — check for next episode
      this._onPlaybackEnded();
      this._castPlaying = false;
      this._castTarget = null;
      this._castTitle = null;
      this._castMinimized = false;
      this._castLoading = false;
      this._activeCasts = {};
      this._focusedCastHost = null;
      this._stopCastProgressUpdate();
    }
  }

  async _playChannel(channel) {
    const entityId = this._findMolotovEntity();

    if (!entityId) {
      console.error("[Molotov Panel] No entity found");
      return;
    }

    this._selectedChannel = channel;
    this._playerError = null;
    this._episodePlaylist = [];
    this._episodeIndex = -1;

    this._initPlaybackFlags();

    // Set program times for progress bar (only for local playback)
    if (this._isLocalPlayback() && channel.currentProgram?.start && channel.currentProgram?.end) {
      this._programStart = channel.currentProgram.start;
      this._programEnd = channel.currentProgram.end;
      this._isLive = true;
    }

    try {
      const mediaContentId = this._buildPlayMediaId(channel.mediaContentId);
      await this.hass.callService("media_player", "play_media", {
        entity_id: entityId,
        media_content_id: mediaContentId,
        media_content_type: "video",
      });
    } catch (err) {
      console.error("[Molotov Panel] Play failed:", err);
      this._playerError = err.message || "Erreur de lecture";
      this._castLoading = false;
    }
  }

  async _initDashPlayer() {
    if (!this._streamData) return;

    const video = this.shadowRoot.querySelector("video");
    if (!video) {
      console.error("[Molotov Panel] Video element not found");
      return;
    }

    // Load dash.js if needed
    if (!window.dashjs) {
      await this._loadDashJs();
    }

    // Cleanup existing player
    if (this._player) {
      this._player.reset();
      this._player = null;
    }

    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = null;
    }

    try {
      const player = window.dashjs.MediaPlayer().create();
      this._player = player;

      player.updateSettings({
        debug: { logLevel: window.dashjs.Debug.LOG_LEVEL_WARNING },
        streaming: {
          buffer: {
            stableBufferTime: 6,
            bufferTimeAtTopQuality: 30,
            bufferTimeAtTopQualityLongForm: 60,
          },
          delay: {
            liveDelay: 3,
          },
        },
      });

      // Configure DRM if present
      const drm = this._streamData.drm;
      if (drm && drm.type === "widevine") {
        console.log("[Molotov Panel] Configuring Widevine DRM");
        player.setProtectionData({
          "com.widevine.alpha": {
            serverURL: drm.license_url,
            httpRequestHeaders: drm.headers || {},
          },
        });
      }

      // Initialize player
      player.initialize(video, this._streamData.url, true);

      // Set audio language
      const selectedTrack = this._streamData.selectedTrack;
      let audioLang = "fr";
      if (selectedTrack?.track_audio) {
        audioLang = selectedTrack.track_audio;
      }
      player.setInitialMediaSettingsFor("audio", { lang: audioLang });

      if (selectedTrack?.track_text) {
        player.setInitialMediaSettingsFor("text", { lang: selectedTrack.track_text });
      }

      // Event listeners
      player.on(window.dashjs.MediaPlayer.events.ERROR, (e) => {
        const errMsg = e.error?.message || e.error || "Erreur de lecture";
        console.error("[Molotov Panel] Player error:", errMsg);
        this._playerError = errMsg;
        this._playerLoading = false;
        this.requestUpdate();
      });

      player.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
        console.log("[Molotov Panel] Stream initialized");
        this._enforceAudioLanguage(player, selectedTrack);
        this._updateTracks();
        this._startProgressUpdate();
      });

      player.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED, () => {
        console.log("[Molotov Panel] Playback started");
        this._showPlayOverlay = false;
        this._playerLoading = false;
        this._paused = false;
        this.requestUpdate();
      });

      player.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED, () => {
        this._paused = true;
        this.requestUpdate();
      });

      player.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING, () => {
        this._paused = false;
        this.requestUpdate();
      });

      player.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED, () => {
        console.log("[Molotov Panel] Playback ended");
        this._onPlaybackEnded();
      });

      // Set initial volume
      video.volume = this._volume;
      video.muted = this._muted;

      // Check for autoplay block
      setTimeout(() => {
        if (video.paused && !video.currentTime) {
          console.log("[Molotov Panel] Autoplay blocked");
          this._showPlayOverlay = true;
          this.requestUpdate();
        }
      }, 1500);
    } catch (err) {
      console.error("[Molotov Panel] Failed to init player:", err);
      this._playerError = err.message;
    }
  }

  _startProgressUpdate() {
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
    }

    this._updateInterval = setInterval(() => {
      this._updateProgress();
    }, 1000);
  }

  _updateProgress() {
    const video = this.shadowRoot?.querySelector("video");
    if (!video || !this._player) return;

    this._currentTime = video.currentTime;
    this._duration = video.duration || 0;
    this._paused = video.paused;

    // Track how far behind the live edge we are
    if (this._isLive && video.seekable && video.seekable.length > 0) {
      const liveEdge = video.seekable.end(video.seekable.length - 1);
      this._liveDelay = Math.max(0, (liveEdge - video.currentTime) * 1000);
    }

    this.requestUpdate();
  }

  _startCastProgressUpdate() {
    this._stopCastProgressUpdate();
    this._castProgressInterval = setInterval(() => {
      this._updateCastProgress();
    }, 1000);
  }

  _stopCastProgressUpdate() {
    if (this._castProgressInterval) {
      clearInterval(this._castProgressInterval);
      this._castProgressInterval = null;
    }
  }

  _updateCastProgress() {
    if (!this._castPlaying) {
      this._stopCastProgressUpdate();
      return;
    }
    // Interpolate position from last known position + elapsed time
    if (this._castBasePosition != null && this._castPositionUpdatedAt && !this._paused) {
      const now = Date.now() / 1000;
      const elapsed = Math.max(0, now - this._castPositionUpdatedAt);
      this._currentTime = this._castBasePosition + elapsed;
    } else {
      this._currentTime = this._castBasePosition || 0;
    }
    this.requestUpdate();
  }

  _updateTracks() {
    if (!this._player) return;

    // Get audio tracks
    const audioTracks = this._player.getTracksFor("audio") || [];
    this._audioTracks = audioTracks.map((track, index) => ({
      index,
      lang: track.lang,
      label: getLangName(track.lang),
    }));

    // Find current audio track
    const currentAudio = this._player.getCurrentTrackFor("audio");
    if (currentAudio) {
      this._selectedAudioIndex = audioTracks.findIndex((t) => t.lang === currentAudio.lang);
    }

    // Get text tracks
    const textTracks = this._player.getTracksFor("text") || [];
    this._textTracks = textTracks.map((track, index) => ({
      index,
      lang: track.lang,
      label: getLangName(track.lang),
    }));

    // Check if text is enabled
    const textEnabled = this._player.isTextEnabled();
    if (!textEnabled) {
      this._selectedTextIndex = -1;
    } else {
      const currentText = this._player.getCurrentTrackFor("text");
      if (currentText) {
        this._selectedTextIndex = textTracks.findIndex((t) => t.lang === currentText.lang);
      }
    }

    console.log("[Molotov Panel] Audio tracks:", this._audioTracks);
    console.log("[Molotov Panel] Text tracks:", this._textTracks);

    this.requestUpdate();
  }

  _enforceAudioLanguage(player, selectedTrack) {
    const audioTracks = player.getTracksFor("audio");
    if (!audioTracks || audioTracks.length === 0) return;

    const currentTrack = player.getCurrentTrackFor("audio");
    const currentLang = currentTrack?.lang || "";

    let targetLang = "fr";
    if (selectedTrack?.track_audio) {
      targetLang = selectedTrack.track_audio;
    }

    if (currentLang !== targetLang && currentLang !== "fra" && currentLang !== "fre") {
      let newTrack = audioTracks.find(
        (t) => t.lang === targetLang || t.lang === "fra" || t.lang === "fre"
      );

      if (!newTrack && (currentLang === "en" || currentLang === "eng" || currentLang === "qaa")) {
        newTrack = audioTracks.find(
          (t) => t.lang !== "en" && t.lang !== "eng" && t.lang !== "qaa"
        );
      }

      if (newTrack) {
        console.log("[Molotov Panel] Switching audio to:", newTrack.lang);
        player.setCurrentTrack(newTrack);
      }
    }
  }

  _loadDashJs() {
    return new Promise((resolve, reject) => {
      if (window.dashjs) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.dashjs.org/v4.7.4/dash.all.min.js";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        console.log("[Molotov Panel] dash.js loaded");
        resolve();
      };
      script.onerror = () => {
        reject(new Error("Failed to load dash.js"));
      };
      document.head.appendChild(script);
    });
  }

  _cleanupPlayer() {
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = null;
    }

    if (this._player) {
      try {
        this._player.reset();
      } catch (e) {
        // Ignore cleanup errors
      }
      this._player = null;
    }

    this._audioTracks = [];
    this._textTracks = [];
    this._selectedAudioIndex = -1;
    this._selectedTextIndex = -1;
    this._playerLoading = false;
  }

  _stopPlayback() {
    const entityId = this._findMolotovEntity();

    if (entityId && this.hass) {
      if (this._castPlaying) {
        // Cast is active — only stop local stream, don't kill the cast
        this.hass.callService("media_player", "play_media", {
          entity_id: entityId,
          media_content_id: "stop_local",
          media_content_type: "video",
        });
      } else {
        this.hass.callService("media_player", "media_stop", {
          entity_id: entityId,
        });
      }
    }

    this._cleanupPlayer();
    this._playing = false;
    this._streamData = null;
    this._selectedChannel = null;
    this._currentStreamUrl = null;
    this._localPlaybackInitiated = false;
    this._localMinimized = false;
    this._episodePlaylist = [];
    this._episodeIndex = -1;
  }

  _onPlaybackEnded() {
    if (this._episodePlaylist.length === 0 || this._episodeIndex < 0) return;

    const nextIndex = this._episodeIndex + 1;
    if (nextIndex >= this._episodePlaylist.length) {
      // Last episode — clear playlist
      this._episodePlaylist = [];
      this._episodeIndex = -1;
      return;
    }

    const nextEpisode = this._episodePlaylist[nextIndex];
    this._episodeIndex = nextIndex;
    console.log(`[Molotov Panel] Auto-playing next episode: ${nextEpisode.title}`);

    if (this._episodeIsRecording) {
      this._playRecordingEpisode(nextEpisode, this._episodeParentTitle);
    } else {
      this._playEpisode(nextEpisode, this._episodeParentTitle);
    }
  }

  _goBackFromPlayer() {
    this._localMinimized = true;
  }

  _goBackFromCast() {
    this._castMinimized = true;
  }

  _expandCurrentPlayback() {
    if (this._playing && this._streamData) {
      this._localMinimized = false;
    } else if (this._castPlaying) {
      this._castMinimized = false;
    }
  }

  _togglePlayPause() {
    const video = this.shadowRoot.querySelector("video");
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  _localSeek(delta) {
    const video = this.shadowRoot.querySelector("video");
    if (!video) return;
    if (delta === null) { video.currentTime = 0; return; }
    const target = video.currentTime + delta;
    video.currentTime = Math.max(0, Math.min(video.duration || Infinity, target));
  }

  _localSeekBeginning() { this._localSeek(null); }
  _localSkipBack30() { this._localSeek(-30); }
  _localSkipBack10() { this._localSeek(-10); }
  _localSkipForward30() { this._localSeek(30); }
  _localSkipPubs() { this._localSeek(480); }

  _handleProgressClick(e) {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    if (this._isLive && this._programStart && this._programEnd) {
      // For live TV, seek within the DVR window
      const seekable = this._player?.getDVRSeekOffset?.(0);
      if (seekable !== undefined) {
        const duration = this._player.duration();
        const seekTime = percent * duration;
        this._player.seek(seekTime);
      }
    } else if (this._duration) {
      // For VOD, seek to percentage of duration
      const video = this.shadowRoot.querySelector("video");
      if (video) {
        video.currentTime = percent * this._duration;
      }
    }
  }

  _handleVolumeChange(e) {
    const volume = parseFloat(e.target.value);
    this._volume = volume;

    const video = this.shadowRoot.querySelector("video");
    if (video) {
      video.volume = volume;
      video.muted = volume === 0;
      this._muted = volume === 0;
    }
  }

  _toggleMute() {
    const video = this.shadowRoot.querySelector("video");
    if (!video) return;

    this._muted = !this._muted;
    video.muted = this._muted;
    this.requestUpdate();
  }

  _selectAudioTrack(index) {
    if (!this._player || index < 0 || index >= this._audioTracks.length) return;

    const tracks = this._player.getTracksFor("audio");
    if (tracks && tracks[index]) {
      this._player.setCurrentTrack(tracks[index]);
      this._selectedAudioIndex = index;
    }

    this._showAudioMenu = false;
    this.requestUpdate();
  }

  _selectTextTrack(index) {
    if (!this._player) return;

    if (index === -1) {
      // Disable subtitles
      this._player.enableText(false);
      this._selectedTextIndex = -1;
    } else if (index >= 0 && index < this._textTracks.length) {
      const tracks = this._player.getTracksFor("text");
      if (tracks && tracks[index]) {
        this._player.enableText(true);
        this._player.setCurrentTrack(tracks[index]);
        this._selectedTextIndex = index;
      }
    }

    this._showTextMenu = false;
    this.requestUpdate();
  }

  _toggleAudioMenu(e) {
    e.stopPropagation();
    this._showAudioMenu = !this._showAudioMenu;
    this._showTextMenu = false;
    this.requestUpdate();
  }

  _toggleTextMenu(e) {
    e.stopPropagation();
    this._showTextMenu = !this._showTextMenu;
    this._showAudioMenu = false;
    this.requestUpdate();
  }

  _toggleFullscreen() {
    const videoWrapper = this.shadowRoot.querySelector(".video-wrapper");
    if (!videoWrapper) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoWrapper.requestFullscreen().catch((err) => {
        console.error("[Molotov Panel] Fullscreen error:", err);
      });
    }
  }

  _onFullscreenChange() {
    this._isFullscreen = !!document.fullscreenElement;
    this.requestUpdate();
  }

  _handlePlayOverlayClick() {
    const video = this.shadowRoot.querySelector("video");
    if (video) {
      video.muted = false;
      video.play().catch((e) => console.error("[Molotov Panel] Manual play error:", e));
      this._showPlayOverlay = false;
      this.requestUpdate();
    }
  }

  _formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  _formatClockTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  _getProgressPercent() {
    if (this._isLive && this._programStart && this._programEnd) {
      // For live TV, show progress based on actual playback position
      const playbackTime = Date.now() - (this._liveDelay || 0);
      const programDuration = this._programEnd - this._programStart;
      if (programDuration <= 0) return 100;

      const elapsed = playbackTime - this._programStart;
      return Math.min(100, Math.max(0, (elapsed / programDuration) * 100));
    } else if (this._duration > 0 && isFinite(this._duration)) {
      // For VOD, show playback progress
      return (this._currentTime / this._duration) * 100;
    }
    return 0;
  }

  render() {
    const localActive = this._playing && this._streamData;
    const showFullLocal = localActive && !this._localMinimized;
    const showFullCast = this._castPlaying && !this._castMinimized;
    const showList = !showFullLocal && !showFullCast;

    return html`
      ${localActive ? html`
        <div style="${this._localMinimized
          ? 'position:fixed;left:-9999px;width:1px;height:1px;overflow:hidden;'
          : 'height:100%;'}">
          ${this._renderPlayer()}
        </div>
      ` : ''}
      ${showFullCast ? this._renderCastPlayer() : ''}
      ${showList ? this._renderChannelList() : ''}
    `;
  }

  _renderChannelList() {
    return html`
      <div class="container">
        <div class="header">
          <h1>Molotov TV</h1>
          <div class="header-actions">
            <button @click=${this._handleRefresh}>
              <ha-icon icon="mdi:refresh"></ha-icon>
              Actualiser
            </button>
            <select class="cast-select" @change=${this._handleTargetChange} .value=${this._selectedTarget}>
              ${this._isMobile ? '' : html`<option value="local">Cet appareil</option>`}
              ${this._castTargets.map(
                (target) => html`
                  <option value=${target.mediaContentId}>${target.title}</option>
                `
              )}
            </select>
          </div>
        </div>

        ${this._castLoading ? html`
          <div class="cast-loading-banner">
            <div class="loading-spinner"></div>
            Lancement sur Chromecast...
          </div>
        ` : ''}

        <div class="tabs">
          <button class="tab ${this._activeTab === "live" ? "active" : ""}" @click=${() => this._switchTab("live")}>
            <ha-icon icon="mdi:television-play"></ha-icon>
            Direct
          </button>
          <button class="tab ${this._activeTab === "tonight" ? "active" : ""}" @click=${() => this._switchTab("tonight")}>
            <ha-icon icon="mdi:weather-night"></ha-icon>
            Ce soir
          </button>
          <button class="tab ${this._activeTab === "recordings" ? "active" : ""}" @click=${() => this._switchTab("recordings")}>
            <ha-icon icon="mdi:bookmark"></ha-icon>
            Enregistrements
          </button>
          <button class="tab" @click=${this._expandCurrentPlayback}>
            <ha-icon icon="mdi:play-circle"></ha-icon>
            En cours
          </button>
        </div>

        <div class="search-bar">
          <input
            type="text"
            class="search-input"
            placeholder="Rechercher un programme..."
            .value=${this._searchQuery}
            @input=${this._handleSearchInput}
            @keydown=${this._handleSearchKeydown}
          />
          <button class="search-btn" @click=${this._performSearch}>
            <ha-icon icon="mdi:magnify"></ha-icon>
          </button>
        </div>

        ${this._showingSearch
          ? this._renderSearchResults()
          : this._activeTab === "live"
          ? this._renderChannels()
          : this._activeTab === "tonight"
          ? this._renderTonight()
          : this._renderRecordings()}
      ${this._castPlaying ? this._renderMiniCastBar() : ""}
      </div>
    `;
  }

  _handleRefresh() {
    if (this._activeTab === "live") {
      this._loadChannels();
    } else if (this._activeTab === "tonight") {
      this._loadTonight();
    } else {
      this._loadRecordings();
    }
  }

  _renderChannels() {
    return html`
      <div class="content">
        ${this._loading
          ? html`<div class="loading">Chargement des chaines...</div>`
          : this._error
          ? html`
              <div class="error">
                <span>${this._error}</span>
                <button @click=${this._loadChannels}>Reessayer</button>
              </div>
            `
          : html`
              <div class="channel-list">
                ${this._channels.map((channel) => this._renderChannelItem(channel))}
              </div>
            `}
      </div>
    `;
  }

  _renderRecordings() {
    return html`
      <div class="content">
        ${this._loadingRecordings
          ? html`<div class="loading">Chargement des enregistrements...</div>`
          : this._recordings.length > 0
          ? html`
              <div class="channel-list">
                ${this._recordings.map((recording) => this._renderRecordingItem(recording))}
              </div>
            `
          : html`<div class="error">Aucun enregistrement trouve</div>`}
      </div>
    `;
  }

  _renderTonight() {
    return html`
      <div class="content">
        ${this._loadingTonight
          ? html`<div class="loading">Chargement du programme de ce soir...</div>`
          : this._tonightChannels.length > 0
          ? html`
              <div class="tonight-list">
                ${this._tonightChannels.map((channel) => this._renderTonightChannel(channel))}
              </div>
            `
          : html`<div class="error">Aucun programme disponible pour ce soir</div>`}
      </div>
    `;
  }

  _renderTonightChannel(channel) {
    return html`
      <div class="tonight-channel">
        <div class="tonight-channel-header">
          <img
            class="tonight-channel-logo"
            src=${channel.thumbnail || ""}
            alt=${channel.name}
            loading="lazy"
            @error=${(e) => (e.target.style.display = "none")}
          />
          <div class="tonight-channel-name">${channel.name}</div>
        </div>
        <div class="tonight-programs">
          ${channel.programs.map((program) => this._renderTonightProgram(program, channel))}
        </div>
      </div>
    `;
  }

  _renderTonightProgram(program, channel) {
    const startTime = this._formatClockTime(program.start);
    const endTime = this._formatClockTime(program.end);
    const now = Date.now();
    const isLive = program.start <= now && program.end > now;
    const isPast = program.end <= now;

    return html`
      <div
        class="tonight-program ${isLive ? "live" : ""} ${isPast ? "past" : ""}"
        @click=${() => this._playTonightProgram(program, channel)}
      >
        ${program.thumbnail
          ? html`<img class="tonight-program-thumb" src=${program.thumbnail} loading="lazy" @error=${(e) => (e.target.style.display = "none")} />`
          : ""}
        <div class="tonight-program-info">
          <div class="tonight-program-time">
            ${startTime} - ${endTime}
            ${isLive ? html`<span class="live-indicator">EN DIRECT</span>` : ""}
          </div>
          <div class="tonight-program-title">${program.title}</div>
          ${program.description
            ? html`<div class="tonight-program-description">${program.description}</div>`
            : ""}
        </div>
      </div>
    `;
  }

  async _playTonightProgram(program, channel) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    this._episodePlaylist = [];
    this._episodeIndex = -1;

    this._selectedChannel = {
      id: channel.id,
      name: channel.name,
      thumbnail: channel.thumbnail,
      mediaContentId: program.mediaContentId,
      currentProgram: {
        title: program.title,
        start: program.start,
        end: program.end,
      },
    };
    this._playerError = null;

    // Determine if this is live content
    const now = Date.now();
    this._isLive = program.start <= now && program.end > now;
    if (this._isLive) {
      this._programStart = program.start;
      this._programEnd = program.end;
    } else {
      this._programStart = null;
      this._programEnd = null;
    }

    this._initPlaybackFlags();

    try {
      const mediaContentId = this._buildPlayMediaId(program.mediaContentId);
      await this.hass.callService("media_player", "play_media", {
        entity_id: entityId,
        media_content_id: mediaContentId,
        media_content_type: "video",
      });
    } catch (err) {
      console.error("[Molotov Panel] Play tonight program failed:", err);
      this._playerError = err.message || "Erreur de lecture";
      this._castLoading = false;
    }
  }

  _renderRecordingItem(recording) {
    const recordingId = recording.mediaContentId;
    const isExpanded = this._expandedRecordings[recordingId];
    const episodes = this._recordingEpisodes[recordingId] || [];
    const isLoadingEpisodes = this._loadingRecordingEpisodes[recordingId];
    const hasFetched = this._recordingEpisodes[recordingId] !== undefined;
    const isSingleEpisode = hasFetched && episodes.length <= 1;

    return html`
      <div class="search-result-row">
        <div class="search-result-main" @click=${(e) => this._toggleRecordingExpand(e, recording)}>
          ${isSingleEpisode
            ? html`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`
            : html`<ha-icon
                class="expand-icon ${isExpanded ? "expanded" : ""}"
                icon="mdi:chevron-right"
              ></ha-icon>`}
          ${recording.thumbnail
            ? html`<img
                class="recording-thumb"
                src=${recording.thumbnail}
                loading="lazy"
                @error=${(e) => (e.target.style.display = "none")}
              />`
            : html`<div class="recording-thumb"></div>`}
          <div class="recording-info">
            <div class="recording-title">${recording.title}</div>
            ${recording.description
              ? html`<div class="recording-subtitle">${recording.description}</div>`
              : ""}
          </div>
        </div>
        ${isExpanded
          ? html`
              <div class="episodes-list">
                ${isLoadingEpisodes
                  ? html`<div class="episodes-loading">Chargement des episodes...</div>`
                  : episodes.length > 0
                  ? episodes.map(
                      (episode) => html`
                        <div class="episode-item" @click=${() => this._playRecordingEpisode(episode, recording.title)}>
                          ${episode.thumbnail
                            ? html`<img class="episode-thumb" src=${episode.thumbnail} loading="lazy" @error=${(e) => (e.target.style.display = "none")} />`
                            : ""}
                          <div class="episode-info">
                            <div class="episode-title">${episode.title}</div>
                            ${episode.description
                              ? html`<div class="episode-desc">${episode.description}</div>`
                              : ""}
                          </div>
                        </div>
                      `
                    )
                  : html`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `
          : ""}
      </div>
    `;
  }

  _renderSearchResults() {
    return html`
      <div class="search-results-header">
        <span class="search-results-title">
          ${this._searching
            ? "Recherche en cours..."
            : `${this._searchResults.length} resultat(s) pour "${this._searchQuery}"`}
        </span>
        <button class="secondary" @click=${this._clearSearch}>
          <ha-icon icon="mdi:close"></ha-icon>
          Fermer
        </button>
      </div>
      <div class="content">
        ${this._searching
          ? html`<div class="loading">Recherche...</div>`
          : this._searchResults.length > 0
          ? html`
              <div class="channel-list">
                ${this._searchResults.map((result) => this._renderSearchResultItem(result))}
              </div>
            `
          : html`<div class="error">Aucun resultat trouve</div>`}
      </div>
    `;
  }

  _renderSearchResultItem(result) {
    const resultId = result.mediaContentId;
    const isExpanded = this._expandedResults[resultId];
    const episodes = this._resultEpisodes[resultId] || [];
    const isLoadingEpisodes = this._loadingEpisodes[resultId];

    return html`
      <div class="search-result-row">
        <div class="search-result-main" @click=${(e) => this._toggleResultExpand(e, result)}>
          <ha-icon
            class="expand-icon ${isExpanded ? "expanded" : ""}"
            icon="mdi:chevron-right"
          ></ha-icon>
          ${result.thumbnail
            ? html`<img class="search-result-thumb" src=${result.thumbnail} loading="lazy" @error=${(e) => (e.target.style.display = "none")} />`
            : ""}
          <div class="search-result-info">
            <div class="search-result-title">${result.title}</div>
            ${result.description
              ? html`<div class="search-result-subtitle">${result.description}</div>`
              : ""}
          </div>
        </div>
        ${isExpanded
          ? html`
              <div class="episodes-list">
                ${isLoadingEpisodes
                  ? html`<div class="episodes-loading">Chargement des episodes...</div>`
                  : episodes.length > 0
                  ? episodes.map(
                      (episode) => html`
                        <div class="episode-item" @click=${() => this._playEpisode(episode, result.title)}>
                          ${episode.thumbnail
                            ? html`<img class="episode-thumb" src=${episode.thumbnail} loading="lazy" @error=${(e) => (e.target.style.display = "none")} />`
                            : ""}
                          <div class="episode-info">
                            <div class="episode-title">${episode.title}</div>
                            ${episode.description
                              ? html`<div class="episode-desc">${episode.description}</div>`
                              : ""}
                          </div>
                        </div>
                      `
                    )
                  : html`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `
          : ""}
      </div>
    `;
  }

  _renderChannelItem(channel) {
    const current = channel.currentProgram;
    const startTime = current?.start ? this._formatClockTime(current.start) : "";
    const endTime = current?.end ? this._formatClockTime(current.end) : "";
    const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : "";
    const isExpanded = this._expandedChannels[channel.id];
    const programs = this._channelPrograms[channel.id] || [];
    const isLoadingPrograms = this._loadingPrograms[channel.id];

    return html`
      <div class="channel-row">
        <div class="channel-main">
          <img
            class="channel-logo"
            src=${channel.thumbnail || ""}
            alt=${channel.name}
            loading="lazy"
            @error=${(e) => (e.target.style.display = "none")}
            @click=${() => this._playChannel(channel)}
          />
          <div class="channel-info" @click=${() => this._playChannel(channel)}>
            <div class="channel-name">${channel.name}</div>
            <div class="program-info">
              <div class="program-now">
                ${current?.title || "Direct"}
                ${timeRange ? html`<span class="program-time">(${timeRange})</span>` : ""}
              </div>
              ${current?.description
                ? html`<div class="program-next">${current.description}</div>`
                : ""}
            </div>
          </div>
          <div class="channel-actions">
            <button
              class="replay-btn ${isExpanded ? "expanded" : ""}"
              @click=${(e) => this._toggleChannelExpand(e, channel)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${isExpanded
          ? html`
              <div class="replay-list">
                ${isLoadingPrograms
                  ? html`<div class="replay-loading">Chargement...</div>`
                  : programs.length > 0
                  ? programs.map(
                      (replay) => html`
                        <div class="replay-item" @click=${() => this._playReplay(replay)}>
                          ${replay.thumbnail
                            ? html`<img class="replay-thumb" src=${replay.thumbnail} loading="lazy" @error=${(e) => (e.target.style.display = "none")} />`
                            : ""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${replay.title}</span>
                            ${replay.description
                              ? html`<span class="replay-item-desc">${replay.description}</span>`
                              : ""}
                          </div>
                        </div>
                      `
                    )
                  : html`<div class="replay-empty">Aucun replay disponible</div>`}
              </div>
            `
          : ""}
      </div>
    `;
  }

  _renderMiniCastBar() {
    return html`
      <div class="mini-cast-bar">
        <div class="mini-cast-info">
          <ha-icon icon="mdi:cast-connected" style="--mdc-icon-size: 20px; color: var(--primary-color);"></ha-icon>
          <span class="mini-cast-title">${this._castTitle || "Chromecast"}</span>
        </div>
        <div class="mini-cast-controls">
          ${this._isLive ? html`
            <span class="mini-live-badge">DIRECT</span>
          ` : ""}
          <button class="icon-btn" @click=${this._toggleCastPlayPause}>
            <ha-icon icon=${this._paused ? "mdi:play" : "mdi:pause"}></ha-icon>
          </button>
          <button class="icon-btn" @click=${this._stopCastPlayback}>
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  _renderPlayer() {
    const progressPercent = this._getProgressPercent();
    const currentAudioLabel =
      this._selectedAudioIndex >= 0 && this._audioTracks[this._selectedAudioIndex]
        ? this._audioTracks[this._selectedAudioIndex].label
        : "Audio";
    const currentTextLabel =
      this._selectedTextIndex >= 0 && this._textTracks[this._selectedTextIndex]
        ? this._textTracks[this._selectedTextIndex].label
        : "Off";

    return html`
      <div class="player-view">
        <div class="player-header">
          <div class="player-header-left">
            <button class="secondary" @click=${this._goBackFromPlayer}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
              Retour
            </button>
          </div>
          <div class="header-actions">
            <button class="danger" @click=${this._stopPlayback}>
              <ha-icon icon="mdi:stop"></ha-icon>
              Arreter
            </button>
          </div>
        </div>

        <div class="player-container">
          <div class="video-wrapper">
            <video playsinline></video>

            ${this._playerLoading
              ? html`<div class="player-loading">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">Chargement...</div>
                </div>`
              : ""}

            ${this._playerError
              ? html`<div class="player-error">${this._playerError}</div>`
              : ""}

            ${this._showPlayOverlay
              ? html`
                  <div class="play-overlay" @click=${this._handlePlayOverlayClick}>
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                `
              : ""}

            <!-- Custom controls -->
            <div class="custom-controls ${this._paused ? "" : "autohide"}">
              <div class="progress-container">
                ${this._isLive && this._programStart
                  ? html`<span>${this._formatClockTime(Date.now() - (this._liveDelay || 0))}</span>`
                  : html`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleProgressClick}>
                  <div class="progress-filled" style="width: ${progressPercent}%"></div>
                </div>
                ${this._isLive && this._programEnd
                  ? html`<span>${this._formatClockTime(this._programEnd)}</span>`
                  : html`<span>${this._formatTime(this._duration)}</span>`}
                ${this._isLive ? html`<span class="live-badge">LIVE</span>` : ""}
              </div>

              <div class="controls-row">
                <div class="controls-left">
                  <button class="icon-btn" @click=${this._localSeekBeginning}>
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._localSkipBack30}>
                    <ha-icon icon="mdi:rewind-30"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._localSkipBack10}>
                    <ha-icon icon="mdi:rewind-10"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._togglePlayPause}>
                    <ha-icon icon=${this._paused ? "mdi:play" : "mdi:pause"}></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._localSkipForward30}>
                    <ha-icon icon="mdi:fast-forward-30"></ha-icon>
                  </button>
                  <button class="icon-btn pubs-btn" @click=${this._localSkipPubs}>
                    <ha-icon icon="mdi:fast-forward"></ha-icon>
                    <span class="pubs-label">Pubs</span>
                  </button>

                  <div class="volume-container">
                    <button class="icon-btn" @click=${this._toggleMute}>
                      <ha-icon
                        icon=${this._muted || this._volume === 0
                          ? "mdi:volume-off"
                          : this._volume < 0.5
                          ? "mdi:volume-medium"
                          : "mdi:volume-high"}
                      ></ha-icon>
                    </button>
                    <input
                      type="range"
                      class="volume-slider"
                      min="0"
                      max="1"
                      step="0.05"
                      .value=${this._muted ? 0 : this._volume}
                      @input=${this._handleVolumeChange}
                    />
                  </div>
                </div>

                <div class="controls-right">
                  ${this._audioTracks.length > 1
                    ? html`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleAudioMenu}>
                            <ha-icon icon="mdi:volume-source"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${currentAudioLabel}</span>
                          </button>
                          ${this._showAudioMenu
                            ? html`
                                <div class="track-menu">
                                  ${this._audioTracks.map(
                                    (track) => html`
                                      <div
                                        class="track-menu-item ${this._selectedAudioIndex === track.index
                                          ? "selected"
                                          : ""}"
                                        @click=${() => this._selectAudioTrack(track.index)}
                                      >
                                        ${track.label}
                                      </div>
                                    `
                                  )}
                                </div>
                              `
                            : ""}
                        </div>
                      `
                    : ""}

                  ${this._textTracks.length > 0
                    ? html`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleTextMenu}>
                            <ha-icon icon="mdi:subtitles"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${currentTextLabel}</span>
                          </button>
                          ${this._showTextMenu
                            ? html`
                                <div class="track-menu">
                                  <div
                                    class="track-menu-item ${this._selectedTextIndex === -1 ? "selected" : ""}"
                                    @click=${() => this._selectTextTrack(-1)}
                                  >
                                    Off
                                  </div>
                                  ${this._textTracks.map(
                                    (track) => html`
                                      <div
                                        class="track-menu-item ${this._selectedTextIndex === track.index
                                          ? "selected"
                                          : ""}"
                                        @click=${() => this._selectTextTrack(track.index)}
                                      >
                                        ${track.label}
                                      </div>
                                    `
                                  )}
                                </div>
                              `
                            : ""}
                        </div>
                      `
                    : ""}

                  <button class="icon-btn" @click=${this._toggleFullscreen}>
                    <ha-icon icon=${this._isFullscreen ? "mdi:fullscreen-exit" : "mdi:fullscreen"}></ha-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="player-info">
          <div class="now-playing-title">
            ${this._selectedChannel?.name || "En direct"}
          </div>
          <div class="now-playing-program">
            ${this._streamData?.title || this._selectedChannel?.currentProgram?.title || ""}
          </div>
        </div>
      </div>
    `;
  }

  _renderCastPlayer() {
    const progressPercent = this._getProgressPercent();

    return html`
      <div class="player-view">
        <div class="player-header">
          <div class="player-header-left">
            <button class="secondary" @click=${this._goBackFromCast}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
              Retour
            </button>
          </div>
          <div class="header-actions">
            <ha-icon icon="mdi:cast-connected" style="color: var(--primary-color); margin-right: 8px;"></ha-icon>
            <button class="danger" @click=${this._stopCastPlayback}>
              <ha-icon icon="mdi:stop"></ha-icon>
              Arreter
            </button>
          </div>
        </div>

        <div class="player-container">
          <div class="video-wrapper cast-placeholder">
            <div class="cast-info">
              <ha-icon icon="mdi:cast-connected" style="font-size: 64px; margin-bottom: 16px;"></ha-icon>
              <div class="cast-title">${this._castTitle || "En cours de lecture"}</div>
              <div class="cast-target">Sur Chromecast</div>
            </div>

            <!-- Cast controls -->
            <div class="custom-controls">
              <div class="progress-container">
                ${this._isLive && this._programStart
                  ? html`<span>${this._formatClockTime(Date.now() - (this._liveDelay || 0))}</span>`
                  : html`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleCastSeek}>
                  <div class="progress-filled" style="width: ${progressPercent}%"></div>
                </div>
                ${this._isLive && this._programEnd
                  ? html`<span>${this._formatClockTime(this._programEnd)}</span>`
                  : html`<span>${this._formatTime(this._duration)}</span>`}
              </div>

              <div class="controls-row">
                <div class="controls-left">
                  <button class="icon-btn" @click=${this._castSeekBeginning}>
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._castSkipBack30}>
                    <ha-icon icon="mdi:rewind-30"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._castSkipBack10}>
                    <ha-icon icon="mdi:rewind-10"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._toggleCastPlayPause}>
                    <ha-icon icon=${this._paused ? "mdi:play" : "mdi:pause"}></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._castSkipForward}>
                    <ha-icon icon="mdi:fast-forward-30"></ha-icon>
                  </button>
                  <button class="icon-btn pubs-btn" @click=${this._castSkipPubs}>
                    <ha-icon icon="mdi:fast-forward"></ha-icon>
                    <span class="pubs-label">Pubs</span>
                  </button>

                  <div class="volume-container">
                    <button class="icon-btn" @click=${this._toggleCastMute}>
                      <ha-icon
                        icon=${this._muted || this._volume === 0
                          ? "mdi:volume-off"
                          : this._volume < 0.5
                          ? "mdi:volume-medium"
                          : "mdi:volume-high"}
                      ></ha-icon>
                    </button>
                    <input
                      type="range"
                      class="volume-slider"
                      min="0"
                      max="1"
                      step="0.05"
                      .value=${this._muted ? 0 : this._volume}
                      @input=${this._handleCastVolumeChange}
                    />
                  </div>
                </div>

                <div class="controls-right">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="player-info">
          <div class="now-playing-title">
            <ha-icon icon="mdi:cast" style="margin-right: 8px;"></ha-icon>
            Chromecast
          </div>
          <div class="now-playing-program">
            ${this._castTitle || ""}
          </div>
        </div>

        ${this._renderMultiCastBar()}
      </div>
    `;
  }

  _renderMultiCastBar() {
    const castEntries = Object.entries(this._activeCasts || {});
    if (castEntries.length <= 1) return "";

    return html`
      <div class="multi-cast-bar">
        ${castEntries.map(([host, info]) => {
          const isFocused = host === this._focusedCastHost;
          const title = info.title || host;
          const isPlaying = info.state === "playing";
          return html`
            <div
              class="cast-chip ${isFocused ? "focused" : ""}"
              @click=${() => this._focusCast(host)}
            >
              <span class="chip-icon">
                <ha-icon icon=${isPlaying ? "mdi:cast-connected" : "mdi:cast"} style="--mdc-icon-size: 18px;"></ha-icon>
              </span>
              <span>${title}</span>
              <span class="chip-stop" @click=${(e) => this._stopSpecificCast(e, host)}>
                <ha-icon icon="mdi:close" style="--mdc-icon-size: 16px;"></ha-icon>
              </span>
            </div>
          `;
        })}
      </div>
    `;
  }

  async _focusCast(host) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    const info = this._activeCasts[host];
    if (!info) return;

    const source = info.title || host;
    try {
      await this.hass.callService("media_player", "select_source", {
        entity_id: entityId,
        source: source,
      });
      this._focusedCastHost = host;
      this._castTarget = host;
      this._castTitle = info.title || "En cours de lecture";
      console.log("[Molotov Panel] Focused cast:", host);
    } catch (err) {
      console.error("[Molotov Panel] Focus cast failed:", err);
    }
  }

  async _stopSpecificCast(e, host) {
    e.stopPropagation();
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    // First focus the cast to stop, then stop it
    const info = this._activeCasts[host];
    if (!info) return;

    const source = info.title || host;
    try {
      await this.hass.callService("media_player", "select_source", {
        entity_id: entityId,
        source: source,
      });
      // Small delay to let focus switch
      await new Promise((r) => setTimeout(r, 200));
      await this.hass.callService("media_player", "media_stop", {
        entity_id: entityId,
      });
      console.log("[Molotov Panel] Stopped cast:", host);
    } catch (err) {
      console.error("[Molotov Panel] Stop specific cast failed:", err);
    }
  }

  async _stopCastPlayback() {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    try {
      await this.hass.callService("media_player", "media_stop", {
        entity_id: entityId,
      });
    } catch (err) {
      console.error("[Molotov Panel] Stop cast failed:", err);
    }

    this._castPlaying = false;
    this._castTarget = null;
    this._castTitle = null;
    this._activeCasts = {};
    this._focusedCastHost = null;
    this._stopCastProgressUpdate();
    this._castMinimized = false;
    this._castLoading = false;
    this._episodePlaylist = [];
    this._episodeIndex = -1;
  }

  async _toggleCastPlayPause() {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    try {
      if (this._paused) {
        await this.hass.callService("media_player", "media_play", {
          entity_id: entityId,
        });
      } else {
        await this.hass.callService("media_player", "media_pause", {
          entity_id: entityId,
        });
      }
    } catch (err) {
      console.error("[Molotov Panel] Play/pause cast failed:", err);
    }
  }

  async _castSkipForward() {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    try {
      await this.hass.callService("media_player", "media_next_track", {
        entity_id: entityId,
      });
    } catch (err) {
      console.error("[Molotov Panel] Skip forward failed:", err);
    }
  }

  _setCastPosition(position) {
    this._currentTime = position;
    this._castBasePosition = position;
    this._castPositionUpdatedAt = Date.now() / 1000;
  }

  async _castSeek(position) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    try {
      await this.hass.callService("media_player", "media_seek", {
        entity_id: entityId,
        seek_position: position,
      });
      this._setCastPosition(position);
    } catch (err) {
      console.error("[Molotov Panel] Cast seek failed:", err);
    }
  }

  async _castSeekBeginning() {
    await this._castSeek(0);
  }

  async _castSkipBack30() {
    await this._castSeek(Math.max(0, this._currentTime - 30));
  }

  async _castSkipBack10() {
    await this._castSeek(Math.max(0, this._currentTime - 10));
  }

  async _castSkipPubs() {
    await this._castSeek(Math.min(this._duration || Infinity, this._currentTime + 480));
  }

  async _handleCastSeek(e) {
    const entityId = this._findMolotovEntity();
    if (!entityId || !this._duration) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const position = percent * this._duration;

    try {
      await this.hass.callService("media_player", "media_seek", {
        entity_id: entityId,
        seek_position: position,
      });
      this._setCastPosition(position);
    } catch (err) {
      console.error("[Molotov Panel] Seek failed:", err);
    }
  }

  async _handleCastVolumeChange(e) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    const volume = parseFloat(e.target.value);
    this._volume = volume;

    try {
      await this.hass.callService("media_player", "volume_set", {
        entity_id: entityId,
        volume_level: volume,
      });
    } catch (err) {
      console.error("[Molotov Panel] Volume change failed:", err);
    }
  }

  async _toggleCastMute() {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

    try {
      await this.hass.callService("media_player", "volume_mute", {
        entity_id: entityId,
        is_volume_muted: !this._muted,
      });
      this._muted = !this._muted;
    } catch (err) {
      console.error("[Molotov Panel] Mute toggle failed:", err);
    }
  }
}

customElements.define("molotov-panel", MolotovPanel);
console.log(`[Molotov Panel] Registered - v${VERSION}`);
