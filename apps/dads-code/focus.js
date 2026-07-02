// focus.js — Focus: Breath & Hum (R17). ~10 stress-free minutes to discharge the load.
// Self-contained view. Web-Audio-generated tone (no shipped audio files, R13).
// Assembles the mechanism described in design §5b, restyled to the warm-archival brand.

import * as db from "./db.js";
import { el, toast, consistencyLine } from "./ui.js";

// ---- the three already-authored patterns (R17.2) ----
// phase.scale drives the orb size; hum flags the exhale where humming is taught.
export const PROTOCOLS = {
  coherence: {
    id: "coherence", name: "Coherence 5·0·5", tagline: "5 in · 5 out · 6 breaths/min",
    blurb: "The gentlest. No holds. The HRV 'coherence' pace — best for everyday stress.",
    caution: null,
    phases: [
      { label: "Inhale", secs: 5, scale: 1.3 },
      { label: "Exhale · hum", secs: 5, scale: 0.78, hum: true },
    ],
  },
  three69: {
    id: "three69", name: "3·6·9 Breath", tagline: "in 3 · hold 6 · out 9",
    blurb: "The signature Dad's Code pattern — a long exhale for deeper vagal discharge.",
    caution: "Has breath holds. If you have a heart/lung condition or are pregnant, use Coherence 5·0·5 instead. Never while driving or exerting.",
    phases: [
      { label: "Inhale", secs: 3, scale: 1.3 },
      { label: "Hold", secs: 6, scale: 1.3 },
      { label: "Exhale · hum", secs: 9, scale: 0.78, hum: true },
    ],
  },
  box: {
    id: "box", name: "Box 4·4·4·4", tagline: "equal in · hold · out · hold",
    blurb: "Steady, even, grounding. A soldier's-calm square.",
    caution: "Has breath holds. Prefer Coherence 5·0·5 if holds feel uneasy.",
    phases: [
      { label: "Inhale", secs: 4, scale: 1.3 },
      { label: "Hold", secs: 4, scale: 1.3 },
      { label: "Exhale · hum", secs: 4, scale: 0.78, hum: true },
      { label: "Hold", secs: 4, scale: 0.78 },
    ],
  },
};

export const TONES = [
  { hz: 432, label: "432 Hz" },
  { hz: 528, label: "528 Hz" },
  { hz: 7.83, label: "7.83 Hz (Schumann)" },
];

// ---- Web Audio tone engine (reuse of the oscillator factory idea, R17.5) ----
function createToneEngine() {
  let ctx = null, osc = null, gain = null;
  return {
    start(freq) {
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        this.stop();
        osc = ctx.createOscillator();
        gain = ctx.createGain();
        osc.type = "sine";
        // 7.83Hz is sub-audible; nudge to an audible carrier so it's felt, not silent
        osc.frequency.value = freq < 20 ? 174 + freq : freq;
        gain.gain.value = 0;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1); // gentle fade-in
      } catch { /* no audio available — silent, harmless */ }
    },
    stop() {
      try {
        if (gain && ctx) gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        if (osc) { const o = osc; setTimeout(() => { try { o.stop(); } catch {} }, 700); }
        osc = null;
      } catch {}
    },
  };
}

// ---- session logging: additive, forgiving (R17.7). Stored as kind 'focus' entries. ----
async function logSession(protocolId, seconds) {
  await db.put("entries", {
    id: db.uuid(), kind: "focus", type: "session",
    title: PROTOCOLS[protocolId]?.name || protocolId,
    body: `${Math.round(seconds / 60)} min`,
    lang: "en", categoryIds: [], recipientIds: [], mediaAssetIds: [], milestoneId: null,
    state: "private", mood: null, isDraft: false, isFavorite: false, isSensitive: false,
    createdAt: db.now(), updatedAt: db.now(), authoredAt: db.now(), schemaVersion: db.SCHEMA_VERSION,
  });
}
async function focusDates() {
  return (await db.byIndex("entries", "by_kind", "focus")).map(e => (e.authoredAt || e.createdAt).slice(0, 10));
}

// ---- "learn the harm" card (R17.6) — wellness language only, no medical claims ----
const HARM = {
  title: "Why 10 minutes matters",
  points: [
    "Always-on stress keeps cortisol high and your vagal 'brake' low — a body stuck in low-grade fight-or-flight.",
    "Slow breathing at ~6 breaths/min nudges the nervous system back toward rest in minutes.",
    "Humming on the exhale raises nasal nitric oxide roughly 15× (Weitzberg & Lundberg, Karolinska 2002).",
    "In one study, humming showed the lowest stress index of any measured state — including sleep (Trivedi 2023).",
  ],
  disclaimer: "This is a practice, not a treatment. It doesn't diagnose or cure anything. When in doubt, see your doctor.",
};

// ---- the view ----
export async function mountFocus(container) {
  const state = { protocol: "coherence", minutes: 10, tone: null, hum: true };
  const tone = createToneEngine();
  let running = false, stopFlag = false;

  const wrap = el("section", { class: "stack" }, [ el("h1", { text: "Focus — Breath & Hum" }) ]);

  // protocol picker
  const picker = el("div", { class: "card" }, [ el("h2", { text: "Take 10" }),
    el("p", { class: "small muted", text: "One paced session to let the day's load out of your body. Pick a pattern, a length, hit start." }) ]);
  const protoChips = el("div", { class: "domain-chips" });
  for (const p of Object.values(PROTOCOLS)) {
    protoChips.append(el("button", { class: "chip", text: p.name, dataset: { id: p.id },
      onclick: () => { state.protocol = p.id; syncPicker(); } }));
  }
  const protoBlurb = el("p", { class: "muted" });
  const lenRow = el("div", { class: "btn-row" }, [3, 5, 10].map(m =>
    el("button", { class: "btn quiet", dataset: { m }, text: `${m} min`,
      onclick: () => { state.minutes = m; syncPicker(); } })));
  const toneRow = el("div", { class: "btn-row" }, [
    el("button", { class: "btn quiet", dataset: { tone: "off" }, text: "No tone",
      onclick: () => { state.tone = null; syncPicker(); } }),
    ...TONES.map(t => el("button", { class: "btn quiet", dataset: { tone: String(t.hz) }, text: t.label,
      onclick: () => { state.tone = t.hz; syncPicker(); } })),
  ]);
  const humToggle = el("button", { class: "btn quiet",
    onclick: () => { state.hum = !state.hum; syncPicker(); } });
  const cautionP = el("p", { class: "small", style: "color:var(--oxblood)" });
  const startBtn = el("button", { class: "btn big", text: "Begin", onclick: startSession });
  picker.append(protoChips, protoBlurb, el("label", { text: "How long?" }), lenRow,
    el("label", { text: "Tone (optional, headphones nicer)" }), toneRow, humToggle, cautionP, startBtn);
  wrap.append(picker);

  function syncPicker() {
    const p = PROTOCOLS[state.protocol];
    protoBlurb.textContent = `${p.tagline} — ${p.blurb}`;
    cautionP.textContent = p.caution || "";
    humToggle.textContent = state.hum ? "🎵 Humming: on" : "Humming: off";
    protoChips.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.id === state.protocol)));
    lenRow.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.m === state.minutes)));
    toneRow.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed",
      String((b.dataset.tone === "off" && state.tone == null) || +b.dataset.tone === state.tone)));
  }
  syncPicker();

  // learn the harm
  wrap.append(el("div", { class: "card" }, [
    el("h2", { text: HARM.title }),
    ...HARM.points.map(t => el("p", { class: "muted", text: "· " + t })),
    el("p", { class: "small muted", text: HARM.disclaimer }),
  ]));

  // consistency heatmap (additive, R17.7)
  const dates = await focusDates();
  wrap.append(el("div", { class: "card" }, [
    el("h2", { text: "Your practice" }),
    heatmap(dates),
    el("p", { class: "small muted center", text: consistencyLine(dates, 14, "practised") + " — no streak to break." }),
  ]));

  container.append(wrap);

  // ---- the running session ----
  async function startSession() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    running = true; stopFlag = false;
    const p = PROTOCOLS[state.protocol];
    const totalSecs = state.minutes * 60;

    const orb = el("div", { class: "focus-orb" });
    const phaseLabel = el("div", { class: "focus-phase", text: "Settle…" });
    const timeLabel = el("div", { class: "small muted" });
    const stopBtn = el("button", { class: "btn quiet", text: "End early", onclick: endSession });
    const stage = el("section", { class: "stack center" }, [
      el("h1", { text: p.name }),
      orb, phaseLabel, timeLabel,
      el("p", { class: "small muted", text: state.hum ? "Hum softly on each exhale." : "Breathe with the ring." }),
      stopBtn,
    ]);
    container.innerHTML = ""; container.append(stage);

    if (state.tone != null) tone.start(state.tone);

    const started = Date.now();
    // ~30s settle
    await countdown(phaseLabel, timeLabel, started, totalSecs, "Settle in…", 30 / (state.minutes >= 5 ? 6 : 3), reduced);
    if (stopFlag) return endSession(true);

    // main paced loop
    let idx = 0;
    while (!stopFlag && (Date.now() - started) / 1000 < totalSecs) {
      const phase = p.phases[idx % p.phases.length];
      phaseLabel.textContent = phase.label;
      if (!reduced) {
        orb.style.transition = `transform ${phase.secs}s ease-in-out`;
        orb.style.transform = `scale(${phase.scale})`;
      }
      await tick(phase.secs, () => {
        timeLabel.textContent = fmtRemain(started, totalSecs);
      });
      idx++;
    }
    endSession(true);
  }

  async function endSession(completed = false) {
    if (!running) return;
    running = false; stopFlag = true;
    tone.stop();
    const secs = completed ? state.minutes * 60 : Math.max(30, 0);
    await logSession(state.protocol, secs);
    container.innerHTML = "";
    container.append(el("section", { class: "stack center" }, [
      el("h1", { text: completed ? "Nicely done." : "That still counts." }),
      el("p", { class: "muted", text: "Your nervous system just got a little of its own back. Same time tomorrow?" }),
      el("div", { class: "card" }, [
        el("p", { class: "muted", text: "Want to leave your kids the habit that steadies you?" }),
        el("button", { class: "btn quiet", text: "Note it for them later", onclick: async () => {
          const { addDiary } = await import("./diary.js");
          await addDiary({ kind: "diary", title: "A habit worth passing on",
            body: "The 10-minute breath practice steadies me. I'd want my kids to know it." });
          toast("Saved privately — you can pass it on from your Journal.");
        } }),
      ]),
      el("button", { class: "btn", text: "Back to Focus", onclick: () => { container.innerHTML = ""; mountFocus(container); } }),
    ]));
  }

  function stop() { stopFlag = true; tone.stop(); }
  return { stop };

  // helpers scoped to this view
  function tick(secs, onFrame) {
    return new Promise(res => {
      const end = Date.now() + secs * 1000;
      const iv = setInterval(() => {
        onFrame && onFrame();
        if (stopFlag || Date.now() >= end) { clearInterval(iv); res(); }
      }, 200);
    });
  }
  async function countdown(phaseLabel, timeLabel) {
    phaseLabel.textContent = "Settle…";
    await tick(30);
  }
  function fmtRemain(started, total) {
    const left = Math.max(0, Math.round(total - (Date.now() - started) / 1000));
    return `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")} left`;
  }
}

// 12-week style additive heatmap (reuse of the PULSE idea)
function heatmap(dates) {
  const set = new Set(dates);
  const grid = el("div", { class: "heatmap" });
  const today = new Date();
  for (let i = 41; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    grid.append(el("span", { class: "hm-cell" + (set.has(key) ? " on" : ""), title: key }));
  }
  return grid;
}
