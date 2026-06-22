'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Eye, Heart, MessageSquare, AlertCircle } from 'lucide-react';
import { useAnalytics } from '@/lib/hooks';
import { useAuth } from '@/lib/hooks';

export default function Analytics() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
  const { user } = useAuth();
  const { data, loading, error, fetchAnalytics } = useAnalytics();

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics(user.id, period);
    }
  }, [user?.id, period, fetchAnalytics]);

  const stats = [
    { label: 'Total Views', value: data?.totalViews || 0, change: '+12%', icon: Eye, color: 'text-blue-600' },
    {
      label: 'Engagements',
      value: data?.totalEngagements || 0,
      change: '+8%',
      icon: Heart,
      color: 'text-red-600',
    },
    { label: 'Comments', value: data?.totalComments || 0, change: '+5%', icon: MessageSquare, color: 'text-green-600' },
    { label: 'Shares', value: data?.totalShares || 0, change: '+18%', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your content performance and get AI insights</p>
        </div>
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                period === p
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((metric, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <metric.icon className={`w-8 h-8 ${metric.color} mb-4`} />
            <p className="text-gray-600 text-sm">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{loading ? '...' : formatNumber(metric.value)}</p>
            <p className="text-green-600 text-sm mt-2">{metric.change} this {period}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Over Time</h2>
        <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chart visualization coming soon</p>
            <p className="text-sm text-gray-400 mt-1">Track views, likes, comments, and more</p>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      {data?.platformStats && data.platformStats.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance by Platform</h2>
          <div className="space-y-4">
            {data.platformStats.map((platform) => (
              <div key={platform.platform} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{platform.platform}</h3>
                  <div className="text-right">
                    <p className="text-gray-900 font-semibold">{formatNumber(platform.views)} views</p>
                    <p className="text-sm text-gray-600">{formatNumber(platform.engagements)} engagements</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performing Posts */}
      {data?.topPosts && data.topPosts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Posts</h2>

          <div className="space-y-4">
            {data.topPosts.map((post, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-2 inline-block">
                      {post.platform}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-semibold">{formatNumber(post.views)} views</p>
                    <p className="text-sm text-gray-600">{formatNumber(post.engagement)} engagements</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-lg border border-brand-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Insights</h2>
        <div className="space-y-3 text-gray-700">
          {data?.insights && data.insights.length > 0 ? (
            data.insights.map((insight, i) => <p key={i}>✓ {insight}</p>)
          ) : (
            <p>✓ Create and publish more content to unlock AI-powered insights</p>
          )}
        </div>
      </div>
    </div>
  );
}
