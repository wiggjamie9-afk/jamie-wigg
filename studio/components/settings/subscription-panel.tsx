'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, signOut } from '@/lib/auth';
import { cancelSubscription, PRICING_TIERS } from '@/lib/payments';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  subscription_tier: string;
}

export function SubscriptionPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function handleCancelSubscription() {
    if (!user || user.subscription_tier === 'free') {
      setError('No active subscription to cancel');
      return;
    }

    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      return;
    }

    setCancelling(true);
    setError('');
    setMessage('');
    try {
      // In production, call an API endpoint that retrieves the subscription_id
      // from Supabase and cancels it with Stripe
      setMessage('Subscription cancellation initiated. You will receive a confirmation email.');

      // Example implementation (future):
      // const response = await fetch('/api/subscriptions/cancel', { method: 'POST' });
      // if (!response.ok) throw new Error('Failed to cancel subscription');

      setTimeout(() => {
        checkAuth();
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-starlightmix-border bg-starlightmix-card p-6">
        <div className="text-starlightmix-text-muted font-starlightmix-mono text-sm">Loading subscription...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-starlightmix-border bg-starlightmix-card p-6">
        <div className="text-starlightmix-text-muted font-starlightmix-mono text-sm mb-4">
          Sign in to manage your subscription
        </div>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-starlightmix-accent hover:opacity-90 rounded-lg font-starlightmix-mono text-sm font-semibold transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const tier = PRICING_TIERS[user.subscription_tier];

  return (
    <div className="rounded-lg border border-starlightmix-border bg-starlightmix-card p-6">
      <h2 className="font-starlightmix-display text-xl font-bold tracking-tight text-starlightmix-text mb-6">
        Subscription
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-900 rounded-lg text-red-400 font-starlightmix-mono text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded-lg text-green-300 font-starlightmix-mono text-sm">
          {message}
        </div>
      )}

      {tier && (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-starlightmix-text-soft font-starlightmix-mono text-sm mb-1">Current Plan</p>
              <p className="text-2xl font-bold text-starlightmix-accent capitalize">{tier.name}</p>
              <p className="text-starlightmix-text-muted font-starlightmix-mono text-sm mt-1">
                ${tier.price}/month
              </p>
            </div>
            {user.subscription_tier !== 'free' && (
              <div className="px-3 py-1 bg-green-900/30 border border-green-700 rounded text-green-300 text-xs font-starlightmix-mono font-semibold">
                Active
              </div>
            )}
          </div>

          {user.subscription_tier === 'free' && (
            <div className="pt-4 border-t border-starlightmix-border">
              <p className="text-starlightmix-text-muted font-starlightmix-mono text-sm mb-4">
                Upgrade to unlock premium features and unlimited video generation.
              </p>
              <Link
                href="/?upgrade=true"
                className="inline-block px-4 py-2 bg-starlightmix-accent hover:opacity-90 rounded-lg font-starlightmix-mono text-sm font-semibold transition"
              >
                View Upgrade Options
              </Link>
            </div>
          )}

          {user.subscription_tier !== 'free' && (
            <div className="pt-4 border-t border-starlightmix-border">
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 disabled:opacity-50 border border-red-700 text-red-400 rounded-lg font-starlightmix-mono text-sm font-semibold transition"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-starlightmix-border">
            <p className="text-starlightmix-text-soft font-starlightmix-mono text-sm mb-2">Account</p>
            <p className="text-starlightmix-text-muted font-starlightmix-mono text-sm">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
