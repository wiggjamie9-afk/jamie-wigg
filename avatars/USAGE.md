# Tutor Avatars — Quick Start Guide

## Getting Started

All three avatars are ready to use immediately. They're SVG files that scale infinitely without quality loss.

## Display Examples

### HTML
```html
<!-- Simple image tag -->
<img src="/avatars/storystudio-tutor.svg" alt="StoryStudio Tutor" width="200">

<!-- With click handler -->
<img 
  src="/avatars/voicejournal-tutor.svg" 
  alt="VoiceJournal Tutor"
  onclick="selectTutor('voicejournal')"
  width="200"
>
```

### React/JSX
```jsx
import StoryStudioTutor from '/avatars/storystudio-tutor.svg';

export function TutorCard() {
  return (
    <div className="tutor">
      <img src={StoryStudioTutor} alt="StoryStudio Tutor" width={200} />
      <h2>StoryStudio Tutor</h2>
      <p>Creative Producer</p>
    </div>
  );
}
```

### CSS Background
```css
.avatar-storystudio {
  background-image: url('/avatars/storystudio-tutor.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 200px;
}
```

### Responsive Grid
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
  <img src="/avatars/storystudio-tutor.svg" alt="StoryStudio Tutor">
  <img src="/avatars/voicejournal-tutor.svg" alt="VoiceJournal Tutor">
  <img src="/avatars/smartgrocery-tutor.svg" alt="SmartGrocery Tutor">
</div>
```

## Size Recommendations

| Use Case | Size | Example |
|----------|------|---------|
| Thumbnail/sidebar | 64–100px | App navigation, chat bubble |
| Card/profile | 128–200px | User profile, course card |
| Medium display | 256–400px | Hero section, modal |
| Large hero | 500–800px | Landing page banner |
| Print (8.5"×11") | 2400×2400px | Poster, flyer |

## Integration with LMS Platforms

### Canvas/Blackboard
```html
<img src="https://your-domain.com/avatars/storystudio-tutor.svg" 
     alt="Your Tutor Name" 
     style="max-width: 200px; height: auto;">
```

### Moodle
Add to course pages via HTML block with embedded SVG.

### Teachable/Thinkific
Upload to media library and reference as image asset in course pages.

## Mobile App Integration

### React Native (Web component)
```jsx
<Image
  source={require('./avatars/storystudio-tutor.svg')}
  style={{ width: 200, height: 200 }}
/>
```

### Flutter (Web view)
```dart
Image.asset('assets/avatars/storystudio-tutor.svg',
  width: 200,
  height: 200,
)
```

## Customization Tips

### Change Avatar Colors
Edit the SVG directly in any text editor. Find the gradient definitions and update hex values:

```xml
<linearGradient id="storybg">
  <stop offset="0%" style="stop-color:#ec4899" /> <!-- Change this -->
  <stop offset="100%" style="stop-color:#f43f5e" /> <!-- And this -->
</linearGradient>
```

### Add Animation (CSS)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

img.avatar {
  animation: float 3s ease-in-out infinite;
}
```

### Add Animation (SVG)
```xml
<animate 
  attributeName="opacity" 
  values="0.8;1;0.8" 
  dur="3s" 
  repeatCount="indefinite"
/>
```

### Apply Filters
```css
img.avatar-grayscale {
  filter: grayscale(100%);
}

img.avatar-hover:hover {
  filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.5));
}
```

## AI Integration

### As Chatbot Avatar
```javascript
// In your chatbot UI
const tutorConfig = {
  storystudio: {
    avatar: '/avatars/storystudio-tutor.svg',
    name: 'StoryStudio Tutor',
    greeting: 'Hi! Ready to create amazing videos?'
  },
  voicejournal: {
    avatar: '/avatars/voicejournal-tutor.svg',
    name: 'VoiceJournal Tutor',
    greeting: 'Welcome! Let\'s explore your wellness journey.'
  }
};
```

### As Assistant Interface
```javascript
// Display avatar during response
const showTutorResponse = (tutorId, response) => {
  const config = tutorConfig[tutorId];
  document.getElementById('avatar').src = config.avatar;
  document.getElementById('name').textContent = config.name;
  document.getElementById('response').textContent = response;
};
```

## Color-Coded Contexts

Use the avatars' native colors to match contexts:

```html
<!-- StoryStudio context (pink) -->
<div style="background: #ec4899; padding: 1rem;">
  <img src="/avatars/storystudio-tutor.svg" alt="StoryStudio Tutor">
</div>

<!-- VoiceJournal context (lavender) -->
<div style="background: #c084fc; padding: 1rem;">
  <img src="/avatars/voicejournal-tutor.svg" alt="VoiceJournal Tutor">
</div>

<!-- SmartGrocery context (green) -->
<div style="background: #10b981; padding: 1rem;">
  <img src="/avatars/smartgrocery-tutor.svg" alt="SmartGrocery Tutor">
</div>
```

## Performance Tips

✓ SVG files are **already optimized** (2–3 KB each)  
✓ Use **lazy loading** for multiple avatars:

```html
<img 
  src="/avatars/storystudio-tutor.svg" 
  loading="lazy" 
  alt="StoryStudio Tutor"
>
```

✓ **Cache** SVG files in your CDN for fast delivery  
✓ No quality loss at any size — **vector format** advantage

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Avatar won't display | Check file path, ensure `.svg` extension |
| Colors look wrong | Browser cached old version? Force refresh (Ctrl+Shift+R) |
| SVG too large | Use `max-width: 100%; height: auto;` CSS |
| Not responsive | Add `width="100%" height="auto"` attributes |

## Next Steps

1. **View all avatars** → Open `index.html` in a browser
2. **Copy to your project** → Place `*.svg` files in your assets folder
3. **Reference in code** → Use examples above for your platform
4. **Customize if needed** → Edit SVG colors/styles directly

## More Info

- **Full documentation** → `README.md`
- **Technical specs** → `metadata.json`
- **Visual reference** → `index.html`
- **Direct SVG editing** → Open `.svg` files in any text editor
