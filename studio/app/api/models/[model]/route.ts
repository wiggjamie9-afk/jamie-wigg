import { NextRequest } from 'next/server'
import { handleModelInfo } from '../route'

/**
 * GET /api/models/info/:model
 * Get detailed model information
 */
export async function GET(req: NextRequest, { params }: { params: { model: string } }) {
  return handleModelInfo(req, params.model)
}
