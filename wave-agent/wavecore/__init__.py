"""wavecore — a small ecosystem of programs that compute with sound waves.

Four pillars, all built on the same `signals` physics layer:
  - modem      : encode data as sound and decode it back (data <-> frequency)
  - reservoir  : let wave dynamics do nonlinear computation for you
  - logic      : boolean gates built from wave interference
  - evolve     : frequencies that adapt to a (possibly shifting) environment
"""
from . import evolve, logic, modem, reservoir, signals

__all__ = ["signals", "modem", "reservoir", "logic", "evolve"]
__version__ = "0.1.0"
