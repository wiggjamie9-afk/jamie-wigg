# Shannon — third-party AI pentester (Keygraph)

[Shannon](https://github.com/KeygraphHQ/shannon) is an autonomous, white-box AI pentester for web applications and APIs, developed by [Keygraph](https://keygraph.io). It is **not** a RHYTHMIX project — this note exists so anyone evaluating security tooling for the rhythmix-studio engine or the Studio web app (Phase 2) has a single accurate reference.

## When this is relevant

- Auditing the rhythmix-studio CLI's HTTP surface (Replicate proxy Worker, future Studio web app, license/auth endpoints).
- Source-aware pentesting before a public Studio launch — Shannon reads the repo while exploiting the running app, so it catches code-path-specific issues that black-box scanners miss.
- Hardening the Cloudflare Worker that proxies to Replicate, or any other authenticated endpoint we add later.

It is **not relevant** for:

- The HyperFrames composition pipeline (static HTML + GSAP, no server, no auth surface).
- The marketing site (`index.html`, `features.html`, etc. — static).

## Editions

| Edition | License | Notes |
|---|---|---|
| Shannon Lite | AGPL-3.0 | What's on GitHub. Fine for internal testing of our own apps. |
| Shannon Pro | Commercial | Keygraph's hosted/self-hosted AppSec platform (SAST + SCA + secrets + pentesting + CI). |

AGPL-3.0's network-use clause matters if we ever **host Shannon as a service for third parties** — we don't, so this is a non-issue today. Internal use does not trigger source-disclosure.

## Operational warnings

These are Keygraph's own warnings; restating because they're easy to miss:

- **Active exploitation, not a passive scanner.** Shannon executes real attacks against the target — creates accounts, mutates data, fires injection payloads. **Do not point it at production.** Use a sandboxed staging environment or a VM.
- **Written authorization required.** Shannon is for systems you own or have explicit permission to test. Run it against rhythmix-studio infrastructure only — never a third-party API, even if we integrate with them.
- **LLM cost + time.** A full run is ~1–1.5h and ~$50 USD on Claude Sonnet pricing.
- **Claude models only.** Shannon's harness is tuned for Claude; non-Claude models routed via proxy are unsupported and unreliable.
- **Prompt-injection surface.** Shannon reads source code, so the repo it scans must be trusted. Don't scan adversarial codebases.

## `claude-code-router` is being removed

Shannon's experimental `claude-code-router` integration is being sunset in an upcoming release. If we ever wire Shannon through a router, use an Anthropic-compatible proxy (LiteLLM is the documented path) instead.

## How to actually run it

This sandbox can't run Shannon (no Docker, no target). When you do run it (locally or in a VM):

```bash
# npx workflow — pulls Keygraph's prebuilt worker image (~1 GB) from Docker Hub
npx @keygraph/shannon setup                    # one-time credential wizard
npx @keygraph/shannon start \
  -u https://staging.rhythmixapp.com.au \
  -r /path/to/this/repo \
  -c ./docs/security/shannon-config.yaml       # see below — doesn't exist yet
```

We do not yet have a `shannon-config.yaml` checked in. When we add one, it should:

- Set `description:` to the actual deployed stack (Cloudflare Worker + static site + Gumroad licensing).
- Scope `rules.avoid` to skip `/refunds`, `/members` (real-user data), and Gumroad webhook paths.
- Set `rules.focus` to `/api/*` on the Worker.
- Include `rules_of_engagement` capping login attempts and request rate.

## Links

- Shannon repo: <https://github.com/KeygraphHQ/shannon>
- Keygraph: <https://keygraph.io>
- Shannon Pro inquiries: shannon@keygraph.io
- Sample reports (OWASP Juice Shop, c{api}tal, crAPI) are linked from the Shannon README.

## Decision status

**Not adopted yet.** This is a reference note. Before we run Shannon in anger we need (a) a staging deployment of the Studio web app worth testing, (b) a checked-in `shannon-config.yaml` with auth credentials sourced from env vars not the file itself, and (c) a budget line for the ~$50/run Claude cost.
