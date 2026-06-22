'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, AlertCircle } from 'lucide-react';
import { useScheduling } from '@/lib/hooks';
import { useAuth } from '@/lib/hooks';

export default function Schedule() {
  const { user } = useAuth();
  const { posts, loading, error, fetchPosts } = useScheduling();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['Twitter']);
  const [scheduleTime, setScheduleTime] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchPosts(user.id);
    }
  }, [user?.id, fetchPosts]);

  const handleSchedulePost = async () => {
    setFormError('');

    if (!user?.id) {
      setFormError('You must be logged in to schedule posts');
      return;
    }

    if (!title.trim() || !caption.trim() || !scheduleTime) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate submission
      setTitle('');
      setCaption('');
      setPlatforms(['Twitter']);
      setScheduleTime('');
      setShowForm(false);
      await fetchPosts(user.id);
    } catch (err: any) {
      setFormError(err.message || 'Failed to schedule post');
    }
  };

  const getScheduledDates = () => {
    const dates = new Map<number, number>();
    posts.forEach((post) => {
      if (post.status === 'scheduled' || post.status === 'published') {
        const date = new Date(post.schedule_time).getDate();
        dates.set(date, (dates.get(date) || 0) + 1);
      }
    });
    return dates;
  };

  const scheduledDates = getScheduledDates();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Posts</h1>
          <p className="text-gray-600 mt-1">Plan and schedule your content across all platforms</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Schedule Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create Scheduled Post</h2>

          {formError && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-600 text-sm">{formError}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Post caption"
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
              <div className="flex gap-2 flex-wrap">
                {['Twitter', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Facebook'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => {
                      setPlatforms(
                        platforms.includes(platform)
                          ? platforms.filter((p) => p !== platform)
                          : [...platforms, platform]
                      );
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      platforms.includes(platform)
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Time</label>
              <input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSchedulePost}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Schedule Post
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="w-6 h-6 text-brand-500" />
          <h2 className="text-xl font-bold text-gray-900">Posting Calendar</h2>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = (i % 28) + 1;
            const count = scheduledDates.get(dayNum) || 0;
            return (
              <div
                key={i}
                className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-brand-50 cursor-pointer transition relative"
              >
                <div className="text-sm text-gray-600">{dayNum}</div>
                {count > 0 && (
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Upcoming Posts {posts.length > 0 && `(${posts.length})`}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No posts scheduled yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts
              .sort((a, b) => new Date(a.schedule_time).getTime() - new Date(b.schedule_time).getTime())
              .map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium line-clamp-2">{post.title || post.caption}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(post.schedule_time).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                        post.status === 'published'
                          ? 'bg-blue-100 text-blue-700'
                          : post.status === 'scheduled'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.status === 'published' ? '✓ Published' : post.status === 'scheduled' ? '✓ Scheduled' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {post.platforms?.map((platform) => (
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
        )}
      </div>
    </div>
  );
}
