/* hAI.CryptoRiskalyzer — Risikoanalyse-Engine (6 Kategorien)
 *
 * Zwei Datenquellen:
 *   1) LIVE  — GoPlus Token Security API (kostenlos, kein Key, CORS-fähig) für
 *              EVM-Chains (ETH/BSC/Polygon/Base). Felder werden auf die 6
 *              Kategorien gemappt.
 *   2) SIMULATION — deterministischer Fallback aus der Adresse (Hash + PRNG),
 *              falls die API scheitert, das Token unbekannt ist oder die Chain
 *              (z. B. Solana) hier nicht live unterstützt wird.
 *
 * `analyze()` versucht zuerst LIVE und fällt still auf SIMULATION zurück.
 * Das Ergebnis trägt `source: "live" | "simulation"`.
 */
(function (global) {
  "use strict";

  // ---- Kategorie-Metadaten (Icon / Name / Gewicht) -----------------------
  var META = [
    { key: "contract",  icon: "📋", name: "Smart Contract",     weight: 0.22 },
    { key: "liquidity", icon: "💧", name: "Liquiditäts-Check",  weight: 0.20 },
    { key: "wallets",   icon: "👛", name: "Wallet-Verteilung",  weight: 0.16 },
    { key: "honeypot",  icon: "🍯", name: "Honeypot-Detektor",  weight: 0.18 },
    { key: "ownership", icon: "🔑", name: "Ownership-Analyse",  weight: 0.14 },
    { key: "trading",   icon: "📊", name: "Trading-Pattern",    weight: 0.10 },
  ];
  function metaOf(key) { for (var i = 0; i < META.length; i++) if (META[i].key === key) return META[i]; }

  function levelFor(score) { return score >= 65 ? "high" : score >= 30 ? "mid" : "low"; }
  function clampCat(risk, findings) {
    risk = Math.max(0, Math.min(100, Math.round(risk)));
    return { risk: risk, level: levelFor(risk), findings: findings.slice(0, 3) };
  }
  function total(categories) {
    var t = categories.reduce(function (s, c) { return s + c.risk * c.weight; }, 0);
    return Math.max(0, Math.min(100, Math.round(t)));
  }
  function assemble(map) {
    return META.map(function (m) {
      var r = map[m.key];
      return { key: m.key, icon: m.icon, name: m.name, weight: m.weight,
               risk: r.risk, level: r.level, findings: r.findings };
    });
  }

  // ========================================================================
  //  1) SIMULATION (deterministisch)
  // ========================================================================
  function hash32(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var SIM_POOL = {
    contract: { high: ["Unverifizierte Code-Base", "Proxy-Muster (upgradebar)", "Aktive mint()-Funktion"],
                mid: ["Teilweise verifiziert", "Ungewöhnliche Modifier"], low: ["Verifizierter Contract", "Kein selfdestruct()"] },
    liquidity: { high: ["Liquidität NICHT gelockt (Rug-Pull-Gefahr)", "LP-Lock < 7 Tage"],
                 mid: ["LP-Lock < 90 Tage", "Geringe LP-Tiefe"], low: ["Liquidität langfristig gelockt", "Gesunde LP-Tiefe"] },
    wallets: { high: ["Top-Wallet > 30 %", "Top-10 > 70 %"], mid: ["Top-Wallet 10–20 %"], low: ["Breite Verteilung", "Kein Wallet > 5 %"] },
    honeypot: { high: ["Verkauf simuliert: BLOCKIERT", "Sell-Tax > 40 %"], mid: ["Erhöhte Sell-Tax"], low: ["Buy & Sell erfolgreich", "Symmetrische Tax"] },
    ownership: { high: ["Owner kann Blacklisten", "Mint-Privileg aktiv", "Nicht renounced"], mid: ["Owner teilweise begrenzt"], low: ["Ownership renounced", "Keine Blacklist"] },
    trading: { high: ["Wash-Trading-Signatur", "Pump-&-Dump", "MEV-Sandwich"], mid: ["Bot-Aktivität"], low: ["Organisches Volumen"] },
  };
  function simulate(address, chain) {
    var rng = mulberry32(hash32((chain || "eth") + ":" + (address || "").toLowerCase()));
    function pick(a) { return a[Math.floor(rng() * a.length)]; }
    var map = {};
    META.forEach(function (m) {
      var risk = Math.round(5 + rng() * 90), lvl = levelFor(risk), pool = SIM_POOL[m.key][lvl];
      var f = [pick(pool)];
      if (rng() > 0.5) { var s = pick(pool); if (s !== f[0]) f.push(s); }
      map[m.key] = clampCat(risk, f);
    });
    var cats = assemble(map);
    return { address: address, chain: chain, total: total(cats), level: levelFor(total(cats)),
             categories: cats, source: "simulation" };
  }

  // ========================================================================
  //  2) LIVE — GoPlus Token Security
  // ========================================================================
  var CHAIN_ID = { eth: "1", bsc: "56", matic: "137", base: "8453" };

  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function is1(v) { return v === "1" || v === 1 || v === true; }

  function evalContract(d) {
    var r = 8, f = [];
    if (d.is_open_source === "0") { r += 55; f.push("Unverifizierter Code (nicht open source)"); }
    else f.push("Verifizierter Contract");
    if (is1(d.is_proxy)) { r += 20; f.push("Proxy-Muster (upgradebar)"); }
    if (is1(d.is_mintable)) { r += 20; f.push("Aktive mint()-Funktion"); }
    if (is1(d.selfdestruct)) { r += 25; f.push("selfdestruct() vorhanden"); }
    return clampCat(r, f);
  }
  function evalLiquidity(d) {
    var r = 15, f = [];
    var inDex = is1(d.is_in_dex) || (d.dex && d.dex.length);
    if (!inDex) { r += 45; f.push("Nicht an einer DEX gelistet"); }
    var lps = d.lp_holders || [], locked = 0;
    lps.forEach(function (h) { if (is1(h.is_locked)) locked += num(h.percent); });
    if (lps.length === 0) { r += 18; f.push("Keine LP-Holder-Daten"); }
    else if (locked < 0.5) { r += 30; f.push("Liquidität überwiegend NICHT gelockt (Rug-Pull-Gefahr)"); }
    else f.push("Liquidität gelockt (" + Math.round(locked * 100) + "%)");
    return clampCat(r, f);
  }
  function evalWallets(d) {
    var r = 12, f = [];
    var top = (d.holders && d.holders.length) ? num(d.holders[0].percent) : NaN;
    if (!isNaN(top)) {
      if (top > 0.3) { r += 45; f.push("Top-Wallet hält " + (top * 100).toFixed(0) + "%"); }
      else if (top > 0.1) { r += 20; f.push("Top-Wallet hält " + (top * 100).toFixed(0) + "%"); }
      else f.push("Breite Verteilung (Top < 10 %)");
    } else f.push("Keine Holder-Verteilungsdaten");
    var ownerP = num(d.owner_percent || d.creator_percent);
    if (ownerP > 0.05) { r += 15; f.push("Owner/Creator hält " + (ownerP * 100).toFixed(0) + "%"); }
    return clampCat(r, f);
  }
  function evalHoneypot(d) {
    var r = 5, f = [];
    if (is1(d.is_honeypot)) { r += 90; f.push("HONEYPOT erkannt"); }
    if (is1(d.cannot_sell_all)) { r += 40; f.push("Kann nicht vollständig verkauft werden"); }
    if (is1(d.transfer_pausable)) { r += 25; f.push("Transfers pausierbar"); }
    var sell = num(d.sell_tax);
    if (sell >= 0.4) { r += 40; f.push("Sell-Tax " + (sell * 100).toFixed(0) + "%"); }
    else if (sell >= 0.1) { r += 20; f.push("Erhöhte Sell-Tax " + (sell * 100).toFixed(0) + "%"); }
    if (!f.length) f.push("Buy & Sell möglich, keine Honeypot-Signale");
    return clampCat(r, f);
  }
  function evalOwnership(d) {
    var r = 10, f = [];
    var owner = (d.owner_address || "").toLowerCase();
    var renounced = owner === "" || /^0x0+$/.test(owner) || owner.indexOf("dead") !== -1;
    if (renounced) f.push("Ownership renounced"); else { r += 15; f.push("Ownership NICHT renounced"); }
    if (is1(d.can_take_back_ownership)) { r += 30; f.push("Owner kann Rechte zurückholen"); }
    if (is1(d.hidden_owner)) { r += 25; f.push("Versteckter Owner"); }
    if (is1(d.is_blacklisted)) { r += 22; f.push("Blacklist-Funktion"); }
    if (is1(d.owner_change_balance)) { r += 25; f.push("Owner kann Balances ändern"); }
    if (is1(d.is_mintable)) { r += 12; f.push("Mint-Privileg aktiv"); }
    return clampCat(r, f);
  }
  function evalTrading(d) {
    var r = 10, f = [];
    if (is1(d.trading_cooldown)) { r += 20; f.push("Trading-Cooldown"); }
    if (is1(d.is_anti_whale) && is1(d.anti_whale_modifiable)) { r += 15; f.push("Anti-Whale-Limit veränderbar"); }
    if (is1(d.slippage_modifiable)) { r += 20; f.push("Tax/Slippage veränderbar"); }
    if (is1(d.is_whitelisted)) { r += 10; f.push("Whitelist aktiv"); }
    if (!f.length) f.push("Keine auffälligen Trading-Restriktionen");
    return clampCat(r, f);
  }

  function mapGoPlus(d, address, chain) {
    var map = {
      contract: evalContract(d), liquidity: evalLiquidity(d), wallets: evalWallets(d),
      honeypot: evalHoneypot(d), ownership: evalOwnership(d), trading: evalTrading(d),
    };
    var cats = assemble(map);
    return { address: address, chain: chain, total: total(cats), level: levelFor(total(cats)),
             categories: cats, source: "live", tokenName: d.token_name, tokenSymbol: d.token_symbol };
  }

  function analyzeReal(address, chain) {
    var id = CHAIN_ID[chain];
    if (!id) return Promise.resolve(null);   // Solana etc. -> Simulation
    var url = "https://api.gopluslabs.io/api/v1/token_security/" + id +
              "?contract_addresses=" + encodeURIComponent(address.toLowerCase());
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 12000);
    return fetch(url, { signal: ctrl.signal, headers: { "Accept": "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) {
        clearTimeout(timer);
        if (!j || j.code !== 1 || !j.result) return null;
        var key = Object.keys(j.result)[0];
        var d = key && j.result[key];
        if (!d || Object.keys(d).length === 0) return null;   // Token unbekannt
        return mapGoPlus(d, address, chain);
      })
      .catch(function () { clearTimeout(timer); return null; });
  }

  // ---- Öffentliche API ---------------------------------------------------
  function analyze(address, chain) {
    return analyzeReal(address, chain).then(function (live) {
      return live || simulate(address, chain);
    });
  }

  global.CryptoRiskAnalyzer = { analyze: analyze, simulate: simulate, levelFor: levelFor };
})(window);
