'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Episode {
  id: string
  title: string
  description: string
  coverPath?: string
  thumbnailPath?: string
}

export default function Home() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load episodes from the parent directory's kids-channel folder
    async function loadEpisodes() {
      try {
        const response = await fetch('/api/episodes')
        const data = await response.json()
        setEpisodes(data)
      } catch (error) {
        console.error('Failed to load episodes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEpisodes()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-amber-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🦘</div>
              <div>
                <h1 className="text-2xl font-bold text-sunny-brown">Sunny's Cozy Quokka</h1>
                <p className="text-sm text-sunny-gold">Bedtime Tales</p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm text-sunny-brown">
                <span className="font-bold">{episodes.length}</span> Stories
              </p>
              <p className="text-xs text-sunny-gold">Perfect for bedtime</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-sunny-brown mb-4 leading-tight">
            Join Sunny on Cozy Adventures
          </h2>
          <p className="text-lg text-sunny-brown/80 mb-8 max-w-2xl mx-auto">
            Gentle bedtime stories featuring Sunny the quokka exploring the Australian bush.
            Perfect for children ages 1-5 to wind down before sleep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://gumroad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-sunny-brown text-white rounded-full font-semibold hover:bg-sunny-brown/90 transition"
            >
              Read Stories on Gumroad
            </a>
            <a
              href="https://www.etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border-2 border-sunny-brown text-sunny-brown rounded-full font-semibold hover:bg-sunny-brown/10 transition"
            >
              Shop on Etsy
            </a>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h3 className="text-2xl font-bold text-sunny-brown mb-8">All Stories</h3>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-sunny-brown/60">Loading stories...</p>
          </div>
        ) : episodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sunny-brown/60">Stories loading from your collection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/episodes/${episode.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  {/* Cover Image */}
                  <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-sunny-gold to-yellow-100 overflow-hidden">
                    {episode.thumbnailPath ? (
                      <img
                        src={episode.thumbnailPath}
                        alt={episode.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
                        🦘
                      </div>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-sunny-brown text-sm line-clamp-2 mb-2 group-hover:text-sunny-gold transition">
                      {episode.title}
                    </h4>
                    <p className="text-xs text-sunny-brown/60 line-clamp-2 mb-3">
                      {episode.description}
                    </p>
                    <div className="flex items-center text-xs text-sunny-gold font-semibold">
                      Read Story →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Products Section */}
      <section className="bg-white/50 backdrop-blur-sm border-t border-amber-200/50 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-sunny-brown mb-8 text-center">Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Colored Ebook */}
            <div className="text-center p-6 rounded-lg bg-white/60 border border-sunny-gold/30">
              <div className="text-4xl mb-3">📖</div>
              <h4 className="text-lg font-bold text-sunny-brown mb-2">Colored Ebook</h4>
              <p className="text-sm text-sunny-brown/70 mb-3">Full-color illustrated stories</p>
              <p className="text-xl font-bold text-sunny-gold">$3.99</p>
            </div>

            {/* Coloring Book */}
            <div className="text-center p-6 rounded-lg bg-white/60 border border-sunny-gold/30">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="text-lg font-bold text-sunny-brown mb-2">Coloring Book</h4>
              <p className="text-sm text-sunny-brown/70 mb-3">Printable & interactive</p>
              <p className="text-xl font-bold text-sunny-gold">$2.99</p>
            </div>

            {/* Phonics Book */}
            <div className="text-center p-6 rounded-lg bg-white/60 border border-sunny-gold/30">
              <div className="text-4xl mb-3">🔤</div>
              <h4 className="text-lg font-bold text-sunny-brown mb-2">Phonics Book</h4>
              <p className="text-sm text-sunny-brown/70 mb-3">Learn to read with Sunny</p>
              <p className="text-xl font-bold text-sunny-gold">$3.99</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/30 border-t border-amber-200/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-sunny-brown/70">
            © 2024 Sunny's Cozy Quokka Bedtime Tales by Jamie Wigg
          </p>
          <p className="text-xs text-sunny-brown/50 mt-2">
            Perfect bedtime stories for children ages 1-5
          </p>
        </div>
      </footer>
    </div>
  )
}
