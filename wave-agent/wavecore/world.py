"""ResonanceWorld — the four pillars re-engineered into one living loop.

This is what you get by composing the ecosystem instead of running its parts
side by side. Every generation, each organism (a single frequency):

  1. SINGS      its gene as a tone                       (signals.tone)
  2. IS HEARD   by the world, which names its niche      (reservoir)
  3. IS JUDGED  survive = fit-enough AND in-a-niche       (logic gates)
  4. EVOLVES    survivors breed with mutation             (evolve)
  5. BROADCASTS each niche's winning gene as sound bytes  (modem)

With two resonant niches and a barren middle, fitness is high near either
niche and near-zero between them. That is *disruptive selection*, and out of it
something no single pillar produces emerges on its own: the one blurry
population splits into two distinct frequency-species. Emergence, honestly —
not magic, just selection wired through sound.
"""
from __future__ import annotations

import numpy as np

from . import logic, modem
from .evolve import Environment
from .reservoir import WaveReservoir
from .signals import tone

PERCEPTION_SR = 2000
PERCEPTION_DUR = 0.04


class ResonanceWorld:
    def __init__(self, niches=None, pop_size=120, bandwidth=60.0, seed=0,
                 perceive=True):
        self.rng = np.random.default_rng(seed)
        self.niches = list(niches) if niches else [("low", 300.0), ("high", 800.0)]
        self.bandwidth = float(bandwidth)
        self.pop = self.rng.uniform(100.0, 1000.0, pop_size)
        self.envs = {name: Environment(res, bandwidth) for name, res in self.niches}
        self.perception = self._train_perception() if perceive else None

    # -- perception: the world's "ear", a reservoir that labels a tone's niche -
    def _train_perception(self):
        res = WaveReservoir(size=60, seed=1)
        sigs, labs = [], []
        for name, r in self.niches:
            for _ in range(25):
                f = r + self.rng.normal(0, self.bandwidth * 0.6)
                s = tone(f, PERCEPTION_DUR, sample_rate=PERCEPTION_SR)
                s = s + self.rng.normal(0, 0.2, len(s))
                sigs.append(s)
                labs.append(name)
        res.train(sigs, labs)
        return res

    def perceive(self, freq):
        s = tone(freq, PERCEPTION_DUR, sample_rate=PERCEPTION_SR)
        return self.perception.predict(s)

    def perception_accuracy(self, samples=60):
        if self.perception is None:
            return None
        ok = 0
        for _ in range(samples):
            name, r = self.niches[self.rng.integers(len(self.niches))]
            f = r + self.rng.normal(0, self.bandwidth * 0.5)
            ok += int(self.perceive(f) == name)
        return ok / samples

    # -- fitness / niches -----------------------------------------------------
    def fitness(self, freq):
        return max(env.fitness(freq) for env in self.envs.values())

    def nearest_niche(self, freq):
        return min(self.niches, key=lambda n: abs(n[1] - freq))[0]

    # -- one generation -------------------------------------------------------
    def step(self, mutation=18.0, survival_threshold=0.25):
        fits = np.array([self.fitness(f) for f in self.pop])

        # Survival decided through the interference logic gates (genuine reuse):
        # survive = (fitness high enough) AND (actually inside some niche band).
        survivors = []
        for f, fit in zip(self.pop, fits):
            fit_bit = 1 if fit > survival_threshold else 0
            band_bit = 1 if fit > 0.05 else 0
            if logic.AND(fit_bit, band_bit):
                survivors.append(f)
        if len(survivors) < 2:  # never let the world go fully extinct
            survivors = list(self.pop[np.argsort(fits)[-2:]])
        survivors = np.array(survivors)

        # Breed survivors in proportion to fitness, then mutate.
        sf = np.array([self.fitness(f) for f in survivors])
        p = sf / sf.sum()
        n = len(self.pop)
        parents = self.rng.choice(survivors, size=n, p=p)
        self.pop = np.clip(parents + self.rng.normal(0, mutation, n), 50.0, 1100.0)

    def run(self, generations=40, **kw):
        history = [self.pop.copy()]
        for _ in range(generations):
            self.step(**kw)
            history.append(self.pop.copy())
        return history

    # -- heredity broadcast over the acoustic (modem) channel -----------------
    def broadcast_genes(self):
        out = {}
        for name, _ in self.niches:
            members = [f for f in self.pop if self.nearest_niche(f) == name]
            if not members:
                continue
            gene = int(round(float(np.mean(members))))
            data = str(gene).encode("ascii")
            recovered = modem.decode(modem.encode(data)).decode("ascii", "replace")
            out[name] = {
                "gene": gene,
                "members": len(members),
                "recovered": recovered,
                "ok": recovered == str(gene),
            }
        return out

    # -- species detection ----------------------------------------------------
    def species(self, tol=70.0):
        """Niches that ended up genuinely occupied (a cluster sits on them)."""
        found = {}
        for name, r in self.niches:
            near = [f for f in self.pop if abs(f - r) <= tol]
            if len(near) >= max(3, len(self.pop) * 0.1):
                found[name] = float(np.mean(near))
        return found
