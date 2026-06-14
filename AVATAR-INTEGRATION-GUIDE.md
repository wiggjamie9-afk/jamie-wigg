# Higgsfield AI Tutor Avatar Integration Guide

## Overview

Three apps have been enhanced with Higgsfield AI tutor avatars to provide personalized, engaging guidance:

1. **StoryStudio** - Creative video producer tutor (Pink #ec4899 + Rose #f43f5e)
2. **VoiceJournal** - Wellness coach tutor (Lavender #c084fc + Violet #a78bfa)
3. **SmartGrocery** - Shopping assistant tutor (Green #10b981 + Emerald #059669)

## Current Implementation

All three apps now include:
- Home screen avatar card with welcoming introduction ("Meet your creative partner/wellness coach/shopping assistant")
- Inline avatars on key workflow screens (script/record/scan, edit/mood/compare)
- Responsive sizing: 64px on home screen, 48px on inline screens
- Smooth animations unique to each tutor personality
- Placeholder SVG avatars ready for replacement

## Avatar Locations in Code

### StoryStudio (`apps/storystudio.html`)
- **Home screen**: Lines 152-158 (id="tutorAvatar", 64px)
- **Script screen**: Lines 178-185 (inline, 48px)
- **Edit screen**: Lines 202-209 (inline, 48px)
- **Avatar initialization**: Lines 492-500 (JavaScript)

### VoiceJournal (`apps/voicejournal.html`)
- **Home screen**: Lines 185-191 (id="wellnessAvatar", 64px)
- **Record screen**: Lines 218-225 (inline, 48px)
- **Mood screen**: Lines 239-246 (inline, 48px)
- **Avatar initialization**: Lines 535-543 (JavaScript)

### SmartGrocery (`apps/smartgrocery.html`)
- **Home screen**: Lines 812-818 (id="shopperAvatar", 64px)
- **Scan screen**: Lines 861-868 (inline, 48px)
- **Compare screen**: Lines 887-894 (inline, 48px)
- **Avatar initialization**: Lines 1205-1213 (JavaScript)

## Replacing with Higgsfield Images

### Step 1: Generate Avatars via Higgsfield MCP

```bash
# Use Higgsfield Soul text-to-image to generate:

# StoryStudio Avatar
"A professional creative video producer, energetic and inspiring expression, 
trendy fashion sense, warm welcoming smile, professional yet approachable, 
portrait style, soft pink and rose lighting, professional photography, 
confident and passionate energy"

# VoiceJournal Avatar
"A warm, compassionate wellness counselor with empathetic expression, 
nurturing presence, peaceful demeanor, gentle smile, professional wellness guide,
portrait style, soft lavender and violet lighting, calming and trustworthy,
kind and understanding energy"

# SmartGrocery Avatar
"A friendly, practical shopping assistant with bright genuine smile, 
approachable and helpful demeanor, professional retail expert, 
portrait style, soft green and emerald lighting, cheerful and energetic,
trustworthy and knowledgeable energy"
```

### Step 2: Convert Images to Base64 (if needed)

If Higgsfield returns URLs, you can keep them as-is. If you need to embed as base64:

```bash
# Convert PNG/JPG to base64
base64 -i avatar-storystudio.png | tr -d '\n' > avatar-storystudio.b64
# Then use as: data:image/png;base64,<content>
```

### Step 3: Update Avatar Sources

For each avatar, update the `src` attribute in:

1. **Home screen avatar card** (main 64px display):
   ```html
   <img id="tutorAvatar" src="<NEW_IMAGE_URL_OR_BASE64>" style="...">
   ```

2. **Inline screen avatars** (48px tips):
   Replace the inline src values in all three apps' workflow screens.

3. **JavaScript initialization** (optional enhancement):
   The initialization code at the end of each file can also set the src dynamically:
   ```javascript
   tutorAvatarEl.src = '<NEW_IMAGE_URL>';
   ```

## Animation Styles

Each avatar has unique animations matching their personality:

- **StoryStudio**: `subtle-float` (3s) - gentle floating motion for creative energy
- **VoiceJournal**: `gentle-breathe` (4s) - subtle scale/opacity breathing for calm presence
- **SmartGrocery**: `cheerful-bounce` (3s) - light bouncing for friendly energy

These are defined in the `<style>` section and applied via CSS classes.

## Responsive Sizing

- **Home screen**: 64×64px (larger, prominent introduction)
- **Inline screens**: 48×48px (compact, supporting role)
- **Borders/Corners**: 12px (home), 8px (inline) for consistent design language

All avatars use `border-radius` for smooth appearance and `flex-shrink:0` to maintain size.

## Accessibility Notes

- All avatars have `alt` text for screen readers (inline versions)
- Home screen cards use semantic HTML (h3 for titles, p for descriptions)
- Color schemes use sufficient contrast with background text
- Avatars don't convey critical information—they enhance UX but aren't required

## Testing After Replacement

1. **Visual verification**:
   - Check avatar display on 200px home screen (64px avatar)
   - Check inline display on script/edit/record/mood/scan/compare screens (48px)
   - Verify animations run smoothly

2. **Cross-device testing**:
   - Mobile (iOS Safari, Android Chrome) - avatars should maintain aspect ratio
   - Desktop browsers - avatars should scale properly

3. **Functional testing**:
   - All original app features remain intact
   - Avatar images don't interfere with touch targets
   - Animations don't impact performance

## Implementation Checklist

- [ ] Generate 3 Higgsfield avatars using prompts above
- [ ] Convert to appropriate format (URL or base64)
- [ ] Update StoryStudio home screen avatar src
- [ ] Update StoryStudio inline avatars (script + edit screens)
- [ ] Update VoiceJournal home screen avatar src
- [ ] Update VoiceJournal inline avatars (record + mood screens)
- [ ] Update SmartGrocery home screen avatar src
- [ ] Update SmartGrocery inline avatars (scan + compare screens)
- [ ] Test on mobile devices
- [ ] Test animations load smoothly
- [ ] Verify all app functionality works

## Rollback

If needed, revert to original SVG placeholders by restoring the `src` attributes to the original `data:image/svg+xml,...` values, or use the initialization scripts to programmatically reset.

## Notes

- All apps maintain full offline functionality - avatars are decorative enhancements
- Base64 embedded images increase HTML file size (~30KB per avatar) - consider URLs for production
- SVG placeholders are ~1KB each and load instantly
- Higgsfield images will be much higher quality (generated) vs. placeholder (SVG)
