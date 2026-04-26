import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Draft, PostRecord, Trend } from "../types.js";

mkdirSync(resolve(process.cwd(), "data"), { recursive: true });
const db = new Database(resolve(process.cwd(), "data", "trendbot.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS trends (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    score REAL NOT NULL,
    raw_score REAL NOT NULL,
    subreddit TEXT,
    region TEXT,
    collected_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS drafts (
    trend_id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    tags TEXT NOT NULL,
    hook TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    drafted_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS posts (
    trend_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    target TEXT NOT NULL,
    url TEXT,
    posted_at TEXT NOT NULL,
    dry_run INTEGER NOT NULL,
    PRIMARY KEY (trend_id, platform, dry_run)
  );
`);

const insertTrend = db.prepare(`
  INSERT OR IGNORE INTO trends (id, source, title, url, score, raw_score, subreddit, region, collected_at)
  VALUES (@id, @source, @title, @url, @score, @raw_score, @subreddit, @region, @collected_at)
`);

const insertDraft = db.prepare(`
  INSERT OR REPLACE INTO drafts (trend_id, source, title, body, tags, hook, why_it_matters, drafted_at)
  VALUES (@trend_id, @source, @title, @body, @tags, @hook, @why_it_matters, @drafted_at)
`);

const insertPost = db.prepare(`
  INSERT OR REPLACE INTO posts (trend_id, platform, target, url, posted_at, dry_run)
  VALUES (@trend_id, @platform, @target, @url, @posted_at, @dry_run)
`);

const getLastLivePost = db.prepare(`
  SELECT posted_at FROM posts WHERE platform = 'reddit' AND dry_run = 0 ORDER BY posted_at DESC LIMIT 1
`);

const trendAlreadyDrafted = db.prepare(`SELECT 1 FROM drafts WHERE trend_id = ?`);
const trendAlreadyPostedLive = db.prepare(`SELECT 1 FROM posts WHERE trend_id = ? AND dry_run = 0`);

export function saveTrends(trends: Trend[]): number {
  const tx = db.transaction((list: Trend[]) => {
    let n = 0;
    for (const t of list) {
      const r = insertTrend.run({
        id: t.id,
        source: t.source,
        title: t.title,
        url: t.url ?? null,
        score: t.score,
        raw_score: t.raw_score,
        subreddit: t.subreddit ?? null,
        region: t.region ?? null,
        collected_at: t.collected_at,
      });
      n += r.changes;
    }
    return n;
  });
  return tx(trends);
}

export function saveDraft(d: Draft): void {
  insertDraft.run({
    trend_id: d.trend_id,
    source: d.source,
    title: d.title,
    body: d.body,
    tags: JSON.stringify(d.tags),
    hook: d.hook,
    why_it_matters: d.why_it_matters,
    drafted_at: d.drafted_at,
  });
}

export function savePost(p: PostRecord): void {
  insertPost.run({
    trend_id: p.trend_id,
    platform: p.platform,
    target: p.target,
    url: p.url ?? null,
    posted_at: p.posted_at,
    dry_run: p.dry_run ? 1 : 0,
  });
}

export function minutesSinceLastLivePost(): number | null {
  const row = getLastLivePost.get() as { posted_at: string } | undefined;
  if (!row) return null;
  const then = new Date(row.posted_at).getTime();
  return (Date.now() - then) / 60000;
}

export function isAlreadyDrafted(trendId: string): boolean {
  return !!trendAlreadyDrafted.get(trendId);
}

export function isAlreadyPostedLive(trendId: string): boolean {
  return !!trendAlreadyPostedLive.get(trendId);
}
