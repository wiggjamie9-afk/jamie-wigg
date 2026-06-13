import { useState, useCallback } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  latitude?: number;
  longitude?: number;
  relevanceScore: number;
}

interface SearchResponse {
  success: boolean;
  query: string;
  results: SearchResult[];
  total: number;
}

export function useEventSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string, limit = 10) => {
    if (!searchQuery.trim()) {
      setError('Search query cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const response = await fetch('/api/search-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit }),
      });

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      if (!data.success) {
        throw new Error(data.query || 'Search failed');
      }

      setResults(data.results);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setResults([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
  }, []);

  return {
    search,
    results,
    loading,
    error,
    query,
    clearResults,
  };
}
