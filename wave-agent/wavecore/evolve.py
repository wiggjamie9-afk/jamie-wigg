"""Evolving frequencies in an environment — a tiny artificial-life loop.

Each "organism" carries one gene: a frequency. The environment is a medium
that resonates best at some target frequency, so an organism's fitness is how
strongly it couples to that resonance. Selection + mutation, looped over
generations, makes the population *evolve toward* the environment's resonance.

Give the environment a `drift` and the target keeps moving — now the population
has to keep adapting to a "new environment" every generation. This is honest
artificial life (a genetic algorithm), not literal biology: nothing here is
alive, but it does adapt, inherit, and converge the way evolution does.
"""
from __future__ import annotations

import numpy as np


class Environment:
    """A medium with a (possibly drifting) resonant frequency."""

    def __init__(self, resonance=440.0, bandwidth=40.0, drift=0.0):
        self.resonance = float(resonance)
        self.bandwidth = float(bandwidth)
        self.drift = float(drift)

    def fitness(self, freq):
        """Gaussian coupling: 1.0 at resonance, falling off either side."""
        return float(np.exp(-((freq - self.resonance) ** 2) / (2 * self.bandwidth ** 2)))

    def step(self):
        self.resonance += self.drift


def digital_root(n):
    """Repeatedly sum digits until one remains (base-10). dr(multiple of 9) == 9."""
    n = abs(int(n))
    while n >= 10:
        n = sum(int(d) for d in str(n))
    return n


class Tesla369Environment(Environment):
    """An environment whose resonance loops through 3-6-9 derived frequencies.

    The target steps 369 -> 639 -> 963 Hz and wraps around, holding each for
    `hold` generations. This is a playful nod to the apocryphal Tesla "3-6-9"
    idea, NOT a physical claim — it just literally puts 369 on a loop and makes
    the population keep adapting to it. The three targets all have digital root
    9 (3+6+9 = 18 -> 9), which is the one real bit of math in the legend.
    """

    _LOOP = (369.0, 639.0, 963.0)

    def __init__(self, bandwidth=45.0, hold=8):
        super().__init__(resonance=self._LOOP[0], bandwidth=bandwidth, drift=0.0)
        self.hold = max(1, int(hold))
        self._tick = 0

    def step(self):
        self._tick += 1
        self.resonance = self._LOOP[(self._tick // self.hold) % len(self._LOOP)]


class Organism:
    __slots__ = ("freq", "fitness")

    def __init__(self, freq):
        self.freq = float(freq)
        self.fitness = 0.0

    def child(self, rng, mutation):
        return Organism(self.freq + rng.normal(0.0, mutation))


def evolve(env, generations=60, pop_size=40, mutation=8.0,
           init_low=100.0, init_high=900.0, seed=0, on_generation=None):
    """Run the loop. Returns a per-generation history of the best/mean state."""
    rng = np.random.default_rng(seed)
    pop = [Organism(rng.uniform(init_low, init_high)) for _ in range(pop_size)]
    history = []

    for g in range(generations):
        for o in pop:
            o.fitness = env.fitness(o.freq)
        pop.sort(key=lambda o: o.fitness, reverse=True)

        record = {
            "gen": g,
            "resonance": env.resonance,
            "best_freq": pop[0].freq,
            "best_fit": pop[0].fitness,
            "mean_freq": float(np.mean([o.freq for o in pop])),
        }
        history.append(record)
        if on_generation:
            on_generation(record)

        # Selection: top half survive and breed the next generation.
        survivors = pop[: pop_size // 2]
        children = []
        while len(survivors) + len(children) < pop_size:
            parent = survivors[rng.integers(len(survivors))]
            children.append(parent.child(rng, mutation))
        pop = survivors + children

        env.step()  # the world moves on; the population must keep up

    return history
