/**
 * GET /api/models/available - List available models for user tier
 * GET /api/models/info/:model - Get detailed model information
 */

import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { authenticateJWT } from '../middleware/auth'
import { logRequest, logError } from '../middleware/logging'
import { modelsAvailableResponseSchema, modelInfoResponseSchema, type ModelMetadata } from './schema'

const MODEL_CATALOG: Record<string, ModelMetadata> = {
  flux: {
    id: 'flux',
    name: 'FLUX 1.1 Pro',
    type: 'image',
    cost_per_request: 0.05,
    supported_dimensions: ['1024x1024', '1024x576', '576x1024'],
    max_prompt_length: 2000,
    tiers: ['pro', 'studio'],
    status: 'online',
    latency_p99: 45,
    fallback: 'stable-diffusion-3',
  },
  'stable-diffusion-3': {
    id: 'stable-diffusion-3',
    name: 'Stable Diffusion 3',
    type: 'image',
    cost_per_request: 0.02,
    supported_dimensions: ['1024x1024', '512x512', '768x768'],
    max_prompt_length: 1000,
    tiers: ['free', 'pro', 'studio'],
    status: 'online',
    latency_p99: 35,
    fallback: 'sano',
  },
  sano: {
    id: 'sano',
    name: 'Sano 1.0',
    type: 'image',
    cost_per_request: 0.01,
    supported_dimensions: ['1024x1024', '512x512'],
    max_prompt_length: 800,
    tiers: ['free', 'pro', 'studio'],
    status: 'online',
    latency_p99: 25,
  },
  'hunyuan-video': {
    id: 'hunyuan-video',
    name: 'Hunyuan Video',
    type: 'video',
    cost_per_request: 0.1,
    supported_dimensions: ['1920x1080', '1280x720', '1080x1920'],
    max_duration: 120,
    max_prompt_length: 1500,
    tiers: ['pro', 'studio'],
    status: 'online',
    latency_p99: 120,
    fallback: 'runway-gen3',
  },
  'runway-gen3': {
    id: 'runway-gen3',
    name: 'Runway Gen-3',
    type: 'video',
    cost_per_request: 0.15,
    supported_dimensions: ['1920x1080', '1280x720', '1080x1920'],
    max_duration: 60,
    max_prompt_length: 2000,
    tiers: ['studio'],
    status: 'degraded',
    latency_p99: 150,
  },
  'suno-v5': {
    id: 'suno-v5',
    name: 'Suno v5',
    type: 'music',
    cost_per_request: 0.08,
    supported_dimensions: [],
    max_duration: 120,
    max_prompt_length: 500,
    tiers: ['pro', 'studio'],
    status: 'online',
    latency_p99: 60,
  },
  'elevenlabs-tts': {
    id: 'elevenlabs-tts',
    name: 'ElevenLabs TTS',
    type: 'audio',
    cost_per_request: 0.002,
    supported_dimensions: [],
    max_prompt_length: 5000,
    tiers: ['free', 'pro', 'studio'],
    status: 'online',
    latency_p99: 10,
  },
  kokoro: {
    id: 'kokoro',
    name: 'Kokoro TTS',
    type: 'audio',
    cost_per_request: 0.0005,
    supported_dimensions: [],
    max_prompt_length: 10000,
    tiers: ['free', 'pro', 'studio'],
    status: 'online',
    latency_p99: 5,
  },
}

const FALLBACK_CHAINS: Record<string, string[]> = {
  flux: ['stable-diffusion-3', 'sano'],
  'hunyuan-video': ['runway-gen3'],
  'runway-gen3': ['hunyuan-video'],
  'suno-v5': [],
  'elevenlabs-tts': ['kokoro'],
}

/**
 * GET /api/models/available
 * Return models filtered by user tier
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

    // Filter models by tier
    const availableModels = Object.values(MODEL_CATALOG).filter(model =>
      model.tiers.includes(tier as any)
    )

    const response = {
      user_tier: tier,
      models: availableModels,
      total_count: availableModels.length,
    }

    const duration = Date.now() - startTime
    logRequest(requestId, 'GET', '/api/models/available', 200, `Returned ${availableModels.length} models`, undefined, duration)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    const duration = Date.now() - startTime
    logError(requestId, 'Unexpected error in GET /api/models/available', { error: err, duration })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}

/**
 * Model info endpoint handler
 * Called from /api/models/[model]/route.ts
 */
export async function handleModelInfo(req: NextRequest, modelId: string) {
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

    const { tier } = await authenticateJWT(authHeader)

    // Find model
    const model = MODEL_CATALOG[modelId]
    if (!model) {
      logRequest(requestId, 'GET', `/api/models/info/${modelId}`, 404, 'Model not found')
      return NextResponse.json(
        { error: 'Model not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Check tier access
    if (!model.tiers.includes(tier as any)) {
      logRequest(requestId, 'GET', `/api/models/info/${modelId}`, 403, 'Model not available for tier')
      return NextResponse.json(
        { error: 'Model not available for your tier', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    const response = {
      id: model.id,
      name: model.name,
      type: model.type,
      description: `${model.name} for ${model.type} generation`,
      cost_per_request: model.cost_per_request,
      supported_dimensions: model.supported_dimensions,
      supported_parameters: getSupportedParameters(model),
      max_duration: model.max_duration,
      max_prompt_length: model.max_prompt_length,
      tiers: model.tiers,
      status: model.status,
      latency_p99: model.latency_p99,
      success_rate: Math.random() * 0.1 + 0.95, // Stub: 95-100%
      average_latency: Math.floor(model.latency_p99 * 0.7),
      fallback_chain: FALLBACK_CHAINS[modelId] || [],
      deprecated: false,
    }

    logRequest(requestId, 'GET', `/api/models/info/${modelId}`, 200, 'Model info retrieved')

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    logError(requestId, `Unexpected error in GET /api/models/info/:model`, { error: err })
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    )
  }
}

function getSupportedParameters(model: ModelMetadata): Record<string, unknown> {
  const params: Record<string, unknown> = {
    prompt: {
      type: 'string',
      required: true,
      max_length: model.max_prompt_length,
    },
    dimensions: {
      type: 'enum',
      options: model.supported_dimensions,
    },
  }

  if (model.type === 'video' || model.type === 'music') {
    params.duration = {
      type: 'integer',
      min: 1,
      max: model.max_duration,
    }
  }

  if (model.type === 'image') {
    params.style = {
      type: 'string',
      options: ['photorealistic', 'illustration', 'anime', 'oil-painting'],
    }
    params.seed = {
      type: 'integer',
      min: 0,
      max: 2147483647,
    }
  }

  return params
}
