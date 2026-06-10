# Test Coverage Analysis — RHYTHMIX Repository

## Executive Summary

**Overall coverage: 13.51% statements** | 68.92% branches | 60.2% functions

The codebase has foundational test infrastructure (Vitest configured, 5 test files, 60 tests passing) but critical gaps remain. Only utility libraries and fallback-screen components are tested; all page components, UI components, and cross-cutting concerns lack coverage.

---

## Current State

### ✅ Well-Tested Areas (46–97% statement coverage)

| File | Coverage | Tests | Note |
|---|---|---|---|
| `lib/secrets.ts` | **97.7%** | 24 | Session auth & encryption — comprehensive |
| `lib/history.ts` | **93.79%** | 13 | Render history with eviction — strong |
| `components/fallback-screens/tab-coordinator.ts` | **93.22%** | 6 | Tab messaging protocol |
| `lib/capability-detect.ts` | **84.84%** | 12 | Browser feature detection |
| `lib/render-runner.ts` | **79.07%** | 5 | Core render orchestration (partial) |

**Total test lines: ~1,400 across 5 files**

---

### ❌ Zero-Coverage Areas (0% statement coverage)

#### **App Pages (6 files)**
```
studio/app/page.tsx              — main landing (12 lines)
studio/app/library/page.tsx      — library grid view (28 lines)
studio/app/new/page.tsx          — new plan wizard (27 lines)
studio/app/plan/[id]/page.tsx    — plan editor (36 lines)
studio/app/render/[id]/page.tsx  — render monitor (38 lines)
studio/app/settings/page.tsx     — settings view (42 lines)
```

#### **UI Components (20+ component files)**

**Render Progress** (4 files)
- `compose-bar.tsx` — GSAP composition bar
- `render-progress.tsx` — main render monitor (717 lines!)
- `scene-status-pill.tsx` — status indicator
- `scenes-table.tsx` — render details table

**Plan Editor** (3 files)
- `plan-editor.tsx` — plan state mgmt (504 lines!)
- `scene-row.tsx` — scene editing (179 lines)
- `cost-summary.tsx` — cost calculation (92 lines)

**Library Grid** (4 files)
- `library-grid.tsx` — grid rendering (166 lines)
- `library-card.tsx` — card component (188 lines)
- `confirm-delete-dialog.tsx` — delete flow (140 lines)
- `eviction-toast.tsx` — storage warning (140 lines)

**Upload & Export** (2 files)
- `upload-form.tsx` — audio upload (257 lines)
- `waveform-canvas.tsx` — audio visualization (143 lines)
- `video-exporter.tsx` — MP4 export (255 lines)

**Settings** (4 files)
- `license-panel.tsx` — license validation (87 lines)
- `replicate-token-panel.tsx` — API key input (366 lines)
- `support-bundle-panel.tsx` — support export (322 lines)
- `clear-all-panel.tsx` — reset app (187 lines)

**Fallback Screens** (3 files)
- `capability-gate.tsx` — feature detection UI (95 lines)
- `ffmpeg-load-failed.tsx` — error state (72 lines)
- `replicate-unreachable.tsx` — API down (72 lines)
- `unsupported-capability.tsx` — browser check (82 lines)

#### **Core Libraries (5 files)**
- `lib/llm-studio.ts` — LLM integration (256 lines)
- `lib/plan-storage.ts` — plan persistence (228 lines)
- `lib/clear-all.ts` — reset logic (168 lines)
- `lib/support-bundle.ts` — diagnostics (221 lines)
- `lib/audio-blob.ts` — audio util (133 lines)

#### **Cloudflare Workers (2 files)**
- `workers/license/src/index.ts` — license endpoint (362 lines)
- `workers/replicate-proxy/src/index.ts` — CORS proxy (334 lines)

#### **Other Projects**
- **livestock/** — 0 tests (9 JS files: `app.js`, `db.js`, `vision.js`, `scoring.js`, etc.)
- **recovery/** — 0 tests (1 HTML file)
- **HyperFrames promos** — 0 tests (50+ `index.html` compositions)

---

## Coverage Gaps by Risk Level

### 🔴 High Risk (Core business logic)

1. **`lib/plan-storage.ts`** (228 lines, untested)
   - Handles IndexedDB persistence of music video plans
   - Loss of plan data = data loss + poor UX
   - Needs: CRUD tests, concurrent access, quota scenarios

2. **`lib/llm-studio.ts`** (256 lines, untested)
   - Integration with Step AI Flash (script generation)
   - If broken, user cannot generate scripts
   - Needs: API mock, error handling, streaming response tests

3. **`components/render-progress/render-progress.tsx`** (717 lines, untested)
   - Core render monitoring UI — state machine with 10+ states
   - Complex GSAP animation + error recovery
   - Needs: state transition tests, error recovery, progress updates

4. **`components/plan-editor/plan-editor.tsx`** (504 lines, untested)
   - Plan creation & editing — core user workflow
   - No coverage of scene add/remove/reorder logic
   - Needs: scene mutations, cost recalc, validation tests

5. **Workers (`license/`, `replicate-proxy/`)** (696 lines, untested)
   - Gumroad license validation (payment gate)
   - Replicate API proxy (video generation)
   - Needs: integration tests (mocked Gumroad/Replicate APIs)

### 🟡 Medium Risk (Functional but less critical)

6. **`lib/clear-all.ts`** (168 lines)
   - Destructive reset — must not leak data
   - Tests would prevent accidental partial clears
   - Needs: IndexedDB state snapshot + cleanup verification

7. **`lib/support-bundle.ts`** (221 lines)
   - Diagnostic export — UX/privacy risk if broken
   - Should sanitize sensitive keys
   - Needs: bundle content + sanitization tests

8. **Upload form stack** (257 + 143 = 400 lines)
   - Audio upload validation + waveform rendering
   - Bad validation = bad video output
   - Needs: file validation, waveform correctness, canvas edge cases

9. **Settings panels** (4 files, 962 lines)
   - License validation, token input, clear app
   - UX-critical but lower logic complexity
   - Needs: form submission, validation feedback, error states

10. **Library grid** (4 files, 634 lines)
    - Render history browsing + deletion
    - Nice UX improvement but not blocking
    - Needs: grid rendering, delete confirm, empty states

### 🟢 Low Risk (UI or rarely broken)

11. **Fallback screens** (3 files)
    - Feature detection gates
    - Already well-tested (capability-detect.ts) — just needs UI component coverage
    - Needs: render-only tests (Vitest + @testing-library/react)

12. **livestock/** (9 JS files)
    - Offline-first PWA for livestock screening
    - Simple state machine + localStorage
    - Needs: Jest setup + core domain logic (scoring, vision heuristics)

13. **recovery/** (PWA)
    - Sport recovery app
    - Mostly UI
    - Needs: basic PWA smoke tests

---

## Recommended Priority Queue

### Phase 1 (This Sprint) — High-impact, achievable

**Estimated effort: 3–4 days | Expected coverage gain: +15–20%**

1. **`lib/plan-storage.ts`** — Mock IndexedDB (following `history.test.ts` pattern)
   - CRUD: add, get, update, delete, list
   - Quota scenarios (eviction not needed here)
   - File: `lib/plan-storage.test.ts` (~150 lines)

2. **`components/plan-editor/plan-editor.tsx`** — Render testing
   - Mock `lib/history.ts` (already testable)
   - Scene mutations: add, remove, reorder, update cost
   - Validation feedback
   - File: `components/plan-editor/__tests__/plan-editor.test.tsx` (~200 lines)

3. **Workers** — Integration tests with mocked HTTP
   - Gumroad license flow (valid, expired, invalid key)
   - Replicate proxy passthrough
   - File: `workers/license/__tests__/index.test.ts` + `workers/replicate-proxy/__tests__/index.test.ts` (~250 lines)

### Phase 2 (Following Sprint) — Reduces render regressions

**Estimated effort: 3–4 days | Expected gain: +15%**

4. **`lib/llm-studio.ts`** — Step Flash API mocking
   - Script generation flow
   - Error handling (timeout, API down, invalid response)
   - Streaming response parsing

5. **`components/render-progress/render-progress.tsx`** — State machine testing
   - Transition matrix (idle → queued → rendering → done)
   - Error recovery (retry, abort)
   - Progress event parsing

6. **Upload form** (`upload-form.tsx` + `waveform-canvas.tsx`)
   - File validation (size, format, duration)
   - Canvas waveform correctness (sample averaging)
   - Error feedback

### Phase 3 (If time allows) — Polish

7. **livestock/** — Jest setup + scoring.js tests
8. **Fallback screen UI components** — @testing-library/react render tests
9. **HyperFrames** — Linting (not test-heavy; validate `hyperframes.json` + markup)

---

## Testing Infrastructure Additions

### 1. Mock factories

Create `studio/__tests__/mocks/`:
```
factories.ts     — Plan, Scene, RenderEvent factories
hooks.ts         — useHistory, usePlanStorage hooks mocks
api.ts           — Step Flash, Replicate, Gumroad stubs
```

### 2. Test utilities

`studio/__tests__/utils.ts`:
- `renderWithProviders()` — wrap components with context/providers
- `mockIndexedDB()` — reusable IndexedDB mock (improve on `history.test.ts`)
- `createMockPlan()` — generate valid plan fixtures

### 3. Setup files by domain

```
lib/__tests__/setup.ts             — crypto, IndexedDB, Blob
components/__tests__/setup.ts      — jsdom extensions, @testing-library/react globals
workers/__tests__/setup.ts         — fetch mocking (node-fetch or undici)
```

### 4. E2E smoke tests (optional)

If time permits, add Playwright tests for golden paths:
- New plan → upload audio → edit → render
- Load plan from history → modify → save
- License validation flow

---

## Quick Wins (Effort < 2 hours each)

1. **Add coverage thresholds** to `vitest.config.ts`
   ```ts
   coverage: {
     provider: "v8",
     reporter: ["text", "html", "lcov"],
     all: true,
     include: ["studio/**/*.{ts,tsx}"],
     exclude: ["**/node_modules/**", "**/.next/**", "**/*.test.ts"],
     lines: 50,    // fail if < 50%
     functions: 50,
     branches: 50,
     statements: 50,
   }
   ```

2. **Add `test:watch`** script to `studio/package.json`
   ```json
   "test:watch": "vitest --watch"
   ```

3. **Pre-commit hook** via `.husky/pre-commit`
   ```bash
   pnpm test --run
   ```

4. **CI/CD gate** in `.github/workflows/studio-deploy.yml`
   ```yaml
   - name: Run tests
     run: pnpm test
   ```

---

## Testing Best Practices (Established in this Codebase)

From the existing tests (`history.test.ts`, `render-runner.test.ts`):

✅ **What's working**
- Inline polyfill injection (WebCrypto, IndexedDB) — no global setup file needed
- Module mocking with `vi.mock()` instead of external fake-indexeddb
- Descriptive test names with requirement tags (e.g., "R7, R8 — render history eviction")
- Focused test scope (one responsibility per test)

✅ **Apply to new tests**
- Keep mocks co-located with tests (not in a separate mock dir unless shared)
- Use fixtures/factories for complex objects
- Test error paths as thoroughly as happy paths
- Verify sensitive values (tokens, keys) never leak into logs/events

---

## Summary: Coverage by Numbers

| Metric | Current | Target (Phase 1) | Target (All) |
|---|---|---|---|
| **Statements** | 13.51% | ~28% | 60%+ |
| **Test files** | 5 | 11 | 18+ |
| **Test count** | 60 | ~150 | 300+ |
| **Effort** | ~6 days | +3–4 days | +8–10 days more |

**Next step:** Create `lib/plan-storage.test.ts` (phase 1.1) to establish IndexedDB testing pattern for new contributors.
