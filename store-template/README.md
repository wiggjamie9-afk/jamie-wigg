# Store Template — productionizing a "Pro" AI app

A reusable pattern for taking one of the repo's **"Pro" AI apps** (CodeMentor,
StoryStudio, BookReader Pro, MathTutor Pro, MeetingMind, SmartGrocery,
SpellingBuddy, StudyMate, LanguageLens, VoiceJournal — and, once their headline
features are real, NutriAI + FitCoach Pro) from a **browser prototype with a
pasted API key** to something **submittable to the App Store / Play Store**.

The worked example here is **CodeMentor**. Everything in `app/` is a clone of
`apps/codementor.html` with the three store-blocking gaps fixed.

## The three gaps every Pro app has (and how this fixes them)

| Gap | Before | After (this template) |
|---|---|---|
| **Exposed API key** | Calls `api.anthropic.com` from the browser with a user-pasted `sk-ant` key + `anthropic-dangerous-direct-browser-access`. Disqualifying for both stores. | `worker/` — a Cloudflare Worker holds the key as a **server-side secret** and proxies the call. The browser sends **no key**. |
| **Not installable** | Loose `.html`, no manifest/SW/icons (the `apps/manifest.webmanifest` belongs to the Buddy System, not these apps). | `app/manifest.webmanifest` + `app/sw.js` + real PNG icons in `app/icons/`. Installable, offline-capable PWA. |
| **No native package** | Nothing to upload to either store. | `capacitor.config.ts` + `package.json` wrap `app/` into real iOS/Android projects (same pattern as `recovery-ios/`). |

> Bonus: this copy also fixes **pre-existing JS syntax bugs** in `codementor.html`
> (unescaped apostrophes in single-quoted strings like `'Let's…'`, `'didn't…'`)
> that actually break the original app's entire script. Worth grepping the other
> Pro apps for the same `'[a-z]'[a-z]` pattern.

## Layout

```
store-template/
├── app/                      # the productionized PWA (deploy this)
│   ├── index.html            # CodeMentor, rewired to the proxy
│   ├── manifest.webmanifest
│   ├── sw.js                 # offline shell; never caches the AI call
│   └── icons/                # real 192 / 512 / maskable-512 PNGs
├── worker/                   # the backend (deploy this)
│   ├── src/index.ts          # Anthropic proxy, key held server-side
│   └── wrangler.toml
├── scripts/gen-icons.mjs     # dependency-free PNG icon generator
├── capacitor.config.ts       # native wrapper config
└── package.json              # wrapper + dev scripts
```

## Deploy in 4 steps

### 1. Deploy the backend (key never touches the browser)
```bash
cd store-template/worker
npm install
wrangler login
wrangler secret put ANTHROPIC_API_KEY      # paste your sk-ant-... key
wrangler deploy
# → note the URL, e.g. https://claude-proxy.<account>.workers.dev
```

### 2. Point the app at it
In `app/index.html`, set:
```js
const CLAUDE_PROXY = 'https://claude-proxy.<account>.workers.dev/v1/messages';
```
`PROXY_ENABLED` flips to `true` automatically once it's not the placeholder, and
the app stops asking for a key. (Locally, leave the placeholder and paste a dev
key in Settings to test against `api.anthropic.com` directly.)

### 3. Test the PWA locally
```bash
cd store-template
npm run serve          # http://127.0.0.1:8000  (manifest + SW need http, not file://)
```
Confirm: it installs, the icon shows, and a code review streams a response.

### 4. Wrap for the stores
```bash
cd store-template
npm install
npm run add:ios        # generates ios/  (needs macOS + Xcode)
npm run add:android    # generates android/
npm run sync
npm run open:ios       # archive → App Store Connect
npm run open:android   # build AAB → Play Console
```

## Still required before you hit "Submit" (per store)

These are policy/paperwork, not code — same for every app:

- **Privacy policy URL** (adapt root `privacy.html`). Declare: code/prompts are sent
  to the AI provider for processing; nothing is stored on our servers.
- **Apple:** Apple Developer account ($99/yr), App Store Connect record,
  1024×1024 icon, screenshots, privacy nutrition labels (data: "User Content →
  app functionality"), age rating.
- **Google:** Play Developer account ($25 one-time), Data Safety form, feature
  graphic, screenshots, content rating, signed AAB.
- **Add a usage cap** to the Worker (per-IP rate limit is in place; consider a
  daily ceiling or a license check — see `studio/workers/license/` for that
  pattern) so a leaked app build can't run up your Anthropic bill.

## Replicating to the other Pro apps

For each app: copy its `apps/<name>.html` into a new `app/index.html`, run the
same three edits (proxy const + `askClaude` rewire + flip the key gates to an
`aiReady()` check), regenerate icons (`node scripts/gen-icons.mjs` after tweaking
`BRAND`/`GLYPH`), set the manifest name + `capacitor.config.ts` `appId`, and reuse
the **same Worker** (it's app-agnostic). The two mixed apps (NutriAI meal-scan,
FitCoach form-check) additionally need their faked feature replaced with a real
multimodal call before they're honest enough to ship.
