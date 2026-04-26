import type { Trend } from "../types.js";

const UA = "trendbot/0.1 (global trend aggregator)";

export async function fetchRedditTrending(limit = 25): Promise<Trend[]> {
  const url = `https://www.reddit.com/r/all/hot.json?limit=${limit}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Reddit ${res.status}`);
  const json: any = await res.json();
  const now = new Date().toISOString();
  const out: Trend[] = [];
  for (const child of json?.data?.children ?? []) {
    const d = child?.data;
    if (!d || d.stickied) continue;
    out.push({
      source: "reddit",
      id: `reddit:${d.id}`,
      title: String(d.title ?? "").trim(),
      url: d.url_overridden_by_dest || `https://reddit.com${d.permalink}`,
      score: Number(d.score ?? 0),
      raw_score: Number(d.score ?? 0),
      subreddit: d.subreddit,
      collected_at: now,
    });
  }
  return out;
}
