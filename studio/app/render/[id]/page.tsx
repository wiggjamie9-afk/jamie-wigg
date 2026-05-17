import { RenderProgress } from "../../../components/render-progress/render-progress";

/**
 * `/render/[id]` page (T11).
 *
 * Same static-export contract as `/plan/[id]`:
 *   - `output: "export"` in next.config.ts produces a fully static bundle.
 *   - Dynamic `[id]` segments need either a static set of params or
 *     `dynamic = "force-static"` + empty `generateStaticParams()` plus a
 *     Cloudflare Pages SPA fallback (configured at deploy time) so any
 *     `/render/<anything>/` URL resolves to this page.
 *   - Plan IDs are minted client-side (`crypto.getRandomValues`), so
 *     enumerating them at build time is impossible.
 *
 * All per-render work happens inside `<RenderProgress>`, which is a
 * `"use client"` component. The server wrapper does no per-ID I/O.
 */
export const dynamic = "force-static";

export function generateStaticParams(): Array<{ id: string }> {
  return [{ id: "_" }];
}

export const metadata = {
  title: "Rendering · STARLIGHTMIX Studio",
};

export default async function RenderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 15 hands `params` as a Promise on the server. Awaiting unwraps
  // it for the page body; the resolved id is then passed to the client
  // component for hydration.
  const { id } = await params;
  return <RenderProgress planId={id} />;
}
