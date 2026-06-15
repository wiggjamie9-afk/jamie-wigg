'use client';

import { useEffect, useState } from 'react';

interface CelebrationModalProps {
  isOpen?: boolean;
  type?: 'milestone' | 'streak' | 'app-complete' | 'achievement';
  milestone?: number;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function CelebrationModal({
  isOpen = false,
  type = 'milestone',
  milestone = 10,
  message,
  onClose,
  autoClose = true,
  duration = 3000,
}: CelebrationModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);

    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!show) return null;

  const celebrations = {
    milestone: {
      emoji: '🎉',
      title: `${milestone} Lessons Complete!`,
      message: message || 'You are making incredible progress!',
    },
    streak: {
      emoji: '🔥',
      title: `${milestone}-Day Streak!`,
      message: message || 'Keep up the amazing momentum!',
    },
    'app-complete': {
      emoji: '🏆',
      title: 'App Completed!',
      message: message || 'You mastered all lessons in this app!',
    },
    achievement: {
      emoji: '⭐',
      title: 'Achievement Unlocked!',
      message: message || 'Congratulations on your progress!',
    },
  };

  const content = celebrations[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="animate-pop rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 p-8 text-center shadow-2xl">
        <div className="text-6xl">{content.emoji}</div>

        <h2 className="mt-4 text-2xl font-bold text-gray-800">{content.title}</h2>

        <p className="mt-2 text-gray-700">{content.message}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="animate-float text-2xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {['✨', '💫', '⭐', '🌟'][i % 4]}
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            setShow(false);
            onClose?.();
          }}
          className="mt-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 font-semibold text-white transition hover:from-blue-600 hover:to-purple-600"
        >
          Continue 🚀
        </button>
      </div>

      <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-pop {
          animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
