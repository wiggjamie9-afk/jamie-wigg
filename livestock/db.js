// HerdCheck — IndexedDB wrapper
// Stores: animals, observations, settings (single row)

(function() {
  const DB_NAME = 'herdcheck';
  const DB_VERSION = 1;
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('animals')) {
          const s = db.createObjectStore('animals', { keyPath: 'id' });
          s.createIndex('tag', 'tag', { unique: false });
        }
        if (!db.objectStoreNames.contains('observations')) {
          const s = db.createObjectStore('observations', { keyPath: 'id' });
          s.createIndex('animalId', 'animalId', { unique: false });
          s.createIndex('ts', 'ts', { unique: false });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  function tx(store, mode = 'readonly') {
    return openDB().then(db => db.transaction(store, mode).objectStore(store));
  }

  async function put(store, value) {
    const s = await tx(store, 'readwrite');
    return new Promise((res, rej) => {
      const r = s.put(value);
      r.onsuccess = () => res(value);
      r.onerror = () => rej(r.error);
    });
  }

  async function get(store, key) {
    const s = await tx(store);
    return new Promise((res, rej) => {
      const r = s.get(key);
      r.onsuccess = () => res(r.result || null);
      r.onerror = () => rej(r.error);
    });
  }

  async function getAll(store) {
    const s = await tx(store);
    return new Promise((res, rej) => {
      const r = s.getAll();
      r.onsuccess = () => res(r.result || []);
      r.onerror = () => rej(r.error);
    });
  }

  async function remove(store, key) {
    const s = await tx(store, 'readwrite');
    return new Promise((res, rej) => {
      const r = s.delete(key);
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    });
  }

  async function clearAll() {
    const db = await openDB();
    const stores = ['animals', 'observations', 'settings'];
    return Promise.all(stores.map(s => new Promise((res, rej) => {
      const r = db.transaction(s, 'readwrite').objectStore(s).clear();
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    })));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  window.HC = window.HC || {};
  window.HC.db = {
    // Animals
    saveAnimal: (a) => put('animals', a),
    getAnimal: (id) => get('animals', id),
    listAnimals: () => getAll('animals'),
    deleteAnimal: (id) => remove('animals', id),

    // Observations
    saveObservation: (o) => put('observations', o),
    getObservation: (id) => get('observations', id),
    listObservations: () => getAll('observations'),
    observationsFor: async (animalId) => {
      const all = await getAll('observations');
      return all.filter(o => o.animalId === animalId)
        .sort((a, b) => b.ts.localeCompare(a.ts));
    },

    // Settings (key/value)
    getSetting: async (key) => {
      const row = await get('settings', key);
      return row ? row.value : null;
    },
    setSetting: (key, value) => put('settings', { key, value }),
    getSettings: async () => {
      const all = await getAll('settings');
      const out = {};
      all.forEach(r => { out[r.key] = r.value; });
      return out;
    },

    clearAll,
    uid
  };
})();
