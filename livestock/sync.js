// HerdCheck — store-and-forward sync to the co-op backend (opt-in).
// Reconciles the local IndexedDB against what's already been synced and pushes
// the difference to POST /api/herd/sync. Designed to never touch the critical
// path of a check and to tolerate long offline gaps: it retries on reconnect,
// on tab-visible, on a slow interval, and right after a new observation is saved.
// Only ever runs for a member who has joined an org AND consented. See
// specs/herdcheck/{requirements,design,api}.md.

(function () {
  const SYNCED = 'syncedObs'; // settings row: array of observation ids already accepted
  let flushing = false;
  let pending = false;
  let timer = null;

  function online() {
    return typeof navigator === 'undefined' || navigator.onLine !== false;
  }

  // Strip to the API's Observation shape — never send images/video or notes.
  function toApiObs(o) {
    return {
      id: o.id,
      animalId: o.animalId,
      kind: o.kind,
      ts: o.ts,
      tier: o.tier || 'gray',
      reasons: Array.isArray(o.reasons) ? o.reasons : [],
      actions: Array.isArray(o.actions) ? o.actions : [],
    };
  }

  function toApiAnimal(a) {
    return { id: a.id, tag: a.tag || '', species: a.species || 'cow' };
  }

  // Push everything not yet acknowledged by the server. Idempotent on the
  // server side, so re-sending after a failure is safe.
  async function flush() {
    if (flushing) { pending = true; return; }
    const cfg = await window.HC.org.config();
    const st = await window.HC.org.status();
    if (!st.canSync || !online()) return;

    flushing = true;
    try {
      const syncedIds = (await window.HC.db.getSetting(SYNCED)) || [];
      const syncedSet = new Set(syncedIds);
      const allObs = await window.HC.db.listObservations();
      const unsent = allObs.filter((o) => o && o.id && !syncedSet.has(o.id));
      if (unsent.length === 0) return;

      // Only ship animals referenced by the unsent observations.
      const animalIds = new Set(unsent.map((o) => o.animalId));
      const animals = (await window.HC.db.listAnimals()).filter((a) => animalIds.has(a.id));

      const res = await fetch(cfg.baseUrl.replace(/\/+$/, '') + '/api/herd/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cfg.token,
        },
        body: JSON.stringify({
          animals: animals.map(toApiAnimal),
          observations: unsent.map(toApiObs),
        }),
      });

      if (res.status === 401) {
        // Token no longer valid — stop trying until the member re-joins.
        console.warn('HerdCheck sync: unauthorized; leaving org sync paused');
        return;
      }
      if (!res.ok) return; // 503 / transient — keep ids unmarked, retry later.

      // Mark the batch as synced.
      unsent.forEach((o) => syncedSet.add(o.id));
      await window.HC.db.setSetting(SYNCED, Array.from(syncedSet));
    } catch (_) {
      // Network/parse failure — leave for the next trigger. Never throw.
    } finally {
      flushing = false;
      if (pending) { pending = false; scheduleFlush(); }
    }
  }

  function scheduleFlush() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, 1200); // debounce bursts of saves
  }

  // Wrap db.saveObservation so a new check schedules a push — without the save
  // path ever awaiting the network (fire-and-forget after the local write).
  function instrument() {
    const db = window.HC.db;
    if (!db || db.__herdSyncWrapped) return;
    const orig = db.saveObservation;
    db.saveObservation = async function (o) {
      const r = await orig(o);
      scheduleFlush();
      return r;
    };
    db.__herdSyncWrapped = true;
  }

  function start() {
    instrument();
    flush();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', flush);
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') flush();
      });
      setInterval(function () { if (online()) flush(); }, 60000);
    }
  }

  window.HC = window.HC || {};
  window.HC.sync = { start, flush };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }
})();
