# Buddy System - Higgsfield Avatar Integration Setup

## Overview

The Buddy System includes AI-powered avatar customization via Higgsfield's Soul API. Users can describe their buddy's appearance, and the system generates a portrait to represent their companion.

## Architecture

### Client-Side (buddy-system.html)
- Modal UI for avatar customization
- Text input for avatar descriptions
- localStorage persistence for generated avatars
- Fallback emoji display if generation fails

### Server-Side Proxy (Required)
The browser client calls `/api/higgsfield-generate` to:
1. Accept avatar description text
2. Call Higgsfield Soul API with authentication
3. Return generated image URL to client
4. Handle CORS and rate limiting

## Implementation Options

### Option 1: Cloudflare Worker (Recommended)

Create `studio/workers/avatar-proxy/` - minimal, serverless, fast:

```javascript
// studio/workers/avatar-proxy/src/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { prompt, model = 'soul' } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      // Call Higgsfield API
      const response = await fetch('https://api.higgsfield.ai/v1/generate/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HIGGSFIELD_API_KEY}`,
          'X-API-Secret': env.HIGGSFIELD_SECRET,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          size: '512x512'
        })
      });

      if (!response.ok) {
        throw new Error(`Higgsfield API error: ${response.statusText}`);
      }

      const data = await response.json();

      return new Response(JSON.stringify({
        imageUrl: data.data?.[0]?.url || data.url,
        success: true
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('Avatar generation error:', error);
      return new Response(JSON.stringify({
        error: error.message || 'Failed to generate avatar'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
```

Deploy with:
```bash
cd studio/workers/avatar-proxy
wrangler deploy
```

Add secrets:
```bash
wrangler secret put HIGGSFIELD_API_KEY
wrangler secret put HIGGSFIELD_SECRET
```

### Option 2: Simple Express Server (Local Development)

```javascript
// buddies-api.mjs
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const HIGGSFIELD_API_KEY = process.env.HIGGSFIELD_API_KEY;
const HIGGSFIELD_SECRET = process.env.HIGGSFIELD_SECRET;

app.post('/api/higgsfield-generate', async (req, res) => {
  const { prompt, model = 'soul' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const response = await fetch('https://api.higgsfield.ai/v1/generate/image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HIGGSFIELD_API_KEY}`,
        'X-API-Secret': HIGGSFIELD_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        size: '512x512'
      })
    });

    if (!response.ok) {
      throw new Error(`Higgsfield error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({
      imageUrl: data.data?.[0]?.url || data.url,
      success: true
    });

  } catch (error) {
    console.error('Avatar generation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate avatar'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Avatar proxy running on http://localhost:${PORT}`);
});
```

Run with:
```bash
HIGGSFIELD_API_KEY=your-key HIGGSFIELD_SECRET=your-secret node buddies-api.mjs
```

### Option 3: Browser-Side with MCP (If Higgsfield MCP available)

If you have the Higgsfield MCP server configured (per CLAUDE.md), Claude Code can handle generation during build/development via agents.

## Environment Setup

### 1. Get Higgsfield Credentials

Visit https://platform.higgsfield.ai and create an API key.

### 2. Store in .env

```bash
cp .env.example .env
```

Update:
```
HIGGSFIELD_API_KEY=your-api-key-here
HIGGSFIELD_SECRET=your-secret-here
```

### 3. For Production (Cloudflare Workers)

Set via Wrangler:
```bash
cd studio/workers/avatar-proxy
wrangler secret put HIGGSFIELD_API_KEY
wrangler secret put HIGGSFIELD_SECRET
```

## Client Configuration

The HTML client expects the API at `/api/higgsfield-generate`. Update the fetch path if using a different endpoint:

**Local dev:** `http://localhost:3001/api/higgsfield-generate`
**Production:** `https://avatar-proxy.your-domain.com/api/higgsfield-generate`

Edit line in buddy-system.html:
```javascript
const response = await fetch('/api/higgsfield-generate', {
  // OR for custom endpoint:
  // const response = await fetch('https://avatar-proxy.your-domain.com/api/higgsfield-generate', {
```

## Higgsfield API Reference

### Soul Endpoint (Text-to-Image)

```
POST https://api.higgsfield.ai/v1/generate/image
Headers:
  Authorization: Bearer {API_KEY}
  X-API-Secret: {SECRET}
  Content-Type: application/json

Body:
{
  "model": "soul",
  "prompt": "Portrait of a friendly mentor with warm eyes",
  "size": "512x512"
}

Response:
{
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

## Storage

- **localStorage key format**: `buddy-avatar-{buddyId}`
- **Value**: Image URL (data URI or external URL)
- **Persistence**: Per-device, survives browser restart
- **Size limit**: ~5MB per origin (plenty for URLs)

## Error Handling

- **No API key**: Shows "Generation issue" error
- **Invalid description**: Suggests more detailed text
- **Network error**: Fallback to emoji avatar
- **Generation timeout**: Retry available

## Performance Notes

- Avatar generation takes 3-15 seconds (Higgsfield processes async)
- Consider adding request queuing if many users
- Cache generated images (URLs are unique per run)
- Display loading spinner during generation

## Testing Checklist

- [ ] Generate avatar via modal
- [ ] Avatar displays in preview before saving
- [ ] Avatar saves to localStorage
- [ ] Avatar persists on page reload
- [ ] Avatar shows in hub grid and detail view
- [ ] Click avatar in detail view opens modal again
- [ ] Settings tab "Customize Avatar" button works
- [ ] Error handling for API failures
- [ ] Emoji fallback if generation fails

## Future Enhancements

1. **Image upload**: Let users upload their own avatar images
2. **Style presets**: "Cartoon", "Photorealistic", "Minimalist"
3. **Batch generation**: Create 3 options, user picks one
4. **DOP integration**: Use Higgsfield DOP to animate avatar
5. **Multi-turn editing**: "Make them older", "Add glasses"
6. **Avatar gallery**: Browse pre-generated options by vibe
