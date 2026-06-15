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
`x-drm-scheme: widevine`, `x-supported-features` (incl. `use_drm_v2_response`),
and a stable `x-device-id`. Authenticated calls add `Authorization: Bearer` and
`x-profile-id`; `x-user-id` is sent **only** on `/vapi` playback calls.

## Endpoints used

| Concern | Call |
|---|---|
| Login | `PUT /signin {email,password}` then `GET /user` (id + `profiles[0].id`) |
| Refresh | `POST /refresh` (refresh token as Bearer); a 401 refreshes once and retries |
| Live guide | `GET /epg?startTime&endTime` (RFC3339 UTC) `&limit&ignoreEmpty=true` |
| Search | `GET /papi/v1/search/content?category=top_results&fuzzy=true&query=` |
| Detail / replays / episodes | `GET /papi/v1/program-details/{channel\|program\|series}/{id}` (`?tabID=id-tab-watch-now` for a series' episodes) |
| Recordings | `GET /dvr/v2/list?sort=date&status={recorded\|scheduled}` (merge; `status=all` is empty) |
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
The `heartbeat`/`concurrency` endpoints are analytics only and are not required
to keep a stream alive.

## Module mapping

- `api.py` — the Fubo HTTP client (auth, `/epg`, `/papi`, `/vapi`, `/dvr`) over a
  provider-agnostic transport (single 401 refresh-and-retry, 5xx/429 backoff).
- `coordinator.py` — one `/epg` fetch → `EpgData`.
- `helpers.py` — `parse_fubo_epg`, the papi card parser
  (`parse_papi_card`/`parse_papi_sections`/`parse_papi_search`),
  `parse_papi_episodes`, `parse_papi_channel_replays`, `parse_fubo_recordings`,
  and the RFC3339 branch of `parse_timestamp`.
- `media_player.py` — resolves playback via `/vapi` and builds the receiver
  `customData` (`_extract_stream_attrs`).
- `browse.py` — maps Fubo pages into the existing four-folder tree.
- `receiver/index.html` and the Lit panel are unchanged.
