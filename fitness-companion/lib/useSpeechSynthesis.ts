'use client';
import { useEffect, useState } from 'react';

interface UseSpeechSynthesisProps {
  elevenLabsKey?: string;
  elevenLabsVoiceId?: string;
}

export function useSpeechSynthesis({ elevenLabsKey, elevenLabsVoiceId }: UseSpeechSynthesisProps = {}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(!!window.speechSynthesis);
  }, []);

  const speak = async (text: string) => {
    if (!text) return;

    // If ElevenLabs is configured, use it for premium voice
    if (elevenLabsKey && elevenLabsVoiceId) {
      try {
        setSpeaking(true);
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + elevenLabsVoiceId, {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audio = new Audio(URL.createObjectURL(audioBlob));
          audio.onended = () => setSpeaking(false);
          audio.play();
          return;
        }
      } catch (error) {
        console.error('ElevenLabs error, falling back to Web Speech:', error);
      }
    }

    // Fallback to Web Speech Synthesis API
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Use a quality voice if available
    const voices = window.speechSynthesis.getVoices();
    const qualityVoice = voices.find((v) => v.name.includes('Google') || v.name.includes('Enhanced'));
    if (qualityVoice) {
      utterance.voice = qualityVoice;
    }

    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  return { speak, stop, speaking, supported };
}
