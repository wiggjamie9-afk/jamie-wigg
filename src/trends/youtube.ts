import type { Trend } from "../types.js";

const UA = "Mozilla/5.0 trendbot/0.1";

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

export async function fetchYouTubeTrending(): Promise<Trend[]> {
  const url = "https://www.youtube.com/feeds/videos.xml?chart=mostPopular";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return [];
  const xml = await res.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const now = new Date().toISOString();
  const out: Trend[] = [];
  let rank = entries.length;
  for (const e of entries) {
    const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = e.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const link = e.match(/<link[^>]*href="([^"]+)"/)?.[1];
    if (!id || !title) continue;
    out.push({
      source: "youtube",
      id: `yt:${id}`,
      title: decode(title.trim()),
      url: link || `https://www.youtube.com/watch?v=${id}`,
      score: rank,
      raw_score: rank,
      collected_at: now,
    });
    rank--;
  }
  return out;
}
