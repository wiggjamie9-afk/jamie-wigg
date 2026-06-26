"""Tests for the wave-agent ecosystem. Run with: pytest  (or python -m pytest)."""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from wavecore import logic, modem, reservoir  # noqa: E402
from wavecore import evolve as ev  # noqa: E402
from wavecore.signals import dominant_freq, tone  # noqa: E402


def test_tone_has_expected_frequency():
    s = tone(440.0, 0.25)
    assert abs(dominant_freq(s) - 440.0) < 5.0


def test_modem_round_trip():
    for msg in (b"HELLO", b"wave agent online", b"\x00\xff\x10\x7f"):
        assert modem.decode(modem.encode(msg)) == msg


def test_logic_truth_tables():
    assert (logic.AND(0, 0), logic.AND(0, 1), logic.AND(1, 0), logic.AND(1, 1)) == (0, 0, 0, 1)
    assert (logic.OR(0, 0), logic.OR(0, 1), logic.OR(1, 0), logic.OR(1, 1)) == (0, 1, 1, 1)
    assert (logic.XOR(0, 0), logic.XOR(0, 1), logic.XOR(1, 0), logic.XOR(1, 1)) == (0, 1, 1, 0)
    assert (logic.NOT(0), logic.NOT(1)) == (1, 0)


def test_reservoir_classifies_tones():
    rng = np.random.default_rng(0)

    def make(base, n):
        sigs = []
        for _ in range(n):
            f = base + rng.normal(0, 25)
            sigs.append(tone(f, 0.05, sample_rate=2000) + rng.normal(0, 0.3, 100))
        return sigs

    sig = make(250, 30) + make(700, 30)
    lab = ["low"] * 30 + ["high"] * 30
    res = reservoir.WaveReservoir(size=80, seed=0)
    res.train(sig, lab)

    test = make(250, 15) + make(700, 15)
    tlab = ["low"] * 15 + ["high"] * 15
    acc = sum(res.predict(s) == y for s, y in zip(test, tlab)) / len(tlab)
    assert acc > 0.8


def test_evolution_converges_to_static_environment():
    env = ev.Environment(resonance=440.0, bandwidth=40.0, drift=0.0)
    hist = ev.evolve(env, generations=60, pop_size=40, seed=0)
    assert hist[-1]["best_fit"] > hist[0]["best_fit"]
    assert hist[-1]["best_fit"] > 0.95
    assert abs(hist[-1]["best_freq"] - 440.0) < 15.0


def test_evolution_tracks_a_drifting_environment():
    env = ev.Environment(resonance=440.0, bandwidth=40.0, drift=3.0)
    hist = ev.evolve(env, generations=80, pop_size=50, seed=1)
    # population should stay coupled to the moving target, not fall far behind
    assert hist[-1]["best_fit"] > 0.6


def test_digital_root_369_pattern():
    # The one real fact in the 3-6-9 legend: these all reduce to 9.
    assert ev.digital_root(369) == 9
    assert ev.digital_root(639) == 9
    assert ev.digital_root(963) == 9
    # ...and the doubling sequence never lands on 3, 6, or 9.
    seq = {ev.digital_root(2 ** k) for k in range(1, 12)}
    assert seq.isdisjoint({3, 6, 9})


def test_tesla369_environment_loops():
    env = ev.Tesla369Environment(hold=2)
    seen = [env.resonance]
    for _ in range(6):
        env.step()
        seen.append(env.resonance)
    # resonance only ever takes the three 3-6-9 values, and it cycles
    assert set(seen) <= {369.0, 639.0, 963.0}
    assert len(set(seen)) == 3
