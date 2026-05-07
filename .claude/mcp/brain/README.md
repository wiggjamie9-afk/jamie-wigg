# Brain MCP Server

A persistent **second brain** for Claude — SQLite-backed, with full-text recall, a typed relationship graph, and organic time-decay so unused memories fade.

## Install

```bash
cd .claude/mcp/brain
npm install
```

`better-sqlite3` ships prebuilt binaries for Linux x64, macOS, and Windows — no compiler needed in the common case.

## Wire it up

`.mcp.json` already declares the server. Make sure `.claude/settings.json` includes `"brain"` in `enabledMcpjsonServers`.

```json
{
  "enabledMcpjsonServers": ["creative-stack", "brain"]
}
```

## Storage

By default the database lives at `./.claude/brain.db` (relative to wherever Claude Code is launched). Override with:

```bash
export BRAIN_DB_PATH=/absolute/path/to/brain.db
```

The `.db`, `.db-wal`, and `.db-shm` files are gitignored.

## Tools

| Tool | What it does |
| --- | --- |
| `brain_remember` | Store a memory (`fact`, `episode`, `decision`, `preference`, `idea`, `question`, `insight`, `analysis`). |
| `brain_recall` | FTS5 query + tag/kind filter, ranked by strength × time-decay. **Reads reinforce.** |
| `brain_relate` | Create a typed edge between two memories (`related`, `supports`, `contradicts`, `causes`, `part_of`, `derived_from`, `references`, …). |
| `brain_neighbours` | Walk the graph N hops out from a memory. |
| `brain_episodes` | Timeline of recent episode/analysis/insight memories. |
| `brain_stats` | Counts, top tags, edge count, half-life. |
| `brain_decay` | Commit time-decay back to disk; optionally change the half-life. |
| `brain_prune` | Delete memories below a strength threshold (biological forgetting). |
| `brain_forget` | Delete a single memory by id. |
| `brain_export` | JSON dump for backup. |

## Organic memory model

- Every memory has `strength` (0..2) and `last_accessed`.
- Reads reinforce: `strength = min(2, strength + 0.1)`, `last_accessed = now`, `access_count++`.
- Effective strength on read = `strength × 0.5^(Δt / half_life_days)`.
- `brain_decay` commits the decayed value back so `brain_prune` can remove fossils.
- Default half-life is 30 days. Tune with `brain_decay({ half_life_days: 7 })`.

## Smoke test

```bash
npm run smoke
```

Exercises remember / recall / relate / neighbours / stats / decay / forget against a temp database.
