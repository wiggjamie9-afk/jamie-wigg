'use client';

import { BarChart3, Sparkles, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Content Generated', value: '24', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
    { label: 'Posts Scheduled', value: '12', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Reach', value: '2.4K', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Earnings', value: '$340', icon: DollarSign, color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
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
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition text-left">
            <Sparkles className="w-6 h-6 text-brand-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Generate Content</h3>
            <p className="text-sm text-gray-600 mt-1">Create a new video, image, or music track</p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition text-left">
            <Calendar className="w-6 h-6 text-brand-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Schedule Post</h3>
            <p className="text-sm text-gray-600 mt-1">Schedule content across all platforms</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Generated 60s promo video', time: '2 hours ago', status: 'complete' },
            { action: 'Scheduled 5 posts to Instagram', time: '5 hours ago', status: 'complete' },
            { action: 'Generated AI-assisted captions', time: '1 day ago', status: 'complete' },
          ].map((item, i) => (
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
