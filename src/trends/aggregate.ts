import type { Trend } from "../types.js";
import { fetchRedditTrending } from "./reddit.js";
import { fetchHackerNewsTrending } from "./hackernews.js";
import { fetchGoogleTrends } from "./google.js";
import { fetchYouTubeTrending } from "./youtube.js";

const STOPWORDS = new Set([
  "the","a","an","of","and","or","to","in","on","for","at","with","is","was","are","be","by","from",
  "this","that","it","as","but","if","not","you","your","my","we","they","he","she","i","me","us",
  "his","her","their","our","its","s","t","d","ll","ve","re","m","do","does","did","has","have","had",
  "will","would","can","could","should","may","might","just","new","2024","2025","2026"
]);

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(w => w && !STOPWORDS.has(w) && w.length > 2);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function normalize(trends: Trend[]): Trend[] {
  if (trends.length === 0) return trends;
  const max = Math.max(...trends.map(t => t.raw_score), 1);
  return trends.map(t => ({ ...t, score: t.raw_score / max }));
}

export interface AggregateOptions {
  region?: string;
  redditLimit?: number;
  hnLimit?: number;
}

export interface AggregateResult {
  trends: Trend[];
  bySource: Record<string, number>;
  errors: { source: string; error: string }[];
}

export async function aggregateGlobalTrends(opts: AggregateOptions = {}): Promise<AggregateResult> {
  const errors: { source: string; error: string }[] = [];
  const settle = async <T,>(label: string, p: Promise<T[]>): Promise<T[]> => {
    try {
      return await p;
    } catch (e: any) {
      errors.push({ source: label, error: e?.message ?? String(e) });
      return [];
    }
  };

  const [reddit, hn, gt, yt] = await Promise.all([
    settle("reddit", fetchRedditTrending(opts.redditLimit ?? 25)),
    settle("hackernews", fetchHackerNewsTrending(opts.hnLimit ?? 20)),
    settle("google", fetchGoogleTrends(opts.region ?? "US")),
    settle("youtube", fetchYouTubeTrending()),
  ]);

  const all = [
    ...normalize(reddit),
    ...normalize(hn),
    ...normalize(gt),
    ...normalize(yt),
  ];

  // Cross-source deduping: if two trends from different sources share >0.5 jaccard, keep the higher-scored, boost it.
  const tokenized = all.map(t => ({ trend: t, toks: new Set(tokens(t.title)) }));
  const kept: typeof tokenized = [];
  for (const cur of tokenized.sort((a, b) => b.trend.score - a.trend.score)) {
    let merged = false;
    for (const k of kept) {
      if (k.trend.source !== cur.trend.source && jaccard(k.toks, cur.toks) >= 0.5) {
        k.trend.score = Math.min(1, k.trend.score + cur.trend.score * 0.4);
        merged = true;
        break;
      }
    }
    if (!merged) kept.push(cur);
  }

  const sorted = kept.map(k => k.trend).sort((a, b) => b.score - a.score);

  return {
    trends: sorted,
    bySource: {
      reddit: reddit.length,
      hackernews: hn.length,
      google: gt.length,
      youtube: yt.length,
    },
    errors,
  };
}
