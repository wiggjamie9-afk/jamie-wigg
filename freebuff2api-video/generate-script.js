#!/usr/bin/env node

/**
 * Generate video script using Freebuff2API
 * Usage: node generate-script.js "Your video brief here"
 */

const https = require('https');
const fs = require('fs');

const FREEBUFF_API = process.env.FREEBUFF_API || 'http://localhost:8080/v1/chat/completions';

async function generateScript(brief) {
  const prompt = `Create a compelling 60-second video script for: "${brief}"

Requirements:
- Exactly 60 seconds when read at normal pace (approximately 150-180 words)
- 3-4 punchy sentences per section
- Include: Hook (5s), Problem (15s), Solution (25s), CTA (10s)
- Use [PAUSE] for dramatic effect
- Use [EMPHASIS] for key words
- Professional but engaging tone

Format as plain text, no markdown.`;

  console.log('🎬 Generating script from Freebuff2API...\n');

  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    });

    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const req = require('http').request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(
              new Error(
                `API Error: ${res.statusCode} - Make sure Freebuff2API is running at http://localhost:8080`
              )
            );
            return;
          }

          const response = JSON.parse(data);
          const script = response.choices?.[0]?.message?.content;

          if (!script) {
            reject(new Error('No script generated'));
            return;
          }

          resolve(script);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

async function main() {
  const brief =
    process.argv[2] ||
    'An OpenAI-compatible proxy server that makes AI accessible to everyone through Freebuff';

  try {
    const script = await generateScript(brief);

    console.log('📝 Generated Script:\n');
    console.log('='.repeat(60));
    console.log(script);
    console.log('='.repeat(60));
    console.log('\n✅ Script saved to script.txt\n');

    fs.writeFileSync('script.txt', script);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
