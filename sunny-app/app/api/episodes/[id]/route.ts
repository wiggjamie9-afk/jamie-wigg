import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const episodeId = params.id
    const episodePath = path.join(
      process.cwd(),
      '..',
      'kids-channel',
      'episodes',
      episodeId
    )
    const scriptPath = path.join(episodePath, 'script.json')

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    const scriptContent = fs.readFileSync(scriptPath, 'utf-8')
    const episode = JSON.parse(scriptContent)

    return NextResponse.json({
      id: episodeId,
      ...episode,
    })
  } catch (error) {
    console.error('Error loading episode:', error)
    return NextResponse.json(
      { error: 'Failed to load episode' },
      { status: 500 }
    )
  }
}
