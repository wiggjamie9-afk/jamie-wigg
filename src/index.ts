import { config, hasRedditCreds } from "./config.js";
import { aggregateGlobalTrends } from "./trends/aggregate.js";
import { draftPost, offlineDraftStub } from "./content/draft.js";
import { postToReddit } from "./post/reddit.js";
import {
  saveTrends,
  saveDraft,
  savePost,
  minutesSinceLastLivePost,
  isAlreadyPostedLive,
} from "./store/db.js";
import type { Draft, PostRecord, Trend } from "./types.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

interface RunOptions {
  dryRun: boolean;
  trendsOnly: boolean;
  loop: boolean;
  loopIntervalMinutes: number;
}

function parseArgs(argv: string[]): RunOptions {
  return {
    dryRun: argv.includes("--dry-run"),
    trendsOnly: argv.includes("--trends-only"),
    loop: argv.includes("--loop"),
    loopIntervalMinutes: parseInt(
      argv.find((a) => a.startsWith("--interval="))?.split("=")[1] ?? "30",
      10,
    ),
  };
}

function rateGate(): { ok: boolean; reason?: string } {
  const mins = minutesSinceLastLivePost();
  if (mins === null) return { ok: true };
  if (mins < config.minMinutesBetweenPosts) {
    return {
      ok: false,
      reason: `last live post ${mins.toFixed(1)} min ago (min ${config.minMinutesBetweenPosts})`,
    };
  }
  return { ok: true };
}

function pickTopUnposted(trends: Trend[], n: number): Trend[] {
  const out: Trend[] = [];
  for (const t of trends) {
    if (out.length >= n) break;
    if (isAlreadyPostedLive(t.id)) continue;
    if (!t.title || t.title.length < 8) continue;
    out.push(t);
  }
  return out;
}

async function runOnce(opts: RunOptions): Promise<void> {
  const stamp = new Date().toISOString();
  console.log(`\n=== trendbot run @ ${stamp} (${opts.dryRun ? "DRY-RUN" : "LIVE"}) ===`);

  console.log("Fetching trends from Reddit, HackerNews, Google Trends, YouTube...");
  const agg = await aggregateGlobalTrends({ region: config.region });
  console.log(`Sources: ${JSON.stringify(agg.bySource)}`);
  if (agg.errors.length) {
    console.log(`Source errors: ${JSON.stringify(agg.errors)}`);
  }
  console.log(`Total unique trends after dedupe: ${agg.trends.length}`);
  saveTrends(agg.trends);

  console.log("\nTop 10 trends:");
  for (const [i, t] of agg.trends.slice(0, 10).entries()) {
    console.log(
      `  ${(i + 1).toString().padStart(2)}. [${t.source.padEnd(10)}] (${t.score.toFixed(3)}) ${t.title.slice(0, 110)}`,
    );
  }

  if (opts.trendsOnly) return;

  if (!opts.dryRun) {
    const gate = rateGate();
    if (!gate.ok) {
      console.log(`\nRate limit: skipping live post (${gate.reason}).`);
      return;
    }
    if (!hasRedditCreds()) {
      console.log("\nReddit credentials missing -- cannot post live. Run with --dry-run or fill .env.");
      return;
    }
  }

  const candidates = pickTopUnposted(agg.trends, config.maxPostsPerRun);
  if (candidates.length === 0) {
    console.log("\nNo unposted candidates this run.");
    return;
  }

  const drafts: Draft[] = [];
  for (const trend of candidates) {
    console.log(`\nDrafting for: ${trend.title.slice(0, 100)}`);
    let draft: Draft;
    try {
      draft = config.anthropicApiKey ? await draftPost(trend) : offlineDraftStub(trend);
    } catch (e: any) {
      console.log(`  Drafter error: ${e?.message ?? e}`);
      continue;
    }
    saveDraft(draft);
    drafts.push(draft);
    console.log(`  Title: ${draft.title}`);
    console.log(`  Hook:  ${draft.hook}`);
    console.log(`  Body:  ${draft.body.slice(0, 200)}${draft.body.length > 200 ? "..." : ""}`);
    console.log(`  Tags:  ${draft.tags.join(", ")}`);
  }

  if (opts.dryRun) {
    mkdirSync(resolve(process.cwd(), "data"), { recursive: true });
    const previewPath = resolve(process.cwd(), "data", "last-dry-run.json");
    writeFileSync(
      previewPath,
      JSON.stringify(
        {
          ran_at: stamp,
          source_counts: agg.bySource,
          source_errors: agg.errors,
          top_trends: agg.trends.slice(0, 15),
          drafts,
        },
        null,
        2,
      ),
    );
    console.log(`\nDry-run preview saved to ${previewPath}`);
    for (const d of drafts) {
      const stub: PostRecord = {
        trend_id: d.trend_id,
        platform: "reddit",
        target: config.reddit.targetSubreddit || "(none)",
        posted_at: new Date().toISOString(),
        dry_run: true,
      };
      savePost(stub);
    }
    return;
  }

  for (const d of drafts) {
    try {
      console.log(`\nPosting "${d.title}" to r/${config.reddit.targetSubreddit}...`);
      const rec = await postToReddit(d);
      savePost(rec);
      console.log(`  Posted: ${rec.url ?? "(no url returned)"}`);
    } catch (e: any) {
      console.log(`  Post failed: ${e?.message ?? e}`);
    }
  }
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.loop) {
    await runOnce(opts);
    return;
  }
  console.log(`Loop mode: every ${opts.loopIntervalMinutes} minutes. Ctrl-C to stop.`);
  for (;;) {
    try {
      await runOnce(opts);
    } catch (e: any) {
      console.error(`Run failed: ${e?.message ?? e}`);
    }
    await new Promise((r) => setTimeout(r, opts.loopIntervalMinutes * 60_000));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
