'use client';

import { useState } from 'react';
import { useEventSearch, SearchResult } from '@/hooks/useEventSearch';

interface EventSearchProps {
  onResultsFound?: (results: SearchResult[]) => void;
}

export function EventSearch({ onResultsFound }: EventSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const { search, results, loading, error, clearResults } = useEventSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await search(inputValue);
      if (response && onResultsFound) {
        onResultsFound(response.results);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleClear = () => {
    setInputValue('');
    clearResults();
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search events... (e.g., 'tech workshop downtown')"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-var(--color-accent)"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-var(--color-accent) text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Quick Suggestions */}
        {!results.length && !error && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Try: "tech events", "networking", "this weekend", "downtown"
          </div>
        )}
      </form>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              Found {results.length} event{results.length !== 1 ? 's' : ''}
            </h3>
            <button
              onClick={handleClear}
              className="text-xs text-var(--color-accent) hover:underline"
            >
              Clear search
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((event) => (
              <div
                key={event.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
                      <div>📅 {event.date} • ⏰ {event.time}</div>
                      <div>📍 {event.location}</div>
                    </div>
                  </div>
                  <div className="ml-2 px-2 py-1 bg-var(--color-accent)/10 text-var(--color-accent) rounded text-xs font-medium whitespace-nowrap">
                    {event.relevanceScore}% match
                  </div>
                </div>
                {event.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && inputValue && (
        <div className="p-6 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">No events found matching "{inputValue}"</p>
          <p className="text-xs mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
