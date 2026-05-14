import { z } from 'zod';

import { supabase } from './supabase';
import type { Track } from './audio-store';

/**
 * Talks to a server-side generation endpoint (Supabase Edge Function recommended)
 * that wraps Replicate / Suno / MusicGen — keeps your API keys off the client.
 *
 * The endpoint should accept:
 *   { prompt: string, genre?: string, durationSec?: number, seed?: number }
 * and either:
 *   (a) return { track: { id, title, artist, audioUrl, artworkUrl, durationSec } } synchronously, or
 *   (b) return { jobId: string } and we poll /generation/status/:jobId.
 *
 * Set EXPO_PUBLIC_GENERATION_URL to the endpoint base (no trailing slash).
 */

const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  audioUrl: z.string().url(),
  artworkUrl: z.string().url().optional().nullable(),
  durationSec: z.number().optional().nullable(),
});

const StartResponseSchema = z.union([
  z.object({ track: TrackSchema }),
  z.object({ jobId: z.string() }),
]);

const StatusResponseSchema = z.object({
  status: z.enum(['queued', 'running', 'succeeded', 'failed']),
  track: TrackSchema.optional(),
  error: z.string().optional(),
  progress: z.number().min(0).max(1).optional(),
});

export interface GenerateInput {
  prompt: string;
  genre?: string | null;
  durationSec?: number;
  seed?: number;
}

export interface GenerationProgress {
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  progress?: number;
  track?: Track;
  error?: string;
}

export async function generateTrack(
  input: GenerateInput,
  onProgress?: (p: GenerationProgress) => void,
): Promise<Track> {
  const base = process.env.EXPO_PUBLIC_GENERATION_URL;
  if (!base) {
    throw new Error('EXPO_PUBLIC_GENERATION_URL not set — point it at your generation API.');
  }

  const headers = await authHeaders();

  const startRes = await fetch(`${base}/generate`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!startRes.ok) throw new Error(`generation /generate ${startRes.status}`);

  const startBody = StartResponseSchema.parse(await startRes.json());

  if ('track' in startBody) {
    onProgress?.({ status: 'succeeded', progress: 1, track: toTrack(startBody.track) });
    return toTrack(startBody.track);
  }

  // Poll until done. Cap at ~5 minutes.
  const { jobId } = startBody;
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    await sleep(1500);
    const statusRes = await fetch(`${base}/generate/${jobId}`, { headers });
    if (!statusRes.ok) throw new Error(`generation /generate/:id ${statusRes.status}`);
    const status = StatusResponseSchema.parse(await statusRes.json());
    onProgress?.({
      status: status.status,
      progress: status.progress,
      track: status.track ? toTrack(status.track) : undefined,
      error: status.error,
    });
    if (status.status === 'succeeded' && status.track) return toTrack(status.track);
    if (status.status === 'failed') throw new Error(status.error ?? 'Generation failed');
  }
  throw new Error('Generation timed out after 5 minutes.');
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return {};
  return { Authorization: `Bearer ${data.session.access_token}` };
}

function toTrack(raw: z.infer<typeof TrackSchema>): Track {
  return {
    id: raw.id,
    title: raw.title,
    artist: raw.artist,
    audioUrl: raw.audioUrl,
    artworkUrl: raw.artworkUrl ?? undefined,
    durationSec: raw.durationSec ?? undefined,
  };
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
