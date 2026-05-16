"use client";

/**
 * `/library` grid (R8) — lists past renders from IndexedDB, supports
 * lazy re-download and hard-delete with confirmation.
 *
 * Responsibilities:
 *   - On mount, read `listRenders()` (metadata only — Blobs are loaded
 *     per-card on demand inside <LibraryCard>).
 *   - Empty state pointing the user back to /new.
 *   - Mount the <ConfirmDeleteDialog> with state held here, so the dialog is a
 *     single instance instead of one per card.
 *   - Host an <EvictionToast> imperative ref so the render flow (T11) can
 *     opt in to surfacing R7 eviction warnings; we don't drive it from here
 *     directly because no eviction occurs during library browsing.
 *
 * Loading / error handling:
 *   - Initial fetch shows a small "Loading…" placeholder.
 *   - If `listRenders()` throws (rare — only on quota / DB-corrupt), we show
 *     a non-fatal banner and an "empty-ish" grid. The user can still navigate
 *     to /new and retry; the deeper "Storage full" recovery flow is owned by
 *     the fallback screens module (T6 / unsupported route).
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deleteRender, listRenders, type RenderMeta } from "../../lib/history";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { EvictionToast, type EvictionToastHandle } from "./eviction-toast";
import { LibraryCard } from "./library-card";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; renders: RenderMeta[] }
  | { status: "error"; message: string };

export function LibraryGrid() {
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const toastRef = useRef<EvictionToastHandle | null>(null);

  const refresh = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const renders = await listRenders();
      setState({ status: "ready", renders });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Could not load history.",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const pendingTheme = useMemo(() => {
    if (!pendingDeleteId || state.status !== "ready") return "";
    return (
      state.renders.find((r) => r.id === pendingDeleteId)?.theme ?? ""
    );
  }, [pendingDeleteId, state]);

  const handleRequestDelete = useCallback((id: string) => {
    setPendingDeleteId(id);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (deleting) return; // ignore cancels mid-delete
    setPendingDeleteId(null);
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await deleteRender(pendingDeleteId);
      setPendingDeleteId(null);
      await refresh();
    } finally {
      setDeleting(false);
    }
  }, [pendingDeleteId, refresh]);

  return (
    <div>
      <EvictionToast ref={toastRef} />

      {state.status === "loading" || state.status === "idle" ? (
        <p className="py-12 text-center text-sm text-neutral-500">
          Loading your renders…
        </p>
      ) : null}

      {state.status === "error" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Couldn&rsquo;t load history.</p>
          <p className="mt-1 text-amber-800">{state.message}</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-3 rounded-md bg-amber-200 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-300"
          >
            Try again
          </button>
        </div>
      ) : null}

      {state.status === "ready" && state.renders.length === 0 ? (
        <EmptyState />
      ) : null}

      {state.status === "ready" && state.renders.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.renders.map((meta) => (
            <li key={meta.id}>
              <LibraryCard meta={meta} onRequestDelete={handleRequestDelete} />
            </li>
          ))}
        </ul>
      ) : null}

      <ConfirmDeleteDialog
        open={pendingDeleteId !== null}
        title="Delete this render?"
        body={
          pendingTheme
            ? `“${truncate(pendingTheme, 80)}” will be removed from this device. This can’t be undone.`
            : `This render will be removed from this device. This can’t be undone.`
        }
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
      <p className="text-sm font-medium text-neutral-700">
        No renders yet
      </p>
      <p className="mt-1 text-sm text-neutral-500">
        Render a plan to see it here.
      </p>
      <Link
        href="/new"
        className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700"
      >
        Start a new render
      </Link>
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
