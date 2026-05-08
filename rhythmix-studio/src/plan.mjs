import { MODELS, pickModel } from "./models.mjs";
import { beatsFromBpm, nearestBeat } from "./audio.mjs";

// Default song-structure heuristic for tracks where the user hasn't supplied
// one. Proportions sum to 1.0 across the full track duration.
const DEFAULT_STRUCTURE = [
  { role: "intro",  share: 0.10 },
  { role: "verse",  share: 0.20 },
  { role: "chorus", share: 0.20 },
  { role: "verse",  share: 0.15 },
  { role: "chorus", share: 0.20 },
  { role: "bridge", share: 0.08 },
  { role: "outro",  share: 0.07 },
];

function splitDurationIntoSections({ duration, structure = DEFAULT_STRUCTURE }) {
  let cursor = 0;
  return structure.map((s, i) => {
    const length = i === structure.length - 1
      ? duration - cursor
      : duration * s.share;
    const section = { role: s.role, start: cursor, end: cursor + length, length };
    cursor += length;
    return section;
  });
}

function clipsForSection({ section, modelMaxSeconds }) {
  // Split a section into N clips no longer than the model's max clip length.
  const clips = [];
  const targetClipSeconds = Math.min(modelMaxSeconds, 5);
  const nClips = Math.max(1, Math.ceil(section.length / targetClipSeconds));
  const clipLength = section.length / nClips;
  for (let i = 0; i < nClips; i++) {
    clips.push({
      start: section.start + i * clipLength,
      end: section.start + (i + 1) * clipLength,
      duration: clipLength,
    });
  }
  return clips;
}

const PROMPT_RECIPES = {
  intro: [
    "Slow, atmospheric establishing shot, {theme}, anamorphic lens, golden hour, volumetric light, cinematic.",
    "Drone push-in over {theme}, dawn mist, 35mm film grain, shallow depth of field.",
  ],
  verse: [
    "Mid-shot of {theme}, handheld camera, naturalistic lighting, 35mm film aesthetic, subtle motion.",
    "Tracking shot through {theme}, neon ambience, rain-slick surfaces, Roger Deakins lighting.",
  ],
  chorus: [
    "Sweeping cinematic crane shot revealing {theme}, dramatic god rays, epic scale, IMAX feel, vivid color grade.",
    "Hero close-up amid {theme}, lens flares, particles in air, slow-motion, blockbuster cinematography.",
    "Wide aerial reveal of {theme}, dramatic clouds, rich teal-and-orange grade, cinematic.",
  ],
  bridge: [
    "Surreal dreamlike interpretation of {theme}, prismatic light, slow drift, ethereal palette, art-house.",
    "Macro abstract textures inspired by {theme}, shallow focus, color shift, dreamlike.",
  ],
  outro: [
    "Final lingering shot of {theme}, fade to silhouette, warm dusk light, slow reveal, melancholy cinematic.",
    "Pulled-back wide of {theme}, slow zoom out, soft focus, end-credits energy.",
  ],
};

function pickPrompt(role, theme, seed) {
  const recipes = PROMPT_RECIPES[role] ?? PROMPT_RECIPES.verse;
  const idx = seed % recipes.length;
  return recipes[idx].replace("{theme}", theme);
}

export function buildPlan({
  audio,
  theme,
  bpm,
  modelPreference,
  aspectRatio = "16:9",
  structure,
  width,
  height,
}) {
  const sections = splitDurationIntoSections({
    duration: audio.duration,
    structure,
  });
  const beats = beatsFromBpm({ duration: audio.duration, bpm });

  const scenes = [];
  let sceneSeed = 0;
  for (const section of sections) {
    const model = pickModel({
      preference: modelPreference,
      sceneRole: section.role,
      aspectRatio,
    });
    const m = MODELS[model];
    const clips = clipsForSection({
      section,
      modelMaxSeconds: m.maxClipSeconds,
    });
    for (const clip of clips) {
      // Snap clip boundaries to nearest beat so cuts land on the rhythm.
      const start = beats.length ? nearestBeat(beats, clip.start) : clip.start;
      const end = beats.length ? nearestBeat(beats, clip.end) : clip.end;
      const duration = Math.max(1, end - start);
      scenes.push({
        index: scenes.length,
        role: section.role,
        start,
        end,
        duration,
        model,
        prompt: pickPrompt(section.role, theme, sceneSeed++),
        aspectRatio,
        width,
        height,
      });
    }
  }

  return {
    audio,
    theme,
    bpm: bpm ?? null,
    aspectRatio,
    sections,
    scenes,
  };
}
