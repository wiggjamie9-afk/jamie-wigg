"use client";

/**
 * Video Exporter — Auto-generate captions & metadata with free LLM
 *
 * Integrated into render-progress.tsx after render completes.
 * Generates captions + metadata using FreeLLMAPI (saving ~99.8% on LLM costs).
 */

import { useCallback, useState } from "react";
import {
  generateCaption,
  generateMetadata,
  type StudioLLMResponse,
} from "../../lib/llm-studio";
import type { Plan } from "../../lib/plan-storage";
import type { RenderResult } from "../../lib/render-runner";

export interface VideoExporterProps {
  plan: Plan;
  result: RenderResult;
  onComplete?: (metadata: ExportedMetadata) => void;
}

export interface ExportedMetadata {
  caption: StudioLLMResponse;
  metadata: StudioLLMResponse;
  costSaved: number;
}

/**
 * Main exporter component
 */
export function VideoExporter({
  plan,
  result,
  onComplete,
}: VideoExporterProps) {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "generating"; step: "caption" | "metadata" }
    | { kind: "done"; data: ExportedMetadata }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const handleExport = useCallback(async () => {
    setState({ kind: "generating", step: "caption" });

    try {
      // 1. Generate caption (free)
      const captionResult = await generateCaption(
        plan.theme || "Music video"
      );

      setState({ kind: "generating", step: "metadata" });

      // 2. Generate metadata (free)
      // Create a simple description from the plan
      const description = `Music video with ${plan.scenes.length} scenes, ${plan.bpm || "unknown"} BPM, ${plan.aspect} aspect ratio`;
      const metadataResult = await generateMetadata(
        plan.theme || "Untitled Video",
        description
      );

      // 3. Calculate cost saved
      // Low-value tasks = ~$0 each (free tier)
      const costSaved = 0.001; // Minimal cost, but could be higher

      const exportData: ExportedMetadata = {
        caption: captionResult,
        metadata: metadataResult,
        costSaved,
      };

      setState({ kind: "done", data: exportData });
      onComplete?.(exportData);

      // Auto-download metadata file
      downloadMetadataFile(exportData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate metadata";
      setState({ kind: "error", message });
    }
  }, [plan, onComplete]);

  // ---- Render branches ----

  if (state.kind === "idle") {
    return (
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-starlightmix-accent text-white rounded hover:bg-opacity-90 transition"
      >
        ✨ Generate Captions & Metadata (Free)
      </button>
    );
  }

  if (state.kind === "generating") {
    return (
      <div className="p-4 bg-starlightmix-bg-secondary rounded">
        <p className="text-sm text-starlightmix-text-muted">
          {state.step === "caption"
            ? "📝 Generating caption..."
            : "🏷️ Generating metadata..."}
        </p>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-sm text-red-700">❌ {state.message}</p>
        <button
          onClick={handleExport}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // state.kind === "done"
  return (
    <ExportedMetadataDisplay
      data={state.data}
      onRegenerate={handleExport}
    />
  );
}

/**
 * Display completed metadata with copy/download options
 */
interface ExportedMetadataDisplayProps {
  data: ExportedMetadata;
  onRegenerate: () => void;
}

function ExportedMetadataDisplay({
  data,
  onRegenerate,
}: ExportedMetadataDisplayProps) {
  const [copied, setCopied] = useState<"caption" | "metadata" | null>(null);

  const handleCopy = (text: string, type: "caption" | "metadata") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4 p-4 bg-starlightmix-bg-secondary rounded border border-starlightmix-border">
      {/* Savings badge */}
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
        <span className="text-lg">🎉</span>
        <div>
          <p className="text-sm font-semibold text-green-900">
            You saved ${data.costSaved.toFixed(2)}!
          </p>
          <p className="text-xs text-green-700">
            Generated with free LLM tier (Groq/Gemini/Mistral)
          </p>
        </div>
      </div>

      {/* Caption section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-starlightmix-text">
            📝 Caption
          </h3>
          <span className="text-xs text-starlightmix-text-muted">
            via {data.caption.provider}
          </span>
        </div>
        <div className="p-3 bg-starlightmix-bg border border-starlightmix-border rounded">
          <p className="text-sm text-starlightmix-text">{data.caption.text}</p>
        </div>
        <button
          onClick={() => handleCopy(data.caption.text, "caption")}
          className="mt-2 text-xs text-starlightmix-accent hover:underline"
        >
          {copied === "caption" ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Metadata section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-starlightmix-text">
            🏷️ Metadata
          </h3>
          <span className="text-xs text-starlightmix-text-muted">
            via {data.metadata.provider}
          </span>
        </div>
        <div className="p-3 bg-starlightmix-bg border border-starlightmix-border rounded whitespace-pre-wrap text-sm text-starlightmix-text">
          {data.metadata.text}
        </div>
        <button
          onClick={() => handleCopy(data.metadata.text, "metadata")}
          className="mt-2 text-xs text-starlightmix-accent hover:underline"
        >
          {copied === "metadata" ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onRegenerate}
          className="flex-1 text-sm px-3 py-2 border border-starlightmix-border rounded hover:bg-starlightmix-bg transition"
        >
          🔄 Regenerate
        </button>
        <button
          onClick={() => downloadMetadataFile({ ...data })}
          className="flex-1 text-sm px-3 py-2 bg-starlightmix-accent text-white rounded hover:bg-opacity-90 transition"
        >
          ⬇️ Download as JSON
        </button>
      </div>
    </div>
  );
}

/**
 * Download metadata as JSON file
 */
function downloadMetadataFile(data: ExportedMetadata) {
  const json = {
    caption: data.caption.text,
    captionProvider: data.caption.provider,
    metadata: data.metadata.text,
    metadataProvider: data.metadata.provider,
    costSaved: data.costSaved,
    generatedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `metadata-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
