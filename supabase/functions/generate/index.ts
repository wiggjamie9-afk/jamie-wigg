// POST /generate
//
// Body: { prompt: string, genre?: string, durationSec?: number, seed?: number }
//
// Creates a Replicate prediction, records a generation_jobs row, returns { jobId }.
// The client then polls /generate-status/:jobId until status === "succeeded".

import { handleCors, err, json } from '../_shared/cors.ts';
import { requireUser, serviceClient } from '../_shared/supabase.ts';
import { createPrediction } from '../_shared/replicate.ts';

interface Body {
  prompt: string;
  genre?: string;
  durationSec?: number;
  seed?: number;
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;
  if (req.method !== 'POST') return err('method not allowed', 405);

  let auth: Awaited<ReturnType<typeof requireUser>>;
  try {
    auth = await requireUser(req);
  } catch (r) {
    return r as Response;
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return err('invalid json body');
  }
  if (!body.prompt || typeof body.prompt !== 'string') return err('prompt is required');
  if (body.prompt.length > 500) return err('prompt too long (max 500 chars)');

  const durationSec = clamp(body.durationSec ?? 30, 5, 60);

  let prediction;
  try {
    prediction = await createPrediction({
      prompt: combinePrompt(body.prompt, body.genre),
      durationSec,
      seed: body.seed,
    });
  } catch (e) {
    return err(`replicate: ${e instanceof Error ? e.message : String(e)}`, 502);
  }

  // Record the job under the caller (service client bypasses RLS to insert reliably).
  const svc = serviceClient();
  const { data: job, error } = await svc
    .from('generation_jobs')
    .insert({
      user_id: auth.user.id,
      external_id: prediction.id,
      prompt: body.prompt,
      genre: body.genre ?? null,
      duration_sec: durationSec,
      status: 'queued',
      raw: prediction as unknown as Record<string, unknown>,
    })
    .select('id')
    .single();
  if (error) return err(`db: ${error.message}`, 500);

  return json({
    jobId: job.id,
    externalId: prediction.id,
    status: 'queued',
  });
});

function combinePrompt(prompt: string, genre?: string) {
  if (!genre) return prompt;
  return `${genre.toLowerCase()} — ${prompt}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
