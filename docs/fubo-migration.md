# Fubo migration scope (contingency plan)

Analysis of decompiled **Molotov 5.51.0** (versionCode 504129) vs the **4.27.0**
baseline, and what it would take to keep the integration working if Molotov
retires its legacy REST API.

## Context: what changed in the app

Molotov 5.51.0 is a complete re-platforming of the app onto **Fubo**. The store
package id stays `tv.molotov.app`, but the implementation was replaced wholesale:

- Application class `tv.molotov.android.MolotovApplication` -> `tv.fubo.mobile.presentation.FuboApplication`.
- Code moved from `tv/molotov/*` to `tv/fubo/*`.
- All networking now targets `*.fubo.tv`; **zero** `molotov.tv` API hosts remain
  in the app (only `aide.molotov.tv` help and a legal link survive).
- Molotov persists only as a paid Fubo content add-on ("Molotov Extra").

The HTTP stack itself is unchanged in kind: still **Retrofit-on-OkHttp REST**
(Retrofit was R8-repackaged `retrofit2` -> `aq/`, annotations -> `cq/`, not
removed). No GraphQL/gRPC/Ktor. So a re-targeted `aiohttp` client remains the
right design.

## Bottom line: do not migrate yet

`https://fapi.molotov.tv/v2/config` still returns **HTTP 200** with the routing
config the integration parses (`login`, `refresh_token`, `remote`,
`remote_subbed`, `search`, `search_universal`, `bookmark`, `v3_home`,
`cast_app_id`, ...). Molotov's API servers remain live even though the app moved
to Fubo, so the integration is **not broken** by the app migration.

This document is the reference for *if/when* the legacy API is decommissioned.
The best early-warning signal is a periodic liveness/JSON check of
`https://fapi.molotov.tv/v2/config`.

## Flow mapping (current Molotov -> Fubo)

| Integration flow (`api.py`) | Molotov today | Fubo equivalent (from smali) |
|---|---|---|
| Bootstrap | `GET v2/config` (dynamic URL discovery) | Gone. Hardcode region host: `api.fubo.tv` (US) / `api-eu.fubo.tv` (EU/France); `papi/v1/settings` for app settings |
| Geolocation / geo-gate | `fapi.molotov.tv` (geolocation endpoint) | `GET /v3/location` (`LocationApi`) on `api.fubo.tv` / `api-eu.fubo.tv` -> `LocationResponse{network_allowed, country_code, region_code, dma, postal, asn, as_name, connection_type, ip_address, display_name}`. The `network_allowed` bool is the gate; `asn`/`connection_type` add VPN/proxy detection. Geo/market then rides on the `X-User-Market` request header. |
| Login | `POST v3.1/auth/login` (grant_type=password) | `POST {api}/signin` `{email,password}` + headers `X-Device-Id`, `X-Device-Platform` -> `{access_token,id_token,refresh_token,expires_in}` |
| Refresh | `GET v3/auth/refresh/{token}` | `POST {api}/refresh` |
| Headers | `X-Molotov-Agent` + Bearer | Drop `X-Molotov-Agent`; keep `Authorization: Bearer`; add `X-Device-Id`/`X-Device-Platform`/`X-User-Id`/`X-Profile-Id`/`X-User-Market` |
| Channels + EPG | `channels-subbed` + `live/sections` + UMC firestick EPG zip | `/epg` + `KnowledgeGraphApi` (`services.fubo.tv`); different schema |
| Search | v2/v3 search variants | `KnowledgeGraphApi` |
| Bookmarks/recordings | `v4/me/bookmarks/sections` | Fubo DVR/my-list (needs RE; not precisely located) |
| Asset stream | `v2/me/assets` + `cdn_decision_url`/`suffix_url` | `VapiApi.getVapi` (`@Url`) -> `PlaybackDataResponse` (manifest url + DRM metadata) |
| Resume position | local store + cast position | `PlayHeadApi` (server-side playheads) |

Other Fubo APIs present: `LocationApi`, `HeartbeatApi`, `ConcurrencyMonitorApi`,
`AdsTrackerApi`, `DynamicUrlApi`, `ApiFactory` (builds per-endpoint clients).

Fubo backend hosts (region enum DEV/QA/PROD, with `-eu` variants):
`api.fubo.tv`, `api-eu.fubo.tv`, `services.fubo.tv`, `events.fubo.tv`,
signup at `www.fubo.tv/signup`.

## Blockers (priority order)

1. **DRM is the feasibility gate.** Fubo content is Widevine-protected: license
   via `irdeto.fubo.tv/licenseServer/widevine/v1/FuboTV/license` (token passed as
   the `ls_session` query param) or `api.fubo.tv/v1/drm/getkey` (token in a
   `customdata` header). The integration's model (resolve a DASH URL, cast/play
   it, with the receiver doing Molotov's simple `license_url`+`token`) does not
   map to this. Solve DRM first; if it cannot be solved, migration is not viable
   in the current form (the custom cast receiver would need a Fubo/Irdeto
   rewrite).
2. **Geo-blocking.** `api.fubo.tv` returns 451 from outside its regions;
   `api-eu.fubo.tv` is the EU endpoint. RE and runtime likely require a
   France/EU vantage point.
3. **Auth hardening.** MFA and social/`signin/code` paths exist - a headless
   email/password login may hit MFA challenges it cannot satisfy.
4. **Entitlement model.** Molotov is now a Fubo "Molotov Extra" add-on;
   account/entitlement semantics differ.
5. **Full schema rewrite.** Every response model differs, so `helpers.py`
   parsers would be rewritten.

## Effort and recommendation

Effort is large: effectively a new `api.py` client, new `helpers.py` parsers,
and very likely a new custom cast receiver for Fubo DRM. Compounded by the live
Fubo API being geo-blocked (RE needs an EU vantage or captured real-device
traffic).

Recommendation: keep the working Molotov client; treat this as a dormant
contingency. Add a small monitor on `v2/config`. If it goes dark, the first
spike to run is DRM feasibility (can a Fubo/Irdeto Widevine stream be acquired
and played/cast headlessly?) - everything else is mechanical by comparison.

## RE starting points

Decompiled Fubo network classes (from a 5.51.0 apktool decode) live under
`tv/fubo/android/data/network/internal/retrofit/`:
`AccountApi`, `VapiApi`, `KnowledgeGraphApi`, `PlayHeadApi`, `LocationApi`,
`HeartbeatApi`, `ConcurrencyMonitorApi`, `AdsTrackerApi`, `DynamicUrlApi`, and
`ApiFactory` (in `data/network/api/`).
