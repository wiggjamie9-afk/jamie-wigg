'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useChat } from '@/hooks/useChat';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  body: string;
  affirmation: string;
  trackId: string;
  lessonIndex: number;
}

const APP_CONFIG: Record<string, { name: string; emoji: string; color: string; tracks: string[] }> = {
  'bright-brains': {
    name: 'Bright Brains',
    emoji: '🧠',
    color: 'from-red-500 to-pink-500',
    tracks: ['Reading Strategies', 'Math Patterns', 'Writing Systems', 'Focus Tools'],
  },
  'steady': {
    name: 'Steady',
    emoji: '🌊',
    color: 'from-teal-500 to-cyan-500',
    tracks: ['Anxiety Calm', 'Depression Hope', 'Stress Release', 'Sleep Better'],
  },
  'mum-brain': {
    name: 'Mum Brain',
    emoji: '👩‍👧‍👦',
    color: 'from-pink-400 to-rose-400',
    tracks: ['Energy', 'Patience', 'Balance', 'Connection'],
  },
  'dad-brain': {
    name: 'Dad Brain',
    emoji: '👨‍👧‍👦',
    color: 'from-blue-500 to-purple-500',
    tracks: ['Presence', 'Patience', 'Strength', 'Connection'],
  },
  'abilities-brain': {
    name: 'Abilities Brain',
    emoji: '♿',
    color: 'from-yellow-400 to-orange-400',
    tracks: ['Adaptation', 'Strength', 'Community', 'Purpose'],
  },
  'sleep': {
    name: 'Sleep',
    emoji: '😴',
    color: 'from-indigo-500 to-purple-600',
    tracks: ['Wind-Down', 'Breathing', 'Body-Scan', 'Dream'],
  },
  'relationships': {
    name: 'Relationships',
    emoji: '💕',
    color: 'from-rose-500 to-pink-500',
    tracks: ['Communication', 'Conflict', 'Intimacy', 'Boundaries'],
  },
  'money': {
    name: 'Money',
    emoji: '💰',
    color: 'from-emerald-500 to-green-500',
    tracks: ['Spending', 'Saving', 'Debt', 'Abundance'],
  },
  'sobriety': {
    name: 'Sobriety',
    emoji: '🌟',
    color: 'from-amber-500 to-orange-500',
    tracks: ['Cravings', 'Identity', 'Community', 'Purpose'],
  },
};

export default function AppPage({ params }: { params: { appId: string } }) {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { progress, completeLesson } = useProgress();
  const { messages, sendMessage, loading: chatLoading } = useChat();
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const appConfig = APP_CONFIG[params.appId];

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user?.userId) {
      // Load progress for this app
      // In a real implementation, fetch lessons from API
    }
  }, [user?.userId]);

  if (!isAuthenticated || !appConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  async function handleCompleteLesson() {
    if (!user?.userId) return;

    try {
      await completeLesson(
        user.userId,
        params.appId,
        `${params.appId}-track-${selectedTrack}`,
        currentLesson,
        600, // 10 minutes
        4 // 4/5 rating
      );

      // Move to next lesson
      if (currentLesson < 4) {
        setCurrentLesson(currentLesson + 1);
      } else if (selectedTrack < appConfig.tracks.length - 1) {
        setSelectedTrack(selectedTrack + 1);
        setCurrentLesson(0);
      }
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    }
  }

  async function handleSendMessage() {
    if (!chatMessage.trim()) return;

    try {
      await sendMessage(chatMessage, params.appId);
      setChatMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-700/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl">←</Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{appConfig.emoji}</span>
                <h1 className="text-2xl font-bold text-white">{appConfig.name}</h1>
              </div>
              <p className="text-sm text-slate-400">Track {selectedTrack + 1} • Lesson {currentLesson + 1}</p>
            </div>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            💬 {showChat ? 'Hide' : 'Show'} JARVIS
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tracks */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">Tracks</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {appConfig.tracks.map((track, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedTrack(idx);
                      setCurrentLesson(0);
                    }}
                    className={`p-4 rounded-lg transition ${
                      idx === selectedTrack
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Lesson */}
            <div className="backdrop-blur-lg bg-slate-900/40 border border-slate-700/20 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {appConfig.tracks[selectedTrack]} • Lesson {currentLesson + 1}
              </h2>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-slate-300 leading-relaxed">
                  Explore the key concepts and practices that will help you develop mastery in{' '}
                  {appConfig.tracks[selectedTrack].toLowerCase()}.
                </p>

                <div className="bg-slate-800/50 rounded-lg p-6 my-6 border-l-4 border-blue-500">
                  <p className="text-slate-200 italic">
                    💡 "I am growing stronger in {appConfig.tracks[selectedTrack].toLowerCase()}."
                  </p>
                </div>
              </div>

              {/* Lessons Progress */}
              <div className="flex gap-2 mb-8">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentLesson(idx)}
                    className={`flex-1 h-2 rounded-full transition ${
                      idx === currentLesson
                        ? 'bg-blue-500'
                        : idx < currentLesson
                          ? 'bg-green-500'
                          : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCompleteLesson}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition"
                >
                  ✓ Mark Complete
                </button>
                <button className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition">
                  🔊 Read Aloud
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - JARVIS Chat */}
          {showChat && (
            <div className="backdrop-blur-lg bg-slate-900/40 border border-slate-700/20 rounded-2xl p-6 h-fit sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">JARVIS AI Companion</h3>

              <div className="space-y-4 h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Start a conversation with JARVIS</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600/50 ml-8 text-right text-white'
                          : 'bg-slate-800/50 mr-8 text-slate-300'
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask JARVIS..."
                  className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-blue-500/50 transition"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  →
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
