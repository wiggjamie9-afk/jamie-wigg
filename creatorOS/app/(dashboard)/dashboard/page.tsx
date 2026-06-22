'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Calendar, DollarSign, TrendingUp, Loader } from 'lucide-react';
import { useAuth } from '@/lib/hooks';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    contentGenerated: 0,
    postsScheduled: 0,
    totalReach: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        const postsRes = await fetch(`/api/posts/schedule?userId=${user.id}`);
        const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };

        const analyticsRes = await fetch(`/api/analytics/dashboard?userId=${user.id}&period=month`);
        const analyticsData = analyticsRes.ok ? await analyticsRes.json() : { analytics: {} };

        const earningsRes = await fetch(`/api/earnings?userId=${user.id}`);
        const earningsData = earningsRes.ok ? await earningsRes.json() : { monthly: 0 };

        setStats({
          contentGenerated: 24,
          postsScheduled: postsData.posts?.length || 0,
          totalReach: analyticsData.analytics?.totalViews || 0,
          earnings: earningsData.monthly || 0,
        });

        const recentActivity = [];
        if (analyticsData.analytics?.totalViews > 0) {
          recentActivity.push({
            action: 'Received ' + analyticsData.analytics.totalViews + ' views this month',
            time: 'Recent',
            status: 'complete',
          });
        }
        if (postsData.posts?.length > 0) {
          recentActivity.push({
            action: `Scheduled ${postsData.posts.length} posts`,
            time: 'Recent',
            status: 'complete',
          });
        }
        if (earningsData.monthly > 0) {
          recentActivity.push({
            action: `Earned $${earningsData.monthly.toFixed(2)} this month`,
            time: 'Recent',
            status: 'complete',
          });
        }

        setActivity(
          recentActivity.length > 0
            ? recentActivity
            : [
                { action: 'Generate your first content', time: 'Get started', status: 'pending' },
                { action: 'Schedule a post', time: 'Next step', status: 'pending' },
                { action: 'Check your analytics', time: 'Soon', status: 'pending' },
              ]
        );
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const statData = [
    { label: 'Content Generated', value: stats.contentGenerated, icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
    { label: 'Posts Scheduled', value: stats.postsScheduled, icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    {
      label: 'Total Reach',
      value: stats.totalReach > 1000 ? (stats.totalReach / 1000).toFixed(1) + 'K' : stats.totalReach,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    { label: 'Earnings', value: '$' + stats.earnings.toFixed(2), icon: DollarSign, color: 'bg-amber-100 text-amber-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {statData.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/dashboard/generate"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition text-left block"
          >
            <Sparkles className="w-6 h-6 text-brand-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Generate Content</h3>
            <p className="text-sm text-gray-600 mt-1">Create a new video, image, or music track</p>
          </a>

          <a
            href="/dashboard/schedule"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition text-left block"
          >
            <Calendar className="w-6 h-6 text-brand-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Schedule Post</h3>
            <p className="text-sm text-gray-600 mt-1">Schedule content across all platforms</p>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {activity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-gray-900 font-medium">{item.action}</p>
                <p className="text-sm text-gray-600">{item.time}</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
