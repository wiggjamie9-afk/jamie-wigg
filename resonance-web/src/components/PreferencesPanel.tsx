'use client';

import { useState } from 'react';

interface PreferencesPanelProps {
  textSize?: number;
  speechRate?: number;
  theme?: 'light' | 'dark' | 'auto';
  dyslexiaFont?: boolean;
  readingRuler?: boolean;
  onPreferencesChange?: (prefs: any) => void;
}

export function PreferencesPanel({
  textSize = 16,
  speechRate = 0.9,
  theme = 'light',
  dyslexiaFont = false,
  readingRuler = false,
  onPreferencesChange,
}: PreferencesPanelProps) {
  const [size, setSize] = useState(textSize);
  const [rate, setRate] = useState(speechRate);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [useDyslexiaFont, setUseDyslexiaFont] = useState(dyslexiaFont);
  const [useReadingRuler, setUseReadingRuler] = useState(readingRuler);

  const handleChange = () => {
    onPreferencesChange?.({
      textSize: size,
      speechRate: rate,
      theme: currentTheme,
      dyslexiaFont: useDyslexiaFont,
      readingRuler: useReadingRuler,
    });
  };

  return (
    <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>

      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Text Size
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="range"
              min="12"
              max="24"
              value={size}
              onChange={e => {
                setSize(Number(e.target.value));
                handleChange();
              }}
              className="flex-1"
            />
            <span style={{ fontSize: `${size}px` }} className="font-semibold text-gray-800">
              Aa
            </span>
            <span className="text-xs text-gray-600">{size}px</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Speech Rate
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={rate}
              onChange={e => {
                setRate(Number(e.target.value));
                handleChange();
              }}
              className="flex-1"
            />
            <span className="text-xs text-gray-600">{rate.toFixed(1)}x</span>
            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance('Testing speech rate');
                utterance.rate = rate;
                window.speechSynthesis.speak(utterance);
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Test
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Theme</label>
          <div className="mt-2 flex gap-3">
            {(['light', 'dark', 'auto'] as const).map(t => (
              <button
                key={t}
                onClick={() => {
                  setCurrentTheme(t);
                  handleChange();
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  currentTheme === t
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {t === 'light' && '☀️ Light'}
                {t === 'dark' && '🌙 Dark'}
                {t === 'auto' && '⚙️ Auto'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={useDyslexiaFont}
              onChange={e => {
                setUseDyslexiaFont(e.target.checked);
                handleChange();
              }}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm font-semibold text-gray-700">
              Dyslexia-Friendly Font
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-600">
            Use OpenDyslexic font for easier reading
          </p>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={useReadingRuler}
              onChange={e => {
                setUseReadingRuler(e.target.checked);
                handleChange();
              }}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm font-semibold text-gray-700">
              Reading Ruler
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-600">
            Show a line guide while reading
          </p>
        </div>
      </div>
    </div>
  );
}
