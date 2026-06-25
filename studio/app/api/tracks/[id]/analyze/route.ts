/**
 * GET /api/tracks/:id/analyze
 * Trigger BPM/key/loudness analysis job
 */

import { NextRequest, NextResponse } from 'next/server';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/tracks/:id/analyze
 * Trigger async analysis job for BPM, key, loudness
 * Returns job status
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `GET /api/tracks/${id}/analyze`);

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
    // TODO: Check if already analyzed (cache)

    // TODO: Enqueue async job in Supabase pg_boss or Lambda
    // Job tasks:
    //   1. Download audio from S3
    //   2. Run ffmpeg + aubio-tools (BPM) or call Essentia API
    //   3. Run chromagram analysis (key detection)
    //   4. Measure loudness (LUFS)
    //   5. Update track record with results

    const jobId = crypto.randomUUID();

    logRequest(requestId, `GET /api/tracks/${id}/analyze`, 'success', { jobId });

    return NextResponse.json(
      {
        job_id: jobId,
        track_id: id,
        status: 'queued',
        analysis_results: null,
        created_at: new Date().toISOString(),
      },
      { status: 202 } // Accepted — processing
    );
  } catch (error) {
    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tracks/:id/analyze
 * Alternative trigger endpoint (POST for side-effect)
 */
export async function POST(req: NextRequest, { params }: RouteContext) {
  return GET(req, { params });
}
