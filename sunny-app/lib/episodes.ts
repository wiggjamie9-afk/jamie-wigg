import * as fs from 'fs'
import * as path from 'path'

export interface Scene {
  id: number
  duration: number
  image_prompt: string
  narration_segment: string
}

export interface Episode {
  id: string
  title: string
  description: string
  tags: string[]
  narration: string
  scenes: Scene[]
  coverPath?: string
  thumbnailPath?: string
}

const EPISODES_DIR = path.join(process.cwd(), '..', 'kids-channel', 'episodes')
const EBOOKS_DIR = path.join(process.cwd(), '..', 'kids-channel', 'ebooks')

export async function getAllEpisodes(): Promise<Episode[]> {
  const episodes: Episode[] = []

  if (!fs.existsSync(EPISODES_DIR)) {
    return episodes
  }

  const dirs = fs.readdirSync(EPISODES_DIR)

  for (const dir of dirs) {
    const episodePath = path.join(EPISODES_DIR, dir)
    const scriptPath = path.join(episodePath, 'script.json')
    const coverPath = path.join(episodePath, 'cover.jpg')
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
          narration: script.narration || '',
          scenes: script.scenes || [],
          coverPath: fs.existsSync(coverPath) ? `/../kids-channel/episodes/${dir}/cover.jpg` : undefined,
          thumbnailPath: fs.existsSync(thumbnailPath) ? `/../kids-channel/episodes/${dir}/thumbnail.jpg` : undefined,
        })
      } catch (e) {
        console.error(`Failed to parse ${scriptPath}:`, e)
      }
    }
  }

  // Sort by episode number or name
  episodes.sort((a, b) => a.id.localeCompare(b.id))

  return episodes
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const episodes = await getAllEpisodes()
  return episodes.find(ep => ep.id === id) || null
}

export async function getEpisodeCount(): Promise<number> {
  const episodes = await getAllEpisodes()
  return episodes.length
}
