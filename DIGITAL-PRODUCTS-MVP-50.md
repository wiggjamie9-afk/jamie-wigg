# 50 MVP Digital Product Concepts
## Organized by Shipping Timeline (Week 1-2, 2-4, 4-8)

Based on your portfolio: STARLIGHTMIX Studio, HerdCheck, Codex of Reality, Roomtone, Reset, RHYTHMIX. Expand within your proven verticals: **Music/Audio**, **Livestock/Farming**, **Sport/Recovery/Wellness**, **Productivity/Creator Tools**.

---

## ✅ Build Status — 41 apps SHIPPED

All built as self-contained single-file PWAs in `apps/` (no build step, `localStorage`/IndexedDB persistence, freemium upsells baked in) and made **installable + offline-capable** via a shared service worker (`apps/pwa-sw.js`, injected by `apps/make-installable.mjs`). Browse them all at **`apps/mvp-gallery.html`**.

Most are 100% client-side (truly offline). The **BYOK** apps call real APIs with the user's own key (the STARLIGHTMIX Studio model) and ship with a demo mode. The two **pose-AI** apps load an on-device model from CDN on first use.

| App file | Concept | Vertical | Backend |
|---|---|---|---|
| `beatmap.html` | Step-sequencer drum machine | Music | Client-only |
| `tuner.html` | Chromatic mic tuner (autocorrelation) | Music | Client-only |
| `stemmix.html` | Private multi-track stem mixer | Music | Client-only |
| `metro.html` | Lookahead-scheduler metronome | Music | Client-only |
| `tabplayer.html` | ASCII guitar-tab player (Web Audio) | Music | Client-only |
| `setlist.html` | Gig setlist builder | Music | Client-only |
| `lrcsync.html` | Synced-lyrics (.lrc) maker | Music | Client-only |
| `harmony.html` | Chord & vocal-harmony helper | Music | Client-only |
| `waveedit.html` | Audio trimmer/editor (WAV export) | Music | Client-only |
| `samplevault.html` | Sample library (IndexedDB) | Music | Client-only |
| `moodatlas.html` | Music mood tagger + atlas | Music | Client-only |
| `stemsplit.html` | AI stem separator | Music | **BYOK** (Replicate + proxy) |
| `mvtemplates.html` | Music-video brief generator | Music | Client-only |
| `calving.html` | Calving predictor + checklist | Livestock | Client-only |
| `herdlog.html` | Health diary w/ withdrawal alerts | Livestock | Client-only |
| `feedcost.html` | Feed cost calculator | Livestock | Client-only |
| `vaxtrack.html` | Vaccination scheduler | Livestock | Client-only |
| `herdgene.html` | Breeding planner + inbreeding calc | Livestock | Client-only |
| `graze.html` | Rotational grazing planner | Livestock | Client-only |
| `pasturescan.html` | Pasture quality from a photo | Livestock | Client-only (Canvas CV) |
| `aerialmap.html` | Aerial vegetation heatmap | Livestock | Client-only (Canvas CV) |
| `earlywarn.html` | Disease early-warning risk model | Livestock | Client-only |
| `breathe.html` | Guided breathwork timer | Wellness | Client-only |
| `achelog.html` | Pain & symptom journal | Wellness | Client-only |
| `stretch.html` | Stretching atlas + routine timer | Wellness | Client-only |
| `rehab.html` | Injury rehab tracker | Wellness | Client-only |
| `yoga.html` | Pose guide + camera coaching | Wellness | Pose-AI (CDN model) |
| `protocol.html` | Coach/physio protocol builder | Wellness | Client-only (B2B-ready) |
| `statline.html` | Personal sports stats tracker | Sport | Client-only |
| `hrzones.html` | HR training-zone analyzer | Sport | Client-only |
| `formcheck.html` | Running form analyzer | Sport | Pose-AI (CDN model) |
| `prompter.html` | Video script teleprompter | Creator | Client-only |
| `thumbforge.html` | Thumbnail concept generator | Creator | Client-only |
| `brandkit.html` | Brand asset generator | Creator | Client-only |
| `newsletter.html` | Email newsletter builder | Creator | Client-only |
| `podclip.html` | Podcast quote/clip card maker | Creator | Client-only |
| `transcribe.html` | AI transcription + show notes | Creator | **BYOK** (OpenAI) |
| `wordstreak.html` | Daily writing tracker | Productivity | Client-only |
| `askform.html` | Survey/poll builder | Productivity | Client-only (URL-share) |
| `contentcal.html` | Social content calendar | Productivity | Client-only |
| `timeblock.html` | Day time-blocking planner | Productivity | Client-only |

**To make the BYOK apps fully live:** `transcribe` needs the user's OpenAI key (pasted in-app, stored locally). `stemsplit` needs a Replicate token **and** the repo's `studio/workers/replicate-proxy` Worker deployed (Replicate blocks direct browser calls). Both run in a clearly-labelled demo mode until then.

Concepts already covered by pre-existing apps (skipped to avoid duplication): water tracker, weight tracker, habit streak, pomodoro/task timer, voice memo organizer, meditation guide, calorie/nutrition logger, sleep log (`dreams.html`).

---

## WEEK 1-2 MVPs (15 concepts)
*Bare minimum feature set. Static PWA + localStorage. Can launch this week.*

### MUSIC / AUDIO TOOLS (5)

1. **BEATMAP** — Drum pattern grid (iOS-style swipe interface). Users upload a BPM, tap grid, export as `.wav` drum loop. Revenue: freemium (export limit) + $9.99 lifetime. **Tech:** Tone.js, IndexedDB. **Time:** 3 days.

2. **FREQUENCY TUNER** — Pitch detector + frequency chart. Sing/record, app shows your pitch drifts in real-time. Wellness angle: vocal warm-ups, pitch training. Revenue: free + $4.99 ad-free lifetime. **Tech:** Web Audio API, Canvas. **Time:** 2 days.

3. **VOCAL MIXER** — Upload 2-3 vocal stems, drag faders to mix, export blended `.wav`. Use-case: singers wanting quick rough mixes. Revenue: $7.99 lifetime. **Tech:** Web Audio API, Recorder API. **Time:** 3 days.

4. **MUSIC MOOD ATLAS** — Tag any Spotify/YouTube song with mood (calm, hype, focus, workout). Crowdsourced mood library. Export as study/gym playlist. Revenue: freemium (10 tags/mo) + $3.99 lifetime. **Tech:** Spotify API, Vercel KV. **Time:** 4 days.

5. **METRONOME PRO** — Customizable click with visual flash + haptics. Presets for scales, jazz, world rhythms. Offline. Revenue: free + $2.99 one-time unlock all presets. **Tech:** Web Audio API, Vibration API. **Time:** 2 days.

### LIVESTOCK / FARMING (4)

6. **WATER TRACKER** — Log daily water/feed per animal (simple form: date, animal ID, amount). Charts usage trends. Farmers spot wastage or underfeeding. Revenue: free + $5.99 lifetime (multi-animal unlimited). **Tech:** SQLite via IndexedDB. **Time:** 3 days.

7. **BIRTH CALENDAR** — Input expected birth date for each dam. App alerts approaching due date with behavior checklist (restlessness, tail raising, udder filling). Revenue: $4.99 lifetime. **Tech:** localStorage, notifications. **Time:** 2 days.

8. **PASTURE MATCHER** — Farmers photo-identify grass type (visual heuristics + crowdsourced tags). Estimates nutrition content + suggested grazing schedule. Revenue: freemium (3 photos/mo) + $6.99 lifetime. **Tech:** Canvas image analysis, crowd labeling. **Time:** 4 days.

9. **DISEASE DIARY** — Log animal ID, symptom, date, treatment given, outcome. Searchable journal. Spot patterns (e.g., all animals with X symptom recover with Y). Revenue: free + $3.99 lifetime (export/share). **Tech:** IndexedDB, CSV export. **Time:** 2 days.

### WELLNESS / RECOVERY (3)

10. **BREATHWORK TIMER** — Simple guided breathing (box breathing, 4-7-8, wim hof). Visual guide + haptic pacing. Offline. Revenue: free + $3.99 lifetime unlock all patterns. **Tech:** Canvas, Vibration API. **Time:** 2 days.

11. **PAIN JOURNAL** — Log pain location, intensity (1-10), trigger (activity, time of day, food). Over weeks, see which triggers spike pain. PDF report for physio. Revenue: free + $4.99 lifetime (PDF export + trend analysis). **Tech:** IndexedDB, jsPDF. **Time:** 3 days.

12. **STRETCHING ATLAS** — Browse 50+ stretches by body part (neck, shoulder, hip, calf). Photos + hold time. Swipe through, tick completed. Track weekly routine. Revenue: free + $2.99 lifetime unlock "sports-specific" routines. **Tech:** Static HTML, localStorage. **Time:** 2 days.

### PRODUCTIVITY (3)

13. **VOICE MEMO ORGANIZER** — Record voice notes, app auto-transcribes (web speech API) + tags by keyword. Search transcripts. Revenue: freemium (20 memos) + $5.99 lifetime unlimited. **Tech:** Web Audio API, Web Speech API. **Time:** 3 days.

14. **TASK TIMER** — Pomodoro variant. Timer + notes field. Each session auto-logs to list. Weekly burn-down chart. Revenue: free + $2.99 ad-free. **Tech:** Canvas charts, localStorage. **Time:** 2 days.

15. **HABIT SNAPSHOT** — Tick 5-10 daily habits (drink water, walk, read, meditate, stretch). Animated streak counter. End-of-month visual summary. Revenue: free + $3.99 lifetime (custom habits, sharing). **Tech:** localStorage, Canvas. **Time:** 2 days.

---

## WEEK 2-4 MVPs (18 concepts)
*Small backend integration (API calls, cloud storage, light auth). 1-2 weeks dev.*

### MUSIC / AUDIO (5)

16. **SETLIST BUILDER** — Musicians plan gigs. Drag/drop songs, auto-fetch setlist duration, key, BPM from Spotify/iTunes. Export as PDF + print. Revenue: freemium (5 setlists) + $4.99 lifetime unlimited + B2B $20/mo (venues book bands via setlist). **Tech:** Spotify API, jsPDF, Vercel. **Time:** 8 days.

17. **AUDIO WAVEFORM EDITOR** — Upload `.wav`, trim/fade via dragging waveform. Export. Simple visual editing for podcasters / voice-over artists. Revenue: freemium (1 edit/day) + $7.99 lifetime unlimited. **Tech:** Wavesurfer.js, FFmpeg in browser. **Time:** 10 days.

18. **LYRICS SYNC** — Paste lyrics, tap spacebar to sync to timestamp. Auto-generates `.lrc` (lyric file format). Share with singers/karaoke apps. Revenue: free + $3.99 lifetime (import from Genius, export formats). **Tech:** Firebase, Genius API. **Time:** 6 days.

19. **HARMONY CHECKER** — Input chord progression, app suggests vocal harmonies + shows intervals. MIDI playback. Learning tool for arrangers. Revenue: freemium (5 progressions/mo) + $5.99 lifetime. **Tech:** Tone.js, Firebase. **Time:** 8 days.

20. **PODCAST CLIP GENERATOR** — Paste podcast transcript, auto-detect "quotable" sentences (length, tone analysis). Export as image + speaker byline. Social sharing. Revenue: freemium (1 clip/day) + $4.99 lifetime unlimited. **Tech:** OpenAI API (sentiment), Vercel. **Time:** 9 days.

### LIVESTOCK / FARMING (4)

21. **WEIGHT TRACKER** — Log animal weight + date. Trendline shows growth velocity. Flag slow growers. Estimate meat/dairy yield. Revenue: freemium (5 animals) + $6.99 lifetime (unlimited animals, yield predictions). **Tech:** Firebase, Chart.js. **Time:** 7 days.

22. **VACCINE SCHEDULER** — Input animal species + age, app lists due vaccines per your region (AU/US/EU). Calendar reminders. Track which animals vaccinated. Revenue: $5.99 lifetime + B2B $15/mo (vet clinics manage herd schedules). **Tech:** Firebase, Vercel + public vaccine database. **Time:** 10 days.

23. **FEED COST CALCULATOR** — Input feed type + price/bag + animals eating it + daily consumption. Dashboard shows monthly cost + cost-per-animal. Spot waste or overspending. Revenue: free + $3.99 lifetime (multi-farm, cost forecasting). **Tech:** Firebase, simple spreadsheet logic. **Time:** 5 days.

24. **BREEDING PLANNER** — Input dam/sire genetics, gestation days, target traits. App schedules breeding window. Notes offspring outcomes. Builds pedigree tree. Revenue: $7.99 lifetime + B2B $25/mo (breeding cooperatives). **Tech:** Firebase, vis.js (graph library). **Time:** 11 days.

### WELLNESS / RECOVERY / SPORT (4)

25. **INJURY REHAB TRACKER** — PT-designed rehab protocols (knee, shoulder, ankle, hip). Daily exercises with reps + notes. Weekly compliance chart. Send to physio. Revenue: freemium (1 protocol) + $4.99 lifetime all protocols + B2B $10/mo (physios manage client protocols). **Tech:** Firebase, Vercel. **Time:** 9 days.

26. **HEART RATE ZONES** — Users sync Garmin/Apple Watch data, app auto-segments runs/workouts by HR zone (Z1-Z5). Shows % time in each zone + suggestions for zone-specific training. Revenue: freemium (basic zones) + $5.99 lifetime (advanced analytics, training plans). **Tech:** OAuth2 (Garmin/Apple), Chart.js. **Time:** 10 days.

27. **SLEEP SLEEP QUALITY LOG** — Nightly log: sleep time, wake-ups, dream recall, mood on waking. See correlations (late caffeine = worse sleep?). Export for sleep doc. Revenue: free + $4.99 lifetime (ML-driven insights, PDF reports). **Tech:** Firebase, TensorFlow.js (correlation analysis). **Time:** 8 days.

28. **NUTRITION MACRO LOGGER** — Snap photo of meal, user tags (chicken, rice, broccoli, oil). App estimates macros + daily totals. Target-vs-actual chart. Revenue: freemium (5 meals/day limit) + $6.99 lifetime unlimited + B2B $15/mo (coaches track athlete macros). **Tech:** Firebase, Clarifai/manual DB for macro lookup. **Time:** 11 days.

### PRODUCTIVITY / CREATOR (5)

29. **IDEA INBOX** — Voice record thoughts. Auto-transcribe + tag (feature idea, bug, design, marketing). Searchable vault. Export as markdown. Revenue: freemium (50 ideas) + $3.99 lifetime unlimited. **Tech:** Web Speech API, Firebase. **Time:** 6 days.

30. **WRITING STREAK** — Log daily word count (paste draft, count words auto). Streak counter + weekly bar chart. Public leaderboard (opt-in). Revenue: free + $2.99 lifetime (custom goals, group challenges). **Tech:** Firebase. **Time:** 5 days.

31. **THUMBNAIL BRAINSTORM** — Paste video title/description, app generates 9 text-based thumbnail layouts (color combos, font sizes, emoji). Export as template. Revenue: freemium (1 brainstorm/day) + $3.99 lifetime unlimited. **Tech:** Canvas, Firebase. **Time:** 6 days.

32. **TIME BLOCK CALENDAR** — Plan week by time blocks (9-11am = deep work, 11-12 = calls, etc.). Drag/drop activities into blocks. See overlaps. Export as schedule. Revenue: free + $2.99 lifetime sync to Cal/Outlook. **Tech:** Firebase, calendar.js. **Time:** 7 days.

33. **CONTENT CALENDAR** — Plan social posts across platforms (Instagram, TikTok, LinkedIn, YouTube). Bulk-assign dates, bulk-generate captions from topic. Reminder alerts. Revenue: freemium (5 posts/mo) + $4.99 lifetime (unlimited) + B2B $20/mo (agency teams). **Tech:** Firebase. **Time:** 9 days.

---

## WEEK 4-8 MVPs (17 concepts)
*More complex features: video/image processing, multi-user collaboration, data visualizations, light ML. 3-6 weeks dev.*

### MUSIC / AUDIO (4)

34. **STEM SEPARATOR** — Upload full track, app uses ML model (e.g., Spleeter API) to separate into vocals/drums/bass/other. User edits each stem (mute, adjust levels), exports custom mix. Revenue: freemium (1 separation/month) + $9.99 lifetime (unlimited) + B2B $30/mo (producers). **Tech:** Spleeter API, Web Audio API, Firebase. **Time:** 4 weeks.

35. **MUSIC VIDEO TEMPLATE LIBRARY** — Browse 50+ HyperFrames templates. Upload song + image, app auto-renders promo video. Use STARLIGHTMIX rendering pipeline. Revenue: freemium (low res) + $14.99 lifetime (4K render) + $9.99/mo B2B tier (bands unlimited renders). **Tech:** RHYTHMIX pipeline, Cloudflare Workers, Firebase. **Time:** 5 weeks.

36. **SAMPLE VAULT** — Musicians upload royalty-free loop packs (drums, bass, synth). Browse by BPM/key/genre, drag into DAW-like interface, layer them, export stems. Community + revenue share. Revenue: free + $7.99 lifetime (unlimited downloads) + royalty split for pack creators (70/30). **Tech:** Firebase storage, Stripe. **Time:** 6 weeks.

37. **GUITAR TAB PLAYER** — Import `.txt` guitar tabs (ASCII), app plays via MIDI (synth guitar sound). Slow-down slider, loop sections, playback at any tempo. Learn tool. Revenue: free + $3.99 lifetime (additional instruments: bass, ukulele, piano). **Tech:** Tone.js, MIDI.js, Firebase. **Time:** 4 weeks.

### LIVESTOCK / FARMING (4)

38. **HERD GENETIC TRACKER** — Input animal pedigree (dam/sire/ancestor IDs), app builds genetic tree. Flag inbreeding risk, recommend breeding pairs to maximize genetic diversity. Exportable report. Revenue: $8.99 lifetime + B2B $40/mo (breed societies managing genetic databases). **Tech:** Firebase, vis.js, inbreeding coefficient calculator. **Time:** 5 weeks.

39. **AERIAL PASTURE MAPPER** — Users upload drone / satellite imagery of their land. App auto-detects grass coverage, bare spots, water sources. Heatmap overlay. Suggest rotational grazing zones. Revenue: freemium (static images) + $9.99 lifetime (multi-season time-lapses, AI recommendations) + B2B $25/mo (land management agencies). **Tech:** TensorFlow.js (segmentation), Mapbox, Firebase. **Time:** 6 weeks.

40. **DISEASE EARLY WARNING** — Farmers log symptoms daily (limping, discharge, appetite, temp). App trains ML on historical data + benchmarks, flags "high-risk" symptom combos early. Alert: "This combo predicts mastitis 5 days before it shows." Revenue: freemium (symptom log) + $7.99 lifetime (predictive alerts) + B2B $50/mo (vet networks). **Tech:** Firebase, TensorFlow.js, real-time anomaly detection. **Time:** 6 weeks.

41. **ROTATIONAL GRAZING PLANNER** — Input pasture size, animal count, forage growth rate. App auto-schedules rotation schedule (e.g., "Move herd to Paddock B on Tuesday"). Maps paddocks. Alerts. Revenue: $6.99 lifetime (unlimited pastures) + B2B $20/mo (extension agents advising farmers). **Tech:** Firebase, Mapbox, scheduling algorithm. **Time:** 5 weeks.

### WELLNESS / RECOVERY / SPORT (4)

42. **RUNNING FORM ANALYZER** — User films themselves running (side view). App uses pose detection (TensorFlow.js) to flag form issues (overstriding, heel strike, asymmetry). Slow-mo overlay. Coaching tips. Revenue: freemium (3 analyses/mo) + $7.99 lifetime unlimited + B2B $25/mo (coaches manage athlete form library). **Tech:** TensorFlow.js (pose detection), Video.js, Firebase. **Time:** 5 weeks.

43. **YOGA POSE GUIDE** — Browse 100+ yoga poses (photos + anatomy notes). AI detects your pose from phone camera; app gives real-time feedback ("lift hips higher", "relax shoulders"). Guided flows. Revenue: freemium (10 poses) + $5.99 lifetime all poses + guided flows. **Tech:** TensorFlow.js pose detection, Firebase. **Time:** 5 weeks.

44. **SPORTS STATS TRACKER** — Log game stats (basketball: points, rebounds, assists; soccer: goals, passes; tennis: winners, errors). Auto-calculate efficiency ratings. Trend charts. Share stats cards on social. Revenue: freemium (1 sport) + $4.99 lifetime (all sports, advanced stats) + B2B $15/mo (teams). **Tech:** Firebase, Chart.js. **Time:** 4 weeks.

45. **RECOVERY PROTOCOL BUILDER** — Physios design custom rehab protocols (exercises + reps + rest days). Assign to patients. Patients log compliance daily. Physio sees real-time adherence dashboard. Revenue: B2B SaaS $30/mo (physio clinics) + free for individual patients. **Tech:** Firebase, role-based access, Stripe. **Time:** 6 weeks.

### PRODUCTIVITY / CREATOR TOOLS (5)

46. **VIDEO SCRIPT TELEPROMPTER** — Paste script, app auto-breaks into lines. Font size + scroll speed customizable. Mirror mode (see yourself while reading). Offline. Export timing cues. Revenue: free + $3.99 lifetime (speaker notes, cue cards, export to PDF). **Tech:** Canvas, localStorage. **Time:** 3 weeks.

47. **PODCAST TRANSCRIPTION + SEO METADATA** — Upload `.mp3`, app auto-transcribes (Deepgram/OpenAI API), generates show notes + SEO description + chapter marks. Export ready-to-publish. Revenue: freemium (10 min/mo transcription) + $9.99 lifetime (unlimited) + B2B $40/mo (podcast networks). **Tech:** Deepgram API, Firebase. **Time:** 5 weeks.

48. **NEWSLETTER TEMPLATE BUILDER** — Drag/drop sections (header, story, CTA, footer). Preview as email + mobile. Export as HTML + Markdown. One-click publish to Substack/Mailchimp. Revenue: free + $4.99 lifetime (advanced templates, auto-scheduling) + B2B $20/mo (creator collectives). **Tech:** React components, Stripe, MJML. **Time:** 4 weeks.

49. **MARKET RESEARCH SURVEY BUILDER** — Create surveys (multiple choice, open-ended, rating). Distribute via shareable link. Collect responses, auto-generate report (word clouds, bar charts, sentiment). Export as PDF. Revenue: freemium (1 survey) + $6.99 lifetime (unlimited) + B2B $25/mo (agencies, UX researchers). **Tech:** Firebase, OpenAI API (sentiment), Chart.js. **Time:** 5 weeks.

50. **PERSONAL BRAND ASSET MANAGER** — Upload profile pics, logos, testimonials, social links. App auto-generates kit: Twitter card, LinkedIn banner, email signature, avatar crop presets. One-click download. B2B angles for creator networks. Revenue: free + $2.99 lifetime (unlimited revisions, batch exports) + B2B $15/mo (talent agencies managing rosters). **Tech:** Canvas image processing, Firebase. **Time:** 4 weeks.

---

## Quick Prioritization Guide

**Ship this week** (Week 1-2): Pick 2-3 from concepts 1-15. Lowest complexity, highest validation velocity. Aim for one music, one livestock, one wellness/productivity.

**Ship next 4 weeks** (Weeks 2-4): Concepts 16-33. Add backend + API integrations. Pick based on demand signals from week 1-2 wins.

**Ship in parallel with initial users** (Weeks 4-8): Concepts 34-50. These unlock B2B monetization + higher LTV. Run small teams in parallel.

**Monetization templates across all 50:**
- **Freemium tier-lock:** e.g., free (3 projects), paid (unlimited)
- **Lifetime purchase:** $2.99–$9.99 one-time, no subscription
- **B2B SaaS:** $10–$50/mo per team/org (coaches, vets, physios, agencies, venues)
- **Ad-supported:** free tier has banner ads, premium removes them + adds features
- **Revenue share:** creators/artists upload content, platform takes 15–30%

**Revenue stacking:** Each app can use 2-3 models (e.g., SETLIST BUILDER: freemium users + $4.99 lifetime + B2B venue booking).

---

## Next Steps

1. **Pick week 1-2 candidates** — which 3-5 feel closest to your existing strengths + user base?
2. **Validate one** — mockup, tweet it, get early user feedback before shipping.
3. **Chain them** — second month's apps build on first month's learnings (same tech stack, growing audience).
4. **B2B first** — concepts with B2B angles (vaccine scheduler, protocol builder, survey tool, setlist builder) tend to have higher unit economics than consumer-only.

Want me to sketch detailed specs for your top 3 picks from this list?
