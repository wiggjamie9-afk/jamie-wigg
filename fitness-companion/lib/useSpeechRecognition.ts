'use client';
import { useEffect, useRef, useState } from 'react';

interface UseSpeechProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export function useSpeechRecognition({ onTranscript, language = 'en-US' }: UseSpeechProps) {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SR) {
      setSupported(false);
      setError('Speech recognition not supported in this browser');
      return;
    }

    setSupported(true);
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language;

    recognitionRef.current.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onTranscript(transcript.toLowerCase().trim());
    };

    recognitionRef.current.onend = () => setListening(false);

    recognitionRef.current.onerror = (event: any) => {
      setError(event.error);
      setListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript, language]);

  const start = () => {
    if (recognitionRef.current && !listening) {
      try {
        recognitionRef.current.start();
      } catch {
        // Already started
      }
    }
  };

  const stop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
    }
  };

  return { start, stop, listening, supported, error };
}
