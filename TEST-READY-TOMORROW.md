# 🚀 App Test Ready — Tomorrow Morning

**Prepared:** June 6, 2026  
**Status:** ✅ All installations complete. Ready for testing.

---

## Environment Summary

| Component | Status | Version | Location |
|-----------|--------|---------|----------|
| **Node.js** | ✅ Ready | v22.22.2 | Global |
| **npm** | ✅ Ready | 10.9.7 | Global |
| **pnpm** | ✅ Ready | 10.33.0 | Global |
| **Root dependencies** | ✅ Installed | 181 packages | `/home/user/jamie-wigg` |
| **Studio (Next.js 15)** | ✅ Built + Ready | 0 errors | `studio/out/` |
| **Recovery PWA** | ✅ Static HTML | Ready as-is | `recovery/index.html` |
| **HerdCheck PWA** | ✅ Static HTML | Ready as-is | `livestock/index.html` |

---

## 🎯 Testable Apps (Ready Now)

### 1. **STARLIGHTMIX Studio** (Next.js 15 Web App)
- **Location:** `studio/`
- **Build output:** `studio/out/` (1.2 MB, static export)
- **Dev server:** `pnpm dev` (runs on http://localhost:3000)
- **Production build:** ✅ **Complete** — ready to test
- **Pages available:**
  - `/` — Home/landing
  - `/new` — Create new project
  - `/library` — View saved projects
  - `/plan/[id]` — Plan view
  - `/render/[id]` — Render view
  - `/settings` — Settings page

**Test commands:**
```bash
cd studio
pnpm dev              # Local dev server
pnpm build            # Re-build (already done)
pnpm test             # Run Vitest tests
pnpm test:coverage    # Coverage report
```

---

### 2. **Recovery App** (iOS-style PWA)
- **Location:** `recovery/index.html`
- **Type:** Static HTML PWA (no build needed)
- **Features:** Offline-capable, team sport recovery tracking
- **Test:** Open directly in browser or use `python3 -m http.server`

```bash
cd recovery
python3 -m http.server 8000  # Serve on http://localhost:8000
# Then visit http://localhost:8000/
```

---

### 3. **HerdCheck** (Livestock Screening PWA)
- **Location:** `livestock/index.html`
- **Type:** Static HTML PWA (no build needed)
- **Features:** Offline-capable, livestock health screening (lameness, mastitis, calving)
- **Supported species:** cattle (283d), buffalo (310d), sheep (147d), goat (150d)

```bash
cd livestock
python3 -m http.server 8001  # Serve on http://localhost:8001
# Then visit http://localhost:8001/
```

---

## 🔧 Optional Setup (API Keys)

The following features require your API credentials. Add them to `.env` or `.claude/settings.local.json` tomorrow if needed:

### Creativegen Tools (for video/image generation)
**.env file:**
```env
HIGGSFIELD_API_KEY=your-key-here          # Soul text-to-image, DOP image-to-video
HIGGSFIELD_SECRET=your-secret-here        # From https://platform.higgsfield.ai
CONTEXT7_API_KEY=your-key-here            # Library documentation (optional)
```

**.claude/settings.local.json:**
```json
{
  "env": {
    "REPLICATE_API_TOKEN": "r8_YOUR_TOKEN",       // Image/video/music generation
    "ELEVENLABS_API_KEY": "sk_YOUR_KEY",          // Text-to-speech
    "CREATIVE_OUT_DIR": "./creative-out"
  }
}
```

---

## 📋 What's Installed & Ready

✅ **Root dependencies** — 181 packages  
✅ **Studio build chain** — Next.js, React 19, TypeScript, Tailwind v4, Vitest  
✅ **MCP servers** — Registered in `.mcp.json` (Replicate, ElevenLabs, Higgsfield, Pollinations, Playwright)  
✅ **Git hooks** — Session-start health check (`.claude/hooks/session-start.sh`)  
✅ **.claude configuration** — Settings, skills, agents, MCP setup  
✅ **.env template** — Ready for your API keys  
✅ **Environment variables** — `.claude/settings.local.json` created  

---

## 🧪 Test Scenarios (Tomorrow)

### Scenario 1: Test Studio Web App Locally
```bash
cd studio
pnpm dev
# Opens http://localhost:3000
# Test: Home → New → Library → Settings pages
# Test: Project creation, file upload, theme selection
```

### Scenario 2: Test Studio Production Build
```bash
cd studio
# Build already complete in studio/out/
# Serve locally to test static export:
python3 -m http.server 8080 --bind 127.0.0.1 --directory out
# Visit http://localhost:8080
```

### Scenario 3: Test Recovery PWA
```bash
cd recovery
python3 -m http.server 8000 --bind 127.0.0.1
# Visit http://localhost:8000/
# Test: Offline capability, recovery tracking UI
```

### Scenario 4: Test HerdCheck PWA
```bash
cd livestock
python3 -m http.server 8001 --bind 127.0.0.1
# Visit http://localhost:8001/
# Test: Lameness scoring, mastitis detection, calving predictor
# Test: Multi-language support (i18n)
```

### Scenario 5: Run Studio Tests
```bash
cd studio
pnpm test              # Run all tests
pnpm test:coverage     # Coverage report
```

---

## 🎬 Video/Creative Pipeline (Bonus — Ready to Use)

**HyperFrames video projects:** 50+ promo templates pre-installed  
**Example canonical reference:** `rhythmix-overview-60s/`

To preview/render a video:
```bash
cd rhythmix-overview-60s
npx --yes hyperframes@0.4.42 preview   # Browser preview
npx --yes hyperframes@0.4.42 render    # Render to MP4 (needs ffmpeg)
```

---

## 🚨 Known Notes

- **Studio lint:** Interactive ESLint setup dialog on first run — press `Ctrl+C` or select "Strict" mode and rerun.
- **ffmpeg:** Needed for HyperFrames video renders. Install with `brew install ffmpeg` (Mac) or `apt install ffmpeg` (Linux).
- **Localhost ports:** Use different ports if 3000, 8000, 8001, 8080 are in use (e.g., `--port 9000`).

---

## ✨ Quick Reference

| Task | Command | Location |
|------|---------|----------|
| **Start Studio dev** | `pnpm dev` | `studio/` |
| **Build Studio** | `pnpm build` | `studio/` |
| **Test Studio** | `pnpm test` | `studio/` |
| **Serve Recovery** | `python3 -m http.server 8000` | `recovery/` |
| **Serve HerdCheck** | `python3 -m http.server 8001` | `livestock/` |
| **View HyperFrames** | `npx hyperframes@0.4.42 preview` | `rhythmix-*-*/` |

---

## 📝 Next Steps (Tomorrow AM)

1. ✅ Open Studio on http://localhost:3000 — test home/new/library/settings
2. ✅ Run `pnpm test` in studio — verify tests pass
3. ✅ Test Recovery and HerdCheck PWAs locally
4. ✅ If testing video pipeline: add `REPLICATE_API_TOKEN` + `ELEVENLABS_API_KEY` to `.claude/settings.local.json`
5. ✅ If testing Higgsfield (AI generative): add credentials to `.env`

---

**Everything is ready. Enjoy testing! 🎉**
