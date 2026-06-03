import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../rhythmix-studio/src/core/models.mjs", () => ({
  MODELS: {
    "hunyuan-video": {},
    "kling-v2": {},
    "luma-ray": {},
    "minimax-video": {},
  },
  pickModel: ({ sceneRole }: { preference?: string; sceneRole: string; aspectRatio: string }) => {
    if (sceneRole === "chorus") return "kling-v2";
    if (sceneRole === "verse") return "hunyuan-video";
    return "hunyuan-video";
  },
}));

import {
  snapDurationToBeat,
  savePlan,
  loadPlan,
  deletePlan,
  listPlans,
  exportPlanAsBlob,
  makePlanFromCoreScenes,
  isKnownModel,
  defaultModelForRole,
  type Plan,
} from "./plan-storage";

function makePlan(overrides: Partial<Plan> = {}): Plan {
  return {
    id: "test-plan-1",
    audioDuration: 120,
    theme: "pop",
    bpm: 120,
    aspect: "16:9",
    scenes: [],
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------

describe("snapDurationToBeat", () => {
  it("bpm=null returns durationSec as-is", () => {
    expect(snapDurationToBeat(2.5, null)).toBe(2.5);
  });

  it("bpm=0 returns durationSec as-is", () => {
    expect(snapDurationToBeat(2.5, 0)).toBe(2.5);
  });

  it("negative durationSec with bpm=null returns 0", () => {
    expect(snapDurationToBeat(-3, null)).toBe(0);
  });

  it("negative durationSec with valid bpm returns 0", () => {
    expect(snapDurationToBeat(-1, 120)).toBe(0);
  });

  it("non-finite durationSec (Infinity) takes the non-snap branch (Math.max(0, Infinity) = Infinity)", () => {
    // The guard fires because !Number.isFinite(Infinity), returning Math.max(0, Infinity) = Infinity
    expect(snapDurationToBeat(Infinity, 120)).toBe(Infinity);
  });

  it("non-finite durationSec (NaN) takes the non-snap branch (Math.max(0, NaN) = NaN)", () => {
    // The guard fires because !Number.isFinite(NaN), returning Math.max(0, NaN) = NaN
    expect(snapDurationToBeat(NaN, 120)).toBeNaN();
  });

  it("snaps 1.8s at bpm=120 to nearest beat (4 beats = 2.0s)", () => {
    // secondsPerBeat = 60/120 = 0.5; 1.8/0.5 = 3.6 → round(3.6)=4 → 4*0.5=2.0
    expect(snapDurationToBeat(1.8, 120)).toBeCloseTo(2.0);
  });

  it("snaps 1.3s at bpm=120 to nearest beat (3 beats = 1.5s)", () => {
    // 1.3/0.5 = 2.6 → round(2.6)=3 → 3*0.5=1.5
    expect(snapDurationToBeat(1.3, 120)).toBeCloseTo(1.5);
  });

  it("minimum snap is 1 beat even for very short durations", () => {
    // 0.1s at bpm=120 → 0.1/0.5=0.2 → round(0.2)=0 → max(1,0)=1 → 0.5s
    expect(snapDurationToBeat(0.1, 120)).toBeCloseTo(0.5);
  });

  it("exact beat boundary returns itself", () => {
    // 2.0s at bpm=120 → 2.0/0.5=4 → round(4)=4 → 4*0.5=2.0
    expect(snapDurationToBeat(2.0, 120)).toBeCloseTo(2.0);
  });

  it("works with bpm=60 (secondsPerBeat=1.0)", () => {
    // 2.4s → 2.4/1.0=2.4 → round=2 → 2.0s
    expect(snapDurationToBeat(2.4, 60)).toBeCloseTo(2.0);
  });

  it("durationSec=0 with valid bpm returns 0", () => {
    expect(snapDurationToBeat(0, 120)).toBe(0);
  });

  it("negative bpm treated as no-snap, returns durationSec as-is", () => {
    expect(snapDurationToBeat(2.5, -60)).toBe(2.5);
  });

  it("non-finite durationSec (-Infinity) returns 0", () => {
    expect(snapDurationToBeat(-Infinity, 120)).toBe(0);
  });
});

// ---------------------------------------------------------------------------

describe("savePlan / loadPlan", () => {
  it("savePlan writes a loadable plan", () => {
    const plan = makePlan();
    savePlan(plan);
    const loaded = loadPlan(plan.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.id).toBe(plan.id);
    expect(loaded!.theme).toBe("pop");
  });

  it("savePlan updates updatedAt to a current timestamp", () => {
    const before = Date.now();
    savePlan(makePlan({ updatedAt: 0 }));
    const loaded = loadPlan("test-plan-1");
    expect(loaded!.updatedAt).toBeGreaterThanOrEqual(before);
  });

  it("savePlan adds id to plan-index", () => {
    savePlan(makePlan({ id: "abc" }));
    const raw = localStorage.getItem("plan-index");
    const index = JSON.parse(raw!);
    expect(index).toContain("abc");
  });

  it("savePlan deduplicates index on repeated save of same plan", () => {
    const plan = makePlan({ id: "dup" });
    savePlan(plan);
    savePlan(plan);
    const index = JSON.parse(localStorage.getItem("plan-index")!);
    expect(index.filter((x: string) => x === "dup")).toHaveLength(1);
  });

  it("loadPlan returns null for a missing key", () => {
    expect(loadPlan("nonexistent")).toBeNull();
  });

  it("loadPlan returns null for corrupt JSON", () => {
    localStorage.setItem("plan-corrupt", "not json {{");
    expect(loadPlan("corrupt")).toBeNull();
  });

  it("loadPlan returns null when parsed value has no scenes property", () => {
    localStorage.setItem("plan-bad", JSON.stringify({ id: "bad", theme: "x" }));
    expect(loadPlan("bad")).toBeNull();
  });

  it("loadPlan returns null when scenes is a string instead of array", () => {
    localStorage.setItem("plan-bad2", JSON.stringify({ id: "bad2", scenes: "nope" }));
    expect(loadPlan("bad2")).toBeNull();
  });

  it("loadPlan returns null when scenes is null", () => {
    localStorage.setItem("plan-null-scenes", JSON.stringify({ id: "null-scenes", scenes: null }));
    expect(loadPlan("null-scenes")).toBeNull();
  });

  it("loadPlan returns null when stored value is a JSON primitive (number)", () => {
    localStorage.setItem("plan-primitive", "42");
    expect(loadPlan("primitive")).toBeNull();
  });

  it("savePlan throws with a descriptive message when localStorage.setItem throws", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(() => savePlan(makePlan())).toThrow(/could not save plan/i);
    spy.mockRestore();
  });

  it("savePlan error message includes the plan id", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("full");
    });
    expect(() => savePlan(makePlan({ id: "my-plan" }))).toThrow(/my-plan/);
    spy.mockRestore();
  });

  it("loaded plan preserves scenes content", () => {
    const scene = {
      id: "s1",
      role: "verse",
      model: "hunyuan-video",
      startSec: 0,
      endSec: 10,
      prompt: "rain",
    };
    savePlan(makePlan({ scenes: [scene] }));
    const loaded = loadPlan("test-plan-1");
    expect(loaded!.scenes).toHaveLength(1);
    expect(loaded!.scenes[0].prompt).toBe("rain");
  });
});

// ---------------------------------------------------------------------------

describe("deletePlan", () => {
  it("removes the plan key from localStorage", () => {
    const plan = makePlan({ id: "to-delete" });
    savePlan(plan);
    deletePlan("to-delete");
    expect(localStorage.getItem("plan-to-delete")).toBeNull();
  });

  it("removes the id from the index", () => {
    savePlan(makePlan({ id: "del-idx" }));
    deletePlan("del-idx");
    const index = JSON.parse(localStorage.getItem("plan-index") || "[]");
    expect(index).not.toContain("del-idx");
  });

  it("loadPlan returns null after deletePlan", () => {
    savePlan(makePlan({ id: "gone" }));
    deletePlan("gone");
    expect(loadPlan("gone")).toBeNull();
  });

  it("does not throw when plan does not exist", () => {
    expect(() => deletePlan("ghost")).not.toThrow();
  });

  it("does not affect other plans in the index", () => {
    savePlan(makePlan({ id: "keep" }));
    savePlan(makePlan({ id: "remove" }));
    deletePlan("remove");
    const index = JSON.parse(localStorage.getItem("plan-index") || "[]");
    expect(index).toContain("keep");
    expect(index).not.toContain("remove");
  });
});

// ---------------------------------------------------------------------------

describe("listPlans", () => {
  it("returns empty array when no plans saved", () => {
    expect(listPlans()).toEqual([]);
  });

  it("returns saved plans with id, updatedAt, theme fields", () => {
    savePlan(makePlan({ id: "p1", theme: "rock" }));
    const list = listPlans();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe("p1");
    expect(list[0].theme).toBe("rock");
    expect(typeof list[0].updatedAt).toBe("number");
  });

  it("sorts by updatedAt descending (most recently saved first)", async () => {
    savePlan(makePlan({ id: "old", updatedAt: 100 }));
    await new Promise((r) => setTimeout(r, 5));
    savePlan(makePlan({ id: "new", updatedAt: 200 }));
    const list = listPlans();
    expect(list[0].id).toBe("new");
    expect(list[1].id).toBe("old");
  });

  it("skips orphaned index entries where plan key is absent", () => {
    localStorage.setItem("plan-index", JSON.stringify(["orphan"]));
    expect(listPlans()).toEqual([]);
  });

  it("returns real plans while excluding orphans mixed into the index", () => {
    savePlan(makePlan({ id: "real" }));
    const index = JSON.parse(localStorage.getItem("plan-index")!);
    index.push("orphan");
    localStorage.setItem("plan-index", JSON.stringify(index));
    const list = listPlans();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe("real");
  });

  it("returns an empty array when plan-index contains invalid JSON", () => {
    localStorage.setItem("plan-index", "{{bad");
    expect(listPlans()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------

function readBlobAsText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

describe("exportPlanAsBlob", () => {
  it("returns a Blob with type application/json", () => {
    const blob = exportPlanAsBlob(makePlan());
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("application/json");
  });

  it("Blob content is valid JSON that round-trips to the plan", async () => {
    const plan = makePlan({ theme: "jazz", bpm: 90 });
    const blob = exportPlanAsBlob(plan);
    const text = await readBlobAsText(blob);
    const parsed = JSON.parse(text);
    expect(parsed.id).toBe(plan.id);
    expect(parsed.theme).toBe("jazz");
    expect(parsed.bpm).toBe(90);
    expect(parsed.scenes).toEqual([]);
  });

  it("Blob content is pretty-printed (contains newlines)", async () => {
    const blob = exportPlanAsBlob(makePlan());
    const text = await readBlobAsText(blob);
    expect(text).toContain("\n");
  });

  it("Blob size is greater than 0", () => {
    const blob = exportPlanAsBlob(makePlan());
    expect(blob.size).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------

describe("makePlanFromCoreScenes", () => {
  const coreScenes = [
    { role: "verse", start: 0, end: 15, model: "hunyuan-video", prompt: "forest" },
    { role: "chorus", start: 15, end: 30, model: "kling-v2", prompt: "ocean" },
  ];

  it("output plan has correct id", () => {
    const plan = makePlanFromCoreScenes({
      id: "plan-x",
      audioDuration: 180,
      theme: "cinematic",
      bpm: 90,
      aspect: "9:16",
      coreScenes,
    });
    expect(plan.id).toBe("plan-x");
  });

  it("output plan has correct audioDuration", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 180,
      theme: "t",
      bpm: null,
      aspect: "16:9",
      coreScenes,
    });
    expect(plan.audioDuration).toBe(180);
  });

  it("output plan has correct theme", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "cinematic",
      bpm: null,
      aspect: "16:9",
      coreScenes,
    });
    expect(plan.theme).toBe("cinematic");
  });

  it("output plan has correct bpm", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "t",
      bpm: 90,
      aspect: "16:9",
      coreScenes,
    });
    expect(plan.bpm).toBe(90);
  });

  it("output plan preserves bpm=null", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "t",
      bpm: null,
      aspect: "16:9",
      coreScenes,
    });
    expect(plan.bpm).toBeNull();
  });

  it("output plan has correct aspect", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "t",
      bpm: null,
      aspect: "9:16",
      coreScenes,
    });
    expect(plan.aspect).toBe("9:16");
  });

  it("scenes array length matches coreScenes", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "pop",
      bpm: null,
      aspect: "1:1",
      coreScenes,
    });
    expect(plan.scenes).toHaveLength(2);
  });

  it("each scene has startSec renamed from start", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "pop",
      bpm: null,
      aspect: "16:9",
      coreScenes,
    });
    expect(plan.scenes[0].startSec).toBe(0);
    expect(plan.scenes[1].startSec).toBe(15);
  });

  it("each scene has endSec renamed from end", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "pop",
      bpm: null,
      aspect: "16:9",
      coreScenes,
    });
    expect(plan.scenes[0].endSec).toBe(15);
    expect(plan.scenes[1].endSec).toBe(30);
  });

  it("each scene has a unique string id starting with 's'", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "pop",
      bpm: null,
      aspect: "16:9",
      coreScenes,
    });
    for (const scene of plan.scenes) {
      expect(typeof scene.id).toBe("string");
      expect(scene.id.startsWith("s")).toBe(true);
    }
    const ids = plan.scenes.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("createdAt is a positive number", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "pop",
      bpm: null,
      aspect: "16:9",
      coreScenes: [],
    });
    expect(plan.createdAt).toBeGreaterThan(0);
  });

  it("updatedAt is a positive number", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "pop",
      bpm: null,
      aspect: "16:9",
      coreScenes: [],
    });
    expect(plan.updatedAt).toBeGreaterThan(0);
  });

  it("createdAt and updatedAt are equal on creation", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 30,
      theme: "pop",
      bpm: null,
      aspect: "16:9",
      coreScenes: [],
    });
    expect(plan.createdAt).toBe(plan.updatedAt);
  });

  it("handles empty coreScenes", () => {
    const plan = makePlanFromCoreScenes({
      id: "p",
      audioDuration: 0,
      theme: "ambient",
      bpm: null,
      aspect: "1:1",
      coreScenes: [],
    });
    expect(plan.scenes).toEqual([]);
  });
});

// ---------------------------------------------------------------------------

describe("isKnownModel", () => {
  it('returns true for "hunyuan-video"', () => {
    expect(isKnownModel("hunyuan-video")).toBe(true);
  });

  it('returns true for "kling-v2"', () => {
    expect(isKnownModel("kling-v2")).toBe(true);
  });

  it('returns true for "luma-ray"', () => {
    expect(isKnownModel("luma-ray")).toBe(true);
  });

  it('returns true for "minimax-video"', () => {
    expect(isKnownModel("minimax-video")).toBe(true);
  });

  it("returns false for unknown string", () => {
    expect(isKnownModel("stable-diffusion")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isKnownModel("")).toBe(false);
  });

  it("returns false for a string that is a prefix of a known model", () => {
    expect(isKnownModel("kling")).toBe(false);
  });
});

// ---------------------------------------------------------------------------

describe("defaultModelForRole", () => {
  it("returns a string for any role", () => {
    expect(typeof defaultModelForRole("verse", "16:9")).toBe("string");
  });

  it('"chorus" role returns "kling-v2"', () => {
    expect(defaultModelForRole("chorus", "16:9")).toBe("kling-v2");
  });

  it('"verse" role returns "hunyuan-video"', () => {
    expect(defaultModelForRole("verse", "16:9")).toBe("hunyuan-video");
  });

  it("unknown role returns the default fallback model", () => {
    expect(defaultModelForRole("breakdown", "9:16")).toBe("hunyuan-video");
  });

  it("aspect ratio is forwarded without throwing", () => {
    expect(() => defaultModelForRole("intro", "1:1")).not.toThrow();
  });

  it("returned model id is a known model", () => {
    const result = defaultModelForRole("chorus", "16:9");
    expect(isKnownModel(result)).toBe(true);
  });
});
