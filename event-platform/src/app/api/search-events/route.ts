import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface SearchRequest {
  query: string;
  limit?: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  latitude?: number;
  longitude?: number;
}

// Simple semantic search using string matching and TF-IDF-like scoring
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textWords = text.toLowerCase().split(/\s+/);

  let matches = 0;
  let weights = 0;

  queryWords.forEach((word) => {
    // Exact word match
    if (textWords.includes(word)) {
      matches += 2;
      weights += 2;
    }
    // Partial match (substring)
    else if (textWords.some((w) => w.includes(word) || word.includes(w))) {
      matches += 1;
      weights += 1;
    }
  });

  // Return normalized similarity score (0-1)
  return weights > 0 ? matches / (queryWords.length * 2) : 0;
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();
    const { query, limit = 10 } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query cannot be empty' },
        { status: 400 }
      );
    }

    // Fetch all events from Supabase
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    // Score events based on semantic similarity
    const scoredEvents = (events as Event[]).map((event) => {
      // Calculate similarity across title, description, and location
      const titleScore = calculateSimilarity(query, event.title) * 3; // Title weighted higher
      const descriptionScore = calculateSimilarity(query, event.description || '');
      const locationScore = calculateSimilarity(query, event.location) * 1.5;

      const totalScore = (titleScore + descriptionScore + locationScore) / 5.5;

      return {
        event,
        score: totalScore,
      };
    });

    // Sort by score (highest first) and filter out low scores
    const results = scoredEvents
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => ({
        ...item.event,
        relevanceScore: Math.round(item.score * 100), // 0-100
      }));

    return NextResponse.json({
      success: true,
      query,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint returns search examples
export async function GET() {
  return NextResponse.json({
    description: 'Semantic event search API',
    usage: {
      method: 'POST',
      endpoint: '/api/search-events',
      body: {
        query: 'tech conference downtown',
        limit: 10,
      },
    },
    examples: [
      'tech events this weekend',
      'networking happy hour',
      'python workshop',
      'events in downtown',
      'free community events',
    ],
  });
}
