"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateId,
  stashAudioForPlan,
  validateAudioFile,
} from "../../lib/audio-blob";
import {
  buildNewProjectMeta,
  newProjectStorageKey,
  type ProjectKind,
} from "../../lib/new-project";
import { WaveformCanvas } from "./waveform-canvas";

const THEME_MAX = 500;
const BPM_MIN = 40;
const BPM_MAX = 220;

/**
 * Per-variant copy. `music` is the original track → music-video flow;
 * `podcast` is spoken / long-form audio → audiogram. The podcast variant drops
 * the BPM field (no beat) and reframes the visual prompt around a backdrop.
 */
const VARIANT_COPY: Record<
  ProjectKind,
  {
    audioLabel: string;
    dropHint: string;
    themeLabel: string;
    themeHelp: string;
    themePlaceholder: string;
    showBpm: boolean;
  }
> = {
  music: {
    audioLabel: "Audio file",
    dropHint: "or tap to choose · mp3, wav, m4a, flac · up to 50 MB",
    themeLabel: "Visual theme",
    themeHelp:
      "Describe the look you want — moods, settings, colours, anything that paints the scenes.",
    themePlaceholder:
      "e.g. neon-soaked night drive through Tokyo, rain on the windshield, slow pans",
    showBpm: true,
  },
  podcast: {
    audioLabel: "Episode audio",
    dropHint: "or tap to choose · mp3, wav, m4a, flac · up to 50 MB",
    themeLabel: "Cover & backdrop look",
    themeHelp:
      "Describe the visual behind the waveform — cover art mood, colours, setting. No beat needed; the waveform follows the speech.",
    themePlaceholder:
      "e.g. warm candlelit studio, soft grain, slow drifting bokeh behind the title card",
    showBpm: false,
  },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadForm({
  variant = "music",
}: {
  /** Which create flow this is. Defaults to `music` so `/new` is unchanged. */
  variant?: ProjectKind;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const copy = VARIANT_COPY[variant];

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [theme, setTheme] = useState("");
  const [bpm, setBpm] = useState<string>("");
  const [bpmError, setBpmError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFileChosen = useCallback((picked: File | null) => {
    if (!picked) {
      setFile(null);
      setFileError(null);
      return;
    }
    const result = validateAudioFile(picked);
    if (!result.ok) {
      setFile(null);
      setFileError(result.reason);
      return;
    }
    setFile(picked);
    setFileError(null);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    handleFileChosen(picked);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const picked = e.dataTransfer.files?.[0] ?? null;
    handleFileChosen(picked);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setBpm(raw);
    if (raw === "") {
      setBpmError(null);
      return;
    }
    const n = Number(raw);
    if (!Number.isInteger(n) || n < BPM_MIN || n > BPM_MAX) {
      setBpmError(`BPM must be a whole number between ${BPM_MIN} and ${BPM_MAX}.`);
    } else {
      setBpmError(null);
    }
  };

  const canContinue =
    !!file && theme.trim().length > 0 && !bpmError && !submitting;

  const onContinue = async () => {
    if (!canContinue || !file) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const planId = generateId();
      await stashAudioForPlan(planId, file);
      // Persist theme + BPM alongside so /plan/[id] can read them. This is a
      // simple session-scoped JSON blob keyed by planId — other tasks (T7)
      // own the durable plan structure in localStorage.
      try {
        sessionStorage.setItem(
          newProjectStorageKey(planId),
          JSON.stringify(
            buildNewProjectMeta({
              kind: variant,
              theme,
              bpm: bpm ? Number(bpm) : null,
              fileName: file.name,
              fileSize: file.size,
            }),
          ),
        );
      } catch {
        // Non-fatal: /plan/[id] will fall back to defaults if this missed.
      }
      router.push(`/plan/${planId}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not save your audio locally. Try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl min-w-0 flex-col gap-6">
      {/* Drop zone / file picker */}
      <div className="min-w-0">
        <label className="mb-2 block font-starlightmix-mono text-xs uppercase tracking-[0.2em] text-starlightmix-text-soft">
          {copy.audioLabel}
        </label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={[
            "flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-rhythmix-lg)] border-2 border-dashed p-6 text-center transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]",
            isDragOver
              ? "border-starlightmix-magenta bg-starlightmix-surface-2"
              : "border-starlightmix-border-strong bg-starlightmix-surface hover:bg-starlightmix-surface-2",
          ].join(" ")}
        >
          <p className="text-sm font-semibold text-starlightmix-text break-words">
            {file ? file.name : "Drop an audio file here"}
          </p>
          <p className="font-starlightmix-mono text-xs text-starlightmix-text-muted">
            {file ? formatBytes(file.size) : copy.dropHint}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/wave,audio/x-wav,audio/mp4,audio/m4a,audio/x-m4a,audio/aac,audio/flac,audio/x-flac,.mp3,.wav,.m4a,.flac"
            onChange={onInputChange}
            className="hidden"
          />
        </div>
        {fileError && (
          <p className="mt-2 text-sm text-starlightmix-magenta" role="alert">
            {fileError}
          </p>
        )}
        {file && (
          <div className="mt-4">
            <WaveformCanvas blob={file} />
          </div>
        )}
      </div>

      {/* Theme */}
      <div className="min-w-0">
        <label
          htmlFor="theme"
          className="mb-2 block font-starlightmix-mono text-xs uppercase tracking-[0.2em] text-starlightmix-text-soft"
        >
          {copy.themeLabel}
        </label>
        <p className="mb-2 text-xs text-starlightmix-text-muted">
          {copy.themeHelp}
        </p>
        <textarea
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value.slice(0, THEME_MAX))}
          maxLength={THEME_MAX}
          rows={4}
          placeholder={copy.themePlaceholder}
          className="block w-full resize-y rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-starlightmix-surface px-3 py-3 text-base text-starlightmix-text placeholder:text-starlightmix-text-muted focus:border-starlightmix-cyan focus:outline-none focus:ring-1 focus:ring-starlightmix-cyan transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
          style={{ minHeight: "96px" }}
        />
        <div className="mt-1 flex justify-end font-starlightmix-mono text-xs text-starlightmix-text-muted">
          {theme.length}/{THEME_MAX}
        </div>
      </div>

      {/* BPM — music only; a podcast has no beat to cut on. */}
      {copy.showBpm && (
      <div className="min-w-0">
        <label
          htmlFor="bpm"
          className="mb-2 block font-starlightmix-mono text-xs uppercase tracking-[0.2em] text-starlightmix-text-soft"
        >
          BPM <span className="font-normal normal-case tracking-normal text-starlightmix-text-muted">(optional)</span>
        </label>
        <p className="mb-2 text-xs text-starlightmix-text-muted">
          Sets the beat for scene cuts. Leave blank to auto-detect later.
        </p>
        <input
          id="bpm"
          type="number"
          inputMode="numeric"
          min={BPM_MIN}
          max={BPM_MAX}
          step={1}
          value={bpm}
          onChange={onBpmChange}
          placeholder="e.g. 128"
          className="block w-full rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-starlightmix-surface px-3 py-3 text-base font-starlightmix-mono tabular-nums text-starlightmix-text placeholder:text-starlightmix-text-muted focus:border-starlightmix-cyan focus:outline-none focus:ring-1 focus:ring-starlightmix-cyan transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
          style={{ minHeight: "44px" }}
        />
        {bpmError && (
          <p className="mt-2 text-sm text-starlightmix-magenta" role="alert">
            {bpmError}
          </p>
        )}
      </div>
      )}

      {submitError && (
        <p className="text-sm text-starlightmix-magenta" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="inline-flex w-full items-center justify-center rounded-[var(--radius-rhythmix-md)] bg-starlightmix-magenta px-6 py-3 text-base font-semibold text-starlightmix-text transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)] hover:bg-starlightmix-pink disabled:cursor-not-allowed disabled:bg-starlightmix-surface-2 disabled:text-starlightmix-text-muted"
        style={{ minHeight: "44px" }}
      >
        {submitting ? "Saving…" : "Continue"}
      </button>
    </div>
  );
}
