// SQLite-backed brain storage with FTS5, organic decay, and a relationship graph.
//
// Schema:
//   memories        — atomic units (facts, episodes, decisions, ideas, …)
//   memories_fts    — FTS5 mirror for fast text recall
//   relationships   — typed weighted edges between memories (the "graph")
//   meta            — single-row settings (half-life, version, etc.)
//
// "Organic" behaviour:
//   - Every read reinforces the matched memory (strength up, last_accessed bumped).
//   - Effective strength on read = stored_strength * exp(-Δt / half_life).
//   - brain_decay() commits the decayed value back so pruning stays meaningful.

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export const KINDS = [
  "fact",
  "episode",
  "decision",
  "preference",
  "idea",
  "question",
  "insight",
  "analysis",
];

const SCHEMA = `
CREATE TABLE IF NOT EXISTS memories (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  content       TEXT NOT NULL,
  kind          TEXT NOT NULL DEFAULT 'fact',
  tags          TEXT NOT NULL DEFAULT '',
  source        TEXT,
  created_at    INTEGER NOT NULL,
  last_accessed INTEGER NOT NULL,
  access_count  INTEGER NOT NULL DEFAULT 0,
  strength      REAL NOT NULL DEFAULT 1.0
);
CREATE INDEX IF NOT EXISTS idx_memories_kind     ON memories(kind);
CREATE INDEX IF NOT EXISTS idx_memories_created  ON memories(created_at);
CREATE INDEX IF NOT EXISTS idx_memories_strength ON memories(strength);

CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
  content, tags, content='memories', content_rowid='id'
);
CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
  INSERT INTO memories_fts(rowid, content, tags) VALUES (new.id, new.content, new.tags);
END;
CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
  DELETE FROM memories_fts WHERE rowid = old.id;
END;
CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
  UPDATE memories_fts SET content = new.content, tags = new.tags WHERE rowid = old.id;
END;

CREATE TABLE IF NOT EXISTS relationships (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  from_id    INTEGER NOT NULL,
  to_id      INTEGER NOT NULL,
  kind       TEXT NOT NULL DEFAULT 'related',
  weight     REAL NOT NULL DEFAULT 1.0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (from_id) REFERENCES memories(id) ON DELETE CASCADE,
  FOREIGN KEY (to_id)   REFERENCES memories(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_rel_from ON relationships(from_id);
CREATE INDEX IF NOT EXISTS idx_rel_to   ON relationships(to_id);

CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT OR IGNORE INTO meta(key, value) VALUES ('half_life_days', '30');
INSERT OR IGNORE INTO meta(key, value) VALUES ('version',        '1');
`;

const DAY_MS = 86_400_000;

export function openBrain(dbPath) {
  const path = resolve(dbPath);
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  return new Brain(db);
}

export class Brain {
  constructor(db) {
    this.db = db;
  }

  // ---------- meta ----------
  getHalfLifeDays() {
    const row = this.db.prepare("SELECT value FROM meta WHERE key='half_life_days'").get();
    return row ? Number(row.value) : 30;
  }
  setHalfLifeDays(days) {
    this.db.prepare("UPDATE meta SET value=? WHERE key='half_life_days'").run(String(days));
  }

  // ---------- core ops ----------
  remember({ content, kind = "fact", tags = [], source = null, strength = 1.0 }) {
    const now = Date.now();
    const tagStr = normaliseTags(tags);
    if (!KINDS.includes(kind)) {
      throw new Error(`unknown kind '${kind}'. allowed: ${KINDS.join(", ")}`);
    }
    const info = this.db
      .prepare(
        `INSERT INTO memories (content, kind, tags, source, created_at, last_accessed, strength)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(content, kind, tagStr, source, now, now, strength);
    return this.getById(info.lastInsertRowid);
  }

  getById(id) {
    return this.db.prepare("SELECT * FROM memories WHERE id = ?").get(id) || null;
  }

  forget(id) {
    const info = this.db.prepare("DELETE FROM memories WHERE id = ?").run(id);
    return info.changes > 0;
  }

  recall({ query = "", tags = [], kind = null, limit = 10, minStrength = 0 } = {}) {
    const halfLife = this.getHalfLifeDays();
    const now = Date.now();
    const tagList = normaliseTagList(tags);

    let rows;
    if (query && query.trim()) {
      const ftsQuery = sanitiseFts(query);
      rows = this.db
        .prepare(
          `SELECT m.*, bm25(memories_fts) AS rank
             FROM memories_fts
             JOIN memories m ON m.id = memories_fts.rowid
            WHERE memories_fts MATCH ?
            ORDER BY rank
            LIMIT ?`,
        )
        .all(ftsQuery, limit * 4);
    } else {
      rows = this.db
        .prepare(`SELECT *, 0 AS rank FROM memories ORDER BY last_accessed DESC LIMIT ?`)
        .all(limit * 4);
    }

    const filtered = rows
      .filter((r) => (kind ? r.kind === kind : true))
      .filter((r) => (tagList.length ? tagList.every((t) => hasTag(r.tags, t)) : true))
      .map((r) => ({ ...r, effective_strength: effectiveStrength(r, now, halfLife) }))
      .filter((r) => r.effective_strength >= minStrength)
      .sort((a, b) => b.effective_strength - a.effective_strength)
      .slice(0, limit);

    // reinforce
    if (filtered.length) {
      const reinforce = this.db.prepare(
        `UPDATE memories
            SET last_accessed = ?,
                access_count  = access_count + 1,
                strength      = MIN(2.0, strength + 0.1)
          WHERE id = ?`,
      );
      const tx = this.db.transaction((items) => {
        for (const r of items) reinforce.run(now, r.id);
      });
      tx(filtered);
    }

    return filtered;
  }

  relate({ fromId, toId, kind = "related", weight = 1.0 }) {
    if (fromId === toId) throw new Error("from_id and to_id must differ");
    if (!this.getById(fromId)) throw new Error(`memory ${fromId} not found`);
    if (!this.getById(toId)) throw new Error(`memory ${toId} not found`);
    const info = this.db
      .prepare(
        `INSERT INTO relationships (from_id, to_id, kind, weight, created_at)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .run(fromId, toId, kind, weight, Date.now());
    return this.db.prepare("SELECT * FROM relationships WHERE id = ?").get(info.lastInsertRowid);
  }

  neighbours(id, depth = 1) {
    const seen = new Map();
    const queue = [{ id, distance: 0 }];
    while (queue.length) {
      const { id: cur, distance } = queue.shift();
      if (distance > depth) continue;
      if (seen.has(cur)) continue;
      const node = this.getById(cur);
      if (!node) continue;
      seen.set(cur, { ...node, distance });
      if (distance < depth) {
        const edges = this.db
          .prepare(
            `SELECT * FROM relationships WHERE from_id = ? OR to_id = ?`,
          )
          .all(cur, cur);
        for (const e of edges) {
          const next = e.from_id === cur ? e.to_id : e.from_id;
          if (!seen.has(next)) queue.push({ id: next, distance: distance + 1 });
        }
      }
    }
    seen.delete(id);
    return Array.from(seen.values());
  }

  episodes({ limit = 20, since = null } = {}) {
    if (since) {
      return this.db
        .prepare(
          `SELECT * FROM memories
            WHERE kind IN ('episode','analysis','insight')
              AND created_at >= ?
            ORDER BY created_at DESC LIMIT ?`,
        )
        .all(since, limit);
    }
    return this.db
      .prepare(
        `SELECT * FROM memories
          WHERE kind IN ('episode','analysis','insight')
          ORDER BY created_at DESC LIMIT ?`,
      )
      .all(limit);
  }

  stats() {
    const total = this.db.prepare("SELECT COUNT(*) AS n FROM memories").get().n;
    const byKind = this.db
      .prepare("SELECT kind, COUNT(*) AS n FROM memories GROUP BY kind ORDER BY n DESC")
      .all();
    const edges = this.db.prepare("SELECT COUNT(*) AS n FROM relationships").get().n;
    const tagCounts = new Map();
    for (const row of this.db.prepare("SELECT tags FROM memories WHERE tags <> ''").all()) {
      for (const t of row.tags.split(",").filter(Boolean)) {
        tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
      }
    }
    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag, n]) => ({ tag, n }));
    const halfLife = this.getHalfLifeDays();
    return { total, by_kind: byKind, edges, top_tags: topTags, half_life_days: halfLife };
  }

  decay({ halfLifeDays } = {}) {
    const hl = halfLifeDays ?? this.getHalfLifeDays();
    const now = Date.now();
    const rows = this.db.prepare("SELECT id, last_accessed, strength FROM memories").all();
    const update = this.db.prepare("UPDATE memories SET strength = ? WHERE id = ?");
    let touched = 0;
    const tx = this.db.transaction((items) => {
      for (const r of items) {
        const eff = effectiveStrength(r, now, hl);
        if (Math.abs(eff - r.strength) > 0.0001) {
          update.run(eff, r.id);
          touched++;
        }
      }
    });
    tx(rows);
    if (halfLifeDays !== undefined) this.setHalfLifeDays(hl);
    return { touched, half_life_days: hl };
  }

  pruneWeak({ threshold = 0.05 } = {}) {
    const info = this.db.prepare("DELETE FROM memories WHERE strength < ?").run(threshold);
    return info.changes;
  }

  exportAll() {
    const memories = this.db.prepare("SELECT * FROM memories ORDER BY id").all();
    const relationships = this.db.prepare("SELECT * FROM relationships ORDER BY id").all();
    return { memories, relationships, meta: this._allMeta() };
  }

  _allMeta() {
    return Object.fromEntries(this.db.prepare("SELECT key, value FROM meta").all().map((r) => [r.key, r.value]));
  }
}

// ---------- helpers ----------
function normaliseTags(tags) {
  if (!tags) return "";
  if (Array.isArray(tags)) return tags.map(cleanTag).filter(Boolean).join(",");
  return String(tags)
    .split(/[,\s]+/)
    .map(cleanTag)
    .filter(Boolean)
    .join(",");
}
function normaliseTagList(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(cleanTag).filter(Boolean);
  return String(tags).split(/[,\s]+/).map(cleanTag).filter(Boolean);
}
function cleanTag(t) {
  return String(t).toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
}
function hasTag(stored, tag) {
  return stored.split(",").map((s) => s.trim()).includes(tag);
}
function effectiveStrength(row, now, halfLifeDays) {
  const ageMs = now - row.last_accessed;
  if (ageMs <= 0) return row.strength;
  const halfLifeMs = halfLifeDays * DAY_MS;
  const decay = Math.pow(0.5, ageMs / halfLifeMs);
  return Math.max(0, row.strength * decay);
}
function sanitiseFts(q) {
  const tokens = q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (!tokens.length) return q.replace(/['"]/g, "");
  return tokens.map((t) => `${t}*`).join(" OR ");
}
