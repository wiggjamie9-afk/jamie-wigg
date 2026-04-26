# DEPLOY.md — running the bot autonomously

> Goal: bot runs every N hours without you touching it. You wake up to fresh
> drafts (review mode) or fresh posts (live mode). My laptop sleeping = no
> longer my problem.

## The cheapest paths, ranked

| Option | Cost | Setup | Best for |
|---|---|---|---|
| **Railway** | Free tier covers small bots | 10 min | First deploy, set-and-forget |
| **Render** | Free tier (sleeps after 15 min idle) | 10 min | Cron jobs |
| **Fly.io** | $0–$5/mo | 15 min | Always-on, no sleep |
| **Hetzner / DigitalOcean VPS** | $4–6/mo | 30 min | Power users, full control |
| **Raspberry Pi at home** | One-time hardware | 1 hr | If you already own one |

For your first run, **start with Railway**. It's the smallest possible thing
that works.

---

## Railway, step by step (10 minutes)

### 1. Push the repo to GitHub

You're already on `claude/install-claude-mem-CkCkZ`. Either merge to `main`
or deploy directly from the branch — Railway supports both.

### 2. Sign up at <https://railway.app>

GitHub login. They give you a small monthly credit on the free tier; the
bot's well within it.

### 3. New project → Deploy from GitHub repo

- Pick `wiggjamie9-afk/jamie-wigg`.
- Branch: `claude/install-claude-mem-CkCkZ` (or whatever you've merged into).
- **Root directory:** `/` (root — the bot's package.json is at repo root).
- **Build command:** `npm ci && npm run build`
- **Start command:** `node dist/index.js --loop --interval=60`
  (runs every 60 minutes; change to taste)

### 4. Add environment variables

In the Railway project → Variables, paste from your local `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USERNAME=...
REDDIT_PASSWORD=...
REDDIT_USER_AGENT=trendbot/0.1 by your_username
REDDIT_TARGET_SUBREDDIT=u_your_username
TRENDBOT_REGION=US
TRENDBOT_MAX_POSTS_PER_RUN=1
TRENDBOT_MIN_MINUTES_BETWEEN_POSTS=120
```

Railway encrypts these. They're never in the repo.

### 5. Deploy

Click. Watch the logs. First run pulls trends, drafts, posts, sleeps for 60
minutes, repeats.

### 6. Watch it work

- **Logs**: Railway dashboard → Deployments → tail logs.
- **What got posted**: your Reddit profile, sorted newest first.
- **What got drafted but not yet posted**: nothing in this setup; everything
  gets posted in live mode. To add a review step, see below.

---

## Switching to dry-run on the server

If you want it to run autonomously but **NOT actually post** (so you can see
what it would do for a few days first):

Change the start command to:

```
node dist/index.js --loop --dry-run --interval=60
```

Drafts will be saved to the SQLite log, nothing will hit Reddit. Connect to
Railway's shell to inspect `data/trendbot.db`, or expose a small read-only
HTTP endpoint later.

---

## Pulse landing page is separate

Don't deploy the bot and the site to the same Railway service. Different
shape:

- **Bot** → Railway worker (no public port, just runs).
- **Pulse** → Vercel (web/ root directory, free, automatic on every push).

Both deploy from the same GitHub repo, just different services.

---

## When to upgrade

You'll outgrow Railway free tier when:

- The bot runs 24/7 (sleeps less).
- You add more aggressive trend checking (every 15 min instead of 60).
- You start logging more than a few MB to SQLite.

At that point, $5/mo Hetzner CX11 VPS is the next step. Same code, more
breathing room. Migration is `scp` plus `pm2 start dist/index.js`.

---

## What I will NOT pretend

- **The bot does not generate revenue on its own.** It posts content. People
  click or don't, follow or don't, click affiliate links or don't. The bot
  is the engine; the niche, the audience, and the offer are still your job.
- **First posts will be small.** A new account posting to its own profile
  gets near-zero views regardless of content quality. That's the platform's
  recommender; it doesn't care about you yet. Build the consistency, the
  algorithm warms up over weeks.
- **Reddit will ban a poorly-disclosed bot.** The bot's drafter prompt
  enforces no fake stats, no clickbait, no astroturfing. Keep
  `TRENDBOT_TARGET_SUBREDDIT` to your own profile (`u_<username>`) until you
  have a sub you moderate. Mods of other subs will catch a bot fast.
