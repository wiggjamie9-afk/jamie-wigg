"""Wave reservoir computer — let dynamics do the math.

This is the real "waves compute for you" idea (physical reservoir computing).
A pool of interconnected nodes is driven by your input signal. Their tangled,
rippling response is a rich nonlinear transform of the input. We then train a
single cheap linear "read-out" to pull an answer out of that ripple.

In hardware this medium could literally be a tank of water or a vibrating
plate. Here it's a software echo-state network — same principle, runs anywhere.
"""
from __future__ import annotations

import numpy as np


class WaveReservoir:
    def __init__(self, size=80, spectral_radius=0.95, leak=0.7,
                 input_scale=1.0, seed=0):
        rng = np.random.default_rng(seed)
        W = rng.standard_normal((size, size))
        radius = np.max(np.abs(np.linalg.eigvals(W)))
        self.W = W * (spectral_radius / radius)          # recurrent coupling
        self.Win = rng.standard_normal(size) * input_scale  # input injection
        self.size = size
        self.leak = leak
        self.Wout = None
        self.classes = None

    def _states(self, signal):
        """Run the medium and return its state at every timestep."""
        x = np.zeros(self.size)
        hist = np.empty((len(signal), self.size))
        for t, u in enumerate(signal):
            pre = self.W @ x + self.Win * u
            x = (1.0 - self.leak) * x + self.leak * np.tanh(pre)
            hist[t] = x
        return hist

    def features(self, signal):
        """Summarise the ripple per node: mean level + oscillation magnitude.

        The std over time is what carries frequency information — a node that
        rings hard at the input frequency has a large temporal std.
        """
        h = self._states(signal)
        return np.concatenate([h.mean(axis=0), h.std(axis=0)])

    def train(self, signals, labels, ridge=1e-2):
        X = np.array([self.features(s) for s in signals])
        X = np.hstack([X, np.ones((len(X), 1))])          # bias term
        self.classes = sorted(set(labels))
        T = np.zeros((len(labels), len(self.classes)))
        for i, y in enumerate(labels):
            T[i, self.classes.index(y)] = 1.0
        A = X.T @ X + ridge * np.eye(X.shape[1])
        self.Wout = np.linalg.solve(A, X.T @ T)           # ridge regression

    def predict(self, signal):
        f = np.concatenate([self.features(signal), [1.0]])
        scores = f @ self.Wout
        return self.classes[int(np.argmax(scores))]
