import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

interface GenerationRequest {
  type: 'video' | 'music' | 'image';
  prompt: string;
  duration?: string;
  aspectRatio?: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { type, prompt, duration, aspectRatio, userId } = body;

    if (!type || !prompt || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check user subscription
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let contentUrl = '';
    let thumbnailUrl = '';
    let duration_seconds = 0;

    // Route to appropriate generation service
    if (type === 'video') {
      const result = await generateVideo(prompt, duration || '60s');
      contentUrl = result.url;
      thumbnailUrl = result.thumbnail;
      duration_seconds = parseInt(duration || '60');
    } else if (type === 'music') {
      const result = await generateMusic(prompt);
      contentUrl = result.url;
      duration_seconds = result.duration || 60;
    } else if (type === 'image') {
      const result = await generateImage(prompt);
      contentUrl = result.url;
      thumbnailUrl = result.url;
    }

    // Save to database
    const { data: content, error } = await supabase
      .from('content')
      .insert([
        {
          user_id: userId,
          type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${new Date().toLocaleDateString()}`,
          description: prompt,
          prompt,
          url: contentUrl,
          thumbnail_url: thumbnailUrl,
          duration_seconds,
          status: 'ready',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${type} generated successfully`,
        content,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Content generation failed' },
      { status: 500 }
    );
  }
}

async function generateVideo(
  prompt: string,
  duration: string
): Promise<{ url: string; thumbnail: string }> {
  // Using Replicate API for video generation
  const durationSeconds = parseInt(duration);

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stable-diffusion-model', // Replace with actual video model
      input: {
        prompt,
        duration: durationSeconds,
      },
    }),
  });

  const result = await response.json();

  // Mock response for development
  return {
    url: `https://example.com/video/${Date.now()}.mp4`,
    thumbnail: `https://via.placeholder.com/1920x1080?text=${encodeURIComponent(prompt.substring(0, 20))}`,
  };
}

async function generateMusic(
  prompt: string
): Promise<{ url: string; duration: number }> {
  // Using Replicate API for music generation
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'musicgen-model', // Replace with actual music model
      input: {
        description: prompt,
        duration: 30,
      },
    }),
  });

  const result = await response.json();

  // Mock response for development
  return {
    url: `https://example.com/music/${Date.now()}.wav`,
    duration: 30,
  };
}

async function generateImage(
  prompt: string
): Promise<{ url: string }> {
  // Using Replicate API for image generation (FLUX or similar)
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'flux-pro', // Or another image model
      input: {
        prompt,
        num_outputs: 1,
      },
    }),
  });

  const result = await response.json();

  // Mock response for development
  return {
    url: `https://via.placeholder.com/1080x1080?text=${encodeURIComponent(prompt.substring(0, 20))}`,
  };
}
