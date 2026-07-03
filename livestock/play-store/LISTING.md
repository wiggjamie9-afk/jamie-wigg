# HerdCheck — Google Play submission kit

Everything below is **paste-ready** for the Google Play Console
(play.google.com/console → your app → *Grow › Store presence › Main store listing*).
Character limits are Google's; these all fit.

---

## App details

| Field | Value |
|---|---|
| **App name** (max 30) | `HerdCheck: Livestock Health` |
| **Default language** | English (United States) – `en-US` |
| **App or game** | App |
| **Free or paid** | Free (see "Pricing note" below) |
| **Category** | Productivity *(alt: Business)* |
| **Contact email** | wiggjamie9@gmail.com |
| **Privacy policy URL** | https://rhythmixapp.com.au/livestock/privacy.html |

---

## Short description (max 80 chars)

```
Offline phone-camera checks for lameness, mastitis & calving. No account needed.
```
*(79 characters.)*

---

## Full description (max 4000 chars)

```
HerdCheck turns the phone in your pocket into a livestock-screening tool — no
special equipment, no account, and no internet required.

Built for smallholder dairy and small-ruminant farmers, HerdCheck helps you spot
three of the costliest problems early, and score them the same way every time:

• LAMENESS — record a short walking video and score it on the Sprecher 5-point
  locomotion scale, the published gold standard.
• MASTITIS — photograph the udder and tick the visible signs (swelling,
  asymmetry, redness, heat, pain, yield drop). The app adds a simple image check
  for symmetry and redness to back up your observation.
• CALVING — log behavioural signs (bagging up, restlessness, mucus, off feed,
  and more) alongside the gestation day for the species, and get an early warning
  before she calves.

Works for cattle, buffalo, sheep, and goats, with the correct gestation length
for each.

WHY FARMERS USE IT
• Works fully OFFLINE — perfect for farms with weak or no signal.
• NO account, NO login, NO tracking. Everything stays on your phone.
• Every check gives a clear risk tier — green (fine), amber (watch), red (urgent)
  — with plain-language reasons and what to do next.
• Your herd dashboard floats the animals that need attention to the top.
• An Alerts tab surfaces urgent cases and upcoming calvings automatically.
• Export your records to CSV or JSON for your co-op, or share an alert summary by
  message.
• Available in English, Hindi, Bengali, Swahili, Portuguese, and Spanish.

HONEST ABOUT WHAT IT IS
HerdCheck is a structured screening and record-keeping aid, not a diagnosis. It
helps a farmer with no formal training make consistent observations, track them
over time, and know when to call a vet or extension worker. It does not replace
professional veterinary advice.

FOR CO-OPS AND EXTENSION AGENCIES
The CSV export is built to drop into existing herd-records systems, and the
alerts view tells field officers which farms need a visit this week.

No sign-up. Open it and start checking your herd.
```

---

## Graphics assets checklist

| Asset | Requirement | Status |
|---|---|---|
| **App icon** | 512×512 PNG, 32-bit | ✅ `livestock/icon-512.png` |
| **Feature graphic** | 1024×500 PNG/JPG (required) | ⬜ needs creating — I can generate one |
| **Phone screenshots** | 2–8, 16:9 or 9:16, min 320px | ✅ available in `livestock/screenshots/` (home, add, lameness-form, mastitis-form, result-red, alerts) — pick 4–6 |
| **Tablet screenshots** | optional | — |

---

## Content rating (questionnaire answers)

Play makes you fill an IARC questionnaire. HerdCheck should rate **Everyone / PEGI 3**. Key answers:
- Violence / sexual content / language / controlled substances → **No** to all.
- Collects personal info / shares location → **No** (nothing leaves the device).
- User-generated content shared with others → **No**.

## Data safety form (required)

Answer: **No data collected. No data shared.** All data is stored on-device only.
This matches the privacy policy above and is HerdCheck's biggest selling point —
it makes this form trivially clean.

---

## Pricing note (upfront vs backend)

Listing it **Free** is the fastest route to approval and the widest reach for
low-income farmers. Two ways to earn later, without changing the app's core:
1. **Upfront** — flip it to a small paid price (e.g. AU$3), or keep free with a
   one-time "Pro" in-app unlock.
2. **Backend** — a low monthly subscription for premium features (SMS alerts,
   vet-on-call, unlimited animals). Best sold to co-ops/NGOs, not individuals.

Recommendation for launch: **ship it Free**, get installs and reviews, add a paid
unlock once there's traction.

---

## What still needs a real build

This kit covers the *listing*. To actually upload, HerdCheck (a PWA) must be
wrapped as a signed Android app bundle (`.aab`). The repo already has Capacitor
wrappers to base this on. That build step is separate from this document.
