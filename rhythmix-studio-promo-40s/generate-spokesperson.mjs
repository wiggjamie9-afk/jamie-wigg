// Generate the RHYTHMIX spokesperson reference image via Higgsfield Soul.
// Usage:
//   export HF_API_KEY="your_key_id"
//   export HF_SECRET="your_secret"
//   node generate-spokesperson.mjs
//
// Output: spokesperson.png (1536x2048, photoreal portrait)
// Cost: ~1-5 credits

import { HiggsfieldClient } from '@higgsfield/client';
import { SoulQuality, SoulSize, BatchSize, seed } from '@higgsfield/client/helpers';
import { writeFile } from 'node:fs/promises';

const apiKey = process.env.HF_API_KEY;
const apiSecret = process.env.HF_SECRET;

if (!apiKey || !apiSecret) {
  console.error('✗ Missing HF_API_KEY or HF_SECRET env vars.');
  console.error('  Get them from your Higgsfield account, then:');
  console.error('    export HF_API_KEY="your_key_id"');
  console.error('    export HF_SECRET="your_secret"');
  process.exit(1);
}

const SOUL_PROMPT = `Photorealistic medium close-up portrait of a 32-year-old man, chest-up, looking directly into camera with friendly confident expression, slight smile. Wearing a fitted dark charcoal crewneck sweatshirt. Short dark hair, light stubble, warm brown eyes. Sitting in a softly lit home studio at night — warm amber lamp glow from frame-left, framed abstract painting blurred in background, shallow depth of field, subtle rim light separating subject from background. Sharp focus on face, natural skin texture, 50mm look, shot on full-frame DSLR. Vertical 9:16 framing. Cinematic warm color grade. No text, no watermark, no logo.`;

const client = new HiggsfieldClient({ apiKey, apiSecret });

console.log('▶ Generating spokesperson via Soul...');
console.log('  prompt: photoreal 32yr man, dark crewneck, warm home studio');
console.log('  size:   PORTRAIT_1536x2048 (9:16-ish)');
console.log('  cost:   ~1-5 credits');

const job = await client.generate('/v1/text2image/soul', {
  prompt: SOUL_PROMPT,
  width_and_height: SoulSize.PORTRAIT_1536x2048,
  quality: SoulQuality.HD,
  batch_size: BatchSize.SINGLE,
  seed: seed(42),
}, { withPolling: true });

if (!job.isCompleted) {
  console.error('✗ Generation failed:');
  console.error(JSON.stringify(job, null, 2));
  process.exit(1);
}

const url = job.jobs[0].results.raw.url;
console.log(`  ✓ Image URL: ${url}`);

const res = await fetch(url);
if (!res.ok) {
  console.error(`✗ Download failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
await writeFile('spokesperson.png', Buffer.from(await res.arrayBuffer()));
console.log('  ✓ Saved spokesperson.png');

console.log('');
console.log('Next:');
console.log('  1. Eyeball spokesperson.png — happy with the face?');
console.log('     If not, change the seed in this script and re-run.');
console.log('  2. Record narration.wav (~15s, reads script-15s.txt) on');
console.log('     iPhone Voice Memos. Export as WAV.');
console.log('  3. Run: node generate-talking-head.mjs');
