# Avatar Studio — Higgsfield talking-head buddies

The Buddy System can give every buddy a **photoreal AI face** (Higgsfield **Soul**) and then
**bring it to life as a talking head** (Higgsfield **DOP** / Speech-to-Video, lip-synced to the
ElevenLabs voice).

## Why a proxy?

Two hard constraints:

1. Your **Higgsfield secret must never live in the browser** — anyone could read it. So the secret
   stays in a tiny local proxy that the app calls.
2. Higgsfield blocks cross-origin browser calls (CORS). The proxy also fixes that.

The proxy runs on **your Mac**, next to the app. Nothing is sent anywhere except Higgsfield.

## One-time setup (on your Mac)

```bash
cd jamie-wigg/apps

# 1. Install the proxy's dependencies
cp avatar-proxy-package.json package.json   # only if you don't already have one here
npm install express cors dotenv

# 2. Put your Higgsfield credentials in jamie-wigg/.env (repo root)
#    HIGGSFIELD_API_KEY=...   (already set)
#    HIGGSFIELD_SECRET=...    (already set)

# 3. Start the proxy
node avatar-proxy-local.mjs
```

You should see `✓ Ready to generate avatars!` and it listening on `http://localhost:3001`.

Then start the app server (separate terminal tab) as usual:

```bash
cd jamie-wigg
python3 -m http.server 8000
```

## Using it

1. On your phone/computer open the Buddy System and pick a buddy.
2. Go to **Settings → Avatar Studio**.
3. (Optional) tweak the description, or leave it — each buddy has a curated, on-brand look.
4. Tap **✨ Generate face** → a photoreal portrait appears (Higgsfield Soul).
5. Tap **🎬 Bring to life (talking head)** → the face is animated (Higgsfield DOP). It loops in the
   buddy's header and plays when the buddy speaks.

The generated face/video URLs are saved per buddy in your browser (`localStorage`) — they persist
between sessions and show on the hub cards too.

> Testing on your phone? The phone must reach the proxy. Either run the proxy where the phone can
> see it and set **Settings → Proxy URL** to `http://<your-mac-ip>:3001`, or generate on the Mac
> first (the saved URL syncs once you reload with the same browser profile).

## Endpoints the app calls

| Endpoint | Purpose |
|---|---|
| `POST /api/higgsfield-generate` | Soul text-to-image → still portrait |
| `POST /api/higgsfield-animate`  | DOP image-to-video → talking head (pass `audioUrl` for lip-synced Speech-to-Video) |
| `GET  /health` | Check the proxy + credentials are live |

## Honest notes

- The exact Higgsfield request/response fields in `avatar-proxy-local.mjs` follow Higgsfield's
  documented Soul/DOP shape. If Higgsfield changes their API, update the two `fetch` bodies in that
  file — the app side won't need changes.
- If generation fails, the app falls back gracefully: **talking head → still face → emoji**, so a
  buddy is never broken.
- Video generation (talking head) is slower than a still — give it up to a couple of minutes.
