'use client';

import { useState } from 'react';
import type { Lesson } from '../types/index.js';

interface LessonCardProps {
  lesson: Lesson;
  onComplete: (lessonId: string, rating?: number) => Promise<void>;
  isCompleted?: boolean;
  isActive?: boolean;
}

export function LessonCard({ lesson, onComplete, isCompleted, isActive }: LessonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${lesson.title}. ${lesson.body.join(' ')} Affirmation: ${lesson.affirmation}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onComplete(lesson.id, rating || undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`rounded-lg border-2 p-6 transition-all ${
        isActive
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : isCompleted
            ? 'border-green-400 bg-green-50'
            : 'border-gray-200 bg-white hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
          <p className="mt-1 text-sm text-gray-600">Strength: {lesson.strength}</p>
        </div>
        {isCompleted && (
          <div className="text-2xl">✓</div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="text-gray-700">
            {lesson.body.map((paragraph, i) => (
              <p key={i} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Affirmation</p>
            <p className="mt-1 text-base italic text-amber-800">{lesson.affirmation}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReadAloud}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isSpeaking
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSpeaking ? '⏸ Stop' : '🔊 Read Aloud'}
            </button>
          </div>

          {!isCompleted && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  How are you feeling?
                </label>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`h-10 w-10 rounded-full text-lg transition ${
                        rating === r
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {['😞', '😕', '😐', '🙂', '😊'][r - 1]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="w-full rounded-lg bg-green-500 px-4 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Mark as Complete'}
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        {isExpanded ? '▼ Collapse' : '▶ Expand'}
      </button>
    </div>
  );
}
