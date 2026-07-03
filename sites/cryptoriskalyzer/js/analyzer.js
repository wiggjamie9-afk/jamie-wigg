/* hAI.CryptoRiskalyzer — Risikoanalyse-Engine (6 Kategorien)
 *
 * WICHTIG: Diese Engine ruft KEINE Live-On-Chain-Daten ab. Sie erzeugt eine
 * DETERMINISTISCHE Simulation aus der eingegebenen Adresse (Hash-basiert), damit
 * die UI ohne API-Keys/Egress reproduzierbar demonstriert werden kann.
 * Für echte Analysen müssten hier Explorer-/RPC-/Honeypot-APIs angebunden werden.
 */
(function (global) {
  "use strict";

  // Deterministischer 32-bit Hash (xfnv1a-artig) aus String.
  function hash32(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }
  // Kleiner PRNG (mulberry32) für stabile Pseudo-Zufallswerte pro Adresse.
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function span(rng, lo, hi) { return Math.round(lo + rng() * (hi - lo)); }

  // Kategorie-Definitionen: Gewichtung + Findings-Pool je nach Risikohöhe.
  var CATEGORIES = [
    {
      key: "contract", icon: "📋", name: "Smart Contract", weight: 0.22,
      high: ["Unverifizierte Code-Base", "Proxy-Muster erkannt (upgradebar)", "Aktive mint()-Funktion"],
      mid:  ["Teilweise verifiziert", "Ungewöhnliche Modifier gefunden"],
      low:  ["Verifizierter Contract", "Keine gefährlichen Funktionen", "Kein selfdestruct()"],
    },
    {
      key: "liquidity", icon: "💧", name: "Liquiditäts-Check", weight: 0.20,
      high: ["Liquidität NICHT gelockt (Rug-Pull-Gefahr)", "LP-Lock läuft in < 7 Tagen aus"],
      mid:  ["LP-Lock < 90 Tage", "Liquidität moderat (< 25k USD)"],
      low:  ["Liquidität langfristig gelockt", "Gesunde LP-Tiefe"],
    },
    {
      key: "wallets", icon: "👛", name: "Wallet-Verteilung", weight: 0.16,
      high: ["Top-Wallet hält > 30 %", "Top-10 halten > 70 %"],
      mid:  ["Top-Wallet 10–20 %", "Moderate Konzentration"],
      low:  ["Breite Verteilung", "Kein Wallet > 5 %"],
    },
    {
      key: "honeypot", icon: "🍯", name: "Honeypot-Detektor", weight: 0.18,
      high: ["Verkauf simuliert: BLOCKIERT", "Sell-Tax > 40 %"],
      mid:  ["Erhöhte Sell-Tax (10–25 %)", "Verzögerte Sells möglich"],
      low:  ["Kauf & Verkauf erfolgreich simuliert", "Symmetrische Tax"],
    },
    {
      key: "ownership", icon: "🔑", name: "Ownership-Analyse", weight: 0.14,
      high: ["Owner kann Blacklisten", "Mint-Privileg aktiv", "Ownership nicht renounced"],
      mid:  ["Owner-Rechte teilweise begrenzt", "Timelock vorhanden"],
      low:  ["Ownership renounced", "Keine Blacklist-Funktion"],
    },
    {
      key: "trading", icon: "📊", name: "Trading-Pattern", weight: 0.10,
      high: ["Wash-Trading-Signatur", "Pump-&-Dump-Muster", "MEV-Sandwich-Angriffe"],
      mid:  ["Auffällige Bot-Aktivität", "Unregelmäßiges Volumen"],
      low:  ["Organisches Handelsvolumen", "Keine Bot-Cluster"],
    },
  ];

  function levelFor(score) {
    // score = Risiko (0 sicher … 100 gefährlich)
    if (score >= 65) return "high";
    if (score >= 30) return "mid";
    return "low";
  }

  function analyze(address, chain) {
    var seed = hash32((chain || "eth") + ":" + (address || "").toLowerCase());
    var rng = mulberry32(seed);

    var categories = CATEGORIES.map(function (c) {
      // Pro Kategorie ein Pseudo-Risiko 5..95
      var risk = span(rng, 5, 95);
      var lvl = levelFor(risk);
      var pool = c[lvl];
      // 1–2 Findings passend zum Level
      var findings = [];
      findings.push(pick(rng, pool));
      if (rng() > 0.5) {
        var second = pick(rng, pool);
        if (second !== findings[0]) findings.push(second);
      }
      return { key: c.key, icon: c.icon, name: c.name, weight: c.weight,
               risk: risk, level: lvl, findings: findings };
    });

    // Gewichteter Gesamt-Risiko-Score
    var total = Math.round(categories.reduce(function (s, c) {
      return s + c.risk * c.weight;
    }, 0));
    total = Math.max(0, Math.min(100, total));

    return { address: address, chain: chain, total: total,
             level: levelFor(total), categories: categories };
  }

  global.CryptoRiskAnalyzer = { analyze: analyze, levelFor: levelFor };
})(window);
