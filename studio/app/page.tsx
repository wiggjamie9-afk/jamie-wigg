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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
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
        <div className="font-starlightmix-mono text-starlightmix-text-muted animate-pulse">Initializing...</div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen bg-starlightmix-bg text-starlightmix-text">
        {/* Premium nav */}
        <nav className="border-b border-starlightmix-border/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="font-starlightmix-display text-2xl font-black slm-text-gradient tracking-tight">
              STARLIGHTMIX
            </h1>
            <button
              onClick={() => {
                signOut();
                checkAuth();
              }}
              className="px-4 py-2.5 text-sm font-medium rounded-lg bg-starlightmix-surface hover:bg-starlightmix-surface-2 border border-starlightmix-border/50 text-starlightmix-text transition-all duration-300 hover:border-starlightmix-magenta/50"
            >
              Sign Out
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Welcome section with premium styling */}
          <div className="mb-16 animate-fade-in">
            <h2 className="font-starlightmix-display text-5xl md:text-6xl font-black mb-4 slm-text-gradient tracking-tight">
              Welcome back, creator
            </h2>
            <p className="text-lg text-starlightmix-text-soft font-starlightmix-mono">
              Your plan: <span className="text-starlightmix-gold font-semibold capitalize">{user.subscription_tier}</span>
            </p>
          </div>

          {user.subscription_tier === 'free' && (
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="mb-8">
                <h3 className="font-starlightmix-display text-3xl font-black mb-2">Upgrade to Create</h3>
                <p className="text-starlightmix-text-soft">Unlock unlimited video generation and premium models</p>
              </div>

              {/* Premium pricing grid */}
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {Object.entries(PRICING_TIERS)
                  .filter(([_, tier]) => tier.price > 0)
                  .map(([key, tier], idx) => {
                    const isPopular = key === 'pro';
                    return (
                      <div
                        key={key}
                        className={`relative group rounded-2xl border transition-all duration-300 ${
                          isPopular
                            ? 'border-starlightmix-magenta/60 bg-gradient-to-br from-starlightmix-surface/80 via-starlightmix-surface to-starlightmix-deep/50 shadow-2xl shadow-starlightmix-magenta/20 md:scale-105'
                            : 'border-starlightmix-border/40 bg-starlightmix-surface/50 hover:border-starlightmix-border/80 hover:bg-starlightmix-surface/70'
                        }`}
                        style={{ animationDelay: `${100 + idx * 100}ms` }}
                      >
                        {isPopular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-starlightmix-magenta to-starlightmix-purple text-white">
                              Most Popular
                            </span>
                          </div>
                        )}

                        <div className="p-8">
                          <h4 className="font-starlightmix-display text-2xl font-black mb-2">{tier.name}</h4>
                          <div className="mb-6">
                            <span className="text-5xl font-black text-starlightmix-gold">${tier.price}</span>
                            <span className="text-starlightmix-text-muted font-starlightmix-mono text-sm ml-2">/month</span>
                          </div>

                          {/* Features list */}
                          <ul className="space-y-3 mb-8">
                            {tier.features.map((feature, fidx) => (
                              <li key={fidx} className="flex items-start gap-3 text-sm">
                                <span className="text-starlightmix-cyan text-lg leading-none mt-0.5 flex-shrink-0">
                                  ✓
                                </span>
                                <span className="text-starlightmix-text-soft">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA Button */}
                          <button
                            onClick={() => handleCheckout(key)}
                            disabled={authLoading}
                            className={`w-full py-3 px-4 rounded-lg font-starlightmix-display font-bold text-sm tracking-wide transition-all duration-300 ${
                              isPopular
                                ? 'bg-gradient-to-r from-starlightmix-magenta to-starlightmix-purple hover:shadow-lg hover:shadow-starlightmix-magenta/40 text-white disabled:opacity-50'
                                : 'bg-starlightmix-surface/80 border border-starlightmix-border/60 text-starlightmix-text hover:bg-starlightmix-surface/100 hover:border-starlightmix-magenta/40 disabled:opacity-50'
                            }`}
                          >
                            {authLoading ? 'Processing...' : `Get ${tier.name}`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {user.subscription_tier !== 'free' && (
            <div
              className="group rounded-2xl border border-starlightmix-border/40 bg-gradient-to-br from-starlightmix-surface/60 via-starlightmix-surface to-starlightmix-deep/40 p-12 animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              <div className="max-w-2xl">
                <h3 className="font-starlightmix-display text-4xl font-black mb-4 text-starlightmix-cyan">
                  Create Your Video
                </h3>
                <p className="text-lg text-starlightmix-text-soft mb-8">
                  Upload your music track, choose a visual theme, and let AI generate a stunning music video in seconds.
                </p>
                <div className="inline-block px-8 py-3 bg-gradient-to-r from-starlightmix-cyan/20 to-starlightmix-purple/20 border border-starlightmix-cyan/40 rounded-lg text-starlightmix-cyan font-starlightmix-mono text-sm">
                  Coming soon: Video generation interface
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col bg-starlightmix-bg overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-starlightmix-purple/5 via-transparent to-starlightmix-magenta/5" />
      </div>

      {/* Premium nav */}
      <nav className="border-b border-starlightmix-border/20 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="font-starlightmix-display text-2xl font-black slm-text-gradient tracking-tight">
            STARLIGHTMIX Studio
          </h1>
        </div>
      </nav>

      <div className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          {/* Hero section - asymmetric, bold */}
          <div className="grid md:grid-cols-5 gap-12 items-start mb-24 animate-fade-in">
            <div className="md:col-span-3">
              <h2 className="font-starlightmix-display text-6xl md:text-7xl font-black mb-6 slm-text-gradient leading-tight tracking-tighter">
                AI Music Videos in Seconds
              </h2>
              <p className="text-xl text-starlightmix-text-soft mb-6 leading-relaxed max-w-lg">
                Paste your Replicate token. Upload a track. Pick a vibe. Get studio-quality AI music videos instantly.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-starlightmix-surface/60 border border-starlightmix-border/50">
                  <span className="text-starlightmix-green text-lg">◆</span>
                  <span className="text-sm font-starlightmix-mono text-starlightmix-text-soft">Zero server-side storage</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-starlightmix-surface/60 border border-starlightmix-border/50">
                  <span className="text-starlightmix-cyan text-lg">◆</span>
                  <span className="text-sm font-starlightmix-mono text-starlightmix-text-soft">FLUX 1.1 Pro & HunyuanVideo</span>
                </div>
              </div>
            </div>

            {/* Visual preview area */}
            <div className="md:col-span-2">
              <div className="relative aspect-video rounded-xl border border-starlightmix-border/40 bg-gradient-to-br from-starlightmix-surface/50 to-starlightmix-deep overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-starlightmix-magenta/5 via-transparent to-starlightmix-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🎵</div>
                    <p className="text-starlightmix-text-muted font-starlightmix-mono text-sm">Your video preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features - three column */}
          <div className="grid md:grid-cols-3 gap-8 mb-24 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                desc: 'Generate videos in seconds, not hours. Your music matters, not the wait.',
              },
              {
                icon: '✨',
                title: 'Studio Quality',
                desc: 'Powered by FLUX 1.1 Pro and HunyuanVideo — the best models available.',
              },
              {
                icon: '🔒',
                title: 'Completely Private',
                desc: 'Your audio stays on your device. Zero tracking, zero server storage.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-xl border border-starlightmix-border/30 bg-starlightmix-surface/30 hover:bg-starlightmix-surface/60 hover:border-starlightmix-cyan/40 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="font-starlightmix-display text-lg font-bold mb-2">{feature.title}</h4>
                <p className="text-starlightmix-text-soft text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Premium pricing and auth container */}
          <div className="grid md:grid-cols-3 gap-12 items-start animate-fade-in" style={{ animationDelay: '200ms' }}>
            {/* Pricing preview (left) */}
            <div className="md:col-span-1 hidden md:block">
              <h3 className="font-starlightmix-display text-2xl font-black mb-6">Simple Pricing</h3>
              <ul className="space-y-4">
                {[
                  { tier: 'Free', price: '$0', features: '1 video/month' },
                  { tier: 'Pro', price: '$9.99', features: 'Unlimited videos' },
                  { tier: 'Studio', price: '$99', features: 'Everything + 4K' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-starlightmix-border/30 bg-starlightmix-surface/40 hover:border-starlightmix-border/60 transition-colors duration-300"
                  >
                    <div className="font-starlightmix-display font-bold text-sm mb-1">{item.tier}</div>
                    <div className="text-starlightmix-gold font-mono text-lg">{item.price}</div>
                    <div className="text-xs text-starlightmix-text-muted mt-2">{item.features}</div>
                  </div>
                ))}
              </ul>
            </div>

            {/* Auth form (right) - premium styling */}
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-starlightmix-border/40 bg-gradient-to-br from-starlightmix-surface/60 via-starlightmix-surface/40 to-starlightmix-deep/50 p-10 backdrop-blur-sm">
                <h3 className="font-starlightmix-display text-3xl font-black mb-2 slm-text-gradient">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </h3>
                <p className="text-starlightmix-text-soft mb-8 text-sm">
                  {isSignUp
                    ? 'Start creating AI music videos immediately'
                    : 'Access your STARLIGHTMIX Studio dashboard'}
                </p>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-starlightmix-danger-soft border border-starlightmix-danger/30 text-starlightmix-text font-starlightmix-mono text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={authLoading}
                    className="w-full px-4 py-3.5 bg-starlightmix-deep/40 border border-starlightmix-border/40 rounded-lg text-starlightmix-text placeholder-starlightmix-text-muted font-starlightmix-mono text-sm focus:border-starlightmix-cyan/60 focus:outline-none transition-colors duration-300 disabled:opacity-50"
                  />
                  <input
                    type="password"
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={authLoading}
                    className="w-full px-4 py-3.5 bg-starlightmix-deep/40 border border-starlightmix-border/40 rounded-lg text-starlightmix-text placeholder-starlightmix-text-muted font-starlightmix-mono text-sm focus:border-starlightmix-cyan/60 focus:outline-none transition-colors duration-300 disabled:opacity-50"
                  />
                </div>

                <button
                  onClick={handleAuth}
                  disabled={authLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-starlightmix-magenta to-starlightmix-purple hover:shadow-lg hover:shadow-starlightmix-magenta/40 disabled:opacity-50 rounded-lg font-starlightmix-display font-bold text-sm tracking-wide text-white transition-all duration-300 mb-3"
                >
                  {authLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="animate-spin">⟳</span> Processing...
                    </span>
                  ) : isSignUp ? (
                    'Create Account'
                  ) : (
                    'Sign In'
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  disabled={authLoading}
                  className="w-full py-3 px-4 bg-starlightmix-surface/50 border border-starlightmix-border/40 hover:border-starlightmix-border/80 hover:bg-starlightmix-surface/70 rounded-lg font-starlightmix-mono text-sm text-starlightmix-text transition-all duration-300 disabled:opacity-50"
                >
                  {isSignUp ? 'Have account? Sign in' : "New? Create account"}
                </button>

                <p className="text-xs text-starlightmix-text-muted text-center mt-6 font-starlightmix-mono">
                  By signing in, you agree to our{' '}
                  <a href="/terms" className="text-starlightmix-cyan hover:underline">
                    Terms
                  </a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-starlightmix-cyan hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
}
