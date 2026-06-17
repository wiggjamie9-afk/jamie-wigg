# Roomtone — go-test app

A real, runnable demo of the Roomtone concept (`specs/roomtone/README.md`).
Single HTML file, no build step, no backend, no upload — all audio processing
runs in your browser.

## What it does, end to end

1. Asks for mic permission.
2. Listens to the room continuously.
3. Classifies the scene every ~700 ms (Quiet / Restaurant / Car / Music /
   Outdoors / Reverberant) using a rule-based feature classifier — RMS,
   spectral centroid, flatness, band ratios, zero-crossing rate.
4. Applies an 8-band parametric EQ that combines **your audiogram** with the
   **detected scene's preset**, plus any per-scene tweaks you've made.
5. Pipes processed audio out through your system audio output — which is where
   your paired hearing aids / AirPods / headphones show up.

Hysteresis: a scene change has to be detected twice in a row before Roomtone
actually re-EQs, so a single shout in a quiet room won't flip you into
Restaurant mode.

## Install it like a real app

Roomtone is a PWA — open the URL once, then **Share → Add to Home Screen**
on iOS (or "Install app" on Android Chrome) and it lives on your home screen
with an icon, no browser chrome, and a splash screen. Works offline after the
first load.

## How to try it on your iPhone

The browser will only enable the mic over **HTTPS** (or localhost). The
cleanest path from a phone with no laptop:

**Option 1 — raw.githack.com (HTTPS, instant):**

Tap this link on your iPhone, allow the mic, plug in/pair audio output:

```
https://raw.githack.com/wiggjamie9-afk/jamie-wigg/claude/hearing-aid-environmental-eq-tHJK5/apps/roomtone/index.html
```

(That URL serves the file from this branch with the right MIME type and HTTPS.
If the branch gets merged or renamed, swap `claude/hearing-aid-environmental-eq-tHJK5`
for `main`.)

**Option 2 — GitHub Pages:**

In the repo settings → Pages → set source to the
`claude/hearing-aid-environmental-eq-tHJK5` branch, `/` root. You'll get a
`https://wiggjamie9-afk.github.io/jamie-wigg/apps/roomtone/` URL once it
builds. Same HTTPS, no third-party CDN.

**Option 3 — local desktop:**

```bash
cd jamie-wigg
python3 -m http.server 8080
# open http://localhost:8080/apps/roomtone/ — localhost counts as secure
```

## What to actually do once it's open

1. **Pair your audio output FIRST.** AirPods, Bluetooth headphones, or — the
   real point — your MFi / LE Audio hearing aids. If you start with the phone
   speaker live, the mic will pick up the speaker and feed back loudly.
2. Tap **Start Roomtone** and accept the mic prompt.
3. Watch the big scene name. Try:
   - Sitting in a quiet room → "Quiet"
   - Playing a podcast / TV with babble nearby → "Restaurant"
   - Music from a nearby speaker → "Music"
   - In a car with engine on → "Car"
   - Outside on a windy spot → "Outdoors"
   - Empty stairwell / bathroom → "Reverberant"
4. **Hold the red "compare" button** to instantly bypass all processing. Let
   go to hear Roomtone again. This is the demo moment — A/B is what sells it.
5. **Tap a scene chip** to manually force a scene and compare presets. Tap it
   again or tap **Auto** to go back to detection.
6. Open **Personalize**:
   - Set your audiogram (or pick **Mild** / **Moderate** preset if you don't
     have one handy).
   - Select a scene and tweak its EQ. Your tweaks persist across reloads
     (saved in `localStorage`, nothing uploaded).

## What's real here vs the spec

| Spec capability                                  | This demo                                    |
|--------------------------------------------------|----------------------------------------------|
| Continuous on-device scene detection             | ✅ real, rule-based instead of a CNN          |
| 8-band audiogram-shaped EQ                       | ✅ real, biquad peaking filters               |
| Per-scene EQ overlay                             | ✅ real, with per-scene user tweaks           |
| Hysteresis to prevent scene-flip thrashing       | ✅ 2-window confirmation                      |
| User-tunable per-room fingerprints               | ⚠️ partial — saves per-scene tweaks, not per-room |
| Direct hearing-aid SDK integration               | ❌ relies on OS audio routing                 |
| <30 ms end-to-end latency                        | ❌ Web Audio adds 30–100 ms                   |
| LC3 / LE Audio streaming                         | ❌ uses whatever codec the OS BT stack picks  |
| Privacy: nothing leaves the device               | ✅ no network calls of any kind               |

The two ❌s are exactly what the native app in the spec fixes: a CoreAudio /
Oboe build can hit sub-15 ms and talk LC3 directly to LE Audio aids. The web
demo is here so you can feel the product loop before any of that ships.

## Known quirks

- **iOS Safari mute switch:** if the AudioContext was created while the
  switch is set to silent, output may stay silent. Toggle the switch and tap
  Start again.
- **iPhone speaker feedback:** if you forget to pair headphones first,
  Roomtone will howl. Stop, pair, start again.
- **Background tab:** mobile Safari throttles AudioContext when the tab is
  background. Keep the screen on while testing.
- **Detection latency:** ~1.4 s worst case (two 700 ms windows). Tunable but
  set conservatively to avoid jitter.
- **No real RT60 estimate**, so "Reverberant" is detected less reliably than
  the others — clap a few times in a bathroom and it'll catch up.

## Classifier test app (`test.html`)

A separate page for tuning the scene classifier without the EQ in the way.
Shows the winning scene + confidence, all 6 per-scene scores as bars, the
live spectrum, and every feature value (RMS, centroid, flatness, ZCR, band
ratios, peak) updating in real time.

The useful part: tap a **ground-truth** chip (what room you're actually in),
hit **● Record samples**, walk around the real environment for 30–60 seconds,
then **Export JSON**. You get a file with timestamped features, classifier
scores, and your ground-truth tags. Paste it back to me and I'll re-tune the
rules in `index.html`'s `classify()` against real data instead of my guesses.

Same install, same URL — link is in the main app's footer, or hit
`apps/roomtone/test.html` directly.

## File layout

```
apps/roomtone/
├── index.html             ← the whole app, self-contained
├── test.html              ← classifier diagnostics + ground-truth recorder
├── manifest.webmanifest   ← PWA manifest
├── sw.js                  ← offline-shell service worker
├── icons/                 ← home-screen icons + iOS splashes
└── README.md              ← this file
```

If you want to fork the look-and-feel into the real iOS app later, the
classifier rules and the per-scene EQ presets in `index.html` (`SCENES`
object) are the bits worth keeping.
