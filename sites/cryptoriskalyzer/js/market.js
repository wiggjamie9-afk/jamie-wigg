/* hAI.CryptoRiskalyzer — Marktdaten-Banner (Fear & Greed, Trending)
 * Lädt data/market-data.json (täglich per GitHub Action aktualisiert).
 * Fällt bei Fehler still auf die eingebetteten Beispieldaten zurück. */
(function () {
  "use strict";
  var banner = document.getElementById("marketBanner");
  if (!banner) return;
  var inner = banner.querySelector(".market-inner");

  function fgColor(v) { return v >= 60 ? "#3ddc84" : v >= 40 ? "#f6c453" : "#ff4d5e"; }
  function fgLabel(v) {
    if (v >= 75) return "Extreme Greed"; if (v >= 55) return "Greed";
    if (v >= 45) return "Neutral"; if (v >= 25) return "Fear"; return "Extreme Fear";
  }

  function render(d) {
    var fg = d.fear_greed || {};
    var val = typeof fg.value === "number" ? fg.value : 50;
    var trending = (d.trending || []).slice(0, 5);
    inner.innerHTML =
      '<span class="fg">😨/🤑 Fear &amp; Greed: ' +
        '<b style="color:' + fgColor(val) + '">' + val + '</b> · ' + (fg.label || fgLabel(val)) + '</span>' +
      '<span class="trending">' + trending.map(function (c) {
        var chg = typeof c.change_24h === "number" ? c.change_24h : 0;
        var cls = chg >= 0 ? "up" : "down";
        var sign = chg >= 0 ? "▲" : "▼";
        return '<span class="coin">' + (c.symbol || c.name || "?") +
               ' <span class="' + cls + '">' + sign + ' ' + Math.abs(chg).toFixed(1) + '%</span></span>';
      }).join("") + '</span>' +
      (d.updated ? '<span style="color:var(--faint)">· Stand ' + d.updated + '</span>' : '');
  }

  var FALLBACK = {
    updated: "Beispiel",
    fear_greed: { value: 54, label: "Neutral" },
    trending: [
      { symbol: "BTC", change_24h: 1.8 }, { symbol: "ETH", change_24h: 2.4 },
      { symbol: "SOL", change_24h: -3.1 }, { symbol: "BNB", change_24h: 0.6 },
      { symbol: "MATIC", change_24h: -1.2 }
    ]
  };

  fetch("data/market-data.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () { render(FALLBACK); });
})();
