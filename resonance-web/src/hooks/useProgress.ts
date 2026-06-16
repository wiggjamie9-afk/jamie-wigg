import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';

interface AppProgress {
  userId: string;
  appId: string;
  totalLessonsCompleted: number;
  currentStreak: number;
  averageEmotionalRating: number;
  totalTimeSpent: number;
  tracksStarted: number;
  recentCompletions: any[];
}

interface CompletionResult {
  success: boolean;
  progress: any;
  totalLessonsCompleted: number;
  currentStreak: number;
  milestone: boolean;
  celebration: boolean;
}

interface UseProgressReturn {
  progress: AppProgress | null;
  loading: boolean;
  error: string | null;
  getProgress: (userId: string, appId: string) => Promise<void>;
  completeLesson: (
    userId: string,
    appId: string,
    trackId: string,
    lessonIndex: number,
    timeSpent?: number,
    emotionalRating?: number
  ) => Promise<CompletionResult>;
}

export const useProgress = (): UseProgressReturn => {
  const [progress, setProgress] = useState<AppProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProgress = useCallback(async (userId: string, appId: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getProgress(userId, appId);
      setProgress(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch progress';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const completeLesson = useCallback(
    async (
      userId: string,
      appId: string,
      trackId: string,
      lessonIndex: number,
      timeSpent?: number,
      emotionalRating?: number
    ): Promise<CompletionResult> => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiClient.completeLesson(
          userId,
          appId,
          trackId,
          lessonIndex,
          timeSpent,
          emotionalRating
        );

        // Refresh progress
        await getProgress(userId, appId);

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to complete lesson';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getProgress]
  );

  return {
    progress,
    loading,
    error,
    getProgress,
    completeLesson,
  };
};
