'use client';

import type { Track } from '../types/index.js';

interface TrackSelectorProps {
  tracks: Track[];
  selectedTrackId: string;
  onSelectTrack: (trackId: string) => void;
  progress?: Record<string, number>;
}

export function TrackSelector({ tracks, selectedTrackId, onSelectTrack, progress }: TrackSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tracks.map(track => {
        const completed = progress?.[track.id] || 0;
        const total = track.lessons?.length || 5;
        const percentage = Math.round((completed / total) * 100);

        return (
          <button
            key={track.id}
            onClick={() => onSelectTrack(track.id)}
            className={`rounded-lg p-4 transition ${
              selectedTrackId === track.id
                ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                : 'border-2 border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <h3 className="font-semibold text-gray-800">{track.name}</h3>

            <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-gray-600">
              {completed}/{total} lessons
            </p>
          </button>
        );
      })}
    </div>
  );
}
