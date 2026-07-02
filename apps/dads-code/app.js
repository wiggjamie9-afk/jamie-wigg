// app.js — controller. Hash routing, view orchestration, glue. (design §1)
import * as db from "./db.js";
import { getPrefs, setPref } from "./store.js";
import { el, esc, toast, fmtDate, daysAgo, consistencyLine } from "./ui.js";
import * as Code from "./code.js";
import * as Diary from "./diary.js";
import * as Exp from "./export.js";
import * as Legacy from "./legacy.js";
import { mountFocus } from "./focus.js";

const main = document.getElementById("main");
const topbar = document.getElementById("topbar");
const drawer = document.getElementById("drawer");
const scrim = document.getElementById("scrim");

// ---- drawer ----
function openDrawer(open) {
  drawer.hidden = false; scrim.hidden = !open;
  drawer.classList.toggle("open", open);
  document.getElementById("navToggle").setAttribute("aria-expanded", String(open));
  if (!open) setTimeout(() => { if (!drawer.classList.contains("open")) drawer.hidden = true; }, 260);
}
document.getElementById("navToggle").addEventListener("click", () =>
  openDrawer(!drawer.classList.contains("open")));
scrim.addEventListener("click", () => openDrawer(false));
drawer.addEventListener("click", e => { if (e.target.closest("a")) openDrawer(false); });

// ---- routing ----
const routes = {
  "/home": viewHome,
  "/code": viewCode,
  "/today": viewToday,
  "/journal": viewJournal,
  "/focus": viewFocus,
  "/forthem": viewForThem,
  "/backup": viewBackup,
  "/settings": viewSettings,
};

async function render() {
  const meta = await db.getMeta();
  if (!meta.onboarded) { topbar.hidden = true; return viewOnboarding(); }
  topbar.hidden = false;

  const hash = location.hash.replace(/^#/, "") || "/home";
  const path = hash.split("?")[0];
  const fn = routes[path] || viewHome;
  setPref("lastView", "#" + path);
  drawer.querySelectorAll("a[data-nav]").forEach(a =>
    a.setAttribute("aria-current", a.getAttribute("href") === "#" + path ? "page" : "false"));
  main.innerHTML = "";
  await fn();
  main.focus();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);

function go(path) { location.hash = path; }
function mount(node) { main.append(node); }
function section(title, ...children) {
  return el("section", { class: "stack" }, [title ? el("h1", { text: title }) : null, ...children]);
}
function card(children, settle = true) {
  return el("div", { class: "card" + (settle ? " settle" : "") }, children);
}

// ---- onboarding (R7) ----
async function viewOnboarding() {
  main.innerHTML = "";
  const step = { i: 0, name: "", added: 0 };

  const welcome = section(null,
    el("div", { class: "hero" }, [
      el("p", { class: "quote", text: "Your code — live it, then leave it." }),
      el("h1", { text: "Dad's Code" }),
      el("p", { class: "muted", text:
        "A quiet place to tend the man you mean to be — and, one day, to leave your kids what mattered. It lives only on this device. No account, no cloud." }),
    ]),
    card([
      el("label", { for: "nm", text: "What should we call you?" }),
      el("input", { type: "text", id: "nm", placeholder: "Your name", value: step.name,
        oninput: e => step.name = e.target.value }),
      el("p", { class: "small muted", text:
        "One honest note, said once: this can outlast you. That's the point — but you're here to live it first." }),
      el("button", { class: "btn big", text: "Begin", onclick: async () => {
        await db.setMeta({ ownerName: step.name.trim() });
        await db.requestPersist();
        renderPrompts();
      } }),
    ], false),
  );
  mount(welcome);

  function renderPrompts() {
    main.innerHTML = "";
    const prompts = Diary.PROMPTS.slice(0, 8);
    const box = el("textarea", { placeholder: "30 seconds is enough.", id: "ob-body" });
    let current = prompts[0];

    const chipRow = el("div", { class: "domain-chips" },
      prompts.map(p => el("button", { class: "chip", text: p, onclick: () => {
        current = p; label.textContent = p; box.focus();
      } })));
    const label = el("h2", { text: current });

    const s = section("Leave your first three",
      el("p", { class: "muted", text:
        "Pick a card, say one true thing, save. Three quick ones and you're set. Voice or type — your call." }),
      chipRow,
      card([
        label, box,
        el("div", { class: "btn-row" }, [
          el("button", { class: "btn", text: "Save this", onclick: async () => {
            const body = box.value.trim();
            if (!body) { toast("A single sentence counts — write one."); return; }
            await Diary.addDiary({ title: current, body });
            step.added++; box.value = "";
            toast(step.added >= 3 ? "That's three. Beautifully done." : `Saved. ${3 - step.added} to go.`);
            counter.textContent = `${step.added} saved`;
            if (step.added >= 3) finishBtn.classList.remove("btn", "ghost"), finishBtn.classList.add("btn");
          } }),
          el("span", { class: "pill", id: "ob-count", text: "0 saved" }),
        ]),
      ]),
      el("button", { class: "btn ghost", id: "ob-finish", text: "I'm ready — open the app", onclick: async () => {
        await db.setMeta({ onboarded: true });
        go("/home"); render();
      } }),
    );
    mount(s);
    const counter = document.getElementById("ob-count");
    const finishBtn = document.getElementById("ob-finish");
    box.focus();
  }
}

// ---- backup banner (R9.4) ----
async function backupBanner() {
  const meta = await db.getMeta();
  const age = daysAgo(meta.lastBackupAt);
  if (meta.lastBackupAt && age < 7) return null;
  const msg = meta.lastBackupAt
    ? `Last backup was ${age} day${age === 1 ? "" : "s"} ago.`
    : "You haven't backed up yet. Your words live only on this device until you do.";
  return el("div", { class: "banner" }, [
    el("span", { text: "📦 " + msg }),
    el("button", { class: "btn quiet", text: "Back up now", onclick: () => go("/backup") }),
  ]);
}

// ---- Home (R2 wedge) ----
async function viewHome() {
  const meta = await db.getMeta();
  const banner = await backupBanner();
  const practices = await Code.activePractices();
  const doneMap = await Code.todaysCheckins();
  const hello = meta.ownerName ? `Evening, ${esc(meta.ownerName)}.` : "Today";

  const s = section(null, el("h1", { text: hello }), banner);

  if (practices.length === 0) {
    s.append(card([
      el("h2", { text: "Start with your Code" }),
      el("p", { class: "muted", text:
        "Before the daily check-in, name one thing you stand for. Everything hangs off that." }),
      el("button", { class: "btn", text: "Write your first value", onclick: () => go("/code") }),
    ]));
  } else {
    const checkCard = card([
      el("h2", { text: "Tonight's check-in" }),
      el("p", { class: "small muted", text: "One tap each. 60 seconds, then you're done." }),
      ...practices.map(p => checkinRow(p, doneMap[p.id])),
    ]);
    s.append(checkCard);
    s.append(weatherCard());
  }

  // quick add
  s.append(el("div", { class: "btn-row" }, [
    el("button", { class: "btn quiet", text: "✍️ Quick journal", onclick: () => go("/journal?compose=1") }),
    el("button", { class: "btn quiet", text: "📜 The Code", onclick: () => go("/code") }),
  ]));

  // weekly mirror (R2.3)
  const mirror = await Code.weeklyMirror();
  if (mirror.length) {
    s.append(card([
      el("h2", { text: "This week, quietly" }),
      ...mirror.map(m => el("p", { class: "muted",
        text: `You kept "${m.text}" ${m.kept} of ${m.total}.` })),
      el("p", { class: "small muted", text: "Revise the practice, not your worth." }),
    ]));
  }
  mount(s);
}

function checkinRow(practice, status) {
  const row = el("div", { class: "checkin" });
  row.append(el("span", { class: "prac", text: practice.text }));
  const seg = el("div", { class: "seg", role: "group", "aria-label": practice.text });
  const opts = [["kept", "Kept"], ["slipped", "Slipped"], ["na", "N/A"]];
  for (const [val, lbl] of opts) {
    const b = el("button", { class: val, text: lbl,
      "aria-pressed": String(status === val),
      onclick: async () => {
        await Code.setCheckin(practice.id, val);
        seg.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        toast("Logged.");
      } });
    seg.append(b);
  }
  row.append(seg);
  return row;
}

// inner weather (R4.2) — single-tap, no numeric scales
function weatherCard() {
  const opts = [["☀️", "steady"], ["⛅", "tired"], ["🌧️", "heavy"], ["🌤️", "good"], ["🌫️", "flat"]];
  const wrap = card([
    el("h2", { text: "Inner weather" }),
    el("p", { class: "small muted", text: "One tap. No scores, no history to chase — just a check on your head." }),
  ]);
  const row = el("div", { class: "weather" });
  for (const [emoji, tag] of opts) {
    row.append(el("button", { text: emoji, "aria-label": tag, title: tag, onclick: async e => {
      row.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
      e.currentTarget.setAttribute("aria-pressed", "true");
      await Diary.addDiary({ kind: "clarity", title: "Inner weather", body: tag });
      toast(tag === "heavy"
        ? "That sounds like a lot to carry. It's logged — and you're not the only one."
        : "Noted. Thanks for checking in with yourself.");
    } }));
  }
  wrap.append(row);
  return wrap;
}

// ---- The Code (R1) ----
async function viewCode() {
  const stack = await Code.getStack();
  const s = section("The Code",
    el("p", { class: "muted", text:
      "Your words only — beliefs at the top, then the commitments that make them real, then the daily proof. No templates, no guru." }));

  // add a value
  s.append(card([
    el("h2", { text: "Add a value" }),
    el("p", { class: "small muted", text: "What do you actually believe? Keep it to a few — 5 to 8." }),
    inlineAdd("A value you hold…", async text => {
      await Code.addNode({ layer: "value", text });
      toast(Code.sharpeningQuestion("value"));
      render();
    }),
    el("div", { class: "domain-chips" }, Code.DOMAINS.map(d =>
      el("button", { class: "chip", text: d, title: "Prompt — not a category to complete",
        onclick: () => toast(`Take a stance on: ${d}`) }))),
  ]));

  if (stack.length === 0) {
    s.append(el("p", { class: "empty", text: "Nothing yet. Name one thing you stand for above." }));
  }

  for (const v of stack) {
    const vCard = card([]);
    vCard.append(el("div", { class: "code-value" }, [
      el("span", { class: "layer-label", text: "Value" }),
      el("h3", { text: v.text }),
      rowActions(
        () => editNode(v, "value"),
        async () => { if (confirm("Remove this value and everything under it?")) { await Code.deleteNode(v.id); render(); } },
      ),
    ]));
    // principles
    for (const p of v.principles) {
      vCard.append(el("div", { class: "code-principle" }, [
        el("span", { class: "layer-label", text: "Principle" }),
        el("div", { text: p.text }),
        rowActions(
          () => editNode(p, "principle"),
          async () => { if (confirm("Remove this principle?")) { await Code.deleteNode(p.id); render(); } },
        ),
        ...p.practices.map(pr => el("div", { class: "code-practice" }, [
          el("span", { class: "layer-label", text: "Practice" }),
          el("div", { text: pr.text }),
          rowActions(
            () => editNode(pr, "practice"),
            async () => { if (confirm("Remove this practice?")) { await Code.deleteNode(pr.id); render(); } },
          ),
        ])),
        inlineAdd("A daily practice that proves it…", async text => {
          await Code.addNode({ layer: "practice", text, parentId: p.id }); render();
        }),
      ]));
    }
    vCard.append(inlineAdd("A principle for this value…", async text => {
      await Code.addNode({ layer: "principle", text, parentId: v.id });
      toast(Code.sharpeningQuestion("principle")); render();
    }));
    s.append(vCard);
  }
  mount(s);
}

function inlineAdd(placeholder, onAdd) {
  const input = el("input", { type: "text", placeholder });
  const submit = async () => { const t = input.value.trim(); if (!t) return; input.value = ""; await onAdd(t); };
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  return el("div", { class: "btn-row", style: "margin-top:8px" }, [
    input, el("button", { class: "btn quiet", text: "Add", onclick: submit }),
  ]);
}
function rowActions(onEdit, onDel) {
  return el("div", { class: "btn-row", style: "margin-top:6px" }, [
    el("button", { class: "btn quiet small", text: "Edit", onclick: onEdit }),
    el("button", { class: "btn quiet small", text: "Remove", onclick: onDel }),
  ]);
}
async function editNode(node, layer) {
  const next = prompt(`Edit this ${layer}:`, node.text);
  if (next != null && next.trim()) { await Code.updateNode(node.id, { text: next.trim() }); render(); }
}

// ---- Today (dedicated check-in) ----
async function viewToday() {
  const practices = await Code.activePractices();
  const doneMap = await Code.todaysCheckins();
  const dates = await Code.checkinDates();
  const s = section("Today",
    practices.length
      ? card([el("h2", { text: "Check-in" }), ...practices.map(p => checkinRow(p, doneMap[p.id]))])
      : el("p", { class: "empty", text: "Add a practice in The Code first, then check in here each evening." }),
    weatherCard(),
    el("p", { class: "small muted center", text: consistencyLine(dates, 30) + " — and a missed day breaks nothing." }),
  );
  mount(s);
}

// ---- Journal (R3) ----
async function viewJournal() {
  const params = new URLSearchParams((location.hash.split("?")[1] || ""));
  const entries = await Diary.listDiary();
  const s = section("Journal");

  const body = el("textarea", { placeholder: "30 seconds is enough. 🔒 Private by default." });
  const compose = card([
    el("h2", { text: "Quick log" }),
    el("p", { class: "small muted", text: "🔒 Everything here is private to you until you deliberately pass it on." }),
    body,
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn", text: "Save", onclick: async () => {
        const t = body.value.trim();
        if (!t) { toast("Write a single line — that's a complete entry."); return; }
        await Diary.addDiary({ body: t }); body.value = ""; toast("Saved. Just for you."); render();
      } }),
      voiceButton(body),
    ]),
  ]);
  s.append(compose);
  if (params.get("compose")) setTimeout(() => body.focus(), 50);

  if (entries.length === 0) {
    s.append(el("p", { class: "empty", text: "Your journal is empty. One honest line is a good start." }));
  } else {
    const list = card([el("h2", { text: `${entries.length} entr${entries.length === 1 ? "y" : "ies"}` })]);
    for (const e of entries) {
      list.append(el("div", { class: "entry" }, [
        el("div", { class: "entry-meta" }, [
          el("span", { class: "badge-state badge-private", text: "Private" }),
          el("span", { text: fmtDate(e.authoredAt || e.createdAt) }),
        ]),
        e.title ? el("h3", { text: e.title }) : null,
        el("div", { text: e.body }),
        el("div", { class: "btn-row", style: "margin-top:6px" }, [
          el("button", { class: "btn quiet small", text: "✈ Pass this on", onclick: () => passThisOn(e) }),
          el("button", { class: "btn quiet small", text: "Delete", onclick: async () => {
            if (confirm("Delete this entry? This can't be undone.")) { await Diary.deleteEntry(e.id); render(); }
          } }),
        ]),
      ]));
    }
    s.append(list);
  }
  mount(s);
}

// voice-first capture (R3.3) — records audio, stores blob, best-effort transcript stub
function voiceButton(targetTextarea) {
  const btn = el("button", { class: "btn sage", text: "🎙️ Record" });
  let rec, chunks = [];
  btn.addEventListener("click", async () => {
    if (rec && rec.state === "recording") { rec.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia) { toast("Voice recording isn't available on this device."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/mp4";
      rec = new MediaRecorder(stream, { mimeType: mime });
      chunks = [];
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        btn.textContent = "🎙️ Record";
        const blob = new Blob(chunks, { type: mime });
        const blobKey = db.uuid();
        await db.put("mediaBlobs", { blobKey, blob });
        const asset = { id: db.uuid(), kind: "audio", mimeType: mime, byteSize: blob.size,
          durationMs: null, blobKey, transcript: null, createdAt: db.now() };
        await db.put("mediaAssets", asset);
        await Diary.addDiary({ title: "Voice note", body: "🎙️ (voice entry — transcript pending)",
          mediaAssetIds: [asset.id] });
        toast("Voice note saved — your actual voice is a keepsake too.");
        render();
      };
      rec.start();
      btn.textContent = "⏹ Stop";
      toast("Recording… tap Stop when done.");
    } catch { toast("Couldn't access the mic."); }
  });
  return btn;
}

// ---- Focus — Breath & Hum (R17) ----
async function viewFocus() {
  await mountFocus(main);
}

// ---- For Them (R6) — the legacy channel ----
async function viewForThem() {
  const recips = await Legacy.listRecipients();
  const legacy = await Legacy.listLegacy();
  const s = section("For Them",
    el("p", { class: "muted", text:
      "The deliberate output — words you've chosen to pass on. Nothing lands here on its own; you always pick the child, choose the timing, and confirm." }));

  // recipients
  const recipCard = card([ el("h2", { text: "Who it's for" }) ]);
  if (recips.length === 0) recipCard.append(el("p", { class: "small muted", text: "Add your kids (or whoever this is for) so you can address entries to them by name." }));
  for (const r of recips) {
    recipCard.append(el("div", { class: "entry" }, [
      el("strong", { text: r.name }),
      r.relationship ? el("span", { class: "muted", text: " · " + r.relationship }) : null,
      el("div", { class: "btn-row", style: "margin-top:6px" }, [
        el("button", { class: "btn quiet small", text: "Remove", onclick: async () => {
          if (confirm(`Remove ${r.name}?`)) { await Legacy.deleteRecipient(r.id); render(); }
        } }),
      ]),
    ]));
  }
  recipCard.append(inlineAdd("Add a name (e.g. your child)…", async name => {
    const rel = prompt(`How are they to you? (e.g. son, daughter) — optional`, "") || "";
    await Legacy.addRecipient({ name, relationship: rel.trim() }); render();
  }));
  s.append(recipCard);

  // passed-on entries
  if (legacy.length === 0) {
    s.append(el("p", { class: "empty", text: "Nothing passed on yet. Open a Journal entry and choose “Pass this on.”" }));
  } else {
    const list = card([ el("h2", { text: `${legacy.length} passed on` }) ]);
    for (const e of legacy) {
      const badge = Legacy.stateBadge(e.state);
      const names = (e.recipientIds || []).map(id => recips.find(r => r.id === id)?.name || "someone").join(", ");
      list.append(el("div", { class: "entry" }, [
        el("div", { class: "entry-meta" }, [
          el("span", { class: "badge-state " + badge.cls, text: badge.label }),
          el("span", { text: "For " + names }),
        ]),
        e.title ? el("h3", { text: e.title }) : null,
        el("div", { text: e.body }),
        e.framingNote ? el("p", { class: "small muted", text: "“" + e.framingNote + "”" }) : null,
        el("p", { class: "small muted", text: Legacy.describeTiming(e.release || { kind: "now" }) }),
        el("div", { class: "btn-row", style: "margin-top:6px" }, [
          el("button", { class: "btn quiet small", text: "Revoke", onclick: async () => {
            if (confirm("Take this back? It won't reach them.")) {
              try { await Legacy.revoke(e.id); toast("Revoked."); render(); }
              catch { toast("Already delivered — can't revoke."); }
            }
          } }),
        ]),
      ]));
    }
    s.append(list);
    s.append(el("p", { class: "small muted", text:
      "Honest note: bequeathed entries aren't delivered by a server timer. They unlock through you or a trusted person at export — reliable over decades in a way a 20-year server promise isn't." }));
  }
  mount(s);
}

// ---- the "Pass this on" pivot (R6.2) — copies, never mutates the private original ----
async function passThisOn(entry) {
  const recips = await Legacy.listRecipients();
  if (recips.length === 0) {
    if (confirm("First, add who this is for. Go to “For Them” to add a recipient?")) go("/forthem");
    return;
  }
  const scrim = el("div", { class: "modal-scrim" });
  const chosen = new Set();
  let timing = { kind: "now" };
  const note = el("textarea", { placeholder: "A short word to frame it (optional)…" });

  const recipOpts = el("div", {}, recips.map(r => {
    const cb = el("input", { type: "checkbox", id: "r-" + r.id,
      onchange: e => { e.target.checked ? chosen.add(r.id) : chosen.delete(r.id); } });
    return el("label", { class: "recip-opt", for: "r-" + r.id }, [cb, el("span", { text: r.name + (r.relationship ? " · " + r.relationship : "") })]);
  }));

  const timingOpts = el("div", {}, [
    timingRadio("Share now — while you're here", { kind: "now" }, true),
    timingRadio("Bequeath — sealed until you're gone", { kind: "gone" }),
    timingRadio("Bequeath — until a date", { kind: "date" }, false, "date"),
    timingRadio("Bequeath — until they turn…", { kind: "age" }, false, "age"),
  ]);

  const modal = el("div", { class: "modal" }, [
    el("h2", { text: "Pass this on" }),
    el("p", { class: "small muted", text: "This copies the entry to your family channel. Your private original stays exactly as it is." }),
    entry.title ? el("h3", { text: entry.title }) : null,
    el("p", { class: "muted", text: entry.body.slice(0, 160) + (entry.body.length > 160 ? "…" : "") }),
    el("label", { text: "For whom?" }), recipOpts,
    el("label", { text: "When can they read it?" }), timingOpts,
    el("label", { text: "Framing note" }), note,
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn", text: "Review & confirm", onclick: confirmStep }),
      el("button", { class: "btn quiet", text: "Cancel", onclick: close }),
    ]),
  ]);
  scrim.append(modal);
  scrim.addEventListener("click", e => { if (e.target === scrim) close(); });
  document.body.append(scrim);

  function timingRadio(label, value, checked = false, extra = null) {
    const wrap = el("label", { class: "timing-opt" });
    const radio = el("input", { type: "radio", name: "timing", checked });
    radio.addEventListener("change", () => {
      if (extra === "date") { const d = prompt("Unlock on date (YYYY-MM-DD):", ""); timing = { kind: "date", date: d || "" }; }
      else if (extra === "age") { const a = prompt("Unlock when they turn what age?", "18"); timing = { kind: "age", age: +a || 18 }; }
      else timing = value;
    });
    wrap.append(radio, document.createTextNode(" " + label));
    return wrap;
  }

  function confirmStep() {
    if (chosen.size === 0) { toast("Pick at least one person."); return; }
    const names = [...chosen].map(id => recips.find(r => r.id === id)?.name).join(", ");
    modal.innerHTML = "";
    modal.append(
      el("h2", { text: "Confirm" }),
      el("p", { text: `You're passing “${entry.title || entry.body.slice(0, 40)}…” to ` }),
      el("p", { class: "muted", text: `${names} — ${Legacy.describeTiming(timing)}.` }),
      el("p", { class: "small muted", text: "Your private original is untouched. You can revoke this until it's delivered." }),
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn", text: "Seal it", onclick: async () => {
          await Legacy.passOn(entry.id, { recipientIds: [...chosen], timing, framingNote: note.value });
          close(); toast("Passed on. It's in “For Them.”");
        } }),
        el("button", { class: "btn quiet", text: "Back", onclick: close }),
      ]),
    );
  }
  function close() { scrim.remove(); }
}

// ---- Backup & Export (R9) ----
async function viewBackup() {
  const meta = await db.getMeta();
  const est = await db.storageEstimate();
  const pct = est && est.quota ? Math.round((est.usage / est.quota) * 100) : null;
  const s = section("Backup & Export",
    card([
      el("h2", { text: "Your words, portable forever" }),
      el("p", { class: "muted", text:
        "Browser storage is only a cache. The real archive is a file you keep. This is free, unlocked, and always will be." }),
      el("p", { class: "small muted", text: meta.lastBackupAt
        ? `Last backed up ${fmtDate(meta.lastBackupAt)}.` : "Never backed up yet." }),
      pct != null ? el("p", { class: "small muted", text: `Using about ${pct}% of this device's app storage.` }) : null,
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn", text: "⬇︎ Self-contained HTML", onclick: async () => {
          await Exp.exportHTML(); toast("Backup downloaded — opens on any device, no app needed."); render();
        } }),
        el("button", { class: "btn quiet", text: "⬇︎ Data file (.dadscode)", onclick: async () => {
          await Exp.exportJSON(); toast("Data file downloaded."); render();
        } }),
        el("button", { class: "btn quiet", text: "🖨 Print keepsake book", onclick: () => Exp.printBook() }),
      ]),
    ]),
    card([
      el("h2", { text: "Restore from a data file" }),
      restoreControl(),
    ]),
  );
  mount(s);
}
function restoreControl() {
  const input = el("input", { type: "file", accept: ".dadscode,.json,application/json" });
  input.addEventListener("change", async () => {
    const f = input.files[0]; if (!f) return;
    if (!confirm("Import this backup into your vault?")) return;
    try { await Exp.importJSON(f); toast("Restored."); render(); }
    catch { toast("Couldn't read that file."); }
  });
  return input;
}

// ---- Settings ----
async function viewSettings() {
  const meta = await db.getMeta();
  const prefs = getPrefs();
  const s = section("Settings",
    card([
      el("h2", { text: "You" }),
      el("label", { for: "set-name", text: "Your name (used on sign-off)" }),
      el("input", { type: "text", id: "set-name", value: meta.ownerName || "", onchange: async e => {
        await db.setMeta({ ownerName: e.target.value.trim() }); toast("Saved.");
      } }),
    ]),
    card([
      el("h2", { text: "Gentle reminder" }),
      el("label", { for: "set-time", text: "One nudge a day (optional), at:" }),
      el("input", { type: "time", id: "set-time", value: prefs.reminderTime,
        onchange: e => { setPref("reminderTime", e.target.value); toast("Saved."); } }),
      el("p", { class: "small muted", text: "At most one reminder. Never a second nag." }),
    ]),
    card([
      el("h2", { text: "Crisis resources (Australia)" }),
      el("p", { text: "Lifeline 13 11 14 · Beyond Blue 1300 22 4636 · MensLine 1300 78 99 78" }),
      el("p", { class: "small muted", text: "In immediate danger, call 000. This app can't diagnose — when in doubt, see your doctor." }),
    ]),
    card([
      el("h2", { text: "Danger zone" }),
      el("button", { class: "btn quiet", text: "Delete everything on this device", onclick: async () => {
        if (confirm("This permanently erases all your entries on this device. Export a backup first. Continue?")) {
          await db.purgeEverything(); toast("Everything cleared."); location.hash = "/home"; render();
        }
      } }),
    ]),
  );
  mount(s);
}

// ---- service worker + boot ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
render();
