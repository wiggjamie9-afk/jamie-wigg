# Recovery iOS — Design Specification

## Design Philosophy

Recovery iOS is a **native iOS app** with clean, purposeful design. Every screen guides athletes through their day: check-in reminder, progress visualization, and immediate alerts from coaches. Inspired by Apple Health's simplicity and Strava's community feedback loop.

---

## Visual System

### Color Palette

| Role | Color | Usage |
|------|-------|-------|
| Primary | `#00D8FF` (cyan) | CTAs, progress, positive indicators |
| Secondary | `#A100F2` (purple) | Accents, coaching notes |
| Background | `#0F0F0F` (near-black) | Page background |
| Surface | `#1A1A1A` | Cards, panels |
| Text | `#E8E8E8` | Body text |
| Text muted | `#8A8A8A` | Secondary text |
| Success | `#00D962` (green) | Pain improved, full adherence |
| Warning | `#FFB800` (yellow) | Pain stable, partial adherence |
| Alert | `#FF4A4A` (red) | Pain spike, re-injury risk |

### Typography

| Level | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| Display | System (default SF Pro) | 32-40px | Bold | Hero headlines |
| Title 1 | System | 28px | Bold | Page titles |
| Title 2 | System | 22px | Semi-bold | Section headers |
| Body | System | 17px | Regular | Main text |
| Body small | System | 15px | Regular | Secondary text |
| Mono | Menlo | 14px | Regular | Data, timestamps |

**Note:** Use iOS system fonts (SF Pro, SF Mono) for native feel. No custom fonts on iOS unless absolutely necessary.

### Spacing System

```
xs: 4pt
sm: 8pt
md: 16pt
lg: 24pt
xl: 32pt
2xl: 48pt
```

---

## Screens & User Flows

### 1. Onboarding Flow

**URL:** App launch (if no injury recorded)

**Screens:**
1. Welcome (hero + "Get Started" button)
2. Athlete Profile (name, DOB, sport, position)
3. Injury Intake (ICD-10 picker, onset date, severity, location)
4. Notification Setup (request iOS push + SMS)
5. Confirmation (summary + "Start Recovery")

**Design notes:**
- Single-column layout (full screen)
- Large buttons (56pt minimum height)
- Progress indicator at top (Step 1/5)
- Back button on each step
- Haptic feedback on completion

**Components:**
- Text input, date picker, segmented control
- ICD-10 picker (searchable list of codes)
- Severity scale (1-5 slider with emoji: 😊 → 😢)
- Toggle (push notifications, SMS)

---

### 2. Home / Daily Check-in Screen

**URL:** `/check-in`

**Layout:**
- Header: "Day 14 of 21" with progress bar
- CTA card: "Check in now" (blue, large)
- Last check-in summary (pain 4/10, ROM 75%, 6/6 exercises)
- Upcoming: exercise list for today (checkboxes)
- Bottom sheet: alerts if any (pain spike, coach message)

**Design notes:**
- When check-in is pending (based on time), CTA pulses
- Last check-in card shows trend (↑ pain, ↓ ROM)
- Swipe up to see exercise details (video demos, instructions)

**Components:**
- Progress bar (circular, animated)
- Card with shadow
- Checkbox list
- Bottom sheet (dismissible)

---

### 3. Daily Check-in Form

**URL:** `/check-in/form`

**Sections:**
1. Pain scale (0-10 slider, numbered labels at each point)
2. Range of motion (0-100% slider)
3. Exercise checklist (checkboxes for today's exercises)
4. Notes (optional text field)
5. Photo upload (optional, for visible swelling)
6. Submit button

**Design notes:**
- Full-screen modal
- Each section on own "page" (swipe or scroll)
- Pain scale: emoji progression (0 = 😊, 10 = 😭)
- ROM: shows previous day's % for comparison
- Exercises: expandable (tap to see details)
- Submit button disabled until pain + ROM filled

**Validation:**
- Pain and ROM required before submit
- Warn if pain spike detected
- Offline: show "Pending sync" badge until connected

**Components:**
- Slider (custom styled)
- Checkbox group
- Text input (multiline for notes)
- Image picker
- Submit button (primary blue)

---

### 4. Protocol & Exercises Screen

**URL:** `/protocol`

**Sections:**
1. Protocol header (name, days remaining, estimated completion)
2. Exercise list (collapsible sections per day)
3. Each exercise: name, sets, reps, demo photo/video, notes from provider
4. Compliance summary (bottom): % exercises completed this week

**Design notes:**
- Collapsible sections (today's in expanded state)
- Tap exercise to see full details + demo video/photo (if available)
- "Completed" badge on exercises done today
- Swipe left to check off (quick action)

**Components:**
- Collapsible sections (Accordion pattern)
- Exercise card (name, sets/reps, progress)
- Image/video viewer

---

### 5. Injury Detail & History

**URL:** `/injuries/:id`

**Sections:**
1. Injury summary (diagnosis, onset date, severity, location)
2. Protocol status (active, completed, closed)
3. Charts: Pain over time (line), ROM over time (line)
4. Check-in history (scrollable list of recent check-ins)
5. Actions (view protocol, export PDF, close injury)

**Design notes:**
- Charts update in real-time as check-ins are logged
- Swipe left on check-in to view details
- Tap "Export PDF" → generates and shares report

**Components:**
- Line charts (Charts library)
- Check-in history list
- Action buttons

---

### 6. Alerts & Notifications

**URL:** `/alerts`

**Sections:**
1. Incoming alerts (most recent first, sorted by severity)
2. Alert detail (tap to expand): alert type, trigger metric, timestamp
3. Coach response (if available)
4. Actions: acknowledge, schedule follow-up

**Design notes:**
- Alert card shows icon + summary (e.g., "⚠️ Pain spike — 8/10")
- Dismiss by swiping or tapping X
- Red card if critical (re-injury risk), yellow if warning

**Components:**
- Alert card (color-coded by severity)
- Detail view (modal)
- Action buttons (acknowledge, dismiss)

---

### 7. Settings & Preferences

**URL:** `/settings`

**Sections:**
1. Profile (name, sport, team, bio)
2. Notifications (quiet hours, check-in reminder time, alert frequency)
3. Privacy (profile visibility, share data with coach)
4. Biometric unlock (Face ID / Touch ID toggle)
5. About (app version, privacy policy, terms)
6. Sign out

**Design notes:**
- Toggles for notifications
- Time picker for reminder (default 8 AM)
- Biometric security: "Unlock with Face ID"

---

## Responsive Design (iPad)

For athletes who have iPads:

- Split-view layout on iPad (sidebar + content)
- Charts larger
- Landscape orientation supported

---

## Native iOS Patterns

### Navigation

- **Tab bar** (bottom): Home, Protocol, Injuries, Alerts, Settings
- **Push navigation** (within screens): detail views push from right
- **Swipe back** to pop (standard iOS behavior)

### Interactions

- **Haptic feedback**:
  - Check-in submitted: system.success (light impact)
  - Alert received: system.warning (medium impact)
  - Error (invalid input): system.error
- **Pull-to-refresh** on check-in history
- **Swipe actions** (left: complete, right: edit)

### App Icons & Tab Bar

| Tab | Icon | Color | Purpose |
|-----|------|-------|---------|
| Home | house.fill | cyan | Daily check-in & overview |
| Protocol | dumbbell.fill | blue | Exercise protocol & workouts |
| Injuries | bandage.fill | purple | Injury history & detail |
| Alerts | bell.fill | red | Notifications & coach messages |
| Settings | gear | gray | Profile, preferences, about |

---

## Offline Experience

When offline:
- Home screen still shows last check-in data
- Check-in form loads with cached protocol
- Submit button shows spinner with "Saving locally…"
- Once synced, shows "Synced ✓"
- Sync status badge (top-right): gray (pending) → green (synced)

---

## Notifications (Lock Screen & Banner)

### Check-in Reminder
```
"Time to check in"
Subtitle: "How's your pain level today?"
Action: "Tap to check in"
```

### Pain Spike Alert
```
"⚠️ Pain spike detected"
Subtitle: "8/10 today — reach out to coach?"
Action: "View details"
```

### Coach Message
```
"Coach reviewed your progress"
Subtitle: "Protocol adjusted — protocol details"
Action: "View"
```

---

## Accessibility (WCAG 2.1 AA)

- Voice-over support: all images have alt text, interactive elements labeled
- Color contrast: 4.5:1 minimum
- Minimum touch target: 44×44pt (Apple HIG)
- Dynamic type support (text size adjustable in Settings > Display)
- Reduce motion: animations optional if user has "Reduce Motion" enabled

---

## Dark Mode Only

Recovery iOS uses dark mode exclusively. Light mode deferred to Wave 3.

---

## Component Library

- Text input
- Slider (pain, ROM)
- Checkbox
- Toggle
- Button (primary, secondary, danger)
- Card
- Alert (success, warning, error)
- Spinner (loading)
- Badge (status, number)
- Progress bar (circular)
- Chart (line graph)
- List item (with swipe actions)
- Bottom sheet (modal-like)

Built with **React Native** (via Capacitor) + **Tailwind RN** (or styled-components).

---

## Success Criteria

- [ ] App launches in <2s on iPhone 12+
- [ ] All screens accessible with Voice-over
- [ ] Text resizable via Dynamic Type
- [ ] Touch targets all ≥44×44pt
- [ ] Offline check-in saves and syncs correctly
- [ ] Haptic feedback works on all interactions
- [ ] Lighthouse accessibility audit ≥95
