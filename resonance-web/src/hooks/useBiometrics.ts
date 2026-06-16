import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/api';

interface BiometricReading {
  heart_rate?: number;
  hrv?: number;
  breathing_rate?: number;
  stress_level?: number;
  emotional_state?: string;
  source: string;
  detected_at?: Date;
}

interface BiometricTrend {
  range: string;
  heartRate: {
    current: number;
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
  hrv: {
    current: number;
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
  stressLevel: {
    current: number;
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface UseBiometricsReturn {
  latest: BiometricReading | null;
  trend: BiometricTrend | null;
  history: BiometricReading[];
  loading: boolean;
  error: string | null;
  submitReading: (userId: string, data: any) => Promise<void>;
  getLatest: (userId: string) => Promise<void>;
  getTrend: (userId: string, range?: string) => Promise<void>;
  getHistory: (userId: string, limit?: number) => Promise<void>;
  linkHealthKit: (userId: string, token: string) => Promise<void>;
  linkGoogleFit: (userId: string, token: string) => Promise<void>;
}

export const useBiometrics = (): UseBiometricsReturn => {
  const [latest, setLatest] = useState<BiometricReading | null>(null);
  const [trend, setTrend] = useState<BiometricTrend | null>(null);
  const [history, setHistory] = useState<BiometricReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReading = useCallback(async (userId: string, data: any) => {
    try {
      setLoading(true);
      setError(null);

      await apiClient.submitBiometrics(userId, data);

      // Refresh latest reading
      await getLatest(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit biometrics';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatest = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getLatestBiometrics(userId);
      setLatest(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch latest biometrics';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrend = useCallback(async (userId: string, range?: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getBiometricTrend(userId, range);
      setTrend(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch biometric trends';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getHistory = useCallback(async (userId: string, limit?: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getBiometricHistory(userId, limit);
      setHistory(data.readings);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch biometric history';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const linkHealthKit = useCallback(async (userId: string, token: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiClient.linkHealthKit(userId, token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to link HealthKit';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const linkGoogleFit = useCallback(async (userId: string, token: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiClient.linkGoogleFit(userId, token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to link Google Fit';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    latest,
    trend,
    history,
    loading,
    error,
    submitReading,
    getLatest,
    getTrend,
    getHistory,
    linkHealthKit,
    linkGoogleFit,
  };
};
