# Test Coverage Analysis — STARLIGHTMIX Studio (`studio/`)

**Date**: June 2026  
**Scope**: Next.js 15 web app (static export at `studio/out/`)  
**Branch**: `claude/test-coverage-analysis-x4or15`

---

## Executive Summary

The codebase has **5 test files** covering ~500 lines of critical business logic (secrets, history, render orchestration) but **~11,000 lines of untested code** across utilities, components, and pages. The 4.3% test-to-code ratio is low, but the existing tests are rigorous and exercise edge cases well. This analysis identifies high-impact areas where tests would reduce risk most effectively.

### Current State

| Category | Lines | Tested | % |
|----------|-------|--------|---|
| `lib/*.ts` | 3,781 | ~600 | 15.8% |
| `components/**/*.tsx` | 8,231 | 0 | 0% |
| `app/**/*.tsx` | 299 | 0 | 0% |
| **Total** | **12,311** | **~600** | **4.9%** |

---

## Existing Test Coverage

### High-Quality Tests (4 files)

#### 1. `lib/secrets.test.ts` (245 lines, 10 test suites)
**Coverage**: Full — 100% of secrets.ts  
**Quality**: Excellent. Tests:
- ✅ Encryption/decryption round-trips with correct/wrong passphrases
- ✅ Empty input validation
- ✅ Session cache behavior (unlock/lock/replace)
- ✅ Ciphertext randomness (salt/IV uniqueness)
- ✅ SSR safety (window undefined handling)
- ✅ Malformed payload resilience

**Why this works**: User tokens are high-value secrets; cryptographic code must be bulletproof.

#### 2. `lib/history.test.ts` (381 lines, 6 test suites)
**Coverage**: Full — 100% of history.ts  
**Quality**: Excellent. Tests:
- ✅ IndexedDB CRUD (put/get/list/delete)
- ✅ 50-entry cap eviction with callback
- ✅ Newest-first ordering
- ✅ SSR safety (IndexedDB undefined handling)
- ✅ Blob persistence and retrieval
- ✅ Eviction toast behavior (no spam, proper cleanup)

**Why this works**: Render history is user-visible and subject to quota limits; eviction logic is non-obvious.

#### 3. `lib/render-runner.test.ts` (376 lines, 5 test suites)
**Coverage**: ~85% of render-runner.ts (the happy path and critical failures)  
**Quality**: Very good. Tests:
- ✅ Scene queueing → generating → downloaded → composed progression
- ✅ Attempt counter increments per retry
- ✅ Partial failure (1 scene fails, others succeed)
- ✅ 3-retry exhaustion per scene
- ✅ Abort signal handling (AbortError stops events)
- ✅ **Token sanitization**: Replicate token never leaks into event JSON even if error body echoes it

**Why this works**: Render orchestration is the most complex flow; token leakage is a security issue.

#### 4. `components/fallback-screens/__tests__/` (2 files, 6 test suites)
**Coverage**: ~70% of fallback screens  
**Quality**: Good. Tests:
- ✅ `capability-detect.test.ts`: Feature detection (WebCrypto, FFmpeg, IndexedDB, AudioContext)
- ✅ `tab-coordinator.test.ts`: Multi-tab storage event coordination

---

## Coverage Gaps (High Priority)

### 1. **Plan Storage & Editing** (~530 lines, 0% tested)

**Files**:
- `lib/plan-storage.ts` (228 lines)
- `components/plan-editor/plan-editor.tsx` (504 lines)
- `components/plan-editor/scene-row.tsx` (179 lines)
- `components/plan-editor/cost-summary.tsx` (92 lines)

**Risk**: The plan editor is the core creation UX. Bugs here break the entire workflow.

**What to test**:
- Plan CRUD (create, load, update, delete)
- Plan list ordering (most-recent-updated-first)
- Scene addition/removal/reordering
- Duration snapping to beats (given BPM)
- Model selection validation (against registry)
- localStorage quota handling (save failure → error)
- Plan export as JSON blob
- Stale model detection (loaded plan has unknown model)

**Test file**: `studio/lib/plan-storage.test.ts` (100–150 lines, ~15 test cases)

---

### 2. **Audio Upload & Validation** (~380 lines, 0% tested)

**Files**:
- `lib/audio-blob.ts` (133 lines)
- `components/upload-form/upload-form.tsx` (257 lines)
- `components/upload-form/waveform-canvas.tsx` (143 lines)

**Risk**: Audio validation guards against crashes from oversized or malformed files.

**What to test**:
- `validateAudioFile()`: empty file, oversized (>50MB), unsupported MIME types
- File extension fallback (iOS Safari edge case where `.type` is empty)
- Audio blob storage in IndexedDB
- Audio blob retrieval by plan ID
- Waveform canvas rendering (canvas element exists, has correct width)
- Waveform peak calculation from audio data
- Storage quota handling (IndexedDB full)

**Test file**: `studio/lib/audio-blob.test.ts` (80–120 lines) + `components/upload-form/__tests__/upload-form.test.tsx` (60–80 lines)

---

### 3. **Render Progress & Status Tracking** (~860 lines, 0% tested)

**Files**:
- `components/render-progress/render-progress.tsx` (717 lines)
- `components/render-progress/scenes-table.tsx` (142 lines)
- `components/render-progress/scene-status-pill.tsx` (122 lines)
- `components/render-progress/compose-bar.tsx` (53 lines)

**Risk**: Progress UI is the primary user feedback mechanism during long-running renders. Incorrect state transitions confuse users or hide errors.

**What to test**:
- Render state machine: queued → generating → (downloaded | failed) → (composed | placeholder)
- Retry count display per scene (1, 2, 3)
- Total progress percent calculation (generated / total scenes)
- Compose progress percent (partial MP4 assembly)
- Error message display for failed scenes
- Download speed estimation (bytes/sec)
- Estimated time remaining calculation
- Abort button behavior (signal propagation)

**Test file**: `components/render-progress/__tests__/render-progress.test.tsx` (120–150 lines)

---

### 4. **Settings & License Management** (~625 lines, 0% tested)

**Files**:
- `components/settings/license-panel.tsx` (322 lines)
- `components/settings/replicate-token-panel.tsx` (366 lines)
- `components/settings/clear-all-panel.tsx` (187 lines)
- `components/settings/support-bundle-panel.tsx` (87 lines)
- `lib/support-bundle.ts` (221 lines)

**Risk**: Incorrect token management leaks credentials; clearing data without confirmation causes data loss.

**What to test**:
- Token submission & validation (fetch to license endpoint)
- License status display (valid, expired, invalid)
- Passphrase prompt on token change
- Clear-all confirmation modal & destructive action
- Support bundle generation (JSON with sanitized logs)
- localStorage & IndexedDB wiping
- Settings panel UI state (loading, error, success)

**Test file**: `components/settings/__tests__/license-panel.test.tsx` (60–80 lines) + `lib/support-bundle.test.ts` (80–120 lines)

---

### 5. **Library (History) Grid & Export** (~630 lines, 0% tested)

**Files**:
- `components/library-grid/library-grid.tsx` (166 lines)
- `components/library-grid/library-card.tsx` (188 lines)
- `components/library-grid/confirm-delete-dialog.tsx` (140 lines)
- `components/library-grid/eviction-toast.tsx` (140 lines)
- `components/video-exporter/video-exporter.tsx` (255 lines)

**Risk**: Incorrect render deletion, failed downloads, or export bugs prevent users from saving their work.

**What to test**:
- Render card display (theme, date, scene count, duration)
- Most-recent-first ordering
- Delete confirmation & state update
- Download trigger & fetch interception
- MP4 blob-to-file download
- Thumbnail blob-to-file download
- Eviction toast display (when 51st render pushes out oldest)
- Export formats (MP4, WebM, MOV if available)

**Test file**: `components/library-grid/__tests__/library-grid.test.tsx` (100–140 lines)

---

### 6. **Core Utilities** (~470 lines, 0% tested)

**Files**:
- `lib/clear-all.ts` (168 lines)
- `lib/llm-studio.ts` (256 lines)
- `lib/capability-detect.ts` (128 lines) — *Has component-level tests; lib-level tests missing*
- `lib/tab-coordinator.ts` (130 lines) — *Has component-level tests; lib-level tests missing*

**Risk**: Capability detection failures silently gate features; clear-all bugs leave partial state.

**What to test**:
- `clearAllData()`: wipes plans, secrets, history, audio, IndexedDB
- `detectCapabilities()`: returns true/false for each feature (FFmpeg, IndexedDB, etc.)
- SSR safety (all graceful when `window`/`crypto`/`indexedDB` undefined)
- LLM-Studio endpoint integration (fetch error handling)

**Test file**: `studio/lib/core-utils.test.ts` (100–150 lines)

---

### 7. **App Pages & Routing** (~299 lines, 0% tested)

**Files**:
- `app/page.tsx` (12 lines)
- `app/new/page.tsx` (27 lines)
- `app/plan/[id]/page.tsx` (36 lines)
- `app/render/[id]/page.tsx` (38 lines)
- `app/library/page.tsx` (28 lines)
- `app/settings/page.tsx` (42 lines)
- `app/unsupported/page.tsx` (82 lines)
- `app/layout.tsx` (34 lines)

**Risk**: Low — most pages are thin wrappers. Testing via E2E is more effective than unit tests here.

**Recommendation**: Skip detailed unit tests; rely on E2E tests (Playwright or similar) to verify navigation, authentication, and layout.

---

## Risk Assessment Matrix

| Area | Risk | Complexity | Test ROI | Priority |
|------|------|-----------|----------|----------|
| Plan storage & editing | 🔴 High | Medium | Very High | **P1** |
| Render progress UI | 🔴 High | High | High | **P1** |
| Audio validation | 🟡 Medium | Low | Very High | **P2** |
| Settings & license | 🟡 Medium | Medium | High | **P2** |
| Library & export | 🟡 Medium | Medium | High | **P2** |
| Core utilities | 🟡 Medium | Low | Medium | **P3** |
| App pages | 🟢 Low | Low | Low | **P4** (E2E only) |

---

## Implementation Roadmap

### Phase 1 (P1) — Critical Business Logic
**Target**: 40–50% total coverage  
**Effort**: 1–2 weeks

1. `studio/lib/plan-storage.test.ts` (150 lines)
2. `components/plan-editor/__tests__/plan-editor.test.tsx` (100–120 lines)
3. `components/render-progress/__tests__/render-progress.test.tsx` (140 lines)

### Phase 2 (P2) — User-Facing Features
**Target**: 60% total coverage  
**Effort**: 2–3 weeks

4. `studio/lib/audio-blob.test.ts` (100 lines)
5. `components/upload-form/__tests__/upload-form.test.tsx` (80 lines)
6. `components/settings/__tests__/settings.test.tsx` (120 lines)
7. `components/library-grid/__tests__/library-grid.test.tsx` (120 lines)

### Phase 3 (P3) — Utilities & Polish
**Target**: 70% total coverage  
**Effort**: 1–2 weeks

8. `studio/lib/core-utils.test.ts` (140 lines)
9. Integration tests (cross-module workflows)
10. Refine mocks (avoid brittle test data)

### Phase 4 (P4) — E2E & CI
**Target**: Automate critical user journeys  
**Effort**: 2–3 weeks (follow-up task)

- Playwright E2E tests for:
  - Upload audio → Edit plan → Create render → Download MP4
  - Token management → License validation
  - Plan export/import
  - Multi-tab sync (edit in one tab, refresh in another)

---

## Testing Patterns & Best Practices (From Existing Tests)

### 1. **Use jsdom + Vitest for DOM/Storage Tests**
```typescript
// From secrets.test.ts & history.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

beforeEach(() => {
  localStorage.clear(); // Fresh state per test
  // Optionally: reset mocks
});
```

### 2. **Mock External Dependencies (fetch, IndexedDB, FFmpeg)**
```typescript
// From render-runner.test.ts
vi.mock("@ffmpeg/ffmpeg", () => ({ /* ... */ }));
globalThis.fetch = vi.fn(/* handler */);
```

### 3. **Never Leak Secrets into Test Output**
```typescript
// From render-runner.test.ts line 342–374
const serialised = JSON.stringify(events);
expect(serialised).not.toContain(TOKEN);
expect(serialised).not.toMatch(/r8_[A-Za-z0-9_-]{5,}/);
```

### 4. **Test SSR Safety Explicitly**
```typescript
// From secrets.test.ts & history.test.ts
function withoutWindow<T>(body: () => T): T {
  const desc = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { value: undefined, ... });
  try { return body(); } finally { /* restore */ }
}

it("returns null when window is undefined", async () => {
  const res = await withoutWindow(() => getToken(PASS));
  expect(res).toBeNull();
});
```

### 5. **Use Descriptive Test Helpers**
```typescript
// From history.test.ts
function makeMeta(overrides = {}) { /* construct test RenderMeta */ }
function makeBlob(byte) { /* construct small test Blob */ }
```

### 6. **Test Edge Cases, Not Just Happy Path**
```typescript
// From secrets.test.ts
expect(hasStoredToken()).toBe(false); // before any store
expect(hasStoredToken()).toBe(true);  // after setToken
expect(hasStoredToken()).toBe(false); // after clearToken
expect(hasStoredToken()).toBe(false); // for malformed payloads
```

---

## Recommended Test File Structure

```
studio/
├── lib/
│   ├── plan-storage.ts
│   ├── plan-storage.test.ts          ← NEW
│   ├── audio-blob.ts
│   ├── audio-blob.test.ts            ← NEW
│   ├── render-runner.ts
│   ├── render-runner.test.ts          (existing)
│   ├── secrets.ts
│   ├── secrets.test.ts                (existing)
│   ├── history.ts
│   ├── history.test.ts                (existing)
│   ├── core-utils.test.ts             ← NEW (tests capability-detect, tab-coordinator, clear-all, llm-studio)
│   └── ...
├── components/
│   ├── plan-editor/
│   │   ├── __tests__/
│   │   │   └── plan-editor.test.tsx   ← NEW
│   │   ├── plan-editor.tsx
│   │   ├── scene-row.tsx
│   │   └── cost-summary.tsx
│   ├── render-progress/
│   │   ├── __tests__/
│   │   │   └── render-progress.test.tsx ← NEW
│   │   ├── render-progress.tsx
│   │   ├── scenes-table.tsx
│   │   └── ...
│   ├── upload-form/
│   │   ├── __tests__/
│   │   │   └── upload-form.test.tsx  ← NEW
│   │   ├── upload-form.tsx
│   │   └── waveform-canvas.tsx
│   ├── settings/
│   │   ├── __tests__/
│   │   │   └── settings.test.tsx     ← NEW
│   │   ├── license-panel.tsx
│   │   └── ...
│   └── library-grid/
│       ├── __tests__/
│       │   └── library-grid.test.tsx ← NEW
│       ├── library-grid.tsx
│       └── ...
└── vitest.config.ts                  (existing, no change needed)
```

---

## Mocking Strategy (Pre-Recommendations)

### For Component Tests (React + UI)

1. **localStorage / IndexedDB** → Use `vi.mock()` with in-memory maps (as done in history.test.ts)
2. **fetch** → Mock handler that returns test responses
3. **FFmpeg** → Mock via `__setFfmpegLoaderForTest()`
4. **Audio context** → Mock HTMLAudioElement or AudioContext
5. **Canvas (waveform)** → Mock getContext() to return no-op methods

### For Utility Tests

1. **No mocks needed** for pure functions (snapDurationToBeat, defaultModelForRole)
2. **localStorage** → Clear before/after each test
3. **IndexedDB** → Mock the idb module (pattern already exists)
4. **fetch** → Mock for LLM-Studio endpoint calls

---

## Measurement & Success Criteria

### Phase 1 Completion (2 weeks)
- [ ] `plan-storage.test.ts` (15+ test cases, 100% coverage of plan-storage.ts)
- [ ] `plan-editor.test.tsx` (10+ test cases, >80% coverage)
- [ ] `render-progress.test.tsx` (10+ test cases, >80% coverage)
- [ ] Overall coverage: **40–50%**

### Phase 2 Completion (4 weeks)
- [ ] Audio blob tests (10+ test cases, 100% coverage)
- [ ] Upload form tests (8+ test cases, >80% coverage)
- [ ] Settings tests (12+ test cases, >80% coverage)
- [ ] Library grid tests (10+ test cases, >80% coverage)
- [ ] Overall coverage: **60%**

### Phase 3 Completion (6 weeks)
- [ ] Core utils tests (15+ test cases, 100% coverage)
- [ ] Integration tests (5+ cross-module workflows)
- [ ] Overall coverage: **70%**

---

## Appendix: Test Coverage by File

### Currently Tested (600 LOC)
- ✅ `lib/secrets.ts` (288 lines) — **100%**
- ✅ `lib/history.ts` (312 lines) — **100%**
- ✅ `lib/render-runner.ts` (683 lines) — **~85%** (happy path + failures, abort signal covered)
- ✅ `components/fallback-screens/capability-detect.ts` (indirectly via component tests)
- ✅ `components/fallback-screens/tab-coordinator.ts` (indirectly via component tests)

### Untested Priority List (11,000+ LOC)

**Tier 1 (P1)**
- `lib/plan-storage.ts` (228 lines)
- `components/plan-editor/plan-editor.tsx` (504 lines)
- `components/render-progress/render-progress.tsx` (717 lines)

**Tier 2 (P2)**
- `lib/audio-blob.ts` (133 lines)
- `components/upload-form/upload-form.tsx` (257 lines)
- `components/settings/license-panel.tsx` (322 lines)
- `components/settings/replicate-token-panel.tsx` (366 lines)
- `components/library-grid/library-grid.tsx` (166 lines)

**Tier 3 (P3)**
- `lib/clear-all.ts` (168 lines)
- `lib/llm-studio.ts` (256 lines)
- `lib/support-bundle.ts` (221 lines)
- Various component dependencies (scene-row, cost-summary, etc.)

---

## Conclusion

**Current state**: ~5% test coverage of a 12k-LOC codebase, but the tests that exist are **high-quality and well-maintained**. The missing tests are in **user-facing features** where bugs are most painful (plan editing, audio upload, rendering progress).

**Recommendation**: Execute Phase 1 & 2 over the next 4–6 weeks. Focus on plan storage and render orchestration first (highest risk + highest ROI). Use existing test patterns (mocking, jsdom, beforeEach cleanup) as templates.

**Maintainability**: Continue the discipline of writing tests alongside features. The existing test suites show a clear pattern: pure functions + storage mutation tests are straightforward; UI state tests benefit from descriptive test helpers and explicit mock setup.

