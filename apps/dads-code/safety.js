// safety.js — crisis resources, disclaimers, gentle escalation. (R16)
// Static and offline: everything here ships in the shell and works with no network.
// Calm is the safety feature — no red, no alarm, no scoring.

import { el } from "./ui.js";

export const CRISIS = {
  AU: {
    label: "Australia",
    lines: [
      ["Lifeline", "13 11 14"],
      ["Beyond Blue", "1300 22 4636"],
      ["MensLine", "1300 78 99 78"],
      ["Emergency", "000 — if you're in immediate danger"],
    ],
  },
  // room to internationalise (R12/R13.4)
};

export const DISCLAIMER =
  "This app can't diagnose. It tracks and reflects — it never scores you against a clinical threshold. When in doubt, see your doctor.";

// A static, findable crisis card (R16.2) — reachable in ≤2 taps.
export function crisisCard(region = "AU") {
  const r = CRISIS[region] || CRISIS.AU;
  return el("div", { class: "card" }, [
    el("h2", { text: "If it's heavy right now" }),
    el("p", { class: "muted", text: "You don't have to carry it alone. These are here any time." }),
    ...r.lines.map(([name, num]) =>
      el("p", { text: "" }, [ el("strong", { text: name + ": " }), el("span", { text: num }) ])),
    el("p", { class: "small muted", text: DISCLAIMER }),
  ]);
}

// One calm, dismissible support card (R16.3) — never a pop-up wall, never red.
export function supportCard(onDismiss) {
  const card = el("div", { class: "banner" }, [
    el("span", { text: "That sounds like a lot to carry lately. Here's who's there, any time — no pressure." }),
    el("button", { class: "btn quiet", text: "See", onclick: () => { location.hash = "/clarity"; onDismiss && onDismiss(); } }),
    el("button", { class: "btn quiet", text: "Not now", onclick: () => { card.remove(); onDismiss && onDismiss(); } }),
  ]);
  return card;
}
