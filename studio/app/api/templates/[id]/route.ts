/**
 * GET /api/templates/:id — Fetch template JSON
 * PATCH /api/templates/:id — Save template (JSON blob)
 * DELETE /api/templates/:id — Soft delete
 * POST /api/templates/:id/publish — Publish template
 * GET /api/templates/:id/versions — List versions
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

const UpdateTemplateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  template_schema: z.record(z.unknown()).optional(),
  royalty_percentage: z.number().min(0).max(100).optional(),
  price_cents: z.number().int().min(0).optional(),
  license_type: z.enum(['personal', 'commercial', 'exclusive']).optional(),
});

type UpdateTemplateRequest = z.infer<typeof UpdateTemplateSchema>;

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/templates/:id
 * Fetch template JSON
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `GET /api/templates/${id}`);

  try {
    // TODO: Fetch template from Supabase by id
    // TODO: If not published, verify creator ownership
    // TODO: Return 404 if not found

    const template = {
      id,
      creator_id: 'creator-1',
      track_id: 'track-1',
      title: 'Sunset Vibes',
      template_schema: {
        canvas_width: 1920,
        canvas_height: 1080,
        elements: [
          {
            type: 'text',
            x: 100,
            y: 100,
            w: 500,
            h: 100,
            text: 'Example Text',
            fill: '#ffffff',
          },
        ],
        timeline: [],
      },
      royalty_percentage: 50,
      price_cents: 999,
      license_type: 'commercial',
      published: true,
      version: '1.0.0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    logRequest(requestId, `GET /api/templates/${id}`, 'success');

    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/templates/:id
 * Save/update template (auth-gated: only creator can update draft)
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `PATCH /api/templates/${id}`);

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

    // TODO: Fetch template from DB to verify ownership
    // TODO: Return 403 if user is not the creator
    // TODO: Prevent updates to published templates (immutable once published)

    // Parse and validate request body
    const body = await req.json();
    const validatedData: UpdateTemplateRequest = UpdateTemplateSchema.parse(body);

    // TODO: Update in Supabase templates table
    // TODO: Auto-save feature: update updated_at timestamp

    const updatedTemplate = {
      id,
      creator_id: userId,
      track_id: 'track-1',
      title: validatedData.title || 'Sunset Vibes',
      template_schema: validatedData.template_schema || { elements: [], timeline: [] },
      royalty_percentage: validatedData.royalty_percentage || 50,
      price_cents: validatedData.price_cents || 0,
      license_type: validatedData.license_type || 'commercial',
      published: false,
      version: '0.2.0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    logRequest(requestId, `PATCH /api/templates/${id}`, 'success');

    return NextResponse.json(updatedTemplate, { status: 200 });
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
 * DELETE /api/templates/:id
 * Soft delete template (auth-gated)
 */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `DELETE /api/templates/${id}`);

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

    // TODO: Fetch template from DB to verify ownership
    // TODO: Soft delete: set published=false, set deleted_at timestamp

    logRequest(requestId, `DELETE /api/templates/${id}`, 'success');

    return NextResponse.json(
      { message: 'Template deleted successfully' },
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
