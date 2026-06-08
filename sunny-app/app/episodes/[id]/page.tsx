'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Scene {
  id: number
  duration: number
  image_prompt: string
  narration_segment: string
}

interface Episode {
  id: string
  title: string
  description: string
  narration: string
  scenes: Scene[]
  tags: string[]
}

export default function EpisodePage() {
  const params = useParams()
  const episodeId = params.id as string
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'story' | 'scenes'>('story')

  useEffect(() => {
    async function loadEpisode() {
      try {
        const response = await fetch(`/api/episodes/${episodeId}`)
        const data = await response.json()
        setEpisode(data)
      } catch (error) {
        console.error('Failed to load episode:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEpisode()
  }, [episodeId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🦘</div>
          <p className="text-sunny-brown">Loading story...</p>
        </div>
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="text-sunny-gold hover:text-sunny-brown transition mb-8 inline-block"
          >
            ← Back to Stories
          </Link>
          <div className="text-center py-12">
            <p className="text-sunny-brown/60">Story not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-amber-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sunny-gold hover:text-sunny-brown transition flex items-center gap-2"
            >
              <span>←</span> Back
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold text-sunny-brown">Sunny's Stories</h1>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover and Title Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Cover Image */}
          <div className="md:col-span-1">
            <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-sunny-gold to-yellow-100 rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                🦘
              </div>
            </div>
          </div>

          {/* Title and Info */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-sunny-brown mb-4 leading-tight">
              {episode.title}
            </h1>
            <p className="text-lg text-sunny-brown/70 mb-6">
              {episode.description}
            </p>

            {/* Tags */}
            {episode.tags && episode.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {episode.tags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 bg-sunny-gold/20 text-sunny-brown text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Purchase Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-sunny-brown text-white rounded-full font-semibold hover:bg-sunny-brown/90 transition text-center"
              >
                Buy on Gumroad - $3.99
              </a>
              <a
                href="https://www.etsy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 border-2 border-sunny-brown text-sunny-brown rounded-full font-semibold hover:bg-sunny-brown/10 transition text-center"
              >
                Buy on Etsy - $4.99
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-sunny-gold/30">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('story')}
              className={`pb-4 font-semibold transition ${
                activeTab === 'story'
                  ? 'text-sunny-brown border-b-2 border-sunny-brown'
                  : 'text-sunny-brown/50 hover:text-sunny-brown'
              }`}
            >
              Story
            </button>
            <button
              onClick={() => setActiveTab('scenes')}
              className={`pb-4 font-semibold transition ${
                activeTab === 'scenes'
                  ? 'text-sunny-brown border-b-2 border-sunny-brown'
                  : 'text-sunny-brown/50 hover:text-sunny-brown'
              }`}
            >
              Scenes ({episode.scenes?.length || 0})
            </button>
          </div>
        </div>

        {/* Story Tab */}
        {activeTab === 'story' && (
          <div className="bg-white/60 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-sunny-brown mb-6">The Story</h2>
            <div className="prose prose-sm max-w-none text-sunny-brown/80 leading-relaxed space-y-4">
              {episode.narration.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Scenes Tab */}
        {activeTab === 'scenes' && episode.scenes && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-sunny-brown mb-6">Story Scenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {episode.scenes.map((scene, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  {/* Scene Image Placeholder */}
                  <div className="w-full aspect-video bg-gradient-to-br from-sunny-gold to-yellow-100 flex items-center justify-center text-4xl opacity-30">
                    🎬
                  </div>

                  {/* Scene Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-sunny-brown mb-2">
                      Scene {scene.id}
                    </h4>
                    <p className="text-xs text-sunny-brown/60 mb-2 line-clamp-2">
                      {scene.narration_segment}
                    </p>
                    <p className="text-xs text-sunny-gold">
                      {scene.duration}s • Duration
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white/60 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-sunny-brown mb-6">Available Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-sunny-gold/30 rounded-lg">
              <div className="text-3xl mb-2">📖</div>
              <h4 className="font-semibold text-sunny-brown">Colored Ebook</h4>
              <p className="text-sm text-sunny-brown/60 mt-1">Full-color illustrated</p>
              <p className="text-lg font-bold text-sunny-gold mt-2">$3.99</p>
            </div>
            <div className="p-4 border border-sunny-gold/30 rounded-lg">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-semibold text-sunny-brown">Coloring Book</h4>
              <p className="text-sm text-sunny-brown/60 mt-1">Printable & interactive</p>
              <p className="text-lg font-bold text-sunny-gold mt-2">$2.99</p>
            </div>
            <div className="p-4 border border-sunny-gold/30 rounded-lg">
              <div className="text-3xl mb-2">🔤</div>
              <h4 className="font-semibold text-sunny-brown">Audiobook</h4>
              <p className="text-sm text-sunny-brown/60 mt-1">Professional narration</p>
              <p className="text-lg font-bold text-sunny-gold mt-2">$4.99</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/30 border-t border-amber-200/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-sunny-brown/70">
            © 2024 Sunny's Cozy Quokka Bedtime Tales by Jamie Wigg
          </p>
        </div>
      </footer>
    </div>
  )
}
