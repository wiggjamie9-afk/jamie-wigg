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
| **world** | All four, wired into one loop → species emerge | Disruptive selection through sound |

### The `world` — emergence from the four pillars

`world` is the four pillars re-engineered into a single loop instead of four
separate demos. Each generation every organism (a frequency) **sings** a tone,
is **heard** and niche-labelled by the reservoir-ear, has its survival
**decided by the interference logic gates**, then survivors **evolve**, and each
species **broadcasts** its winning gene through the modem. With two resonant
niches and a barren gap between them, a single uniform population reliably
**splits into two distinct frequency-species** — emergence that no single pillar
produces alone. Run `python agent.py world` and watch the histogram split.

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
python agent.py world                               # one loop; watch species emerge

# autonomous layers — loops that run themselves
python agent.py auto --state runs/genome.json       # self-driving ecosystem; persists
python agent.py auto --state runs/genome.json --resume   # continue where it left off
python agent.py overseer --goal 3                   # agent that experiments to hit a goal
python agent.py brain                               # evolve a self-regulating brain to perfection
python agent.py track                               # brain follows the pitch of real audio -> WAV
```

### The `track` — a brain following a real signal

`track` points a brain at **real audio**: it estimates the instantaneous pitch
(short-time FFT), evolves a brain to follow that contour, and writes out audio
you can play — `runs/input.wav` (the estimated pitch) and `runs/followed.wav`
(the brain's follow). Functionally it's a **learned phase-locked loop**, the
idea behind auto-tune, radio carrier recovery, and active noise cancellation.
Pass your own clip with `--wav path.wav`, or omit it for a synthesized melody.

### The `brain` — organisms that regulate themselves to perfection

Every organism here has a **brain**: a feedback controller running a continuous
loop on a *moving* frequency. Its body has momentum (a second-order plant) and
its senses are noisy, so flawless control is not trivial — an over-eager brain
oscillates, a sluggish one lags. The brain's control gains are its genes, and
evolution breeds the population until one **tracks the moving target and
regenerates after any knock with sub-2 Hz error** — what we call *perfection*,
defined honestly (true zero-error-forever is an asymptote; genuinely
never-ending open-ended improvement is an unsolved research problem). Run
`python agent.py brain` and watch the tracking error fall generation by
generation, then see the perfected brain chase the wave and snap back from a
+300 Hz knock in a single step.

### Autonomy, honestly

Two self-running loops sit on top of the world:

- **`auto` — the self-driving ecosystem.** Each tick it *perceives* its own
  state, *decides* (repair an extinct niche, raise or lower its own mutation
  rate), *acts*, and persists its genome to JSON. It even decides **when it is
  done** (the ecosystem has stayed stable long enough) and stops itself. Bounded
  by a hard `--ticks` ceiling and sandboxed to one state file — autonomy with
  guardrails, not a runaway.
- **`overseer` — an autonomous experimenter.** Give it a goal ("produce K
  stable species") and it tries configurations on its own, runs a full `auto`
  trial for each, reads the result, keeps the best, and stops early once it hits
  the goal — all within a fixed trial budget.

No agent can "do anything" — an agent is exactly as capable as the tools you put
in its hands. These two are real perceive→decide→act loops, deliberately bounded
to their own world.

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
│   ├── evolve.py         # frequencies evolving in an environment
│   ├── world.py          # all four pillars composed into one loop
│   ├── autonomous.py     # the self-driving ecosystem (perceive/decide/act/persist)
│   ├── overseer.py       # autonomous experimenter that drives the world to a goal
│   ├── brain.py          # self-regulating brains that evolve to track a frequency perfectly
│   └── tracker.py        # point a brain at real audio; follow its pitch (learned PLL)
└── tests/test_wavecore.py
```

## What this is *not*

It does not replace your CPU, it is not "frequency healing," and a wave by
itself is not alive. It's a focused, runnable ecosystem showing the genuine
places where waves and frequencies *do* compute.
