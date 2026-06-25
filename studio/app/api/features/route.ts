/**
 * GET /api/features - Get enabled features for user tier
 */

import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { authenticateJWT } from '../middleware/auth'
import { logRequest, logError } from '../middleware/logging'
import { type Feature } from './schema'

// Feature flags by tier
const FEATURE_CATALOG: Record<string, Feature> = {
  'video_export_4k': {
    id: 'video_export_4k',
    name: '4K Video Export',
    description: 'Export generated videos in 4K resolution',
    tier: 'pro',
    enabled: true,
  },
  'unlimited_storage': {
    id: 'unlimited_storage',
    name: 'Unlimited Storage',
    description: 'Store unlimited number of generated videos',
    tier: 'pro',
    enabled: true,
  },
  'api_webhooks': {
    id: 'api_webhooks',
    name: 'Webhooks API',
    description: 'Subscribe to job completion events via webhooks',
    tier: 'pro',
    enabled: true,
  },
  'team_collaboration': {
    id: 'team_collaboration',
    name: 'Team Collaboration',
    description: 'Invite team members and share projects',
    tier: 'studio',
    enabled: true,
  },
  'custom_models': {
    id: 'custom_models',
    name: 'Custom Models',
    description: 'Use custom fine-tuned models',
    tier: 'studio',
    enabled: true,
  },
  'priority_queue': {
    id: 'priority_queue',
    name: 'Priority Queue',
    description: 'Jobs processed with priority',
    tier: 'studio',
    enabled: true,
  },
  'analytics_dashboard': {
    id: 'analytics_dashboard',
    name: 'Analytics Dashboard',
    description: 'View detailed usage analytics',
    tier: 'pro',
    enabled: true,
  },
  'advanced_caching': {
    id: 'advanced_caching',
    name: 'Advanced Caching',
    description: 'Extend cache TTL to 90 days',
    tier: 'pro',
    enabled: true,
  },
}

// Features enabled by default for each tier
const TIER_FEATURES = {
  free: [] as string[],
  pro: [
    'video_export_4k',
    'unlimited_storage',
    'api_webhooks',
    'analytics_dashboard',
    'advanced_caching',
  ],
  studio: [
    'video_export_4k',
    'unlimited_storage',
    'api_webhooks',
    'team_collaboration',
    'custom_models',
    'priority_queue',
    'analytics_dashboard',
    'advanced_caching',
  ],
}

/**
 * GET /api/features
 * Get enabled features for authenticated user
 */
export async function GET(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || uuidv4()
  const startTime = Date.now()

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      )
    }

    const { user_id, tier } = await authenticateJWT(authHeader)

    // Get enabled features for tier
    const enabledFeatureIds = TIER_FEATURES[tier as keyof typeof TIER_FEATURES] || []

    const enabledFeatures: Feature[] = enabledFeatureIds
      .map(id => FEATURE_CATALOG[id])
      .filter(Boolean)

    // All available features in catalog
    const allFeatures = Object.values(FEATURE_CATALOG)

    const response = {
      user_id,
      tier,
      enabled_features: enabledFeatureIds,
      available_features: allFeatures,
    }

    const duration = Date.now() - startTime
    logRequest(requestId, 'GET', '/api/features', 200, `Returned ${enabledFeatureIds.length} enabled features`, undefined, duration)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    const duration = Date.now() - startTime
    logError(requestId, 'Unexpected error in GET /api/features', { error: err, duration })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}
