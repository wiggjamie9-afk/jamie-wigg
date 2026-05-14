// GET /generate-status/:jobId
//
// Polls Replicate, mirrors status into generation_jobs, and on success:
//   1. downloads the audio from Replicate's CDN
//   2. uploads it to the user-audio storage bucket under {user_id}/{track_id}.mp3
//   3. inserts a tracks row owned by the caller
//
// Returns the same shape the mobile client expects from lib/generation.ts.

import { handleCors, err, json } from '../_shared/cors.ts';
import { requireUser, serviceClient } from '../_shared/supabase.ts';
import { firstOutputUrl, getPrediction } from '../_shared/replicate.ts';

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const url = new URL(req.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const jobId = parts[parts.length - 1];
  if (!jobId) return err('jobId required in path');

  let auth: Awaited<ReturnType<typeof requireUser>>;
  try {
    auth = await requireUser(req);
  } catch (r) {
    return r as Response;
  }

  const svc = serviceClient();

  const { data: job, error: jobErr } = await svc
    .from('generation_jobs')
    .select('id, user_id, external_id, status, prompt, genre, duration_sec, track_id')
    .eq('id', jobId)
    .single();
  if (jobErr || !job) return err('job not found', 404);
  if (job.user_id !== auth.user.id) return err('forbidden', 403);

  // Short-circuit if we've already resolved this job.
  if (job.status === 'succeeded' && job.track_id) {
    const track = await fetchTrack(svc, job.track_id);
    return json({ status: 'succeeded', progress: 1, track });
  }
  if (job.status === 'failed') {
    return json({ status: 'failed', error: 'generation failed' });
  }

  // Poll Replicate.
  const prediction = await getPrediction(job.external_id);
  const status = mapStatus(prediction.status);
  const progress = inferProgress(prediction);

  await svc
    .from('generation_jobs')
    .update({ status, progress, raw: prediction as unknown as Record<string, unknown> })
    .eq('id', job.id);

  if (status === 'failed') {
    await svc
      .from('generation_jobs')
      .update({ error: prediction.error ?? 'unknown' })
      .eq('id', job.id);
    return json({ status: 'failed', error: prediction.error ?? 'unknown' });
  }

  if (status !== 'succeeded') {
    return json({ status, progress });
  }

  // ── Success path: hydrate storage + tracks ──────────────────────────
  const audioUrl = firstOutputUrl(prediction);
  if (!audioUrl) return err('replicate returned no output', 502);

  const trackId = crypto.randomUUID();
  const storagePath = `${job.user_id}/${trackId}.mp3`;

  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) return err(`download failed: ${audioRes.status}`, 502);
  const audioBytes = new Uint8Array(await audioRes.arrayBuffer());

  const { error: upErr } = await svc.storage
    .from('user-audio')
    .upload(storagePath, audioBytes, {
      contentType: 'audio/mpeg',
      upsert: true,
    });
  if (upErr) return err(`storage upload: ${upErr.message}`, 500);

  const publicUrl = svc.storage.from('user-audio').getPublicUrl(storagePath).data.publicUrl;

  const { data: track, error: trackErr } = await svc
    .from('tracks')
    .insert({
      id: trackId,
      owner_id: job.user_id,
      title: deriveTitle(job.prompt),
      artist: 'You',
      audio_url: publicUrl,
      duration_sec: job.duration_sec,
      prompt: job.prompt,
      genre: job.genre,
      model: 'musicgen-stereo-large',
      job_id: job.external_id,
      status: 'ready',
      progress: 1,
    })
    .select('id, title, artist, audio_url, artwork_url, duration_sec')
    .single();
  if (trackErr) return err(`track insert: ${trackErr.message}`, 500);

  await svc
    .from('generation_jobs')
    .update({ track_id: track.id, status: 'succeeded', progress: 1 })
    .eq('id', job.id);

  return json({
    status: 'succeeded',
    progress: 1,
    track: serializeTrack(track),
  });
});

function mapStatus(s: string): 'queued' | 'running' | 'succeeded' | 'failed' {
  switch (s) {
    case 'starting':
      return 'queued';
    case 'processing':
      return 'running';
    case 'succeeded':
      return 'succeeded';
    case 'failed':
    case 'canceled':
      return 'failed';
    default:
      return 'queued';
  }
}

function inferProgress(p: { status: string; logs?: string }): number {
  if (p.status === 'succeeded') return 1;
  if (p.status === 'processing') return 0.6;
  if (p.status === 'starting') return 0.1;
  return 0;
}

function deriveTitle(prompt: string): string {
  const trimmed = prompt.trim().split('\n')[0].slice(0, 60);
  return trimmed.length ? trimmed : 'Untitled track';
}

async function fetchTrack(svc: ReturnType<typeof serviceClient>, id: string) {
  const { data } = await svc
    .from('tracks')
    .select('id, title, artist, audio_url, artwork_url, duration_sec')
    .eq('id', id)
    .single();
  return data ? serializeTrack(data) : null;
}

function serializeTrack(t: {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  artwork_url: string | null;
  duration_sec: number | null;
}) {
  return {
    id: t.id,
    title: t.title,
    artist: t.artist,
    audioUrl: t.audio_url,
    artworkUrl: t.artwork_url,
    durationSec: t.duration_sec,
  };
}
