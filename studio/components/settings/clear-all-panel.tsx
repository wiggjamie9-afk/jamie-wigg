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
      className="rounded-[var(--radius-rhythmix-lg)] border border-starlightmix-magenta/40 bg-[var(--color-rhythmix-danger-soft)] p-5 sm:p-6"
    >
      <header className="mb-4">
        <h2
          id="clear-all-heading"
          className="font-starlightmix-display text-lg font-bold text-starlightmix-magenta"
        >
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-starlightmix-text-soft">
          Wipes your saved token, license, plans, and render history from this
          device. Useful before selling or returning the device, or before
          handing off the browser.
        </p>
      </header>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={clearing}
        aria-disabled={clearing}
        className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] bg-starlightmix-danger px-4 py-2 text-sm font-semibold text-starlightmix-text hover:bg-starlightmix-pink disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-starlightmix-cyan transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
      >
        {clearing ? "Clearing…" : "Clear all local data"}
      </button>

      <div aria-live="polite" aria-atomic="true">
        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-[var(--radius-rhythmix-md)] border border-starlightmix-magenta/40 bg-[var(--color-rhythmix-danger-soft)] px-3 py-2 text-sm text-starlightmix-magenta"
          >
            {error}
          </p>
        ) : null}
      </div>

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-all-confirm-title"
        aria-describedby="clear-all-confirm-body"
        className="w-full max-w-sm rounded-[var(--radius-rhythmix-lg)] border border-starlightmix-border-strong bg-starlightmix-surface p-6 shadow-2xl"
      >
        <h3
          id="clear-all-confirm-title"
          className="font-starlightmix-display text-lg font-bold text-starlightmix-text"
        >
          Clear everything?
        </h3>
        <p
          id="clear-all-confirm-body"
          className="mt-2 text-sm text-starlightmix-text-soft"
        >
          This removes your token, license, plans, and render history from this
          device. Can&rsquo;t be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            aria-label="Cancel clearing all local data"
            className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] border border-starlightmix-border-strong bg-transparent px-4 py-2 text-sm font-medium text-starlightmix-text-soft hover:bg-starlightmix-surface-2 hover:text-starlightmix-text focus:outline-none focus-visible:ring-2 focus-visible:ring-starlightmix-cyan transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            aria-label="Permanently clear all local data from this device"
            className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] bg-starlightmix-danger px-4 py-2 text-sm font-semibold text-starlightmix-text hover:bg-starlightmix-pink focus:outline-none focus-visible:ring-2 focus-visible:ring-starlightmix-cyan transition-colors duration-[var(--duration-starlightmix-fast)] ease-[var(--ease-starlightmix-out)]"
          >
            Clear everything
          </button>
        </div>
      </div>
    </div>
  );
}
