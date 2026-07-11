#!/usr/bin/env python3
"""Generate a gentle, real lullaby melody as a WAV — actual notes in sequence,
music-box / celesta style, so it sounds like music (not a sustained sine drone).

Stdlib only (wave + math). Used by pipeline.generate_music.
"""
import math
import struct
import wave

SR = 44100

# Note frequencies (equal temperament, A4 = 440)
_N = {
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23,
    "G4": 392.00, "A4": 440.00, "B4": 493.88, "C5": 523.25,
    "REST": 0.0,
}

# "Twinkle, Twinkle, Little Star" — universally recognised, calming lullaby.
# Each entry is (note, beats). A soft, slow tempo keeps it sleepy.
_MELODY = [
    ("C4", 1), ("C4", 1), ("G4", 1), ("G4", 1), ("A4", 1), ("A4", 1), ("G4", 2),
    ("F4", 1), ("F4", 1), ("E4", 1), ("E4", 1), ("D4", 1), ("D4", 1), ("C4", 2),
    ("G4", 1), ("G4", 1), ("F4", 1), ("F4", 1), ("E4", 1), ("E4", 1), ("D4", 2),
    ("G4", 1), ("G4", 1), ("F4", 1), ("F4", 1), ("E4", 1), ("E4", 1), ("D4", 2),
    ("C4", 1), ("C4", 1), ("G4", 1), ("G4", 1), ("A4", 1), ("A4", 1), ("G4", 2),
    ("F4", 1), ("F4", 1), ("E4", 1), ("E4", 1), ("D4", 1), ("D4", 1), ("C4", 2),
    ("REST", 2),
]

BEAT = 0.62          # seconds per beat (slow, sleepy)
PEAK = 0.32          # overall peak amplitude (0..1) — gentle


def _note_samples(freq: float, dur: float) -> list:
    """One note: fundamental + soft harmonics with a bell/music-box envelope."""
    n = int(dur * SR)
    out = [0.0] * n
    if freq <= 0.0:                      # rest
        return out
    two_pi_f = 2.0 * math.pi * freq
    # music-box timbre: fundamental + quiet 2nd & 3rd harmonic
    harmonics = ((1.0, 1.0), (2.0, 0.28), (3.0, 0.12))
    attack = int(0.012 * SR)             # 12 ms soft attack (no click)
    for i in range(n):
        t = i / SR
        # exponential decay so each note rings then fades like a music box
        env = math.exp(-3.2 * t / dur)
        if i < attack:
            env *= i / attack
        s = 0.0
        for mult, amp in harmonics:
            s += amp * math.sin(two_pi_f * mult * t)
        out[i] = s * env
    return out


def _build_melody() -> list:
    buf = []
    for note, beats in _MELODY:
        buf.extend(_note_samples(_N[note], beats * BEAT))
    return buf


def generate_lullaby_wav(path, duration_secs: float) -> None:
    """Write a stereo 44.1kHz WAV of the lullaby, looped to fill duration."""
    one = _build_melody()
    total = int(duration_secs * SR)
    # normalise the single loop to PEAK, then tile
    m = max(1e-6, max(abs(x) for x in one))
    scale = PEAK / m
    frames = bytearray()
    j = 0
    fade = int(2.0 * SR)                 # 2s in/out fade over whole track
    for i in range(total):
        v = one[j] * scale
        j += 1
        if j >= len(one):
            j = 0
        if i < fade:
            v *= i / fade
        elif i > total - fade:
            v *= max(0.0, (total - i) / fade)
        s = max(-1.0, min(1.0, v))
        iv = int(s * 30000)
        frames += struct.pack("<hh", iv, iv)   # stereo (L=R)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(frames))


if __name__ == "__main__":
    import sys
    generate_lullaby_wav(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 30)
    print("wrote", sys.argv[1])
