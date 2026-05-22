const NS = 'codex:';

export const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
    } catch {}
  },

  remove(key) {
    try { localStorage.removeItem(NS + key); } catch {}
  },
};
