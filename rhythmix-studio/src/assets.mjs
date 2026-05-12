// Asset pack — generates the visual package that ships alongside a music
// video: album/single cover, Spotify Canvas, IG feed cover. All from the
// same theme prompt so the release-day assets are visually unified.
//
// This is the differentiator that turns RHYTHMIX from "AI music video tool"
// into "release-day asset bundle for music creators." A creator dropping a
// single doesn't just need a video — they need a cover, a Canvas, and a
// post graphic. RHYTHMIX produces all of them in one job.

import { join } from "node:path";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { replicateRun, downloadToDisk, firstUrl } from "./replicate.mjs";

// FLUX 1.1 Pro on Replicate. Highest fidelity general-purpose image model
// as of 2026-05. ~$0.04/image. Alternatives: ideogram-v2 (better text),
// recraft-v3 (vector-style); both can be swapped in here without touching
// the calling code.
const IMAGE_MODEL = "black-forest-labs/flux-1.1-pro";
const COST_USD_PER_IMAGE = 0.04;

// Three asset formats. Each one specifies aspect ratio, target dimensions,
// and a prompt suffix that pushes the image toward the right composition
// language for its surface (cover art is centered + iconic; Canvas is a
// vertical loop-friendly composition; feed cover survives the thumbnail
// crop).
export const ASSET_SPECS = {
  cover: {
    label: "Album / single cover",
    filename: "cover-square.png",
    aspectRatio: "1:1",
    promptSuffix: "album cover art, centered iconic composition, strong silhouette readable at thumbnail size, premium music release aesthetic, no text",
  },
  canvas: {
    label: "Spotify Canvas (vertical)",
    filename: "canvas-9x16.png",
    aspectRatio: "9:16",
    promptSuffix: "Spotify Canvas vertical composition, hero subject centered with breathing room top and bottom, motion-friendly framing, deep color, no text",
  },
  feedCover: {
    label: "Instagram feed cover",
    filename: "ig-feed-cover.png",
    aspectRatio: "1:1",
    promptSuffix: "Instagram feed graphic, square format, eye-catching at thumbnail size, bold composition, single focal point, no text",
  },
};

export function estimateAssetCost(formats) {
  return formats.length * COST_USD_PER_IMAGE;
}

// Validate a list of format names against ASSET_SPECS. Returns the
// canonical list or throws with the list of valid options.
export function validateFormats(formats) {
  const valid = Object.keys(ASSET_SPECS);
  const bad = formats.filter((f) => !valid.includes(f));
  if (bad.length) {
    throw new Error(
      `Unknown asset format(s): ${bad.join(", ")}. Valid: ${valid.join(", ")}`
    );
  }
  return formats;
}

// Generate one asset format. Internal — exported `generateAssetPack`
// orchestrates the multi-format pass.
async function generateOne({ theme, fmt, spec, outDir, referenceImage }) {
  const input = {
    prompt: `${theme}, ${spec.promptSuffix}`,
    aspect_ratio: spec.aspectRatio,
    output_format: "png",
    output_quality: 95,
    safety_tolerance: 2,
  };
  // FLUX 1.1 Pro accepts an image_prompt for compositional reference
  // (different from img2img — this conditions on style/subject, not pixels).
  // Lets the cover, Canvas and feed graphic share a recognizable subject.
  if (referenceImage) input.image_prompt = referenceImage;

  const output = await replicateRun({ model: IMAGE_MODEL, input });
  const url = firstUrl(output);
  return downloadToDisk(url, spec.filename, outDir);
}

// Produce the full asset pack. `formats` is an array of keys from
// ASSET_SPECS. Returns a map of fmt → { path, label, aspectRatio } for
// every successful generation.
export async function generateAssetPack({
  theme,
  outDir,
  formats = ["cover", "canvas", "feedCover"],
  referenceImage,
  onProgress,
}) {
  validateFormats(formats);
  const assetsDir = join(outDir, "assets");
  if (!existsSync(assetsDir)) await mkdir(assetsDir, { recursive: true });

  const results = {};
  for (const fmt of formats) {
    const spec = ASSET_SPECS[fmt];
    onProgress?.({ fmt, spec, status: "starting" });
    const path = await generateOne({ theme, fmt, spec, outDir: assetsDir, referenceImage });
    results[fmt] = {
      path,
      label: spec.label,
      aspectRatio: spec.aspectRatio,
    };
    onProgress?.({ fmt, spec, status: "done", path });
  }
  return results;
}
