"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateId,
  stashAudioForPlan,
  validateAudioFile,
} from "../../lib/audio-blob";
import { WaveformCanvas } from "./waveform-canvas";

const THEME_MAX = 500;
const BPM_MIN = 40;
const BPM_MAX = 220;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
          `rhythmix:new:${planId}`,
          JSON.stringify({
            theme: theme.trim(),
            bpm: bpm ? Number(bpm) : null,
            fileName: file.name,
            fileSize: file.size,
          }),
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
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      {/* Drop zone / file picker */}
      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-800">
          Audio file
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
            "flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            isDragOver
              ? "border-neutral-900 bg-neutral-100"
              : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100",
          ].join(" ")}
        >
          <p className="text-sm font-medium text-neutral-800">
            {file ? file.name : "Drop an audio file here"}
          </p>
          <p className="text-xs text-neutral-500">
            {file
              ? formatBytes(file.size)
              : "or tap to choose · mp3, wav, m4a, flac · up to 50 MB"}
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
          <p className="mt-2 text-sm text-red-600" role="alert">
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
      <div>
        <label
          htmlFor="theme"
          className="mb-2 block text-sm font-medium text-neutral-800"
        >
          Visual theme
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Describe the look you want — moods, settings, colours, anything that
          paints the scenes.
        </p>
        <textarea
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value.slice(0, THEME_MAX))}
          maxLength={THEME_MAX}
          rows={4}
          placeholder="e.g. neon-soaked night drive through Tokyo, rain on the windshield, slow pans"
          className="block w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          style={{ minHeight: "96px" }}
        />
        <div className="mt-1 flex justify-end text-xs text-neutral-500">
          {theme.length}/{THEME_MAX}
        </div>
      </div>

      {/* BPM */}
      <div>
        <label
          htmlFor="bpm"
          className="mb-2 block text-sm font-medium text-neutral-800"
        >
          BPM <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <p className="mb-2 text-xs text-neutral-500">
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
          className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          style={{ minHeight: "44px" }}
        />
        {bpmError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {bpmError}
          </p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        style={{ minHeight: "44px" }}
      >
        {submitting ? "Saving…" : "Continue"}
      </button>
    </div>
  );
}
