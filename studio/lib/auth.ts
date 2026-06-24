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
