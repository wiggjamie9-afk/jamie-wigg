'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import Link from 'next/link';

const APPS = [
  { id: 'bright-brains', name: 'Bright Brains', emoji: '🧠', color: 'from-red-500 to-pink-500' },
  { id: 'steady', name: 'Steady', emoji: '🌊', color: 'from-teal-500 to-cyan-500' },
  { id: 'mum-brain', name: 'Mum Brain', emoji: '👩‍👧‍👦', color: 'from-pink-400 to-rose-400' },
  { id: 'dad-brain', name: 'Dad Brain', emoji: '👨‍👧‍👦', color: 'from-blue-500 to-purple-500' },
  { id: 'abilities-brain', name: 'Abilities Brain', emoji: '♿', color: 'from-yellow-400 to-orange-400' },
  { id: 'sleep', name: 'Sleep', emoji: '😴', color: 'from-indigo-500 to-purple-600' },
  { id: 'relationships', name: 'Relationships', emoji: '💕', color: 'from-rose-500 to-pink-500' },
  { id: 'money', name: 'Money', emoji: '💰', color: 'from-emerald-500 to-green-500' },
  { id: 'sobriety', name: 'Sobriety', emoji: '🌟', color: 'from-amber-500 to-orange-500' },
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { progress, getProgress } = useProgress();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user?.userId) {
      // Load stats for first app
      getProgress(user.userId, 'bright-brains');
    }
  }, [user?.userId, getProgress]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-700/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">RESONANCE</h1>
            <p className="text-sm text-slate-400">Welcome, {user?.displayName}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="backdrop-blur-lg bg-slate-900/40 border border-slate-700/20 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Lessons Completed</p>
            <p className="text-3xl font-bold text-white mt-2">
              {progress?.totalLessonsCompleted || 0}
            </p>
          </div>
          <div className="backdrop-blur-lg bg-slate-900/40 border border-slate-700/20 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Current Streak</p>
            <p className="text-3xl font-bold text-white mt-2">{progress?.currentStreak || 0} days</p>
          </div>
          <div className="backdrop-blur-lg bg-slate-900/40 border border-slate-700/20 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Time Spent</p>
            <p className="text-3xl font-bold text-white mt-2">
              {Math.round((progress?.totalTimeSpent || 0) / 60)}h
            </p>
          </div>
          <div className="backdrop-blur-lg bg-slate-900/40 border border-slate-700/20 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Avg Rating</p>
            <p className="text-3xl font-bold text-white mt-2">
              {(progress?.averageEmotionalRating || 0).toFixed(1)}/5
            </p>
          </div>
        </div>

        {/* Apps Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All 9 Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APPS.map((app) => (
              <Link
                key={app.id}
                href={`/app/${app.id}`}
                className="group backdrop-blur-lg bg-slate-900/40 border border-slate-700/20 hover:border-slate-600/40 rounded-xl p-6 transition hover:scale-105 cursor-pointer"
              >
                <div className={`text-5xl mb-4 group-hover:scale-110 transition`}>{app.emoji}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{app.name}</h3>
                <p className="text-slate-400 text-sm">
                  {progress?.totalLessonsCompleted || 0} lessons completed
                </p>
                <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${app.color} transition-all`}
                    style={{ width: `${Math.random() * 60}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 backdrop-blur-lg bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/20 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to start?</h3>
          <p className="text-slate-300 mb-6">Choose an app above and complete your first lesson today</p>
          <Link
            href={`/app/${APPS[0].id}`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
