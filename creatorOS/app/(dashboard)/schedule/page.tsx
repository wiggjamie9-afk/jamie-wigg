'use client';

import { Calendar, Clock, Plus } from 'lucide-react';

export default function Schedule() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Posts</h1>
          <p className="text-gray-600 mt-1">Plan and schedule your content across all platforms</p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Schedule Post
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="w-6 h-6 text-brand-500" />
          <h2 className="text-xl font-bold text-gray-900">Posting Calendar</h2>
        </div>

        {/* Placeholder for calendar integration */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-brand-50 cursor-pointer transition"
            >
              <div className="text-sm text-gray-600">{(i % 28) + 1}</div>
              {Math.random() > 0.7 && (
                <div className="mt-1 w-1 h-1 bg-brand-500 rounded-full mx-auto" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Posts</h2>

        <div className="space-y-4">
          {[
            {
              platforms: ['Twitter', 'LinkedIn'],
              content: 'Excited to announce our new feature...',
              time: '2025-01-24 09:00 AM',
              status: 'scheduled',
            },
            {
              platforms: ['Instagram', 'TikTok'],
              content: '🚀 Check out our latest video...',
              time: '2025-01-24 03:00 PM',
              status: 'scheduled',
            },
            {
              platforms: ['YouTube', 'Twitter'],
              content: 'Behind the scenes of our creative process...',
              time: '2025-01-25 10:00 AM',
              status: 'draft',
            },
          ].map((post, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{post.time}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                    post.status === 'scheduled'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {post.status === 'scheduled' ? '✓ Scheduled' : 'Draft'}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {post.platforms.map((platform) => (
                  <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {platform}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
