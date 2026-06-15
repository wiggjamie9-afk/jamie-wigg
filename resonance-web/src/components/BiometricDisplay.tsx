'use client';

import type { Biometric } from '../types/index.js';

interface BiometricDisplayProps {
  biometric?: Biometric;
  trend?: {
    heartRate: { current: number; average: number; trend: string };
    hrv: { current: number; average: number; trend: string };
    stressLevel: { current: number; average: number; trend: string };
  };
}

export function BiometricDisplay({ biometric, trend }: BiometricDisplayProps) {
  if (!biometric && !trend) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center text-gray-500">
        <p className="text-sm">Connect Apple Health or Google Fit to view biometrics</p>
      </div>
    );
  }

  const getStressColor = (level: number) => {
    if (level < 30) return 'text-green-600';
    if (level < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressBg = (level: number) => {
    if (level < 30) return 'bg-green-50';
    if (level < 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getTrendArrow = (trendValue: string) => {
    if (trendValue === 'up') return '📈';
    if (trendValue === 'down') return '📉';
    return '➡️';
  };

  return (
    <div className="space-y-4">
      {trend && (
        <>
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Heart Rate
                </p>
                <p className="mt-1 text-3xl font-bold text-blue-700">
                  {trend.heartRate.current}
                  <span className="text-lg"> bpm</span>
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Avg: {trend.heartRate.average} {getTrendArrow(trend.heartRate.trend)}
                </p>
              </div>
              <div className="text-4xl">❤️</div>
            </div>
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Heart Rate Variability
                </p>
                <p className="mt-1 text-3xl font-bold text-purple-700">
                  {trend.hrv.current}
                  <span className="text-lg"> ms</span>
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Avg: {trend.hrv.average} {getTrendArrow(trend.hrv.trend)}
                </p>
                <p className="mt-2 text-xs text-gray-700">Higher HRV = better recovery</p>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </div>

          <div className={`rounded-lg ${getStressBg(trend.stressLevel.current)} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Stress Level
                </p>
                <p className={`mt-1 text-3xl font-bold ${getStressColor(trend.stressLevel.current)}`}>
                  {trend.stressLevel.current}
                  <span className="text-lg">%</span>
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Avg: {trend.stressLevel.average}% {getTrendArrow(trend.stressLevel.trend)}
                </p>
              </div>
              <div className="text-4xl">
                {trend.stressLevel.current < 30 ? '😌' : trend.stressLevel.current < 60 ? '😐' : '😰'}
              </div>
            </div>
          </div>
        </>
      )}

      {biometric && (
        <div className="rounded-lg border-2 border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Latest Reading</p>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Heart Rate</p>
              <p className="font-semibold text-gray-800">{biometric.heartRate} bpm</p>
            </div>
            <div>
              <p className="text-gray-600">Breathing Rate</p>
              <p className="font-semibold text-gray-800">{biometric.breathingRate} /min</p>
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            From {biometric.source} • {new Date(biometric.detectedAt).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
