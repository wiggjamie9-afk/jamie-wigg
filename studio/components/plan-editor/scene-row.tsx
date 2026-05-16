"use client";

import { useEffect, useRef, useState } from "react";
import { MODELS } from "../../../rhythmix-studio/src/core/models.mjs";
import type { Scene } from "../../lib/plan-storage";

/**
 * Per-scene editor row. Lives in two shapes simultaneously:
 *   - desktop / tablet (>= 768px): a real `<tr>` inside the parent `<table>`
 *   - mobile (< 768px): a stacked card layout, also `<tr>`/`<td>` for screen
 *     readers but visually re-laid out with Tailwind responsive utilities
 *
 * Why one component, two layouts: keeping a single semantic table means
 * screen-reader users get proper column headers + row associations, while
 * sighted iPhone Safari users get a finger-friendly card.
 *
 * Edits are reported via `onChange(partialUpdate)`. The parent debounces
 * the persistence; the row stays controlled in its own local state for
 * prompt + duration so keystrokes stay snappy.
 */

const MODEL_OPTIONS = Object.entries(MODELS).map(([id, m]) => ({
  id,
  label: m.label,
  maxClipSeconds: m.maxClipSeconds,
}));

export function SceneRow({
  scene,
  index,
  bpm,
  onChange,
  onDurationChange,
}: {
  scene: Scene;
  index: number;
  bpm: number | null;
  onChange: (patch: Partial<Scene>) => void;
  onDurationChange: (newDurationSec: number) => void;
}) {
  // Local-controlled mirrors so typing in textarea / number input stays
  // smooth even while the parent debounces saves to localStorage.
  const [prompt, setPrompt] = useState(scene.prompt);
  const duration = scene.endSec - scene.startSec;
  const [durationInput, setDurationInput] = useState(duration.toFixed(2));

  // Reset local state when the upstream scene id changes (e.g. plan
  // rebuilt). Keying on scene.id covers that case without a full remount.
  const lastSceneId = useRef(scene.id);
  useEffect(() => {
    if (lastSceneId.current !== scene.id) {
      setPrompt(scene.prompt);
      setDurationInput((scene.endSec - scene.startSec).toFixed(2));
      lastSceneId.current = scene.id;
    }
  }, [scene.id, scene.prompt, scene.startSec, scene.endSec]);

  // Also re-sync the duration field if the upstream value shifted because
  // an earlier scene's duration changed (cascading edit). Without this,
  // the displayed duration would lag behind the saved one.
  useEffect(() => {
    setDurationInput((scene.endSec - scene.startSec).toFixed(2));
  }, [scene.startSec, scene.endSec]);

  const modelMeta = MODELS[scene.model];
  const maxClipSeconds = modelMeta?.maxClipSeconds ?? 10;

  return (
    <tr className="block border-b border-rhythmix-border-strong md:table-row md:border-b-0">
      {/* Index + role badge */}
      <td
        className="block px-0 py-2 align-top md:table-cell md:px-3 md:py-4"
        data-label="Scene"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-rhythmix-magenta px-2 font-rhythmix-mono text-xs font-bold text-rhythmix-text tabular-nums">
            {index + 1}
          </span>
          <span className="rounded-[var(--radius-rhythmix-sm)] bg-rhythmix-surface-2 px-2 py-0.5 font-rhythmix-mono text-xs font-medium uppercase tracking-wider text-rhythmix-cyan">
            {scene.role}
          </span>
        </div>
      </td>

      {/* Model select */}
      <td
        className="block px-0 py-2 align-top md:table-cell md:px-3 md:py-4 min-w-0"
        data-label="Model"
      >
        <label className="mb-1 block font-rhythmix-mono text-xs uppercase tracking-wide text-rhythmix-text-muted md:hidden">
          Model
        </label>
        <select
          value={MODEL_OPTIONS.some((o) => o.id === scene.model) ? scene.model : ""}
          onChange={(e) => onChange({ model: e.target.value })}
          className="block w-full rounded-[var(--radius-rhythmix-sm)] border border-rhythmix-border-strong bg-rhythmix-surface px-2 py-2 text-sm text-rhythmix-text focus:border-rhythmix-cyan focus:outline-none focus:ring-1 focus:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
          style={{ minHeight: "44px" }}
          aria-label={`Model for scene ${index + 1}`}
        >
          {!MODEL_OPTIONS.some((o) => o.id === scene.model) && (
            <option value="" disabled>
              Unknown ({scene.model})
            </option>
          )}
          {MODEL_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </td>

      {/* Duration */}
      <td
        className="block px-0 py-2 align-top md:table-cell md:px-3 md:py-4 min-w-0"
        data-label="Duration (s)"
      >
        <label className="mb-1 block font-rhythmix-mono text-xs uppercase tracking-wide text-rhythmix-text-muted md:hidden">
          Duration (s)
        </label>
        <input
          type="number"
          inputMode="decimal"
          min={0.5}
          max={maxClipSeconds}
          step={0.1}
          value={durationInput}
          onChange={(e) => setDurationInput(e.target.value)}
          onBlur={() => {
            const n = Number(durationInput);
            if (!Number.isFinite(n) || n <= 0) {
              setDurationInput(duration.toFixed(2));
              return;
            }
            // Clamp at the per-model maxClipSeconds — Replicate APIs
            // reject longer clips, and a silent fail at render time is
            // worse than a quiet snap-down here.
            const clamped = Math.min(n, maxClipSeconds);
            onDurationChange(clamped);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="block w-full rounded-[var(--radius-rhythmix-sm)] border border-rhythmix-border-strong bg-rhythmix-surface px-2 py-2 font-rhythmix-mono text-sm tabular-nums text-rhythmix-text focus:border-rhythmix-cyan focus:outline-none focus:ring-1 focus:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
          style={{ minHeight: "44px" }}
          aria-label={`Duration in seconds for scene ${index + 1}`}
        />
        {bpm && (
          <p className="mt-1 font-rhythmix-mono text-[10px] uppercase tracking-wide text-rhythmix-text-muted">
            Snaps to {bpm} BPM
          </p>
        )}
      </td>

      {/* Prompt */}
      <td
        className="block px-0 py-2 align-top md:table-cell md:px-3 md:py-4 min-w-0"
        data-label="Prompt"
      >
        <label className="mb-1 block font-rhythmix-mono text-xs uppercase tracking-wide text-rhythmix-text-muted md:hidden">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            onChange({ prompt: e.target.value });
          }}
          rows={3}
          className="block w-full resize-y rounded-[var(--radius-rhythmix-sm)] border border-rhythmix-border-strong bg-rhythmix-surface px-2 py-2 text-sm text-rhythmix-text placeholder:text-rhythmix-text-muted focus:border-rhythmix-cyan focus:outline-none focus:ring-1 focus:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
          style={{ minHeight: "72px" }}
          aria-label={`Prompt for scene ${index + 1}`}
        />
      </td>
    </tr>
  );
}
