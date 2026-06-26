'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import Link from 'next/link';

interface Purchase {
  id: string;
  license_key: string;
  purchased_at: string;
  expires_at: string | null;
  status: 'active' | 'cancelled' | 'expired';
  products: {
    name: string;
    slug: string;
    icon_emoji: string;
    description: string;
  };
  pricing_tiers: {
    name: string;
    price_usd: number;
    interval: string;
  };
}

export default function AppsPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        window.location.href = '/login';
        return;
      }

      setUser(authUser);

      // Fetch user's purchases with product details
      const { data, error } = await supabase
        .from('purchases')
        .select(
          `
          id,
          license_key,
          purchased_at,
          expires_at,
          status,
          products (
            name,
            slug,
            icon_emoji,
            description
          ),
          pricing_tiers (
            name,
            price_usd,
            interval
          )
        `
        )
        .eq('user_id', authUser.id)
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Error loading purchases:', error);
        return;
      }

      setPurchases(data || []);
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPurchases = purchases.filter((purchase) => {
    if (filter === 'active') return purchase.status === 'active';
    if (filter === 'expired') return purchase.status === 'expired' || purchase.status === 'cancelled';
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
            Access all your purchased applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-primary">
              {filteredPurchases.length}
            </div>
            <div className="text-gray-600">Total Apps</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {purchases.filter((p) => p.status === 'active').length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {purchases.filter((p) => p.pricing_tiers.interval === 'month').length}
            </div>
            <div className="text-gray-600">Subscriptions</div>
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
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'expired'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Expired
          </button>
        </div>

        {/* Apps Grid */}
        {filteredPurchases.length === 0 ? (
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
            {filteredPurchases.map((purchase) => (
              <PurchaseCard key={purchase.id} purchase={purchase} />
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
function PurchaseCard({ purchase }: { purchase: Purchase }) {
  const isExpired =
    purchase.expires_at && new Date(purchase.expires_at) < new Date();
  const daysLeft = purchase.expires_at
    ? Math.ceil(
        (new Date(purchase.expires_at).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{purchase.products.icon_emoji || '📱'}</span>
          <h3 className="text-xl font-bold">{purchase.products.name}</h3>
        </div>
        <p className="text-sm opacity-90">{purchase.products.description}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Status */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-2">Status</div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                purchase.status === 'active' && !isExpired
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="font-medium">
              {purchase.status === 'active' && !isExpired
                ? 'Active'
                : purchase.status === 'cancelled'
                  ? 'Cancelled'
                  : 'Expired'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Tier</span>
            <span className="font-medium">{purchase.pricing_tiers.name}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Price</span>
            <span className="font-medium">
              ${purchase.pricing_tiers.price_usd.toFixed(2)}/
              {purchase.pricing_tiers.interval === 'month'
                ? 'mo'
                : purchase.pricing_tiers.interval === 'year'
                  ? 'yr'
                  : 'once'}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Purchased</span>
            <span className="font-medium">
              {new Date(purchase.purchased_at).toLocaleDateString()}
            </span>
          </div>
          {purchase.expires_at && (
            <div className="flex justify-between text-gray-600">
              <span>Expires</span>
              <span className={`font-medium ${isExpired ? 'text-red-600' : ''}`}>
                {daysLeft !== null
                  ? daysLeft > 0
                    ? `${daysLeft} days`
                    : 'Expired'
                  : new Date(purchase.expires_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* License Key */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">License Key</div>
          <code className="text-xs font-mono text-gray-900 break-all">
            {purchase.license_key}
          </code>
        </div>

        {/* Action Button */}
        <a
          href={`/apps/${purchase.products.slug}?license=${purchase.license_key}`}
          className="block w-full bg-primary text-white py-2 rounded-lg font-medium text-center hover:bg-opacity-90 transition disabled:opacity-50"
        >
          Open App &rarr;
        </a>

        {purchase.status !== 'active' || isExpired ? (
          <p className="text-xs text-red-600 mt-2 text-center">
            {purchase.status === 'cancelled'
              ? 'Subscription cancelled'
              : 'License expired - renew to continue'}
          </p>
        ) : null}
      </div>
    </div>
  );
}
