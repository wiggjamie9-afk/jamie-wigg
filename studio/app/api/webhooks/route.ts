/**
 * POST /api/webhooks/register - Create webhook subscription
 * GET /api/webhooks - List subscriptions
 * PATCH /api/webhooks/:id - Update subscription
 * DELETE /api/webhooks/:id - Delete subscription
 * POST /api/webhooks/:id/test - Test webhook delivery
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import * as crypto from 'crypto'
import { authenticateJWT } from '../middleware/auth'
import { logRequest, logError } from '../middleware/logging'
import {
  createWebhookSubscriptionSchema,
  updateWebhookSubscriptionSchema,
  webhookSubscriptionSchema,
  type WebhookSubscription,
  type WebhookEvent,
} from './schema'

// Stub webhook store (replace with Supabase in production)
const webhookStore = new Map<string, WebhookSubscription>()

/**
 * POST /api/webhooks/register
 * Create webhook subscription
 */
export async function POST(req: NextRequest, { params }: { params?: { id?: string } }) {
  const requestId = req.headers.get('x-request-id') || uuidv4()

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const { user_id } = await authenticateJWT(authHeader)

    // Parse request body
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload', code: 'INVALID_JSON' },
        { status: 400 }
      )
    }

    // Validate input schema
    let validatedInput: unknown
    try {
      validatedInput = createWebhookSubscriptionSchema.parse(body)
    } catch (err) {
      const zodError = err as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: zodError.errors },
        { status: 400 }
      )
    }

    const { webhook_url, event_types } = validatedInput as { webhook_url: string; event_types: string[] }

    // Generate secret key
    const secretKey = crypto.randomBytes(32).toString('hex')

    // Create subscription
    const subscription: WebhookSubscription = {
      id: uuidv4(),
      user_id,
      webhook_url,
      event_types: event_types as any,
      secret_key: secretKey,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    webhookStore.set(subscription.id, subscription)

    logRequest(requestId, 'POST', '/api/webhooks/register', 201, 'Webhook subscription created', subscription.id)

    return NextResponse.json(subscription, {
      status: 201,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    logError(requestId, 'Unexpected error in POST /api/webhooks/register', { error: err })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}

/**
 * GET /api/webhooks
 * List subscriptions for user
 */
export async function GET(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || uuidv4()

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const { user_id } = await authenticateJWT(authHeader)

    // Filter subscriptions by user
    const userSubscriptions = Array.from(webhookStore.values()).filter(
      sub => sub.user_id === user_id
    )

    const response = {
      subscriptions: userSubscriptions,
      total_count: userSubscriptions.length,
    }

    logRequest(requestId, 'GET', '/api/webhooks', 200, `Returned ${userSubscriptions.length} subscriptions`)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    logError(requestId, 'Unexpected error in GET /api/webhooks', { error: err })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}

/**
 * PATCH /api/webhooks/:id
 * Update subscription
 */
export async function PATCH(req: NextRequest, { params }: { params?: { id?: string } }) {
  const requestId = req.headers.get('x-request-id') || uuidv4()
  const webhookId = params?.id

  if (!webhookId) {
    return NextResponse.json(
      { error: 'Webhook ID required', code: 'MISSING_ID' },
      { status: 400 }
    )
  }

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const { user_id } = await authenticateJWT(authHeader)

    // Find subscription
    const subscription = webhookStore.get(webhookId)
    if (!subscription) {
      return NextResponse.json(
        { error: 'Webhook not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (subscription.user_id !== user_id) {
      return NextResponse.json(
        { error: 'Forbidden', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Parse request body
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload', code: 'INVALID_JSON' },
        { status: 400 }
      )
    }

    // Validate input schema
    let validatedInput: unknown
    try {
      validatedInput = updateWebhookSubscriptionSchema.parse(body)
    } catch (err) {
      const zodError = err as z.ZodError
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: zodError.errors },
        { status: 400 }
      )
    }

    const update = validatedInput as { webhook_url?: string; event_types?: string[]; active?: boolean }

    // Update subscription
    if (update.webhook_url !== undefined) subscription.webhook_url = update.webhook_url
    if (update.event_types !== undefined) subscription.event_types = update.event_types as any
    if (update.active !== undefined) subscription.active = update.active
    subscription.updated_at = new Date().toISOString()

    logRequest(requestId, 'PATCH', `/api/webhooks/${webhookId}`, 200, 'Webhook subscription updated')

    return NextResponse.json(subscription, {
      status: 200,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    logError(requestId, 'Unexpected error in PATCH /api/webhooks/:id', { error: err })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}

/**
 * DELETE /api/webhooks/:id
 * Delete subscription
 */
export async function DELETE(req: NextRequest, { params }: { params?: { id?: string } }) {
  const requestId = req.headers.get('x-request-id') || uuidv4()
  const webhookId = params?.id

  if (!webhookId) {
    return NextResponse.json(
      { error: 'Webhook ID required', code: 'MISSING_ID' },
      { status: 400 }
    )
  }

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const { user_id } = await authenticateJWT(authHeader)

    // Find subscription
    const subscription = webhookStore.get(webhookId)
    if (!subscription) {
      return NextResponse.json(
        { error: 'Webhook not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (subscription.user_id !== user_id) {
      return NextResponse.json(
        { error: 'Forbidden', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Delete subscription
    webhookStore.delete(webhookId)

    logRequest(requestId, 'DELETE', `/api/webhooks/${webhookId}`, 204, 'Webhook subscription deleted')

    return new NextResponse(null, {
      status: 204,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    logError(requestId, 'Unexpected error in DELETE /api/webhooks/:id', { error: err })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}

/**
 * Test webhook delivery
 * POST /api/webhooks/:id/test
 */
export async function testWebhook(webhookId: string, req: NextRequest): Promise<NextResponse> {
  const requestId = req.headers.get('x-request-id') || uuidv4()

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const { user_id } = await authenticateJWT(authHeader)

    // Find subscription
    const subscription = webhookStore.get(webhookId)
    if (!subscription) {
      return NextResponse.json(
        { error: 'Webhook not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (subscription.user_id !== user_id) {
      return NextResponse.json(
        { error: 'Forbidden', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Create test payload
    const testPayload: WebhookEvent = {
      event_type: 'job.complete',
      timestamp: new Date().toISOString(),
      job_id: uuidv4(),
      user_id: subscription.user_id,
      data: {
        status: 'complete',
        output_url: 'https://cdn.rhythmix.com/test-output.mp4',
        processing_time_ms: 45000,
      },
    }

    // Compute HMAC signature
    const payload = JSON.stringify(testPayload)
    const signature = crypto
      .createHmac('sha256', subscription.secret_key)
      .update(payload)
      .digest('hex')

    // Send webhook (stub: just log it)
    logRequest(requestId, 'POST', `/api/webhooks/${webhookId}/test`, 200, 'Test webhook sent')

    return NextResponse.json({
      status: 'sent',
      webhook_url: subscription.webhook_url,
      event_type: testPayload.event_type,
      signature,
      payload: testPayload,
    })
  } catch (err) {
    logError(requestId, `Unexpected error in test webhook`, { error: err })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}
