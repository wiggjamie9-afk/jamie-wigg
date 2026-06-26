'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import { UserPurchase, AppCard } from '@/lib/types';
import { requireAuth } from '@/lib/auth';
import Link from 'next/link';

export default function AppsPage() {
  const [apps, setApps] = useState<AppCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  useEffect(() => {
    loadApps();
  }, []);

  async function loadApps() {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        window.location.href = '/login';
        return;
      }

      setUser(authUser);

      // Fetch user's purchases
      const { data: purchases, error } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', authUser.id)
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Error loading apps:', error);
        return;
      }

      // Enrich with session data
      const enriched = await Promise.all(
        (purchases || []).map(async (purchase: any) => {
          const { data: sessions } = await supabase
            .from('app_sessions')
            .select('session_end')
            .eq('purchase_id', purchase.id)
            .order('session_start', { ascending: false })
            .limit(1);

          return {
            ...purchase,
            last_used: sessions?.[0]?.session_end,
          };
        })
      );

      setApps(enriched);
    } catch (error) {
      console.error('Error loading apps:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredApps = apps.filter((app) => {
    if (filter === 'premium') return app.is_premium;
    if (filter === 'free') return !app.is_premium;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your apps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Apps</h1>
          <p className="text-gray-600">
            Access all your purchased Buddy applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-primary">
              {filteredApps.length}
            </div>
            <div className="text-gray-600">Total Apps</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {apps.filter((a) => a.is_premium).length}
            </div>
            <div className="text-gray-600">Premium Apps</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {apps.filter((a) => a.is_lifetime).length}
            </div>
            <div className="text-gray-600">Lifetime Licenses</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Apps
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'free'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setFilter('premium')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'premium'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Premium
          </button>
        </div>

        {/* Apps Grid */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No apps yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t purchased any apps yet. Explore our collection and get
              started!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              Browse Apps
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <AppCardComponent key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual app card component
 */
function AppCardComponent({ app }: { app: AppCard }) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Motivation: 'bg-yellow-100 text-yellow-800',
      Wellness: 'bg-green-100 text-green-800',
      Learning: 'bg-blue-100 text-blue-800',
      Productivity: 'bg-purple-100 text-purple-800',
      Health: 'bg-red-100 text-red-800',
      Finance: 'bg-emerald-100 text-emerald-800',
      Utilities: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{app.app_name}</h3>
        {app.category && (
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(app.category)}`}>
            {app.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        {/* License Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">License Key</div>
          <code className="text-sm font-mono text-gray-900">
            {app.license_key.substring(0, 20)}...
          </code>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Status</span>
            <span className="font-medium text-green-600">
              {app.is_lifetime ? 'Lifetime' : 'Active'}
            </span>
          </div>
          {app.is_premium && (
            <div className="flex justify-between text-gray-600">
              <span>Type</span>
              <span className="font-medium text-blue-600">Premium</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Purchased</span>
            <span className="font-medium">
              {new Date(app.purchased_at).toLocaleDateString()}
            </span>
          </div>
          {app.last_used && (
            <div className="flex justify-between text-gray-600">
              <span>Last Used</span>
              <span className="font-medium">
                {new Date(app.last_used).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <a
          href={`/apps/${app.app_id}?license=${app.license_key}`}
          className="block w-full bg-primary text-white py-2 rounded-lg font-medium text-center hover:bg-opacity-90 transition"
        >
          Open App &rarr;
        </a>
      </div>
    </div>
  );
}
