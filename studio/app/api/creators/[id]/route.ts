/**
 * GET /api/creators/:id — Get creator profile
 * PATCH /api/creators/:id — Update creator profile
 * GET /api/creators/:id/stats — Get creator stats (revenue, templates, followers)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

const UpdateCreatorSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
  stripe_account_id: z.string().optional(),
});

type UpdateCreatorRequest = z.infer<typeof UpdateCreatorSchema>;

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/creators/:id
 * Fetch creator profile
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `GET /api/creators/${id}`);

  try {
    // TODO: Fetch from Supabase creators table by id
    // TODO: Handle not found (404)

    const creator = {
      id,
      user_id: 'user-123',
      display_name: 'Example Creator',
      bio: 'Bio text',
      avatar_url: null,
      stripe_account_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    logRequest(requestId, `GET /api/creators/${id}`, 'success');

    return NextResponse.json(creator, { status: 200 });
  } catch (error) {
    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/creators/:id
 * Update creator profile (auth-gated: only owner can update)
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `PATCH /api/creators/${id}`);

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

    // TODO: Fetch creator from DB to verify ownership
    // TODO: Return 403 if user is not the owner

    // Parse and validate request body
    const body = await req.json();
    const validatedData: UpdateCreatorRequest = UpdateCreatorSchema.parse(body);

    // TODO: Update in Supabase creators table

    const updatedCreator = {
      id,
      user_id: userId,
      display_name: validatedData.display_name || 'Example Creator',
      bio: validatedData.bio || null,
      avatar_url: validatedData.avatar_url || null,
      stripe_account_id: validatedData.stripe_account_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    logRequest(requestId, `PATCH /api/creators/${id}`, 'success');

    return NextResponse.json(updatedCreator, { status: 200 });
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
 * GET /api/creators/:id/stats
 * Fetch creator stats (revenue, templates, followers)
 * Returns real-time aggregated stats
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  // Parse URL to detect /stats route
  const url = new URL(req.url);
  if (!url.pathname.includes('/stats')) {
    // This is the main GET, already handled above
    return GET(req, { params });
  }

  logRequest(requestId, `GET /api/creators/${id}/stats`);

  try {
    // TODO: Query materialized view or aggregate from royalties + templates tables
    // TODO: Calculate total revenue, template count, follower count
    // Performance target: <100ms response

    const stats = {
      creator_id: id,
      total_revenue_cents: 15000, // $150.00
      total_templates: 5,
      total_remixes: 42,
      follower_count: 127,
      top_templates: [
        {
          template_id: 'tmpl-1',
          title: 'Sunset Vibes',
          remixes: 15,
          revenue_cents: 8000,
        },
      ],
    };

    logRequest(requestId, `GET /api/creators/${id}/stats`, 'success');

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
