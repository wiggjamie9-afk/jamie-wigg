import { useState, useCallback, useEffect } from 'react';
import type { Lesson } from '../types/index.js';
import { usePreferences } from './useAppState.js';

interface UseLessonProps {
  lesson?: Lesson;
}

interface UseLessonReturn {
  isReading: boolean;
  startReading: () => void;
  stopReading: () => void;
  toggleReading: () => void;
  readingProgress: number;
}

export function useLesson({ lesson }: UseLessonProps): UseLessonReturn {
  const [isReading, setIsReading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const preferences = usePreferences();
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const getAllText = useCallback((): string => {
    if (!lesson) return '';
    return [
      lesson.title,
      ...lesson.body,
      lesson.affirmation,
      lesson.strength,
    ].join(' ');
  }, [lesson]);

  const startReading = useCallback(() => {
    if (!synth || !lesson) return;

    synth.cancel(); // Cancel any ongoing speech
    setIsReading(true);
    setReadingProgress(0);

    const text = getAllText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = preferences.speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setIsReading(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsReading(false);
    };

    // Update progress (approximate, since we can't get actual progress)
    const estimatedDuration = (text.split(/\s+/).length / 140) * 60 * 1000; // ms
    const interval = setInterval(() => {
      setReadingProgress((prev) => {
        const next = prev + (100 / (estimatedDuration / 100));
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 100);

    synth.speak(utterance);
  }, [synth, lesson, getAllText, preferences.speechRate]);

  const stopReading = useCallback(() => {
    if (!synth) return;
    synth.cancel();
    setIsReading(false);
    setReadingProgress(0);
  }, [synth]);

  const toggleReading = useCallback(() => {
    if (isReading) {
      stopReading();
    } else {
      startReading();
    }
  }, [isReading, startReading, stopReading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synth && isReading) {
        synth.cancel();
      }
    };
  }, [synth, isReading]);

  return {
    isReading,
    startReading,
    stopReading,
    toggleReading,
    readingProgress,
  };
}

// Hook for managing breathing/humming with animation
interface UseBreathingProps {
  durationSeconds?: number;
  frequency?: number; // Hz (e.g., 432 for 432 Hz)
}

export function useBreathing({ durationSeconds = 11, frequency }: UseBreathingProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const inhaleTime = 4000; // 4 seconds
    const holdTime = 4000; // 4 seconds
    const exhaleTime = 4000; // 4 seconds
    const cycleTime = inhaleTime + holdTime + exhaleTime;
    const totalTime = durationSeconds * 1000;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(100, (elapsed / totalTime) * 100);
      setProgress(progressPercent);

      const cyclePosition = elapsed % cycleTime;

      if (cyclePosition < inhaleTime) {
        setPhase('inhale');
      } else if (cyclePosition < inhaleTime + holdTime) {
        setPhase('hold');
      } else {
        setPhase('exhale');
      }

      if (elapsed >= totalTime) {
        setIsActive(false);
        setProgress(100);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, durationSeconds]);

  return {
    isActive,
    setIsActive,
    phase,
    progress,
  };
}

// Hook for voice commands
interface UseVoiceCommandProps {
  onCommand?: (intent: string, transcript: string) => void;
}

export function useVoiceCommand({ onCommand }: UseVoiceCommandProps) {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const confidence = event.results[0][0].confidence;

      // Simple intent matching
      let intent = 'unknown';
      if (transcript.includes('breathing') || transcript.includes('breathe')) {
        intent = 'breathing';
      } else if (transcript.includes('humming') || transcript.includes('hum')) {
        intent = 'humming';
      } else if (transcript.includes('chat') || transcript.includes('talk')) {
        intent = 'chat';
      } else if (transcript.includes('help') || transcript.includes('emergency')) {
        intent = 'emergency';
      } else if (transcript.includes('next') || transcript.includes('continue')) {
        intent = 'lesson';
      }

      if (onCommand && confidence > 0.5) {
        onCommand(intent, transcript);
      }
    };

    recognition.start();
  }, [onCommand]);

  return {
    isListening,
    startListening,
  };
}
