// Model registry. Each entry knows how to build a Replicate input payload from a
// generic Scene spec, and how to estimate cost. Costs are approximate USD as of
// 2026-05; verify on each provider's dashboard.

export const MODELS = {
  "hunyuan-video": {
    replicateId: "tencent/hunyuan-video",
    label: "Hunyuan Video (Tencent)",
    maxClipSeconds: 5,
    bestFor: ["motion", "stylized", "fast"],
    estimatedUsdPerClip: 0.85,
    buildInput: (scene) => ({
      prompt: scene.prompt,
      width: scene.width ?? 1280,
      height: scene.height ?? 720,
      video_length: 129,
      infer_steps: 50,
    }),
  },

  "kling-v2": {
    replicateId: "kwaivgi/kling-v2.0",
    label: "Kling v2 (Kuaishou)",
    maxClipSeconds: 10,
    bestFor: ["cinematic", "realistic", "long-form"],
    estimatedUsdPerClip: 1.40,
    buildInput: (scene) => {
      const input = {
        prompt: scene.prompt,
        duration: Math.min(scene.duration ?? 5, 10),
        aspect_ratio: scene.aspectRatio ?? "16:9",
        cfg_scale: 0.5,
      };
      // Reference image → image-to-video mode on Kling for character/face
      // consistency across scenes. Solves the #1 AI-video pain point: the
      // hero looks like a different person every cut.
      if (scene.referenceImage) input.start_image = scene.referenceImage;
      return input;
    },
  },

  "luma-ray": {
    replicateId: "luma/ray",
    label: "Luma Ray",
    maxClipSeconds: 5,
    bestFor: ["smooth-camera", "dreamy", "transitions"],
    estimatedUsdPerClip: 0.95,
    buildInput: (scene) => ({
      prompt: scene.prompt,
      aspect_ratio: scene.aspectRatio ?? "16:9",
      loop: false,
    }),
  },

  "minimax-video": {
    replicateId: "minimax/video-01",
    label: "MiniMax Hailuo",
    maxClipSeconds: 6,
    bestFor: ["character", "expressive", "fast"],
    estimatedUsdPerClip: 0.50,
    buildInput: (scene) => ({
      prompt: scene.prompt,
      prompt_optimizer: true,
    }),
  },
};

export function pickModel({ preference, sceneRole, aspectRatio }) {
  if (preference && MODELS[preference]) return preference;
  // Heuristic routing: chorus -> cinematic; verse -> motion; bridge -> dreamy.
  if (sceneRole === "chorus") return "kling-v2";
  if (sceneRole === "bridge") return "luma-ray";
  if (sceneRole === "verse") return "hunyuan-video";
  if (sceneRole === "outro") return "luma-ray";
  if (sceneRole === "intro") return "kling-v2";
  return "hunyuan-video";
}

export function estimateCost(plan) {
  return plan.scenes.reduce((sum, s) => {
    const m = MODELS[s.model];
    return sum + (m?.estimatedUsdPerClip ?? 1);
  }, 0);
}
