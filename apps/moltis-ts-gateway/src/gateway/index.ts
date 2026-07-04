// Moltis TS Gateway — HTTP (static + REST) and WebSocket RPC on one server.
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer, type WebSocket } from "ws";
import { loadConfig } from "./config.js";
import { Store } from "./db.js";
import { streamChat, type ChatTurn } from "./openai.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_DIR = join(__dirname, "..", "..", "web");

const cfg = loadConfig();
const store = new Store(cfg.dataDir);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function json(res: ServerResponse, code: number, body: unknown): void {
  const s = JSON.stringify(body);
  res.writeHead(code, { "content-type": "application/json; charset=utf-8" });
  res.end(s);
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

// ---- REST API -------------------------------------------------------------
async function handleApi(req: IncomingMessage, res: ServerResponse, url: URL): Promise<boolean> {
  const { pathname } = url;
  const method = req.method ?? "GET";

  if (pathname === "/api/health") {
    json(res, 200, { ok: true, provider: cfg.defaultProvider, model: cfg.defaultModel, liveChat: Boolean(cfg.openaiApiKey) });
    return true;
  }
  if (pathname === "/api/sessions" && method === "GET") {
    json(res, 200, { sessions: store.listSessions() });
    return true;
  }
  if (pathname === "/api/sessions" && method === "POST") {
    const body = await readBody(req).then((b) => (b ? JSON.parse(b) : {})).catch(() => ({}));
    const s = store.createSession(typeof body.title === "string" ? body.title : undefined);
    json(res, 201, { session: s });
    return true;
  }
  const m = pathname.match(/^\/api\/sessions\/([^/]+)\/messages$/);
  if (m && method === "GET") {
    const sid = decodeURIComponent(m[1]!);
    if (!store.getSession(sid)) { json(res, 404, { error: "session not found" }); return true; }
    json(res, 200, { messages: store.getMessages(sid) });
    return true;
  }
  return false;
}

// ---- Static files ---------------------------------------------------------
async function serveStatic(res: ServerResponse, pathname: string): Promise<void> {
  const rel = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = join(WEB_DIR, rel);
  if (!file.startsWith(WEB_DIR)) { res.writeHead(403); res.end("forbidden"); return; }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    // SPA-ish fallback to index.html
    try {
      const idx = await readFile(join(WEB_DIR, "index.html"));
      res.writeHead(200, { "content-type": MIME[".html"]! });
      res.end(idx);
    } catch {
      res.writeHead(404); res.end("not found");
    }
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      if (await handleApi(req, res, url)) return;
      json(res, 404, { error: "no such endpoint" });
      return;
    }
    await serveStatic(res, url.pathname);
  } catch (err) {
    json(res, 500, { error: String(err) });
  }
});

// ---- WebSocket RPC: /ws/chat ---------------------------------------------
const wss = new WebSocketServer({ server, path: "/ws/chat" });

wss.on("connection", (ws: WebSocket) => {
  ws.send(JSON.stringify({ type: "hello", provider: cfg.defaultProvider, model: cfg.defaultModel, liveChat: Boolean(cfg.openaiApiKey) }));

  ws.on("message", async (raw) => {
    let msg: any;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (msg?.type !== "chat.send") return;

    // Resolve or create the session.
    let sessionId: string = typeof msg.sessionId === "string" ? msg.sessionId : "";
    if (!sessionId || !store.getSession(sessionId)) {
      sessionId = store.createSession(String(msg.content ?? "New chat").slice(0, 40)).id;
    }
    const content = String(msg.content ?? "");
    store.addMessage(sessionId, "user", content);

    const turns: ChatTurn[] = store.getMessages(sessionId).map((m) => ({ role: m.role, content: m.content }));

    ws.send(JSON.stringify({ type: "chat.start", sessionId }));
    let full = "";
    try {
      for await (const delta of streamChat(cfg, turns)) {
        full += delta;
        ws.send(JSON.stringify({ type: "chat.delta", sessionId, delta }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: "chat.error", sessionId, error: String(err) }));
    }
    store.addMessage(sessionId, "assistant", full);
    ws.send(JSON.stringify({ type: "chat.done", sessionId }));
  });
});

server.listen(cfg.port, cfg.host, () => {
  // eslint-disable-next-line no-console
  console.log(`Moltis TS Gateway on http://${cfg.host}:${cfg.port}  (live chat: ${cfg.openaiApiKey ? "on" : "off — offline fallback"})`);
});

export { server };
