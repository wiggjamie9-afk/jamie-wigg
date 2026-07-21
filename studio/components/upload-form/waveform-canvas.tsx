"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders an audio Blob as a min/max waveform on a <canvas>.
 *
 * Uses the Web Audio API's `decodeAudioData` to decode the PCM samples,
 * then buckets them into one bar per pixel column. Pure Canvas — no
 * WaveSurfer.js — keeps the bundle small.
 *
 * Renders happen off the main thread *only* as far as `decodeAudioData`
 * itself; the drawing is synchronous and cheap because it's a single
 * left-to-right pass.
 */
export function WaveformCanvas({
  blob,
  height = 96,
}: {
  blob: Blob;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"decoding" | "ready" | "error">(
    "decoding",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("decoding");
    setError(null);

    (async () => {
      try {
        const arrayBuffer = await blob.arrayBuffer();
        // Some Safari versions still need the webkit-prefixed constructor.
        const Ctx: typeof AudioContext | undefined =
          window.AudioContext ??
          (window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }).webkitAudioContext;
        if (!Ctx) {
          throw new Error("Web Audio API is not supported in this browser.");
        }
        const audioCtx = new Ctx();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
        // Close immediately — we don't need playback through this context.
        await audioCtx.close();

        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        // Canvas CSS width is driven by the parent (flex/full-width). Read
        // it back to size the bitmap so we draw at the actual pixel grid.
        const cssWidth = canvas.clientWidth || 320;
        canvas.width = Math.floor(cssWidth * dpr);
        canvas.height = Math.floor(height * dpr);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, cssWidth, height);

        // Mix to mono by averaging channels.
        const channels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length;
        const samplesPerBar = Math.max(1, Math.floor(length / cssWidth));
        const channelData: Float32Array[] = [];
        for (let c = 0; c < channels; c++) {
          channelData.push(audioBuffer.getChannelData(c));
        }

        const midY = height / 2;
        // Brand-locked: deep violet-near-black surface with a magenta
        // midline and electric-cyan waveform. Sourced from
        // rhythmix-teaser-60s/DESIGN.md.
        ctx.fillStyle = "#1a1325"; // rhythmix-surface
        ctx.fillRect(0, 0, cssWidth, height);
        ctx.strokeStyle = "#7c3aed"; // rhythmix-purple midline
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(cssWidth, midY);
        ctx.stroke();

        ctx.fillStyle = "#00d8ff"; // rhythmix-cyan waveform
        for (let x = 0; x < cssWidth; x++) {
          let min = 1.0;
          let max = -1.0;
          const start = x * samplesPerBar;
          const end = Math.min(start + samplesPerBar, length);
          for (let i = start; i < end; i++) {
            let sum = 0;
            for (let c = 0; c < channels; c++) {
              sum += channelData[c][i];
            }
            const v = sum / channels;
            if (v < min) min = v;
            if (v > max) max = v;
          }
          // Map [-1,1] to canvas coords. Clamp to keep ultra-quiet tracks
          // visible.
          const y1 = midY - max * (midY - 1);
          const y2 = midY - min * (midY - 1);
          const barHeight = Math.max(1, y2 - y1);
          ctx.fillRect(x, y1, 1, barHeight);
        }

        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "Could not decode audio.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [blob, height]);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="block w-full rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-starlightmix-surface"
        style={{ height: `${height}px` }}
        aria-label="Audio waveform preview"
      />
      {status === "decoding" && (
        <p className="mt-2 font-starlightmix-mono text-xs text-starlightmix-text-muted">Decoding waveform…</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-starlightmix-magenta">
          Waveform preview unavailable: {error}
        </p>
      )}
    </div>
  );
}
