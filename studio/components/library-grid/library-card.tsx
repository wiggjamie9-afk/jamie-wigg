"use client";

/**
 * Single render card in the library grid (R8).
 *
 * Visual:
 *   - Thumbnail (lazy `URL.createObjectURL` of the row's thumbnail Blob).
 *   - Theme text (clamped to 2 lines).
 *   - Date (locale-formatted).
 *   - Scene count + aspect.
 *   - "Failed: N" pill if `meta.failedSceneIds.length > 0`.
 *
 * Actions:
 *   - "Download" — calls `getRender(id)` lazily, builds an object URL for the
 *     MP4, and triggers `<a download>`. The re-downloaded MP4 byte-for-byte
 *     matches what `saveRender` stored (we don't re-encode), satisfying the
 *     "re-download produces identical MP4" acceptance criterion.
 *   - "Delete" — bubbles up to the parent which owns the confirmation dialog.
 *
 * Blob URL lifecycle:
 *   - Thumbnail URLs are created on mount and revoked on unmount via
 *     `useObjectUrl` so we don't leak memory while the grid lives.
 *   - Download URLs are created+revoked inline inside the click handler — they
 *     only need to survive the synchronous click on the anchor.
 */

import { useEffect, useState } from "react";
import type { RenderMeta } from "../../lib/history";
import { getRender } from "../../lib/history";

type Props = {
  meta: RenderMeta;
  onRequestDelete: (id: string) => void;
};

export function LibraryCard({ meta, onRequestDelete }: Props) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [thumbLoading, setThumbLoading] = useState(true);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Lazily fetch the thumbnail Blob and produce a one-shot object URL.
  // We don't preload the MP4 — it's only fetched on Download click.
  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;
    (async () => {
      try {
        const row = await getRender(meta.id);
        if (cancelled) return;
        if (!row) {
          setThumbError("Thumbnail unavailable");
          setThumbLoading(false);
          return;
        }
        createdUrl = URL.createObjectURL(row.thumbnail);
        setThumbUrl(createdUrl);
        setThumbLoading(false);
      } catch (err) {
        if (cancelled) return;
        setThumbError(
          err instanceof Error ? err.message : "Could not load thumbnail",
        );
        setThumbLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [meta.id]);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      const row = await getRender(meta.id);
      if (!row) {
        // Record vanished between list and click. Surface to UI by re-throwing
        // an alert — the parent will refresh on next mount anyway.
        window.alert("That render is no longer available locally.");
        return;
      }
      const url = URL.createObjectURL(row.mp4);
      const a = document.createElement("a");
      a.href = url;
      a.download = makeDownloadFilename(row.meta);
      // Some browsers require the anchor to be in the DOM for download to fire.
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke after a tick — synchronous revocation can race the download
      // start in Firefox.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-rhythmix-lg)] border border-rhythmix-border-strong bg-rhythmix-surface shadow-sm transition-shadow duration-[var(--duration-rhythmix-base)] ease-[var(--ease-rhythmix-out)] hover:shadow-[var(--rhx-glow-magenta)]">
      <div className="relative aspect-video w-full overflow-hidden bg-rhythmix-deep">
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt={`Render thumbnail for ${meta.theme || "(untitled)"}`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-rhythmix-mono text-xs text-rhythmix-text-muted">
            {thumbLoading
              ? "Loading…"
              : thumbError || "No thumbnail"}
          </div>
        )}
        {meta.failedSceneIds.length > 0 ? (
          <span className="absolute right-2 top-2 rounded-full bg-[var(--color-rhythmix-warn-soft)] px-2 py-0.5 font-rhythmix-mono text-[11px] font-semibold text-rhythmix-warn ring-1 ring-rhythmix-warn/40">
            Failed: {meta.failedSceneIds.length}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 min-w-0">
        <div className="min-w-0">
          <h3
            className="line-clamp-2 font-rhythmix-display text-sm font-semibold leading-snug text-rhythmix-text break-words"
            title={meta.theme}
          >
            {meta.theme || "(untitled theme)"}
          </h3>
          <p className="mt-1 font-rhythmix-mono text-[11px] uppercase tracking-wider text-rhythmix-text-muted">
            {formatDate(meta.createdAt)} · {meta.sceneCount}{" "}
            {meta.sceneCount === 1 ? "scene" : "scenes"} · {meta.aspect}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="min-h-[44px] flex-1 rounded-[var(--radius-rhythmix-md)] bg-rhythmix-magenta px-3 py-2 text-xs font-semibold text-rhythmix-text hover:bg-rhythmix-pink focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan disabled:opacity-50 transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
          >
            {downloading ? "Preparing…" : "Download"}
          </button>
          <button
            type="button"
            onClick={() => onRequestDelete(meta.id)}
            className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] border border-rhythmix-border-strong bg-transparent px-3 py-2 text-xs font-medium text-rhythmix-text-soft hover:bg-rhythmix-surface-2 hover:text-rhythmix-text focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
            aria-label={`Delete render for ${meta.theme || "untitled"}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function formatDate(epochMs: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(epochMs));
  } catch {
    return new Date(epochMs).toISOString();
  }
}

function makeDownloadFilename(meta: RenderMeta): string {
  const safeTheme = (meta.theme || "rhythmix-render")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "rhythmix-render";
  const stamp = new Date(meta.createdAt)
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);
  return `${safeTheme}-${stamp}.mp4`;
}
