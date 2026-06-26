"""Wave primitives — the shared physics layer.

Everything else in the ecosystem (modem, reservoir, logic, evolution) is built
on top of these few functions. A "signal" is just a 1-D numpy array of samples;
a "spectrum" is its frequency content via the FFT. Nothing here is mystical —
it's ordinary digital signal processing.
"""
from __future__ import annotations

import numpy as np

# Default sample rate (Hz). 8 kHz is plenty for the audible tones we use.
DEFAULT_SR = 8000


def tone(freq, duration, sample_rate=DEFAULT_SR, amplitude=1.0, phase=0.0):
    """A pure sine wave at `freq` Hz lasting `duration` seconds."""
    n = int(round(duration * sample_rate))
    t = np.arange(n) / sample_rate
    return amplitude * np.sin(2.0 * np.pi * freq * t + phase)


def mix(*signals):
    """Superpose signals (zero-padded to the longest). This is interference."""
    if not signals:
        return np.zeros(0)
    n = max(len(s) for s in signals)
    out = np.zeros(n)
    for s in signals:
        out[: len(s)] += s
    return out


def spectrum(signal, sample_rate=DEFAULT_SR):
    """Return (freqs, magnitudes) — the signal's frequency fingerprint."""
    mags = np.abs(np.fft.rfft(signal))
    freqs = np.fft.rfftfreq(len(signal), d=1.0 / sample_rate)
    return freqs, mags


def dominant_freq(signal, sample_rate=DEFAULT_SR):
    """The single loudest frequency present in the signal."""
    freqs, mags = spectrum(signal, sample_rate)
    return float(freqs[int(np.argmax(mags))])


def goertzel_amplitude(signal, freq, sample_rate=DEFAULT_SR):
    """Amplitude of `signal` at exactly `freq`, via quadrature correlation.

    More precise than reading an FFT bin when `freq` falls between bins.
    A pure tone of amplitude A at `freq` returns ~A.
    """
    n = len(signal)
    if n == 0:
        return 0.0
    t = np.arange(n) / sample_rate
    s = np.sin(2.0 * np.pi * freq * t)
    c = np.cos(2.0 * np.pi * freq * t)
    re = 2.0 * np.dot(signal, s) / n
    im = 2.0 * np.dot(signal, c) / n
    return float(np.hypot(re, im))
