import React, { useState } from 'react';
import { usePlatformStore } from '../store';

export function ToolBrowser() {
  const { tools, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = usePlatformStore();
  const [view, setView] = useState<'category' | 'search'>('category');

  const categories = Array.from(new Set(tools.map((t) => t.category))).sort();
  const filtered = view === 'search' ? tools.filter((t) => t.name.includes(searchQuery)) : selectedCategory ? tools.filter((t) => t.category === selectedCategory) : [];

  return (
    <div className="max-w-7xl">
      <h2 className="text-3xl font-bold mb-6">Tool Browser</h2>

      {/* Search/Category Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setView('category');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg transition-all ${
            view === 'category'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          Browse Categories
        </button>
        <button
          onClick={() => setView('search')}
          className={`px-4 py-2 rounded-lg transition-all ${
            view === 'search'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          Search Tools
        </button>
      </div>

      {view === 'search' ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search tools by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.slice(0, 20).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Categories Sidebar */}
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                }`}
              >
                {cat} ({tools.filter((t) => t.category === cat).length})
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="lg:col-span-3">
            {selectedCategory ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">{selectedCategory}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <p className="text-lg">Select a category to browse tools</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool }: { tool: any }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
      <div className="mb-3">
        <h4 className="font-semibold text-cyan-400">{tool.name}</h4>
        <p className="text-xs text-slate-400">{tool.category}</p>
      </div>
      <p className="text-sm text-slate-300 mb-3 line-clamp-2">{tool.description}</p>
      <div className="flex items-center gap-2 text-xs">
        {tool.freetier && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Free Tier</span>}
        {tool.enabled ? (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Enabled</span>
        ) : (
          <span className="px-2 py-1 bg-slate-600/50 text-slate-400 rounded">Disabled</span>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-2 truncate">{tool.endpoint}</p>
    </div>
  );
}
