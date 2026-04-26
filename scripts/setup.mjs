#!/usr/bin/env node
// Interactive setup wizard. Walks the user through each credential and
// tests that it works. Run with: npm run setup

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const ENV_PATH = resolve(process.cwd(), ".env");
const ENV_EXAMPLE_PATH = resolve(process.cwd(), ".env.example");

const rl = createInterface({ input, output });
const ask = (q) => rl.question(q);
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

function loadEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const text = readFileSync(ENV_PATH, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

function saveEnv(env) {
  const lines = [];
  for (const [k, v] of Object.entries(env)) lines.push(`${k}=${v}`);
  writeFileSync(ENV_PATH, lines.join("\n") + "\n", "utf8");
}

async function ensureEnvFileExists() {
  if (existsSync(ENV_PATH)) return;
  if (existsSync(ENV_EXAMPLE_PATH)) {
    writeFileSync(ENV_PATH, readFileSync(ENV_EXAMPLE_PATH, "utf8"));
    console.log(c.dim("  Created .env from .env.example"));
  } else {
    writeFileSync(ENV_PATH, "");
  }
}

async function testAnthropic(key) {
  if (!key) return { ok: false, msg: "no key set" };
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4,
        messages: [{ role: "user", content: "hi" }],
      }),
    });
    if (res.status === 401) return { ok: false, msg: "key rejected (401)" };
    if (!res.ok) return { ok: false, msg: `${res.status} ${res.statusText}` };
    return { ok: true, msg: "key works" };
  } catch (e) {
    return { ok: false, msg: e.message };
  }
}

async function testReddit(env) {
  const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD, REDDIT_USER_AGENT } = env;
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_USERNAME || !REDDIT_PASSWORD) {
    return { ok: false, msg: "missing one or more Reddit fields" };
  }
  try {
    const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString("base64");
    const body = new URLSearchParams({
      grant_type: "password",
      username: REDDIT_USERNAME,
      password: REDDIT_PASSWORD,
    });
    const res = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": REDDIT_USER_AGENT || "trendbot-setup/0.1",
      },
      body,
    });
    if (!res.ok) return { ok: false, msg: `${res.status} -- check creds + 2FA off for the script app` };
    const j = await res.json();
    if (!j.access_token) return { ok: false, msg: "no token returned" };
    return { ok: true, msg: "credentials accepted" };
  } catch (e) {
    return { ok: false, msg: e.message };
  }
}

function header(s) {
  console.log("\n" + c.bold(c.cyan("━━ " + s + " ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━").slice(0, 80)));
}

async function main() {
  console.log(c.bold("\n  trendbot setup wizard\n"));
  console.log(c.dim("  Walks you through each credential. Skip any with [Enter]."));
  console.log(c.dim("  Nothing in this wizard leaves your machine.\n"));

  await ensureEnvFileExists();
  const env = loadEnv();

  // ─── Anthropic ──────────────────────────────────────────────────────────
  header("1. Anthropic API key (required for drafting)");
  console.log("  Get one at: " + c.cyan("https://console.anthropic.com"));
  console.log("  Free tier: $5 of credit, no card needed to start.");
  console.log("  Looks like: sk-ant-... (about 100 chars)\n");
  console.log("  Current value: " + (env.ANTHROPIC_API_KEY ? c.green("set (" + env.ANTHROPIC_API_KEY.slice(0, 12) + "...)") : c.yellow("not set")));
  const newKey = await ask("  Paste key (or [Enter] to keep current): ");
  if (newKey.trim()) env.ANTHROPIC_API_KEY = newKey.trim();

  if (env.ANTHROPIC_API_KEY) {
    process.stdout.write(c.dim("  Testing key... "));
    const r = await testAnthropic(env.ANTHROPIC_API_KEY);
    console.log(r.ok ? c.green("✓ " + r.msg) : c.red("✗ " + r.msg));
  }

  // ─── Reddit ────────────────────────────────────────────────────────────
  header("2. Reddit app (required for posting)");
  console.log("  Create one at: " + c.cyan("https://www.reddit.com/prefs/apps"));
  console.log("  Click 'are you a developer? create an app...'");
  console.log("  Type: " + c.bold("script") + ", redirect uri: http://localhost:8080");
  console.log("  Then copy the client ID (under the app name) and client secret.\n");
  console.log("  Note: 2FA must be OFF on the Reddit account for password grant.\n");

  const fields = [
    ["REDDIT_CLIENT_ID", "Client ID (~14 chars under app name)"],
    ["REDDIT_CLIENT_SECRET", "Client secret (~27 chars)"],
    ["REDDIT_USERNAME", "Reddit username"],
    ["REDDIT_PASSWORD", "Reddit password"],
  ];
  for (const [key, label] of fields) {
    const cur = env[key] ? c.green(`set (${env[key].slice(0, 4)}...)`) : c.yellow("not set");
    console.log("  " + label + ": " + cur);
    const v = await ask("  New value (or [Enter] to keep): ");
    if (v.trim()) env[key] = v.trim();
  }

  if (!env.REDDIT_USER_AGENT) {
    env.REDDIT_USER_AGENT = `trendbot/0.1 by ${env.REDDIT_USERNAME || "anon"}`;
    console.log(c.dim(`  Set REDDIT_USER_AGENT = "${env.REDDIT_USER_AGENT}"`));
  }

  if (!env.REDDIT_TARGET_SUBREDDIT) {
    const tgt = `u_${env.REDDIT_USERNAME || "yourname"}`;
    env.REDDIT_TARGET_SUBREDDIT = tgt;
    console.log(c.dim(`  Set REDDIT_TARGET_SUBREDDIT = "${tgt}" (your own profile, always safe)`));
  }

  process.stdout.write(c.dim("  Testing Reddit credentials... "));
  const rr = await testReddit(env);
  console.log(rr.ok ? c.green("✓ " + rr.msg) : c.red("✗ " + rr.msg));

  // ─── Defaults ──────────────────────────────────────────────────────────
  if (!env.TRENDBOT_REGION) env.TRENDBOT_REGION = "US";
  if (!env.TRENDBOT_MAX_POSTS_PER_RUN) env.TRENDBOT_MAX_POSTS_PER_RUN = "1";
  if (!env.TRENDBOT_MIN_MINUTES_BETWEEN_POSTS) env.TRENDBOT_MIN_MINUTES_BETWEEN_POSTS = "120";
  if (!env.TRENDBOT_MODEL) env.TRENDBOT_MODEL = "claude-sonnet-4-6";

  // ─── Save ──────────────────────────────────────────────────────────────
  saveEnv(env);
  header("done");
  console.log("  " + c.green("✓") + " Saved to .env (gitignored, never leaves your machine).");
  console.log("\n  Next:");
  console.log("    " + c.bold("npm run dry-run") + "    -- preview what the bot would post");
  console.log("    " + c.bold("npm run live") + "       -- actually post one item");
  console.log("    " + c.bold("npm run loop") + "       -- run continuously every 60 min\n");

  rl.close();
}

main().catch((e) => {
  console.error(c.red("\n✗ Setup failed: " + e.message));
  rl.close();
  process.exit(1);
});
