import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { userId, referrerCode } = await request.json();

    if (!userId || !referrerCode) {
      return NextResponse.json(
        { error: 'Missing userId or referrerCode' },
        { status: 400 }
      );
    }

    // Find referrer by code
    const { data: referrer } = await supabase
      .from('users')
      .select('id, email')
      .eq('referral_code', referrerCode)
      .single();

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Record referral
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referred_user_id: userId,
        status: 'pending',
        reward_amount: 10,
        created_at: new Date().toISOString(),
      });

    if (referralError) throw referralError;

    // Award referrer immediately ($10 credit)
    const { error: earningsError } = await supabase
      .from('earnings')
      .insert({
        user_id: referrer.id,
        method: 'referral',
        amount: 10,
        currency: 'USD',
        description: `Referral reward for new signup (${userId})`,
        status: 'completed',
        created_at: new Date().toISOString(),
      });

    if (earningsError) throw earningsError;

    return NextResponse.json(
      {
        success: true,
        message: `$10 referral reward awarded to ${referrer.email}`,
        referrerId: referrer.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Referral error:', error);
    return NextResponse.json(
      { error: 'Failed to process referral' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Get user's referral code
    const { data: user } = await supabase
      .from('users')
      .select('referral_code')
      .eq('id', userId)
      .single();

    // Get referral stats
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    const { data: earnings } = await supabase
      .from('earnings')
      .select('amount')
      .eq('user_id', userId)
      .eq('method', 'referral');

    const totalEarnings = earnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
    const referralCount = referrals?.length || 0;

    return NextResponse.json({
      referralCode: user?.referral_code,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL}?ref=${user?.referral_code}`,
      referralCount,
      totalEarnings,
      referrals: referrals || [],
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}
