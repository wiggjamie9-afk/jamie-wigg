// Protocol player. Orchestrates a guided session:
//   - Drives a custom-cadence BreathPacer
//   - Surfaces live CoherenceEngine metrics
//   - Layers an optional frequency player tone
//   - Calls Streak.recordSession() on completion
//
// Each protocol declares its breath pattern as { inhale, hold, exhale, holdOut } seconds.
// The total cycleMs is sum * 1000. The pacer drives the orb; we still listen to phase
// transitions so we can emit cues at hold points if present (future: in/hold/out animation).

import { BreathPacer } from './breath-pacer.js';
import { Streak } from './streak.js';

export class ProtocolPlayer {
  constructor({ orbEl, cueEl, statusEl, coherenceEngine, frequencyPlayer }) {
    this.orb = orbEl;
    this.cue = cueEl;
    this.status = statusEl;
    this.engine = coherenceEngine;
    this.freq = frequencyPlayer;
    this.pacer = null;
    this.protocol = null;
    this.startedAt = 0;
    this.timer = null;
    this.onComplete = null;
  }

  async play(protocol, onComplete) {
    this.protocol = protocol;
    this.onComplete = onComplete;
    this.startedAt = Date.now();

    const pattern = protocol.breath || { inhale: 5, hold: 0, exhale: 5, holdOut: 0 };
    const cycleMs = (pattern.inhale + pattern.hold + pattern.exhale + pattern.holdOut) * 1000;
    this.pacer = new BreathPacer(this.orb, this.cue, { cycleMs });
    this.pacer.start();

    if (protocol.frequencyHz && this.freq) {
      await this.freq.setSolfeggio(protocol.frequencyHz);
    }

    if (this.status) this.status.textContent = `${protocol.title.toUpperCase()} · IN SESSION`;

    this.timer = setTimeout(() => this.finish(), (protocol.durationSeconds || 300) * 1000);
  }

  finish() {
    if (!this.protocol) return;
    const proto = this.protocol;
    this.stop({ completed: true });
    const { state, ticked } = Streak.recordSession();
    if (this.onComplete) this.onComplete({ protocol: proto, streak: state, ticked });
  }

  stop({ completed = false } = {}) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (this.pacer) this.pacer.stop();
    this.pacer = null;
    if (this.freq) this.freq.stop();
    if (this.status) {
      this.status.textContent = completed ? 'SESSION COMPLETE' : '';
      this.status.classList.toggle('ok', completed);
    }
    this.protocol = null;
  }

  elapsedSeconds() {
    return this.startedAt ? Math.floor((Date.now() - this.startedAt) / 1000) : 0;
  }
}
