/* ============================================================
   NEONDECK Local API Server — v1.1.0
   Zero dependencies: plain Node.js (v16+), no npm install.

   Run from the neondeck folder:
       node server/server.js
   Then open http://localhost:4200

   What it does:
   - Serves the templates as a website
   - Feeds every dashboard live data from the JSON files in /data
     (edit those files → your dashboards update on refresh)
   - Provides a real login endpoint for the Access Console
     (demo account: any email + password "neondeck")

   This is a development/starter backend: swap the JSON files for
   your own database queries when you wire in a real product.
   ============================================================ */
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const PORT = process.env.PORT || 4200;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

const sessions = new Map(); // token -> { email, created }

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;

  /* ---------- API ---------- */
  if (p.startsWith("/api/")) {
    // POST /api/login  { email, password }
    if (p === "/api/login" && req.method === "POST") {
      const { email, password } = await readBody(req);
      if (email && password === "neondeck") {
        const token = crypto.randomBytes(24).toString("hex");
        sessions.set(token, { email, created: Date.now() });
        return json(res, 200, { ok: true, token, email });
      }
      return json(res, 401, { ok: false, error: "Invalid credentials. Demo password is: neondeck" });
    }

    // GET /api/me  (Authorization: Bearer <token>)
    if (p === "/api/me" && req.method === "GET") {
      const token = (req.headers.authorization || "").replace("Bearer ", "");
      const s = sessions.get(token);
      return s ? json(res, 200, { ok: true, email: s.email })
               : json(res, 401, { ok: false, error: "Not signed in" });
    }

    // GET /api/health
    if (p === "/api/health") {
      return json(res, 200, { ok: true, uptime: process.uptime(), sessions: sessions.size });
    }

    // GET /api/<dashboard>  → data/<dashboard>.json
    const m = p.match(/^\/api\/([a-z]+)$/);
    if (m && req.method === "GET") {
      const file = path.join(ROOT, "data", m[1] + ".json");
      if (fs.existsSync(file)) {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        return fs.createReadStream(file).pipe(res);
      }
      return json(res, 404, { ok: false, error: "No data file: data/" + m[1] + ".json" });
    }

    return json(res, 404, { ok: false, error: "Unknown API route" });
  }

  /* ---------- Static files ---------- */
  let filePath = path.normalize(path.join(ROOT, p === "/" ? "index.html" : p));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("404 Not Found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("");
  console.log("  NEONDECK server running:");
  console.log("  → http://localhost:" + PORT);
  console.log("");
  console.log("  Dashboards are now fed by the JSON files in /data.");
  console.log("  Login demo account: any email + password \"neondeck\"");
  console.log("");
});
