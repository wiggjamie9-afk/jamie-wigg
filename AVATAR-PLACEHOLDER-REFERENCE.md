# Avatar Placeholder Reference & Replacement Guide

## Current Placeholder Avatars

All three apps currently use SVG placeholders in `data:image/svg+xml` format embedded directly in the HTML. These are optimized for instant loading and can be easily replaced with Higgsfield-generated images.

---

## StoryStudio Avatar

### Home Screen (64×64px)
**ID**: `tutorAvatar`  
**Current SVG** (base URL-encoded):
```
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 280'%3E%3Cdefs%3E%3ClinearGradient id='bgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ec4899;stop-opacity:0.15'/%3E%3Cstop offset='100%25' style='stop-color:%23f43f5e;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='120' cy='140' r='110' fill='url(%23bgGrad)' stroke='%23f43f5e' stroke-width='2'/%3E%3Ccircle cx='120' cy='100' r='45' fill='%23f472b6'/%3E%3Cg id='face'%3E%3Ccircle cx='105' cy='90' r='5' fill='%231a0b2e'/%3E%3Ccircle cx='135' cy='90' r='5' fill='%231a0b2e'/%3E%3Cpath d='M 105 105 Q 120 115 135 105' stroke='%231a0b2e' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M 100 115 L 140 115' stroke='%23ec4899' stroke-width='1.5' opacity='0.6'/%3E%3C/g%3E%3Ccircle cx='120' cy='160' r='35' fill='%23f472b6' opacity='0.5'/%3E%3Cpath d='M 90 155 Q 120 175 150 155' stroke='%23f43f5e' stroke-width='2' opacity='0.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E
```

### Inline Screens (48×48px)
**Location**: Lines 185 and 209  
**Use same SVG** as above (scales naturally due to viewBox)

### To Replace with Higgsfield Image:

**Option 1: URL-based (recommended)**
```html
<!-- In storystudio.html, replace: -->
<img id="tutorAvatar" src="https://your-cdn.com/avatars/storystudio-tutor.png" ...>

<!-- Or in inline sections: -->
<img style="..." src="https://your-cdn.com/avatars/storystudio-tutor.png" alt="Creative partner">
```

**Option 2: Base64-embedded**
```html
<!-- Convert PNG to base64: -->
<!-- base64 -i avatar.png | tr -d '\n' > avatar.b64 -->

<img id="tutorAvatar" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..." ...>
```

### Search & Replace Pattern (StoryStudio)
Find all instances of:
```
src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 280'%3E%3Cdefs%3E%3ClinearGradient id='bgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ec4899
```

Replace with:
```
src="<YOUR_HIGGSFIELD_IMAGE_URL_OR_BASE64>"
```

---

## VoiceJournal Avatar

### Home Screen (64×64px)
**ID**: `wellnessAvatar`  
**Current SVG** (base URL-encoded):
```
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 280'%3E%3Cdefs%3E%3ClinearGradient id='bgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23c084fc;stop-opacity:0.15'/%3E%3Cstop offset='100%25' style='stop-color:%23a78bfa;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='120' cy='140' r='110' fill='url(%23bgGrad)' stroke='%23a78bfa' stroke-width='2'/%3E%3Ccircle cx='120' cy='100' r='45' fill='%23d8b4fe'/%3E%3Cg id='face'%3E%3Ccircle cx='105' cy='90' r='5' fill='%231a0b2e'/%3E%3Ccircle cx='135' cy='90' r='5' fill='%231a0b2e'/%3E%3Cpath d='M 100 108 Q 120 118 140 108' stroke='%231a0b2e' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M 105 115 L 135 115' stroke='%23c084fc' stroke-width='1.5' opacity='0.6'/%3E%3C/g%3E%3Ccircle cx='120' cy='160' r='35' fill='%23d8b4fe' opacity='0.4'/%3E%3Cpath d='M 95 155 Q 120 170 145 155' stroke='%23a78bfa' stroke-width='2' opacity='0.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E
```

### Inline Screens (48×48px)
**Locations**: Lines 224, 246  
**Use same SVG** as above

### To Replace with Higgsfield Image:

**Option 1: URL-based (recommended)**
```html
<img id="wellnessAvatar" src="https://your-cdn.com/avatars/voicejournal-coach.png" ...>
```

**Option 2: Base64-embedded**
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..." ...>
```

### Search & Replace Pattern (VoiceJournal)
Find all instances of:
```
src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 280'%3E%3Cdefs%3E%3ClinearGradient id='bgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23c084fc
```

Replace with:
```
src="<YOUR_HIGGSFIELD_IMAGE_URL_OR_BASE64>"
```

---

## SmartGrocery Avatar

### Home Screen (64×64px)
**ID**: `shopperAvatar`  
**Current SVG** (base URL-encoded):
```
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 280'%3E%3Cdefs%3E%3ClinearGradient id='bgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:0.15'/%3E%3Cstop offset='100%25' style='stop-color:%23059669;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='120' cy='140' r='110' fill='url(%23bgGrad)' stroke='%23059669' stroke-width='2'/%3E%3Ccircle cx='120' cy='100' r='45' fill='%2334d399'/%3E%3Cg id='face'%3E%3Ccircle cx='105' cy='90' r='5' fill='%23051c15'/%3E%3Ccircle cx='135' cy='90' r='5' fill='%23051c15'/%3E%3Cpath d='M 100 110 Q 120 120 140 110' stroke='%23051c15' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M 105 117 L 135 117' stroke='%2310b981' stroke-width='1.5' opacity='0.6'/%3E%3C/g%3E%3Ccircle cx='120' cy='160' r='35' fill='%2334d399' opacity='0.4'/%3E%3Cpath d='M 90 150 Q 120 168 150 150' stroke='%23059669' stroke-width='2' opacity='0.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E
```

### Inline Screens (48×48px)
**Locations**: Lines 868, 894  
**Use same SVG** as above

### To Replace with Higgsfield Image:

**Option 1: URL-based (recommended)**
```html
<img id="shopperAvatar" src="https://your-cdn.com/avatars/smartgrocery-assistant.png" ...>
```

**Option 2: Base64-embedded**
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..." ...>
```

### Search & Replace Pattern (SmartGrocery)
Find all instances of:
```
src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 280'%3E%3Cdefs%3E%3ClinearGradient id='bgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981
```

Replace with:
```
src="<YOUR_HIGGSFIELD_IMAGE_URL_OR_BASE64>"
```

---

## Image Requirements for Replacement

### Recommended Specifications:
- **Format**: PNG (for transparency) or JPG (for compression)
- **Size**: 240×240px minimum (will scale to 64px and 48px)
- **Aspect Ratio**: 1:1 (square)
- **Background**: Transparent PNG preferred
- **Color Palette**: Match app theme colors
  - StoryStudio: Pink/Rose tones
  - VoiceJournal: Lavender/Violet tones
  - SmartGrocery: Green/Emerald tones

### Quality Targets:
- **Portrait Style**: Head/shoulders preferred
- **Expression**: Friendly, approachable, professional
- **Resolution**: 150-240dpi for print clarity
- **File Size**: <100KB per image (for performance)

---

## Automated Replacement Script

If you have multiple image files, use this bash script to generate the replacements:

```bash
#!/bin/bash
# convert-avatars.sh

# Convert PNG images to base64
for app in storystudio voicejournal smartgrocery; do
  image_file="${app}-avatar.png"
  if [ -f "$image_file" ]; then
    # Convert to base64
    base64_data=$(base64 -i "$image_file" | tr -d '\n')
    echo "data:image/png;base64,$base64_data" > "${app}-avatar.b64"
    echo "Generated: ${app}-avatar.b64"
  fi
done
```

Then use the `.b64` file contents as your `src` value.

---

## Fallback Strategy

### For Offline / Performance:
Keep both SVG placeholder and Higgsfield image:

```html
<img 
  id="tutorAvatar" 
  src="https://your-cdn.com/avatars/storystudio.png"
  onerror="this.src='data:image/svg+xml,%3Csvg...'"
  style="width:64px; height:64px; border-radius:12px;"
>
```

This ensures:
1. Higgsfield image loads first (if CDN available)
2. Falls back to SVG placeholder (if CDN fails or offline)
3. App remains fully functional either way

---

## Verification Checklist After Replacement

- [ ] Images display at correct sizes (64px home, 48px inline)
- [ ] No broken image icons (missing src)
- [ ] Images load in <2 seconds
- [ ] Images render at high quality on mobile
- [ ] Animations still run smoothly
- [ ] No layout shift due to image loading
- [ ] Alt text present for accessibility
- [ ] File sizes reasonable (<500KB total for 3 images)
- [ ] Works offline if base64 embedded
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)

---

## Support Resources

For Higgsfield image generation:
- Prompts provided in `AVATAR-INTEGRATION-GUIDE.md`
- Use Higgsfield Soul model for best results
- High resolution (240px+) for excellent scaling

For image optimization:
- TinyPNG/TinyJPG for lossless compression
- ImageOptim (Mac) or Optipng (Linux/Windows)
- Run through AVIF converter for modern browsers

For base64 encoding:
```bash
# macOS/Linux
base64 -i image.png | tr -d '\n'

# Windows (PowerShift)
[Convert]::ToBase64String([IO.File]::ReadAllBytes('image.png'))
```
