#!/usr/bin/env node
/**
 * Generate 50 photoreal buddy portraits via Higgsfield Soul.
 *
 * Runs in CI (GitHub Actions) where outbound network is allowed.
 * Writes apps/portraits/buddy-<id>.jpg for each buddy. The carousel
 * (apps/buddies.html) auto-upgrades each card to the photo when present.
 *
 * Env:
 *   HIGGSFIELD_API_KEY   (required)
 *   HIGGSFIELD_SECRET    (required)
 *   FORCE=1              regenerate even if a portrait already exists
 *
 * Usage:  node scripts/generate-portraits.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'apps', 'portraits');

const API_KEY = process.env.HIGGSFIELD_API_KEY;
const SECRET = process.env.HIGGSFIELD_SECRET;
const FORCE = process.env.FORCE === '1';
// Higgsfield platform REST API (matches the official @higgsfield/client SDK).
const API_BASE = 'https://platform.higgsfield.ai';
const SOUL_ENDPOINT = `${API_BASE}/v1/text2image/soul`;

if (!API_KEY || !SECRET) {
  console.error('✗ Missing HIGGSFIELD_API_KEY / HIGGSFIELD_SECRET. Set them as GitHub secrets.');
  process.exit(1);
}

// Shared style so all 50 feel like one cohesive set.
const STYLE =
  'photorealistic studio headshot portrait, warm soft three-point lighting, ' +
  'gentle genuine smile, looking slightly off-camera, shallow depth of field, ' +
  'clean softly-blurred background, natural skin texture, 85mm lens, high detail, ' +
  'kind and approachable, no text, no watermark, no logo';

// Per-buddy subject (kept diverse in age/gender/ethnicity, matched to the role).
const BUDDIES = [
  { id: 1,  subject: 'a friendly approachable young adult, casual warm sweater' },
  { id: 2,  subject: 'a calm serene woman in her 30s, soft neutral tones, peaceful expression' },
  { id: 3,  subject: 'a gentle compassionate man in his 40s, soft eyes, reassuring presence' },
  { id: 4,  subject: 'a soothing woman with a tranquil expression, dim warm evening light' },
  { id: 5,  subject: 'a kind older woman with empathetic eyes, tender expression' },
  { id: 6,  subject: 'a warm grandfatherly man in his 70s, silver hair, gentle smile' },
  { id: 7,  subject: 'a warm parent in their late 30s, nurturing friendly expression' },
  { id: 8,  subject: 'a friendly relatable mentor in their mid 20s, upbeat expression' },
  { id: 9,  subject: 'a hopeful resilient person in their 30s, steady grounded gaze' },
  { id: 10, subject: 'a sharp encouraging career adviser in business-casual attire' },
  { id: 11, subject: 'a confident professional coach in their 40s, smart blazer' },
  { id: 12, subject: 'a bright encouraging study mentor, books softly blurred behind' },
  { id: 13, subject: 'a creative artistic person with expressive friendly eyes' },
  { id: 14, subject: 'an energetic startup mentor, modern smart-casual look' },
  { id: 15, subject: 'an athletic upbeat fitness coach, healthy glow, activewear' },
  { id: 16, subject: 'a fresh wholesome nutrition coach, bright natural light' },
  { id: 17, subject: 'an adventurous friendly travel companion, sun-kissed look' },
  { id: 18, subject: 'a trustworthy financial coach in their 40s, calm confident' },
  { id: 19, subject: 'a relaxed creative hobbyist with a warm easygoing smile' },
  { id: 20, subject: 'a motivating life coach with a focused encouraging expression' },
  { id: 21, subject: 'a protective reassuring mentor with a kind strong presence' },
  { id: 22, subject: 'a bright energetic young adult, lively engaged expression' },
  { id: 23, subject: 'a calm understanding person with a gentle accepting expression' },
  { id: 24, subject: 'a compassionate person in their 40s with a soft patient smile' },
  { id: 25, subject: 'a steady hopeful person radiating quiet strength' },
  { id: 26, subject: 'a warm affirming person with a joyful inclusive smile' },
  { id: 27, subject: 'a confident person in a wheelchair, bright welcoming smile' },
  { id: 28, subject: 'a reassuring confident person with a grounded warm expression' },
  { id: 29, subject: 'a charming warm dating coach with a friendly confident smile' },
  { id: 30, subject: 'a gentle romantic young adult with a soft hopeful expression' },
  { id: 31, subject: 'a compassionate person with healing kind eyes, soft light' },
  { id: 32, subject: 'a warm person holding a phone, tender longing-but-hopeful look' },
  { id: 33, subject: 'a reassuring friendly person, approachable open expression' },
  { id: 34, subject: 'an upbeat newcomer with an optimistic curious expression' },
  { id: 35, subject: 'a friendly approachable colleague in smart-casual office wear' },
  { id: 36, subject: 'a sociable cheerful person with an inviting lively smile' },
  { id: 37, subject: 'an independent confident solo traveler, warm adventurous look' },
  { id: 38, subject: 'a self-assured serene person radiating calm self-acceptance' },
  { id: 39, subject: 'a calm recovering professional, relieved peaceful expression' },
  { id: 40, subject: 'a composed executive in their 40s, sharp suit, steady calm gaze' },
  { id: 41, subject: 'a balanced grounded professional with a serene confident smile' },
  { id: 42, subject: 'a restful person with a calm sleepy-soft soothing expression' },
  { id: 43, subject: 'a healthy revitalised person with a strong refreshed look' },
  { id: 44, subject: 'a focused composed professional, minimalist modern background' },
  { id: 45, subject: 'a polished high-performing executive with a confident warm smile' },
  { id: 46, subject: 'a friendly remote worker at a bright home desk, warm smile' },
  { id: 47, subject: 'a fresh wholesome wellness coach with a bright healthy glow' },
  { id: 48, subject: 'a serene meditation guide with a peaceful centered expression' },
  { id: 49, subject: 'an energetic encouraging coach in activewear, motivating smile' },
  { id: 50, subject: 'a steady resilient first-responder type with a calm strong gaze' },
];

function authHeaders() {
  return {
    // Higgsfield platform auth: "Key <api-key-id>:<api-key-secret>".
    'Authorization': `Key ${API_KEY}:${SECRET}`,
    'Content-Type': 'application/json',
  };
}

// Pull the finished image URL out of a job-set's jobs array (raw = full-res PNG).
function pickImageUrl(jobs) {
  if (!Array.isArray(jobs)) return null;
  for (const job of jobs) {
    if (job?.status === 'completed' && job?.results?.raw?.url) return job.results.raw.url;
  }
  return null;
}

async function requestImageUrl(prompt) {
  // POST /v1/text2image/soul → returns a job-set { id, jobs: [...] }.
  const res = await fetch(SOUL_ENDPOINT, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      params: {
        prompt,
        width_and_height: '1536x1536', // square, matches the carousel card
        quality: '1080p',
        batch_size: 1,
        enhance_prompt: true,
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Higgsfield ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 160)}`);
  }
  const data = await res.json();

  // Occasionally a job is already done in the initial response.
  const immediate = pickImageUrl(data?.jobs);
  if (immediate) return immediate;

  const jobSetId = data?.id;
  if (!jobSetId) throw new Error(`No job-set id in response: ${JSON.stringify(data).slice(0, 160)}`);
  return pollJobSet(jobSetId);
}

async function pollJobSet(jobSetId, attempts = 40, delayMs = 3000) {
  const statusUrl = `${API_BASE}/v1/job-sets/${jobSetId}`;
  for (let i = 0; i < attempts; i++) {
    await sleep(delayMs);
    const res = await fetch(statusUrl, { headers: authHeaders() });
    if (!res.ok) continue;
    const data = await res.json();
    const jobs = data?.jobs ?? [];
    const url = pickImageUrl(jobs);
    if (url) return url;
    const bad = jobs.find((j) => ['failed', 'nsfw', 'canceled'].includes(j?.status));
    if (bad) throw new Error(`Job ${jobSetId} ${bad.status}`);
  }
  throw new Error(`Job ${jobSetId} timed out`);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0, skip = 0, fail = 0;

  for (const b of BUDDIES) {
    const dest = path.join(OUT_DIR, `buddy-${b.id}.jpg`);
    if (!FORCE && fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
      console.log(`• buddy-${b.id}: exists, skipping`);
      skip++;
      continue;
    }
    const prompt = `${b.subject}, ${STYLE}`;
    try {
      const url = await requestImageUrl(prompt);
      const bytes = await download(url, dest);
      console.log(`✓ buddy-${b.id}: ${(bytes / 1024).toFixed(0)} KB`);
      ok++;
    } catch (err) {
      console.error(`✗ buddy-${b.id}: ${err.message}`);
      fail++;
    }
    await sleep(1200); // gentle pacing
  }

  console.log(`\nDone. generated=${ok} skipped=${skip} failed=${fail}`);
  if (ok === 0 && skip === 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
