// Reuse types from API
export interface Lesson {
  id: string;
  appId: string;
  trackId: string;
  index: number;
  title: string;
  body: string[];
  affirmation: string;
  strength: string;
  audioUrl?: string;
}

export interface Track {
  id: string;
  name: string;
  lessons: Lesson[];
}

export interface App {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  readAloudRate: number;
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  subscriptionStatus: 'free' | 'pro' | 'pro-plus' | 'lifetime';
}

export interface Progress {
  appId: string;
  trackId: string;
  lessonIndex: number;
  completedAt: Date;
  streakDays: number;
}

export interface Biometric {
  heartRate?: number;
  hrv?: number;
  breathingRate?: number;
  stressLevel?: number;
  emotionalState?: string;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// UI State
export interface AppState {
  currentApp?: App;
  currentTrack?: string;
  currentLessonIndex: number;
  completedLessons: string[]; // lesson IDs
  streak: number;
  lastCompletedDay: Date | null;
  biometrics: Biometric | null;
}

export interface UserPreferences {
  textSize: 'small' | 'normal' | 'large' | 'extra-large';
  theme: 'light' | 'dark' | 'auto';
  speechRate: 0.5 | 0.75 | 0.85 | 0.90 | 0.95 | 1.0;
  highContrast: boolean;
  dyslexiaFont: boolean;
  readingRuler: boolean;
}
