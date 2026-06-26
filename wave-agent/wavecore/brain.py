"""Brain — organisms that control their own frequency, and evolve to do it perfectly.

A step up from the static frequency-organisms elsewhere in the ecosystem. Here
each organism has a *brain*: a small feedback controller that runs a continuous
loop, sensing how far its frequency is from the target and correcting it every
tick. Knock the frequency off course and the brain regenerates the target state
(homeostasis). The brain's control gains are its genes, so evolution breeds
populations of better and better self-regulators — until one is "perfect":
locks on, holds, and recovers from any perturbation with near-zero error.

"Perfection" here means error below a small threshold (epsilon) in steady state
AND after a perturbation AND without instability. True zero-error-forever is an
asymptote, and genuinely never-ending open-ended improvement is an unsolved
research problem — so we define perfection honestly and reach it.
"""
from __future__ import annotations

import numpy as np


class Brain:
    """A feedback controller: the organism's nervous system.

    Senses error (target - freq) and its rate of change, outputs a correction.
    Genes = (kp, kd): the proportional and derivative control gains.
    """

    __slots__ = ("kp", "kd")

    def __init__(self, kp, kd):
        self.kp = float(kp)
        self.kd = float(kd)

    def correction(self, error, derror):
        return self.kp * error + self.kd * derror

    def mutate(self, rng, rate=0.08):
        return Brain(self.kp + rng.normal(0, rate), self.kd + rng.normal(0, rate))


DAMPING = 0.82  # how much the body's momentum carries between ticks


def live(brain, target, start, steps=80, perturbations=None, noise=0.0,
         rng=None, clamp=(0.0, 3000.0)):
    """Run one organism's continuous control loop for a lifetime.

    The organism's frequency is a *body with momentum* (a second-order plant):
    the brain pushes on its velocity, not its position. So an over-aggressive
    brain overshoots and oscillates, while a sluggish one lags — only a
    well-tuned, well-damped brain regulates cleanly. `perturbations` is
    {tick: delta_hz} (knocks to test regeneration); `noise` adds per-tick
    process + sensing noise. Returns (trajectory, abs_errors).
    """
    target = np.asarray(target, dtype=float)
    scalar = target.ndim == 0
    f = float(start)
    v = 0.0
    prev_err = 0.0
    traj, errs = [], []
    for t in range(steps):
        if perturbations and t in perturbations:
            f += perturbations[t]
        goal = float(target) if scalar else float(target[t])
        measured = goal
        if noise and rng is not None:
            f += rng.normal(0, noise)                  # process noise on the body
            measured = goal + rng.normal(0, noise)     # noisy sensing of the goal
        err = measured - f
        derr = err - prev_err
        v = (v + brain.correction(err, derr)) * DAMPING
        f = float(np.clip(f + v, *clamp))
        prev_err = err
        traj.append(f)
        errs.append(abs(goal - f))
    return traj, errs


def setpoint(center, steps, amplitude=120.0, period=40.0):
    """A continuously moving target — the 'continuous frequency' the brain chases."""
    t = np.arange(steps)
    return center + amplitude * np.sin(2.0 * np.pi * t / period)


# Scenario: chase a continuously moving setpoint around `center`, get knocked
# off at tick 55, regenerate, all with an inertial body under noise.
_CENTER = 440.0
_PERTURB = {55: 300.0}
_NOISE = 1.5
_TRIALS = 6
_STEPS = 100


def _run_metrics(brain, center, start, noise, rng):
    target = setpoint(center, _STEPS)
    traj, errs = live(brain, target, start, steps=_STEPS, perturbations=_PERTURB,
                      noise=noise, rng=rng)
    track = float(np.mean(errs[20:55]))            # tracking the moving target
    recover = float(np.mean(errs[80:100]))         # tracking again after the knock
    jitter = float(np.std(np.diff(traj[84:100]) - np.diff(target[84:100])))
    return track, recover, jitter


def metrics(brain, center=_CENTER, start=None, seed=12345):
    """Average behaviour over several noisy lifetimes (so the score is stable)."""
    start = center if start is None else start
    rng = np.random.default_rng(seed)
    s = np.mean([_run_metrics(brain, center, start, _NOISE, rng) for _ in range(_TRIALS)],
                axis=0)
    return {"track": float(s[0]), "recover": float(s[1]), "jitter": float(s[2])}


def is_perfect(brain, center=_CENTER, epsilon=2.0):
    m = metrics(brain, center)
    return m["track"] < epsilon and m["recover"] < epsilon and m["jitter"] < epsilon


def _fitness(brain, center, rng):
    start = center + rng.uniform(-200, 200)
    vals = np.mean([_run_metrics(brain, center, start, _NOISE, rng) for _ in range(_TRIALS)],
                   axis=0)
    track, recover, jitter = vals
    return float(np.exp(-track / 15) * np.exp(-recover / 15) * np.exp(-jitter / 5))


def evolve_brains(center=_CENTER, generations=80, pop=40, seed=0, epsilon=2.0,
                  on_generation=None):
    """Breed brains until one tracks the moving frequency perfectly (or budget ends)."""
    rng = np.random.default_rng(seed)
    brains = [Brain(rng.uniform(0.05, 1.4), rng.uniform(-0.5, 0.8)) for _ in range(pop)]
    history = []
    perfect = None
    scored = brains

    for g in range(generations):
        scored = sorted(brains, key=lambda b: _fitness(b, center, np.random.default_rng(1000 + g)),
                        reverse=True)
        best = scored[0]
        m = metrics(best, center)
        rec = {"gen": g, "kp": round(best.kp, 3), "kd": round(best.kd, 3), **m}
        history.append(rec)
        if on_generation:
            on_generation(rec)

        if m["track"] < epsilon and m["recover"] < epsilon and m["jitter"] < epsilon:
            perfect = best
            rec["perfect"] = True
            break

        survivors = scored[: pop // 2]
        children = []
        while len(survivors) + len(children) < pop:
            children.append(survivors[rng.integers(len(survivors))].mutate(rng))
        brains = survivors + children

    return (perfect or scored[0]), history, perfect is not None
