"""Modem — encode arbitrary bytes as sound and decode them back.

This is the "data as frequency" angle. We use BFSK (Binary Frequency-Shift
Keying): bit 0 becomes a tone at F0, bit 1 a tone at F1. Concatenate the tones
and you have a literal audio signal that *is* your data. This is exactly how
dial-up modems put bytes onto a phone line.
"""
from __future__ import annotations

import numpy as np

from .signals import DEFAULT_SR, goertzel_amplitude, tone

F0 = 1200.0       # frequency for a 0 bit (Hz)
F1 = 2200.0       # frequency for a 1 bit (Hz)
SYMBOL_DUR = 0.02  # seconds per bit


def _bits_of(data: bytes):
    for byte in data:
        for i in range(7, -1, -1):
            yield (byte >> i) & 1


def encode(data: bytes, sample_rate=DEFAULT_SR, symbol_dur=SYMBOL_DUR) -> np.ndarray:
    """Turn bytes into an audio signal (numpy array of samples)."""
    parts = [tone(F1 if bit else F0, symbol_dur, sample_rate) for bit in _bits_of(data)]
    return np.concatenate(parts) if parts else np.zeros(0)


def decode(signal: np.ndarray, sample_rate=DEFAULT_SR, symbol_dur=SYMBOL_DUR) -> bytes:
    """Recover bytes from an audio signal produced by `encode`."""
    n = int(round(symbol_dur * sample_rate))
    if n == 0:
        return b""
    nbits = len(signal) // n
    bits = []
    for i in range(nbits):
        chunk = signal[i * n : (i + 1) * n]
        e0 = goertzel_amplitude(chunk, F0, sample_rate)
        e1 = goertzel_amplitude(chunk, F1, sample_rate)
        bits.append(1 if e1 >= e0 else 0)

    out = bytearray()
    for i in range(0, len(bits) - 7, 8):
        byte = 0
        for b in bits[i : i + 8]:
            byte = (byte << 1) | b
        out.append(byte)
    return bytes(out)
