/**
 * POST /api/remixes — Create remix from template
 * GET /api/remixes — List creator's remixes or published remixes
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

const CreateRemixSchema = z.object({
  template_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  settings: z.record(z.unknown()).optional(),
});

type CreateRemixRequest = z.infer<typeof CreateRemixSchema>;

/**
 * POST /api/remixes
 * Create a new remix from a published template
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logRequest(requestId, 'POST /api/remixes');

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

    // Parse and validate request body
    const body = await req.json();
    const validatedData: CreateRemixRequest = CreateRemixSchema.parse(body);

    // TODO: Verify template exists and is published
    // TODO: Check template license (personal/commercial/exclusive)
    // TODO: Insert into remixes table with status='draft'

    const remixId = crypto.randomUUID();

    logRequest(requestId, 'POST /api/remixes', 'success', { remixId });

    return NextResponse.json(
      {
        id: remixId,
        creator_id: userId,
        template_id: validatedData.template_id,
        title: validatedData.title || `Remix of Template`,
        settings: validatedData.settings || {},
        status: 'draft',
        published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { status: 201 }
    );
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
 * GET /api/remixes
 * List remixes (creator's or published remixes)
 * Query params: ?creator_id=<id>&published=true&limit=50&offset=0
 */
export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logRequest(requestId, 'GET /api/remixes');

  try {
    // Parse query params
    const url = new URL(req.url);
    const creatorId = url.searchParams.get('creator_id');
    const published = url.searchParams.get('published') === 'true';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // TODO: Query remixes from Supabase with optional filters
    // TODO: If creatorId provided, require JWT auth for ownership
    // TODO: Apply pagination

    const remixes = [
      {
        id: 'remix-1',
        creator_id: 'creator-2',
        template_id: 'tmpl-1',
        title: 'My Sunset Remix',
        settings: {},
        status: 'published',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    logRequest(requestId, 'GET /api/remixes', 'success', { count: remixes.length });

    return NextResponse.json(
      {
        data: remixes,
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
