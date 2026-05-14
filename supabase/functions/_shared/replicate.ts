// Thin Replicate REST API wrapper for the music-generation pipeline.
// Uses the prediction API so we can poll status and stream progress back to the client.

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
const REPLICATE_API = 'https://api.replicate.com/v1';

// MusicGen Stereo Large (Meta) — high-quality music generation up to 30s per call.
// Override via env if you want to swap models.
const DEFAULT_MODEL =
  Deno.env.get('REPLICATE_MUSIC_MODEL') ??
  'meta/musicgen:7be0f12c54a8d033a0fbd14418c9af98962da9a86f5ff7811f9b3423a1f0b7d7';

export interface CreatePredictionInput {
  prompt: string;
  durationSec?: number;
  seed?: number;
  modelVersion?: string;
}

export interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[] | null;
  error?: string | null;
  logs?: string;
  metrics?: { predict_time?: number };
}

function token() {
  if (!REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN env var is not set in this function.');
  }
  return REPLICATE_API_TOKEN;
}

export async function createPrediction(input: CreatePredictionInput): Promise<ReplicatePrediction> {
  const version = (input.modelVersion ?? DEFAULT_MODEL).split(':')[1];
  if (!version) throw new Error(`Bad model spec: ${input.modelVersion ?? DEFAULT_MODEL}`);

  const res = await fetch(`${REPLICATE_API}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version,
      input: {
        prompt: input.prompt,
        duration: input.durationSec ?? 30,
        model_version: 'stereo-large',
        output_format: 'mp3',
        normalization_strategy: 'peak',
        ...(typeof input.seed === 'number' ? { seed: input.seed } : {}),
      },
    }),
  });
  if (!res.ok) throw new Error(`Replicate /predictions ${res.status}: ${await res.text()}`);
  return (await res.json()) as ReplicatePrediction;
}

export async function getPrediction(id: string): Promise<ReplicatePrediction> {
  const res = await fetch(`${REPLICATE_API}/predictions/${id}`, {
    headers: { Authorization: `Token ${token()}` },
  });
  if (!res.ok) throw new Error(`Replicate /predictions/${id} ${res.status}`);
  return (await res.json()) as ReplicatePrediction;
}

/** Replicate may return a single URL or an array; collapse to first audio URL. */
export function firstOutputUrl(p: ReplicatePrediction): string | null {
  if (!p.output) return null;
  if (Array.isArray(p.output)) return p.output[0] ?? null;
  return p.output;
}
