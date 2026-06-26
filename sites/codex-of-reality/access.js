/* Codex of Reality — access / entitlement module.
 *
 * Reuses the proven Gumroad license-verify pattern already working in
 * /members.html. The full app stays usable as a free practice tier; membership
 * is what you sell. Check `CodexAccess.isMember()` anywhere you want to gate a
 * premium surface (e.g. the full protocol library or content drops).
 *
 * ── SETUP (you, one-time — needs your Gumroad account, not code) ──
 *   1. Create the "Codex of Reality" product on Gumroad (AU$30, license keys ON).
 *   2. Copy its permalink (the part after /l/ in the product URL).
 *   3. Set GUMROAD_PERMALINK and PURCHASE_URL below to the real values.
 * Until you do, activation will fail closed (no fake "member" state) and the
 * Unlock button points at the placeholder URL.
 */
(function (global) {
  "use strict";

  // ── CONFIG: replace with your real Gumroad product ──────────────────────
  var GUMROAD_PERMALINK = "codex-of-reality";                              // TODO
  var PURCHASE_URL = "https://wiggjamie.gumroad.com/l/codex-of-reality";   // TODO
  // ────────────────────────────────────────────────────────────────────────

  var VERIFY_URL = "https://api.gumroad.com/v2/licenses/verify";
  var STORE_KEY = "codex_membership_v1";
  var TTL_MS = 24 * 60 * 60 * 1000; // re-verify against Gumroad once a day

  function readCache() {
    try {
      var c = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (!c || typeof c.key !== "string" || typeof c.validatedAt !== "number") return null;
      return c;
    } catch (_) { return null; }
  }
  function writeCache(c) { try { localStorage.setItem(STORE_KEY, JSON.stringify(c)); } catch (_) {} }
  function clearCache() { try { localStorage.removeItem(STORE_KEY); } catch (_) {} }

  async function verify(key) {
    var body = new URLSearchParams();
    body.set("product_permalink", GUMROAD_PERMALINK);
    body.set("license_key", key);
    body.set("increment_uses_count", "false");
    var res;
    try {
      res = await fetch(VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    } catch (_) { throw new Error("Couldn't reach Gumroad — check your connection."); }
    var data;
    try { data = await res.json(); } catch (_) { throw new Error("Gumroad returned an unexpected response."); }
    if (!res.ok || !data.success) throw new Error((data && data.message) || "Invalid license key.");
    return data;
  }

  // Background re-verify; if refunded/revoked, drop membership silently.
  function reverify(key) {
    verify(key)
      .then(function (d) { writeCache({ key: key, validatedAt: Date.now(), purchase: d.purchase || null }); })
      .catch(function (e) { if (/invalid|revoked|refund/i.test(e.message)) clearCache(); });
  }

  return (global.CodexAccess = {
    PURCHASE_URL: PURCHASE_URL,

    isMember: function () {
      var c = readCache();
      if (!c) return false;
      if (Date.now() - c.validatedAt > TTL_MS) reverify(c.key); // refresh in background
      return true;
    },

    member: function () {
      var c = readCache();
      return c ? { since: c.validatedAt, purchase: c.purchase } : null;
    },

    activate: async function (key) {
      key = (key || "").trim();
      if (!key) throw new Error("Enter your license key.");
      var data = await verify(key);
      writeCache({ key: key, validatedAt: Date.now(), purchase: data.purchase || null });
      return data;
    },

    signOut: function () { clearCache(); },
  });
})(window);
