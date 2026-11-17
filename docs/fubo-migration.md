# Fubo backend (Molotov 5.51)

Molotov 5.51 re-platformed onto **Fubo**. The integration now targets the Fubo
REST API directly (`api-eu.fubo.tv`) instead of the legacy `*.molotov.tv`
endpoints. This document is the validated contract the client implements; it was
reverse-engineered and checked live against the EU host from a French vantage
point with a real account.

## Requirements

- The request egress IP must geolocate to **France** (the content market follows
  the IP; `/v3/location.network_allowed` only gates VPN/proxy, not the market).
- A Molotov account. Free channels (France 2 = `600019`, France 3 = `600049`,
  France 4 = `600018`, France 5 = `600042`, Arte = `600034`, BFMTV = `600035`,
  CNEWS = `600002`, LCP = `600008`) play directly; channels like TF1 need the
  paid **Molotov Extra** add-on; DVR needs a recording quota.

## Client identity (every request)

Mandatory header `x-application-id: molotov` (without it the backend returns
`NO_SERVICE_FOR_SUBSCRIPTION`), plus the device set: `user-agent`,
`x-client-version: 5.51.0`, `x-os: android`, `x-device-platform: android_phone`,
`x-preferred-language: fr-FR`, `x-supported-streaming-protocols: hls,dash`,
`x-drm-scheme: widevine`, `x-supported-features` (incl. `use_drm_v2_response`,
and `auto_play_up_next` for the end slate of an episode page), and a stable
`x-device-id`. Authenticated calls add `Authorization: Bearer` and
`x-profile-id`; `x-user-id` is sent **only** on `/vapi` playback calls.

`x-device-name: Home Assistant` is the label the account lists the device under.
The app sends the name the owner gave the handset (`Settings.Global device_name`,
skipped when blank) and the backend names the device from it, so without the
header the entry reads as unnamed.

`x-device-id` identifies the installation: the backend adds every unseen value
to the account as a new device and mails the owner about it. The id is derived
from the Home Assistant instance id and the account email
(`helpers.async_device_id`), so the config flow and the entry setup send the
same one and restarts, reloads and re-authentication all reuse it. The Android
app does the same thing with a UUID it keeps in its `DEVICE_PREFS` store.

## Endpoints used

| Concern | Call |
|---|---|
| Login | `PUT /v2/signin {username,password}` (username is the account email; tokens arrive in a `{type,payload}` envelope) then `GET /user` (id + `profiles[0].id`) |
| Refresh | `POST /refresh` (refresh token as Bearer); a 401 refreshes once and retries, and a rejected refresh token opens a new session with the stored credentials |
| Live guide | `GET /epg?startTime&endTime` (RFC3339 UTC) `&limit&ignoreEmpty=true` |
| Search | `GET /papi/v1/search/content?category=top_results&fuzzy=true&query=` |
| Detail / replays / episodes | `GET /papi/v1/program-details/{channel\|program\|series}/{id}` (`?tabID=id-tab-watch-now` for a series' episodes) |
| Recordings | `GET /papi/v1/my-stuff/status/recordings` ("Mes vidéos": a card per show linking `my-stuff/folder/seriesId/{id}`, or per recording linking `program-details/program/LIVE_…`), then `GET /papi/v1/my-stuff/folder/seriesId/{id}` for a show's recorded episodes. `/dvr/v2/list` answers 404 since November 2026 |
| Playback | `GET /vapi/asset/v1?channelId=&type=live` or `?id=&type={vod\|dvr}` |

`/papi` pages are server-driven: `content.sections[].components[]` cards carry an
`actions.on_click[]` navigation `endpoint.url` that encodes the target kind/id
(`program-details/channel/{id}`, `channel-details/{id}`,
`program-details/program/{id}`, `program-details/series/{id}`). Poster cards put
their title in the action's form-encoded `trkOriginElement` param. A channel's
detail page carries its catch-up in an "En replay sur …" card section.

## DRM and casting

Every asset is **Widevine via DRMtoday**. `/vapi` returns `stream.url` (tokenized
DASH manifest) and `drm_v2.license.{url, headers}` where the headers carry
`x-dt-auth-token`. The integration passes `license_url` and `drm_token` to the
custom cast receiver through the existing `customData` keys (`stream_url`,
`content_type`, `license_url`, `drm_token`); the receiver injects
`x-dt-auth-token` on the license request. It must **not** set `customData.asset_id`
(the receiver appends `assetId=` to the license URL only for the old Molotov
endpoint, which would corrupt the final DRMtoday URL). Live tokens are short
lived, so a fresh manifest is resolved via `/vapi` immediately before each play.

For an episode, the programme page read beside `/vapi` gives
`content.player.end_slate.position`, the second the next episode is announced
as the credits roll. It goes to the receiver as `customData.credits_sec`, and a
position past it is reported to the playhead as the full duration.
The `heartbeat`/`concurrency` endpoints are analytics only and are not required
to keep a stream alive.

## Module mapping

- `api.py` — the Fubo HTTP client (auth, `/epg`, `/papi`, `/vapi`) over a
  provider-agnostic transport (single 401 refresh-and-retry, 5xx/429 backoff).
- `coordinator.py` — one `/epg` fetch → `EpgData`.
- `helpers.py` — `parse_fubo_epg`, the papi card parser
  (`parse_papi_card`/`parse_papi_sections`/`parse_papi_search`),
  `parse_papi_episodes`, `parse_papi_channel_replays`, `parse_papi_recordings`,
  and the RFC3339 branch of `parse_timestamp`.
- `media_player.py` — resolves playback via `/vapi` and builds the receiver
  `customData` (`_extract_stream_attrs`).
- `browse.py` — maps Fubo pages into the existing four-folder tree.
- The custom Cast receiver (now at
  [renaudallard/etincelle_receiver](https://github.com/renaudallard/etincelle_receiver))
  and the Lit panel are unchanged.
