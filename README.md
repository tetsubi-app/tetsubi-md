# Tetsubi MD

Write music from your [Jellyfin](https://jellyfin.org/) server straight to a MiniDisc, using only a web browser.

Tetsubi MD is a companion to [Tetsubi](https://tetsubi.app/), the Jellyfin music player. One half of the screen browses your Jellyfin library; the other half is a MiniDisc writer. Add albums and songs to the disc list, and they are saved as a Jellyfin playlist named after the disc and written to the recorder.

> **Status:** early development. The MiniDisc half works as upstream does. On the Jellyfin half you can sign in (Quick Connect or username and password) browse albums, artists, playlists and search, build a disc list that is saved as a Jellyfin playlist on every change, and write that list to the disc. Writing has been tested with the mock recorder, not yet on hardware.

## Based on Web MiniDisc Pro

Tetsubi MD is a fork of [Web MiniDisc Pro](https://github.com/asivery/webminidisc) by asivery and contributors, which is itself a fork of [Web MiniDisc](https://github.com/cybercase/webminidisc) by Stefano Brilli. Everything that talks to the recorder is their work, and this project would not exist without it.

If you only want to copy files from your computer to a MiniDisc, use the original at [web.minidisc.wiki](https://web.minidisc.wiki/). Its [user guide](https://www.minidisc.wiki/guides/webminidisc/start) also covers driver setup and troubleshooting for the recorder side of Tetsubi MD.

Please report Tetsubi MD problems [here](https://github.com/tetsubi-app/tetsubi-md/issues), not to the upstream project.

## Requirements

- A NetMD or Hi-MD recorder and a USB cable
- A Chromium browser (Chrome, Edge, Brave and so on). Safari and Firefox do not support WebUSB.
- A Jellyfin server with a music library, reachable over `https`
- Windows needs a USB driver first, and Linux needs a udev rule: see the [upstream requirements](https://www.minidisc.wiki/guides/webminidisc/requirements)

## Development

```sh
npm ci
(cd extra/sar-packager && npm ci)
(cd encoders/atracdenc && npm ci)
(cd encoders/remote-encoder && npm ci)

npm run prepare-dev-encoders   # once, builds the ATRAC encoders for the dev server
npm start                      # dev server on localhost
npm test                       # unit tests
npm run build                  # production build in dist/
npm run build:site             # production build for https://tetsubi.app/minidisc/
```

The dev server offers a mock recorder ("MockMD") on the connect screen, so most things can be tried without hardware.

The WASM modules in `public/` are prebuilt; `extra/` explains how to rebuild them.

## Layout of the code

- `src/jellyfin/` — the Jellyfin client: server address, sign-in, saved session, library queries
- `src/components/jellyfin/` — the library half of the screen: sign-in, tabs, search, album, artist and playlist pages
- `src/disc-list/`, `src/components/disc-list/` — the songs chosen for a disc, the queue that keeps their Jellyfin playlist in step, and the hand-over of those songs to upstream's convert dialog and upload
- the few changes inside upstream files are marked `Tetsubi MD:`
- `src/components/tetsubi/`, `src/tetsubi/` — the frame around both halves, theme, fonts
- everything else — Web MiniDisc Pro, changed as little as possible so upstream fixes can be merged

## Releasing

`scripts/release.sh` builds the site and commits the output to the `deploy` branch. The web host serves a clone of that branch, so a release is finished with `git pull` there.

## Credits

- [Web MiniDisc Pro](https://github.com/asivery/webminidisc) and [Web MiniDisc](https://github.com/cybercase/webminidisc), the base of this app
- [netmd-js](https://github.com/cybercase/netmd-js), [himd-js](https://github.com/asivery/himd-js), [netmd-exploits](https://github.com/asivery/netmd-exploits) and [netmd-tocmanip](https://github.com/asivery/netmd-tocmanip), to talk to the recorders
- [linux-minidisc](https://github.com/linux-minidisc/linux-minidisc), which made netmd-js possible
- [FFmpeg](https://www.ffmpeg.org/) and [ffmpegjs](https://github.com/ffmpegjs/FFmpeg), to read audio files
- [atracdenc](https://github.com/dcherednik/atracdenc/), for ATRAC3 encoding (LP2 and LP4)
- [Emscripten](https://emscripten.org/), to run FFmpeg and atracdenc in the browser
- DEKIRU Sans, a modified [IBM Plex Sans](https://github.com/IBM/plex) (SIL Open Font License; see `src/tetsubi/fonts/`)
- [Jellyfin](https://jellyfin.org/). Tetsubi MD is not made by or connected with the Jellyfin project.

## Licence

GPL-2.0, the same as the projects it is based on. See [LICENSE](LICENSE).
