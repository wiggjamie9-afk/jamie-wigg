import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const period = request.nextUrl.searchParams.get('period') || 'month'; // 'day', 'week', 'month'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    if (period === 'day') {
      startDate.setDate(now.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (analyticsError) {
      return NextResponse.json(
        { error: analyticsError.message },
        { status: 400 }
      );
    }

    // Calculate totals
    const totalViews = analytics?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;
    const totalLikes = analytics?.reduce((sum, a) => sum + (a.likes || 0), 0) || 0;
    const totalComments = analytics?.reduce((sum, a) => sum + (a.comments || 0), 0) || 0;
    const totalShares = analytics?.reduce((sum, a) => sum + (a.shares || 0), 0) || 0;
    const totalEngagements = totalLikes + totalComments + totalShares;
    const engagementRate =
      totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(2) : '0.00';

    // Platform breakdown
    const platformStats = new Map<string, any>();
    analytics?.forEach((a) => {
      const key = a.platform;
      if (!platformStats.has(key)) {
        platformStats.set(key, {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          engagements: 0,
        });
      }
      const stat = platformStats.get(key);
      stat.views += a.views || 0;
      stat.likes += a.likes || 0;
      stat.comments += a.comments || 0;
      stat.shares += a.shares || 0;
      stat.engagements += (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
    });

    // Top posts
    const { data: topPosts } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(5);

    // Get user earnings
    const { data: earnings } = await supabase
      .from('earnings')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    const totalEarnings = earnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

    return NextResponse.json(
      {
        success: true,
        period,
        analytics: {
          totalViews,
          totalEngagements,
          engagementRate,
          totalLikes,
          totalComments,
          totalShares,
          totalEarnings,
          platformStats: Object.fromEntries(platformStats),
          topPosts,
          dataPoints: analytics || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
