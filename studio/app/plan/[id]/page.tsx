import { PlanEditor } from "../../../components/plan-editor/plan-editor";

/**
 * Static export contract (N1):
 *   - `output: "export"` in next.config.ts produces a static bundle.
 *   - Dynamic `[id]` routes need either `generateStaticParams()` returning
 *     a known set, or be marked as dynamic. Plan IDs are generated
 *     client-side (`crypto.getRandomValues`), so there's no static set
 *     to enumerate — we return `[]` and rely on `dynamic = "force-static"`
 *     plus Cloudflare Pages' SPA fallback (configured separately) to
 *     serve this page for any `/plan/<anything>/` URL.
 *
 *   - The actual ID is read from `params.id` and consumed by the client
 *     component below; the server portion does no per-ID work.
 */
export const dynamic = "force-static";

export function generateStaticParams(): Array<{ id: string }> {
  return [{ id: "_" }];
}

export const metadata = {
  title: "Plan · RHYTHMIX Studio",
};

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 15 hands `params` as a Promise on the server side. Awaiting
  // unwraps it for the page body; the resolved id is then passed to the
  // client `<PlanEditor>` for hydration.
  const { id } = await params;
  return <PlanEditor planId={id} />;
}
