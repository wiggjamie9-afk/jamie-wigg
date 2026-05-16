/**
 * Ambient type declarations for the platform-agnostic engine core that
 * lives in `rhythmix-studio/src/core/`. The core is authored as plain
 * `.mjs` (JSDoc-typed), not TypeScript, so we declare its shape here so
 * the `studio/` Next app can `import { ... } from "../../rhythmix-studio/src/core/*.mjs"`
 * with full type-checking.
 *
 * Keep these in sync with the runtime shape — if a function signature
 * drifts in the .mjs, update here too.
 */

declare module "*/rhythmix-studio/src/core/models.mjs" {
  export interface ModelEntry {
    replicateId: string;
    label: string;
    maxClipSeconds: number;
    bestFor: string[];
    estimatedUsdPerClip: number;
    buildInput: (scene: {
      prompt: string;
      width?: number;
      height?: number;
      duration?: number;
      aspectRatio?: string;
    }) => Record<string, unknown>;
  }
  export const MODELS: Record<string, ModelEntry>;
  export function pickModel(args: {
    preference?: string | null | undefined;
    sceneRole: string;
    aspectRatio?: string;
  }): string;
  export function estimateCost(plan: {
    scenes: Array<{ model: string }>;
  }): number;
}

declare module "*/rhythmix-studio/src/core/plan.mjs" {
  export interface CoreScene {
    index: number;
    role: string;
    start: number;
    end: number;
    duration: number;
    model: string;
    prompt: string;
    aspectRatio: string;
    width?: number;
    height?: number;
  }
  export interface CoreSection {
    role: string;
    start: number;
    end: number;
    length: number;
  }
  export interface CorePlan {
    audio: { duration: number; sampleRate?: number; channels?: number };
    theme: string;
    bpm: number | null;
    aspectRatio: string;
    sections: CoreSection[];
    scenes: CoreScene[];
  }
  export function beatsFromBpm(args: {
    duration: number;
    bpm: number | null | undefined;
    downbeatsPerBar?: number;
  }): Array<{ t: number; isDownbeat: boolean }>;
  export function nearestBeat(
    beats: Array<{ t: number }>,
    t: number,
  ): number;
  export function buildPlan(args: {
    audio: { duration: number; sampleRate?: number; channels?: number };
    theme: string;
    bpm?: number | null;
    modelPreference?: string | null;
    aspectRatio?: string;
    structure?: Array<{ role: string; share: number }>;
    width?: number;
    height?: number;
  }): CorePlan;
}

declare module "*/rhythmix-studio/src/ffmpeg/wasm.mjs" {
  export function probe(input: Blob | File | Uint8Array | string): Promise<{
    duration: number;
    sampleRate: number | null;
    channels: number | null;
    codec: string | null;
  }>;
  export function trim(
    input: Blob | File,
    startSec: number,
    endSec: number,
  ): Promise<Blob>;
  export function concat(inputs: Array<Blob | File>): Promise<Blob>;
  export function mux(video: Blob | File, audio: Blob | File): Promise<Blob>;
  export function extractFrame(
    video: Blob | File,
    timeSec: number,
  ): Promise<Blob>;
}
