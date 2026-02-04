/**
 * Molotov TV Sidebar Panel
 * LitElement panel with channel list, EPG info, and embedded dash.js player
 */

import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.5.1/lit-element.js?module";

const VERSION = "0.1.10";

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
        min-width: 150px;
      }

      .cast-select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      /* Tabs */
      .tabs {
        display: flex;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .tab {
        flex: 1;
        padding: 12px 16px;
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

      .replay-item-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

      .episodes-loading,
      .episodes-empty {
        padding: 12px;
        color: var(--secondary-text-color);
        font-size: 13px;
      }
    `;
  }

  constructor() {
    super();
    this._channels = [];
    this._loading = true;
    this._error = null;
    this._playing = false;
    this._selectedChannel = null;
    this._streamData = null;
    this._isFullscreen = false;
    this._playerError = null;
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
    this._selectedTarget = "local";
    this._activeTab = "live";
    this._recordings = [];
    this._loadingRecordings = false;
    this._expandedRecordings = {};
    this._recordingEpisodes = {};
    this._loadingRecordingEpisodes = {};
  }

  connectedCallback() {
    super.connectedCallback();
    console.log(`[Molotov Panel] Connected - v${VERSION}`);
    this._hasLoadedChannels = false;
    document.addEventListener("fullscreenchange", this._onFullscreenChange.bind(this));
    document.addEventListener("click", this._onDocumentClick.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupPlayer();
    document.removeEventListener("fullscreenchange", this._onFullscreenChange.bind(this));
    document.removeEventListener("click", this._onDocumentClick.bind(this));
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
        console.log(`[Molotov Panel] Found ${targets.length} cast targets`);
      }
    } catch (err) {
      console.error("[Molotov Panel] Failed to fetch cast targets:", err);
      this._castTargets = [];
    }
  }

  _handleTargetChange(e) {
    this._selectedTarget = e.target.value;
    console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`);
  }

  _switchTab(tab) {
    this._activeTab = tab;
    if (tab === "recordings" && this._recordings.length === 0) {
      this._loadRecordings();
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

    // Expand and fetch episodes if not cached
    this._expandedRecordings = { ...this._expandedRecordings, [recordingId]: true };

    if (!this._recordingEpisodes[recordingId]) {
      await this._fetchRecordingEpisodes(recording);
    }

    this.requestUpdate();
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
        // Filter for playable episodes
        const episodes = result.children
          .filter((item) =>
            item.media_content_id.startsWith("episode:") ||
            item.media_content_id.startsWith("replay:") ||
            item.media_content_id.startsWith("cast:") ||
            item.can_play
          )
          .map((item) => ({
            mediaContentId: item.media_content_id,
            title: item.title,
            thumbnail: item.thumbnail,
          }));

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

  _parseChannel(browseItem) {
    // Parse the media_content_id to extract channel info
    // Format: "program:channel_id:start_ts:end_ts" or "live:channel_id"
    const id = browseItem.media_content_id;
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
      mediaContentId: id,
      currentProgram: {
        title: programTitle,
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
    return {
      mediaContentId: item.media_content_id,
      title: item.title,
      thumbnail: item.thumbnail,
      channelName: channel.name,
    };
  }

  async _playReplay(replay) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

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
          const episodes = browseResult.children
            .filter((item) =>
              item.media_content_id.startsWith("episode:") ||
              item.media_content_id.startsWith("replay:") ||
              item.can_play
            )
            .map((item) => ({
              mediaContentId: item.media_content_id,
              title: item.title,
              thumbnail: item.thumbnail,
            }));

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
    return {
      mediaContentId: item.media_content_id,
      title: item.title,
      thumbnail: item.thumbnail,
      mediaClass: item.media_class,
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
        // Filter for playable episodes (episode: prefix) or cast targets (play_local available)
        const episodes = browseResult.children
          .filter((item) =>
            item.media_content_id.startsWith("episode:") ||
            item.media_content_id.startsWith("replay:") ||
            item.can_play
          )
          .map((item) => ({
            mediaContentId: item.media_content_id,
            title: item.title,
            thumbnail: item.thumbnail,
          }));

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

  async _playEpisode(episode, parentTitle) {
    const entityId = this._findMolotovEntity();
    if (!entityId) return;

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

    // Check if we're playing with a stream URL (local playback)
    if (state.state === "playing" && state.attributes.stream_url) {
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
        this._playerError = null;

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
    } else if (this._playing && state.state !== "playing") {
      // Stopped playing
      this._cleanupPlayer();
      this._playing = false;
      this._streamData = null;
      this._currentStreamUrl = null;
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
            stableBufferTime: 20,
            bufferTimeAtTopQuality: 30,
            bufferTimeAtTopQualityLongForm: 60,
          },
          delay: {
            liveDelay: 4,
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
  }

  _stopPlayback() {
    const entityId = this._findMolotovEntity();

    if (entityId && this.hass) {
      this.hass.callService("media_player", "media_stop", {
        entity_id: entityId,
      });
    }

    this._cleanupPlayer();
    this._playing = false;
    this._streamData = null;
    this._selectedChannel = null;
    this._currentStreamUrl = null;
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
      // For live TV, show progress within current program
      const now = Date.now();
      const programDuration = this._programEnd - this._programStart;
      if (programDuration <= 0) return 100;

      const elapsed = now - this._programStart;
      return Math.min(100, Math.max(0, (elapsed / programDuration) * 100));
    } else if (this._duration > 0) {
      // For VOD, show playback progress
      return (this._currentTime / this._duration) * 100;
    }
    return 0;
  }

  render() {
    if (this._playing && this._streamData) {
      return this._renderPlayer();
    }
    return this._renderChannelList();
  }

  _renderChannelList() {
    return html`
      <div class="container">
        <div class="header">
          <h1>Molotov TV</h1>
          <div class="header-actions">
            <select class="cast-select" @change=${this._handleTargetChange} .value=${this._selectedTarget}>
              <option value="local">Cet appareil</option>
              ${this._castTargets.map(
                (target) => html`
                  <option value=${target.mediaContentId}>${target.title}</option>
                `
              )}
            </select>
            <button @click=${this._handleRefresh}>
              <ha-icon icon="mdi:refresh"></ha-icon>
              Actualiser
            </button>
          </div>
        </div>

        <div class="tabs">
          <button class="tab ${this._activeTab === "live" ? "active" : ""}" @click=${() => this._switchTab("live")}>
            <ha-icon icon="mdi:television-play"></ha-icon>
            Direct
          </button>
          <button class="tab ${this._activeTab === "recordings" ? "active" : ""}" @click=${() => this._switchTab("recordings")}>
            <ha-icon icon="mdi:bookmark"></ha-icon>
            Enregistrements
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
          : this._renderRecordings()}
      </div>
    `;
  }

  _handleRefresh() {
    if (this._activeTab === "live") {
      this._loadChannels();
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

  _renderRecordingItem(recording) {
    const recordingId = recording.mediaContentId;
    const isExpanded = this._expandedRecordings[recordingId];
    const episodes = this._recordingEpisodes[recordingId] || [];
    const isLoadingEpisodes = this._loadingRecordingEpisodes[recordingId];

    return html`
      <div class="search-result-row">
        <div class="search-result-main" @click=${(e) => this._toggleRecordingExpand(e, recording)}>
          <ha-icon
            class="expand-icon ${isExpanded ? "expanded" : ""}"
            icon="mdi:chevron-right"
          ></ha-icon>
          ${recording.thumbnail
            ? html`<img
                class="recording-thumb"
                src=${recording.thumbnail}
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
                            ? html`<img class="episode-thumb" src=${episode.thumbnail} @error=${(e) => (e.target.style.display = "none")} />`
                            : ""}
                          <div class="episode-info">
                            <div class="episode-title">${episode.title}</div>
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
            ? html`<img class="search-result-thumb" src=${result.thumbnail} @error=${(e) => (e.target.style.display = "none")} />`
            : ""}
          <div class="search-result-info">
            <div class="search-result-title">${result.title}</div>
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
                            ? html`<img class="episode-thumb" src=${episode.thumbnail} @error=${(e) => (e.target.style.display = "none")} />`
                            : ""}
                          <div class="episode-info">
                            <div class="episode-title">${episode.title}</div>
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
                            ? html`<img class="replay-thumb" src=${replay.thumbnail} @error=${(e) => (e.target.style.display = "none")} />`
                            : ""}
                          <span class="replay-item-title">${replay.title}</span>
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
            <button class="secondary" @click=${this._stopPlayback}>
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
                  ? html`<span>${this._formatClockTime(this._programStart)}</span>`
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
                  <button class="icon-btn" @click=${this._togglePlayPause}>
                    <ha-icon icon=${this._paused ? "mdi:play" : "mdi:pause"}></ha-icon>
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
}

customElements.define("molotov-panel", MolotovPanel);
console.log(`[Molotov Panel] Registered - v${VERSION}`);
