import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ScheduleRequest {
  userId: string;
  contentId?: string;
  caption: string;
  platforms: string[];
  scheduleTime: string;
  mediaUrls?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ScheduleRequest = await request.json();
    const { userId, contentId, caption, platforms, scheduleTime, mediaUrls } = body;

    if (!userId || !caption || !platforms || !scheduleTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user exists
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

    // Create scheduled post
    const { data: post, error } = await supabase
      .from('scheduled_posts')
      .insert([
        {
          user_id: userId,
          content_id: contentId || null,
          caption,
          platforms,
          schedule_time: scheduleTime,
          media_urls: mediaUrls || [],
          status: 'scheduled',
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

    // TODO: Schedule posting jobs for each platform
    // TODO: Set up webhooks for actual posting

    return NextResponse.json(
      {
        success: true,
        message: `Post scheduled for ${platforms.join(', ')}`,
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Scheduling error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const { data: posts, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('user_id', userId)
      .order('schedule_time', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        posts,
        count: posts?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
