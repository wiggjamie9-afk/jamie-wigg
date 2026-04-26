import type { Trend } from "../types.js";

const UA = "Mozilla/5.0 trendbot/0.1";

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

function parseInt0(s: string | undefined): number {
  if (!s) return 0;
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export async function fetchGoogleTrends(geo = "US"): Promise<Trend[]> {
  const url = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${encodeURIComponent(geo)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Google Trends ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const now = new Date().toISOString();
  const out: Trend[] = [];
  for (const item of items) {
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const trafficMatch = item.match(/<ht:approx_traffic>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:approx_traffic>/);
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
    if (!titleMatch) continue;
    const title = decodeEntities(titleMatch[1].trim());
    if (!title) continue;
    const traffic = parseInt0(trafficMatch?.[1]);
    out.push({
      source: "google",
      id: `gt:${geo}:${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80)}`,
      title,
      url: linkMatch ? linkMatch[1].trim() : undefined,
      score: traffic || 1,
      raw_score: traffic,
      region: geo,
      collected_at: now,
    });
  }
  return out;
}
