// Generate the talking-head video via Higgsfield Speak v2.
// Requires: spokesperson.png + narration.wav (15s max)
// Usage:
//   export HF_API_KEY="your_key_id"
//   export HF_SECRET="your_secret"
//   node generate-talking-head.mjs
//
// Output: talking-head.mp4 (15s, 9:16)
// Cost: ~15-25 credits

import { HiggsfieldClient } from '@higgsfield/client';
import {
  InputImage,
  InputAudio,
  SpeakVideoQuality,
  SpeakDuration,
} from '@higgsfield/client/helpers';
import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const apiKey = process.env.HF_API_KEY;
const apiSecret = process.env.HF_SECRET;

if (!apiKey || !apiSecret) {
  console.error('✗ Missing HF_API_KEY or HF_SECRET env vars.');
  process.exit(1);
}

if (!existsSync('spokesperson.png')) {
  console.error('✗ spokesperson.png not found.');
  console.error('  Run: node generate-spokesperson.mjs first.');
  process.exit(1);
}

if (!existsSync('narration.wav')) {
  console.error('✗ narration.wav not found.');
  console.error('  Record ~15s of audio reading script-15s.txt on iPhone');
  console.error('  Voice Memos, export as WAV, save here as narration.wav.');
  process.exit(1);
}

const client = new HiggsfieldClient({ apiKey, apiSecret });

console.log('▶ Uploading spokesperson + narration to Higgsfield CDN...');
const imgBuf = await readFile('spokesperson.png');
const audBuf = await readFile('narration.wav');
const imgUrl = await client.uploadImage(imgBuf, 'png');
const audUrl = await client.upload(audBuf, 'audio/wav');
console.log('  ✓ image:', imgUrl);
console.log('  ✓ audio:', audUrl);

console.log('▶ Generating talking head via Speak v2...');
console.log('  duration: 15s (LONG)');
console.log('  quality:  MID');
console.log('  cost:     ~15-25 credits');

const job = await client.generate('/v1/speak/higgsfield', {
  input_image: InputImage.fromUrl(imgUrl),
  input_audio: InputAudio.fromUrl(audUrl),
  prompt: 'Confident, conversational presentation. Subtle natural head movement, eye contact. Warm, friendly delivery.',
  quality: SpeakVideoQuality.MID,
  duration: SpeakDuration.LONG,
}, { withPolling: true });

if (!job.isCompleted) {
  console.error('✗ Generation failed:');
  console.error(JSON.stringify(job, null, 2));
  process.exit(1);
}

const videoUrl = job.jobs[0].results.raw.url;
console.log(`  ✓ Video URL: ${videoUrl}`);

const res = await fetch(videoUrl);
if (!res.ok) {
  console.error(`✗ Download failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
await writeFile('talking-head.mp4', Buffer.from(await res.arrayBuffer()));
console.log('  ✓ Saved talking-head.mp4');

console.log('');
console.log('All assets generated. Final steps:');
console.log('  1. npx hyperframes transcribe narration.wav');
console.log('  2. Wire video + audio into index.html (replace placeholder)');
console.log('  3. npm run check && npm run render');
