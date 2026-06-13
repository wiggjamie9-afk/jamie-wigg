# AI Asset Generation Integration

The event platform now includes built-in AI asset generation for events. Users can auto-generate event images and descriptions when creating events.

## Features

- **Multi-provider image generation**: Replicate FLUX (best quality), Leonardo AI (fast & stylized), Craiyon (free open-source)
- **Automatic event descriptions**: AI-generated event descriptions from event titles
- **One-click generation**: Generate images and scripts directly from the event creation form
- **Preview before save**: Review generated assets before adding to event

## Setup

### 1. Install Dependencies

The Python content automation tools must be in the parent directory:

```
~/jamie-wigg-workspace/
├── event-platform/          (your app)
└── content-automation/      (Python generators)
```

Ensure content-automation has dependencies installed:

```bash
cd ../content-automation
pip install -r requirements.txt
```

### 2. Set Environment Variables

Add API keys for image generators you plan to use:

```bash
export REPLICATE_API_TOKEN="your-token"
export LEONARDO_API_KEY="your-key"
# Craiyon requires no API key
```

Or add to your `.env.local` in the event-platform directory:

```env
# .env.local
REPLICATE_API_TOKEN=your-token
LEONARDO_API_KEY=your-key
```

Note: The Next.js API route will need access to these environment variables at runtime.

### 3. Create Public Output Directory

The generated assets are stored in the public directory:

```bash
mkdir -p public/generated-assets/images
```

## Usage

### In React Components

```tsx
import { AssetGenerator } from '@/components/AssetGenerator';

export function EventForm() {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventImage, setEventImage] = useState('');

  return (
    <div>
      <input
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Event name"
      />

      {/* Asset Generator Component */}
      <AssetGenerator
        eventName={eventName}
        eventDescription={eventDescription}
        onImageGenerated={(imageUrl) => setEventImage(imageUrl)}
        onScriptGenerated={(script) => setEventDescription(script)}
      />

      {/* Rest of form */}
    </div>
  );
}
```

### API Endpoint

**POST** `/api/generate-event-assets`

Request:

```json
{
  "eventName": "Tech Conference 2025",
  "eventDescription": "Annual technology conference",
  "imageGenerator": "replicate",
  "scriptType": "event-description",
  "assetType": "both"
}
```

Response:

```json
{
  "success": true,
  "image": {
    "url": "/generated-assets/images/event-1718282400000.png",
    "path": "/absolute/path/to/image.png"
  },
  "script": {
    "content": "Tech Conference 2025 is an annual gathering...",
    "type": "event-description"
  }
}
```

**GET** `/api/generate-event-assets`

Returns available generators and required environment variables:

```json
{
  "imageGenerators": ["replicate", "leonardo", "craiyon"],
  "scriptTypes": ["narration", "social", "event-description", "video-hook", "product-pitch"],
  "requiresEnv": {
    "replicate": "REPLICATE_API_TOKEN",
    "leonardo": "LEONARDO_API_KEY",
    "craiyon": "none"
  }
}
```

## Integrating into EventForm

To add asset generation to your event creation form:

1. Import the component:

```tsx
import { AssetGenerator } from '@/components/AssetGenerator';
```

2. Add to your form:

```tsx
<div className="space-y-6">
  {/* Existing form fields */}
  <input
    value={eventName}
    onChange={(e) => setEventName(e.target.value)}
    placeholder="Event name"
  />

  {/* Asset Generator */}
  <AssetGenerator
    eventName={eventName}
    eventDescription={eventDescription}
    onImageGenerated={(imageUrl) => {
      // Save to form state
      setEventData({ ...eventData, image: imageUrl });
    }}
    onScriptGenerated={(script) => {
      // Use as event description
      setEventDescription(script);
    }}
  />

  {/* Continue with submit button */}
</div>
```

## Image Generators Comparison

| Generator | Quality | Speed | Cost | Best For |
|-----------|---------|-------|------|----------|
| **Replicate FLUX 1.1 Pro** | ⭐⭐⭐⭐⭐ Excellent | Fast | Per-image | Production, high quality |
| **Leonardo AI** | ⭐⭐⭐⭐ Very Good | Very Fast | Per-image | Stylized, anime-style images |
| **Craiyon (DALL-E mini)** | ⭐⭐⭐ Good | Medium | Free tier | Budget-friendly, testing |

## Troubleshooting

### "Python not found"

Ensure Python 3 is installed and in PATH:

```bash
which python3
python3 --version
```

### "Module not found"

Install missing Python dependencies:

```bash
pip install -r ../content-automation/requirements.txt
```

### "API key not set"

Check environment variables:

```bash
echo $REPLICATE_API_TOKEN
echo $LEONARDO_API_KEY
```

For Next.js, ensure keys are in `.env.local` or set in the deployment environment.

### Image generation timeout

Large models (Leonardo, Replicate) may take 10-30 seconds. The API has a default timeout. Increase in `route.ts` if needed:

```typescript
const command = `timeout 60 python3 ${pythonScript}...`
```

## Architecture

```
EventForm.tsx
    ↓
AssetGenerator.tsx (React component)
    ↓
useGenerateAssets hook
    ↓
POST /api/generate-event-assets (Next.js API route)
    ↓
Python scripts (../content-automation/)
    ├── image_generator.py
    └── script_generator.py
    ↓
Generated assets → public/generated-assets/
```

## Next Steps

1. Add AssetGenerator to EventForm
2. Test with Craiyon (free, no API key needed)
3. Add Replicate API key once comfortable
4. Consider caching generated assets in Supabase
5. Add image cropping/editing UI for fine-tuning

---

For content automation CLI usage, see `../content-automation/README.md`
