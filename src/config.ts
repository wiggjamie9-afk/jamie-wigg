import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv(): void {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

export const config = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  model: process.env.TRENDBOT_MODEL ?? "claude-sonnet-4-6",
  region: process.env.TRENDBOT_REGION ?? "US",
  maxPostsPerRun: parseInt(process.env.TRENDBOT_MAX_POSTS_PER_RUN ?? "1", 10),
  minMinutesBetweenPosts: parseInt(process.env.TRENDBOT_MIN_MINUTES_BETWEEN_POSTS ?? "120", 10),
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID ?? "",
    clientSecret: process.env.REDDIT_CLIENT_SECRET ?? "",
    username: process.env.REDDIT_USERNAME ?? "",
    password: process.env.REDDIT_PASSWORD ?? "",
    userAgent: process.env.REDDIT_USER_AGENT ?? "trendbot/0.1",
    targetSubreddit: process.env.REDDIT_TARGET_SUBREDDIT ?? "",
  },
};

export function hasRedditCreds(): boolean {
  const r = config.reddit;
  return !!(r.clientId && r.clientSecret && r.username && r.password && r.targetSubreddit);
}
