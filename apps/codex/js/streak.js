// Daily-ritual streak tracker. Local-only state via Storage.
// A session "counts" once its duration crosses the protocol's minimum (passed in).

import { Storage } from './storage.js';

const KEY = 'streak';

export const Streak = {
  load() {
    return Storage.get(KEY, {
      current: 0,
      longest: 0,
      lastDate: null,        // YYYY-MM-DD
      totalSessions: 0,
    });
  },

  todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  // Returns the new state and whether the streak ticked up.
  recordSession() {
    const s = this.load();
    const today = this.todayKey();
    const ticked = s.lastDate !== today;

    if (ticked) {
      if (s.lastDate) {
        const last = new Date(s.lastDate);
        const now = new Date(today);
        const days = Math.round((now - last) / 86400000);
        s.current = days === 1 ? s.current + 1 : 1;
      } else {
        s.current = 1;
      }
      s.lastDate = today;
      s.longest = Math.max(s.longest, s.current);
    }
    s.totalSessions += 1;
    Storage.set(KEY, s);
    return { state: s, ticked };
  },

  metToday() {
    const s = this.load();
    return s.lastDate === this.todayKey();
  },
};
