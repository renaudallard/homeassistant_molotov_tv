/**
 * Molotov TV Player Card & Automatic Overlay Manager
 * v0.1.30 - Cleaned up debugging
 */

(function() {
  const VERSION = "0.1.31";

  console.log(`[Molotov] Script execution started - v${VERSION}`);

  // --- HASS Discovery ---
  function getHass() {
    const main = document.querySelector('home-assistant');
    return (main && main.hass) ? main.hass : null;
  }

  // --- Player Card Class Definition ---
  class MolotovPlayerCard extends HTMLElement {
    set hass(hass) {
      this._hass = hass;
      this._render();
    }

    setConfig(config) {
      if (!config.entity) throw new Error('Entity required');
      this._config = config;
    }

    getCardSize() { return 4; }

    _render() {
      if (!this.content) {
        this.innerHTML = `
          <style>
            molotov-player-card { display: block; width: 100%; }
            ha-card {
              overflow: hidden; background: black; aspect-ratio: 16/9;
              display: flex; align-items: center; justify-content: center;
              position: relative; flex-direction: column;
            }
            video { width: 100%; height: 100%; max-height: 100%; background: black; }
            .message { color: white; padding: 16px; text-align: center; }
            .play-overlay {
              position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
              background: rgba(0, 0, 0, 0.5); border-radius: 50%; width: 64px; height: 64px;
              display: flex; align-items: center; justify-content: center; cursor: pointer;
              z-index: 6; display: none;
            }
            .play-icon { width: 32px; height: 32px; fill: white; }
          </style>
          <ha-card>
            <div class="message">Waiting for playback...</div>
            <div class="play-overlay">
              <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </ha-card>
        `;
        this.content = this.querySelector('ha-card');
        this.playOverlay = this.querySelector('.play-overlay');

        if (this.playOverlay) {
          this.playOverlay.addEventListener('click', () => {
            const video = this.querySelector('video');
            if (video) {
              video.muted = false;
              video.play().catch(e => this._log("Manual play error: " + e.message));
            }
            this.playOverlay.style.display = 'none';
          });
        }
      }

      if (!this._hass || !this._hass.states) return;
      const entityId = this._config.entity;
      const state = this._hass.states[entityId];
      if (!state) return;

      if (state.state === 'playing' && state.attributes.stream_url) {
        const streamUrl = state.attributes.stream_url;
        const drmInfo = state.attributes.stream_drm;

        if (this._currentStream === streamUrl) return;
        this._currentStream = streamUrl;

        this.content.querySelector('.message').textContent = 'Loading player...';
        this._log("v" + VERSION + " - Found stream");
        
        const oldVideo = this.content.querySelector('video');
        if (oldVideo) oldVideo.remove();

        if (!window.dashjs) {
          this._log("Loading dash.js...");
          const script = document.createElement('script');
          script.src = 'https://cdn.dashjs.org/v4.7.4/dash.all.min.js';
          script.crossOrigin = "anonymous";
          script.onload = () => {
            this._log("dash.js loaded");
            this._initPlayer(streamUrl, drmInfo);
          };
          script.onerror = () => {
            this._log("FAILED to load dash.js!");
            this.content.querySelector('.message').textContent = 'Error: Could not load player';
          };
          document.head.appendChild(script);
        } else {
          this._initPlayer(streamUrl, drmInfo);
        }
      } else if (this.player) {
        this.player.reset();
        this.player = null;
        this._currentStream = null;
        this.content.innerHTML = '<div class="message">Playback stopped</div>';
        this.content = this.querySelector('ha-card');
      }
    }

    _log(msg) {
      console.log("[Molotov]", msg);
    }

    _initPlayer(url, drm) {
      this._log("Init player...");

      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      video.muted = false;
      video.volume = 0.3;
      video.setAttribute('playsinline', '');

      this.content.insertBefore(video, this.content.firstChild);

      video.addEventListener('error', () => {
        const err = video.error;
        this._log("Video error: " + (err ? err.code + " - " + err.message : "unknown"));
      });

      this._log("Creating dash.js player...");
      let player;
      try {
          if (typeof dashjs === 'undefined') {
              throw new Error("dashjs is undefined");
          }
          player = dashjs.MediaPlayer().create();
          this.player = player;
          this._log("dash.js player created");
      } catch (e) {
          this._log("CRITICAL: Failed to create player: " + e.message);
          console.error("[Molotov] Player creation failed", e);
          return;
      }

      // Configure settings (autoPlay is handled by initialize 3rd arg)
      player.updateSettings({
        'debug': { 'logLevel': dashjs.Debug.LOG_LEVEL_WARN }
      });

      // Configure DRM before initialize
      if (drm && drm.type === 'widevine') {
        this._log("Configuring Widevine DRM...");
        player.setProtectionData({
          'com.widevine.alpha': {
            serverURL: drm.license_url,
            httpRequestHeaders: drm.headers || {}
          }
        });
      }

      this._log("Initializing player source...");
      try {
          // initialize(view, source, autoPlay)
          player.initialize(video, url, true);
          this._log("Player initialized call sent");
      } catch (e) {
          this._log("CRITICAL: Initialize failed: " + e.message);
          console.error("[Molotov] Initialize failed", e);
          return;
      }

      // Settings that require initialized player
      try {
        player.setInitialMediaSettingsFor('audio', { lang: 'fr' });
      } catch(e) {
        this._log("WARN: Failed to set audio lang: " + e.message);
      }

      player.on(dashjs.MediaPlayer.events.ERROR, (e) => {
        this._log("Player error: " + (e.error?.message || e.error || "unknown"));
      });

      player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
        this._log("Stream ready");
        setTimeout(() => {
          if (video.paused) {
            this._log("Autoplay blocked - tap play");
            if (this.playOverlay) this.playOverlay.style.display = 'flex';
          }
        }, 1500);
      });

      player.on(dashjs.MediaPlayer.events.PLAYBACK_STARTED, () => {
        this._log("Playing");
        if (this.playOverlay) this.playOverlay.style.display = 'none';
      });

      // Timeout for DRM issues
      setTimeout(() => {
        if (video.paused && !video.currentTime && drm) {
          this._log("TIMEOUT: DRM may have failed");
          this._log("Use Cast device instead");
        }
      }, 15000);
    }
  }

  // --- Register Custom Element ---
  try {
    console.log("[Molotov] Registering custom element...");
    console.log("[Molotov] Class definition:", !!MolotovPlayerCard);
    
    const existing = customElements.get('molotov-player-card');
    console.log("[Molotov] Existing registration:", !!existing);

    if (!existing) {
      customElements.define('molotov-player-card', MolotovPlayerCard);
      console.log("[Molotov] Custom element registered successfully");
    } else {
      console.log("[Molotov] Custom element already registered");
    }
  } catch (err) {
    console.error("[Molotov] FAILED to register:", err);
  }

  // --- Overlay Manager ---
  const OVERLAY_ID = 'molotov-auto-overlay';
  let _activeEntity = null;

  function createOverlay(entityId) {
    if (document.getElementById(OVERLAY_ID)) return;
    console.log("[Molotov] Creating overlay for", entityId);

    const registered = customElements.get('molotov-player-card');
    console.log("[Molotov] Registry check in overlay:", !!registered);

    if (!registered) {
      console.error("[Molotov] Card element not registered!");
      // Attempt late registration
      try {
          console.log("[Molotov] Attempting late registration...");
          customElements.define('molotov-player-card', MolotovPlayerCard);
          console.log("[Molotov] Late registration successful");
      } catch(e) {
          console.error("[Molotov] Late registration failed:", e);
          return;
      }
    }

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.95); z-index:99999; display:flex; align-items:center; justify-content:center;";

    const container = document.createElement('div');
    container.style.cssText = "width:95%; max-width:1280px; position:relative;";

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.style.cssText = "position:absolute; top:-45px; right:0; background:#f44336; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-size:16px;";
    closeBtn.onclick = () => {
      const hass = getHass();
      if (hass && _activeEntity) {
        hass.callService('media_player', 'media_stop', { entity_id: _activeEntity });
      }
      removeOverlay();
    };

    const card = document.createElement('molotov-player-card');
    card.setConfig({ entity: entityId });
    card.hass = getHass();

    const interval = setInterval(() => {
      const freshHass = getHass();
      if (freshHass) card.hass = freshHass;
    }, 500);
    overlay._hassInterval = interval;

    container.appendChild(closeBtn);
    container.appendChild(card);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    _activeEntity = entityId;
  }

  function removeOverlay() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      if (overlay._hassInterval) clearInterval(overlay._hassInterval);
      overlay.remove();
      _activeEntity = null;
    }
  }

  // --- State Checker ---
  let _lastTarget = null;

  function checkState() {
    const hass = getHass();
    if (!hass || !hass.states || !hass.user) return;

    let target = null;
    for (const eid in hass.states) {
      if (eid.startsWith('media_player.molotov')) {
        const s = hass.states[eid];
        if (s.state === 'playing' && s.attributes.stream_url) {
          // Verify that this playback was initiated by the current user
          if (s.context && s.context.user_id === hass.user.id) {
            target = eid;
            break;
          }
        }
      }
    }

    if (target && target !== _lastTarget) {
      console.log("[Molotov] Found active target:", target);
      _lastTarget = target;
    }
    if (!target && _lastTarget) {
      console.log("[Molotov] Target stopped");
      _lastTarget = null;
    }

    if (target && !_activeEntity) {
      createOverlay(target);
    } else if (!target && _activeEntity) {
      removeOverlay();
    }
  }

  // Start checking state
  setInterval(checkState, 1000);
  console.log("[Molotov] State checking started");

})();
