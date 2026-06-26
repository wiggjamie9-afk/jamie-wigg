#!/usr/bin/env python3
"""wave-agent — a self-contained "sub agent" that thinks in waves.

One entry point, four capabilities. Run any pillar on its own, or `demo` to
watch the whole ecosystem run end to end.

    python agent.py demo
    python agent.py modem "hello waves"
    python agent.py reservoir
    python agent.py logic
    python agent.py evolve --drift 6 --generations 80
"""
from __future__ import annotations

import argparse
import sys

import numpy as np

from wavecore import evolve as ev
from wavecore import logic, modem, reservoir
from wavecore.signals import DEFAULT_SR, tone


# --------------------------------------------------------------------------- #
# Pillar runners
# --------------------------------------------------------------------------- #
def run_modem(message: str) -> int:
    data = message.encode("utf-8")
    signal = modem.encode(data)
    recovered = modem.decode(signal)
    ok = recovered == data
    secs = len(signal) / DEFAULT_SR
    print(f"  message    : {message!r}")
    print(f"  bytes      : {len(data)}  ->  {len(signal)} audio samples "
          f"({secs:.2f}s of sound at {DEFAULT_SR} Hz)")
    print(f"  tones used : {modem.F0:.0f} Hz = 0 bit, {modem.F1:.0f} Hz = 1 bit")
    print(f"  recovered  : {recovered.decode('utf-8', 'replace')!r}")
    print(f"  round-trip : {'OK ✓' if ok else 'MISMATCH ✗'}")
    return 0 if ok else 1


def _freq_dataset(rng, n_per_class=30, sr=2000, dur=0.05):
    """Two classes of noisy tone: 'low' ~250 Hz, 'high' ~700 Hz."""
    signals, labels = [], []
    for label, base in (("low", 250.0), ("high", 700.0)):
        for _ in range(n_per_class):
            f = base + rng.normal(0, 25)
            s = tone(f, dur, sample_rate=sr) + rng.normal(0, 0.3, int(dur * sr))
            signals.append(s)
            labels.append(label)
    return signals, labels


def run_reservoir() -> int:
    rng = np.random.default_rng(1)
    sig_tr, lab_tr = _freq_dataset(rng)
    sig_te, lab_te = _freq_dataset(rng)

    res = reservoir.WaveReservoir(size=80, seed=0)
    res.train(sig_tr, lab_tr)
    preds = [res.predict(s) for s in sig_te]
    acc = sum(p == y for p, y in zip(preds, lab_te)) / len(lab_te)

    print("  task       : classify a noisy tone as 'low' (~250Hz) or 'high' (~700Hz)")
    print(f"  reservoir  : {res.size} coupled nodes, trained linear read-out")
    print(f"  train/test : {len(sig_tr)} / {len(sig_te)} signals")
    print(f"  accuracy   : {acc * 100:.1f}%")
    return 0 if acc > 0.8 else 1


def run_logic() -> int:
    gates = {"AND": logic.AND, "OR": logic.OR, "XOR": logic.XOR, "NOT": logic.NOT}
    all_ok = True
    expected = {
        "AND": {(0, 0): 0, (0, 1): 0, (1, 0): 0, (1, 1): 1},
        "OR":  {(0, 0): 0, (0, 1): 1, (1, 0): 1, (1, 1): 1},
        "XOR": {(0, 0): 0, (0, 1): 1, (1, 0): 1, (1, 1): 0},
        "NOT": {(0,): 1, (1,): 0},
    }
    print(f"  bit = a {logic.F:.0f} Hz tone, present(1) or absent(0); "
          f"gates use interference\n")
    for name, gate in gates.items():
        rows = logic.truth_table(gate)
        line = []
        for inp, out in rows:
            want = expected[name][inp]
            mark = "✓" if out == want else "✗"
            if out != want:
                all_ok = False
            line.append(f"{inp}->{out}{mark}")
        print(f"  {name:<4}: " + "  ".join(line))
    print("\n  all gates correct ✓" if all_ok else "\n  GATE ERROR ✗")
    return 0 if all_ok else 1


def run_evolve(generations: int, drift: float, pop: int, seed: int) -> int:
    env = ev.Environment(resonance=440.0, bandwidth=40.0, drift=drift)
    start = env.resonance
    history = ev.evolve(env, generations=generations, pop_size=pop, seed=seed)

    print(f"  environment: resonates at {start:.0f} Hz, drift {drift:+.0f} Hz/gen")
    print(f"  population : {pop} frequency-organisms, random start in 100-900 Hz\n")
    print("   gen   target   best     fit    population mean")
    print("   ---   ------   ----    -----   ---------------")
    for r in history:
        if r["gen"] % max(1, generations // 8) == 0 or r["gen"] == generations - 1:
            bar = "█" * int(r["best_fit"] * 20)
            print(f"   {r['gen']:>3}   {r['resonance']:>6.0f}   "
                  f"{r['best_freq']:>5.0f}   {r['best_fit']:>5.2f}   {bar}")
    final = history[-1]
    adapted = final["best_fit"] > 0.9
    print(f"\n  final best : {final['best_freq']:.0f} Hz "
          f"(target {final['resonance']:.0f} Hz, fitness {final['best_fit']:.2f})")
    print("  verdict    : population adapted to its environment ✓" if adapted
          else "  verdict    : still chasing a fast-moving target")
    return 0


def run_demo() -> int:
    sections = [
        ("1. MODEM  — data becomes sound, then sound becomes data",
         lambda: run_modem("wave agent online")),
        ("2. RESERVOIR  — wave dynamics classify a signal",
         run_reservoir),
        ("3. LOGIC  — boolean gates from interference",
         run_logic),
        ("4. EVOLVE  — a frequency adapts to a shifting world",
         lambda: run_evolve(generations=80, drift=4.0, pop=40, seed=0)),
    ]
    rc = 0
    print("=" * 64)
    print(" WAVE-AGENT ECOSYSTEM  ·  four ways to compute with sound")
    print("=" * 64)
    for title, fn in sections:
        print("\n" + title)
        print("-" * 64)
        rc |= fn()
    print("\n" + "=" * 64)
    print(" done." + ("  all pillars healthy ✓" if rc == 0 else "  some checks failed ✗"))
    print("=" * 64)
    return rc


# --------------------------------------------------------------------------- #
def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="A sub-agent that computes with sound waves.")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("demo", help="run all four pillars end to end")

    m = sub.add_parser("modem", help="encode text as sound and decode it back")
    m.add_argument("message", nargs="?", default="hello waves")

    sub.add_parser("reservoir", help="classify signals with wave dynamics")
    sub.add_parser("logic", help="boolean gates built from interference")

    e = sub.add_parser("evolve", help="evolve a frequency to fit an environment")
    e.add_argument("--generations", type=int, default=60)
    e.add_argument("--drift", type=float, default=0.0, help="Hz the target moves per generation")
    e.add_argument("--pop", type=int, default=40)
    e.add_argument("--seed", type=int, default=0)
    return p


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    if args.cmd == "demo":
        return run_demo()
    if args.cmd == "modem":
        return run_modem(args.message)
    if args.cmd == "reservoir":
        return run_reservoir()
    if args.cmd == "logic":
        return run_logic()
    if args.cmd == "evolve":
        return run_evolve(args.generations, args.drift, args.pop, args.seed)
    return 2


if __name__ == "__main__":
    sys.exit(main())
