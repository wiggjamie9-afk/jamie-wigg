"""Overseer — an autonomous agent that runs experiments on the world.

This is the second layer: a goal-driven loop that sits *above* the self-driving
world. You give it a goal ("produce K stable species"); it autonomously tries
configurations, runs a full AutonomousWorld trial for each, reads the outcome,
keeps the best, and stops early once it hits the goal — all within a fixed
trial budget.

It is a real autonomous agent (perceive results -> decide next config -> act ->
repeat with a stop condition), deliberately bounded: it only ever spins up
sandboxed worlds and never exceeds `budget` trials.
"""
from __future__ import annotations

import numpy as np

from .autonomous import AutonomousWorld
from .world import ResonanceWorld


class Overseer:
    def __init__(self, goal_species=3, budget=8, seed=0):
        self.goal = int(goal_species)
        self.budget = int(budget)
        self.rng = np.random.default_rng(seed)
        self.history = []

    def _niches(self, k):
        xs = np.linspace(250.0, 950.0, k)
        return [(f"n{i}", float(x)) for i, x in enumerate(xs)]

    def trial(self, k, bandwidth, seed):
        world = ResonanceWorld(niches=self._niches(k), pop_size=150,
                               bandwidth=bandwidth, seed=seed)
        agent = AutonomousWorld(world=world, max_ticks=120, stable_target=10)
        agent.run()
        species = len(world.species(tol=bandwidth))
        return species, agent.tick, agent.stopped_because

    def run(self, on_trial=None):
        # Candidate configurations the agent may try, then explore in random order.
        candidates = [(k, bw) for k in range(2, self.goal + 3)
                      for bw in (40.0, 55.0, 70.0)]
        self.rng.shuffle(candidates)

        best = None
        for i, (k, bw) in enumerate(candidates[: self.budget]):
            species, ticks, why = self.trial(k, bw, seed=i)
            rec = {
                "trial": i + 1,
                "niches": k,
                "bandwidth": bw,
                "species": species,
                "ticks": ticks,
                "hit": species == self.goal,
                "why": why,
            }
            self.history.append(rec)
            if on_trial:
                on_trial(rec)

            # score: hit the target species count first, then prefer faster.
            score = (-abs(species - self.goal), -ticks)
            if best is None or score > best[0]:
                best = (score, rec)

            if species == self.goal:      # goal met -> stop early (autonomous)
                break

        return best[1], self.history
