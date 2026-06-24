'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signIn, signUp, signOut } from '@/lib/auth';
import { createCheckoutSession, PRICING_TIERS } from '@/lib/payments';

interface User {
  id: string;
  email: string;
  subscription_tier: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Redirect authenticated users to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleAuth() {
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      // After auth succeeds, check user and redirect
      await checkAuth();
      setEmail('');
      setPassword('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleCheckout(tierId: string) {
    if (!user) {
      setError('Please sign in first');
      return;
    }

    setAuthLoading(true);
    try {
      const { url } = await createCheckoutSession(
        user.id,
        tierId,
        `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard?success=true`,
        `${typeof window !== 'undefined' ? window.location.origin : ''}`
      );

      if (url) {
        window.location.href = url;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-starlightmix-bg flex items-center justify-center">
        <div className="font-starlightmix-mono text-starlightmix-text-muted">Loading...</div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen bg-starlightmix-bg text-starlightmix-text">
        <nav className="border-b border-starlightmix-border p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="font-starlightmix-display text-3xl font-black slm-text-gradient">STARLIGHTMIX</h1>
            <button
              onClick={() => {
                signOut();
                checkAuth();
              }}
              className="px-4 py-2 bg-starlightmix-accent hover:opacity-90 rounded-lg font-starlightmix-mono text-sm font-semibold"
            >
              Sign Out
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-12">
            <h2 className="font-starlightmix-display text-4xl font-black mb-2 slm-text-gradient">Welcome back!</h2>
            <p className="text-starlightmix-text-muted font-starlightmix-mono">
              Tier: <span className="text-starlightmix-accent font-bold">{user.subscription_tier}</span>
            </p>
          </div>

          {user.subscription_tier === 'free' && (
            <div className="bg-starlightmix-card rounded-lg p-8 border border-starlightmix-border">
              <h3 className="font-starlightmix-display text-2xl font-bold mb-8">Unlock Premium Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(PRICING_TIERS)
                  .filter(([_, tier]) => tier.price > 0)
                  .map(([key, tier]) => (
                    <div
                      key={key}
                      className="bg-starlightmix-bg rounded-lg p-6 border border-starlightmix-border hover:border-starlightmix-accent transition"
                    >
                      <h4 className="font-starlightmix-display font-bold text-xl mb-2">{tier.name}</h4>
                      <p className="text-3xl font-bold mb-1 text-starlightmix-accent">
                        ${tier.price}
                        <span className="text-lg text-starlightmix-text-muted">/month</span>
                      </p>
                      <ul className="space-y-2 mb-6 text-sm text-starlightmix-text-muted">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-starlightmix-accent mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleCheckout(key)}
                        disabled={authLoading}
                        className="w-full px-4 py-2 bg-starlightmix-accent hover:opacity-90 disabled:opacity-50 rounded-lg font-starlightmix-mono text-sm font-semibold transition"
                      >
                        {authLoading ? 'Processing...' : `Upgrade to ${tier.name}`}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {user.subscription_tier !== 'free' && (
            <div className="bg-starlightmix-card rounded-lg p-8 border border-starlightmix-border">
              <h3 className="font-starlightmix-display text-2xl font-bold mb-4">Create Your Video</h3>
              <p className="text-starlightmix-text-muted mb-6">
                Ready to generate your first AI music video? Coming soon.
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-starlightmix-bg">
      <nav className="border-b border-starlightmix-border p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-starlightmix-display text-3xl font-black slm-text-gradient">STARLIGHTMIX Studio</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 flex-1">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-starlightmix-display text-5xl font-black mb-4 slm-text-gradient">AI Music Videos</h2>
            <p className="text-xl text-starlightmix-text-muted mb-4 font-starlightmix-mono">
              Paste your Replicate token. Upload a track. Pick a vibe. Get a stunning AI-generated music video in seconds.
            </p>
            <p className="text-starlightmix-text-muted mb-8 font-starlightmix-mono text-sm">
              Powered by FLUX 1.1 Pro, HunyuanVideo & MusicGen. Zero server-side storage.
            </p>
          </div>
          <div className="bg-starlightmix-card rounded-lg aspect-video border border-starlightmix-border flex items-center justify-center">
            <p className="text-starlightmix-text-muted font-starlightmix-mono">Preview</p>
          </div>
        </div>

        <div className="bg-starlightmix-card rounded-lg p-8 border border-starlightmix-border mb-12">
          <h3 className="font-starlightmix-display text-2xl font-bold mb-6">Get Started</h3>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400 font-starlightmix-mono text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authLoading}
                className="w-full px-4 py-3 bg-starlightmix-bg border border-starlightmix-border rounded-lg text-starlightmix-text placeholder-starlightmix-text-muted font-starlightmix-mono disabled:opacity-50"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authLoading}
                className="w-full px-4 py-3 bg-starlightmix-bg border border-starlightmix-border rounded-lg text-starlightmix-text placeholder-starlightmix-text-muted font-starlightmix-mono disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAuth}
                disabled={authLoading}
                className="w-full px-6 py-3 bg-starlightmix-accent hover:opacity-90 disabled:opacity-50 rounded-lg font-starlightmix-mono font-bold transition flex-1"
              >
                {authLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                disabled={authLoading}
                className="w-full px-6 py-3 bg-starlightmix-border hover:bg-starlightmix-border/50 disabled:opacity-50 rounded-lg font-starlightmix-mono transition"
              >
                {isSignUp ? 'Have account? Sign in' : 'New? Create account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
