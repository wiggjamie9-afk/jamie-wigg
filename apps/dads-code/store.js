// store.js — localStorage for SMALL UI/settings state only. (R8.1)
// Never irreplaceable content here — that all lives in IndexedDB.

const KEY = "dadscode.prefs";
const DEFAULTS = {
  theme: "warm",
  reminderTime: "20:30",   // evening wind-down (R3.4)
  reminderOn: false,
  lastView: "#/home",
  resurfaceInApp: true,
};

export function getPrefs() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return { ...DEFAULTS }; }
}
export function setPref(key, value) {
  const p = getPrefs();
  p[key] = value;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  return p;
}
