# .githooks — secret-scanning pre-commit guard

`pre-commit` blocks any commit whose staged changes contain a live-looking
credential (Anthropic / OpenAI / GitHub / Google / AWS keys, Slack tokens,
private-key blocks). It deliberately ignores common documentation placeholders
(`EXAMPLE`, `XXXX`, `your-…`, `sk-...`) so the security-skill docs in this repo
don't trip it.

## Enable

```bash
git config core.hooksPath .githooks
```

In Claude Code cloud sessions this is re-applied automatically at session start
by `.claude/hooks/session-start.sh` (each session is a fresh clone, so the
`core.hooksPath` setting has to be re-set every time).

## Behaviour

- A staged real key → commit is **blocked** with the file and line shown.
- False positive → bypass that one commit with `git commit --no-verify`.
- Add/adjust patterns in the `patterns=( … )` array in `pre-commit`.

## Deeper scans

The hook only sees *staged* changes. For a full working-tree / history audit,
run [`detect-secrets`](https://github.com/Yelp/detect-secrets):

```bash
pip install detect-secrets
detect-secrets scan --all-files --exclude-files 'node_modules|\.git/'
```
