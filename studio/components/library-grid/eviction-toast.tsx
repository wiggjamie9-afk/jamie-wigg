"use client";

/**
 * Toast surfaced when `saveRender` evicts the oldest render to honour the
 * 50-cap (R7). Listens via the imperative ref API rather than a global event
 * bus — the render flow that calls `saveRender` passes our `pushEviction`
 * callback in as the `onToast` argument.
 *
 * Lifecycle:
 *   - Mounts a portal at the top of the viewport (z above the rest of the UI).
 *   - Each push appends to a stack of visible toasts.
 *   - Each toast auto-dismisses after 5 seconds.
 *   - Closing one doesn't disturb the others.
 *
 * No external deps — keeps the toast bundle tiny and avoids pulling in a
 * full toast lib (sonner / react-hot-toast) for a single one-off event class.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { ToastEvent } from "../../lib/history";

const DEFAULT_DURATION_MS = 5000;

type ToastInstance = {
  id: string;
  event: ToastEvent;
};

export type EvictionToastHandle = {
  pushEviction: (event: ToastEvent) => void;
};

type Props = {
  /** Override for testing — defaults to 5000ms (5s). */
  durationMs?: number;
};

/**
 * Imperative-handle so the parent (LibraryGrid / render flow) can call
 * `ref.current?.pushEviction(event)` from inside the `onToast` callback wired
 * into `saveRender`. We deliberately *don't* expose a context provider — the
 * eviction toast is local to the library/render UI, not an app-wide concern.
 */
export const EvictionToast = forwardRef<EvictionToastHandle, Props>(
  function EvictionToast({ durationMs = DEFAULT_DURATION_MS }, ref) {
    const [toasts, setToasts] = useState<ToastInstance[]>([]);
    const [mounted, setMounted] = useState(false);

    // Portals require document to exist — gate on mount so SSR / static build
    // doesn't try to call createPortal at render time.
    useEffect(() => {
      setMounted(true);
    }, []);

    const remove = useCallback((id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        pushEviction: (event: ToastEvent) => {
          const id =
            (typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `t-${Date.now()}-${Math.random().toString(36).slice(2)}`);
          setToasts((prev) => [...prev, { id, event }]);
        },
      }),
      [],
    );

    // Auto-dismiss: one timer per toast, cleaned up on unmount or list change.
    useEffect(() => {
      if (toasts.length === 0) return;
      const timers = toasts.map((t) =>
        window.setTimeout(() => remove(t.id), durationMs),
      );
      return () => {
        for (const tid of timers) window.clearTimeout(tid);
      };
    }, [toasts, durationMs, remove]);

    if (!mounted) return null;

    return createPortal(
      <div
        // Top-centre stack. Tailwind-only; nothing here depends on a global
        // toast container existing elsewhere in the layout.
        className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto w-full max-w-sm rounded-[var(--radius-rhythmix-md)] border border-rhythmix-border-strong bg-rhythmix-surface px-4 py-3 text-sm text-rhythmix-text shadow-2xl"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="font-rhythmix-display font-semibold text-rhythmix-text">
                  Oldest render removed
                </p>
                <p className="mt-0.5 text-xs text-rhythmix-text-soft break-words">
                  History caps at 50. We evicted &ldquo;
                  {truncate(t.event.victimTheme, 40)}&rdquo; to make room.
                </p>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                data-compact
                onClick={() => remove(t.id)}
                className="-mr-1 -mt-1 inline-flex h-8 w-8 items-center justify-center rounded p-1 text-rhythmix-text-muted hover:bg-rhythmix-surface-2 hover:text-rhythmix-text focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan"
              >
                <span aria-hidden>×</span>
              </button>
            </div>
          </div>
        ))}
      </div>,
      document.body,
    );
  },
);

function truncate(s: string, max: number): string {
  if (!s) return "(untitled)";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
