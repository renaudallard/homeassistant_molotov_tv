# Molotov TV Android APK (4.27.0) — implementation notes

This document is a static analysis of the Molotov TV Android APK contained in this repo. It includes implementation details and extracted secrets/URLs needed to make it work.

## Scope and sources

- APK package: `tv.molotov.app`
- Version: 4.27.0 (versionCode 8881)
- Decompiled with apktool into `xapk/decoded`

Primary sources referenced:
- `xapk/decoded/AndroidManifest.xml`
- `xapk/decoded/apktool.yml`
- `xapk/decoded/res/xml/network_security_config.xml`
- `xapk/decoded/assets/assets/assets.json`
- `xapk/decoded/assets/home/home_light_ultra.json`
- `xapk/decoded/smali_classes3/hu1.smali`
- `xapk/decoded/smali_classes3/aR1.smali`
- `xapk/decoded/smali_classes5/tv/molotov/android/environment/domain/model/Environment.smali`
- `xapk/decoded/smali_classes5/b90.smali`
- `xapk/decoded/smali_classes5/tv/molotov/android/ws/asset/a$a.smali`
- `xapk/decoded/smali_classes5/tv/molotov/android/feature/cast/CastOptionsProvider.smali`
- `xapk/decoded/smali_classes5/tv/molotov/android/feature/cast/CastHelper.smali`
- `xapk/decoded/smali_classes5/tv/molotov/android/feature/cast/CastMessageReceiverCallback.smali`
- `xapk/decoded/smali_classes5/tv/molotov/android/feature/cast/model/Cast*.smali`
- `xapk/decoded/smali_classes5/tv/molotov/android/livechannel/LiveChannelApi.smali`
- `xapk/decoded/smali_classes5/tv/molotov/db/MolotovDb.smali`

## High-level architecture

- UI entry points: `SplashActivity`, `MainActivity`, `PlayerMobileActivity`, `PlayerTvActivity`, `CastActivity`
- Player stack: ExoPlayer (local playback) with DRM support (Widevine)
- Networking: Retrofit + OkHttp with custom interceptors/headers
- Persistence: Room (`MolotovDb`)
- Chromecast: Google Cast SDK + custom cast messaging

## UI flow notes (activity-level)

These flows are inferred from `xapk/decoded/AndroidManifest.xml` activity declarations and naming; exact routing is implemented in navigation code and server-driven actions.

- App launch: `SplashActivity` -> `MainActivity` (singleTask). `KillActivity` exists for forced restart.
- Auth and onboarding (mobile): `ui.common.onboarding.login.LandingActivity` -> `LoginActivity` or `SignUpWizardActivity` -> `PasswordCreationActivity` -> `GenderBirthdateActivity`. `MolotovLinkProviderActivity` supports device linking.
- Auth and onboarding (TV): `ui.tv.login.LoginSignUpActivity`, `ForgottenPasswordActivity`, and `ui.tv.login.MolotovLinkActivity` for link code flows.
- Core browsing: `MainActivity` hosts fragments and state holders (`FragmentHolderActivity`, `StateFragmentHolderActivity`); `DetailTemplateActivity` displays program and channel details (mobile and TV variants).
- Playback: `PlayerMobileActivity` (landscape, PiP), `PlayerTvActivity` (PiP), and `NotHardwareAcceleratedPlayerActivity` fallback.
- Cast: `CastActivity` and `CastFragmentHolderActivity`.
- Search and people (TV): `SearchActivityTv`, `PersonActivityTv`.
- Settings: `AdvancedSettingsActivity`, `VideoSettingsActivity`, `BandwidthActivity`, `ui.tv.settings.SettingsActivity`, `ui.ParentalControlActivity`, and `parentalcontrol.ParentalControlActivity`.
- Devices and Live Channels: `ui.mobile.device.DevicesActivity`, `devices.DevicesActivity`, `component.liveChannel.presentation.LiveChannelSetupActivity`.
- Web and payment flows: `ui.mobile.webview.WebViewActivity`, `ui.tv.webview.WebViewActivity`, `webview.presentation.WebViewActivity`, `PaymentSelectorPageLauncherActivity`, `LandingPaymentActivity`, `PaymentWebViewActivity`, `IapRecapPageLauncherActivity`.
- Specialized and error flows: `TinderProgramActivity`, `TinderPersonActivity`, `CustomizeActivity`, `BlockedActivity`, `CrashActivity`, `QAActivity`, `DevSettingsActivity`, `EnvironmentSettingsActivity`.

## Permissions and manifest highlights

Key permissions (from `xapk/decoded/AndroidManifest.xml`):
- `android.permission.INTERNET`
- `android.permission.ACCESS_NETWORK_STATE`
- `android.permission.BILLING`
- `com.google.android.gms.permission.AD_ID`
- `android.permission.RECEIVE_BOOT_COMPLETED`
- `com.android.providers.tv.permission.READ_EPG_DATA`
- `com.android.providers.tv.permission.WRITE_EPG_DATA`

Key components:
- Activities: `SplashActivity`, `MainActivity`, `PlayerMobileActivity`, `PlayerTvActivity`, `CastActivity`
- Provider: `tv.molotov.android.feature.cast.CastOptionsProvider`
- TV integration: Live Channels TV input service (see Live Channels section)

## Environment and configuration

### Environment model
The app defines multiple environments (dev/staging/prod). Fields include:
- Base API URL
- Tracking URL
- WebView base URL
- App IDs for mobile/TV
- Cast App ID
- Analytics and ad service keys
- Live Channel API URL

See:
- `xapk/decoded/smali_classes5/tv/molotov/android/environment/domain/model/Environment.smali`
- `xapk/decoded/smali_classes5/b90.smali`

### Network security
The network security config allows user CA certificates in debug builds:
- `xapk/decoded/res/xml/network_security_config.xml`

## Networking behavior

### Default headers
Interceptor builds a common header set (from `xapk/decoded/smali_classes3/hu1.smali`):
- `User-Agent: Android`
- `Content-Type: application/json`
- `Accept: application/json`
- `Accept-Language: <device locale>`
- `logged_in: true|false`
- `orientation: portrait|landscape`
- `X-Molotov-Agent: <app/build info>`
- `x-tcf-string: <IAB TCF consent string>` (when Didomi is ready)
- `Authorization: Bearer <token>` (when authenticated)

### Token refresh
An OkHttp `Authenticator` refreshes tokens on 401 responses:
- `xapk/decoded/smali_classes3/aR1.smali`
- Refresh endpoint: `GET v3/auth/refresh/{refreshToken}`

## Authentication and session

Endpoints (all relative to base API URL, typically `https://fapi.molotov.tv/`):
- `POST v3.1/auth/login`
- `POST v3/auth/login/continue`
- `POST v2/account` (account creation)
- `POST v2/auth/reset-password`
- `GET v3/auth/refresh/{refreshToken}`
- `POST v3/auth/logout`

Notes:
- Bearer token is attached to authenticated requests.
- Cast has a separate remote access token path (see Chromecast section).

## API surface (observed)

The app uses Retrofit interfaces, some with fixed paths and others with `@Url` for dynamic endpoints. The following are explicitly present:

### App start and config
- `GET v2/config`
- `GET v2.1/me/app-start`
- `GET v2/me/app-state`

### Home and discovery
- `GET v3/me/home/sections`

### Actions and user state
- `GET v2/me/actions`
- `POST v2/me/actions/like`
- `DELETE v2/me/actions/like`
- `POST v2/me/actions/follow`
- `DELETE v2/me/actions/follow`
- `POST v3.2/me/actions/schedule-record`
- `DELETE v3.2/me/actions/schedule-record`
- `POST v3.2/me/actions/smart-record`
- `DELETE v3.2/me/actions/smart-record`
- `DELETE v3.2/me/actions/record`
- `DELETE v2/me/continue-watching`

### Devices
- `GET v2/me/devices`
- `DELETE v2/me/devices`

### Notifications and push
- `GET v2/me/notifications/unread`
- `GET v2/me/opt-ins`
- `POST v2/me/opt-ins`
- `POST v2/me/push_token`

### Offers and store
- `GET v2/me/options`
- `GET v2/offers/{equivalenceCode}/sections`
- `GET v3/me/store/{equivalenceCode}`

### In-app purchase verification
- `POST v1/me/google/verify`

### Live Channels (EPG download link)
- `GET v1/{userId}/firestick/download-link-epg-files`

### Dynamic endpoints (`@Url`)
Several content APIs are dynamically provided via the config response or embedded in response payloads. Based on `assets/assets.json` and `ConfigNetworkModel`, these include:
- Catalog browse
- Grid/EPG lookup
- Asset retrieval
- Search
- Watch/stream endpoints

Exact URLs are obtained at runtime from the config response and should not be hardcoded.

## Model schemas (selected)

### Config (v2/config)

ConfigNetworkModel JSON fields (names from serializer; types inferred from `ConfigNetworkModel.kt`):
- `algolia`: `AlgoliaNetworkModel`
- `base_paths`: `BasePathsNetworkModel`
- `bookmark`: `LinkNetworkModel`
- `cast_app_id`: string
- `easter_egg`: string
- `interstitial`: `LinkNetworkModel`
- `notification_center`: `LinkNetworkModel`
- `onboarding`: `OnboardingNetworkModel`
- `parental_control`: `LinkNetworkModel`
- `parental_control_v3`: `LinkNetworkModel`
- `proxy_drm`: `LinkNetworkModel`
- `public_landing`: `LinkNetworkModel`
- `push`: `LinkNetworkModel`
- `qa`: `LinkNetworkModel`
- `remote`: `LinkNetworkModel`
- `remote_subbed`: `LinkNetworkModel`
- `search`: `LinkNetworkModel`
- `search_legacy`: `LinkNetworkModel`
- `search_person`: `LinkNetworkModel`
- `search_public`: `LinkNetworkModel`
- `search_top`: `LinkNetworkModel`
- `search_universal`: `LinkNetworkModel`
- `store`: `LinkNetworkModel`
- `v3_home`: `LinkNetworkModel`
- `v3_search_home`: `LinkNetworkModel`
- `last_app_build`: integer

Supporting config models:
- `LinkNetworkModel`: `{ url }`
- `BasePathsNetworkModel`: `{ static, profile_pics }` (base URL prefixes)
- `AlgoliaNetworkModel`: `{ indice_persons, indice_persons_tiles, indice_programs, indice_programs_and_bookmarks, indice_programs_tiles }`
- `OnboardingNetworkModel`: `{ display, image_url }`

### Home and content models

Home response shape (from `home_light_ultra.json` plus `Section` class):
```
HomeResponse {
  metadata: object,
  page: object,
  sections: [Section]
}
```

`Section` (`tv/molotov/model/container/Section`):
- `slug`, `title`, `title_formatter`, `subtitle_formatter`, `description_formatter`, `mentions_formatter`
- `context`: `SectionContext`
- `group_id`, `display_type`, `styles`
- `items`: list of tiles (type varies)
- `actions`: map of `Action`
- `user_data`, `pager`, `tooltipEntity`, `tile` (optional)

`SectionContext` (`tv/molotov/model/container/SectionContext`):
- `display_type`, `layout`, `parentPage`
- Flags: `is_bookmark`, `is_channel`, `is_live`, `is_vod`, `is_continue_watching`, `is_recommend`, `is_catchup`
- Formats: `title_format`, `subtitle_format`, `accessibility_format`
- `empty_text`
- Common display types include: `banner_*`, `poster`, `landscape`, `live_channel`, `card`, `grid`, `list`

`Tile` and `VideoContent` (home cards):
- Core identity: `type`, `id`, `slug`
- Labels: `title`, `subtitle`, `description`, plus `*_formatter` fields
- Images: `image_bundle` (`ImageBundle`)
- Metadata: `metadata` object (program, channel, campaign fields)
- Video linkage: `video` (`VideoData`)
- Actions: `actions` map and `on_click`, `on_play`, `on_cast`, `on_display` arrays referencing action keys
- Flags: `is_new`, `is_unique`, `is_erotic`, `max_rating_id`, `styles`

`Entity` base types (`tv/molotov/model/business/Entity`):
`channel`, `program`, `episode`, `season`, `vod`, `person`, `offer`, `tag`, `category`, `trailer`, `search_suggestion`, `external_link`, `deeplink`, `banner_paywall`, `advertising`, `see_more`, and others.

`VideoData` (`tv/molotov/model/business/VideoData`):
- IDs: `channel_id`, `program_id`, `episode_id`, `season_id`, `rating_id`
- Timing: `start_at`, `end_at`, `duration`, `available_from`, `available_until`
- Playback: `watch_progress` (seconds), `preview_url`
- Rights: `asset_rights`

### Catalog and detail responses

`CatalogResponse` (`tv/molotov/model/reponse/CatalogResponse`):
```
CatalogResponse {
  catalog: [TileSection],
  footer?: WsFooter,
  pageTitle?: string,
  page: TrackPage,
  ctaAction?: Action,
  advertising?: Advertising
}
```

`DetailResponse` (`tv/molotov/model/reponse/DetailResponse`):
```
DetailResponse {
  detailHeader?: DetailHeader<Content>,
  catalog: [TileSection],
  metadata: map<string, string>,
  sharedData?: SharedData,
  footer?: WsFooter,
  banner?: Tile,
  advertising?: Advertising,
  offerActions?: map<string, Action>
}
```

`SingleSectionResponse` (`tv/molotov/model/reponse/SingleSectionResponse`):
```
SingleSectionResponse {
  section?: TileSection,
  pageTitle?: string,
  page: TrackPage
}
```

Search responses are driven by dynamic endpoints from `ConfigNetworkModel` and Algolia index names; the app normalizes results into `TileSection`/`Tile` collections and uses `TrackPage` metadata for analytics.

### Action model

`Action` (`tv/molotov/model/action/Action`) fields:
- `id`, `type`, `subtype`, `page`, `label`, `subLabel`, `url`, `method`
- `template`, `section`, `icon`
- `metadata`: map of string to string
- `payload`: object
- `onAccepted`, `onDeclined`: nested `Action`

Common action types and keys (subset):
- `play`, `play_start_over`, `play_continue_watching`
- `cast`, `cast_start_over`, `cast_continue_watching`
- `follow`, `unfollow`
- `record`, `add_smart_record`, `remove_record`
- `show_dialog`, `show_dialog_v2`, `show_interstitial`, `show_cmp`
- `logout`, `go_to_store`, `submit`, `retry`

### Playback and asset models

`AssetResponse` (`tv/molotov/model/response/AssetResponse`) contains:
- `type`, `id`
- `stream`: `StreamData`
- `drm`: `DrmHolder`
- `metadata` (program and origin fields)
- `overlay`: `PlayerOverlay`
- `tracking`: `TrackingConfig`
- `video_session_tracker`: `VideoTrackerConfig`
- `config`: `AssetConfig`
- `screen_limiter`: `{ interval, max_interval, ttl, url }` (from `assets.json`)
- `player_actions`: `PlayerActions`
- `player_settings`: `PlayerSettings`
- `paywall`: `AssetPaywallResponse`
- `ads`: `EgenyResponse` and `advertising`: `AdConfig` (ad payloads)
- `tooltips`, `friction`, `offline_id`, `splash`

`StreamData`:
- `cdn_decision_url`, `suffix_url`, `url`, `url_params`
- `video_format` (`dash`, `hls`, `mp4`)
- `video_type` (`live`, `vod`, `live_capture`)
- `loop_video`, `offset`

`DrmHolder`:
- `license_url`, `token`
- `asset_id`, `session_id`, `user_id`
- `provider`, `merchant`, `scheme`
- `expires_at`, `play_expires_at`, `playback_duration`, `storage_duration`

`AssetConfig`:
- `max_bitrate`, `max_play_duration`, `start_over_offset`
- `selected_track` (`TrackFilter`)
- `position` and `forcedStartPosition` (start time)
- `p2p` flag

`PlayerSettings`:
- `codecDenylist`: list of codec strings to disable

`PlayerOverlay` (from `assets.json` and `PlayerOverlay` class):
- `type`, `id`, `title`, `description`
- `title_formatter`, `subtitle_formatter`, `description_formatter`
- `actions` map (e.g., `detail`, `cast_start_over`, `show_remote`)
- `interaction`, `metadata`, `image_bundle`, `video`
- `track_filters`: list of `TrackFilter`
- `thumbnails` / `thumbnails_live`
- `hide_player_controls`
- `channel` (nested tile-like object)

`TrackFilter`:
- `track_audio`, `track_text`, `label`, `short_label`

`Thumbnails`:
- `interval`, `start_index`, `sprite_sheets[]`

`Thumbnails.SpriteSheet`:
- `url`, `width`, `height`, `row_count`, `column_count`

`TrackingConfig`:
- `youbora`: map of tracking params
- `nielsen`: init map
- `nielsen_metadata`: map
- `pixels`: array of callback URLs
- `estat`: nested `Estat`

`TrackingConfig.Estat`:
- `level1..level5`, `newLevel1..newLevel11`
- `streamName`, `serial`, `netMeasurement`
- `streamGenre`, `streamDuration`, `domain` (media provider)
- `mediaInfo`: `{ mediaChannel, mediaContentId, mediaDiffMode }`

`VideoTrackerConfig` (video session tracker):
- `url`, `interval`, `contentId`

`PlayerActions`:
- `watch_next_episode`: `WatchNextEpisode`

`WatchNextEpisode`:
- `from`, `until`, `duration`, `title`
- `action`: `Action`
- `metadata`: map
- `image_bundle`: `ImageBundle`

`AssetPaywallResponse`:
- `title_formatter`, `outer_message_formatter`
- `background_color`, `image_bundle`, `counter`, `metadata`
- `buttons`: list of `Tile`

### Image models

`ImageBundle`: map of `String` -> `Image` (device-specific variants)

`Image`:
- `type`, `source`, `small`, `medium`, `large` (each an `ImageAsset`)
- Common keys include: `poster`, `poster_tv`, `poster_with_channel`, `backdrop`, `landscape`, `banner_*`, `logo`, `avatar`

`ImageAsset`:
- `{ url, width, height }`

## Content and program retrieval

### Home sections
Home rails are fetched from:
- `GET v3/me/home/sections`

The response is similar to `xapk/decoded/assets/home/home_light_ultra.json`, containing:
- Sections (rails) with cards
- Card metadata for channels, programs, or collections
- Actions to open details or playback

### Program and asset details
Program details typically reference an asset endpoint (dynamic `@Url`) which returns an `AssetResponse` payload (see `xapk/decoded/assets/assets/assets.json`).

Key objects:
- `AssetResponse`
- `StreamData`
- `DrmHolder`
- `Tracking` / `VideoSessionTracker` (analytics)

## Playback pipeline (local)

### AssetResponse (core playback payload)
From `tv/molotov/model/response/AssetResponse`:
- `stream`: `StreamData`
- `drm`: `DrmHolder`
- `tracking`: tracking payload
- `video_session_tracker`: session analytics
- `overlay`: UI overlay data

### StreamData
Observed fields:
- `cdn_decision_url` (optional)
- `suffix_url` (optional)
- `url` (final or base stream URL)
- `video_format` (e.g., `dash`, `hls`, `mp4`)
- `video_type` (e.g., `live`, `vod`, `live_capture`)
- `url_params`

### CDN decision
If `cdn_decision_url` is present, the app performs a CDN selection call:
- Fetch providers list from `cdn_decision_url`
- Select the first provider host
- Build final URL as: `<provider.host>` + `<suffix_url>`

See:
- `xapk/decoded/smali_classes5/tv/molotov/android/ws/asset/a$a.smali`

### DRM
`DrmHolder` fields include:
- `license_url`
- `token`
- `asset_id`
- `session_id`
- `user_id`
- `scheme` (Widevine)
- `play_expires_at`, `playback_duration`, etc.

Local playback uses ExoPlayer with Widevine DRM:
- Build a DRM session using `license_url` and `token`
- Initialize the player with the final stream URL
- Apply tracking hooks to emit analytics

## Chromecast integration

### Cast options
Cast options use the environment-specific Cast App ID:
- `xapk/decoded/smali_classes5/tv/molotov/android/feature/cast/CastOptionsProvider.smali`

### MediaInfo and stream type
Cast helper builds a `MediaInfo` object:
- `contentType: application/dash+xml`
- `streamType: LIVE` or `BUFFERED` depending on `video_type`
- `customData` includes Molotov-specific fields

### Custom data schema
`CastHelper.buildCastCustomData` builds a JSON payload with:
- `version: 7`
- `asset_data` (asset info, stream references)
- `play_ads`
- `tracking_context`
- `cast_agent`
- `molotov_agent`
- `refresh_token`
- `cast_connect.remote_access_token`
- `position` (optional)

Sensitive tokens are redacted and must be provided by the authenticated session.

### Cast messaging protocol
Outgoing messages:
- `CastSeekMessage`: `{ "action": "seek", "time": <seconds> }`
- `CastSetTrackMessage`: `{ "action": "switch_tracks", "audio": "...", "text": "...", "label": "...", "short_label": "..." }`
- `CastConfirmMessage`: `{ "action": "confirm" }`
- `CastDismissMessage`: `{ "action": "dismiss" }`
- `CastPinCodeMessage`: `{ "action": "pin_code", "pin_code": "..." }`
- `CastContentTypeRequest`: `{ "action": "content_type" }`

Incoming status handling (receiver → sender):
- `init`
- `playing`
- `seek`
- `enable_seek`
- `track_filters`
- `content_switch`
- `asset`
- `ads_asset`
- `watch_next_countdown`
- `watch_next_startposition`
- `finished`
- `error`

### Receiver namespace
The cast receiver uses a DASH.js namespace:
- `urn:x-cast:org.dashif.dashjs`

## Android TV / Live Channels

The app integrates with Android TV Live Channels:
- Uses EPG permissions
- LiveChannel API endpoint:
  - `GET v1/{userId}/firestick/download-link-epg-files`
- Uses `liveChannelApiUrl` from environment configuration

## Storage

Room database:
- `xapk/decoded/smali_classes5/tv/molotov/db/MolotovDb.smali`

Known tables:
- Recommendations (exact schema in related smali models)

## Analytics and consent

Consent:
- `x-tcf-string` header is injected when Didomi consent string is available

Tracking endpoints:
- Default tracking base from environment (e.g., `https://tracking.molotov.tv/v1/track`)

## Reimplementation blueprint (client-side)

### 1) Startup sequence
1. Load environment config (prod by default).
2. `GET v2/config` to obtain dynamic endpoints.
3. `GET v2.1/me/app-start` and/or `GET v2/me/app-state`.
4. Build session state; set default headers.

### 2) Authentication
1. `POST v3.1/auth/login` with credentials.
2. If required, `POST v3/auth/login/continue`.
3. Store `access_token` and `refresh_token`.
4. Attach `Authorization: Bearer <access_token>` to future calls.
5. On 401, refresh via `GET v3/auth/refresh/{refreshToken}`.

### 3) Home and discovery
1. `GET v3/me/home/sections`.
2. Render sections/cards.
3. For a program/channel card, follow its provided asset/detail URL (dynamic `@Url`).

### 4) Asset retrieval
1. Request asset details via dynamic `@Url`.
2. Parse `AssetResponse`.
3. If `cdn_decision_url` exists, fetch and choose provider host.
4. Build final `stream.url` and initialize playback.

### 5) Local playback
1. Build ExoPlayer media source with `stream.url`.
2. If DRM fields are present, configure Widevine with `license_url` + `token`.
3. Start playback; emit analytics/heartbeats from `tracking` and `video_session_tracker`.

### 6) Chromecast playback
1. Initialize Cast with environment `castAppId`.
2. Build `MediaInfo` with DASH contentType and streamType.
3. Populate `customData` with asset + tracking + tokens.
4. Send to receiver via Cast SDK.
5. Handle receiver status and send control messages (seek, tracks, etc.).

### 7) Live Channels sync
1. Get EPG download link from `GET v1/{userId}/firestick/download-link-epg-files`.
2. Download and parse EPG data.
3. Populate Live Channels provider.

## Gaps and runtime validation

Static analysis cannot confirm:
- Exact shapes of all dynamic `@Url` endpoints (catalog, search, grid).
- Full analytics payloads and timing.
- Device-specific feature flags from `v2/config`.

To finalize a faithful reimplementation, capture runtime network traffic with valid credentials and map dynamic endpoints to concrete schemas.

## Additional response schemas (assets)

This appendix summarizes additional JSON responses present in `xapk/decoded/assets` that are used to drive UI and navigation. URLs and identifiers in these examples are redacted.

### My Channel

`xapk/decoded/assets/mychannel/my_channel.json` and `my_channel2.json` are examples of user channel responses.

High-level shape:
```
MyChannelResponse {
  metadata?: object,
  page?: object,
  data?: object,
  sections: [Section]
}
```

Observed `item` keys in `sections.items`:
- `type`, `id`, `title`, `subtitle`, `description`, `slug`
- `title_formatter`, `subtitle_formatter`, `description_formatter`
- `image_bundle`, `editorial`, `interaction`, `metadata`
- `video`, `is_unique`, `is_new`, `is_erotic`, `max_rating_id`
- `actions` map and action key arrays: `on_click`, `on_play`, `on_cast`, `on_download` (or `on_add`, `on_remove`)
- `user_state` (e.g., `{ in_user_channel: true }` in `my_channel2.json`)

Observed `actions` keys:
- `detail`, `play`, `play_start_over`, `cast`, `cast_start_over`, `download`
- `add_to_user_channel`, `remove_from_user_channel` (in `my_channel2.json`)

Observed `video` keys:
- `type`, `id`, `start_at`, `end_at`, `duration`
- `available_from`, `available_until`, `channel_id`, `rating_id`
- `episode_id`, `program_id`, `asset_rights`, `vod_format`

### Empty state (My Channel)

`xapk/decoded/assets/mychannel/empty-view-my-channel.json`:
```
EmptyViewResponse {
  metadata?: object,
  page?: object,
  empty_view: {
    title_formatter,
    message_formatter,
    metadata,
    buttons: [Button]
  }
}
```

`empty_view.buttons` items are `Tile`-like with:
- `id`, `styles`, `style`
- `title_formatter`
- `on_click` array and `actions` map
- `metadata`

### Options page (post-registration offers)

`xapk/decoded/assets/options/options-page.json`:
```
OptionsPage {
  skip_button: Button,
  bundle_cards: [OfferCard]
}
```

`skip_button`:
- `title`, `on_click`, `actions`, `metadata`

`bundle_cards` items:
- `offer_logo` (image asset: `{ width, height, url }`)
- `buy_button` (`on_click`, `actions` map for `api_action`)
- `buy_subtitle`, `title`, `subtitle`

### Interstitials

`xapk/decoded/assets/interstitial/interstitial.json`:
```
InterstitialResponse {
  execute_actions: [{
    type: "show_interstitial_ad",
    payload: {
      tag,
      format: "interstitial",
      key_values: object
    }
  }]
}
```

### Dialog templates

Examples under `xapk/decoded/assets/dialog/*` use a common dialog schema with variant-specific fields:
```
DialogResponse {
  id,
  template,                 // text_only, image_top, image_left, image_middle, image_full, etc.
  blocking,
  is_restorable,
  fullscreen,
  title_formatter?,
  subtitle_formatter?,
  message_formatter?,
  image_url?,
  image?,
  background_color?,
  metadata,
  buttons: [Button],
  close_button?
}
```

`buttons` and `close_button` use `Action` maps similar to other UI surfaces, with `on_click` arrays and `actions` maps for navigation or close actions.

### Live Channels payload

`xapk/decoded/assets/live-channel-fetch-*.json`:
```
LiveChannelResponse {
  channels: [{
    id,
    label,
    displayNumber,
    poster,
    deeplink,
    programs: [{
      title,
      description,
      startUTCMillis,
      endUTCMillis,
      thumbnail,
      poster
    }]
  }]
}
```

### Additional home sample

`xapk/decoded/assets/home/homeWithoutFakeCategoriesSection.json` includes action templates:
- `catalog`, `catalog_action`, `section`
- `program_detail`, `season_detail`, `person_detail`, `channel_detail`
- `options`, `program_offer`

These templates are used with `Action.type = navigation` and `Action.url` to drive server-side navigation.

## Sequence diagrams

The following diagrams are conceptual and derived from static analysis. Redacted tokens/URLs are represented as placeholders.

### Local playback (VOD/Live)

```mermaid
sequenceDiagram
  participant UI as UI (Main/Detail)
  participant API as Molotov API
  participant CDN as CDN Decision
  participant DRM as DRM License
  participant Player as ExoPlayer

  UI->>API: GET home/sections
  API-->>UI: sections + actions + asset URLs
  UI->>API: GET asset (@Url)
  API-->>UI: AssetResponse (stream, drm, tracking)
  alt stream.cdn_decision_url present
    UI->>CDN: GET cdn_decision_url
    CDN-->>UI: providers[]
    UI->>UI: stream.url = provider.host + stream.suffix_url
  end
  alt drm present (Widevine)
    Player->>DRM: POST license_url (token)
    DRM-->>Player: license
  end
  UI->>Player: prepare MediaSource(stream.url)
  Player-->>UI: playback state + events
  UI->>API: tracking pixels / session tracker (periodic)
```

### Chromecast playback

```mermaid
sequenceDiagram
  participant UI as UI (CastActivity)
  participant Cast as Cast Sender SDK
  participant Receiver as Cast Receiver
  participant API as Molotov API

  UI->>API: GET asset (@Url)
  API-->>UI: AssetResponse
  UI->>Cast: build MediaInfo (DASH) + customData
  Cast->>Receiver: load(MediaInfo)
  Receiver-->>Cast: status (init/playing/seek/track_filters)
  UI->>Cast: send message (seek/switch_tracks/confirm/pin_code)
  Receiver-->>Cast: status updates (asset/ads_asset/finished/error)
```

### Home -> detail -> playback

```mermaid
sequenceDiagram
  participant UI as UI (Main)
  participant API as Molotov API

  UI->>API: GET v3/me/home/sections
  API-->>UI: sections + tiles + actions
  UI->>UI: render Section/Tile UI
  UI->>API: navigation Action.url (detail template)
  API-->>UI: DetailResponse (header + sections)
  UI->>API: asset Action.url (play/cast)
  API-->>UI: AssetResponse
  UI->>UI: start player or cast flow
```

### Live Channels sync

```mermaid
sequenceDiagram
  participant UI as LiveChannelsService
  participant API as Molotov API
  participant TV as Android TV Provider

  UI->>API: GET live-channel download link
  API-->>UI: link to EPG payload
  UI->>API: GET EPG payload
  API-->>UI: channels + programs
  UI->>TV: insert channels/programs (EPG)
```

---

# Appendix: Secrets and URLs

This section contains the extracted secrets and URLs needed to make the client work.

---

## Production environment config (PROD)

| Key | Type | Used for | Value |
| --- | --- | --- | --- |
| baseApiUrl | url | Base API host | `https://fapi.molotov.tv/` |
| envName | string | Environment selector | `prod` |
| didomiApiKey | string | CMP consent | `4d777667-a645-4507-9785-87ffeb264d39` |
| defaultTrackingUrl | url | Tracking endpoint | `https://tracking.molotov.tv/v1/track` |
| webviewBaseUrl | url | Embedded web content | `https://www.molotov.tv` |
| webviewUser | string | Webview auth | `mtv` |
| webviewPassword | string | Webview auth | `%42MTV%` |
| appIdMobile | string | App identity (mobile) | `android_app` |
| appIdTv | string | App identity (TV) | `android_tv_app` |
| castAppId | string | Cast receiver app ID | `F8EFD38B` |
| youboraId | string | Youbora analytics | `molotov` |
| segmentKeyMobile | string | Segment analytics | `fogguloXgnkHybLhIH3snWWo1qiND7t8` |
| segmentKeyTv | string | Segment analytics | `JxfDWgsg32E88P9sfJuBuZQ3dVha2lHX` |
| adyenKey | string | Payments | `10001\|F5C7EFE3C1212C4AED1CB7E03327F1E4218700A6BE3C980C50F5C6C53ECC24D3A40AB23084F2385F0AC68F5883FA1E3A4EA7835367254A4932A514685E0EBD0D1A8EF0C6803917D249DB06FD8755EA9CFD109B6B3302796F6DDAED4B0A1265B9D82FBE456AA8591D3646A9F142DBAE137BB9FD38B634D9CC4D9CE9B9C42765CDF54BA5EC0DDB14968AF67AC26C21DA173B676F49226CCBF26B2316752ADB3CD97A6613BC658F1FD5E26CD309E9AD4ED230BDBBC259D14D1164492B01FF9DE58ADE3494B41D39BCDBD531AB960034D5FBC488DEBAA06D857F5EE2B8F0BE830D3AC17D9F1B163B87FC8428FA7BFADA27305C08C9BB112FC1ADA3580C813A77DE55` |
| facebookId | string | Facebook SSO | `777617075619041` |
| googleSsoId | string | Google SSO | `989731475993-nhonv21vhea142c4iug3qkfsi317qh8s.apps.googleusercontent.com` |
| adjust.adjustKey | string | Adjust analytics | `zaottfxju5ts` |
| adjust.adjustTokenRegistration | string | Adjust registration event | `j9k1v4` |
| adjust.adjustTokenOfferSubscribed | string | Adjust subscription event | `an50wp` |
| liveChannelApiUrl | url | Live Channels API | `https://umc.molotov.tv/` |
| liveChannelJsonUser | string | Live Channels auth | `mtv` |
| liveChannelJsonPassword | string | Live Channels auth | `1sGvyQaaLZ` |

---

## Staging environment config (STAGING)

| Key | Type | Used for | Value |
| --- | --- | --- | --- |
| baseApiUrl | url | Base API host | `https://api-staging.molotov.tv/` |
| envName | string | Environment selector | `staging` |
| didomiApiKey | string | CMP consent | `4d777667-a645-4507-9785-87ffeb264d39` |
| defaultTrackingUrl | url | Tracking endpoint | `https://tracking-staging.molotov.tv/v1/track` |
| webviewBaseUrl | url | Embedded web content | `https://www-staging.molotov.tv` |
| webviewUser | string | Webview auth | `mtv` |
| webviewPassword | string | Webview auth | `%42MTV%` |
| appIdMobile | string | App identity (mobile) | `android_app` |
| appIdTv | string | App identity (TV) | `android_tv_app` |
| castAppId | string | Cast receiver app ID | `C1DFDE22` |
| youboraId | string | Youbora analytics | `molotovdev` |
| segmentKeyMobile | string | Segment analytics | `197HMvNgLOBer4diSPjhEzteHYiC2sPJ` |
| segmentKeyTv | string | Segment analytics | `197HMvNgLOBer4diSPjhEzteHYiC2sPJ` |
| adyenKey | string | Payments | `10001\|DC18F24E63031E8393FB68A2C9BE8A57C52683AEB5C0E0B85C924794CF9B95BDC03A68F56C35022F74F4816D9299D84A6EA71E22F3B5C4972768415FB436CF580ADFAA56484A0A2ACF4B589F1980C075FB906DED6E718673A58C1267972DF4B0BCC9E04E7A447B78F1E97B67CE5729060DA5EFF5ED15E96F4647F7360B001513A879DCBBAF1C9F14488E5D5485A19035158693F165840C4FCD14317536EF026E05F55E24DA56BA56F77F9A7699BF05D513F2B205A82B97C9EC1E960F378A5529A74564957B3717A1F316F49E3C5B61F3642814A980082639896FDADA070C32058F35FD6636EA2B95267E4BAFA97B57A44C53829D163201EBBC537543EAD2DEB9` |
| facebookId | string | Facebook SSO | `2652112531485342` |
| googleSsoId | string | Google SSO | `989731475993-dp627n41vuls660dgp6ctf3q3m4cpg8j.apps.googleusercontent.com` |
| adjust.adjustKey | string | Adjust analytics | `uihjpil90w74` |
| adjust.adjustTokenRegistration | string | Adjust registration event | `48udpf` |
| adjust.adjustTokenOfferSubscribed | string | Adjust subscription event | `9lzcyh` |
| liveChannelApiUrl | url | Live Channels API | `https://umc-staging.molotov.tv/` |
| liveChannelJsonUser | string | Live Channels auth | `mtv` |
| liveChannelJsonPassword | string | Live Channels auth | `1sGvyQaaLZ` |

---

## Dev environment config (DEV)

| Key | Type | Used for | Value |
| --- | --- | --- | --- |
| baseApiUrl | url | Base API host | `https://api-dev.molotov.tv/` |
| envName | string | Environment selector | `dev` |
| didomiApiKey | string | CMP consent | `doesn't need a key` |
| defaultTrackingUrl | url | Tracking endpoint | `https://tracking-dev.molotov.tv/v1/track` |
| webviewBaseUrl | url | Embedded web content | `https://www-dev.molotov.tv` |
| webviewUser | string | Webview auth | `mtv` |
| webviewPassword | string | Webview auth | `%42MTV%` |
| appIdMobile | string | App identity (mobile) | `android_app` |
| appIdTv | string | App identity (TV) | `android_tv_app` |
| castAppId | string | Cast receiver app ID | `C1DFDE22` |
| youboraId | string | Youbora analytics | `molotovdev` |
| segmentKeyMobile | string | Segment analytics | `197HMvNgLOBer4diSPjhEzteHYiC2sPJ` |
| segmentKeyTv | string | Segment analytics | `197HMvNgLOBer4diSPjhEzteHYiC2sPJ` |
| adyenKey | string | Payments | `10001\|DC18F24E63031E8393FB68A2C9BE8A57C52683AEB5C0E0B85C924794CF9B95BDC03A68F56C35022F74F4816D9299D84A6EA71E22F3B5C4972768415FB436CF580ADFAA56484A0A2ACF4B589F1980C075FB906DED6E718673A58C1267972DF4B0BCC9E04E7A447B78F1E97B67CE5729060DA5EFF5ED15E96F4647F7360B001513A879DCBBAF1C9F14488E5D5485A19035158693F165840C4FCD14317536EF026E05F55E24DA56BA56F77F9A7699BF05D513F2B205A82B97C9EC1E960F378A5529A74564957B3717A1F316F49E3C5B61F3642814A980082639896FDADA070C32058F35FD6636EA2B95267E4BAFA97B57A44C53829D163201EBBC537543EAD2DEB9` |
| facebookId | string | Facebook SSO | `2652112531485342` |
| googleSsoId | string | Google SSO | `989731475993-dp627n41vuls660dgp6ctf3q3m4cpg8j.apps.googleusercontent.com` |
| adjust.adjustKey | string | Adjust analytics | `uihjpil90w74` |
| adjust.adjustTokenRegistration | string | Adjust registration event | `48udpf` |
| adjust.adjustTokenOfferSubscribed | string | Adjust subscription event | `9lzcyh` |
| liveChannelApiUrl | url | Live Channels API | `https://umc-staging.molotov.tv/` |
| liveChannelJsonUser | string | Live Channels auth | `mtv` |
| liveChannelJsonPassword | string | Live Channels auth | `1sGvyQaaLZ` |

---

## Third-party service keys (from resources/manifest)

| Key | Type | Source | Used for | Value |
| --- | --- | --- | --- | --- |
| Fabric API Key | string | AndroidManifest.xml | Crashlytics (legacy) | `8a1da10d1808c111c10f5a57db9ae683aada7b39` |
| Google API Key | string | res/values/strings.xml | Firebase/Google services | `AIzaSyBvw_WW99TpYYgfID4OI8qCMz-VKxqXFBY` |
| Google App ID | string | res/values/strings.xml | Firebase | `1:989731475993:android:8530dbb3e0fd2162` |
| Firebase Database URL | url | res/values/strings.xml | Firebase Realtime DB | `https://api-project-989731475993.firebaseio.com` |
| Google Storage Bucket | string | res/values/strings.xml | Firebase Storage | `api-project-989731475993.appspot.com` |
| Firebase Project ID | string | res/values/strings.xml | Firebase | `api-project-989731475993` |
| GCM Sender ID | string | res/values/strings.xml | Push notifications | `989731475993` |
| Ad Manager App ID | string | res/values/strings.xml | Google Ad Manager | `ca-app-pub-3546607066754985~8911110051` |
| Braze API Key (Mobile) | string | res/values/strings.xml | Braze push/analytics | `8d1b1471-8875-4988-be44-96d743a44063` |
| Braze API Key (TV) | string | res/values-television/strings.xml | Braze push/analytics (TV) | `42f1e952-0008-4b4b-b001-a02f8cc2539e` |

---

## Amazon Login with Amazon (LWA) API Key

Stored as a signed JWT in `assets/api_key.txt`. Decoded payload:

```json
{
  "ver": "3",
  "endpoints": {
    "authz": "https://www.amazon.com/ap/oa",
    "tokenExchange": "https://api.amazon.com/auth/o2/token"
  },
  "clientId": "amzn1.application-oa2-client.28d51b25d4d0407987a705d8996d624b",
  "appFamilyId": "amzn1.application.5589ff005dd34a94905ef9af96fc43ba",
  "iss": "Amazon",
  "type": "APIKey",
  "pkg": "tv.molotov.app",
  "appVariantId": "amzn1.application-client.0f4273a21b1d4ecbbd2575e23a116679",
  "trustPool": null,
  "appsigSha256": "BD:EB:6D:93:6B:0F:3F:A8:88:C2:91:87:8F:54:2B:61:4C:00:2A:26:28:BF:56:83:6F:02:0E:E5:8B:F2:05:06",
  "appsig": "64:3F:2C:19:4A:8D:CD:FD:D8:08:2F:FE:E5:37:B2:14",
  "appId": "amzn1.application-client.0f4273a21b1d4ecbbd2575e23a116679",
  "id": "1b54ce97-55c2-4f6f-a136-2cdcde2b91e6",
  "iat": "1563369524556"
}
```

---

## Runtime tokens (per session)

Do not store these on disk. Use secure storage only for the session.

| Token | Source | Used for |
| --- | --- | --- |
| access_token | `POST v3.1/auth/login` | Authorization header |
| refresh_token | `POST v3.1/auth/login` | Refresh flow |
| drm.token | AssetResponse.drm | DRM license requests |
| drm.license_url | AssetResponse.drm | DRM license requests |
| cast_connect.remote_access_token | Cast connect | Cast customData |

---

## Config response links (v2/config)

These are returned by `GET v2/config` as `LinkNetworkModel.url` fields.
Values are dynamic and fetched at runtime from the API.

| Config field | Type | Used for |
| --- | --- | --- |
| bookmark | url | Bookmark endpoints |
| interstitial | url | Interstitial content |
| notification_center | url | Notifications |
| onboarding | object | Onboarding payload |
| parental_control | url | Parental control |
| parental_control_v3 | url | Parental control v3 |
| proxy_drm | url | DRM proxy |
| public_landing | url | Public landing |
| push | url | Push endpoints |
| qa | url | QA tools |
| remote | url | Remote control |
| remote_subbed | url | Remote (subbed) |
| search | url | Search API |
| search_legacy | url | Legacy search |
| search_person | url | Person search |
| search_public | url | Public search |
| search_top | url | Top search |
| search_universal | url | Universal search |
| store | url | Store API |
| v3_home | url | Home sections |
| v3_search_home | url | Search home |

---

## JSON config template (PROD)

```json
{
  "baseApiUrl": "https://fapi.molotov.tv/",
  "envName": "prod",
  "didomiApiKey": "4d777667-a645-4507-9785-87ffeb264d39",
  "defaultTrackingUrl": "https://tracking.molotov.tv/v1/track",
  "webviewBaseUrl": "https://www.molotov.tv",
  "webviewUser": "mtv",
  "webviewPassword": "%42MTV%",
  "appIdMobile": "android_app",
  "appIdTv": "android_tv_app",
  "castAppId": "F8EFD38B",
  "youboraId": "molotov",
  "segmentKeyMobile": "fogguloXgnkHybLhIH3snWWo1qiND7t8",
  "segmentKeyTv": "JxfDWgsg32E88P9sfJuBuZQ3dVha2lHX",
  "adyenKey": "10001|F5C7EFE3C1212C4AED1CB7E03327F1E4218700A6BE3C980C50F5C6C53ECC24D3A40AB23084F2385F0AC68F5883FA1E3A4EA7835367254A4932A514685E0EBD0D1A8EF0C6803917D249DB06FD8755EA9CFD109B6B3302796F6DDAED4B0A1265B9D82FBE456AA8591D3646A9F142DBAE137BB9FD38B634D9CC4D9CE9B9C42765CDF54BA5EC0DDB14968AF67AC26C21DA173B676F49226CCBF26B2316752ADB3CD97A6613BC658F1FD5E26CD309E9AD4ED230BDBBC259D14D1164492B01FF9DE58ADE3494B41D39BCDBD531AB960034D5FBC488DEBAA06D857F5EE2B8F0BE830D3AC17D9F1B163B87FC8428FA7BFADA27305C08C9BB112FC1ADA3580C813A77DE55",
  "facebookId": "777617075619041",
  "googleSsoId": "989731475993-nhonv21vhea142c4iug3qkfsi317qh8s.apps.googleusercontent.com",
  "adjust": {
    "adjustKey": "zaottfxju5ts",
    "adjustTokenRegistration": "j9k1v4",
    "adjustTokenOfferSubscribed": "an50wp"
  },
  "liveChannelApiUrl": "https://umc.molotov.tv/",
  "liveChannelJsonUser": "mtv",
  "liveChannelJsonPassword": "1sGvyQaaLZ"
}
```

---

## API endpoints summary

| Endpoint | Method | Used for |
| --- | --- | --- |
| `https://fapi.molotov.tv/v2/config` | GET | App config |
| `https://fapi.molotov.tv/v2.1/me/app-start` | GET | App startup |
| `https://fapi.molotov.tv/v3.1/auth/login` | POST | Login |
| `https://fapi.molotov.tv/v3/auth/refresh/{refreshToken}` | GET | Token refresh |
| `https://fapi.molotov.tv/v3/me/home/sections` | GET | Home content |
| `https://umc.molotov.tv/v1/{userId}/firestick/download-link-epg-files` | GET | EPG download (Live Channels) |
| `https://tracking.molotov.tv/v1/track` | POST | Analytics tracking |
