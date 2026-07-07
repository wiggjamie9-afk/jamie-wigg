/* ============================================================
   NEONDECK Pulse Engine — v1.2.0
   A living-data simulation engine. Not AI — honest simulation,
   borrowing the mathematics of living systems:

   - Breathing metrics: each stat follows a random walk with
     momentum and mean-reversion (it drifts, it never explodes)
   - Circadian rhythm: a slow global load wave all metrics feel
   - Homeostasis: occasional stress spikes (anomalies) that the
     system detects, flags, and recovers from on its own
   - A heartbeat event feed narrating what the organism is doing

   Runs entirely in the browser. Auto-starts on dashboard pages
   (paused automatically for visitors who prefer reduced motion).
   Toggle with the floating SIM button, or remove this script /
   set <body data-nd-sim="off"> to disable entirely.
   ============================================================ */
(function () {
  "use strict";

  if (document.body.getAttribute("data-nd-sim") === "off") return;
  if (!document.body.getAttribute("data-nd-api")) return; // dashboards only

  var TICK_MS = 2000;
  var t = 0, timer = null;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function randn() { // approx normal(0,1)
    return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 0.577;
  }
  // Global "circadian" load: slow sine + wandering noise, in [-1, 1]
  var wander = 0;
  function load() {
    wander = Math.max(-1, Math.min(1, wander + randn() * 0.05));
    return 0.6 * Math.sin(t / 38) + 0.4 * wander;
  }
  // Format a number the way the original string was formatted
  function fmtLike(orig, n) {
    var dec = (orig.split(".")[1] || "").length;
    var s = Math.max(0, n).toFixed(dec);
    if (orig.indexOf(",") !== -1) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: dec });
    return s;
  }

  /* ---------- registry ---------- */
  var stats = []; // { el, base, v, spike }
  document.querySelectorAll('[data-api-text^="stats."]').forEach(function (el) {
    var v = parseFloat(el.textContent.replace(/,/g, ""));
    if (!isNaN(v)) stats.push({ el: el, orig: el.textContent, base: v, v: v, spike: 0 });
  });

  var charts = []; // { el, type, values (array or array of arrays) }
  document.querySelectorAll('[data-nd-chart="sparkline"],[data-nd-chart="line"]').forEach(function (el) {
    try {
      var vals = JSON.parse(el.getAttribute("data-values"));
      el.setAttribute("data-nd-noanim", "1"); // skip draw-in on sim re-renders
      charts.push({ el: el, type: el.getAttribute("data-nd-chart"), values: vals });
    } catch (e) { /* skip malformed */ }
  });

  var terminal = document.querySelector("[data-api-feed]") || document.querySelector(".nd-terminal");

  /* ---------- organism behaviours ---------- */
  function step(v, base, L, spike) {
    // mean-reversion toward a load-shifted baseline + gentle noise
    var target = base * (1 + 0.12 * L + spike);
    return v + (target - v) * 0.1 + base * 0.015 * randn();
  }

  function nextPoint(series, L) {
    var base = series.reduce(function (a, b) { return a + b; }, 0) / series.length;
    var last = series[series.length - 1];
    return Math.max(0, step(last, base, L, 0));
  }

  function feed(kind, tag, text) {
    if (!terminal) return;
    var icons = { ok: "✓", info: "ℹ", warn: "⚠", err: "✗" };
    var d = new Date();
    var time = [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (x) { return String(x).padStart(2, "0"); }).join(":");
    var line = document.createElement("div");
    line.innerHTML = '<span class="t-time">' + time + '</span><span class="t-' + kind + '">' +
      icons[kind] + " " + tag + "</span> " + text;
    terminal.insertBefore(line, terminal.firstChild);
    while (terminal.children.length > 24) terminal.removeChild(terminal.lastChild);
  }

  var HEARTBEATS = [
    ["info", "pulse", "vitals nominal · rhythm steady"],
    ["ok", "homeostasis", "all metrics within adaptive range"],
    ["info", "cycle", "load wave cresting · redistributing"],
    ["ok", "repair", "drift corrected on node cluster"],
    ["info", "memory", "short-term buffers compacted"]
  ];

  var anomaly = null; // { stat, ticksLeft }
  function maybeAnomaly() {
    if (anomaly || !stats.length || Math.random() > 0.06) return;
    var s = stats[Math.floor(Math.random() * stats.length)];
    anomaly = { stat: s, ticksLeft: 4 };
    s.spike = 0.55;
    var card = s.el.closest(".nd-card");
    if (card) card.classList.add("nd-sim-anomaly");
    feed("warn", "anomaly", "stress spike detected · compensating");
  }
  function tickAnomaly() {
    if (!anomaly) return;
    anomaly.ticksLeft--;
    if (anomaly.ticksLeft <= 0) {
      anomaly.stat.spike = 0;
      var card = anomaly.stat.el.closest(".nd-card");
      if (card) card.classList.remove("nd-sim-anomaly");
      feed("ok", "recovered", "vital stabilised · homeostasis restored");
      anomaly = null;
    }
  }

  /* ---------- tick ---------- */
  function tick() {
    t++;
    var L = load();

    stats.forEach(function (s) {
      s.v = Math.max(0, step(s.v, s.base, L, s.spike));
      s.el.textContent = fmtLike(s.orig, s.v);
    });

    charts.forEach(function (c) {
      if (c.type === "line" && Array.isArray(c.values[0])) {
        c.values.forEach(function (series) { series.push(nextPoint(series, L)); series.shift(); });
      } else if (c.type === "sparkline") {
        c.values.push(nextPoint(c.values, L)); c.values.shift();
      } else { return; }
      c.el.setAttribute("data-values", JSON.stringify(c.values));
      delete c.el.dataset.ndRendered;
      c.el.innerHTML = "";
    });
    if (window.NDCharts) window.NDCharts.render(document);

    maybeAnomaly();
    tickAnomaly();
    if (t % 9 === 0) {
      var h = HEARTBEATS[Math.floor(Math.random() * HEARTBEATS.length)];
      feed(h[0], h[1], h[2]);
    }
  }

  /* ---------- toggle button + styles ---------- */
  var style = document.createElement("style");
  style.textContent =
    ".nd-sim-toggle{position:fixed;right:18px;bottom:18px;z-index:99;font-family:var(--nd-font-mono,monospace);" +
    "font-size:11px;letter-spacing:.14em;padding:9px 16px;border-radius:999px;cursor:pointer;" +
    "background:rgba(10,10,11,.85);color:#9aa0b8;border:1px solid rgba(140,150,190,.35);backdrop-filter:blur(8px)}" +
    ".nd-sim-toggle.on{color:#a8ff3e;border-color:rgba(168,255,62,.5);box-shadow:0 0 14px rgba(168,255,62,.25)}" +
    ".nd-sim-anomaly{border-color:rgba(255,77,109,.65)!important;box-shadow:0 0 22px rgba(255,77,109,.3)}";
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.className = "nd-sim-toggle";
  btn.type = "button";
  document.body.appendChild(btn);

  function setRunning(on) {
    if (on && !timer) timer = setInterval(tick, TICK_MS);
    if (!on && timer) { clearInterval(timer); timer = null; }
    btn.classList.toggle("on", !!timer);
    btn.textContent = timer ? "◉ PULSE ENGINE · LIVE" : "○ PULSE ENGINE · PAUSED";
  }
  btn.addEventListener("click", function () { setRunning(!timer); });

  // Let the data binder finish first, then start (paused if reduced motion)
  setTimeout(function () {
    setRunning(!reduced);
    if (timer) feed("info", "pulse-engine", "simulation online · organism breathing");
  }, 1600);
})();
