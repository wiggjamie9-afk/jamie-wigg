'use client';

import { TrendingUp, Eye, Heart, MessageSquare } from 'lucide-react';

export default function Analytics() {
  const metrics = [
    { label: 'Total Views', value: '24.5K', change: '+12%', icon: Eye, color: 'text-blue-600' },
    { label: 'Engagements', value: '2.8K', change: '+8%', icon: Heart, color: 'text-red-600' },
    { label: 'Comments', value: '145', change: '+5%', icon: MessageSquare, color: 'text-green-600' },
    { label: 'Shares', value: '342', change: '+18%', icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your content performance and get AI insights</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <metric.icon className={`w-8 h-8 ${metric.color} mb-4`} />
            <p className="text-gray-600 text-sm">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
            <p className="text-green-600 text-sm mt-2">{metric.change} this month</p>
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

      {/* Top Performing Posts */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Posts</h2>

        <div className="space-y-4">
          {[
            { title: '60s Promo Video', views: '4,200', engagement: '340', platform: 'TikTok' },
            { title: 'Behind the Scenes', views: '3,100', engagement: '280', platform: 'Instagram' },
            { title: 'Product Announcement', views: '2,800', engagement: '210', platform: 'Twitter' },
          ].map((post, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-2 inline-block">
                    {post.platform}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-semibold">{post.views} views</p>
                  <p className="text-sm text-gray-600">{post.engagement} engagements</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-lg border border-brand-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Insights</h2>
        <div className="space-y-3 text-gray-700">
          <p>✓ Your TikTok content performs 40% better than Instagram — focus more on vertical video</p>
          <p>✓ Posting at 3 PM gets 25% more engagement — consider scheduling more posts then</p>
          <p>✓ Behind-the-scenes content has 3x higher engagement — create more of it</p>
        </div>
      </div>
    </div>
  );
}
