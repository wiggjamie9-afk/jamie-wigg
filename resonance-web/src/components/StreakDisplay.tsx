'use client';

interface StreakDisplayProps {
  streakDays: number;
  lastCompletedAt: Date | null;
  bestStreak?: number;
}

export function StreakDisplay({ streakDays, lastCompletedAt, bestStreak }: StreakDisplayProps) {
  const isOnStreak = lastCompletedAt
    ? new Date().getTime() - new Date(lastCompletedAt).getTime() < 24 * 60 * 60 * 1000
    : false;

  const getMilestone = (days: number) => {
    if (days >= 365) return '🔥 Year Master!';
    if (days >= 100) return '⭐ Century Champion!';
    if (days >= 30) return '🎯 Monthly Master!';
    if (days >= 7) return '🌟 Week Warrior!';
    if (days >= 3) return '✨ Rising Star!';
    return null;
  };

  return (
    <div className="rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 p-6 shadow-lg">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">Current Streak</p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-5xl font-bold text-orange-600">{streakDays}</span>
          <span className="text-3xl">🔥</span>
        </div>

        <p className="mt-2 text-lg font-semibold text-gray-800">{streakDays} day{streakDays !== 1 ? 's' : ''}</p>

        {!isOnStreak && lastCompletedAt && (
          <p className="mt-2 text-sm text-red-600">
            ⚠️ Complete a lesson today to keep your streak alive!
          </p>
        )}

        {getMilestone(streakDays) && (
          <p className="mt-4 text-lg font-bold text-amber-700">{getMilestone(streakDays)}</p>
        )}

        {bestStreak && bestStreak > streakDays && (
          <p className="mt-3 text-xs text-gray-600">Best streak: {bestStreak} days</p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-white/50 p-2">
          <p className="font-semibold text-gray-700">3-Day</p>
          <p className="text-2xl">{streakDays >= 3 ? '✓' : '○'}</p>
        </div>
        <div className="rounded-lg bg-white/50 p-2">
          <p className="font-semibold text-gray-700">7-Day</p>
          <p className="text-2xl">{streakDays >= 7 ? '✓' : '○'}</p>
        </div>
        <div className="rounded-lg bg-white/50 p-2">
          <p className="font-semibold text-gray-700">30-Day</p>
          <p className="text-2xl">{streakDays >= 30 ? '✓' : '○'}</p>
        </div>
      </div>
    </div>
  );
}
