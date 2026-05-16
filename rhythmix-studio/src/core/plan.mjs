// Plan builder — turns a probed audio object + theme into a sequence of
// scenes (per-clip prompts + model + start/end). Platform-agnostic: no Node
// imports. The pure beat helpers (beatsFromBpm / nearestBeat) are inlined
// here so this module never needs to reach into `audio.mjs`, which is a
// Node-only host module (uses child_process to call ffmpeg/ffprobe).

import { MODELS, pickModel } from "./models.mjs";

// ---------- Pure beat helpers (mirrors of audio.mjs) ----------

export function beatsFromBpm({ duration, bpm, downbeatsPerBar = 4 }) {
  if (!bpm || bpm <= 0) return [];
  const secondsPerBeat = 60 / bpm;
  const beats = [];
  for (let t = 0; t < duration; t += secondsPerBeat) {
    beats.push({
      t,
      isDownbeat: beats.length % downbeatsPerBar === 0,
    });
  }
  return beats;
}

export function nearestBeat(beats, t) {
  if (!beats.length) return t;
  let best = beats[0];
  let bestDiff = Math.abs(beats[0].t - t);
  for (const b of beats) {
    const diff = Math.abs(b.t - t);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = b;
    }
  }
  return best.t;
}

// ---------- Plan builder ----------

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
    "Slow atmospheric establishing shot of {theme}, anamorphic lens, golden hour, volumetric light, cinematic.",
    "Drone push-in over {theme}, dawn mist, 35mm film grain, shallow depth of field.",
    "Opening wide of {theme} at first light, lens flare, soft particulates, peaceful.",
    "Static held shot of {theme} pre-dawn, indigo sky, gentle camera drift, atmospheric.",
    "Long lens telephoto of {theme}, heat shimmer, distant figure, mysterious.",
  ],
  verse: [
    "Mid-shot of {theme}, handheld camera, naturalistic lighting, 35mm film aesthetic, subtle motion.",
    "Tracking shot through {theme}, neon ambience, rain-slick surfaces, Roger Deakins lighting.",
    "Over-the-shoulder POV through {theme}, organic camera shake, available light, intimate.",
    "Side-tracking dolly past {theme}, soft window light, dust motes, observational.",
    "Locked-off mid-shot of {theme}, slight push-in, naturalistic palette, film grain.",
    "Walking handheld through {theme}, sodium streetlight glow, candid feel.",
  ],
  chorus: [
    "Sweeping cinematic crane shot revealing {theme}, dramatic god rays, epic scale, IMAX feel, vivid color grade.",
    "Hero close-up amid {theme}, lens flares, particles in air, slow-motion, blockbuster cinematography.",
    "Wide aerial reveal of {theme}, dramatic clouds, rich teal-and-orange grade, cinematic.",
    "Tracking-back hero shot through {theme}, kicked-up debris, anamorphic flares, action-film energy.",
    "Overhead spinning top-down of {theme}, kaleidoscopic symmetry, saturated color, music-video grammar.",
    "Whip-pan into a hero pose in {theme}, motion blur, decisive light, big-screen confidence.",
    "Slow-mo low-angle through {theme}, lens flare across frame, hero silhouette, anthemic.",
  ],
  bridge: [
    "Surreal dreamlike interpretation of {theme}, prismatic light, slow drift, ethereal palette, art-house.",
    "Macro abstract textures inspired by {theme}, shallow focus, color shift, dreamlike.",
    "Upside-down reflective shot of {theme}, water-mirror surface, suspended time, melancholic.",
    "Slow-zoom on a single detail of {theme}, soft focus pulled across plane, contemplative.",
  ],
  outro: [
    "Final lingering shot of {theme}, fade to silhouette, warm dusk light, slow reveal, melancholy cinematic.",
    "Pulled-back wide of {theme}, slow zoom out, soft focus, end-credits energy.",
    "Static long-hold of {theme} at twilight, gentle ambient motion, reflective.",
    "Quiet aerial pull-up away from {theme}, dusk colors, fade-out cadence.",
  ],
};

// Deterministic shuffle so re-running the same plan gives the same scenes,
// but consecutive scenes in the same section don't repeat the same prompt.
function shuffleSeeded(list, seed) {
  const out = [...list];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildPromptPicker() {
  const queues = {};
  return function pick(role, theme, sceneSeed) {
    const recipes = PROMPT_RECIPES[role] ?? PROMPT_RECIPES.verse;
    if (!queues[role] || !queues[role].length) {
      queues[role] = shuffleSeeded(recipes, sceneSeed + role.length);
    }
    const tpl = queues[role].shift();
    return tpl.replace("{theme}", theme);
  };
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
  const pickPrompt = buildPromptPicker();
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
