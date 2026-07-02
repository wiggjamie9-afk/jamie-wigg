# Dad's Code — Beta Test Kit

**Goal:** learn what's actually broken *before* polishing the wrong things. You never launch a legacy product cold. This is a small, honest, privacy-respecting beta with real fathers.

**Prerequisite:** `DEVICE-QA.md` passes on a real iPhone + Android first. Do not hand a data-losing app to a grieving dad.

---

## Who to recruit (5–10 dads)
Aim for a spread, not a focus group of your friends:
- 2–3 dads of **young kids** (the primary user — stretched, time-poor).
- 1–2 who are **not techy** (the real test of the no-accounts, voice-first flow).
- 1–2 who have **lost their own father** (they feel the legacy dimension most sharply — handle with care).
- Ideally 1 who'd **receive** it (an adult child), to test the "For Them" side.

Keep it people you can have an honest conversation with. 5 good sessions beat 50 survey responses.

## The one thing to watch: **activation**
The whole hypothesis is that a dad will add his first entries. So the core task is:

> "Open it and, however you like, capture three things you'd want your kids to know. Talk out loud as you go — tell me what you're thinking, where you hesitate, what feels off."

Then **shut up and watch.** Don't guide. Note:
- Do they reach **3 entries**? How long? Where do they stall (blank page? which mode?)?
- Do they try **voice** or default to typing? (Voice is the soul — is it discoverable?)
- Does the **death/legacy framing** land warmly or make them recoil?
- Do they find the **Focus / breathe** thing on their own? Do they get it?
- What do they call it? Do they say "I'd actually use this"? Do they ask "can my kids get this if I'm gone?" — that question = the product working.

## The consent + safety caveat (say this up front, every time)
> "This is early. Keep your own copy of anything precious — export a backup. It stores everything only on your phone; I can't see any of it. Some of this touches heavy stuff — no pressure to go deep, and it's not a substitute for real support. There's a crisis-help button in there if you ever need it."

For the dads who've lost their father, add: *"If anything gets too much, we stop — no problem at all."*

## What NOT to do
- Don't demo it *to* them first — you'll teach them the "right" path and learn nothing.
- Don't defend the design when they trip. Their confusion is the finding.
- Don't collect their entries or ask to see them. It's private by design; honor that.

## Capture (keep it light)
Per session, jot:
1. **Time to first entry** and **entries completed** (the activation metric).
2. **Top 3 friction points** (verbatim if possible).
3. **The one moment their face changed** — good or bad. That's the signal.
4. **Would they keep it / gift it?** (1–5) and why.
5. One thing they wish it did.

## After 5 sessions — decide
- If dads consistently hit 3 entries and one moment lands → **polish + expand the beta.**
- If they stall at the blank page or bounce on the framing → **fix onboarding before anything else.** That's the make-or-break.
- Watch for the recurring "I wish…" — that's your real roadmap, not our advisor guesses.

## Distribution for the beta
- Simplest: deploy to the GitHub Pages preview / a private URL, text them the link, "Add to Home Screen."
- Or a TestFlight build later via the existing Capacitor wrapper (only if you want the App Store path).

---

*Reminder of the ethical floor (from the spec): a father's own words are never paywalled or held hostage. During beta, make backup/export effortless and obvious — trust is the product.*
