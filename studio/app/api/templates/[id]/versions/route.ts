/**
 * GET /api/templates/:id/versions
 * List all versions of a template
 */

import { NextRequest, NextResponse } from 'next/server';
import { logRequest, logError } from '@/lib/logging';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/templates/:id/versions
 * List all versions (v1.0, v1.1, v2.0, etc.)
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const requestId = crypto.randomUUID();
  const { id } = params;

  logRequest(requestId, `GET /api/templates/${id}/versions`);

  try {
    // TODO: Query template_versions table filtered by template_id
    // TODO: Order by version descending (newest first)
    // TODO: Include metadata (published_at, remix_count, downloads)

    const versions = [
      {
        id: `${id}-v2`,
        template_id: id,
        version: '2.0.0',
        template_schema: {
          canvas_width: 1920,
          canvas_height: 1080,
          elements: [],
          timeline: [],
        },
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        remix_count: 42,
        downloads: 15,
      },
      {
        id: `${id}-v1`,
        template_id: id,
        version: '1.0.0',
        template_schema: {
          canvas_width: 1920,
          canvas_height: 1080,
          elements: [],
          timeline: [],
        },
        published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        remix_count: 28,
        downloads: 8,
      },
    ];

    logRequest(requestId, `GET /api/templates/${id}/versions`, 'success', {
      count: versions.length,
    });

    return NextResponse.json(
      {
        template_id: id,
        versions,
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
