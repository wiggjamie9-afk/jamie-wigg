'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

// RHYTHMIX Brand Colors
const BRAND = {
  primary: '#3B82F6',    // Blue
  accent: '#9333EA',     // Purple
  highlight: '#F97316',  // Orange
  success: '#10B981',
  error: '#EF4444',
};

interface Student {
  id: string;
  name: string;
  email: string;
  tier: 'starter' | 'pro' | 'premium';
  platform_name: string;
  platform_domain: string;
  github_repo?: string;
}

interface Progress {
  module_id: number;
  module_title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percent: number;
}

export default function AcademyDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // TODO: Fetch student data from Supabase
    // Mock data for development
    setStudent({
      id: '1',
      name: 'Alex',
      email: 'alex@example.com',
      tier: 'pro',
      platform_name: 'EventFlow',
      platform_domain: 'eventflow.buildtheeventai.com',
      github_repo: '/alex/event-flow',
    });

    // Mock progress
    setProgress([
      {
        module_id: 1,
        module_title: 'Event Platform Strategy',
        status: 'completed',
        progress_percent: 100,
      },
      {
        module_id: 2,
        module_title: 'Tech Stack Overview',
        status: 'completed',
        progress_percent: 100,
      },
      {
        module_id: 3,
        module_title: 'Environment Setup',
        status: 'in_progress',
        progress_percent: 60,
      },
      {
        module_id: 4,
        module_title: 'Event Creation Form',
        status: 'not_started',
        progress_percent: 0,
      },
    ]);

    setAchievements(['deployed', 'first-sync', 'ai-image']);
  }, []);

  if (!student)
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-lg opacity-75">Loading your dashboard...</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-base transition-colors duration-200">
      <Navigation />

      {/* Header */}
      <div
        style={{ borderBottomColor: BRAND.accent }}
        className="border-b py-6"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold mb-2">
            Welcome back, {student.name}
          </h1>
          <p className="opacity-75">
            {student.tier.toUpperCase()} tier • Cohort 2026
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm opacity-60 mb-2">Modules Completed</p>
              <p style={{ color: BRAND.accent }} className="text-3xl font-bold">
                {progress.filter((p) => p.status === 'completed').length}/28
              </p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm opacity-60 mb-2">Current Week</p>
              <p className="text-3xl font-bold">Week 3</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm opacity-60 mb-2">Next Checkpoint</p>
              <p className="text-3xl font-bold">Week 4</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm opacity-60 mb-2">Achievements</p>
              <p style={{ color: BRAND.accent }} className="text-3xl font-bold">
                {achievements.length}
              </p>
            </div>
          </div>
        </section>

        {/* My Platform */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Platform</h2>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm opacity-60 mb-2">Platform Name</p>
                <p className="font-bold text-lg">{student.platform_name}</p>
              </div>
              <div>
                <p className="text-sm opacity-60 mb-2">Live at</p>
                <a
                  href={`https://${student.platform_domain}`}
                  style={{ color: BRAND.accent }}
                  className="font-bold hover:underline"
                >
                  {student.platform_domain}
                </a>
              </div>
              <div>
                <p className="text-sm opacity-60 mb-2">Code</p>
                <a
                  href={`https://github.com${student.github_repo}`}
                  style={{ color: BRAND.accent }}
                  className="font-bold hover:underline"
                >
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Module Progress */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Modules</h2>
          <div className="space-y-3">
            {progress.map((p) => (
              <div
                key={p.module_id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm opacity-60">Module {p.module_id}</span>
                    <p className="font-bold">{p.module_title}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      p.status === 'completed'
                        ? `opacity-100`
                        : p.status === 'in_progress'
                          ? `opacity-75`
                          : 'opacity-50'
                    }`}
                    style={{
                      color:
                        p.status === 'completed'
                          ? BRAND.success
                          : p.status === 'in_progress'
                            ? BRAND.accent
                            : undefined,
                    }}
                  >
                    {p.status === 'completed'
                      ? '✓ Done'
                      : p.status === 'in_progress'
                        ? '⏳ In Progress'
                        : '⭕ Not Started'}
                  </span>
                </div>
                {p.status === 'in_progress' && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${p.progress_percent}%`,
                        backgroundColor: BRAND.accent,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
