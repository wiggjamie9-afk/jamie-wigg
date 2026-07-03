/* hAI.CryptoRiskalyzer — UI-Controller & Event-Handling */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var addr = $("addr"), chain = $("chain"), btn = $("analyzeBtn");
  var progress = $("progress"), results = $("results");
  var ringFill = $("ringFill"), scoreNum = $("scoreNum"),
      scoreLabel = $("scoreLabel"), verdict = $("verdict"), catsEl = $("categories");

  var RING_LEN = 2 * Math.PI * 86; // r = 86
  ringFill.style.strokeDasharray = RING_LEN;
  ringFill.style.strokeDashoffset = RING_LEN;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var STEPS = [
    "Contract-Bytecode wird geprüft…",
    "Liquiditäts-Pools & LP-Locks werden analysiert…",
    "Wallet-Verteilung wird berechnet…",
    "Honeypot-Simulation (Buy/Sell)…",
    "Owner-Rechte & Privilegien werden geprüft…",
    "Trading-Pattern werden ausgewertet…",
  ];

  var COLORS = { high: "#ff4d5e", mid: "#f6c453", low: "#3ddc84" };
  var LABEL = { high: "Gefahr", mid: "Warnung", low: "Sicher" };
  var VERDICT = {
    high: "🔴 Hohes Risiko — mehrere kritische Warnsignale. Vorsicht geboten.",
    mid:  "🟡 Mittleres Risiko — einige Auffälligkeiten. Genau prüfen.",
    low:  "🟢 Geringes Risiko — keine schweren Warnsignale gefunden.",
  };

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }

  function isValidAddress(v, ch) {
    v = (v || "").trim();
    if (!v) return false;
    if (ch === "sol") return v.length >= 32 && v.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(v);
    return /^0x[a-fA-F0-9]{40}$/.test(v);
  }

  function animateScore(total, level) {
    // Ring: höherer Risk = mehr gefüllt
    ringFill.style.stroke = COLORS[level];
    ringFill.style.strokeDashoffset = RING_LEN - (RING_LEN * total) / 100;
    scoreLabel.textContent = LABEL[level];
    scoreLabel.style.color = COLORS[level];

    if (reduce) { scoreNum.textContent = total; return; }
    var start = performance.now(), dur = 1100;
    (function tick(now) {
      var p = Math.max(0, Math.min(1, (now - start) / dur));
      scoreNum.textContent = Math.round(total * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else scoreNum.textContent = total;
    })(start);
  }

  function renderCategories(cats) {
    catsEl.innerHTML = "";
    cats.forEach(function (c, i) {
      var el = document.createElement("article");
      el.className = "cat risk-" + c.level;
      el.innerHTML =
        '<div class="cat-head"><span class="ico">' + c.icon + '</span>' +
        '<h3>' + c.name + '</h3><span class="cscore">' + c.risk + '/100</span></div>' +
        '<div class="cat-bar"><i></i></div>' +
        '<ul>' + c.findings.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>';
      catsEl.appendChild(el);
      // animate bar
      var bar = el.querySelector(".cat-bar i");
      requestAnimationFrame(function () {
        setTimeout(function () { bar.style.width = c.risk + "%"; }, reduce ? 0 : 120 + i * 80);
      });
    });
  }

  async function run() {
    var address = addr.value.trim(), ch = chain.value;
    if (!isValidAddress(address, ch)) {
      addr.focus();
      addr.style.borderColor = "#ff4d5e";
      progress.hidden = false;
      progress.innerHTML = '<div class="line in">⚠️ Ungültige Adresse für die gewählte Chain.</div>';
      results.hidden = true;
      return;
    }
    addr.style.borderColor = "";
    btn.disabled = true;
    results.hidden = true;
    progress.hidden = false;
    progress.innerHTML = "";

    for (var i = 0; i < STEPS.length; i++) {
      var line = document.createElement("div");
      line.className = "line";
      line.innerHTML = '<span class="tick">▸</span> ' + STEPS[i];
      progress.appendChild(line);
      requestAnimationFrame(function (l) { return function () { l.classList.add("in"); }; }(line));
      await sleep(280);
      line.querySelector(".tick").textContent = "✓";
    }
    await sleep(200);

    var res = window.CryptoRiskAnalyzer.analyze(address, ch);
    progress.hidden = true;
    results.hidden = false;
    verdict.textContent = VERDICT[res.level];
    renderCategories(res.categories);
    animateScore(res.total, res.level);
    results.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    btn.disabled = false;
  }

  btn.addEventListener("click", run);
  addr.addEventListener("keydown", function (e) { if (e.key === "Enter") run(); });
})();
