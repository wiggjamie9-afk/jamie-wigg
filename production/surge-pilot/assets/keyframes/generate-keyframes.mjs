#!/usr/bin/env node

/**
 * SURGE Pilot - Act 1 Keyframe Generation Script
 *
 * Generates 4 production-ready keyframe images for HyperFrames animation composition.
 * Uses FLUX 1.1 Pro via Replicate API.
 *
 * Usage:
 *   node generate-keyframes.mjs
 *
 * Environment:
 *   REPLICATE_API_TOKEN - required (get from https://replicate.com/account/api-tokens)
 */

import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";

const API_KEY = process.env.REPLICATE_API_TOKEN;
if (!API_KEY) {
  console.error("ERROR: REPLICATE_API_TOKEN not set");
  console.error(
    "Get a token from https://replicate.com/account/api-tokens and set:"
  );
  console.error("  export REPLICATE_API_TOKEN=r8_...");
  process.exit(1);
}

const REPLICATE_API = "https://api.replicate.com/v1";
const OUTPUT_DIR = new URL(".", import.meta.url).pathname;
const MODEL = "black-forest-labs/flux-1.1-pro";
const ASPECT_RATIO = "16:9";
const SIZE = "1920x1080";

const KEYFRAMES = [
  {
    shot: 1,
    name: "Classroom Establishing",
    filename: "shot-01-classroom-establishing.png",
    prompt:
      "Flat 2D animation style illustration of a bright elementary school classroom, morning light streaming from windows, fluorescent ceiling lights, empty desks arranged in rows, one teacher's desk at the front with papers, colorful bulletin boards on walls, teacher figure at front preparing lesson materials. Cool color palette: light gray walls, soft electric blue accents, muted sage green furniture. Simple geometric shapes with bold black outlines, no shading or gradients. Style: Craig of the Creek meets Infinity Train. 1920x1080 landscape.",
  },
  {
    shot: 3,
    name: "Ziggy at Desk",
    filename: "shot-03-ziggy-desk.png",
    prompt:
      "Flat 2D animation close-up of a 10-year-old boy named Ziggy: round circle head, messy asymmetrical dark hair, bright electric blue eyes (#0052CC) wide and animated, wearing electric blue hoodie, sitting at school desk. One sock up, one sock down. Pencil in hand. Expression shows nervous energy and anxiety. Subtle jittery tremor lines around him. Bold outlines, geometric shapes, simple flat colors. Style: Craig of the Creek. 1920x1080 landscape.",
  },
  {
    shot: 4,
    name: "Sensory Montage - Fluorescent Hum",
    filename: "shot-04a-sensory-hum.png",
    prompt:
      "Flat 2D animation close-up ceiling view with fluorescent light fixtures. Extremely bright white-blue light. Suggest shimmer and hum with wavy distortion lines and radiating light ripples around fixtures. Minimal detail, geometric shapes, bold outlines. Cool desaturated palette: pale gray, cool white, pale blue. Shimmer feels overwhelming and invasive. 1920x1080 landscape.",
  },
  {
    shot: 15,
    name: "Shame Moment - Face Close-up",
    filename: "shot-15-shame-moment.png",
    prompt:
      "Flat 2D animation extreme close-up of Ziggy's face showing shame and dissociation. Round head, dark asymmetrical hair, eyes downcast with constricted pupils, mouth slightly open (embarrassed), frozen/numb expression. Surrounded by deep burgundy color wash (#5D1E3B) suggesting emotional shutdown. Background very desaturated/grayscale with burgundy overlay. Convey freeze response, dissociation, shame. Heavy bold outlines. 1920x1080 landscape.",
  },
];

/**
 * Poll Replicate API for prediction result
 */
async function pollPrediction(predictionId, maxAttempts = 60) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const resp = await fetch(`${REPLICATE_API}/predictions/${predictionId}`, {
      headers: { Authorization: `Token ${API_KEY}` },
    });

    if (!resp.ok) {
      throw new Error(
        `API error: ${resp.status} ${resp.statusText} (${await resp.text()})`
      );
    }

    const pred = await resp.json();

    if (pred.status === "succeeded") {
      return pred.output[0];
    } else if (pred.status === "failed") {
      throw new Error(
        `Prediction failed: ${pred.error || "Unknown error"}`
      );
    } else if (pred.status === "canceled") {
      throw new Error("Prediction was canceled");
    }

    console.log(`  [${attempts + 1}/${maxAttempts}] Status: ${pred.status}...`);
    await new Promise((r) => setTimeout(r, 5000)); // Poll every 5s
    attempts++;
  }

  throw new Error("Prediction polling timeout");
}

/**
 * Generate a single keyframe image
 */
async function generateKeyframe(kf) {
  console.log(`\n[Shot ${kf.shot}] ${kf.name}`);
  console.log(`  Prompt: ${kf.prompt.substring(0, 80)}...`);
  console.log(`  Model: ${MODEL}`);

  // Create prediction
  const createResp = await fetch(`${REPLICATE_API}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version:
        "4d0b5ea6d4c811f03af11b9f4c0537b0e1d8aca6f19c67a07c54f5f1e19e04d",
      input: {
        prompt: kf.prompt,
        aspect_ratio: ASPECT_RATIO,
        output_format: "png",
        num_outputs: 1,
        num_inference_steps: 50,
        guidance_scale: 3.5,
      },
    }),
  });

  if (!createResp.ok) {
    throw new Error(
      `Failed to create prediction: ${createResp.status} ${await createResp.text()}`
    );
  }

  const pred = await createResp.json();
  console.log(`  Prediction ID: ${pred.id}`);
  console.log(`  Status: ${pred.status}`);

  // Poll for completion
  const imageUrl = await pollPrediction(pred.id);
  console.log(`  ✓ Completed`);
  console.log(`  Output URL: ${imageUrl}`);

  // Download image
  const imgResp = await fetch(imageUrl);
  if (!imgResp.ok) {
    throw new Error(
      `Failed to download image: ${imgResp.status} ${imgResp.statusText}`
    );
  }

  const buffer = await imgResp.buffer();
  const filepath = path.join(OUTPUT_DIR, kf.filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`  ✓ Saved: ${filepath}`);

  return {
    shot: kf.shot,
    name: kf.name,
    filename: kf.filename,
    url: imageUrl,
    size: buffer.length,
    generated_at: new Date().toISOString(),
  };
}

/**
 * Main execution
 */
async function main() {
  console.log("SURGE Pilot - Act 1 Keyframe Generation");
  console.log("=====================================");
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Total frames: ${KEYFRAMES.length}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Resolution: ${SIZE}`);
  console.log("");

  const results = [];
  const startTime = Date.now();

  for (const kf of KEYFRAMES) {
    try {
      const result = await generateKeyframe(kf);
      results.push(result);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      results.push({
        shot: kf.shot,
        name: kf.name,
        filename: kf.filename,
        error: err.message,
      });
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  // Write summary
  const summary = {
    project: "SURGE Pilot",
    act: 1,
    generated_at: new Date().toISOString(),
    elapsed_minutes: parseFloat(elapsed),
    model: MODEL,
    resolution: SIZE,
    total_keyframes: KEYFRAMES.length,
    successful: results.filter((r) => !r.error).length,
    failed: results.filter((r) => r.error).length,
    results,
  };

  const summaryPath = path.join(OUTPUT_DIR, "generation-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n✓ Summary written to: ${summaryPath}`);

  // Print final summary
  console.log("\n=====================================");
  console.log(`Total time: ${elapsed} minutes`);
  console.log(`Successful: ${summary.successful}/${KEYFRAMES.length}`);
  if (summary.failed > 0) {
    console.log(`Failed: ${summary.failed}`);
  }
  console.log("");

  process.exit(summary.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
