# trendbot

Pipeline: **global trends → AI draft → Reddit publisher**, with SQLite logging,
rate limiting, and a dry-run mode.

## One-click deploys

| Click | What it deploys | Needs credentials? |
|-------|----------------|--------------------|
| [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwiggjamie9-afk%2Fjamie-wigg&root-directory=web&project-name=pulse&repository-name=jamie-wigg) | **Pulse landing page** (web/) | No — goes live in 60s as `*.vercel.app` |
| [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new) | **The bot** (root) — uses `railway.toml` config | Yes — Anthropic + Reddit env vars |

For the Vercel button: click → log in with GitHub → click Deploy. Done.
You can add a custom domain later from the Vercel dashboard.

For the Railway button: click → import this repo → paste env vars (see the
table at the bottom of `railway.toml`). Or run `npm run setup` locally first
to generate them step-by-step.

## What it does

1. **Aggregates trends** from four free sources (no auth needed for fetching):
   - Reddit `r/all/hot`
   - Hacker News top stories
   - Google Trends daily RSS (region configurable)
   - YouTube trending (RSS)
2. **Dedupes & ranks** — normalizes scores per source, then merges items that
   look like the same story across sources (Jaccard similarity on title tokens),
   boosting cross-source trends.
3. **Drafts a post** — Claude (model configurable, default `claude-sonnet-4-6`)
   turns the top trend into a Reddit-ready title + body + tags. Prompt caching
   is on, so repeat runs are cheap.
4. **Publishes to Reddit** via the official OAuth API, rate-limited.
5. **Logs everything** to `data/trendbot.db` (SQLite): trends seen, drafts
   produced, posts made (real and dry-run).

## Quick start (local)

```bash
npm install
npm run setup      # interactive wizard: walks you through every credential
                   # tests Anthropic + Reddit before saving

npm run trends     # just print global trends, no AI, no posting
npm run dry-run    # fetch + draft + show what it WOULD post (safe)
npm run live       # fetch + draft + actually post to Reddit (needs creds)
npm run loop       # live mode in a loop (default every 60 min)
```

The setup wizard creates `.env` for you. Skip any field with [Enter] to keep
its current value. Each credential is tested with a real API call before
the wizard closes — you'll know immediately if a key is wrong.

## What you need to set up

### Anthropic API key (required for drafting)

Get one at <https://console.anthropic.com>, then:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without it, drafting falls back to a stub that just echoes the trend (so
`--dry-run` still proves the pipeline works).

### Reddit credentials (required for live posting)

1. Go to <https://www.reddit.com/prefs/apps>, click **create app**, choose
   type **script**.
2. Note the **client ID** (under the app name) and **client secret**.
3. Fill `.env`:

```
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
REDDIT_USER_AGENT=trendbot/0.1 by your_reddit_username
REDDIT_TARGET_SUBREDDIT=u_your_reddit_username
```

`REDDIT_TARGET_SUBREDDIT` should be:
- `u_your_username` to post to **your own Reddit profile** (always allowed,
  always safe to start here), or
- The name of a subreddit you **own/moderate** (do NOT post bot content to
  subs you don't run — it will get you banned).

### Tuning

```
TRENDBOT_REGION=US                   # Google Trends geo
TRENDBOT_MAX_POSTS_PER_RUN=1         # never post more than N per run
TRENDBOT_MIN_MINUTES_BETWEEN_POSTS=120  # rate-limit guard between live posts
TRENDBOT_MODEL=claude-sonnet-4-6     # or claude-opus-4-7, claude-haiku-4-5-20251001
```

## Honest expectations

- **No bot can guarantee views.** Reach depends on the platform's algorithm,
  the niche, post timing, and the audience your account already has. A new
  account with no followers posting to its own profile will get few views,
  full stop. Build an audience by posting in places where people actually
  read — relevant niche subs *that allow self-promo*, with disclosure.
- **Read the rules first.** Reddit allows bots that are clearly disclosed and
  add value. Spamming will get the account suspended fast. Same for every
  other platform.
- **Money comes from the niche, not the engine.** This bot is the engine.
  Revenue requires: a niche audience cares about + a way to monetize
  (creator program, affiliate links, drive traffic to a product). The bot
  alone does not earn.
- **Fully autonomous = run it on a server.** Your laptop sleeping = no posts.
  Cheap options: a $5/mo VPS, a free Railway/Render worker, a Raspberry Pi,
  or `npm run loop` in a `tmux`/`screen` session on a machine that's always
  on.

## Files

```
src/
  config.ts              env loader + config object
  types.ts               Trend, Draft, PostRecord
  trends/
    reddit.ts            r/all/hot via public JSON
    hackernews.ts        HN top stories
    google.ts            Google Trends daily RSS
    youtube.ts           YouTube trending RSS
    aggregate.ts         normalize + dedupe + rank
  content/
    draft.ts             Claude API drafter (with prompt caching)
  post/
    reddit.ts            OAuth password grant + /api/submit
  store/
    db.ts                better-sqlite3 schema and writers
  index.ts               CLI entrypoint (--dry-run, --live, --trends-only, --loop)
data/                    SQLite + dry-run preview JSON (gitignored)
```

## Adding more platforms later

The publisher is isolated in `src/post/reddit.ts`. To add another platform,
write a new file with the same shape (`postTo<Platform>(draft) -> PostRecord`)
and call it from `src/index.ts`. Each platform needs its own developer
credentials.

## Safety notes

- The drafter system prompt forbids fabricated stats and clickbait; it asks
  for an open-ended question to invite real discussion.
- The publisher rate-limits via SQLite (last live post timestamp).
- `--dry-run` never calls the Reddit submit endpoint.
- `TRENDBOT_MAX_POSTS_PER_RUN=1` by default — start small.
