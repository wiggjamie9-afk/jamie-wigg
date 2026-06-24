'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  subscription_tier: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();

    // Check for success query param from Stripe checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setShowSuccess(true);
      // Clear the success param from URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-starlightmix-bg flex items-center justify-center">
        <div className="font-starlightmix-mono text-starlightmix-text-muted">Loading dashboard...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-starlightmix-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-starlightmix-text-muted mb-4 font-starlightmix-mono">Redirecting to sign in...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-starlightmix-bg text-starlightmix-text">
      <nav className="border-b border-starlightmix-border p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-starlightmix-display text-3xl font-black slm-text-gradient">
            STARLIGHTMIX
          </Link>
          <div className="flex items-center gap-6">
            <span className="font-starlightmix-mono text-sm text-starlightmix-text-muted">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-starlightmix-accent hover:opacity-90 rounded-lg font-starlightmix-mono text-sm font-semibold transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {showSuccess && (
          <div className="mb-8 p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-300 font-starlightmix-mono text-sm">
            Payment successful! Your subscription has been updated.
          </div>
        )}

        <div className="mb-12">
          <h2 className="font-starlightmix-display text-4xl font-black mb-4 slm-text-gradient">Welcome back!</h2>
          <div className="flex items-center gap-8">
            <div>
              <p className="text-starlightmix-text-muted font-starlightmix-mono text-sm mb-2">Current Plan</p>
              <p className="text-3xl font-bold text-starlightmix-accent capitalize">{user.subscription_tier}</p>
            </div>
            <Link
              href="/settings"
              className="px-6 py-3 bg-starlightmix-border hover:bg-starlightmix-border/70 rounded-lg font-starlightmix-mono text-sm font-semibold transition"
            >
              Manage Subscription
            </Link>
          </div>
        </div>

        {user.subscription_tier === 'free' && (
          <div className="bg-starlightmix-card rounded-lg p-8 border border-starlightmix-border mb-8">
            <h3 className="font-starlightmix-display text-2xl font-bold mb-4">Upgrade Your Plan</h3>
            <p className="text-starlightmix-text-muted mb-6 font-starlightmix-mono">
              Unlock unlimited videos, premium models, and more.
            </p>
            <Link
              href="/?upgrade=true"
              className="inline-block px-6 py-3 bg-starlightmix-accent hover:opacity-90 rounded-lg font-starlightmix-mono text-sm font-semibold transition"
            >
              View Upgrade Options
            </Link>
          </div>
        )}

        <div className="bg-starlightmix-card rounded-lg p-8 border border-starlightmix-border">
          <h3 className="font-starlightmix-display text-2xl font-bold mb-4">Create Your Video</h3>
          <p className="text-starlightmix-text-muted mb-6 font-starlightmix-mono">
            Ready to generate your first AI music video?
          </p>

          {user.subscription_tier === 'free' ? (
            <p className="text-starlightmix-text-muted text-sm font-starlightmix-mono">
              Upgrade to Pro or Studio to start creating videos.
            </p>
          ) : (
            <button
              disabled
              className="px-6 py-3 bg-starlightmix-accent hover:opacity-90 rounded-lg font-starlightmix-mono text-sm font-semibold transition opacity-50 cursor-not-allowed"
              title="Video generation coming in Phase 2"
            >
              Create Video (Coming Soon)
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
