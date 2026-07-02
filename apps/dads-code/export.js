// export.js — the durability promise (R9). Free, unencrypted, account-less export
// that must ALWAYS exist (R15.2). Two forms:
//   1. a single self-contained .html backup that opens with no app, no server (R9.2)
//   2. a .dadscode JSON file for re-import (R9.2), with a sha-256 checksum
// Plus the print keepsake book via the browser's own print (R9.3).

import * as db from "./db.js";

function download(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function esc(s) {
  return String(s ?? "").replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
}

// ---- JSON export/import ----
export async function exportJSON() {
  const data = await db.dumpAll();
  const json = JSON.stringify(data, null, 2);
  data.sha256 = await sha256(json);
  const final = JSON.stringify(data, null, 2);
  download("dads-code-backup.dadscode", new Blob([final], { type: "application/json" }));
  await db.setMeta({ lastBackupAt: db.now() });
}

export async function importJSON(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  const restore = async (store, rows) => { for (const r of rows || []) await db.put(store, r); };
  await restore("entries", data.entries);
  await restore("code", data.code);
  await restore("checkins", data.checkins);
  await restore("recipients", data.recipients);
  await restore("mediaAssets", data.mediaAssets);
  if (data.meta) await db.setMeta({ ...data.meta, key: "vault" });
  return true;
}

// ---- self-contained HTML backup (opens anywhere, forever) ----
export async function exportHTML() {
  const data = await db.dumpAll();
  const stack = buildStack(data.code);
  const diary = (data.entries || [])
    .filter(e => e.kind === "diary")
    .sort((a, b) => (b.authoredAt || "").localeCompare(a.authoredAt || ""));

  const owner = esc(data.meta?.ownerName || "");
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dad's Code${owner ? " — " + owner : ""}</title>
<style>
  body{font-family:"Iowan Old Style",Georgia,serif;background:#F4EDE2;color:#2A2420;
       max-width:720px;margin:0 auto;padding:32px;line-height:1.55}
  h1,h2,h3{font-family:"Hoefler Text",Georgia,serif}
  h1{color:#7A3B2E}
  .val{border-left:4px solid #7A3B2E;padding-left:12px;margin:16px 0}
  .pri{border-left:4px solid #B8893E;padding-left:12px;margin:8px 0 8px 16px}
  .pra{border-left:4px solid #7C8B6B;padding-left:12px;margin:6px 0 6px 32px}
  .entry{border-bottom:1px solid #D8CBB6;padding:14px 0}
  .date{color:#5A5049;font-size:.85rem}
  .sig{font-family:cursive;color:#7A3B2E;font-size:1.5rem}
  footer{margin-top:40px;color:#5A5049;font-size:.85rem}
</style></head><body>
<h1>Dad's Code</h1>
${owner ? `<p class="sig">${owner}</p>` : ""}
<p><em>Your code — live it, then leave it.</em></p>

<h2>The Code</h2>
${stack.length ? stack.map(v => `
  <div class="val"><strong>${esc(v.text)}</strong>
  ${v.principles.map(p => `<div class="pri">${esc(p.text)}
    ${p.practices.map(pr => `<div class="pra">· ${esc(pr.text)}</div>`).join("")}
  </div>`).join("")}</div>`).join("") : "<p>—</p>"}

<h2>Journal</h2>
${diary.length ? diary.map(e => `
  <div class="entry"><div class="date">${esc((e.authoredAt || e.createdAt || "").slice(0, 10))}</div>
  ${e.title ? `<h3>${esc(e.title)}</h3>` : ""}
  <div>${esc(e.body).replace(/\n/g, "<br>")}</div></div>`).join("") : "<p>—</p>"}

<footer>Exported ${esc(new Date().toISOString().slice(0, 10))} from Dad's Code.
This file is self-contained and needs no app or internet to read.</footer>

<script type="application/json" id="dadscode-data">${esc(JSON.stringify(data))}</script>
</body></html>`;

  download("dads-code-backup.html", new Blob([html], { type: "text/html" }));
  await db.setMeta({ lastBackupAt: db.now() });
}

function buildStack(code = []) {
  const by = (layer, parentId) => code.filter(n => n.layer === layer && n.parentId === parentId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return by("value", null).map(v => ({
    ...v, principles: by("principle", v.id).map(p => ({ ...p, practices: by("practice", p.id) })),
  }));
}

// keepsake book = the print stylesheet in app.css (R9.3)
export function printBook() { window.print(); }
