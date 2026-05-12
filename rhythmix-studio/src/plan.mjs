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

function splitDurationIntoSections({ duration, structure }) {
  // Default arg only fires for `undefined`, not `null` — and the loudness
  // detector passes null when a track is too flat/short for structure
  // detection. Coerce both to the default template.
  const tpl = structure ?? DEFAULT_STRUCTURE;
  let cursor = 0;
  return tpl.map((item, i) => {
    const length = i === tpl.length - 1
      ? duration - cursor
      : duration * item.share;
    const section = { role: item.role, start: cursor, end: cursor + length, length };
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

// Narrative beats layered over the song's section roles. The audio
// structure tells us WHEN something happens (intro/verse/chorus); the
// narrative arc tells us WHAT'S HAPPENING at that point in the story
// (arrival, encounter, peak, doubt, departure). Together they produce
// scenes that feel like a coherent short film instead of a stack of
// disconnected vignettes — which is the #1 quality complaint about
// AI music videos. Position-aware so the same role (e.g. "chorus")
// produces a different beat early vs. late in the track.
function annotateNarrativeBeats(sections) {
  const n = sections.length;
  if (n === 0) return sections;
  return sections.map((section, i) => {
    const position = n === 1 ? 0 : i / (n - 1);
    let beat;
    if (i === 0) {
      beat = "establish the world, arrival, first light";
    } else if (i === n - 1) {
      beat = "departure, last look, fade into dusk";
    } else if (section.role === "chorus" && position < 0.55) {
      beat = "the moment everything changes, hero turns toward the camera";
    } else if (section.role === "chorus") {
      beat = "the peak, full release, hero claims the frame";
    } else if (section.role === "verse" && position < 0.4) {
      beat = "introduce the protagonist, ordinary world, observed not announced";
    } else if (section.role === "verse") {
      beat = "growth, complication, the world has shifted under them";
    } else if (section.role === "bridge") {
      beat = "doubt, slow zoom inward, the choice before the final chorus";
    } else if (section.role === "intro") {
      beat = "establish the world";
    } else if (section.role === "outro") {
      beat = "departure, resolution";
    } else {
      beat = section.role;
    }
    return { ...section, narrativeBeat: beat };
  });
}

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
  storyMode = true,
  referenceImage,
}) {
  const rawSections = splitDurationIntoSections({
    duration: audio.duration,
    structure,
  });
  // Layer the narrative arc onto the audio-detected structure.
  const sections = storyMode ? annotateNarrativeBeats(rawSections) : rawSections;
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
      // Story mode: prepend the narrative beat as a bracketed preamble so
      // the model treats it as story context, separate from the visual
      // recipe. This keeps the recipe grammar clean while still threading
      // a coherent arc across all scenes.
      let prompt = pickPrompt(section.role, theme, sceneSeed++);
      if (storyMode && section.narrativeBeat) {
        prompt = `[${section.narrativeBeat}] ${prompt}`;
      }
      const scene = {
        index: scenes.length,
        role: section.role,
        narrativeBeat: section.narrativeBeat,
        start,
        end,
        duration,
        model,
        prompt,
        aspectRatio,
        width,
        height,
      };
      // Character/face consistency: when a reference image is supplied,
      // tag every scene with it so the model can keep the subject
      // visually consistent across cuts. Kling v2 honours this natively;
      // other models ignore it gracefully.
      if (referenceImage) scene.referenceImage = referenceImage;
      scenes.push(scene);
    }
  }

  return {
    audio,
    theme,
    bpm: bpm ?? null,
    aspectRatio,
    storyMode,
    referenceImage: referenceImage ?? null,
    sections,
    scenes,
  };
}
