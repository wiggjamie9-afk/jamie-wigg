"use client";

import { useEffect, useRef } from "react";

/**
 * Accessible confirm-before-delete dialog (R8).
 *
 * Implementation choices:
 *   - We use a plain `<div role="dialog" aria-modal="true">` rather than the
 *     `<dialog>` element because Safari < 15.4 doesn't support showModal()
 *     reliably and our brand-styled overlay is easier as a div anyway.
 *   - Focus is trapped manually: on open we move focus to the Cancel button
 *     (the safe default), and we intercept Tab so it cycles between Cancel
 *     and Confirm. On close we restore focus to whatever opened us.
 *   - Escape closes via cancel. Backdrop click closes via cancel.
 *   - Confirm fires `onConfirm` (async-aware) then closes. The caller is
 *     responsible for the actual deleteRender() call so the dialog stays
 *     storage-agnostic.
 */

type Props = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmDeleteDialog(props: Props) {
  const {
    open,
    title,
    body,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
  } = props;

  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Capture the element that had focus before we opened, so we can restore
  // it on close — important for screen-reader continuity.
  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current =
      (document.activeElement as HTMLElement | null) ?? null;
    // Move focus to Cancel — safer default than Confirm for a destructive
    // dialog. (The user must tab to confirm or press the button explicitly.)
    queueMicrotask(() => cancelRef.current?.focus());

    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  // Escape = cancel. Tab cycle between the two buttons (simple 2-stop trap).
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
      // Backdrop. Click-to-cancel.
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-body"
        className="w-full max-w-sm rounded-[var(--radius-rhythmix-lg)] border border-rhythmix-border-strong bg-rhythmix-surface p-6 shadow-2xl"
      >
        <h2
          id="confirm-delete-title"
          className="font-rhythmix-display text-lg font-bold text-rhythmix-text"
        >
          {title}
        </h2>
        <p
          id="confirm-delete-body"
          className="mt-2 text-sm text-rhythmix-text-soft"
        >
          {body}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] border border-rhythmix-border-strong bg-transparent px-4 py-2 text-sm font-medium text-rhythmix-text-soft hover:bg-rhythmix-surface-2 hover:text-rhythmix-text focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => {
              // Fire-and-forget — the parent owns success/error UI.
              void onConfirm();
            }}
            className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] bg-rhythmix-danger px-4 py-2 text-sm font-semibold text-rhythmix-text hover:bg-rhythmix-pink focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
