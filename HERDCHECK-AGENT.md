# HerdCheck → Vertical Action Agent

**Mapping HerdCheck from a screening *tool* into a livestock-health *agent* that takes action on the farmer's behalf.**

Grounded in the current codebase (`livestock/`): `scoring.js` (Sprecher lameness, mastitis, calving), `vision.js` (Canvas image heuristics), offline PWA, 6 languages.

---

## 1. Tool vs. Agent — what actually changes

| | **HerdCheck today (tool)** | **HerdCheck agent** |
|---|---|---|
| Who starts the work | Farmer opens app, taps through a check | Agent runs the monitoring loop on a schedule |
| What it produces | A risk tier + a *list of suggestions* | A **decision + an action it executes** |
| Vet contact | "Contact vet" text on screen | Agent drafts + sends the SMS/WhatsApp to the vet, with the animal's history attached |
| Re-checks | "Re-score in 48 hours" (farmer must remember) | Agent schedules it, reminds, and chases if missed |
| Co-op reporting | Farmer manually exports CSV | Agent files the co-op report automatically |
| Milk withholding | On-screen warning | Agent flags the batch + notifies the collection route |
| Farmer's role | Operator (does everything) | **Approver** (says yes/no to proposed actions) |

The spine you already built — structured veterinary scoring — becomes the agent's **perception + decision** layer. The new work is the **action layer** and the **autonomous loop**.

---

## 2. The agent loop (sense → decide → act → checkpoint)

```
   ┌─────────────────────────────────────────────────────┐
   │                                                       │
   │   SENSE          DECIDE          ACT        CHECKPOINT │
   │   (have)         (have)          (NEW)        (NEW)    │
   │                                                       │
   │  photo/video → tier + reasons → propose →  farmer says │
   │  checklist     (scoring.js)      action     yes / no   │
   │  gestation                         │            │      │
   │  day                               └────────────┘      │
   │     ▲                                     │            │
   │     └─────────── schedule next ◀──────────┘            │
   │                  (autonomous loop)                     │
   └─────────────────────────────────────────────────────┘
```

- **SENSE** — already built. `vision.analyseUdder()`, the Sprecher locomotion input, gestation-day math.
- **DECIDE** — already built. `scoreLameness / scoreMastitis / scoreCalving` return `{ tier, reasons, actions }`.
- **ACT** — *new.* Turn each item in `actions[]` from text into an executable capability (below).
- **CHECKPOINT** — *new.* For anything irreversible or money-spending (calling a vet, withholding milk, ordering supplies), the agent **proposes** and the farmer **approves** with one tap / one SMS reply. This is the trust mechanism that makes a low-literacy, high-stakes user comfortable.

---

## 3. The action surface — the agent's "hands"

This is the whole ballgame. An action agent is only as valuable as the actions it can actually complete. In rural India / Kenya / Bangladesh / Brazil the channels that *work* are SMS, voice, WhatsApp, and the co-op's existing pipes — not slick APIs.

| Action | Trigger | Channel | Checkpoint? |
|---|---|---|---|
| **Alert the vet / extension officer** | Red tier (lameness ≥4, mastitis ≥7, water bag) | SMS / WhatsApp w/ animal history + photo | Yes — farmer confirms "call vet" |
| **Schedule + chase a re-check** | Amber tier ("re-score in 48h") | Local notification + SMS reminder | No (just a nudge) |
| **Flag milk withholding** | Mastitis red | Mark batch in app + SMS to collection route / co-op | Yes |
| **File co-op report** | Any check, end of day | Co-op endpoint (the existing CSV, auto-posted) | No (passive) |
| **Pre-stage calving** | Calving amber/red window | Checklist + reminder + optional vet heads-up | No |
| **Order supplies** | Repeated mastitis in herd | WhatsApp order to local vet-pharmacy | Yes |
| **Escalate a missed action** | Re-check overdue + animal still amber/red | SMS to extension officer "Farm X has an unattended red animal" | No |

Build order: **vet-alert SMS first** (highest value, simplest), then re-check chasing, then co-op auto-reporting. Supplies/ordering last.

---

## 4. Why this rides the leading agent trend

From our earlier conversation — the money is in **vertical, action-taking agents**, not chat. HerdCheck-agent hits every box:

- **Vertical** — one job (smallholder herd health), one buyer, a niche no funded company chases. (Cainthus/big-dairy CV is a different, enterprise problem.)
- **Takes action** — it sends the SMS, files the report, withholds the batch. Doing > talking.
- **Human checkpoint** — the approve/deny step is exactly the "reliability + oversight" angle that's hot right now, and it's *essential* for a high-stakes rural user.

And the value is nameable in money/time (the test from before):
- **Saves money** — one prevented clinical mastitis case ≈ $200–400 in lost milk + treatment. One caught dystocia (bad calving) can save the calf *and* the cow.
- **Does what the untrained farmer can't** — consistent scoring + never forgetting a re-check + escalating at the right moment.
- **Removes a bottleneck** — the extension officer stops driving blind; the agent tells them which farm needs them *this week*.

---

## 5. Who pays (and for what)

The farmer mostly **doesn't** pay directly — that's the realistic part. The agent's actions are what institutions pay for:

| Buyer | Pays for | Model |
|---|---|---|
| **Dairy co-op** | Auto-filed reports + milk-withholding flags + per-farmer monitoring | Per-member/month license (e.g. ₹20–40/farmer) |
| **Ag-extension / NGO** | The "which farm needs a visit this week" escalation dashboard | Per-officer seat, or grant-funded deployment |
| **Vet-pharmacy network** | Supply orders routed to them | Referral / order commission |
| **Farmer (premium)** | SMS alerts + vet-on-call when offline | Small monthly, often subsidised by co-op |

The agent doesn't just screen — it **generates the institutional artifacts (reports, escalations, orders) that the institution was paying humans to chase.** That's the wedge.

---

## 6. What to build (honest, minimal path)

You do **not** need to rebuild the app. You bolt an action+loop layer onto the existing spine.

**Phase 1 — make one action real (1–2 weeks)**
- Add an SMS gateway (Twilio, or Africa's Talking / MSG91 for the target regions — cheaper, better local delivery).
- On a red tier, generate a vet-alert message from the existing `reasons[]` + `actions[]`, show the farmer a "Send to vet? [Yes]" button, send on confirm.
- Store sent actions in IndexedDB alongside observations (you already have the `db.js` wrapper).

**Phase 2 — close the loop (2–3 weeks)**
- Scheduler: amber tiers create a `due` re-check record; a daily check (service worker / on-open) surfaces overdue ones and fires reminders.
- A tiny co-op endpoint (Cloudflare Worker + D1) that accepts the existing CSV/JSON export automatically when online.

**Phase 3 — the institutional dashboard (3–4 weeks)**
- Extension-officer web view: all farms, sorted by unattended red/amber animals. This is the thing the co-op/NGO actually buys.
- Escalation: overdue red animal → SMS to the officer.

**Later — better perception (optional)**
- Drop a real CV model into the existing `vision.js` interface (`analyseUdder`, gait analysis from the lameness video). The agent gets *more accurate*, but the action layer is what makes it a business — build that first.

---

## 7. The one-line pitch

> **HerdCheck doesn't just tell a farmer their cow might be sick — it alerts the vet, withholds the milk, files the co-op report, and tells the extension officer which farm to visit, all from the phone in the farmer's pocket, offline, in their language.**

That's a vertical action agent. The screening tool you already built is the engine; the action layer is the car.

---

## 8. Honest caveats (don't skip these)

- **Liability rises with autonomy.** The moment the agent *acts* (withholds milk, calls a vet), wrong calls cost real money and trust. Keep the human checkpoint on every irreversible/money action. Keep "decision support, not diagnosis" framing.
- **Connectivity is the hard constraint.** Actions that need network (SMS, reporting) must queue offline and fire on reconnect. The agent's "act" step is async by necessity.
- **The image heuristic is still coarse.** Don't let the agent escalate on `vision.js` alone — the structured checklist must remain the dominant signal, exactly as `scoring.js` already enforces.
- **Selling to co-ops is slow.** Institutional sales cycles are months. Budget for that; it's the opposite of a viral consumer launch.
