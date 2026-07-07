# jcode — cached binary for Claude Code cloud sessions

`jcode-linux-x86_64.tar.gz` is a prebuilt [jcode](https://github.com/1jehuang/jcode)
binary, built from source inside a Claude Code cloud session and committed here so
every new session (fresh ephemeral container) gets `jcode` on the PATH without a
rebuild or network download.

**Why it's vendored:** the cloud session proxy blocks `github.com` release
downloads and `api.github.com`, so the official `install.sh` cannot run. `git clone`
of public repos works, but a full Rust release build takes far too long to do at
every session start. Building once and caching the binary in-repo is the only
reliable per-session install path.

**How it's installed:** `.claude/hooks/session-start.sh` extracts the tarball to
`~/.local/bin/jcode` at SessionStart (Linux x86_64 only, skipped if `jcode` is
already present). Ask Claude to run `jcode run "..."` etc. — the interactive TUI
isn't usable inside an agent session, but the CLI/non-interactive modes are.

**Build provenance** (update when refreshing the binary):

| Field | Value |
|---|---|
| Source | https://github.com/1jehuang/jcode |
| Commit | `0d0b56e` — fix(provider): reasoning effort for GPT-family models on compat gateways |
| Version | 0.37.0 (workspace Cargo.toml) |
| Built | 2026-07-07, `cargo build --release -p jcode --bin jcode`, rustc 1.94.1, Linux x86_64 |

**To update:** in a cloud session, `git clone --depth 1 https://github.com/1jehuang/jcode`,
`cargo build --release -p jcode --bin jcode`, then
`tar czf tools/jcode/jcode-linux-x86_64.tar.gz -C target/release jcode`, update the
table above, and commit.
