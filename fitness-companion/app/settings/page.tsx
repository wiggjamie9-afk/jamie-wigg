'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProfile, saveProfile } from '@/lib/db';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [coachName, setCoachName] = useState('');

  useEffect(() => {
    async function load() {
      const p = await getProfile();
      if (p) {
        setProfile(p);
        setCoachName(p.preferences.coachName);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (profile) {
      profile.preferences.coachName = coachName;
      await saveProfile(profile);
      alert('Settings saved!');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-black p-6">
      <Link href="/" className="text-gold mb-8">
        ← Back
      </Link>

      <div className="max-w-sm mx-auto w-full">
        <h1 className="text-3xl font-serif mb-8">Settings</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-gold">Coach Name</label>
            <input
              type="text"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              className="w-full bg-slate-800 border border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gold">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={profile?.apiKey || ''}
                disabled
                className="w-full bg-slate-800 border border-gold/30 rounded-lg px-4 py-2 pr-10 text-gray-500 font-mono text-sm"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showKey ? '👁' : '👁‍🗨'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              To change your API key, delete this app and set up again.
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gold">Goals</label>
            <div className="bg-slate-800/30 rounded p-3 space-y-2">
              {profile?.goals?.map((goal: string, i: number) => (
                <div key={i} className="text-sm">{goal}</div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gold">Personality</label>
            <p className="text-sm capitalize">
              {profile?.preferences?.personality}
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
