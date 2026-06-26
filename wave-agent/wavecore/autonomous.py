"""AutonomousWorld — the ecosystem that drives itself.

This is the self-running loop. No one types commands at it: each tick it
*perceives* its own state, *decides* what to do about it, *acts*, and persists
its genome so it can be stopped and resumed. It even decides for itself when it
is finished (the ecosystem has stayed stable long enough).

Autonomy here is honest and bounded: a real perceive -> decide -> act loop, with
a hard `max_ticks` ceiling and a sandboxed JSON state file. It cannot reach
outside its own world.
"""
from __future__ import annotations

import json
import os

import numpy as np

from .world import ResonanceWorld


class AutonomousWorld:
    def __init__(self, world=None, seed=0, max_ticks=200, stable_target=12,
                 state_path=None):
        self.world = world if world is not None else ResonanceWorld(pop_size=120, seed=seed)
        self.tick = 0
        self.max_ticks = int(max_ticks)
        self.stable_target = int(stable_target)
        self.stable = 0          # consecutive ticks with >=2 species
        self.mutation = 18.0     # the agent tunes this itself
        self.prev_species = -1
        self.log = []
        self.state_path = state_path

    # -- perceive -------------------------------------------------------------
    def observe(self):
        species = self.world.species()
        return species, len(species)

    # -- decide + act ---------------------------------------------------------
    def step(self):
        species, nsp = self.observe()
        actions = []

        # Self-repair: if a niche has gone extinct, seed migrants back into it.
        for name, res in self.world.niches:
            if np.sum(np.abs(self.world.pop - res) <= 80) == 0:
                idx = self.world.rng.choice(len(self.world.pop), 10, replace=False)
                self.world.pop[idx] = self.world.rng.normal(res, 20, 10)
                actions.append(f"repaired extinct niche '{name}' (+10 migrants)")

        # Adaptive mutation: settle down when stable, explore when collapsing.
        if nsp >= 2:
            self.stable += 1
            self.mutation = max(8.0, self.mutation * 0.85)
            if self.stable == 3:
                actions.append("2+ species holding -> settling mutation down")
        else:
            self.stable = 0
            self.mutation = min(55.0, self.mutation * 1.2)
            actions.append(f"under-speciated -> exploring (mutation -> {self.mutation:.0f})")

        self.world.step(mutation=self.mutation)
        self.tick += 1

        event = {
            "tick": self.tick,
            "species": nsp,
            "stable": self.stable,
            "mutation": round(self.mutation, 1),
            "actions": actions,
        }
        if actions or nsp != self.prev_species:
            self.log.append(event)
            self.prev_species = nsp
        return event

    # -- the agent's own stop condition --------------------------------------
    def done(self):
        return self.tick >= self.max_ticks or self.stable >= self.stable_target

    def run(self, on_event=None, checkpoint_every=20):
        while not self.done():
            ev = self.step()
            if on_event:
                on_event(ev)
            if self.state_path and self.tick % checkpoint_every == 0:
                self.save()
        if self.state_path:
            self.save()
        return self.log

    @property
    def stopped_because(self):
        if self.stable >= self.stable_target:
            return f"self-stabilised ({self.stable} ticks with 2+ species)"
        return f"reached tick ceiling ({self.max_ticks})"

    # -- persistence (sandboxed to its own file) ------------------------------
    def save(self):
        os.makedirs(os.path.dirname(os.path.abspath(self.state_path)), exist_ok=True)
        state = {
            "tick": self.tick,
            "mutation": self.mutation,
            "stable": self.stable,
            "pop": self.world.pop.tolist(),
            "niches": [list(n) for n in self.world.niches],
            "log": self.log,
        }
        with open(self.state_path, "w") as f:
            json.dump(state, f)

    def load(self):
        if not (self.state_path and os.path.exists(self.state_path)):
            return False
        with open(self.state_path) as f:
            state = json.load(f)
        self.tick = state["tick"]
        self.mutation = state["mutation"]
        self.stable = state.get("stable", 0)
        self.world.pop = np.array(state["pop"])
        self.world.niches = [tuple(n) for n in state["niches"]]
        self.log = state.get("log", [])
        return True
