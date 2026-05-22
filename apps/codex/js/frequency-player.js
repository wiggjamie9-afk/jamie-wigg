// Frequency player — WebAudio-only solfeggio + binaural beats.
// No file assets required; pure synthesis so it ships in the static shell.
//
// Solfeggio set: 174, 285, 396, 417, 528, 639, 741, 852, 963 Hz.
// Binaural: stereo channel L = base, R = base + beat. Beat in 0–40 Hz range.

export const SOLFEGGIO = [174, 285, 396, 417, 528, 639, 741, 852, 963];

export class FrequencyPlayer {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.tone = null;          // solfeggio oscillator (stereo merged)
    this.binauralLeft = null;
    this.binauralRight = null;
    this.merger = null;
    this.state = { freq: 0, beat: 0, gain: 0.18 };
  }

  _ensureCtx() {
    if (this.ctx) return;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.state.gain;
    this.master.connect(this.ctx.destination);
  }

  async setSolfeggio(hz) {
    this._ensureCtx();
    await this.ctx.resume();
    this._stopTone();
    if (!hz) { this.state.freq = 0; return; }
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = hz;
    const g = this.ctx.createGain();
    g.gain.value = 0;
    osc.connect(g).connect(this.master);
    osc.start();
    g.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 0.6);
    this.tone = { osc, gain: g };
    this.state.freq = hz;
  }

  async setBinaural(baseHz, beatHz) {
    this._ensureCtx();
    await this.ctx.resume();
    this._stopBinaural();
    if (!baseHz || !beatHz) { this.state.beat = 0; return; }
    const merger = this.ctx.createChannelMerger(2);
    const left = this.ctx.createOscillator();
    const right = this.ctx.createOscillator();
    left.frequency.value = baseHz;
    right.frequency.value = baseHz + beatHz;
    const gL = this.ctx.createGain(); gL.gain.value = 0.35;
    const gR = this.ctx.createGain(); gR.gain.value = 0.35;
    left.connect(gL).connect(merger, 0, 0);
    right.connect(gR).connect(merger, 0, 1);
    merger.connect(this.master);
    left.start(); right.start();
    this.binauralLeft = left;
    this.binauralRight = right;
    this.merger = merger;
    this.state.beat = beatHz;
  }

  setGain(v) {
    this.state.gain = v;
    if (this.master) this.master.gain.value = v;
  }

  stop() {
    this._stopTone();
    this._stopBinaural();
    this.state.freq = 0;
    this.state.beat = 0;
  }

  _stopTone() {
    if (!this.tone) return;
    try {
      this.tone.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
      this.tone.osc.stop(this.ctx.currentTime + 0.25);
    } catch {}
    this.tone = null;
  }

  _stopBinaural() {
    if (!this.binauralLeft) return;
    try {
      this.binauralLeft.stop();
      this.binauralRight.stop();
    } catch {}
    this.binauralLeft = null;
    this.binauralRight = null;
    this.merger = null;
  }
}
