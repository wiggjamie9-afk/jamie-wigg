// HerdCheck — organisation membership (opt-in)
// Lets a member join a co-op / program so their screenings can sync to the org
// dashboard. Strictly opt-in and consented: if a member never joins, the app
// stays 100% local and account-free (the default everyone keeps). See
// specs/herdcheck/{requirements,design,api}.md.

(function () {
  const KEY = 'org'; // settings row: { baseUrl, orgId, orgName, role, token, memberName, consent }

  const DEFAULT_BASE = 'https://herd.studio.starlightmix.com';

  async function config() {
    return (await window.HC.db.getSetting(KEY)) || null;
  }

  function joined(cfg) {
    return !!(cfg && cfg.token && cfg.orgId);
  }

  // POST /api/herd/join — exchange an org code for a member/staff token.
  async function join({ baseUrl, orgCode, memberName }) {
    const base = (baseUrl || DEFAULT_BASE).replace(/\/+$/, '');
    const res = await fetch(base + '/api/herd/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgCode: (orgCode || '').trim(), memberName: (memberName || '').trim() }),
    });
    let data = {};
    try { data = await res.json(); } catch (_) { /* ignore */ }
    if (!res.ok || data.ok === false || !data.token) {
      return { ok: false, reason: data.reason || data.error || 'Could not join. Check the code.' };
    }
    // Consent is captured separately (setConsent) before anything syncs.
    await window.HC.db.setSetting(KEY, {
      baseUrl: base,
      orgId: data.orgId,
      orgName: data.orgName,
      role: data.role || 'member',
      token: data.token,
      memberName: (memberName || '').trim(),
      consent: false,
    });
    return { ok: true, orgName: data.orgName, role: data.role || 'member' };
  }

  // Explicit, reversible consent. Nothing leaves the phone until this is true.
  async function setConsent(value) {
    const cfg = await config();
    if (!cfg) return;
    cfg.consent = !!value;
    await window.HC.db.setSetting(KEY, cfg);
  }

  // Leave the org: clears local org config and the sync marker so no further
  // data is sent. (Server-side deletion is requested out-of-band per R7.)
  async function leave() {
    await window.HC.db.setSetting(KEY, null);
    await window.HC.db.setSetting('syncedObs', []);
  }

  async function status() {
    const cfg = await config();
    return {
      joined: joined(cfg),
      orgName: cfg ? cfg.orgName : null,
      role: cfg ? cfg.role : null,
      consent: !!(cfg && cfg.consent),
      canSync: joined(cfg) && !!(cfg && cfg.consent) && cfg.role === 'member',
    };
  }

  window.HC = window.HC || {};
  window.HC.org = { DEFAULT_BASE, config, joined, join, setConsent, leave, status };
})();
