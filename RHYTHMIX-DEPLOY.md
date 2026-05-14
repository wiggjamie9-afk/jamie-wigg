# RHYTHMIX — End-to-End Deployment

Everything you need to take this codebase from `git clone` to a live, working app on the App Store + Play Store with real music generation, real payments, and real push notifications.

> **TL;DR for the impatient.** A Codespace is pre-configured (`.devcontainer/`). Open one, then:
> ```bash
> make install              # one-time
> make link REF=xxxx        # connect to your Supabase project
> make deploy               # db push + functions deploy
> make secrets              # set REPLICATE / STRIPE / RC keys from .env
> make eas-init             # mint EAS projectId
> make ship                 # type-check + deploy + build mobile
> ```
> Run `make help` to see every target.
>
> **No CLI at all?** Use `supabase/bundle.sql` — paste the whole file into the Supabase Dashboard's SQL Editor and click Run. Then add Edge Functions one at a time from the dashboard.

## What you're deploying

```
                                   ┌──────────────────────────────┐
   ┌──── iPhone ────┐               │  Supabase (db + auth +       │
   │ rhythmix-      │ HTTPS         │     storage + edge functions)│
   │   mobile app   │──────────────▶│                              │
   └────────────────┘               │  ┌─ /generate ───────┐       │
                                    │  │  /generate-status │──┐    │
   ┌──── Android ───┐               │  │  /stripe-intent   │  │    │
   │ rhythmix-      │ HTTPS         │  │  /stripe-webhook  │  │    │
   │   mobile app   │──────────────▶│  │  /revenuecat-     │  │    │
   └────────────────┘               │  │     webhook       │  │    │
                                    │  │  /notify          │  │    │
                                    │  └───────────────────┘  │    │
                                    │           │             │    │
                                    │   tracks, profiles,     │    │
                                    │   payments, jobs        │    │
                                    └───────────│─────────────│────┘
                                                │             │
                                ┌───────────────▼───┐   ┌─────▼──────┐
                                │   Replicate API   │   │   Stripe   │
                                │ (MusicGen Stereo) │   │            │
                                └───────────────────┘   └────────────┘
                                                                │
                                                        ┌───────▼──────┐
                                                        │  RevenueCat  │
                                                        │  (iOS IAP)   │
                                                        └──────────────┘
```

Everything in this repo is real, runnable code. The third-party services need real accounts.

## One-time accounts you need

| Service | Cost | What it gives you |
|---|---|---|
| **Supabase** | Free tier ok | Database, auth, storage, Edge Functions hosting |
| **Replicate** | $0.0023 / s of audio (~$0.07 for a 30s track) | Music generation via MusicGen Stereo |
| **Stripe** | Free, 2.9% + 30¢ per txn | Android + web payments |
| **RevenueCat** | Free under $2.5k MTR | iOS in-app purchases |
| **Apple Developer** | $99/year | App Store distribution + TestFlight |
| **Google Play Console** | $25 one-time | Play Store distribution |
| **Expo** | Free tier ok | EAS Build (cloud iOS + Android builds), EAS Update (OTA) |

## 1 · Spin up Supabase

```bash
# install once
npm i -g supabase

# clone the project locally
supabase init                              # only if config.toml missing — already in repo
supabase link --project-ref YOUR_REF       # from Supabase dashboard

# apply schema, RLS, storage policies, triggers
supabase db push

# deploy all Edge Functions
supabase functions deploy generate
supabase functions deploy generate-status
supabase functions deploy stripe-intent
supabase functions deploy stripe-webhook
supabase functions deploy revenuecat-webhook
supabase functions deploy notify
```

Then set Edge Function secrets:

```bash
supabase secrets set \
  REPLICATE_API_TOKEN=r8_… \
  STRIPE_SECRET_KEY=sk_live_… \
  STRIPE_WEBHOOK_SECRET=whsec_… \
  REVENUECAT_WEBHOOK_AUTH="long-random-string" \
  REVENUECAT_ENTITLEMENT=lifetime \
  NOTIFY_INTERNAL_SECRET="another-long-random-string"
```

**Enable Apple + Google providers** in Supabase Dashboard → Authentication → Providers. Set the `client_id` to match what you registered with each platform.

## 2 · Wire third-party webhooks

**Stripe → Supabase**
- Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://<your-project>.supabase.co/functions/v1/stripe-webhook`
- Events: `payment_intent.succeeded`, `charge.refunded`
- Copy the signing secret → `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_…`

**RevenueCat → Supabase**
- Dashboard → Project Settings → Integrations → Webhooks
- URL: `https://<your-project>.supabase.co/functions/v1/revenuecat-webhook`
- Authorization header: same string you set as `REVENUECAT_WEBHOOK_AUTH`
- Create a "lifetime" entitlement, attach your `rhythmix_lifetime_149` product to it

## 3 · Configure the mobile app

```bash
cd rhythmix-mobile
cp .env.example .env
```

Fill in `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ…

EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=…apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=…apps.googleusercontent.com

EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_…
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_…
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_…

# Optional — defaults to ${SUPABASE_URL}/functions/v1
EXPO_PUBLIC_GENERATION_URL=
EXPO_PUBLIC_STRIPE_INTENT_URL=
```

Update `app.json`:
- Replace `REPLACE_WITH_EAS_PROJECT_ID` with the value from `eas init`
- Replace `REPLACE_ME` in the `googleSignin` plugin's `iosUrlScheme` with the reversed iOS OAuth client ID

Update `.well-known/`:
- `apple-app-site-association` → replace `REPLACE_WITH_APPLE_TEAM_ID`
- `assetlinks.json` → replace `REPLACE_WITH_SHA256_FROM_EAS_BUILD` (get it from `eas credentials`)
- Both files must be served from `https://rhythmix.app/.well-known/` with `Content-Type: application/json` and no auth

## 4 · Build + ship

```bash
cd rhythmix-mobile
npx eas-cli login
npx eas-cli init                                    # mints projectId, patches app.json
npx eas-cli build --profile development --platform ios     # ~15 min, install via TestFlight or EAS link
npx eas-cli build --profile development --platform android # ~10 min, sideload the apk
```

To ship to stores:

```bash
npx eas-cli build --profile production --platform all
npx eas-cli submit --profile production --platform all
```

## 5 · OTA updates (after first store release)

```bash
cd rhythmix-mobile
npx eas-cli update --branch production --message "fix waveform jank on iPhone 12"
```

Users get the update on next cold launch — `lib/updates.ts` checks `Updates.checkForUpdateAsync()` automatically.

## 6 · Verifying everything works

```bash
# Tail Edge Function logs in one terminal
supabase functions logs generate --tail

# Generate a track from the app — you should see:
#   POST /generate → 200 { jobId, ... }
#   GET  /generate-status/<jobId> → 200 (polled every 2s)
#   on success the audio appears in Storage → user-audio/<user_id>/<track_id>.mp3
#   and a new row in `tracks`

# Try a $149 unlock from the app:
#   iOS  → RevenueCat sandbox sheet → webhook flips profiles.lifetime_unlocked
#   Android → Stripe PaymentSheet test card → webhook flips profiles.lifetime_unlocked
```

## File map

```
supabase/
  config.toml                            project config + auth + function settings
  migrations/
    20260514000001_init_schema.sql       profiles, tracks, likes, payments, jobs
    20260514000002_rls_policies.sql      default-deny RLS
    20260514000003_storage.sql           user-audio + artwork + avatars buckets
    20260514000004_functions_triggers.sql auto-profile on signup, counters, etc
  functions/
    _shared/cors.ts                      CORS + JSON helpers
    _shared/supabase.ts                  userClient(req) + serviceClient()
    _shared/replicate.ts                 Replicate API wrapper
    generate/index.ts                    POST /generate
    generate-status/index.ts             GET /generate-status/:id
    stripe-intent/index.ts               POST /stripe-intent
    stripe-webhook/index.ts              Stripe events → entitlements
    revenuecat-webhook/index.ts          RevenueCat events → entitlements
    notify/index.ts                      Server-side Expo push trigger
    deno.json                            Deno project config

.well-known/
  apple-app-site-association             Universal Links (iOS)
  assetlinks.json                        App Links (Android)

track.html                               Web preview for shared track links

rhythmix-mobile/                         Expo app (separate README inside)
```

## Cost model at scale

For each 30-second generated track:
- Replicate: ~$0.07 (MusicGen Stereo Large)
- Supabase Storage egress: ~$0.0001 per play (50% off CDN-cached)
- Stripe / RevenueCat: only on lifetime unlock (2.9% + 30¢ or 30% Apple Tax)

If a user generates 10 tracks/day and listens to each 5 times:
- Generation: $0.70/day = $21/month
- Storage egress: $0.005/day = $0.15/month
- $149 lifetime breaks even after **~7 months** of heavy use, profitable beyond.

Plan accordingly: rate-limit free users at the Edge Function (add a `generations_today` check against `generation_jobs` count for the day) and/or gate generation on `profiles.lifetime_unlocked = true`.

## Where to go next

- **Background generation jobs**: trigger a `pg_cron` task to push the result via `/notify` when ready — users don't have to keep the app open.
- **Web app**: the same Supabase backend + Expo Router (`expo start --web`) gives you a working web client for free.
- **Stems export**: extend the generation function to call MusicGen's `multi-band-diffusion` variant and store separate stems.
- **Discover feed**: add a `discover` view backed by `tracks where is_public = true order by like_count desc` — RLS already permits this.
- **Collaboration**: a `track_collaborators` table + a `tracks: collaborator read` policy unlocks shared editing.
