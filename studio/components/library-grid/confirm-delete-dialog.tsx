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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-body"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2
          id="confirm-delete-title"
          className="text-lg font-semibold text-neutral-900"
        >
          {title}
        </h2>
        <p
          id="confirm-delete-body"
          className="mt-2 text-sm text-neutral-600"
        >
          {body}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-[44px] rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
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
            className="min-h-[44px] rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
