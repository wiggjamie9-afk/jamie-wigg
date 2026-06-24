# Neural Twin Design System 2026

Modern, accessible, delightful design for AI companion app.

## Design Philosophy

**"Invisible technology, visible humanity"**

- Smooth, fluid animations (Cubic Bezier easing)
- Gesture-first navigation (swipe, tap, long-press)
- Glassmorphism + depth layers
- Dark mode native (OLED-optimized)
- Accessibility first (AA compliance minimum)
- Micro-interactions that feel alive

---

## Color System

### Primary Palette
- **Brand Blue:** `#0A84FF` (iOS style, accessible)
- **Accent Gradient:** Blue → Purple → Pink (`#0A84FF` → `#AF0FFF` → `#FF10AF`)
- **Success Green:** `#34C759`
- **Warning Orange:** `#FF9500`
- **Error Red:** `#FF3B30`

### Semantic Colors
- **Background:** `#000000` (pure black for OLED)
- **Surface 1:** `#1A1A1A`
- **Surface 2:** `#2A2A2A`
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#A0A0A0`
- **Border:** `#333333` (glassmorphism borders)

### Gradients
```
Primary Gradient: linear-gradient(135deg, #0A84FF 0%, #AF0FFF 100%)
Coherence Gradient: linear-gradient(180deg, #34C759 0%, #00E5FF 100%)
Stress Gradient: linear-gradient(180deg, #FF9500 0%, #FF3B30 100%)
```

---

## Typography

### Font Stack
- **Primary:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Mono:** `'SF Mono', Monaco, 'Cascadia Code', monospace`

### Scale
```
H1: 32px, weight 700, line-height 1.2
H2: 24px, weight 600, line-height 1.3
H3: 20px, weight 600, line-height 1.4
Body: 16px, weight 400, line-height 1.5
Caption: 13px, weight 400, line-height 1.4
```

### Dyslexia-Friendly Options
- **Comic Sans** (optional toggle)
- **OpenDyslexia** (free, optimized for dyslexia)
- **Verdana** (high legibility)
- Increased letter-spacing (+0.5px option)
- Increased line-height (1.8 option)

---

## Component Library

### Cards
```
- Radius: 16px
- Border: 1px solid rgba(255,255,255,0.1) (glassmorphism)
- Backdrop: blur(20px), opacity(0.6)
- Shadow: 0 8px 32px rgba(0,0,0,0.3)
- Padding: 16px
```

### Buttons
```
Primary: Solid with gradient background
Secondary: Outlined (border + text, no fill)
Tertiary: Text-only with opacity states
Size: 48px min height (touch target)
Border radius: 12px
Haptic feedback on iOS, ripple on Android
```

### Input Fields
```
Height: 44px
Border radius: 12px
Border: 1px solid rgba(255,255,255,0.1)
Focus: Border color + glow (0 0 8px rgba(10,132,255,0.5))
Placeholder: rgba(255,255,255,0.4)
```

### Navigation
```
Tab bar height: 64px (iOS), 56px (Android)
Item size: 48x48px
Active state: color + scale up 1.1x
Animation: 300ms cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## Animations & Micro-interactions

### Easing Curves
```
Entrance: cubic-bezier(0.34, 1.56, 0.64, 1)  // Overshoot
Exit: cubic-bezier(0.25, 0.46, 0.45, 0.94)   // Anticipate
Smooth: cubic-bezier(0.25, 0.1, 0.25, 1.0)   // Standard
Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) // Bounce
```

### Durations
```
Quick: 150ms (tap feedback)
Standard: 300ms (screen transitions)
Slow: 500ms (complex animations)
```

### Interactions
- **Tap:** Scale 0.97x, haptic feedback
- **Swipe:** Drag with momentum, snap to next card
- **Long press:** Scale 0.95x, haptic triple tap
- **Hover:** Brightness +10%, scale 1.02x (desktop)

---

## Layout System

### Grid
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Container width: 100% (full-width cards)

### Safe Areas
```
iOS: Respect notch/Dynamic Island
Android: Respect status bar + nav bar
Minimum padding: 16px
```

### Carousel Pattern
```
Card width: 100% - 32px (16px padding each side)
Card height: Variable (content dependent)
Spacing between cards: 12px
Scroll momentum: Enabled
Snap-to-item: Enabled
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance
- ✅ Color contrast minimum 4.5:1 for text
- ✅ Touch targets minimum 44x44px
- ✅ Focus indicators visible (2px outline)
- ✅ Keyboard navigation (Tab, Arrow keys)
- ✅ Screen reader support (semantic HTML/accessibility labels)
- ✅ Motion: Respect `prefers-reduced-motion`
- ✅ Text scaling: Supports up to 200%

### Inclusive Design
- Dyslexia-friendly font options
- High contrast mode toggle
- Adjustable text size (100%, 125%, 150%, 175%)
- Color-blind friendly palette
- Audio descriptions for images

---

## Icon System

### Style
- Stroke-based (2px weight)
- 24x24px grid
- Rounded corners (2px radius)
- Consistent visual weight

### Usage
```
Small: 16px (secondary actions)
Medium: 24px (navigation, primary actions)
Large: 32px (hero elements)
```

### Icon Set
```
home.fill, heart.fill, waveform.circle.fill
person.2.fill, gear, checkmark.circle.fill
mic.fill, chat.bubble.fill, chart.bar.fill
```

---

## Dark Mode

**Default and only mode** (OLED-optimized)

- Pure black backgrounds (#000000)
- Reduced motion respect for battery
- Reduced brightness (80% of full) at night with system settings
- Blue light filter compatible

---

## 2026 UI Trends Implemented

✅ **Carousel navigation** — Swipe through Twins, coherence data, decisions
✅ **Glassmorphism** — Frosted glass effect with backdrop blur
✅ **Micro-interactions** — Haptic feedback, smooth animations
✅ **Gesture-first** — Swipe, long-press, tap with visual feedback
✅ **Depth layers** — Floating cards with shadows
✅ **Smooth transitions** — Spring animations, momentum scrolling
✅ **Voice-first UX** — Always listening, visual feedback for audio
✅ **Accessibility native** — Dyslexia-friendly, high contrast, motion options

---

## Implementation Notes

### iOS (SwiftUI)
```swift
// Colors
let brandBlue = Color(red: 0.04, green: 0.52, blue: 1.0)
let surfaceColor = Color(red: 0.1, green: 0.1, blue: 0.1)

// Glassmorphism
.background(
  Color.black.opacity(0.6)
    .blur(radius: 20)
)
.border(
  Color.white.opacity(0.1),
  width: 1
)

// Carousel
ScrollView(.horizontal, showsIndicators: false) {
  HStack(spacing: 12) {
    ForEach(twins) { twin in
      TwinCard(twin)
        .frame(width: UIScreen.main.bounds.width - 32)
    }
  }
  .scrollTargetLayout()
}
.scrollTargetBehavior(.viewAligned)
```

### Android (Compose)
```kotlin
// Colors
val BrandBlue = Color(0xFF0A84FF)
val SurfaceColor = Color(0xFF1A1A1A)

// Glassmorphism
Card(
  modifier = Modifier
    .blur(20.dp)
    .background(Color.Black.copy(alpha = 0.6f)),
  border = BorderStroke(1.dp, Color.White.copy(alpha = 0.1f))
)

// Carousel
LazyRow(
  horizontalArrangement = Arrangement.spacedBy(12.dp),
  state = rememberLazyListState()
) {
  items(twins) { twin ->
    TwinCard(twin, Modifier.fillParentMaxWidth())
  }
}
```

---

## Brand Voice

### Tone
- Calm, understanding, never patronizing
- Clear and direct
- Warm but professional
- Occasionally playful (not corporate)

### Copywriting Examples
```
❌ "Error: Voice processing failed"
✅ "Let's try that again"

❌ "Please wait while Twin loads"
✅ "Coach Twin is thinking..."

❌ "Upload a decision"
✅ "What decision are you making today?"
```

---

## Next Steps

1. Build carousel-based navigation for all 5 main tabs
2. Implement glassmorphism design in all cards
3. Add smooth animations and micro-interactions
4. Test accessibility features (high contrast, motion, fonts)
5. Ship Phase 1 with beautiful, modern UX

