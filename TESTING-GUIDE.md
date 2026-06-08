# MVP App Testing Guide — What to Look For

Each app has been enhanced with the same MVP quality features. Here's exactly what to test in each one.

---

## **Testing Checklist (All Apps)**

### 1. **Toast Notifications** ✓
Look for a notification banner at the bottom of the screen that:
- Appears when you save data (green with checkmark)
- Appears on errors (red with error icon)
- Auto-dismisses after 2-3 seconds
- Has smooth slide-up animation

**Where to trigger:**
- Save intention / Save dream / Save session
- Try empty form submission → error toast

### 2. **Confirmation Dialogs** ✓
Look for a modal popup (not browser alert) with:
- Clear title & description
- Two buttons: Cancel (gray) and Confirm (dark)
- Semi-transparent backdrop behind it
- Smooth scale-in animation

**Where to trigger:**
- Click "Reset All Data" button
- Click any "Delete" button (if present)
- Try destructive actions (clear history, etc.)

### 3. **Form Validation** ✓
Look for error messages appearing:
- Below form inputs when invalid
- Red border around the input field
- Specific error text (e.g., "Please enter a value")
- No toast until you fix it

**Where to trigger:**
- Try to save empty intention/dream/session
- Leave required fields blank and click save
- Enter invalid data (e.g., negative numbers)

### 4. **Error Handling** ✓
Look for user-friendly error messages instead of crashes:
- Toast says "Error: [specific issue]"
- App continues working
- Suggests recovery action if needed

**Where to trigger:**
- Browser Dev Tools → Network → Offline mode → try an action
- Try features that require permissions

### 5. **Offline Detection** ✓
Look for a banner at the top saying:
- "You are offline — data saved locally"
- "📡 Back online" when reconnected
- Toggle airplane mode to test

**Where to trigger:**
- Turn on airplane mode
- Watch top of screen
- Turn off airplane mode → see "Back online" message

### 6. **Keyboard Navigation** ✓
Test without tapping:
- Use Tab key to navigate between buttons
- Press Space or Enter to activate buttons
- Arrow keys to move between chips/options
- Escape key to close modals

**Where to trigger:**
- Press Tab on any app
- Watch focus ring appear around buttons
- Try arrow keys on mood/frequency selectors

### 7. **Loading States** ✓
Look for spinners or "Loading..." text when:
- Initializing audio
- Saving data
- Processing files
- Button is disabled during operation

**Where to trigger:**
- Click "Start" on audio apps
- Upload a file
- Click "Save" and watch for brief spinner

---

## **App-by-App Testing**

### **Dreams** (`/apps/dreams.html`)
**What it does:** Bedtime ritual with guided breathing, sleep journal

**Test these:**
1. Try saving empty intention → see error message below input
2. Click "Reset All" → see confirmation modal (not browser alert)
3. Toggle audio button → see toast "Audio on" or "Audio off"
4. Toggle "Voice Guided" setting → see toast + setting persists on reload
5. Turn on airplane mode → see offline banner at top
6. Open DevTools (F12) → go to Accessibility tree → verify buttons have aria-labels

**Expected look:**
- Clean dark UI with purple tones
- Buttons have visible focus rings
- Toasts appear at bottom center
- Modal has semi-transparent backdrop

---

### **Live** (`/apps/live.html`)
**What it does:** AI music video generator with real-time queue

**Test these:**
1. Try uploading empty file → see validation error toast
2. Try clicking "Render" without selecting engine → see error message
3. Select engine + mood → click render → see loading spinner overlay
4. Submit file → watch "Preparing..." toast appear
5. Try uploading wrong file type (PDF) → see specific error message
6. Turn offline → try render → see "You are offline..." warning

**Expected look:**
- Modern gradient UI
- Chips (engines/moods) have visual selection state
- Loading overlay has centered spinner + text
- File upload has drag-drop zone with hover state
- Toasts at bottom right

---

### **Resonate** (`/apps/resonate.html`)
**What it does:** Heart coherence trainer with breathing pacer

**Test these:**
1. Try starting session without selecting mode → see error
2. Start session → watch orb animate with breathing pacer
3. Click "Reset All" → see confirmation modal with warning text
4. Switch modes mid-session → see confirmation "Are you sure?"
5. Turn offline → see offline banner
6. Listen for audio → should play tone when session starts

**Expected look:**
- Large animated orb in center
- Mode cards highlight when selected (visual feedback)
- Live stats update in real-time (HR, BR, Coherence)
- Confirmation modal styled (not browser confirm)

---

### **Hum** (`/apps/hum.html`)
**What it does:** Coherence breathing practice with history heatmap

**Test these:**
1. Try ending session < 3 seconds in → see error "Session too short"
2. Save session → see toast "✓ Session saved"
3. Click "I hummed" button repeatedly → debouncing prevents rapid-fire clicks
4. Click "Reset All" → confirmation modal appears
5. Scroll history → see 14-day heatmap with color intensity
6. Turn on airplane mode → offline banner appears
7. Try localStorage full scenario → see error toast about storage

**Expected look:**
- Circular frequency/length chip selectors (tappable)
- Session countdown timer (MM:SS)
- Heatmap shows grid of days with color intensity
- Status text updates with aria-live announcements
- Toasts appear bottom center

---

### **Recovery** (`/recovery/`)
**What it does:** Sport recovery tracking with check-in, jump test, coaching

**Test these:**
1. Try submitting onboarding without filling weight → see error below input field
2. Submit with valid data → success toast "✓ Profile created"
3. Try check-in with slider at 0 → validation prevents empty submission
4. Hover over form inputs → see focus ring appear
5. Click form sliders → try keyboard arrow keys to adjust
6. Click "Reset App" → see confirmation modal (not browser confirm)
7. Try "Clear Chat" → confirmation dialog appears

**Expected look:**
- Mobile-optimized UI (fits narrow phone screen)
- Form inputs with visible labels + focus rings
- Range sliders show current value as you drag
- Modal dialogs centered on screen
- Error messages in red text below inputs

---

### **Drift** (`/apps/drift/index.html`)
**What it does:** Sleep coach with wake/sleep logging

**Test these:**
1. Try saving empty log → validation error appears
2. Enter wake/sleep times → toast "✓ Sleep logged"
3. Try deleting a log → confirmation modal before deletion
4. Check streak counter → increments after consistent logs
5. Look for offline mode → offline banner when airplane mode on

**Expected look:**
- Calendar view of sleep logs
- Each day shows color intensity (consistency indicator)
- Current day highlighted
- Streak counter displayed prominently

---

### **Focus** (`/apps/focus/index.html`)
**What it does:** Pomodoro timer for deep work

**Test these:**
1. Start timer → button changes to "PAUSE" and countdown begins
2. Click "Reset" → confirmation modal appears before clearing
3. Adjust duration sliders → see min/max constraints (5-60 min)
4. Free tier: start 3 sessions → 4th blocked with warning
5. Toggle sound → toast "Notifications on/off"
6. Volume slider → move with arrow keys (keyboard accessible)

**Expected look:**
- Large timer display (MM:SS)
- Session counter dots at bottom
- Mode selector (Focus/Short Break/Long Break)
- Button state changes (START → PAUSE → RESUME)

---

### **Glow** (`/apps/glow/index.html`)
**What it does:** Skincare tracker with products + routines

**Test these:**
1. Try adding product without name → validation error
2. Add product → toast "✓ Product added"
3. Try deleting product → confirmation warns "This removes from all routines"
4. Delete journal entry → confirmation modal
5. Scan ingredients feature → shows analysis with toast

**Expected look:**
- Product cards with mood emoji indicators (color: green/yellow/red)
- Routine builder interface
- Journal entries list with edit/delete actions
- Ingredient scanner with analysis results

---

### **Hype** (`/apps/hype/index.html`)
**What it does:** Daily affirmations with custom goals

**Test these:**
1. Onboarding: try advancing without selecting mood → button disabled
2. Add custom goal → input auto-trims whitespace
3. Save custom goal → toast "✓ Added"
4. Click "Reset Profile" → browser confirm replaced with modal
5. Toggle favorite affirmation (heart button) → toast "✓ Saved"
6. Settings: toggle notification → toast "Notifications on"

**Expected look:**
- Hero card with large affirmation text
- Mood chips (emoji buttons) selectable
- Custom goals editable with max-length constraint
- Heart button fills when favorited
- Settings panel with toggle switches

---

### **TYMPAN** (`/apps/untapped/tympan.html`)
**What it does:** Hearing aid EQ with audio scene detection

**Test these:**
1. Tap microphone button → ask permission, or see demo mode start
2. Try audio on iOS with mute switch on → see error recovery option
3. Adjust EQ sliders → see frequency bands adjust (visual feedback)
4. Try reset settings → confirmation modal
5. Offline mode: still shows presets, but can't save to cloud
6. Volume controls with keyboard arrows

**Expected look:**
- Waveform visualization showing incoming audio
- 8-band EQ sliders (frequency controls)
- Scene detection buttons (Quiet/Restaurant/Car/Music/etc.)
- Real-time spectrum analyzer

---

### **SPOT** (`/apps/untapped/spot.html`)
**What it does:** Pet teledermatology with vet chat

**Test these:**
1. Try uploading non-image file → validation error (JPEG/PNG/WebP only)
2. Upload photo → shows analysis result with severity
3. Click "Connect to Vet ($19)" → confirmation modal with price
4. Try reset → confirmation before clearing current analysis
5. Offline: analysis loads from localStorage

**Expected look:**
- Photo upload area with drag-drop
- Analysis shows condition name + severity score
- Vet session modal with call info
- Chat interface with vet messages

---

### **LULL** (`/apps/untapped/lull.html`)
**What it does:** Sleep crying coach with mood detection

**Test these:**
1. Select language (try dropdown) → setting persists
2. Record audio → waveform animates in real-time
3. Analysis completes → shows mood result with toast
4. Try on phone without mic permission → graceful demo mode
5. Reset data → confirmation modal

**Expected look:**
- Waveform visualization (animated during recording)
- Language dropdown selector
- Mood result card (animated scale-up)
- Microphone button with pulse animation

---

### **PLUMB** (`/apps/untapped/plumb.html`)
**What it does:** Contractor AR punchlist

**Test these:**
1. Scan room → shows defect markers on SVG room layout
2. Mark defect severity → toggle chips (critical/major/minor)
3. Generate report → shows modal with PDF-like layout
4. Reset punchlist → confirmation modal before clear
5. Dark mode toggle → UI adapts

**Expected look:**
- Room layout with overlaid defect markers
- Marker counts by severity (color-coded dots)
- Report modal with professional styling
- Status badge shows "Scan complete" when ready

---

### **RACK** (`/apps/untapped/rack.html`)
**What it does:** Thrift cross-poster for multi-platform

**Test these:**
1. Drag/drop images → preview appears with progress bar
2. Try uploading non-image → validation error
3. Scan complete → item cards show with platform icons
4. Click "List all items" → confirmation modal
5. Offline: pile state saved to localStorage

**Expected look:**
- Drag-drop zone with hover state
- Scanning progress bar + stage labels
- Item cards with platform checkboxes (Depop/Vinted/etc.)
- Modal for review before listing

---

### **SOLE** (`/apps/untapped/sole.html`)
**What it does:** Daily foot health screening for RPM

**Test these:**
1. Capture left foot → shows analysis with score
2. Try uploading non-image → validation error (JPEG/PNG)
3. Share with provider → confirmation "Share medical data?"
4. Click "Share with Dr. Patel" → toast "✓ Sent to provider"
5. View history → past screenings in list with dates
6. Offline: history loads from localStorage

**Expected look:**
- Camera capture interface with shutter button
- Analysis shows foot health score + heat map
- Share button with provider info
- History timeline of past screenings

---

## **Quick Quality Checks**

| Feature | How to Test | What to Look For |
|---------|------------|------------------|
| **Toast** | Save/delete any data | Bottom notification, auto-dismisses |
| **Confirmation** | Click delete/reset button | Modal popup, not browser alert |
| **Error** | Submit empty form | Error message below input + toast |
| **Offline** | Turn on airplane mode | Banner at top, data still saves |
| **Keyboard** | Press Tab key repeatedly | Focus ring moves through buttons |
| **Loading** | Start audio/upload file | Spinner overlay appears briefly |
| **Mobile** | Resize browser to 375px wide | UI adapts, no horizontal scroll |
| **Accessibility** | DevTools → Accessibility | All buttons have aria-labels |

---

## **Launch Checklist**

Before you announce tomorrow:

- [ ] Test 5 apps fully (save, delete, error cases)
- [ ] Confirm toasts appear on all state changes
- [ ] Verify confirmation modals (not browser alerts)
- [ ] Test offline mode (airplane mode on/off)
- [ ] Check mobile responsiveness (portrait orientation)
- [ ] Verify keyboard navigation works (Tab through UI)
- [ ] Spot check error messages are helpful
- [ ] Take notes on any issues found

**If you find bugs:** Report back and I'll push fixes before final merge to main.

---

## **Ready to Test?**

1. Merge the branch to main (GitHub Pages auto-deploys)
2. Open on your phone: `https://rhythmixapp.com.au/apps/test-suite.html`
3. Click through each app
4. Test the features above
5. Report back what you see

You're all set. 🚀
