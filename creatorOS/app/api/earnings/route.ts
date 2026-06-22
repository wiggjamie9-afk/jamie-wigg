import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Fetch monthly earnings (current month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const { data: monthlyEarnings } = await supabase
      .from('earnings')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('created_at', monthStart.toISOString())
      .lt('created_at', monthEnd.toISOString());

    const monthly = monthlyEarnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

    // Fetch total earnings (all time)
    const { data: allEarnings } = await supabase
      .from('earnings')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'completed');

    const total = allEarnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

    // Count paying supporters (unique users who have contributed)
    const { data: supporters } = await supabase
      .from('user_memberships')
      .select('user_id')
      .eq('active', true);

    return NextResponse.json(
      {
        monthly,
        total,
        supporters: supporters?.length || 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Earnings fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}
