# Sample draft — what the bot produces with your voice file

> This is the bot's output **simulated by Claude using the same system prompt
> that `src/content/draft.ts` would use**, applied to a plausible trending
> topic, with `context/my-voice.md` as the style reference.
>
> Why simulated and not real? Two reasons:
> 1. The sandbox where this was generated has firewalled outbound HTTP, so
>    the trend fetchers (Reddit, HN, Google Trends) returned 403.
> 2. No `ANTHROPIC_API_KEY` is set in `.env`, so the production drafter
>    falls back to a stub.
>
> When you set the API key and run `npm run dry-run` on your own machine,
> output of this shape will appear. The voice signal below is what we
> currently have to work with.

---

## Trend (illustrative — replace with whatever's actually #1 when you run it)

- **Source:** reddit
- **Subreddit:** r/Entrepreneur
- **Title:** "Quit my $140K job 8 months ago to build a one-person AI business — here's what nobody tells you"
- **Score:** 0.92

## Draft (using `my-voice.md` rules)

**Title:**
```
8 months solo. Three things nobody warned me about going AI-first.
```

**Body:**
```
Quit my job, picked up Claude Code, and started building. Here's the
honest part nobody puts in the threads.

One: the tools are not the bottleneck. I bought every course, installed
every skill, watched every TikTok. Spent a month "setting up." None of
it ships product. The day I stopped installing and started running was
month two.

Two: writing in your own voice is the hardest part to automate. The AI
will draft something competent and lifeless every single time, until
you feed it real samples of how you actually talk. I keep a file of my
own writing the bot reads before it drafts anything. Took 30 minutes,
worth more than every paid course combined.

Three: a new account posting to its own profile gets near zero views.
That's not the bot's fault. That's the platform deciding it doesn't
trust you yet. The fix is consistency, not clever prompts.

What did you wish you'd known in month one, brother?
```

**Hook:** "Three honest lessons from going AI-first solo, told in plain talk."

**Why it matters:** Cuts through the install-loop noise that dominates this
niche. Pattern-matches to the user's own situation.

**Tags:** `solo-business`, `ai-tools`, `honest-takes`, `month-two`

---

## What the voice file did vs. didn't

What it caught:
- "brother" sign-off, not "cheers" or "thoughts?"
- Short, declarative sentences
- "Honest" framing (your real word: "keep it real")
- No marketing speak ("game-changer", "leverage", etc. all banned)
- No emojis, no exclamation marks
- Ends on a real question, not engagement bait

What's still weak:
- I don't know your actual numbers. The "$140K" is illustrative — replace.
- I don't know which niche you'll actually post in. r/Entrepreneur was a
  guess; could be r/AItoolsforbiz, r/sidehustle, etc.
- I don't have lived experience to draw from — the lessons read as
  generic-good. Once `context/about-me.md` has your real story, the bot can
  weave that in.

---

## To get this for real

1. `cd /home/user/jamie-wigg`
2. `cp .env.example .env`
3. Add `ANTHROPIC_API_KEY=sk-ant-...` (Anthropic console)
4. Run `npm run dry-run`
5. Look at `data/last-dry-run.json` — that's the bot's actual output on
   today's actual top trend.

Then either go to `npm run live` (post immediately) or deploy via
`DEPLOY.md` for autonomous loops.
