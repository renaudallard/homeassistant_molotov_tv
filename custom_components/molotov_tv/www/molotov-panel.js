/**
 * Molotov TV Sidebar Panel
 * LitElement panel with channel list, EPG info, and embedded dash.js player
 */

import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.5.1/lit-element.js?module";

const VERSION = "0.1.1";

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
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        background: var(--primary-background-color);
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

      .channel-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .channel-item:hover {
        background: var(--secondary-background-color);
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
      }

      .player-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
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
      }

      .video-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: 0;
      }

      video {
        width: 100%;
        height: 100%;
        max-height: 100%;
        background: #000;
      }

      .player-info {
        padding: 16px;
        background: var(--card-background-color);
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

    // Set program times for progress bar
    if (channel.currentProgram?.start && channel.currentProgram?.end) {
      this._programStart = channel.currentProgram.start;
      this._programEnd = channel.currentProgram.end;
      this._isLive = true;
    }

    try {
      // Use play_local prefix to trigger local playback
      await this.hass.callService("media_player", "play_media", {
        entity_id: entityId,
        media_content_id: `play_local:${channel.mediaContentId}`,
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
            <button @click=${this._loadChannels}>
              <ha-icon icon="mdi:refresh"></ha-icon>
              Actualiser
            </button>
          </div>
        </div>

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
      </div>
    `;
  }

  _renderChannelItem(channel) {
    const current = channel.currentProgram;
    const startTime = current?.start ? this._formatClockTime(current.start) : "";
    const endTime = current?.end ? this._formatClockTime(current.end) : "";
    const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : "";

    return html`
      <div class="channel-item" @click=${() => this._playChannel(channel)}>
        <img
          class="channel-logo"
          src=${channel.thumbnail || ""}
          alt=${channel.name}
          @error=${(e) => (e.target.style.display = "none")}
        />
        <div class="channel-info">
          <div class="channel-name">${channel.name}</div>
          <div class="program-info">
            <div class="program-now">
              ${current?.title || "Direct"}
              ${timeRange ? html`<span class="program-time">(${timeRange})</span>` : ""}
            </div>
            ${channel.nextProgram
              ? html`
                  <div class="program-next">
                    Ensuite: ${channel.nextProgram.title}
                  </div>
                `
              : ""}
          </div>
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
