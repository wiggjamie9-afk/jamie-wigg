import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Auth will be unavailable.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  subscription_tier: 'free' | 'pro' | 'studio';
  created_at: string;
  credits_remaining: number;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.session.user.id)
    .single();

  return profile as User | null;
}

export async function signUp(email: string, password: string): Promise<void> {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message || 'Failed to sign up');
  }

  // Create user profile with free tier
  if (data.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          subscription_tier: 'free',
          credits_remaining: 0,
          created_at: new Date().toISOString(),
        }
      ])
      .single();

    if (profileError) {
      console.error('Failed to create user profile:', profileError);
      // Don't throw here as auth user was created; they can try again
    }
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message || 'Failed to sign in');
  }

  // Ensure user profile exists (migration case)
  if (data.user) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.user.id)
      .single();

    if (!existingUser) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            subscription_tier: 'free',
            credits_remaining: 0,
            created_at: new Date().toISOString(),
          }
        ])
        .single();

      if (profileError) {
        console.error('Failed to create user profile on login:', profileError);
      }
    }
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

export async function getSubscriptionStatus(): Promise<{ tier: string; active: boolean } | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('active', true)
    .single();

  return subscription ? { tier: subscription.tier, active: true } : { tier: 'free', active: false };
}

/**
 * Verify JWT token from Authorization header (API route usage)
 * Extracts and validates the token, returns user_id
 *
 * @param token JWT token string (without "Bearer " prefix)
 * @returns user_id extracted from token claims
 * @throws Error if token is invalid or expired
 */
export function verifyJWT(token: string): string {
  try {
    // Decode JWT payload (base64url)
    // Note: This does NOT verify the signature — integration with your auth provider
    // (Supabase, Auth0, etc.) should verify the signature server-side
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    );

    // Check expiration (exp claim is in seconds since epoch)
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error('Token expired');
    }

    // Extract user_id (common claim names: sub, user_id, uid)
    const userId = payload.sub || payload.user_id || payload.uid;
    if (!userId) {
      throw new Error('No user_id found in token');
    }

    return userId;
  } catch (error) {
    throw new Error(`Invalid token: ${error instanceof Error ? error.message : 'unknown'}`);
  }
}

/**
 * Extract user_id from Authorization header
 * Returns null if header is missing or invalid
 *
 * @param authHeader Authorization header value (e.g., "Bearer <token>")
 * @returns user_id or null
 */
export function extractUserFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.slice(7);
    return verifyJWT(token);
  } catch {
    return null;
  }
}

/**
 * Check if user has ownership of a resource
 *
 * @param resourceOwnerId ID of the resource owner
 * @param currentUserId ID of the current user
 * @returns true if user owns the resource
 */
export function userOwnsResource(resourceOwnerId: string, currentUserId: string): boolean {
  return resourceOwnerId === currentUserId;
}

/**
 * Check if user is in a list of allowed users (e.g., collaborators)
 *
 * @param userId User to check
 * @param allowedUsers List of allowed user IDs
 * @returns true if user is in the allowed list
 */
export function userIsAllowed(userId: string, allowedUsers: string[]): boolean {
  return allowedUsers.includes(userId);
}
