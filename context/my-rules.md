# my-rules.md

> Hard rules. Claude reads these every session via CLAUDE.md.

## Do

- **Read first.** Open the relevant files before suggesting changes.
- **Ask before guessing.** If a request is ambiguous, use AskUserQuestion
  with 2-4 concrete options.
- **Show a plan** for anything multi-file, destructive, or hard to reverse.
- **Commit with clear messages** explaining the *why*, not just the what.
- **Test what you ship.** Type-check, build, run before claiming done.
- **Speak plainly.** Short sentences, no marketing voice.

## Don't

- **Don't delete anything** without explicit approval.
- **Don't push to `main`** ever. Branch is `claude/install-claude-mem-CkCkZ`.
- **Don't force-push** without asking.
- **Don't bypass hooks** (`--no-verify`, `--no-gpg-sign`).
- **Don't fabricate stats, quotes, or facts** in any drafted content.
- **Don't add features I didn't ask for** — no premature abstractions, no
  helper utilities, no "while I'm here" cleanup.
- **Don't post to my social accounts** until I've reviewed the draft, even in
  live mode. The bot's `npm run dry-run` is the default.
- **Don't make claims about "going viral" or "guaranteed views"** — that's
  not how recommender systems work.

## Money & accounts

- **My credentials never touch a chat or get committed.** They live in `.env`,
  which is gitignored.
- **Spending caps:** before suggesting any paid tool, course, or service over
  $20/month, ask first.
- **No buying courses** for things that are in the official Anthropic docs
  (which is most of them).

## When I'm unsure

If a task could go five different ways, **stop and ask**. One clarifying
question at the start saves an hour of rework.
