/**
 * POST /api/tracks — Upload track (multipart form: file + metadata)
 * GET /api/tracks — List creator's tracks
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

const CreateTrackSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().max(200).optional(),
  genre: z.string().max(100).optional(),
  bpm: z.number().int().positive().optional(),
  key: z.string().optional(),
});

type CreateTrackRequest = z.infer<typeof CreateTrackSchema>;

/**
 * POST /api/tracks
 * Upload track with metadata
 * Expects multipart/form-data with file + metadata fields
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logRequest(requestId, 'POST /api/tracks');

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

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only .mp3 and .wav files are allowed' },
        { status: 400 }
      );
    }

    const maxFileSize = 500 * 1024 * 1024; // 500 MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'File size exceeds 500 MB limit' },
        { status: 400 }
      );
    }

    // Extract metadata from form fields
    const metadata = {
      title: formData.get('title') as string,
      artist: formData.get('artist') as string | null,
      genre: formData.get('genre') as string | null,
      bpm: formData.get('bpm') ? parseInt(formData.get('bpm') as string) : null,
      key: formData.get('key') as string | null,
    };

    const validatedMetadata: CreateTrackRequest = CreateTrackSchema.parse(metadata);

    // TODO: Upload file to S3 with presigned URL
    // TODO: Trigger ClamAV virus scan
    // TODO: Check Acoustid for duplicates
    // TODO: Insert into tracks table (Supabase)
    // TODO: Trigger BPM/key/loudness analysis job

    const trackId = crypto.randomUUID();
    const s3Url = `https://s3.example.com/tracks/${trackId}/${file.name}`;

    logRequest(requestId, 'POST /api/tracks', 'success', { trackId, fileName: file.name });

    return NextResponse.json(
      {
        id: trackId,
        creator_id: userId,
        title: validatedMetadata.title,
        artist: validatedMetadata.artist || null,
        genre: validatedMetadata.genre || null,
        bpm: validatedMetadata.bpm || null,
        key: validatedMetadata.key || null,
        duration_seconds: null,
        loudness_lufs: null,
        audio_url: s3Url,
        analysis_status: 'pending',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError(requestId, 'Validation error', error);
      return NextResponse.json(
        { error: 'Invalid metadata', details: error.errors },
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
 * GET /api/tracks
 * List creator's tracks (paginated)
 * Query params: ?limit=50&offset=0 or ?limit=50&cursor=<id>
 */
export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logRequest(requestId, 'GET /api/tracks');

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

    // Parse pagination params
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const cursor = url.searchParams.get('cursor');

    // TODO: Query tracks from Supabase for this creator
    // TODO: Filter by published=true or published=false (based on param)
    // TODO: Use cursor-based pagination

    const tracks = [
      {
        id: 'track-1',
        creator_id: userId,
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
      },
    ];

    logRequest(requestId, 'GET /api/tracks', 'success', { count: tracks.length });

    return NextResponse.json(
      {
        data: tracks,
        pagination: {
          limit,
          offset,
          total: 1,
        },
      },
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
