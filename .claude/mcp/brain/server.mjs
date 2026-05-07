#!/usr/bin/env node
// Brain MCP server.
// Exposes a persistent SQLite "second brain" with organic decay, relationships,
// and full-text recall as MCP tools.
//
// Optional env vars:
//   BRAIN_DB_PATH   — path to SQLite file (default: ./.claude/brain.db relative to cwd)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { resolve } from "node:path";
import { openBrain, KINDS } from "./db.mjs";

const DB_PATH = process.env.BRAIN_DB_PATH
  ? resolve(process.env.BRAIN_DB_PATH)
  : resolve(process.cwd(), ".claude", "brain.db");

const brain = openBrain(DB_PATH);

const server = new McpServer({ name: "brain", version: "0.1.0" });

const text = (obj) => ({
  content: [
    { type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) },
  ],
});

server.registerTool(
  "brain_remember",
  {
    title: "Store a memory",
    description:
      "Save something to long-term memory. Use 'kind' to classify (fact, episode, decision, preference, idea, question, insight, analysis). Tags are free-form lowercase keywords. Returns the stored memory with its id — keep the id if you want to relate this memory to another later.",
    inputSchema: {
      content: z.string().min(1).describe("The thing to remember. Be self-contained — future-you won't have today's context."),
      kind: z.enum(KINDS).optional().default("fact").describe("Classification of this memory."),
      tags: z.union([z.array(z.string()), z.string()]).optional().describe("Tags as array or comma/space-separated string."),
      source: z.string().optional().describe("Where this came from (e.g., 'analysis:rhythmix-pricing', 'user:2026-05-07')."),
      strength: z.number().min(0).max(2).optional().default(1.0),
    },
  },
  async ({ content, kind, tags, source, strength }) => {
    const m = brain.remember({ content, kind, tags, source, strength });
    return text(m);
  },
);

server.registerTool(
  "brain_recall",
  {
    title: "Recall memories",
    description:
      "Retrieve memories matching a query, tags, or kind. Uses FTS5 over content + tags, ranked by effective strength (strength × time-decay). Calling this REINFORCES matched memories — they get stronger and stay fresher.",
    inputSchema: {
      query: z.string().optional().describe("Free-text query. Empty = browse most-recent."),
      tags: z.union([z.array(z.string()), z.string()]).optional().describe("Filter to memories that have ALL these tags."),
      kind: z.enum(KINDS).optional().describe("Restrict to one kind."),
      limit: z.number().int().min(1).max(100).optional().default(10),
      min_strength: z.number().min(0).max(2).optional().default(0).describe("Hide memories whose effective strength is below this threshold."),
    },
  },
  async ({ query, tags, kind, limit, min_strength }) => {
    const rows = brain.recall({ query: query || "", tags, kind: kind || null, limit, minStrength: min_strength });
    return text({ count: rows.length, memories: rows });
  },
);

server.registerTool(
  "brain_relate",
  {
    title: "Link two memories",
    description:
      "Create a typed weighted edge between two memories. Useful 'kind' values: related, supports, contradicts, causes, part_of, derived_from, references.",
    inputSchema: {
      from_id: z.number().int().positive(),
      to_id: z.number().int().positive(),
      kind: z.string().optional().default("related"),
      weight: z.number().min(0).max(10).optional().default(1.0),
    },
  },
  async ({ from_id, to_id, kind, weight }) => {
    const edge = brain.relate({ fromId: from_id, toId: to_id, kind, weight });
    return text(edge);
  },
);

server.registerTool(
  "brain_neighbours",
  {
    title: "Walk the memory graph",
    description:
      "Return memories within `depth` graph hops of the given memory. Use this to find what a memory is connected to.",
    inputSchema: {
      id: z.number().int().positive(),
      depth: z.number().int().min(1).max(4).optional().default(1),
    },
  },
  async ({ id, depth }) => {
    const found = brain.neighbours(id, depth);
    return text({ count: found.length, neighbours: found });
  },
);

server.registerTool(
  "brain_forget",
  {
    title: "Delete a memory",
    description: "Permanently remove a memory and any edges touching it. Irreversible.",
    inputSchema: { id: z.number().int().positive() },
  },
  async ({ id }) => {
    const ok = brain.forget(id);
    return text({ deleted: ok, id });
  },
);

server.registerTool(
  "brain_episodes",
  {
    title: "Recent episodes",
    description: "List the most recent episode/analysis/insight memories — the brain's narrative timeline.",
    inputSchema: {
      limit: z.number().int().min(1).max(200).optional().default(20),
      since: z.number().int().optional().describe("Unix ms timestamp; only return episodes after this."),
    },
  },
  async ({ limit, since }) => {
    const rows = brain.episodes({ limit, since: since ?? null });
    return text({ count: rows.length, episodes: rows });
  },
);

server.registerTool(
  "brain_stats",
  {
    title: "Brain stats",
    description: "Total memory count, kind/tag distribution, edge count, current half-life setting.",
    inputSchema: {},
  },
  async () => text(brain.stats()),
);

server.registerTool(
  "brain_decay",
  {
    title: "Apply organic decay",
    description:
      "Commit time-decayed strength back to disk. Optionally update the half-life (in days). Safe to call anytime — idempotent and quick.",
    inputSchema: {
      half_life_days: z.number().min(0.5).max(3650).optional().describe("If set, update the brain's half-life and decay against the new value."),
    },
  },
  async ({ half_life_days }) => text(brain.decay({ halfLifeDays: half_life_days })),
);

server.registerTool(
  "brain_prune",
  {
    title: "Prune weak memories",
    description: "Permanently delete memories below the given strength threshold. Default 0.05 — biological forgetting.",
    inputSchema: {
      threshold: z.number().min(0).max(2).optional().default(0.05),
    },
  },
  async ({ threshold }) => {
    const removed = brain.pruneWeak({ threshold });
    return text({ removed, threshold });
  },
);

server.registerTool(
  "brain_export",
  {
    title: "Export everything",
    description: "Dump all memories, relationships, and meta as JSON — for backups or migration.",
    inputSchema: {},
  },
  async () => text(brain.exportAll()),
);

const transport = new StdioServerTransport();
await server.connect(transport);
