import { describe, it, expect, afterAll } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Store } from "../src/gateway/db.js";
import { streamChat, type ChatTurn } from "../src/gateway/openai.js";
import { loadConfig } from "../src/gateway/config.js";

const dir = mkdtempSync(join(tmpdir(), "moltis-test-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("SQLite store", () => {
  it("creates sessions, appends messages, and reads history in order", () => {
    const store = new Store(dir);
    const s = store.createSession("hello");
    expect(store.getSession(s.id)?.title).toBe("hello");
    store.addMessage(s.id, "user", "hi");
    store.addMessage(s.id, "assistant", "yo");
    const msgs = store.getMessages(s.id);
    expect(msgs.map((m) => m.content)).toEqual(["hi", "yo"]);
    expect(store.listSessions().some((x) => x.id === s.id)).toBe(true);
    store.close();
  });
});

describe("chat streaming fallback (no API key)", () => {
  it("streams a deterministic offline reply", async () => {
    const cfg = { ...loadConfig(), openaiApiKey: undefined };
    const turns: ChatTurn[] = [{ role: "user", content: "ping" }];
    let out = "";
    for await (const d of streamChat(cfg, turns)) out += d;
    expect(out).toContain("offline fallback");
    expect(out).toContain("ping");
  });
});
