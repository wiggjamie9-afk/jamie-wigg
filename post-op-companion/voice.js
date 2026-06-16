// Natural Voice Engine — ElevenLabs (natural human voice) with system-voice fallback
//
// Design goals:
//  - When the user has entered an ElevenLabs API key in Settings, all spoken
//    coaching uses a natural, human-sounding voice (NOT robotic).
//  - When no key is present (or offline), it falls back to the device's best
//    available system voice so the app still talks. On iOS the system voices
//    (e.g. "Samantha", "Ava") are high quality and sound natural.
//  - Audio is generated on demand and cached so the same line isn't re-fetched.
//  - A single global toggle lets the user mute everything.

class VoiceCoach {
  constructor() {
    this.apiKey = localStorage.getItem('elevenlabs-api-key') || null;
    // Default voice: "Rachel" — a warm, natural female narration voice.
    // Users can override via Settings.
    this.voiceId = localStorage.getItem('elevenlabs-voice-id') || '21m00Tcm4TlvDq8ikWAM';
    this.modelId = 'eleven_turbo_v2_5'; // low latency, natural prosody
    this.enabled = localStorage.getItem('voice-enabled') !== 'false'; // on by default
    this.baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech';
    this.cache = new Map(); // text -> object URL
    this.currentAudio = null;
    this._preferredSystemVoice = null;

    // Warm up system voices (they load asynchronously in some browsers)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => this._pickSystemVoice();
      this._pickSystemVoice();
    }
  }

  setApiKey(key) {
    this.apiKey = key ? key.trim() : null;
    if (this.apiKey) {
      localStorage.setItem('elevenlabs-api-key', this.apiKey);
    } else {
      localStorage.removeItem('elevenlabs-api-key');
    }
  }

  setVoiceId(id) {
    this.voiceId = id;
    localStorage.setItem('elevenlabs-voice-id', id);
    this.cache.clear(); // voice changed — invalidate cached audio
  }

  setEnabled(on) {
    this.enabled = on;
    localStorage.setItem('voice-enabled', on ? 'true' : 'false');
    if (!on) this.stop();
  }

  // Public entry point. Speaks `text` with a natural voice.
  async speak(text, opts = {}) {
    if (!this.enabled || !text) return;
    this.stop(); // never overlap two voices

    if (this.apiKey) {
      try {
        await this._speakElevenLabs(text, opts);
        return;
      } catch (err) {
        console.warn('ElevenLabs voice failed, falling back to system voice:', err);
        // fall through to system voice
      }
    }
    this._speakSystem(text, opts);
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // --- ElevenLabs (natural human voice) ---
  async _speakElevenLabs(text, opts) {
    const cacheKey = `${this.voiceId}:${text}`;
    let url = this.cache.get(cacheKey);

    if (!url) {
      const response = await fetch(`${this.baseUrl}/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: this.modelId,
          voice_settings: {
            stability: opts.stability ?? 0.5,
            similarity_boost: opts.similarity ?? 0.75,
            style: opts.style ?? 0.3, // a little warmth/expressiveness
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const blob = await response.blob();
      url = URL.createObjectURL(blob);
      this.cache.set(cacheKey, url);
    }

    const audio = new Audio(url);
    this.currentAudio = audio;
    await audio.play();
  }

  // --- System voice fallback (offline / no key) ---
  _pickSystemVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;

    // Prefer the natural-sounding English voices iOS/macOS/Chrome ship with.
    const preferredNames = [
      'Samantha', 'Ava', 'Allison', 'Susan', 'Karen', 'Moira', 'Tessa',
      'Google US English', 'Microsoft Aria', 'Microsoft Jenny',
    ];
    for (const name of preferredNames) {
      const match = voices.find(v => v.name.includes(name));
      if (match) { this._preferredSystemVoice = match; return; }
    }
    // Otherwise first English voice
    this._preferredSystemVoice =
      voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
  }

  _speakSystem(text, opts) {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    if (this._preferredSystemVoice) utter.voice = this._preferredSystemVoice;
    // Slightly slower + natural pitch reads as calmer/human, not robotic.
    utter.rate = opts.rate ?? 0.95;
    utter.pitch = opts.pitch ?? 1.0;
    utter.volume = opts.volume ?? 1.0;
    window.speechSynthesis.speak(utter);
  }

  // Does the user have a natural (ElevenLabs) voice configured?
  hasNaturalVoice() {
    return !!this.apiKey;
  }
}

// Global singleton — modules call window.voice.speak("...")
const voice = new VoiceCoach();
if (typeof window !== 'undefined') window.voice = voice;
