/**
 * Pure-TS helper for the `/new` and `/podcasts` upload hand-off.
 *
 * The upload form stashes a small JSON descriptor in `sessionStorage` keyed by
 * planId; `/plan/[id]` reads it back to seed the plan (theme / bpm / aspect).
 * Keeping the key + payload shape here — rather than inline in the React
 * component — lets us unit-test the rules (notably: podcasts never carry a BPM)
 * without rendering a component, matching the rest of `lib/`'s pure-module style.
 *
 * The payload is intentionally additive over what `/plan/[id]` consumes today
 * (`theme`, `bpm`, `aspect`). The extra `kind` field is ignored by older
 * readers, so introducing it doesn't break the existing music flow.
 */

/**
 * What the uploaded audio is. `music` is the original Studio flow (track →
 * music video). `podcast` is spoken / long-form audio → audiogram video; it has
 * no musical beat, so BPM-driven scene cutting doesn't apply.
 */
export type ProjectKind = "music" | "podcast";

export type NewProjectMeta = {
  kind: ProjectKind;
  theme: string;
  /** Null for podcasts (no beat) and for music tracks left on auto-detect. */
  bpm: number | null;
  fileName: string;
  fileSize: number;
};

/** sessionStorage key for a plan's new-project descriptor. */
export function newProjectStorageKey(planId: string): string {
  return `rhythmix:new:${planId}`;
}

/**
 * Build the descriptor the upload form persists. Trims the theme and enforces
 * the one rule that distinguishes a podcast from a track: a podcast never
 * carries a BPM, regardless of what (if anything) was entered.
 */
export function buildNewProjectMeta(args: {
  kind: ProjectKind;
  theme: string;
  bpm: number | null;
  fileName: string;
  fileSize: number;
}): NewProjectMeta {
  return {
    kind: args.kind,
    theme: args.theme.trim(),
    bpm: args.kind === "podcast" ? null : args.bpm,
    fileName: args.fileName,
    fileSize: args.fileSize,
  };
}
