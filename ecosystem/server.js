#!/usr/bin/env node

/**
 * Jackson's Ecosystem API Server
 * Deploys to Replit/Railway for iPhone 17 access
 */

import express from 'express';
import cors from 'cors';
import { jacksonEcosystem } from './jackson.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files (outputs)
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

/**
 * POST /api/jackson
 * Generate voice + music from text
 */
app.post('/api/jackson', async (req, res) => {
  try {
    const { text, voice = 'ElevenLabs', mode = 'text-to-voice-music', enhance = true } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing text parameter' });
    }

    console.log(`[Jackson API] Mode: ${mode}, Voice: ${voice}, Enhance: ${enhance}`);
    console.log(`[Jackson API] Input: "${text.substring(0, 100)}..."`);

    // Call Jackson's Ecosystem
    const result = await jacksonEcosystem(text, {
      mode,
      voice,
      musicModel: 'musicgen-large',
      enhance,
    });

    // Return URLs instead of file paths (for iPhone access)
    const timestamp = result.timestamp.split('T')[0];
    const voiceFilename = result.voice ? path.basename(result.voice) : null;
    const musicFilename = result.music?.output_path ? path.basename(result.music.output_path) : null;

    res.json({
      success: true,
      text: result.text,
      voice: voiceFilename ? `/outputs/${voiceFilename}` : null,
      music: musicFilename ? `/outputs/${musicFilename}` : null,
      timestamp: result.timestamp,
    });
  } catch (err) {
    console.error('[Jackson API Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: "Jackson's Ecosystem API",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/outputs
 * List recent outputs
 */
app.get('/api/outputs', (req, res) => {
  try {
    const outputDir = path.join(__dirname, 'outputs');
    if (!fs.existsSync(outputDir)) {
      return res.json({ outputs: [] });
    }

    const files = fs
      .readdirSync(outputDir)
      .filter(f => f.endsWith('.wav') || f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, 20);

    res.json({
      outputs: files.map(f => ({
        filename: f,
        url: `/outputs/${f}`,
        size: fs.statSync(path.join(outputDir, f)).size,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /
 * Serve dashboard
 */
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Jackson's Ecosystem API</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background: linear-gradient(135deg, #0F172A, #1E293B);
          color: #F1F5F9;
        }
        h1 {
          background: linear-gradient(135deg, #FF6B9D, #6366F1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        code {
          background: #1E293B;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'Courier New';
        }
        .endpoint {
          background: #1E293B;
          border-left: 3px solid #6366F1;
          padding: 16px;
          margin: 16px 0;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <h1>🎬 Jackson's Ecosystem API</h1>
      <p>Server is running. Use the endpoints below:</p>

      <div class="endpoint">
        <strong>POST /api/jackson</strong>
        <p>Generate voice + music from text</p>
        <code>
{
  "text": "Your script here",
  "voice": "ElevenLabs|Kokoro",
  "mode": "text-to-voice-music|text-to-voice|text-to-music",
  "enhance": true
}
        </code>
      </div>

      <div class="endpoint">
        <strong>GET /api/health</strong>
        <p>Health check</p>
      </div>

      <div class="endpoint">
        <strong>GET /api/outputs</strong>
        <p>List recent generated files</p>
      </div>

      <hr>
      <p>📱 Access from iPhone 17 at: <code>https://jackson-ecosystem.replit.dev</code></p>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Jackson's Ecosystem API running on port ${PORT}`);
  console.log(`📱 Access from iPhone: https://jackson-ecosystem.replit.dev`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
