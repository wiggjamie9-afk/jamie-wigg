# AI Tutor Avatars

Professional avatar designs for three distinct tutor personas, created as scalable SVG illustrations.

## Overview

Three carefully designed AI tutors, each with unique personality, color scheme, and visual identity:

| Avatar | Role | Color Scheme | File |
|--------|------|-------------|------|
| **StoryStudio Tutor** | Creative Producer | Pink (#ec4899) + Rose (#f43f5e) | `storystudio-tutor.svg` |
| **VoiceJournal Tutor** | Wellness Guide | Lavender (#c084fc) + Violet (#a78bfa) | `voicejournal-tutor.svg` |
| **SmartGrocery Tutor** | Shopping Assistant | Green (#10b981) + Emerald (#059669) | `smartgrocery-tutor.svg` |

## StoryStudio Tutor

**Personality:** Creative, energetic video producer with inspiring expression, trendy appearance, passionate

**Key Traits:**
- Energetic and inspiring
- Creative visual storytelling expert
- Trendy, modern aesthetic
- Passionate about content creation

**Visual Elements:**
- Gradient background: pink-to-rose
- Dynamic, styled hair (deep rose)
- Bright, energetic expression with expressive eyebrows
- Paint palette accent symbolizing creativity
- Aura indicating energy and inspiration

**Best For:**
- Video production tutorials
- Creative content creation courses
- Visual design education
- Filmmaking guidance

## VoiceJournal Tutor

**Personality:** Warm, compassionate wellness guide with empathetic expression, nurturing presence

**Key Traits:**
- Warm and compassionate
- Deeply empathetic
- Nurturing and supportive
- Focused on personal growth

**Visual Elements:**
- Gradient background: lavender-to-violet
- Flowing, gentle purple hair with waves
- Soft, caring smile with gentle eyebrows
- Heart symbol representing wellness and care
- Healing aura with soft glow effects

**Best For:**
- Wellness and mental health courses
- Personal development programs
- Journaling and reflection tutorials
- Emotional support education

## SmartGrocery Tutor

**Personality:** Friendly, helpful shopping assistant with a bright smile, approachable and practical

**Key Traits:**
- Friendly and approachable
- Practical and solution-oriented
- Helpful and encouraging
- Bright, positive demeanor

**Visual Elements:**
- Gradient background: green-to-emerald
- Warm brown, neat professional hair
- Warm, helpful smile with bright eyes
- Shopping basket with fresh produce accent
- Practical aura indicating reliability

**Best For:**
- Grocery shopping and meal planning
- Budget-friendly cooking tutorials
- Nutrition and food education
- Smart shopping strategies

## Technical Details

### Format
- **Type:** SVG (Scalable Vector Graphics)
- **Resolution:** 200×200 viewBox (infinitely scalable)
- **Colors:** Full RGB with gradients and opacity layers
- **Compatibility:** All modern browsers and design tools

### File Specifications

Each avatar file contains:
- Gradient background (2-color palette)
- Head and facial features (eyes, nose, mouth)
- Expressive eyebrows and hair
- Body and torso
- Domain-specific accent element
- Aura/highlighting effects

### Usage

#### Web Integration
```html
<img src="storystudio-tutor.svg" alt="StoryStudio Tutor" width="200" height="200">
```

#### Embedding in HTML
```html
<object data="storystudio-tutor.svg" type="image/svg+xml"></object>
```

#### CSS Background
```css
.avatar {
  background-image: url('storystudio-tutor.svg');
  background-size: contain;
  width: 200px;
  height: 200px;
}
```

#### Responsive Sizing
SVG automatically scales — use any size from 50px to 1000px+:

```html
<img src="storystudio-tutor.svg" alt="StoryStudio Tutor" width="100%" height="auto">
```

## Color Reference

### StoryStudio
- Primary: `#ec4899` (Pink)
- Secondary: `#f43f5e` (Rose)
- Skin tone: `#fdbcb4` → `#f8a8a0` (gradient)

### VoiceJournal
- Primary: `#c084fc` (Lavender)
- Secondary: `#a78bfa` (Violet)
- Skin tone: `#fcd5ce` → `#f9c5bc` (gradient)

### SmartGrocery
- Primary: `#10b981` (Green)
- Secondary: `#059669` (Emerald)
- Skin tone: `#fde2d9` → `#fad2c4` (gradient)

## Accessibility

✓ **WCAG AA Compliant**
- High color contrast
- Clear, distinguishable features
- Readable at all sizes
- Optimized SVG structure for screen readers

## Files Included

- **`storystudio-tutor.svg`** (2.1 KB) — Creative producer avatar
- **`voicejournal-tutor.svg`** (2.6 KB) — Wellness guide avatar
- **`smartgrocery-tutor.svg`** (3.0 KB) — Shopping assistant avatar
- **`metadata.json`** — Machine-readable avatar definitions
- **`index.html`** — Interactive avatar showcase and reference
- **`README.md`** — This documentation

## Viewing the Avatars

Open `index.html` in any modern web browser to see:
- All three avatars rendered
- Personality descriptions and traits
- Color swatches
- Usage guidelines
- Asset information

```bash
# Open in default browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# Or use a local server
python3 -m http.server 8000 --bind 127.0.0.1 --directory .
# Then visit: http://localhost:8000/
```

## Customization

### Modifying Colors
To customize colors, edit the SVG files directly:

1. Open the `.svg` file in a text editor
2. Find the `<linearGradient>` sections
3. Change the hex color values (e.g., `#ec4899`)
4. Save and reload

### Scaling for Different Uses

- **Web thumbnails:** 64×64 to 128×128
- **App icons:** 128×128 to 256×256
- **Marketing materials:** 512×512 to 1024×1024
- **Print materials:** Export to PNG at 300 DPI for high-quality printing

### Exporting to Other Formats

Using command-line tools:

```bash
# SVG to PNG (requires ImageMagick or similar)
convert -density 300 storystudio-tutor.svg storystudio-tutor.png

# SVG to PDF (requires Inkscape)
inkscape storystudio-tutor.svg --export-type=pdf
```

## Design Principles

These avatars follow professional design principles:

1. **Personality-Driven** — Each avatar's appearance reinforces their role
2. **Approachable** — Welcoming, friendly expressions encourage engagement
3. **Brand-Aligned** — Consistent color schemes match their domains
4. **Accessible** — High contrast, clear features, scalable format
5. **Recognizable** — Distinct visual identities at any size
6. **Professional** — Polished, quality appearance for educational contexts

## Use Cases

- Learning Management Systems (LMS)
- Online course platforms
- Chatbot and AI assistant interfaces
- Educational apps and mobile applications
- Marketing and promotional materials
- Social media content
- Printed educational materials
- Presentations and slide decks

## Metadata

Access structured avatar data via `metadata.json`:

```json
{
  "avatars": [
    {
      "id": "storystudio-tutor",
      "name": "StoryStudio Tutor",
      "type": "Creative Producer",
      "colorScheme": {
        "primary": "#ec4899",
        "secondary": "#f43f5e"
      },
      "filePath": "storystudio-tutor.svg"
    }
    // ... more avatars
  ]
}
```

## Version History

- **v1.0** (2026-06-14) — Initial release with three avatars

## Support

For questions about avatar customization or integration, refer to:
- `metadata.json` — Machine-readable specifications
- `index.html` — Visual reference and color guide
- SVG source files — Directly editable in any text editor

---

**Created:** June 14, 2026  
**Format:** SVG (Scalable Vector Graphics)  
**License:** Use freely in your projects
