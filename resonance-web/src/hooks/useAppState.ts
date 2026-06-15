import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, App, Biometric, UserPreferences } from '../types/index.js';

interface Store extends AppState {
  setCurrentApp: (app: App) => void;
  setCurrentTrack: (trackId: string) => void;
  setCurrentLessonIndex: (index: number) => void;
  completeLesson: (lessonId: string) => void;
  updateStreak: (days: number) => void;
  updateBiometrics: (biometrics: Biometric) => void;
  resetProgress: () => void;
  getNextLesson: () => { app?: App; trackId?: string; lessonIndex: number } | null;
  getProgressPercentage: () => number;
}

interface PreferencesStore extends UserPreferences {
  setTextSize: (size: UserPreferences['textSize']) => void;
  setTheme: (theme: UserPreferences['theme']) => void;
  setSpeechRate: (rate: UserPreferences['speechRate']) => void;
  setHighContrast: (enabled: boolean) => void;
  setDyslexiaFont: (enabled: boolean) => void;
  setReadingRuler: (enabled: boolean) => void;
}

// App State Store
export const useAppState = create<Store>()(
  persist(
    (set, get) => ({
      currentLessonIndex: 0,
      completedLessons: [],
      streak: 0,
      lastCompletedDay: null,
      biometrics: null,

      setCurrentApp: (app: App) => set({ currentApp: app }),

      setCurrentTrack: (trackId: string) => set({ currentTrack: trackId }),

      setCurrentLessonIndex: (index: number) => set({ currentLessonIndex: index }),

      completeLesson: (lessonId: string) => {
        const state = get();
        const today = new Date().toDateString();
        const lastDay = state.lastCompletedDay?.toDateString();
        const isConsecutiveDay = lastDay === today || !lastDay;

        let newStreak = state.streak;
        if (isConsecutiveDay && lastDay !== today) {
          newStreak += 1;
        } else if (lastDay !== today) {
          newStreak = 1;
        }

        set({
          completedLessons: [...state.completedLessons, lessonId],
          streak: newStreak,
          lastCompletedDay: new Date(),
        });
      },

      updateStreak: (days: number) => set({ streak: days }),

      updateBiometrics: (biometrics: Biometric) => set({ biometrics }),

      resetProgress: () => set({
        currentLessonIndex: 0,
        completedLessons: [],
        streak: 0,
        lastCompletedDay: null,
      }),

      getNextLesson: () => {
        const state = get();
        if (!state.currentApp || !state.currentTrack) return null;

        const track = state.currentApp.tracks.find(t => t.id === state.currentTrack);
        if (!track) return null;

        // Find next uncompleted lesson
        for (let i = 0; i < track.lessons.length; i++) {
          const lesson = track.lessons[i];
          if (!state.completedLessons.includes(lesson.id)) {
            return {
              app: state.currentApp,
              trackId: state.currentTrack,
              lessonIndex: i,
            };
          }
        }

        return null; // All lessons completed in this track
      },

      getProgressPercentage: () => {
        const state = get();
        if (!state.currentApp) return 0;

        const totalLessons = state.currentApp.tracks.reduce(
          (sum, track) => sum + track.lessons.length,
          0,
        );

        if (totalLessons === 0) return 0;
        return Math.round((state.completedLessons.length / totalLessons) * 100);
      },
    }),
    {
      name: 'resonance-app-state',
    },
  ),
);

// User Preferences Store
export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      textSize: 'normal',
      theme: 'auto',
      speechRate: 0.95,
      highContrast: false,
      dyslexiaFont: false,
      readingRuler: false,

      setTextSize: (size) => set({ textSize: size }),
      setTheme: (theme) => set({ theme }),
      setSpeechRate: (rate) => set({ speechRate: rate }),
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      setDyslexiaFont: (enabled) => set({ dyslexiaFont: enabled }),
      setReadingRuler: (enabled) => set({ readingRuler: enabled }),
    }),
    {
      name: 'resonance-preferences',
    },
  ),
);
