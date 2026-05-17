"use client";

import { useState } from "react";
import { MODELS } from "../../../rhythmix-studio/src/core/models.mjs";
import type { Plan } from "../../lib/plan-storage";

/**
 * Compact display of the dry-run cost estimate (R4). The actual cost
 * calculation lives in `core/models.mjs::estimateCost` — we just sum +
 * format here, plus a tooltip that surfaces the per-model rates so the
 * user can see *why* the number is what it is.
 *
 * The tooltip is intentionally a `<details>` rather than a hover popover
 * so it works under finger touch on iPhone Safari (R9). On desktop it
 * collapses to a discrete summary; on mobile the user taps to expand.
 */
export function CostSummary({ plan, costUsd }: { plan: Plan; costUsd: number }) {
  const [open, setOpen] = useState(false);

  // Per-model breakdown so the tooltip actually says something useful.
  // Sorting by clip-count, descending, puts the expensive contributors
  // at the top — useful when the user is hunting for the line to cut.
  const byModel = new Map<string, number>();
  for (const s of plan.scenes) {
    byModel.set(s.model, (byModel.get(s.model) ?? 0) + 1);
  }
  const rows = Array.from(byModel.entries())
    .map(([model, count]) => {
      const m = MODELS[model];
      const rate = m?.estimatedUsdPerClip ?? 1;
      return {
        model,
        label: m?.label ?? model,
        count,
        rate,
        subtotal: rate * count,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-starlightmix-surface px-4 py-3 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-starlightmix-mono text-xs uppercase tracking-wider text-starlightmix-text-muted">Estimated cost</span>
        <span className="font-starlightmix-display text-2xl font-black tabular-nums slm-text-gold">
          ~${costUsd.toFixed(2)}
        </span>
      </div>
      <button
        type="button"
        data-compact
        onClick={() => setOpen((v) => !v)}
        className="mt-1 inline-flex items-center font-starlightmix-mono text-xs text-starlightmix-cyan underline-offset-2 hover:underline focus:outline-none focus:underline"
        aria-expanded={open}
      >
        {open ? "Hide breakdown" : "What's in this number?"}
      </button>
      {open && (
        <div className="mt-3 space-y-2 text-xs text-starlightmix-text-soft">
          <p className="text-starlightmix-text-muted">
            Approximate; actual cost depends on Replicate&apos;s billing. Per-model
            rates come from the engine&apos;s model registry.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-1">
              <thead>
                <tr className="text-left font-starlightmix-mono uppercase tracking-wide text-starlightmix-text-muted">
                  <th className="font-normal">Model</th>
                  <th className="font-normal tabular-nums">Clips</th>
                  <th className="font-normal tabular-nums">Rate</th>
                  <th className="font-normal text-right tabular-nums">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.model} className="text-starlightmix-text-soft">
                    <td className="pr-2 break-words">{r.label}</td>
                    <td className="tabular-nums">{r.count}</td>
                    <td className="tabular-nums">${r.rate.toFixed(2)}</td>
                    <td className="text-right tabular-nums">
                      ${r.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
