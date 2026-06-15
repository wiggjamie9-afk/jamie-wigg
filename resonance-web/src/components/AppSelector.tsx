'use client';

import type { App } from '../types/index.js';

interface AppSelectorProps {
  apps: App[];
  selectedAppId?: string;
  onSelectApp: (appId: string) => void;
  userProgress?: Record<string, { completed: number; total: number }>;
}

export function AppSelector({ apps, selectedAppId, onSelectApp, userProgress }: AppSelectorProps) {
  const appEmojis: Record<string, string> = {
    'bright-brains': '🧠',
    'mum-brain': '👩‍👧',
    'dad-brain': '👨‍👦',
    'abilities-brain': '✨',
    sleep: '😴',
    relationships: '💕',
    money: '💰',
    sobriety: '🌟',
  };

  return (
    <div className="grid auto-rows-max grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {apps.map(app => {
        const progress = userProgress?.[app.id];
        const completed = progress?.completed || 0;
        const total = progress?.total || 20;
        const percentage = Math.round((completed / total) * 100);
        const emoji = appEmojis[app.id] || '🎯';

        return (
          <button
            key={app.id}
            onClick={() => onSelectApp(app.id)}
            className={`group rounded-lg p-4 transition-all ${
              selectedAppId === app.id
                ? 'border-2 border-blue-500 bg-blue-50 shadow-lg'
                : 'border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="text-3xl">{emoji}</div>

            <h3 className="mt-2 font-semibold text-gray-800">{app.name}</h3>

            <p className="mt-1 line-clamp-2 text-xs text-gray-600">{app.description}</p>

            {progress && (
              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-semibold text-gray-600">
                  {completed}/{total}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
