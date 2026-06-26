"""Tracker — point a brain at a REAL signal and have it follow the pitch.

This is where the evolved brain stops chasing a synthetic sine and does a real
job: it tracks the instantaneous pitch of actual audio. Functionally it's a
learned phase-locked loop — the same idea behind auto-tune, radio carrier
recovery, and active noise cancellation.

Pipeline:
  audio (WAV or synthesized) -> instantaneous pitch (short-time FFT)
  -> evolve a brain to follow that pitch contour -> render the follow to audio.

Uses only numpy + the stdlib `wave` module, so it runs anywhere.
"""
from __future__ import annotations

import wave

import numpy as np

from .brain import Brain, live


# --------------------------------------------------------------------------- #
# Audio I/O (stdlib wave; 16-bit mono)
# --------------------------------------------------------------------------- #
def load_wav(path):
    with wave.open(path, "rb") as w:
        sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
        raw = w.readframes(n)
    data = np.frombuffer(raw, dtype=np.int16).astype(float)
    if ch > 1:
        data = data.reshape(-1, ch).mean(axis=1)
    return data / 32768.0, sr


def write_wav(path, signal, sr):
    pcm = (np.clip(signal, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


# --------------------------------------------------------------------------- #
# Pitch estimation + a realistic stand-in signal
# --------------------------------------------------------------------------- #
def synth_signal(sr=8000, note_dur=0.25, seed=0):
    """A 'real-ish' audio clip: a sung melody with vibrato and hiss."""
    rng = np.random.default_rng(seed)
    notes = [262, 330, 392, 440, 392, 330, 294, 262]   # C E G A G E D C
    t = np.arange(int(sr * note_dur)) / sr
    parts = []
    for f in notes:
        vib = f * (1 + 0.012 * np.sin(2 * np.pi * 5 * t))   # 5 Hz vibrato
        parts.append(np.sin(2 * np.pi * np.cumsum(vib) / sr))
    sig = np.concatenate(parts)
    sig += 0.04 * rng.standard_normal(len(sig))            # hiss
    return sig, sr


def instantaneous_pitch(signal, sr, frame=1024, hop=256, fmin=80.0, fmax=1200.0):
    """Dominant frequency per short frame, with parabolic bin interpolation."""
    win = np.hanning(frame)
    freqs = np.fft.rfftfreq(frame, 1.0 / sr)
    band = (freqs >= fmin) & (freqs <= fmax)
    bin_hz = freqs[1] - freqs[0]
    out = []
    for start in range(0, len(signal) - frame, hop):
        spec = np.abs(np.fft.rfft(signal[start:start + frame] * win)) * band
        idx = int(np.argmax(spec))
        shift = 0.0
        if 1 <= idx < len(spec) - 1:
            a, b, c = spec[idx - 1], spec[idx], spec[idx + 1]
            denom = a - 2 * b + c
            if denom != 0:
                shift = 0.5 * (a - c) / denom
        out.append(float(freqs[idx] + shift * bin_hz))
    return np.array(out)


# --------------------------------------------------------------------------- #
# Fit a brain to follow a real pitch contour
# --------------------------------------------------------------------------- #
def follow(brain, pitch, start=None):
    start = float(pitch[0]) if start is None else start
    return live(brain, pitch, start, steps=len(pitch))


def fit_brain_to(pitch, generations=40, pop=30, seed=0, on_generation=None):
    """Evolve a brain whose continuous loop tracks this real pitch contour."""
    rng = np.random.default_rng(seed)
    start = float(pitch[0])
    brains = [Brain(rng.uniform(0.05, 1.4), rng.uniform(-0.5, 0.8)) for _ in range(pop)]

    def err_of(b):
        _, errs = live(b, pitch, start, steps=len(pitch))
        return float(np.mean(errs[3:]))   # ignore the first few onset frames

    best, history = None, []
    for g in range(generations):
        brains.sort(key=err_of)
        best = brains[0]
        e = err_of(best)
        history.append(e)
        if on_generation:
            on_generation(g, e)
        survivors = brains[: pop // 2]
        while len(survivors) < pop:
            survivors.append(brains[rng.integers(pop // 2)].mutate(rng))
        brains = survivors
    return best, history


def render_pitch(pitch, sr, hop=256, amplitude=0.6):
    """Synthesize an audible tone whose frequency follows a pitch contour."""
    per_sample = np.repeat(pitch, hop)
    phase = 2 * np.pi * np.cumsum(per_sample) / sr
    return amplitude * np.sin(phase)
