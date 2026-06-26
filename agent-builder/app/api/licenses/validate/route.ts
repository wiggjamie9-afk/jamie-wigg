/**
 * License Validation Endpoint
 * Apps call this to verify a user has purchased access
 * GET /api/licenses/validate?key=LICENSE_KEY
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');

  if (!key) {
    return NextResponse.json(
      { error: 'License key required' },
      { status: 400 }
    );
  }

  try {
    // Validate license key
    const { data, error } = await supabase
      .rpc('validate_license', { p_license_key: key })
      .single();

    if (error) {
      console.error('License validation error:', error);
      return NextResponse.json(
        { error: 'Invalid license key' },
        { status: 401 }
      );
    }

    if (!data || !data.is_valid) {
      return NextResponse.json(
        { error: 'License expired or invalid' },
        { status: 401 }
      );
    }

    // Record session
    const { data: purchase } = await supabase
      .from('user_purchases')
      .select('id')
      .eq('license_key', key)
      .single();

    if (purchase) {
      await supabase.from('app_sessions').insert({
        purchase_id: purchase.id,
        app_id: data.app_id,
        is_premium_user: data.is_premium,
        user_agent: request.headers.get('user-agent'),
      });
    }

    return NextResponse.json(
      {
        valid: true,
        app_id: data.app_id,
        app_name: data.app_name,
        is_premium: data.is_premium,
        user_id: data.user_id,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error('License validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for Gumroad webhook integration
 * Gumroad sends purchase confirmations here
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Verify this is from Gumroad (in production, verify signature)
  if (!body.email || !body.product_id) {
    return NextResponse.json(
      { error: 'Invalid Gumroad payload' },
      { status: 400 }
    );
  }

  try {
    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', body.email)
      .single();

    if (userError || !user) {
      // Create user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: body.email,
          name: body.name || 'Customer',
          tier: 'starter',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      if (newUser) {
        await recordPurchase(newUser.id, body);
      }
    } else {
      await recordPurchase(user.id, body);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Purchase recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record purchase' },
      { status: 500 }
    );
  }
}

/**
 * Helper: Record a purchase from Gumroad
 */
async function recordPurchase(
  userId: string,
  gumroadData: Record<string, any>
) {
  // Extract app info from product name
  // Example: "Motivation Expert" -> app_id: "motivation-expert"
  const appName = gumroadData.product_name || 'Unknown App';
  const appId = appName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Generate license key
  const licenseKey = `LIC-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

  // Record purchase
  const { data, error } = await supabase
    .from('user_purchases')
    .insert({
      user_id: userId,
      app_id: appId,
      app_name: appName,
      license_key: licenseKey,
      is_premium: false,
      is_lifetime: true,
      gumroad_transaction_id: gumroadData.transaction_id,
      gumroad_product_id: gumroadData.product_id,
      price_paid: parseFloat(gumroadData.price) || 0,
      currency: gumroadData.currency || 'USD',
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording purchase:', error);
    throw error;
  }

  // Record revenue event
  await supabase.from('revenue_events').insert({
    user_id: userId,
    event_type: 'purchase',
    app_id: appId,
    amount: parseFloat(gumroadData.price) || 0,
    currency: gumroadData.currency || 'USD',
    source: 'gumroad',
    gumroad_transaction_id: gumroadData.transaction_id,
    metadata: {
      product_name: appName,
      buyer_email: gumroadData.email,
    },
  });

  return data;
}
