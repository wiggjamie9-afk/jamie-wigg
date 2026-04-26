// Lightweight trend fetchers for the website. Mirrors src/trends/* in the bot.
// Self-contained so the web app deploys independently.

export interface WebTrend {
  source: "reddit" | "hackernews" | "google" | "youtube";
  title: string;
  url?: string;
  score: number;
  subreddit?: string;
}

const UA = "trendbot-web/0.1 (https://github.com/)";

async function safe<T>(p: Promise<T[]>, _label: string): Promise<T[]> {
  try {
    return await p;
  } catch {
    return [];
  }
}

async function reddit(): Promise<WebTrend[]> {
  const r = await fetch("https://www.reddit.com/r/all/hot.json?limit=20", {
    headers: { "User-Agent": UA },
    next: { revalidate: 300 },
  });
  if (!r.ok) throw new Error(`reddit ${r.status}`);
  const j: any = await r.json();
  const max = Math.max(1, ...(j?.data?.children ?? []).map((c: any) => Number(c?.data?.score ?? 0)));
  return (j?.data?.children ?? [])
    .filter((c: any) => c?.data && !c.data.stickied)
    .slice(0, 12)
    .map((c: any) => ({
      source: "reddit" as const,
      title: String(c.data.title).trim(),
      url: c.data.url_overridden_by_dest || `https://reddit.com${c.data.permalink}`,
      score: Number(c.data.score) / max,
      subreddit: c.data.subreddit,
    }));
}

async function hackernews(): Promise<WebTrend[]> {
  const idsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    next: { revalidate: 300 },
  });
  if (!idsRes.ok) throw new Error(`hn ${idsRes.status}`);
  const ids: number[] = await idsRes.json();
  const items = await Promise.all(
    ids.slice(0, 12).map(async (id) => {
      const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        next: { revalidate: 300 },
      });
      return r.ok ? r.json() : null;
    }),
  );
  const max = Math.max(1, ...items.filter(Boolean).map((i: any) => Number(i.score ?? 0)));
  return items
    .filter((i: any): i is any => i && i.title)
    .map((i: any) => ({
      source: "hackernews" as const,
      title: String(i.title).trim(),
      url: i.url || `https://news.ycombinator.com/item?id=${i.id}`,
      score: Number(i.score ?? 0) / max,
    }));
}

async function googleTrends(geo: string): Promise<WebTrend[]> {
  const r = await fetch(
    `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${encodeURIComponent(geo)}`,
    { headers: { "User-Agent": UA }, next: { revalidate: 600 } },
  );
  if (!r.ok) throw new Error(`google ${r.status}`);
  const xml = await r.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const out: WebTrend[] = [];
  for (const it of items) {
    const t = it.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
    const tr = it.match(/<ht:approx_traffic>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:approx_traffic>/)?.[1];
    if (!t) continue;
    out.push({
      source: "google",
      title: t.replace(/&amp;/g, "&").replace(/&#39;/g, "'"),
      score: Math.min(1, parseInt((tr ?? "0").replace(/[^0-9]/g, ""), 10) / 1_000_000),
    });
  }
  return out;
}

export async function fetchAll(geo = "US"): Promise<WebTrend[]> {
  const [r, h, g] = await Promise.all([
    safe(reddit(), "reddit"),
    safe(hackernews(), "hn"),
    safe(googleTrends(geo), "google"),
  ]);
  return [...r, ...h, ...g].sort((a, b) => b.score - a.score);
}
