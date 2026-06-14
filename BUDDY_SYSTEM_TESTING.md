# Buddy System - 24-Hour Testing Plan

## Live URL (Once Complete)
```
http://192.168.86.122:8000/apps/buddy-system.html
```

## Test Checklist

### Phase 1: Navigation & UI (5 min)
- [ ] Hub screen loads with 28 buddy cards in 2x grid
- [ ] Each buddy card shows emoji, name, description, unique color
- [ ] Swipe left/right between buddies (side-to-side carousel)
- [ ] Pagination dots reflect current buddy
- [ ] Back button returns to hub

### Phase 2: Buddy Detail Screens (10 min)
**For each buddy (test 3: My Buddy, Anxiety Relief, ADHD Buddy):**
- [ ] Home tab: Affirmation displays + "How are you feeling" prompt
- [ ] Health tab: Heart rate, breathing, mood, sleep fields + log button
- [ ] Photos tab: Photo grid + add button
- [ ] Chat tab: Chat input + "Talk to me" message
- [ ] Notes tab: Journal textarea + save button
- [ ] Settings tab: Buddy name, voice speed, emergency buttons

### Phase 3: API Integrations (10 min)
- [ ] Settings: Enter Claude API key (sk-ant-...)
- [ ] Chat: Send message → Claude responds with streaming text
- [ ] Health: Log mood score → saved to localStorage
- [ ] Affirmations: Daily affirmation displays (generated or static)
- [ ] Settings: Enter ElevenLabs API key
- [ ] Voice: "Read to me" button → text-to-speech plays (if ElevenLabs key available)

### Phase 4: Emergency Features (5 min)
- [ ] Settings: Add emergency contact (name, phone)
- [ ] Emergency buttons: Police, Ambulance, Crisis Line, Contacts
- [ ] Crisis keyword detection: Say "I want to hurt myself" → alert appears
- [ ] Emergency contact button → pre-filled message template

### Phase 5: Data Persistence (5 min)
- [ ] Close app + reopen → health data persists
- [ ] Photos saved → appear on reload
- [ ] Notes saved → appear on reload
- [ ] Buddy name changes → persisted

### Phase 6: Design & Polish (10 min)
- [ ] Glassmorphic cards look modern (2026 aesthetic)
- [ ] Smooth animations (0.3s transitions)
- [ ] Colors per buddy are bold and distinct
- [ ] Button hover/active states work
- [ ] No robotic feel, feels premium
- [ ] Safe area support (notch on iPhone)

### Phase 7: Performance (5 min)
- [ ] App loads quickly (< 2 seconds)
- [ ] No lag on swipes
- [ ] No lag on button clicks
- [ ] Smooth scrolling

## Test Results Log

| Buddy | Navigation | Chat | Health | Photos | Emergency | Notes |
|---|---|---|---|---|---|---|
| My Buddy | ✅ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Anxiety Relief | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| ADHD Buddy | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |

## Issues Found
(Will log during testing)

## Notes
- Test on iPhone Safari at 192.168.86.122:8000
- Test swipe gestures (side-to-side, not up/down)
- Test voice features if ElevenLabs key available
- Test Claude API responses (streaming)
- Check localStorage persists data
