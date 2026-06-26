# wave-agent

A small, self-contained "sub agent" that **computes with sound waves**. It grew
out of a simple question — *can a frequency and a wave be turned into something
that actually runs?* The honest answer is **yes, for specific jobs**, and this
is a working demonstration of four of them.

Nothing here is mystical. It's ordinary digital signal processing, reservoir
computing, and a genetic algorithm — but wired together so you can *watch*
sound do real computation.

## The four pillars

| Pillar | Idea | What it really is |
|---|---|---|
| **modem** | Data becomes sound, sound becomes data | BFSK — how dial-up modems worked |
| **reservoir** | Wave dynamics do the math for you | Physical reservoir computing (echo-state network) |
| **logic** | Boolean gates from interference | Phononic-style AND/OR/NOT/XOR |
| **evolve** | A frequency adapts to its environment | A genetic algorithm (artificial life) |

The `evolve` pillar is the closest honest answer to *"a frequency that evolves
in a new environment"*: a population of frequency-organisms is selected and
mutated until it couples to the environment's resonance. Give the environment a
`--drift` and the target keeps moving, so the population must keep adapting.

## Run it

```bash
pip install -r requirements.txt        # just numpy

python agent.py demo                    # run all four pillars end to end
python agent.py modem "hello waves"     # encode text as sound, decode it back
python agent.py reservoir               # classify tones with wave dynamics
python agent.py logic                   # interference-based truth tables
python agent.py evolve --drift 6 --generations 80   # evolve in a moving world
python agent.py evolve --tesla369 --generations 54  # chase a 369->639->963 Hz loop
```

### About the `--tesla369` mode

A playful, opt-in nod to the apocryphal Tesla "3-6-9" legend: the environment's
resonance **loops** through 369 → 639 → 963 Hz and the population has to keep
re-adapting. It is folklore, not physics — the only real bit of math is that
369, 639 and 963 all have **digital root 9**, and the digit-doubling sequence
(1‑2‑4‑8‑7‑5…) never touches 3, 6 or 9. The mode demonstrates that pattern
honestly while literally "putting 369 on a loop."

## Test it

```bash
pip install pytest
python -m pytest        # round-trips, truth tables, accuracy, convergence
```

## Layout

```
wave-agent/
├── agent.py              # the sub-agent: one CLI, four capabilities
├── wavecore/
│   ├── signals.py        # shared physics: tones, FFT, interference, amplitude
│   ├── modem.py          # data <-> frequency
│   ├── reservoir.py      # waves doing nonlinear computation
│   ├── logic.py          # interference logic gates
│   └── evolve.py         # frequencies evolving in an environment
└── tests/test_wavecore.py
```

## What this is *not*

It does not replace your CPU, it is not "frequency healing," and a wave by
itself is not alive. It's a focused, runnable ecosystem showing the genuine
places where waves and frequencies *do* compute.
