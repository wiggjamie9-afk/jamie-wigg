import type { Trend } from "../types.js";

export async function fetchHackerNewsTrending(limit = 20): Promise<Trend[]> {
  const idsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  if (!idsRes.ok) throw new Error(`HN topstories ${idsRes.status}`);
  const ids: number[] = await idsRes.json();
  const slice = ids.slice(0, limit);
  const items = await Promise.all(
    slice.map(async (id) => {
      const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return r.ok ? r.json() : null;
    }),
  );
  const now = new Date().toISOString();
  const out: Trend[] = [];
  for (const it of items) {
    if (!it || !it.title) continue;
    out.push({
      source: "hackernews",
      id: `hn:${it.id}`,
      title: String(it.title).trim(),
      url: it.url || `https://news.ycombinator.com/item?id=${it.id}`,
      score: Number(it.score ?? 0),
      raw_score: Number(it.score ?? 0),
      collected_at: now,
    });
  }
  return out;
}
