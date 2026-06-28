# HerdCheck Risk Scoring

This folder implements **HerdCheck** — an offline-first PWA that screens livestock
for three conditions on a smallholder's phone: **lameness**, **mastitis**, and
**calving readiness**. This doc covers the *scoring subsystem* — how raw farmer
observations (and optional photos) become a red/amber/green risk tier with plain
advice.

There is no server and no ML model. All scoring is deterministic, runs in the
browser, and is grounded in published veterinary references (Sprecher 5-point
locomotion scale; CMT clinical-sign correlates; species gestation windows).

## What it does

A farmer opens an animal, runs a check, and gets back:

1. **Tier** — `red` / `amber` / `green` (or `gray` when there's no data yet).
2. **Reasons** — a short list explaining *why* that tier was assigned.
3. **Actions** — concrete next steps written for a non-vet (e.g. "STOP selling
   milk from this animal").

Each check is one of three scorers. All three return the same shape, so the UI
and history view treat them uniformly.

---

## Data model

A **scorer** takes a plain options object and returns a **result**:

```
scoreLameness({ locomotionScore })                         → Result
scoreMastitis({ signs, milk, imageMetrics })               → Result
scoreCalving({ signs, species, bredISO })                  → Result

Result = {
  tier:    'red' | 'amber' | 'green',
  reasons: string[],     // why this tier (English, see gotcha below)
  actions: string[],     // what to do next
  score:   number,       // raw points (calving/mastitis) or locomotion (lameness)
  // calving only:
  window?: string, gestationDay?: number, expectedDay?: number
}
```

The app wraps each result in an **observation** before persisting it to IndexedDB
(`db.js`, store `observations`):

```
Observation = {
  id, animalId, kind: 'lameness'|'mastitis'|'calving',
  ts: ISO8601, data: {...raw inputs}, videoDataUrl?|imageDataUrl?,
  tier, reasons, actions          // copied flat from the Result
}
```

`animalTier(observations)` rolls an animal's history up to a single dot colour:
it takes the **most recent observation of each kind**, then returns the **worst**
tier among them (`red > amber > green`). The herd list (`app.js`) calls this per
animal.

---

## How each scorer works

**Lameness** — the Sprecher locomotion score *is* the signal. The tier follows it
directly: `>=4 → red`, `2–3 → amber`, `1 → green`. No points math; no image input.

**Mastitis** — additive points model. Visible signs are weighted
(`pain:3`, others `2`), milk appearance is single-select
(`normal:0 … blood:6`), and image metrics (see below) add **at most +1 each** so a
photo can corroborate but never override the checklist. `>=7 pts`, or clotted/bloody
milk, → red; `>=3` → amber.

**Calving** — combines **gestation day** (derived from `bredISO` + species
`GESTATION` table) with observed pre-calving signs. `waterBag` is the override:
it forces red + "Active labour" regardless of points. Otherwise points + days-left
decide the tier and the `window` string ("Within 24 hours", "1–7 days", …).

### Image heuristics (`vision.js`)

`analyseUdder(file)` is **coarse colour/symmetry analysis on a downscaled canvas**,
not a CV model. It returns `{ asymmetry, rednessFraction, brightness }`, fed into
`scoreMastitis` as `imageMetrics`. Thresholds that add points:
`asymmetry > 0.18` and `rednessFraction > 0.15`. Keep these conservative — the
honest scope is "surface signal the farmer can corroborate," and the +1 cap
enforces that.

---

## Conventions to preserve

- **The four-tier vocabulary is load-bearing.** `red|amber|green|gray` is used by
  scoring, the herd dots, and the CSS. Don't introduce a fifth tier or rename them.
- **Image input corroborates, never decides.** Any new metric must stay capped
  (≤ +1) and must not be able to flip a green checklist to red on its own.
- **Scorers stay pure and synchronous.** No DB, no DOM, no `await` inside
  `scoring.js`. Persistence and image decoding live in `db.js` / `vision.js`.
- **References before thresholds.** New weights/cutoffs should cite a source in a
  comment, matching the existing header citations.

### Gotcha: scoring text is NOT translated

The app chrome is localised through `i18n.js`, but the `reasons` and `actions`
strings are **hard-coded English inside `scoring.js`**. A non-English user gets a
translated UI but English advice. If you localise scoring output, route these
strings through `i18n.js` rather than translating in place — and note the strings
are also persisted flat onto each observation, so historical records stay in the
language they were created in.

---

## Key files

| File | Role |
|------|------|
| `scoring.js` | The three scorers + `animalTier` + `GESTATION` table. Pure, deterministic. Exposed as `window.HC.scoring`. |
| `vision.js` | Canvas image heuristics (`analyseUdder`) + video thumbnailing + `blobToDataUrl`. Exposed as `window.HC.vision`. |
| `db.js` | IndexedDB wrapper (`animals`, `observations`, `settings` stores). Exposed as `window.HC.db`. |
| `app.js` | Wires forms → scorers → `db.saveObservation`, and renders tier/reasons/actions. Owns the observation shape. |
| `i18n.js` | UI string catalogue. Does **not** cover scoring output (see gotcha). |
| `index.html` | Form markup; `data-sign` attributes map checkboxes to the `signs` keys the scorers expect. |
