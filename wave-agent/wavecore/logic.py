"""Acoustic logic gates — compute booleans with interference.

A bit is a tone that is either present (1) or absent (0) at frequency F.
- Add two in-phase tones and they reinforce (constructive interference):
  amplitude 0, 1, or 2 lets us read OR and AND off a threshold.
- Add an inverted (phase-flipped) tone against a reference and it cancels
  (destructive interference): that gives us NOT.
From AND / OR / NOT every other gate follows. This mirrors real "phononic"
logic-gate research, where sound waves themselves carry out boolean logic.
"""
from __future__ import annotations

from .signals import DEFAULT_SR, goertzel_amplitude, tone

F = 1000.0    # the carrier frequency a "present" bit lives at
DUR = 0.01    # tone length (s)


def _bit(value, phase=0.0):
    return tone(F, DUR, amplitude=float(value), phase=phase)


def _amp(signal):
    return goertzel_amplitude(signal, F)


def AND(a, b):
    combined = _bit(a) + _bit(b)              # peaks at amplitude 2 when both on
    return 1 if _amp(combined) > 1.5 else 0


def OR(a, b):
    combined = _bit(a) + _bit(b)              # amplitude >= 1 if either is on
    return 1 if _amp(combined) > 0.5 else 0


def NOT(a):
    import numpy as np
    combined = _bit(1) + _bit(a, phase=np.pi)  # reference cancels when a is on
    return 1 if _amp(combined) > 0.5 else 0


def XOR(a, b):
    return AND(OR(a, b), NOT(AND(a, b)))


def truth_table(gate):
    """Return the gate's outputs over all 1- or 2-bit inputs."""
    import inspect

    arity = len(inspect.signature(gate).parameters)
    rows = []
    if arity == 1:
        for a in (0, 1):
            rows.append(((a,), gate(a)))
    else:
        for a in (0, 1):
            for b in (0, 1):
                rows.append(((a, b), gate(a, b)))
    return rows
