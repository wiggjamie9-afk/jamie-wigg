// Coherence Engine — camera-PPG HRV + coherence score.
// Pipeline (per design.md §"The Coherence Engine — algorithm"):
//   1. getUserMedia rear camera (+ torch where supported)
//   2. RAF: sample mean red channel of an 80x80 center patch
//   3. Detrend (subtract 2s moving average)
//   4. Bandpass 0.7–3.5 Hz (40–210 BPM) via two-pass IIR
//   5. Peak detect: adaptive threshold + 300ms refractory
//   6. RR series (last 30 inter-peak intervals)
//   7. RMSSD on RR series
//   8. Goertzel filter at breath cadence (default 0.1 Hz) on HR signal → coherence 0..100
//   9. Emit beat / metrics events for UI

const PATCH = 80;
const SAMPLE_BUFFER_SEC = 10;
const DETREND_WINDOW_SEC = 2;
const REFRACTORY_MS = 300;
const RR_WINDOW = 30;

export class CoherenceEngine {
  constructor({ breathHz = 0.1 } = {}) {
    this.breathHz = breathHz;
    this.video = document.createElement('video');
    this.video.playsInline = true;
    this.video.muted = true;
    this.canvas = document.createElement('canvas');
    this.canvas.width = PATCH;
    this.canvas.height = PATCH;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.stream = null;
    this.running = false;
    this._frame = null;
    this.samples = []; // [{t, r}]
    this.rr = [];      // ms intervals
    this.lastPeakAt = 0;
    this.metrics = { bpm: 0, rmssd: 0, coherence: 0 };
    this._listeners = { beat: new Set(), metrics: new Set(), status: new Set() };
  }

  on(event, fn) {
    if (!this._listeners[event]) return () => {};
    this._listeners[event].add(fn);
    return () => this._listeners[event].delete(fn);
  }
  _emit(event, payload) { this._listeners[event]?.forEach(fn => fn(payload)); }

  async start() {
    if (this.running) return;
    this._emit('status', { state: 'starting', message: 'Requesting camera…' });
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: 320, height: 240 },
        audio: false,
      });
    } catch (err) {
      this._emit('status', { state: 'error', message: 'Camera access denied.' });
      throw err;
    }
    this.video.srcObject = this.stream;
    await this.video.play();

    // Try to enable torch — best effort.
    const track = this.stream.getVideoTracks()[0];
    try {
      const caps = track.getCapabilities?.();
      if (caps?.torch) await track.applyConstraints({ advanced: [{ torch: true }] });
    } catch {}

    this.running = true;
    this.startedAt = performance.now();
    this._emit('status', { state: 'capturing', message: 'Place finger on rear camera + flash.' });
    this._loop();
  }

  stop() {
    this.running = false;
    if (this._frame) cancelAnimationFrame(this._frame);
    this._frame = null;
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    this.samples = [];
    this.rr = [];
    this.lastPeakAt = 0;
    this.metrics = { bpm: 0, rmssd: 0, coherence: 0 };
    this._emit('status', { state: 'stopped', message: '' });
  }

  _loop = () => {
    if (!this.running) return;
    try {
      const { videoWidth: vw, videoHeight: vh } = this.video;
      if (vw && vh) {
        const sx = Math.floor((vw - PATCH) / 2);
        const sy = Math.floor((vh - PATCH) / 2);
        this.ctx.drawImage(this.video, sx, sy, PATCH, PATCH, 0, 0, PATCH, PATCH);
        const data = this.ctx.getImageData(0, 0, PATCH, PATCH).data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) sum += data[i]; // red channel
        const mean = sum / (data.length / 4);
        const t = performance.now();
        this.samples.push({ t, r: mean });

        const cutoff = t - SAMPLE_BUFFER_SEC * 1000;
        while (this.samples.length && this.samples[0].t < cutoff) this.samples.shift();

        if (this.samples.length > 60) this._process(t);
      }
    } catch {}
    this._frame = requestAnimationFrame(this._loop);
  };

  _process(now) {
    // Detrend: subtract 2s moving average from each sample.
    const win = DETREND_WINDOW_SEC * 1000;
    const detrended = this.samples.map((s, i, arr) => {
      let sum = 0, n = 0;
      for (let j = i; j >= 0 && (s.t - arr[j].t) <= win; j--) { sum += arr[j].r; n++; }
      return { t: s.t, v: s.r - sum / n };
    });

    // Two-pass IIR bandpass: high-pass then low-pass.
    // Coarse coefficients tuned for ~30 Hz sampling, 0.7–3.5 Hz pass band.
    const hp = this._iir(detrended.map(d => d.v), 0.96);   // remove low-freq drift residual
    const lp = this._iirLP(hp, 0.45);                       // attenuate above ~3.5 Hz
    const ts = detrended.map(d => d.t);

    // Peak detect with adaptive threshold = median + 1.5*MAD.
    const sorted = [...lp].sort((a, b) => a - b);
    const med = sorted[Math.floor(sorted.length / 2)];
    const mad = sorted.map(v => Math.abs(v - med)).sort((a, b) => a - b)[Math.floor(sorted.length / 2)];
    const thresh = med + 1.5 * (mad || 1);

    const peaks = [];
    for (let i = 1; i < lp.length - 1; i++) {
      if (lp[i] > thresh && lp[i] > lp[i - 1] && lp[i] >= lp[i + 1]) {
        if (peaks.length === 0 || ts[i] - peaks[peaks.length - 1] > REFRACTORY_MS) {
          peaks.push(ts[i]);
        }
      }
    }

    // Update rolling RR.
    if (peaks.length >= 2) {
      const newRR = [];
      for (let i = 1; i < peaks.length; i++) newRR.push(peaks[i] - peaks[i - 1]);
      this.rr = newRR.slice(-RR_WINDOW);

      const latestPeak = peaks[peaks.length - 1];
      if (latestPeak > this.lastPeakAt) {
        this.lastPeakAt = latestPeak;
        this._emit('beat', { t: latestPeak });
      }
    }

    // Metrics.
    if (this.rr.length >= 4) {
      const meanRR = this.rr.reduce((a, b) => a + b, 0) / this.rr.length;
      const bpm = Math.round(60000 / meanRR);
      let sqDiff = 0;
      for (let i = 1; i < this.rr.length; i++) {
        const d = this.rr[i] - this.rr[i - 1];
        sqDiff += d * d;
      }
      const rmssd = Math.sqrt(sqDiff / (this.rr.length - 1));
      const coherence = this._coherence();
      this.metrics = { bpm, rmssd: Math.round(rmssd), coherence };
      this._emit('metrics', this.metrics);
    }
  }

  // One-pole high-pass: y[n] = a*(y[n-1] + x[n] - x[n-1]).
  _iir(x, a) {
    const y = new Array(x.length).fill(0);
    for (let i = 1; i < x.length; i++) y[i] = a * (y[i - 1] + x[i] - x[i - 1]);
    return y;
  }
  // One-pole low-pass: y[n] = (1-a)*x[n] + a*y[n-1].
  _iirLP(x, a) {
    const y = new Array(x.length).fill(0);
    for (let i = 1; i < x.length; i++) y[i] = (1 - a) * x[i] + a * y[i - 1];
    return y;
  }

  // Goertzel-style coherence at breath frequency.
  // Approximates "magnitude at f_breath / total power in 0.04–0.4 Hz band" → 0..100.
  _coherence() {
    if (this.rr.length < 8) return 0;
    // Build instantaneous HR samples (one per RR), then evaluate single-bin DFT at breathHz.
    // Sampling interval is meanRR seconds.
    const meanRR = this.rr.reduce((a, b) => a + b, 0) / this.rr.length / 1000;
    const fs = 1 / meanRR;
    const hr = this.rr.map(r => 60000 / r);
    const mean = hr.reduce((a, b) => a + b, 0) / hr.length;
    const centered = hr.map(v => v - mean);

    const goertzel = (f) => {
      const omega = 2 * Math.PI * f / fs;
      const cosw = Math.cos(omega), coeff = 2 * cosw;
      let s0 = 0, s1 = 0, s2 = 0;
      for (const x of centered) { s0 = x + coeff * s1 - s2; s2 = s1; s1 = s0; }
      return s1 * s1 + s2 * s2 - coeff * s1 * s2;
    };

    const peakPower = goertzel(this.breathHz);
    // Approximate total LF/HF band power as average across a few bins.
    const bins = [0.04, 0.08, 0.12, 0.16, 0.2, 0.25, 0.3, 0.35, 0.4];
    const totalPower = bins.reduce((a, f) => a + goertzel(f), 0) / bins.length;
    const ratio = peakPower / (totalPower + 1e-6);
    // Squash to 0..100 with a soft cap.
    return Math.round(Math.max(0, Math.min(100, ratio * 12)));
  }
}
