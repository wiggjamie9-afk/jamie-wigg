// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  passwordHash?: string;
  voiceFingerprint?: Buffer;
  appleHealthKitToken?: string;
  googleFitToken?: string;
  subscriptionStatus: 'free' | 'pro' | 'pro-plus' | 'lifetime';
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  lastActiveAt: Date;
}

// Lesson types
export interface Lesson {
  id: string;
  appId: string;
  trackId: string;
  index: number; // 0-4 within track
  title: string;
  body: string[];
  affirmation: string;
  strength: string;
  audioUrl?: string;
  audioEmotionalTone?: 'calm' | 'energetic' | 'compassionate';
}

export interface App {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  readAloudRate: number; // 0.85 - 1.0
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
}

export interface Track {
  id: string;
  name: string;
  lessons: Lesson[];
}

// Progress types
export interface Progress {
  id: string;
  userId: string;
  appId: string;
  trackId: string;
  lessonIndex: number;
  completedAt: Date;
  timeSpent: number; // seconds
  emotionalRating?: number; // 1-5
  streakDays: number;
  lastCompletedDay: Date;
}

// Biometric types
export interface Biometric {
  id: string;
  userId: string;
  heartRate: number;
  hrv: number; // Heart Rate Variability
  breathingRate: number;
  stressLevel: number; // 0-100
  emotionalState: 'calm' | 'anxious' | 'sad' | 'energized' | 'neutral';
  detectedAt: Date;
  source: 'apple_health' | 'google_fit' | 'manual' | 'voicebox';
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  appId?: string;
  messages: ChatMessage[];
  context: {
    currentLesson?: Lesson;
    recentBiometrics?: Biometric;
    userMood?: string;
  };
  createdAt: Date;
  lastMessageAt: Date;
}

// Voice types
export interface VoiceCommand {
  transcript: string;
  intent: 'lesson' | 'breathing' | 'humming' | 'chat' | 'emergency' | 'unknown';
  confidence: number;
  emotionalTone?: string;
  timestamp: Date;
}

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'pro' | 'pro-plus' | 'lifetime';
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface StreamingResponse {
  event: 'start' | 'content_block_delta' | 'message_stop' | 'error';
  content?: string;
  error?: string;
}
