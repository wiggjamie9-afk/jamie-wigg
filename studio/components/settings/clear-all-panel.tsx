"use client";

/**
 * "Clear all local data" danger zone for /settings (R16).
 *
 * Two-step destructive flow:
 *   1. User clicks the red button → confirm dialog opens.
 *   2. User clicks "Clear everything" inside the dialog → `clearAllLocalData()`
 *      runs, then we hard-reload to flush any in-memory caches (Zustand /
 *      React Query / SWR stores) that other components might be holding.
 *
 * We re-use the dialog visual pattern from `library-grid/confirm-delete-dialog`
 * (manual focus trap, Escape = cancel, backdrop click = cancel) but inline it
 * here so the settings page doesn't pull in the library-grid module.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { clearAllLocalData } from "../../lib/clear-all";

export function ClearAllPanel() {
  const [confirming, setConfirming] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClear = useCallback(async () => {
    setClearing(true);
    setError(null);
    try {
      await clearAllLocalData();
      // Hard reload — every React tree on the page might be holding state
      // pointing at data we just deleted. Easier to start fresh than to try
      // to notify every store individually.
      window.location.reload();
    } catch {
      setError("Couldn't clear all data. Reload the page and try again.");
      setClearing(false);
      setConfirming(false);
    }
  }, []);

  return (
    <section
      aria-labelledby="clear-all-heading"
      className="rounded-2xl border border-red-200 bg-red-50/40 p-5 sm:p-6"
    >
      <header className="mb-4">
        <h2
          id="clear-all-heading"
          className="text-lg font-semibold text-red-900"
        >
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-red-800">
          Wipes your saved token, license, plans, and render history from this
          device. Useful before selling or returning the device, or before
          handing off the browser.
        </p>
      </header>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={clearing}
        className="min-h-[44px] rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {clearing ? "Clearing…" : "Clear all local data"}
      </button>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={confirming && !clearing}
        onCancel={() => setConfirming(false)}
        onConfirm={() => void handleClear()}
      />
    </section>
  );
}

/**
 * Inline confirm dialog — same patterns as
 * `library-grid/confirm-delete-dialog.tsx` (focus trap, Escape, backdrop
 * click). Inlined to avoid a cross-module import.
 */
function ConfirmDialog(props: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { open, onCancel, onConfirm } = props;
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current =
      (document.activeElement as HTMLElement | null) ?? null;
    queueMicrotask(() => cancelRef.current?.focus());
    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key === "Tab") {
        const isShift = e.shiftKey;
        const active = document.activeElement;
        if (!isShift && active === confirmRef.current) {
          e.preventDefault();
          cancelRef.current?.focus();
        } else if (isShift && active === cancelRef.current) {
          e.preventDefault();
          confirmRef.current?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-all-confirm-title"
        aria-describedby="clear-all-confirm-body"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h3
          id="clear-all-confirm-title"
          className="text-lg font-semibold text-neutral-900"
        >
          Clear everything?
        </h3>
        <p
          id="clear-all-confirm-body"
          className="mt-2 text-sm text-neutral-600"
        >
          This removes your token, license, plans, and render history from this
          device. Can&rsquo;t be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-[44px] rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="min-h-[44px] rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear everything
          </button>
        </div>
      </div>
    </div>
  );
}
