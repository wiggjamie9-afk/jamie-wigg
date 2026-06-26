# Operator Pack — Index

The complete map of the ecosystem and how to run it. Read in this order.

| # | Doc | What it answers |
|---|---|---|
| 1 | [`ecc-harness-overview.md`](./ecc-harness-overview.md) | What ECC is; how to install/run it safely |
| 2 | [`ecc-ecosystem-integration-strategy.md`](./ecc-ecosystem-integration-strategy.md) | How to wire ECC into your repo + MCP fleet (profiles, phases) |
| 3 | [`BUSINESS-GUIDE.md`](./BUSINESS-GUIDE.md) | The business the system runs (revenue, GTM, metrics, 30/60/90) |
| 4 | [`WHAT-WE-HAVE.md`](./WHAT-WE-HAVE.md) | Grounded inventory of every asset (real counts) |
| 5 | [`EXECUTION-BACKLOG.md`](./EXECUTION-BACKLOG.md) | The dated, ordered path — first 30 days |
| — | [`mcp-profiles.md`](./mcp-profiles.md) | T1.3 — the content/software/ops MCP profiles |
| — | [`studio-license-flow.md`](./studio-license-flow.md) | T1.6 — license path dry-run + gaps |
| — | [`week1-findings.md`](./week1-findings.md) | T1.5/T1.6 — real toolchain results + the build decision |

## Where things stand (live)

- **Strategy + plan:** complete (docs 1–5).
- **Studio tests:** ✅ 60/60 pass.
- **Studio build:** ❌ red — needs a design decision (see `week1-findings.md`, Finding A).
- **License Worker:** ✅ code complete; needs config + one test purchase.
- **Next gate (you):** decide Finding A (decouple Studio's LLM router), then I
  implement + fix the lint/CORS items and drive toward first deploy.

## The two heartbeats that define "working"
1. **T1.8** — a real license unlocks Studio (a dollar flows).
2. **Daily content asset shipping** — the flywheel turns.

Everything else amplifies these two.
```
