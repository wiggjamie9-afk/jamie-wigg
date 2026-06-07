'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProfile, initDB } from '@/lib/db';
import Link from 'next/link';

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [coachName, setCoachName] = useState('Coach');
  const [personality, setPersonality] = useState<'encouraging' | 'tough' | 'funny'>('encouraging');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleComplete() {
    if (!apiKey.trim().toLowerCase().startsWith('sk-')) {
      setError('Please enter a valid Claude API key (starts with sk-)');
      return;
    }

    if (!goal.trim()) {
      setError('Please tell us one fitness goal');
      return;
    }

    setLoading(true);
    try {
      await initDB();
      await saveProfile({
        apiKey,
        goals: [goal],
        history: [],
        preferences: {
          personality,
          coachName,
        },
      });
      router.push('/');
    } catch (err) {
      setError('Failed to save settings. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-black p-6">
      <Link href="/" className="text-gold mb-8">
        ← Back
      </Link>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-sm w-full">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif mb-2">Your AI Coach</h1>
                <p className="text-gray-400">Let's personalize your experience</p>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gold">Coach Name</label>
                <input
                  type="text"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  placeholder="Coach, Alex, etc."
                  className="w-full bg-slate-800 border border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm mb-3 text-gold">Personality</label>
                <div className="space-y-2">
                  {(['encouraging', 'tough', 'funny'] as const).map((p) => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={personality === p}
                        onChange={() => setPersonality(p)}
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="capitalize">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
              >
                Next →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif mb-2">Your Lifting Goal</h1>
                <p className="text-gray-400">What's your main strength goal?</p>
              </div>

              <div className="space-y-2">
                {['Add 50 lbs to my deadlift', 'Build muscle mass', 'Get stronger overall', 'Hit a 300 lb bench press', 'Custom goal'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g === 'Custom goal' ? '' : g)}
                    className={`w-full p-3 rounded-lg border text-left transition ${
                      goal === g || (g === 'Custom goal' && goal && !['Add 50 lbs to my deadlift', 'Build muscle mass', 'Get stronger overall', 'Hit a 300 lb bench press'].includes(goal))
                        ? 'border-gold bg-gold/10'
                        : 'border-gold/30 hover:border-gold/50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {goal && !['Add 50 lbs to my deadlift', 'Build muscle mass', 'Get stronger overall', 'Hit a 300 lb bench press'].includes(goal) && (
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Enter your custom goal..."
                  className="w-full bg-slate-800 border border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold text-sm"
                />
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif mb-2">API Key</h1>
                <p className="text-gray-400 text-sm">
                  Your Claude API key (never shared, stays on your device)
                </p>
              </div>

              {error && <div className="bg-red-900/30 border border-red-500 rounded p-3 text-red-200 text-sm">{error}</div>}

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                  }}
                  placeholder="sk-ant-..."
                  className="w-full bg-slate-800 border border-gold/30 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-gold font-mono text-sm"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gold"
                >
                  {showKey ? '👁' : '👁‍🗨'}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Get your key from{' '}
                <a href="https://console.anthropic.com" className="text-gold hover:underline">
                  console.anthropic.com
                </a>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-300 transition disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Get Started'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
