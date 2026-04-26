import { fetchAll } from "@/lib/trends";

export const revalidate = 300;

export async function Ticker() {
  let items: { source: string; title: string }[] = [];
  try {
    const trends = await fetchAll();
    items = trends.slice(0, 24).map((t) => ({ source: t.source, title: t.title }));
  } catch {
    items = [];
  }

  if (items.length === 0) {
    items = [
      { source: "live", title: "Connect this site to the bot to see real trends here." },
    ];
  }

  const doubled = [...items, ...items];

  return (
    <div className="relative border-y border-bone-50/[0.06] bg-ink-900/40 py-3 marquee-mask">
      <div className="flex animate-ticker whitespace-nowrap will-change-transform">
        {doubled.map((it, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-3 text-sm text-bone-200/70">
            <span className="font-mono text-[10px] uppercase tracking-widest text-plasma-400/80">
              {it.source}
            </span>
            <span>{it.title}</span>
            <span className="text-bone-200/20">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
