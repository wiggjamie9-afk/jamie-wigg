'use client';

import { useEffect, useState } from 'react';

interface BreathingAnimationProps {
  isActive?: boolean;
  duration?: number;
  cycleCount?: number;
  onComplete?: () => void;
}

const BREATHING_CYCLE = {
  inhale: 4,
  hold: 4,
  exhale: 4,
};

export function BreathingAnimation({
  isActive = true,
  duration = 4,
  cycleCount = 5,
  onComplete,
}: BreathingAnimationProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(isActive);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress(p => {
        const newProgress = p + (100 / (duration * 10)); // Update 10 times per second

        if (newProgress >= 100) {
          setPhase(ph => {
            if (ph === 'inhale') return 'hold';
            if (ph === 'hold') return 'exhale';

            setCycles(c => {
              const newCycles = c + 1;
              if (newCycles >= cycleCount) {
                setIsRunning(false);
                onComplete?.();
              }
              return newCycles;
            });

            return 'inhale';
          });

          return 0;
        }

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, duration, cycleCount, onComplete]);

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
    }
  };

  const getScaleAmount = () => {
    if (phase === 'inhale') return 1 + progress / 100;
    if (phase === 'hold') return 1.4;
    return 1.4 - (progress / 100) * 0.4;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      <div className="relative h-64 w-64">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-80 shadow-2xl transition-transform"
          style={{
            transform: `scale(${getScaleAmount()})`,
            transitionDuration: `${(duration / 2) * 1000}ms`,
            transitionTimingFunction: 'ease-in-out',
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full">
          <p className="text-2xl font-bold text-white">{getPhaseLabel()}</p>
          <p className="mt-2 text-sm text-white/80">
            Cycle {cycles + 1}/{cycleCount}
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">4-4-4 Breathing Pattern</p>
        <p className="mt-1 text-xs text-gray-600">
          Inhale for 4s • Hold for 4s • Exhale for 4s
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`rounded-lg px-6 py-2 font-semibold text-white transition ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Resume'}
        </button>

        {(isRunning || cycles > 0) && (
          <button
            onClick={() => {
              setIsRunning(false);
              setPhase('inhale');
              setProgress(0);
              setCycles(0);
            }}
            className="rounded-lg bg-gray-500 px-6 py-2 font-semibold text-white transition hover:bg-gray-600"
          >
            Reset
          </button>
        )}
      </div>

      {cycles >= cycleCount && (
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="font-semibold text-green-800">✓ Breathing session complete!</p>
          <p className="mt-1 text-sm text-green-700">Great job finding your calm.</p>
        </div>
      )}
    </div>
  );
}
