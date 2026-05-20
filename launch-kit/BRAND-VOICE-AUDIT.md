# RHYTHMIX Brand-Voice Consistency Audit — v1 Narrations

Scope: 8 product clips (RESONATE x2, FREQUENCY DREAMS x2, RHYTHMIX LIVE x2, HUM x2) + 4 RHYTHMIX-core brand clips (anthem, itslive, launch, teaser).
References: `launch-kit/{resonate,dreams,hum,live}/BRAND.md`.

## Summary

Overall consistency is strong within each sub-brand silo — RESONATE, DREAMS, and HUM hold the FREQUENCY-family contemplative voice (lineage citations, on-device guarantees, "nothing leaves the device"), and the RHYTHMIX-core / LIVE clips hold the kinetic Space-Grotesk voice ("Track in. Beat-sync. Three videos out."). The biggest cross-product drift is at the **price-line / CTA layer**, where domain pronunciation is inconsistent ("rhythmixapp dot com dot au" vs. "rhythmix app dot com dot au" vs. "rhythmix app dot com dot a u"), and the **RHYTHMIX LIVE / pitch clip** leaks into off-brand language ("Made the song. Now make the moment.") that drops the locked "Now what?" hook from the LIVE BRAND.md voice. There is also one **wellness-claim risk** in resonate/science.txt that exceeds the "designed to support / associated with" guardrail. Net: 9 drift items, one of them severity-high (wellness/medical claim wording).

## Drift findings

1. **resonate/science/paste.txt — wellness-claim breach (HIGH severity).**
   Drift: "Music therapy produces large effect sizes against anxiety." This crosses the RESONATE BRAND.md guardrail explicitly: "No medical claims ('treats anxiety', 'cures insomnia') — say 'designed to support', 'associated with', or 'honour the coherence research' instead." "Effect sizes against anxiety" reads as a medical efficacy claim.
   Exact quote: `Twenty twenty-five. The Lancet meta-analysis. Music therapy produces large effect sizes against anxiety.`
   Suggested replacement: `Twenty twenty-five. The Lancet meta-analysis. Music therapy is associated with large effect sizes in anxiety research.`

2. **All 8 product clips — domain pronunciation inconsistency.**
   Drift: Three different spoken forms of the same URL appear across narrations: `rhythmixapp dot com dot au` (resonate, dreams, hum), `rhythmix app dot com dot au` (live), and `rhythmix app dot com dot a u` (anthem, launch, teaser). For TTS this produces audibly different sign-offs across the family.
   Exact quotes:
   - resonate/pitch: `rhythmixapp dot com dot au slash resonate.`
   - live/pitch: `rhythmix app dot com dot au slash live.`
   - rhythmix-anthem: `Begin at rhythmix app dot com dot a u.`
   Suggested replacement: Pick one canonical spoken form for the whole family and apply globally — recommended: `rhythmix app dot com dot a u` (matches RHYTHMIX-core anthem/launch/teaser, splits the syllables clearly for TTS). Update RESONATE, DREAMS, HUM, and LIVE clips to match.

3. **live/pitch/paste.txt — drops the locked "Now what?" hook.**
   Drift: LIVE BRAND.md tone lists "now what" as on-brand, and the longer live/pipeline clip uses it ("You made the song. Then what?"). The pitch clip replaces it with a softer, almost wellness-adjacent line that doesn't read like LIVE.
   Exact quote: `Made the song. Now make the moment.`
   Suggested replacement: `Made the song. Now what? RHYTHMIX LIVE.` — keeps the locked hook and reads as a single declarative beat, consistent with the LIVE voice ("Track in. Beat-sync. Three videos out.").

4. **rhythmix-anthem-60s/narration.txt — off-brand "Where your music begins" reads contemplative, not kinetic.**
   Drift: "Meet RHYTHMIX. Where your music begins." softens the core RHYTHMIX voice toward DREAMS/HUM cadence. The locked tone is "short declarative sentences. Energy without exaggeration."
   Exact quote: `Meet RHYTHMIX. Where your music begins.`
   Suggested replacement: `Meet RHYTHMIX. The whole journey — generate to earn.` (echoes the launch clip's "Built for the whole journey." which is on-brand for RHYTHMIX-core.)

5. **rhythmix-anthem-60s/narration.txt — "Anyone whose music has been waiting" drifts toward poetic/sentimental.**
   Drift: The RHYTHMIX-core voice (per launch.txt and live BRAND.md) is "Built for bedroom producers. First-time artists. Solo creators." — three concrete nouns. The anthem swaps the third in for an abstract phrase that lands more like FREQUENCY DREAMS copy.
   Exact quote: `Built for bedroom artists. First-time songwriters. Anyone whose music has been waiting.`
   Suggested replacement: `Built for bedroom artists. First-time songwriters. Solo creators.` (matches the other three core clips verbatim.)

6. **rhythmix-teaser-60s/narration.txt — "Get it out there" drifts colloquial.**
   Drift: The four RHYTHMIX-core clips otherwise lock the four-pillar phrasing tightly: "Generate, idea to track. Master, pro-grade finish. Distribute, release everywhere. Earn, build a career." The teaser swaps "release everywhere" for "get it out there", which reads less precise and breaks the parallel structure.
   Exact quote: `Distribute, get it out there. Earn, build a career.`
   Suggested replacement: `Distribute, release everywhere. Earn, build a career.` (matches launch.txt and anthem.txt.)

7. **rhythmix-itslive-60s/narration.txt — "Suno makes the song. Udio makes the song." names competitors twice; LANDR named once.**
   Drift: Repetition reads like a hesitation rather than a build. The four-pillar voice prefers compressed parallel triples ("Free. Pro. Studio.").
   Exact quote: `Suno makes the song. Udio makes the song. LANDR finishes the song.`
   Suggested replacement: `Suno makes the song. Udio makes the song. LANDR finishes it. Then what?` — keeps the "Then what?" hook (which the live/pipeline clip uses) and tightens the third line.

8. **hum/howto/paste.txt — "Like a tuning fork for the chest" is on-brand but sits next to "It lives on your phone. Nothing to install." which mixes voices.**
   Drift: HUM BRAND.md emphasises lineage + body-first language. "Lives on your phone. Nothing to install." reads as a RHYTHMIX-core engineering claim. The on-device principle is on-brand, but the phrasing is the LIVE/RHYTHMIX phrasing, not HUM's "kept on this device".
   Exact quote: `It lives on your phone. Nothing to install.`
   Suggested replacement: `It lives on your phone. Kept on this device.` (uses the HUM/RESONATE canonical phrase "kept on this device".)

9. **dreams/pitch/paste.txt — "Nothing leaves the device" used, but DREAMS BRAND.md canonical phrase is "kept on this device".**
   Drift: Both phrases mean the same thing, but the family has a canonical form and the clips drift between two variants. RESONATE uses "Nothing leaves your phone." HUM uses "Nothing leaves the device." DREAMS uses "Nothing leaves the device." The locked phrase in the BRAND.md tone lists is "kept on this device" / "on-device".
   Exact quote (dreams/pitch): `Speak an intention. Nothing leaves the device.`
   Suggested replacement: `Speak an intention. Kept on this device.` — also unifies the family on the canonical form.

## Recommendations

1. **Lock the spoken domain form across all narrations (highest impact).** Pick one — recommended `rhythmix app dot com dot a u` — and find/replace across all 12 narration files. This is the single most audible inconsistency across the family and the cheapest to fix.

2. **Rewrite resonate/science line 7 to remove the medical-claim phrasing.** This is the only finding with regulatory/ASA risk; everything else is stylistic. Use "associated with" or "honour the research" per RESONATE BRAND.md.

3. **Standardise the on-device guarantee on "kept on this device" across DREAMS, HUM, and RESONATE.** Currently three variants. Update dreams/pitch, dreams/ritual, hum/howto, and the RESONATE clips to one canonical phrase. Cheap, raises perceived production polish.

4. **Restore the locked "Then what?" / "Now what?" hook to the LIVE pitch clip and the itslive brand clip.** The hook is in LIVE BRAND.md and in live/pipeline; missing from live/pitch and softened in itslive. Bringing it back unifies the LIVE voice across short and long cuts.

5. **Audit RHYTHMIX-core four-pillar phrasing for parallel structure.** Teaser uses "get it out there" where the rest say "release everywhere"; anthem swaps "solo creators" for "anyone whose music has been waiting". Lock one master four-pillar string and use verbatim across anthem, launch, teaser, and itslive.
