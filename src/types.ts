export interface Trend {
  source: "reddit" | "hackernews" | "google" | "youtube";
  id: string;
  title: string;
  url?: string;
  score: number;
  raw_score: number;
  subreddit?: string;
  region?: string;
  collected_at: string;
}

export interface Draft {
  trend_id: string;
  source: Trend["source"];
  title: string;
  body: string;
  tags: string[];
  hook: string;
  why_it_matters: string;
  drafted_at: string;
}

export interface PostRecord {
  trend_id: string;
  platform: "reddit";
  target: string;
  url?: string;
  posted_at: string;
  dry_run: boolean;
}
