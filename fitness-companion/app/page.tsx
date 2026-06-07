'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { initDB, getProfile, getWorkouts } from '@/lib/db';

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      await initDB();
      const p = await getProfile();
      const workouts = await getWorkouts(5);
      setProfile(p);
      setRecentWorkouts(workouts);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
        <div className="text-center">
          <div className="text-5xl mb-4">💪</div>
          <p className="text-gray-400">Loading your workout...</p>
        </div>
      </div>
    );
  }

  if (!profile?.apiKey) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-4xl font-serif mb-4">Fitness Companion</h1>
          <p className="text-gray-400 mb-8">Your AI coach with real-time voice guidance</p>
          <Link href="/setup" className="inline-block px-8 py-3 bg-gold text-black font-semibold rounded-full hover:bg-yellow-400 transition">
            Get Started →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-black p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">
          Welcome back, <span className="text-gold">{profile.preferences.coachName}</span>
        </h1>
        <Link href="/settings" className="text-gold hover:text-yellow-300">
          ⚙️
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-gold/20">
          <div className="text-2xl font-serif text-gold">{recentWorkouts.length}</div>
          <div className="text-xs text-gray-400">Total Workouts</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-gold/20">
          <div className="text-2xl font-serif text-gold">
            {recentWorkouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0)}
          </div>
          <div className="text-xs text-gray-400">Exercises</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-gold/20">
          <div className="text-2xl font-serif text-gold">
            {Math.round(recentWorkouts.reduce((sum, w) => sum + w.totalDuration, 0) / 60)}h
          </div>
          <div className="text-xs text-gray-400">Total Time</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-serif mb-4 text-gold">Recent Workouts</h2>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((w) => (
              <div key={w.id} className="bg-slate-800/50 p-3 rounded border border-gold/10 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold capitalize">{w.type}</div>
                    <div className="text-xs text-gray-400">{w.exercises.length} exercises</div>
                  </div>
                  <div className="text-right text-xs text-gray-400">{Math.round(w.totalDuration / 60)}m</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No workouts yet — let's get started!</p>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <Link
          href="/workout"
          className="block w-full py-4 bg-gradient-to-r from-gold to-yellow-300 text-black font-semibold rounded-full text-center hover:shadow-lg hover:shadow-gold/50 transition"
        >
          🎤 Start Workout
        </Link>
        <Link
          href="/settings"
          className="block w-full py-3 border border-gold/50 text-gold rounded-full text-center hover:bg-gold/10 transition"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}
