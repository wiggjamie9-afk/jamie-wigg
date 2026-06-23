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

export async function signUp(email: string, password: string): Promise<{ user: any; error: any }> {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string): Promise<{ user: any; error: any }> {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
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
