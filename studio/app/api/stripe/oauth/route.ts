/**
 * GET /api/stripe/oauth/auth — Generate Stripe Connect OAuth URL
 * GET /api/stripe/oauth/callback — Handle OAuth redirect, exchange code for account_id
 * GET /api/stripe/oauth/status — Check onboarding progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logRequest, logError } from '@/lib/logging';
import { verifyJWT } from '@/lib/auth';

/**
 * GET /api/stripe/oauth/auth
 * Generate Stripe Connect OAuth authorization URL
 */
export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const url = new URL(req.url);

  // Route detection: /oauth/auth, /oauth/callback, or /oauth/status
  const pathname = url.pathname;

  if (pathname.includes('/oauth/auth')) {
    return handleAuthUrl(req, requestId);
  } else if (pathname.includes('/oauth/callback')) {
    return handleOAuthCallback(req, requestId);
  } else if (pathname.includes('/oauth/status')) {
    return handleStatus(req, requestId);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

/**
 * Handle auth URL generation
 */
async function handleAuthUrl(req: NextRequest, requestId: string) {
  logRequest(requestId, 'GET /api/stripe/oauth/auth');

  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    let userId: string;

    try {
      userId = verifyJWT(token);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // TODO: Get Stripe client ID from env
    const stripeClientId = process.env.STRIPE_CONNECT_CLIENT_ID;
    if (!stripeClientId) {
      throw new Error('STRIPE_CONNECT_CLIENT_ID not configured');
    }

    // Generate OAuth URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/oauth/callback`;
    const state = crypto.randomUUID(); // State for CSRF protection

    // TODO: Store state in session/cache mapped to user_id (with 10-min expiry)

    const oauthUrl = new URL('https://connect.stripe.com/oauth/authorize');
    oauthUrl.searchParams.set('client_id', stripeClientId);
    oauthUrl.searchParams.set('state', state);
    oauthUrl.searchParams.set('stripe_user[email]', userId); // User context
    oauthUrl.searchParams.set('stripe_user[business_type]', 'individual');
    oauthUrl.searchParams.set('scope', 'read_write');

    logRequest(requestId, 'GET /api/stripe/oauth/auth', 'success');

    return NextResponse.json(
      {
        authorization_url: oauthUrl.toString(),
        state,
      },
      { status: 200 }
    );
  } catch (error) {
    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle OAuth callback
 * Query params: ?code=<code>&state=<state>&stripe_user_id=<id>
 */
async function handleOAuthCallback(req: NextRequest, requestId: string) {
  logRequest(requestId, 'GET /api/stripe/oauth/callback');

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const stripeUserId = url.searchParams.get('stripe_user_id');

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state parameter' },
        { status: 400 }
      );
    }

    // Verify JWT token (from redirect URL or session)
    const authHeader = req.headers.get('authorization');
    let userId: string = 'unknown';

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        userId = verifyJWT(token);
      } catch (err) {
        // Continue without auth, use fallback
      }
    }

    // TODO: Verify state against stored state (CSRF protection)
    // TODO: Call Stripe API to exchange code for account_id
    // TODO: Call Stripe API with: client_id, client_secret, grant_type=authorization_code

    // Mock Stripe token exchange
    const stripeAccountId = stripeUserId || `acct_${crypto.randomUUID()}`;

    // TODO: Update creators table: set stripe_account_id, stripe_onboarded=true
    // TODO: Fetch account to verify charges_enabled

    logRequest(requestId, 'GET /api/stripe/oauth/callback', 'success', {
      stripeAccountId,
    });

    // Redirect to dashboard or confirmation page
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/creator/stripe-connect-success?account_id=${stripeAccountId}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    logError(requestId, 'OAuth callback error', error);

    const errorUrl = `${process.env.NEXT_PUBLIC_APP_URL}/creator/stripe-connect-error?error=oauth_failed`;
    return NextResponse.redirect(errorUrl);
  }
}

/**
 * GET /api/stripe/oauth/status
 * Check account onboarding status
 */
async function handleStatus(req: NextRequest, requestId: string) {
  logRequest(requestId, 'GET /api/stripe/oauth/status');

  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    let userId: string;

    try {
      userId = verifyJWT(token);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // TODO: Fetch creator record to get stripe_account_id
    // TODO: Call Stripe API to get account status: /v1/accounts/{account_id}
    // TODO: Extract: charges_enabled, payouts_enabled, requirements

    const status = {
      stripe_account_id: 'acct_123456',
      charges_enabled: true,
      payouts_enabled: false,
      requirements: {
        currently_due: ['business_profile.mcc'],
        eventually_due: [],
        past_due: [],
      },
      onboarding_complete: true,
    };

    logRequest(requestId, 'GET /api/stripe/oauth/status', 'success');

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    logError(requestId, 'Unexpected error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stripe/oauth (alternative POST endpoint)
 */
export async function POST(req: NextRequest) {
  return GET(req);
}
