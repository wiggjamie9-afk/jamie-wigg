/**
 * Pure-TS plan-storage module — no React, no DOM-specific hooks (just
 * `localStorage`). Owns the persistence layer for plans that the
 * `/plan/[id]` editor edits (R5).
 *
 * Why `localStorage` and not IndexedDB:
 *   - Plans are tiny (a few KB of JSON), comfortably under the 5 MB
 *     localStorage quota.
 *   - We want synchronous reads on first paint so the plan editor can
 *     render without a loading flash. IndexedDB is async-only.
 *   - The audio Blob lives in IndexedDB (see audio-blob.ts) because
 *     Blobs need binary storage; the plan is structured JSON.
 *
 * Keys are `plan-<id>` (durable; survives reloads). A separate
 * `plan-index` list-of-ids key powers cheap `listPlans()` lookups.
 */
import { MODELS, pickModel } from "../../rhythmix-studio/src/core/models.mjs";

export type SceneRole =
  | "intro"
  | "verse"
  | "chorus"
  | "bridge"
  | "outro"
  | string;

export type Aspect = "16:9" | "9:16" | "1:1";

export type Scene = {
  id: string;
  role: SceneRole;
  model: string; // ModelId from core/models.mjs
  startSec: number;
  endSec: number; // beat-snapped if bpm is set
  prompt: string;
};

export type Plan = {
  id: string;
  audioDuration: number;
  theme: string;
  bpm: number | null;
  aspect: Aspect;
  scenes: Scene[];
  createdAt: number;
  updatedAt: number;
};

const PLAN_KEY_PREFIX = "plan-";
const PLAN_INDEX_KEY = "plan-index";

// ----------------- Internals -----------------

function planKey(planId: string): string {
  return `${PLAN_KEY_PREFIX}${planId}`;
}

function readIndex(): string[] {
  try {
    const raw = localStorage.getItem(PLAN_INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeIndex(ids: string[]): void {
  try {
    localStorage.setItem(PLAN_INDEX_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    // quota / private mode — non-fatal; metadata listing degrades but plans still load.
  }
}

// Short random scene ID — distinct namespace from the plan ID so they don't collide.
function generateSceneId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let n = 0n;
  for (const b of bytes) {
    n = (n << 8n) | BigInt(b);
  }
  return "s" + n.toString(36);
}

// ----------------- Public API -----------------

export function savePlan(plan: Plan): void {
  const next = { ...plan, updatedAt: Date.now() };
  try {
    localStorage.setItem(planKey(plan.id), JSON.stringify(next));
  } catch (err) {
    // Surface to caller so it can route to the storage-full fallback (T15).
    throw new Error(
      `plan-storage: could not save plan-${plan.id} to localStorage. ` +
        `Browser may be in private mode or storage may be full. ` +
        `Underlying error: ${(err as Error)?.message ?? err}`,
    );
  }
  const ids = readIndex();
  if (!ids.includes(plan.id)) {
    ids.push(plan.id);
    writeIndex(ids);
  }
}

export function loadPlan(planId: string): Plan | null {
  try {
    const raw = localStorage.getItem(planKey(planId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Plan;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.scenes)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function deletePlan(planId: string): void {
  try {
    localStorage.removeItem(planKey(planId));
  } catch {
    /* ignore */
  }
  const ids = readIndex().filter((id) => id !== planId);
  writeIndex(ids);
}

export function listPlans(): { id: string; updatedAt: number; theme: string }[] {
  const ids = readIndex();
  const out: { id: string; updatedAt: number; theme: string }[] = [];
  for (const id of ids) {
    const p = loadPlan(id);
    if (p) {
      out.push({ id: p.id, updatedAt: p.updatedAt, theme: p.theme });
    }
  }
  // Most-recently-updated first.
  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out;
}

export function exportPlanAsBlob(plan: Plan): Blob {
  // Pretty-printed JSON — the export is for humans (R5 explicitly: "Export plan.json").
  return new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
}

/**
 * R5 auto-snap rule: when the user types a new duration, snap it to the
 * nearest whole beat at the track's BPM. If bpm is missing/zero/null,
 * return the value verbatim (free-form mode).
 *
 * Snap-to-nearest, not floor — feels more natural to a creator dragging
 * a duration up or down by small amounts and seeing it click into place.
 */
export function snapDurationToBeat(durationSec: number, bpm: number | null): number {
  if (!bpm || bpm <= 0 || !Number.isFinite(durationSec) || durationSec <= 0) {
    return Math.max(0, durationSec);
  }
  const secondsPerBeat = 60 / bpm;
  const beats = Math.max(1, Math.round(durationSec / secondsPerBeat));
  return beats * secondsPerBeat;
}

/**
 * Translate the engine's `buildPlan({...}).scenes[]` shape into our
 * editor `Scene[]` shape. The core engine uses `start/end/model/prompt`;
 * we add stable scene IDs and rename to `startSec/endSec` for clarity
 * (no implicit assumption about units).
 *
 * Kept here (and not in plan-editor) so it can be reused by future
 * import flows that hydrate a plan from disk.
 */
export function makePlanFromCoreScenes(args: {
  id: string;
  audioDuration: number;
  theme: string;
  bpm: number | null;
  aspect: Aspect;
  coreScenes: Array<{
    role: string;
    start: number;
    end: number;
    model: string;
    prompt: string;
  }>;
}): Plan {
  const now = Date.now();
  return {
    id: args.id,
    audioDuration: args.audioDuration,
    theme: args.theme,
    bpm: args.bpm,
    aspect: args.aspect,
    scenes: args.coreScenes.map((s) => ({
      id: generateSceneId(),
      role: s.role,
      model: s.model,
      startSec: s.start,
      endSec: s.end,
      prompt: s.prompt,
    })),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Default model for a role — used when the user picks a role but the
 * caller doesn't have a more-informed preference. Thin wrapper around
 * `pickModel` so the editor doesn't need to import `core/models.mjs`
 * directly for this one fallback.
 */
export function defaultModelForRole(role: SceneRole, aspect: Aspect): string {
  return pickModel({ preference: undefined, sceneRole: role, aspectRatio: aspect });
}

/**
 * Whether `modelId` exists in the engine model registry. Exposed so the
 * editor's <select> can guard against stale model IDs in saved plans.
 */
export function isKnownModel(modelId: string): boolean {
  return Object.prototype.hasOwnProperty.call(MODELS, modelId);
}
