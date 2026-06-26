"""Tests for the wave-agent ecosystem. Run with: pytest  (or python -m pytest)."""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from wavecore import logic, modem, reservoir  # noqa: E402
from wavecore import evolve as ev  # noqa: E402
from wavecore.signals import dominant_freq, tone  # noqa: E402
from wavecore.world import ResonanceWorld  # noqa: E402


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


def test_world_speciates_and_broadcasts():
    world = ResonanceWorld(pop_size=120, seed=0)
    assert world.perception_accuracy() > 0.8        # the reservoir-ear works
    world.run(generations=40)

    species = world.species()
    assert len(species) >= 2                          # one blob split in two
    assert abs(species["low"] - 300.0) < 70
    assert abs(species["high"] - 800.0) < 70

    middle = np.sum((world.pop > 450) & (world.pop < 650))
    assert middle <= len(world.pop) * 0.1             # barren middle evacuated

    broadcasts = world.broadcast_genes()
    assert all(info["ok"] for info in broadcasts.values())  # heredity survives the modem


def test_autonomous_world_self_stabilises_and_persists(tmp_path):
    from wavecore.autonomous import AutonomousWorld

    path = str(tmp_path / "genome.json")
    a = AutonomousWorld(seed=0, max_ticks=200, stable_target=10, state_path=path)
    a.run()
    assert a.tick <= 200
    assert len(a.world.species()) >= 2
    assert os.path.exists(path)

    # a fresh agent can resume the saved genome
    b = AutonomousWorld(seed=0, state_path=path)
    assert b.load() is True
    assert b.tick == a.tick
    assert len(b.world.pop) == len(a.world.pop)


def test_overseer_searches_and_scores():
    from wavecore.overseer import Overseer

    o = Overseer(goal_species=3, budget=8, seed=1)
    best, history = o.run()
    assert len(history) >= 1
    assert best["species"] >= 2          # found a genuinely speciated config
    assert best in [h for h in history] or best["trial"] >= 1


def test_brain_evolves_to_perfection_and_regenerates():
    from wavecore import brain as bm

    best, history, reached = bm.evolve_brains(center=440.0, generations=80, pop=40, seed=0)
    assert reached is True                              # it actually reaches perfection
    assert history[0]["track"] > history[-1]["track"]  # and improved to get there
    assert bm.is_perfect(best)

    # regeneration: knock it off the moving target; it returns close.
    target = bm.setpoint(440.0, bm._STEPS)
    _, errs = bm.live(best, target, start=440.0, steps=bm._STEPS, perturbations={55: 300.0})
    baseline = float(np.mean(errs[40:55]))
    assert max(errs[55:62]) > baseline + 25   # the knock really displaced it
    assert errs[-1] < 10                       # ...and it regenerated back onto the target


def test_tesla369_environment_loops():
    env = ev.Tesla369Environment(hold=2)
    seen = [env.resonance]
    for _ in range(6):
        env.step()
        seen.append(env.resonance)
    # resonance only ever takes the three 3-6-9 values, and it cycles
    assert set(seen) <= {369.0, 639.0, 963.0}
    assert len(set(seen)) == 3
