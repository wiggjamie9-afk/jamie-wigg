"""Automation — a continuous loop that tracks a stream and re-tunes itself.

This is the unattended, real-time version of the tracker. Instead of one fixed
clip, audio arrives in chunks (a stream). A single persistent brain follows the
pitch continuously, carrying its control state across chunk boundaries. After
each chunk the loop checks its own tracking error; if it has drifted past a
threshold, it AUTO-RETUNES — evolves a fresh brain on the recent pitch history
and swaps it in without dropping a beat — then keeps going.

That is automation in the honest sense: it runs on a loop, monitors itself, and
repairs itself, with no human in the loop. Still bounded — it only consumes the
stream it is given.
"""
from __future__ import annotations

import numpy as np

from . import tracker as tk
from .brain import DAMPING, Brain


class Follower:
    """A persistent brain + body that tracks one frame at a time, keeping state."""

    def __init__(self, brain, start, clamp=(0.0, 3000.0)):
        self.brain = brain
        self.f = float(start)
        self.v = 0.0
        self.prev_err = 0.0
        self.clamp = clamp

    def step(self, goal):
        err = goal - self.f
        derr = err - self.prev_err
        self.v = (self.v + self.brain.correction(err, derr)) * DAMPING
        self.f = float(np.clip(self.f + self.v, *self.clamp))
        self.prev_err = err
        return self.f, abs(goal - self.f)


def run_stream(pitch, chunk=10, retune_threshold=8.0, seed=0, on_chunk=None):
    """Continuously follow a pitch stream, re-tuning the brain when it drifts.

    Returns (follow_trajectory, retune_chunk_indices).
    """
    # Start with a deliberately poor brain so the loop has to notice and fix it.
    follower = Follower(Brain(0.05, 0.0), start=float(pitch[0]))
    follow, retunes, recent = [], [], []

    for ci, s in enumerate(range(0, len(pitch), chunk)):
        seg = pitch[s : s + chunk]
        errs = []
        for goal in seg:
            f, e = follower.step(goal)
            follow.append(f)
            errs.append(e)
        recent.extend(seg)

        chunk_err = float(np.mean(errs)) if errs else 0.0
        action = None
        if chunk_err > retune_threshold:
            best, _ = tk.fit_brain_to(np.array(recent[-30:]), generations=25, seed=seed)
            follower.brain = best                     # swap in, keep f/v state
            action = f"RETUNED -> kp={best.kp:.2f}, kd={best.kd:.2f}"
            retunes.append(ci)

        if on_chunk:
            on_chunk({"chunk": ci, "error": chunk_err, "action": action})

    return np.array(follow), retunes
