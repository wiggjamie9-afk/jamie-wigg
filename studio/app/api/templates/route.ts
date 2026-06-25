/**
 * POST /api/templates — Create template
 * GET /api/templates — List published templates (filterable)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

const CreateTemplateSchema = z.object({
  track_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  settings: z.record(z.unknown()).optional(),
  royalty_percentage: z.number().min(0).max(100).optional(),
});

type CreateTemplateRequest = z.infer<typeof CreateTemplateSchema>;

/**
 * POST /api/templates
 * Create a new template from a track
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logRequest(requestId, 'POST /api/templates');

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
    const validatedData: CreateTemplateRequest = CreateTemplateSchema.parse(body);

    // TODO: Verify track exists and belongs to this creator
    // TODO: Insert into templates table
    // TODO: Initialize empty template JSON schema

    const templateId = crypto.randomUUID();

    const templateSchema = {
      canvas_width: 1920,
      canvas_height: 1080,
      elements: [],
      timeline: [],
    };

    logRequest(requestId, 'POST /api/templates', 'success', { templateId });

    return NextResponse.json(
      {
        id: templateId,
        creator_id: userId,
        track_id: validatedData.track_id,
        title: validatedData.title || `Template ${templateId.slice(0, 8)}`,
        template_schema: templateSchema,
        royalty_percentage: validatedData.royalty_percentage || 50,
        price_cents: 0,
        published: false,
        version: '0.1.0',
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
 * GET /api/templates
 * List published templates (filterable)
 * Query params: ?category=genre&bpm_min=120&bpm_max=130&mood=energetic&limit=50&offset=0
 */
export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logRequest(requestId, 'GET /api/templates');

  try {
    // Parse query params
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const bpmMin = url.searchParams.get('bpm_min');
    const bpmMax = url.searchParams.get('bpm_max');
    const mood = url.searchParams.get('mood');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const sort = url.searchParams.get('sort') || 'newest'; // trending, newest, price

    // TODO: Query templates from Supabase with filters
    // TODO: Apply pagination (limit + offset or cursor-based)
    // TODO: Sort by trending (remix count last 7 days), newest, or price

    const templates = [
      {
        id: 'tmpl-1',
        creator_id: 'creator-1',
        track_id: 'track-1',
        title: 'Sunset Vibes',
        template_schema: {
          canvas_width: 1920,
          canvas_height: 1080,
          elements: [],
          timeline: [],
        },
        royalty_percentage: 50,
        price_cents: 999,
        published: true,
        version: '1.0.0',
        remix_count: 42,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    logRequest(requestId, 'GET /api/templates', 'success', { count: templates.length });

    return NextResponse.json(
      {
        data: templates,
        pagination: {
          limit,
          offset,
          total: 1,
        },
        filters_applied: {
          category,
          bpm_min: bpmMin ? parseInt(bpmMin) : null,
          bpm_max: bpmMax ? parseInt(bpmMax) : null,
          mood,
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
