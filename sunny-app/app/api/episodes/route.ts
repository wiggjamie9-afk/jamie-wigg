import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

export async function GET() {
  try {
    const episodesDir = path.join(process.cwd(), '..', 'kids-channel', 'episodes')
    const episodes: any[] = []

    if (!fs.existsSync(episodesDir)) {
      return NextResponse.json([])
    }

    const dirs = fs.readdirSync(episodesDir).sort()

    for (const dir of dirs) {
      const episodePath = path.join(episodesDir, dir)
      const scriptPath = path.join(episodePath, 'script.json')
      const thumbnailPath = path.join(episodePath, 'thumbnail.jpg')

      if (fs.existsSync(scriptPath)) {
        try {
          const scriptContent = fs.readFileSync(scriptPath, 'utf-8')
          const script = JSON.parse(scriptContent)

          episodes.push({
            id: dir,
            title: script.title || 'Untitled',
            description: script.description || '',
            tags: script.tags || [],
            thumbnailPath: fs.existsSync(thumbnailPath) ? `/${dir}/thumbnail.jpg` : null,
          })
        } catch (e) {
          console.error(`Failed to parse ${scriptPath}:`, e)
        }
      }
    }

    return NextResponse.json(episodes)
  } catch (error) {
    console.error('Error loading episodes:', error)
    return NextResponse.json([], { status: 500 })
  }
}
