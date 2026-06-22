'use client';

import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Users, TrendingUp, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@/lib/hooks';

export default function Monetize() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState<'pro' | 'studio' | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/earnings?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setEarnings(data);
        }
      } catch (err) {
        console.error('Failed to fetch earnings:', err);
      }
    };

    fetchEarnings();
  }, [user?.id]);

  const handleCheckout = async (tier: 'pro' | 'studio') => {
    if (!user?.id) {
      setError('You must be logged in to upgrade');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          tier,
          billingPeriod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  const currentTier = profile?.subscription_tier || 'free';
  const monthlyEarnings = earnings?.monthly || 0;
  const totalEarnings = earnings?.total || 0;
  const supporters = earnings?.supporters || 0;

  const monetizationMethods = [
    {
      icon: CreditCard,
      title: 'Memberships',
      description: 'Offer exclusive content to paying members',
      status: currentTier !== 'free' ? 'active' : 'available',
      earnings: currentTier !== 'free' ? '$240/mo' : 'Unlock with Pro',
      members: currentTier !== 'free' ? 24 : 0,
    },
    {
      icon: Users,
      title: 'Sponsored Content',
      description: 'Connect with brands and earn from sponsorships',
      status: currentTier === 'studio' ? 'active' : 'available',
      earnings: currentTier === 'studio' ? '$500+ per deal' : 'Unlock with Studio',
      members: 0,
    },
    {
      icon: DollarSign,
      title: 'Tips & Donations',
      description: 'Let fans support you directly',
      status: currentTier !== 'free' ? 'active' : 'available',
      earnings: currentTier !== 'free' ? '$60/mo' : 'Unlock with Pro',
      members: currentTier !== 'free' ? 18 : 0,
    },
    {
      icon: TrendingUp,
      title: 'Affiliate Marketing',
      description: 'Earn commissions on products you recommend',
      status: currentTier === 'studio' ? 'active' : 'available',
      earnings: currentTier === 'studio' ? 'Varies' : 'Unlock with Studio',
      members: 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Monetize Your Content</h1>
        <p className="text-gray-600 mt-1">Turn your audience into revenue with multiple monetization options</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Current Plan Badge */}
      {currentTier !== 'free' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Current Plan:</span> {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Tier
          </p>
        </div>
      )}

      {/* Revenue Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <DollarSign className="w-8 h-8 text-green-600 mb-4" />
          <p className="text-gray-600 text-sm">Total Earnings This Month</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${monthlyEarnings.toFixed(2)}</p>
          <p className="text-green-600 text-sm mt-2">↑ 18% from last month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Users className="w-8 h-8 text-blue-600 mb-4" />
          <p className="text-gray-600 text-sm">Paying Supporters</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{supporters}</p>
          <p className="text-blue-600 text-sm mt-2">↑ 5 new this week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <TrendingUp className="w-8 h-8 text-purple-600 mb-4" />
          <p className="text-gray-600 text-sm">Total Lifetime Earnings</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${totalEarnings.toFixed(2)}</p>
          <p className="text-purple-600 text-sm mt-2">All time</p>
        </div>
      </div>

      {/* Subscription Tiers */}
      {currentTier === 'free' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Upgrade Your Plan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                tier: 'pro',
                name: 'Pro',
                price: '$9.99',
                period: '/month',
                features: [
                  '10 content generations per day',
                  '100 scheduled posts per month',
                  'Basic analytics',
                  'Memberships & Tips',
                  'Email support',
                ],
              },
              {
                tier: 'studio',
                name: 'Studio',
                price: '$29.99',
                period: '/month',
                features: [
                  '50 content generations per day',
                  'Unlimited scheduled posts',
                  'Advanced analytics',
                  'All monetization methods',
                  'Priority support',
                  'Affiliate program',
                ],
              },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`rounded-lg border-2 p-8 ${
                  plan.tier === 'pro' ? 'border-gray-200 bg-white' : 'border-brand-500 bg-brand-50'
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </p>

                <div className="space-y-3 my-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-brand-500 font-bold">✓</span>
                      <p className="text-gray-700 text-sm">{feature}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedTier(plan.tier as 'pro' | 'studio');
                    handleCheckout(plan.tier as 'pro' | 'studio');
                  }}
                  disabled={loading && selectedTier === plan.tier}
                  className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading && selectedTier === plan.tier ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              💡 <span className="font-medium">Tip:</span> Annual billing saves you 20% — select your preferred period and upgrade to unlock all monetization features.
            </p>
          </div>
        </div>
      )}

      {/* Monetization Options */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Available Monetization Methods</h2>

        {monetizationMethods.map((method, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <method.icon className="w-8 h-8 text-brand-500 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">{method.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{method.description}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                  method.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {method.status === 'active' ? '✓ Active' : 'Available'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
                <p className="font-bold text-gray-900 mt-1">{method.earnings}</p>
              </div>
              {method.members > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="font-bold text-gray-900 mt-1">{method.members}</p>
                </div>
              )}
            </div>

            <button
              onClick={() =>
                method.status === 'available' && currentTier === 'free'
                  ? alert('Please upgrade your plan to unlock this feature')
                  : null
              }
              className="mt-6 w-full text-brand-600 hover:text-brand-700 font-medium text-sm border border-brand-600 hover:bg-brand-50 py-2 rounded-lg transition"
            >
              {method.status === 'active' ? 'Manage' : 'Set Up'}
            </button>
          </div>
        ))}
      </div>

      {/* Monetization Tips */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Ways to Increase Revenue</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Post consistently — your audience is 40% more likely to support regular creators</li>
          <li>• Create behind-the-scenes content — fans pay 3x more for exclusive access</li>
          <li>• Build a Discord community — members feel more connected and willing to pay</li>
          <li>• Collaborate with other creators — cross-promotions attract new paying fans</li>
        </ul>
      </div>
    </div>
  );
}
