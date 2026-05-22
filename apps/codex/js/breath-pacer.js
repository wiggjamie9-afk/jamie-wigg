// Sine-eased breath pacer.
// Default cadence: 0.1 Hz (5s inhale + 5s exhale = 10s cycle).
// Renders to an .breath-orb element via scale + opacity, drives a "BREATHE IN / OUT" cue.

export class BreathPacer {
  constructor(orbEl, cueEl, { cycleMs = 10000 } = {}) {
    this.orb = orbEl;
    this.cue = cueEl;
    this.cycleMs = cycleMs;
    this.running = false;
    this.startedAt = 0;
    this._frame = null;
    this._listeners = new Set();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startedAt = performance.now();
    this._loop();
  }

  stop() {
    this.running = false;
    if (this._frame) cancelAnimationFrame(this._frame);
    this._frame = null;
    if (this.orb) {
      this.orb.style.transform = 'scale(0.4)';
      this.orb.style.opacity = '0.4';
    }
    if (this.cue) this.cue.textContent = '';
  }

  // Subscribe to phase changes — gets called with 'in' or 'out' at each half cycle.
  onPhase(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _loop = () => {
    if (!this.running) return;
    const t = (performance.now() - this.startedAt) % this.cycleMs;
    const p = t / this.cycleMs; // 0..1 over one full breath
    const inhale = p < 0.5;
    // Sine eased 0..1..0
    const eased = 0.5 - 0.5 * Math.cos((p * 2) * Math.PI);
    const scale = 0.4 + eased * 0.6;     // 0.4 .. 1.0
    const opacity = 0.4 + eased * 0.6;   // 0.4 .. 1.0

    if (this.orb) {
      this.orb.style.transform = `scale(${scale.toFixed(3)})`;
      this.orb.style.opacity = opacity.toFixed(3);
    }

    const phase = inhale ? 'in' : 'out';
    if (this.cue && this._lastPhase !== phase) {
      this.cue.textContent = inhale ? 'Breathe in' : 'Breathe out';
      this._lastPhase = phase;
      this._listeners.forEach(fn => fn(phase));
    }

    this._frame = requestAnimationFrame(this._loop);
  };
}
