/**
 * POST /api/creators — Create creator profile
 * GET /api/creators/:id — Get creator profile (handled in [id]/route.ts)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

const CreateCreatorSchema = z.object({
  display_name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
});

type CreateCreatorRequest = z.infer<typeof CreateCreatorSchema>;

/**
 * POST /api/creators
 * Create a new creator profile (from authenticated user)
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logRequest(requestId, 'POST /api/creators');

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
    const validatedData: CreateCreatorRequest = CreateCreatorSchema.parse(body);

    // TODO: Check if creator already exists for this user
    // TODO: Insert into creators table (Supabase)
    // TODO: Set user_id, timestamps, defaults

    const creatorId = crypto.randomUUID(); // Mock ID generation

    logRequest(requestId, 'POST /api/creators', 'success', { creatorId, userId });

    return NextResponse.json(
      {
        id: creatorId,
        user_id: userId,
        display_name: validatedData.display_name,
        bio: validatedData.bio || null,
        avatar_url: validatedData.avatar_url || null,
        stripe_account_id: null,
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
