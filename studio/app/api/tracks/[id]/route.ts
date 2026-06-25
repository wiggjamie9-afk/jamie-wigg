/**
 * GET /api/tracks/:id — Fetch track detail
 * PATCH /api/tracks/:id — Update track metadata
 * DELETE /api/tracks/:id — Soft delete (set published=false)
 * GET /api/tracks/:id/analyze — Trigger BPM/key/loudness analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

const UpdateTrackSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  artist: z.string().max(200).optional(),
  genre: z.string().max(100).optional(),
  bpm: z.number().int().positive().optional(),
  key: z.string().optional(),
});

type UpdateTrackRequest = z.infer<typeof UpdateTrackSchema>;

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/tracks/:id
 * Fetch track detail
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `GET /api/tracks/${id}`);

  try {
    // TODO: Fetch track from Supabase by id
    // TODO: Verify creator ownership (or public track)
    // TODO: Handle not found (404)

    const track = {
      id,
      creator_id: 'user-123',
      title: 'Example Track',
      artist: 'Example Artist',
      genre: 'Electronic',
      bpm: 128,
      key: 'D Major',
      duration_seconds: 240,
      loudness_lufs: -12.5,
      audio_url: 'https://s3.example.com/tracks/track-1/audio.mp3',
      analysis_status: 'completed',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    logRequest(requestId, `GET /api/tracks/${id}`, 'success');

    return NextResponse.json(track, { status: 200 });
  } catch (error) {
    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tracks/:id
 * Update track metadata (auth-gated: only creator can update)
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `PATCH /api/tracks/${id}`);

  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    let userId: string;

    try {
      userId = verifyJWT(token);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // TODO: Fetch track from DB to verify ownership
    // TODO: Return 403 if user is not the creator

    // Parse and validate request body
    const body = await req.json();
    const validatedData: UpdateTrackRequest = UpdateTrackSchema.parse(body);

    // TODO: Update in Supabase tracks table

    const updatedTrack = {
      id,
      creator_id: userId,
      title: validatedData.title || 'Example Track',
      artist: validatedData.artist || 'Example Artist',
      genre: validatedData.genre || 'Electronic',
      bpm: validatedData.bpm || 128,
      key: validatedData.key || 'D Major',
      duration_seconds: 240,
      loudness_lufs: -12.5,
      audio_url: 'https://s3.example.com/tracks/track-1/audio.mp3',
      analysis_status: 'completed',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    logRequest(requestId, `PATCH /api/tracks/${id}`, 'success');

    return NextResponse.json(updatedTrack, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError(requestId, 'Validation error', error);
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }

    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tracks/:id
 * Soft delete (set published=false, keep data)
 */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `DELETE /api/tracks/${id}`);

  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    let userId: string;

    try {
      userId = verifyJWT(token);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // TODO: Fetch track from DB to verify ownership
    // TODO: Return 403 if user is not the creator
    // TODO: Soft delete: set published=false, set deleted_at timestamp

    logRequest(requestId, `DELETE /api/tracks/${id}`, 'success');

    return NextResponse.json(
      { message: 'Track deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
