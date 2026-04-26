import { fetchAll, type WebTrend } from "@/lib/trends";

export const revalidate = 300;

const sourceMeta: Record<WebTrend["source"], { label: string; tint: string }> = {
  reddit: { label: "reddit", tint: "text-ember-400" },
  hackernews: { label: "hacker news", tint: "text-ember-400" },
  google: { label: "google trends", tint: "text-plasma-400" },
  youtube: { label: "youtube", tint: "text-ember-400" },
};

export async function LiveTrends() {
  let trends: WebTrend[] = [];
  let networkOk = true;
  try {
    trends = (await fetchAll()).slice(0, 9);
  } catch {
    networkOk = false;
  }

  return (
    <section id="live" className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-plasma-400/80">
            right now, around the world
          </p>
          <h3 className="mt-3 font-display text-4xl leading-tight text-display-gradient sm:text-5xl">
            Live trend feed.
          </h3>
          <p className="mt-4 text-bone-200/60">
            Pulled fresh on every page load. Same data the bot uses to decide
            what to draft next.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-bone-200/50">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-plasma-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-plasma-400" />
          </span>
          <span className="font-mono uppercase tracking-widest">
            {networkOk && trends.length > 0 ? `${trends.length} live` : "offline"}
          </span>
        </div>
      </div>

      {trends.length === 0 ? (
        <div className="card rounded-2xl p-10 text-center text-bone-200/60">
          <p className="font-display text-xl text-bone-50">
            No trends fetched yet.
          </p>
          <p className="mt-2 text-sm">
            This page fetches Reddit, Hacker News, and Google Trends server-side.
            If you&rsquo;re seeing this on Vercel, the request likely succeeded — try
            refreshing. Locally, check that outbound HTTPS works.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {trends.map((t, i) => (
            <a
              key={i}
              href={t.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover group relative block overflow-hidden rounded-2xl p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${sourceMeta[t.source].tint}`}>
                  {sourceMeta[t.source].label}
                </span>
                <span className="font-mono text-[10px] text-bone-200/40">
                  #{(i + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <p className="mt-5 line-clamp-3 font-display text-lg leading-snug text-bone-50">
                {t.title}
              </p>
              {t.subreddit && (
                <p className="mt-3 text-xs text-bone-200/40">r/{t.subreddit}</p>
              )}
              <div className="mt-6 h-[2px] w-full overflow-hidden rounded-full bg-bone-50/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-plasma-500 via-violet-500 to-ember-500"
                  style={{ width: `${Math.min(100, Math.max(8, t.score * 100))}%` }}
                />
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
