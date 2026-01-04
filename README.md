# Molotov TV Home Assistant Integration

Unofficial custom integration that lets Home Assistant browse Molotov TV channels and cast live or replay content to Chromecast.

## Feature overview

| Feature | Details |
| --- | --- |
| EPG browsing | Channels with current and upcoming programs |
| Media browser | Channels, replays, and recordings |
| Playback | Cast to Chromecast from the Home Assistant media browser |
| Options | Pick cast targets or supply hostnames and IPs manually |
| Refresh | EPG updates on a 15 minute interval |

## Requirements

- Home Assistant version listed in `custom_components/molotov_tv/manifest.json`
- Active Molotov account
- Chromecast device (optional but recommended for playback)

## Installation

### HACS (custom repository)

1. Open HACS in Home Assistant.
2. Add this repository as a custom repository (Integration type).
3. Install "Molotov TV".
4. Restart Home Assistant.

### Manual

1. Copy `custom_components/molotov_tv` into your Home Assistant `custom_components` directory.
2. Restart Home Assistant.

## Configuration

1. Go to Settings -> Devices and Services.
2. Add the "Molotov TV" integration.
3. Enter your Molotov email and password.

### Options

- Cast targets: select one or more `media_player` entities.
- Cast hosts: provide one hostname or IP address per line for devices that are not discovered automatically.

## Usage

- Open the Home Assistant media browser and choose Molotov TV.
- Browse Channels, Replays, or Recordings.
- Select a program and pick a Chromecast target.

## Notes

- This project is unofficial and is not affiliated with Molotov.
- The integration uses Molotov API endpoints extracted from the Android app; see the implementation notes for details.

## Documentation

- Implementation notes: `docs/molotov-tv-implementation.md`

## License

BSD 2-Clause License. See `LICENSE`.
