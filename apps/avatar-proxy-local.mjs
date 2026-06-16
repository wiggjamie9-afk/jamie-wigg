#!/usr/bin/env node
/**
 * Local Higgsfield Avatar Proxy Server
 *
 * Runs locally for development/testing.
 * Proxies buddy avatar generation requests to Higgsfield Soul API.
 *
 * Usage:
 *   node avatar-proxy-local.mjs
 *
 * Or with env vars:
 *   HIGGSFIELD_API_KEY=xxx HIGGSFIELD_SECRET=yyy PORT=3001 node avatar-proxy-local.mjs
 *
 * The client (buddy-system.html) will call http://localhost:3001/api/higgsfield-generate
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from parent directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Credentials from environment
const HIGGSFIELD_API_KEY = process.env.HIGGSFIELD_API_KEY;
const HIGGSFIELD_SECRET = process.env.HIGGSFIELD_SECRET;
const HIGGSFIELD_ENDPOINT = 'https://api.higgsfield.ai/v1/generate/image';

// Health check
app.get('/health', (req, res) => {
  const apiConfigured = !!HIGGSFIELD_API_KEY && !!HIGGSFIELD_SECRET;
  res.json({
    status: 'running',
    endpoint: `/api/higgsfield-generate`,
    apiConfigured,
    timestamp: new Date().toISOString(),
  });
});

// Avatar generation endpoint
app.post('/api/higgsfield-generate', async (req, res) => {
  const { prompt, model = 'soul', size = '512x512' } = req.body;

  // Validate input
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    console.warn('Invalid request: missing or empty prompt');
    return res.status(400).json({
      error: 'Missing or invalid prompt. Please describe your buddy\'s appearance.',
    });
  }

  // Check credentials
  if (!HIGGSFIELD_API_KEY || !HIGGSFIELD_SECRET) {
    console.error('Missing Higgsfield credentials in .env');
    return res.status(500).json({
      error: 'Server configuration error: missing Higgsfield API credentials',
      hint: 'Set HIGGSFIELD_API_KEY and HIGGSFIELD_SECRET in .env',
    });
  }

  try {
    console.log(`\n[${new Date().toISOString()}] Avatar Generation Request`);
    console.log(`  Model: ${model}`);
    console.log(`  Prompt: ${prompt.slice(0, 80)}...`);

    // Clean and enhance prompt
    const cleanedPrompt = prompt.slice(0, 500).trim();
    const enhancedPrompt = `Friendly portrait of a buddy character: ${cleanedPrompt}. Professional, approachable, warm, headshot style. Suitable for an AI companion app.`;

    // Call Higgsfield API
    const response = await fetch(HIGGSFIELD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HIGGSFIELD_API_KEY}`,
        'X-API-Secret': HIGGSFIELD_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: enhancedPrompt,
        size,
      }),
      timeout: 30000, // 30 second timeout
    });

    // Log response status
    console.log(`  Higgsfield Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`  Error Body: ${errorText.slice(0, 200)}`);

      return res.status(response.status).json({
        error: `Higgsfield API error: ${response.status} ${response.statusText}`,
        details: errorText.slice(0, 100),
      });
    }

    const data = await response.json();

    // Extract image URL from response
    let imageUrl = null;
    if (data.data && Array.isArray(data.data) && data.data[0]) {
      imageUrl = data.data[0].url;
    } else if (data.url) {
      imageUrl = data.url;
    }

    if (!imageUrl) {
      console.error(`  Error: No URL in response`, data);
      return res.status(500).json({
        error: 'No image URL returned from Higgsfield API',
      });
    }

    console.log(`  Success! Image URL: ${imageUrl.slice(0, 50)}...`);

    // Return success
    res.json({
      success: true,
      imageUrl,
      model,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  Fetch Error: ${errorMessage}`);

    res.status(500).json({
      error: `Avatar generation failed: ${errorMessage}`,
    });
  }
});

// Talking-head animation endpoint (Higgsfield DOP image-to-video / Speech-to-Video)
const HIGGSFIELD_ANIMATE_ENDPOINT = 'https://api.higgsfield.ai/v1/generate/video';
app.post('/api/higgsfield-animate', async (req, res) => {
  const { imageUrl, model = 'dop', motion = 'talking-head', audioUrl = null } = req.body;

  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'Missing imageUrl. Generate a still face first.' });
  }
  if (!HIGGSFIELD_API_KEY || !HIGGSFIELD_SECRET) {
    return res.status(500).json({
      error: 'Server configuration error: missing Higgsfield API credentials',
      hint: 'Set HIGGSFIELD_API_KEY and HIGGSFIELD_SECRET in .env',
    });
  }

  try {
    console.log(`\n[${new Date().toISOString()}] Talking-head Animation Request (model=${model}, motion=${motion})`);

    // DOP animates a still; if an ElevenLabs audio URL is supplied we ask for lip-synced Speech-to-Video.
    const body = {
      model,
      image_url: imageUrl,
      motion,
      ...(audioUrl ? { audio_url: audioUrl, mode: 'speech-to-video' } : {}),
    };

    const response = await fetch(HIGGSFIELD_ANIMATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HIGGSFIELD_API_KEY}`,
        'X-API-Secret': HIGGSFIELD_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      timeout: 120000, // video generation is slower
    });

    console.log(`  Higgsfield Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`  Error Body: ${errorText.slice(0, 200)}`);
      return res.status(response.status).json({
        error: `Higgsfield API error: ${response.status} ${response.statusText}`,
        details: errorText.slice(0, 100),
      });
    }

    const data = await response.json();
    let videoUrl = null;
    if (data.data && Array.isArray(data.data) && data.data[0]) {
      videoUrl = data.data[0].url || data.data[0].video_url;
    } else if (data.video_url) {
      videoUrl = data.video_url;
    } else if (data.url) {
      videoUrl = data.url;
    }

    if (!videoUrl) {
      console.error('  Error: No video URL in response', data);
      return res.status(500).json({ error: 'No video URL returned from Higgsfield API' });
    }

    console.log(`  Success! Video URL: ${videoUrl.slice(0, 50)}...`);
    res.json({ success: true, videoUrl, model, timestamp: new Date().toISOString() });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  Fetch Error: ${errorMessage}`);
    res.status(500).json({ error: `Animation failed: ${errorMessage}` });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/higgsfield-generate',
      'POST /api/higgsfield-animate',
    ],
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`Avatar Proxy Server`);
  console.log(`========================================`);
  console.log(`\n✨ Listening on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health`);
  console.log(`  POST /api/higgsfield-generate`);
  console.log(`\nBuddy System will call: http://localhost:${PORT}/api/higgsfield-generate`);
  console.log(`\nConfiguration:`);
  console.log(`  API Key: ${HIGGSFIELD_API_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`  API Secret: ${HIGGSFIELD_SECRET ? '✓ Set' : '✗ Missing'}`);
  console.log(`\n${!HIGGSFIELD_API_KEY || !HIGGSFIELD_SECRET ? '⚠️  WARNING: Credentials missing from .env\n' : '✓ Ready to generate avatars!\n'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  process.exit(0);
});
