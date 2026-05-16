"use client";

/**
 * Per-scene table for the render-progress view (T11).
 *
 * Mirrors the responsive pattern from `plan-editor`/`SceneRow`: a semantic
 * `<table>` on desktop (>=768px), stacked card layout on mobile via the
 * `md:` breakpoint. The stacked layout is the source of truth on iPhone
 * Safari (R9 / R12) — desktop is the enhancement.
 *
 * The table renders pure presentational state; it does not subscribe to
 * the runner directly. The parent `<RenderProgress />` owns the
 * `Map<sceneId, SceneRowState>` and re-renders this component on each
 * update.
 */

import type { Scene } from "../../lib/plan-storage";
import { SceneStatusPill, type SceneStatus } from "./scene-status-pill";

export interface SceneRowState {
  status: SceneStatus;
  attempt?: number;
  elapsedSec?: number;
  error?: string;
}

export interface ScenesTableProps {
  scenes: Scene[];
  /** Keyed by `scene.id`. Missing entries default to `queued`. */
  rows: Map<string, SceneRowState>;
  /**
   * Called with a scene id when the user clicks "Re-run" on a failed pill.
   * Pass `undefined` to disable the affordance (e.g. mid-render, or when
   * the renderer is already running a rerun). The pill suppresses the
   * button when this is omitted.
   */
  onRerun?: (sceneId: string) => void;
}

export function ScenesTable({ scenes, rows, onRerun }: ScenesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse text-sm md:min-w-[640px]"
        data-testid="scenes-table"
      >
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-rhythmix-border-strong text-left font-rhythmix-mono text-xs uppercase tracking-wider text-rhythmix-text-muted">
            <th className="px-3 py-2 font-medium" style={{ width: "12%" }}>
              Scene
            </th>
            <th className="px-3 py-2 font-medium" style={{ width: "16%" }}>
              Role
            </th>
            <th className="px-3 py-2 font-medium" style={{ width: "30%" }}>
              Model
            </th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {scenes.map((scene, i) => {
            const row = rows.get(scene.id) ?? { status: "queued" as const };
            return (
              <SceneTableRow
                key={scene.id}
                scene={scene}
                index={i}
                row={row}
                onRerun={onRerun}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface SceneTableRowProps {
  scene: Scene;
  index: number;
  row: SceneRowState;
  onRerun?: (sceneId: string) => void;
}

function SceneTableRow({ scene, index, row, onRerun }: SceneTableRowProps) {
  // Mobile layout: every <tr>/<td> becomes a flex card. Desktop: standard
  // table cells. The `md:` prefixed classes flip layouts at 768px exactly,
  // matching the plan-editor's break point.
  const rerunHandler = onRerun
    ? () => onRerun(scene.id)
    : undefined;

  return (
    <tr
      className="block border-b border-rhythmix-border-strong md:table-row md:border-b md:border-rhythmix-border-strong"
      data-testid={`scene-row-${scene.id}`}
    >
      <td className="block px-0 py-3 md:table-cell md:px-3 md:py-3">
        <div className="md:hidden font-rhythmix-mono text-xs uppercase tracking-wide text-rhythmix-text-muted">
          Scene
        </div>
        <div className="font-rhythmix-display font-bold text-rhythmix-text tabular-nums">
          {index + 1}
        </div>
      </td>
      <td className="block px-0 pb-2 md:table-cell md:px-3 md:py-3">
        <div className="md:hidden font-rhythmix-mono text-xs uppercase tracking-wide text-rhythmix-text-muted">
          Role
        </div>
        <div className="font-rhythmix-mono text-xs uppercase tracking-wider text-rhythmix-cyan">{scene.role}</div>
      </td>
      <td className="block px-0 pb-2 md:table-cell md:px-3 md:py-3 min-w-0">
        <div className="md:hidden font-rhythmix-mono text-xs uppercase tracking-wide text-rhythmix-text-muted">
          Model
        </div>
        <div className="font-rhythmix-mono text-xs text-rhythmix-text-soft break-all">
          {scene.model}
        </div>
      </td>
      <td className="block px-0 pb-4 md:table-cell md:px-3 md:py-3 min-w-0">
        <div className="md:hidden font-rhythmix-mono text-xs uppercase tracking-wide text-rhythmix-text-muted mb-1">
          Status
        </div>
        <SceneStatusPill
          status={row.status}
          attempt={row.attempt}
          elapsedSec={row.elapsedSec}
          onRerun={row.status === "failed" ? rerunHandler : undefined}
        />
        {row.status === "failed" && row.error && (
          <p className="mt-1 text-xs text-rhythmix-magenta break-words max-w-prose">
            {row.error}
          </p>
        )}
      </td>
    </tr>
  );
}

export default ScenesTable;
