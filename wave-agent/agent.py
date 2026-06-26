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
from wavecore.world import ResonanceWorld


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


def run_evolve(generations: int, drift: float, pop: int, seed: int,
               tesla369: bool = False) -> int:
    if tesla369:
        env = ev.Tesla369Environment(bandwidth=45.0, hold=max(1, generations // 9))
        roots = ", ".join(f"{int(f)}(dr={ev.digital_root(f)})" for f in env._LOOP)
        print(f"  environment: resonance LOOPS through {roots} Hz")
        print(f"  note       : the 3-6-9 legend is folklore; the one real fact is")
        print(f"               that 369/639/963 all have digital root 9")
    else:
        env = ev.Environment(resonance=440.0, bandwidth=40.0, drift=drift)
        print(f"  environment: resonates at {env.resonance:.0f} Hz, drift {drift:+.0f} Hz/gen")
    print(f"  population : {pop} frequency-organisms, random start in 100-900 Hz\n")

    # The 369 loop makes big instant jumps, so the population needs a wider
    # mutation step to leap between targets; the smooth-drift world stays gentle.
    mutation = 60.0 if tesla369 else 8.0
    history = ev.evolve(env, generations=generations, pop_size=pop, seed=seed,
                        mutation=mutation)
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


def _histogram(pop, lo=100, hi=1000, step=75, width=34):
    edges = np.arange(lo, hi + step, step)
    counts, _ = np.histogram(pop, bins=edges)
    mx = counts.max() or 1
    out = []
    for i, c in enumerate(counts):
        bar = "█" * int(round(width * c / mx))
        out.append(f"   {int(edges[i]):>4}-{int(edges[i + 1]):>4} Hz |{bar} {c}")
    return "\n".join(out)


def run_world(generations: int, pop: int, seed: int) -> int:
    world = ResonanceWorld(pop_size=pop, seed=seed)
    niches = ", ".join(f"{n}@{int(r)}Hz" for n, r in world.niches)
    acc = world.perception_accuracy()

    print("  the four pillars wired into one loop: sing -> hear -> judge -> evolve")
    print(f"  niches     : {niches}  (barren middle in between)")
    print(f"  perception : reservoir-ear labels a tone's niche at {acc * 100:.0f}% accuracy\n")

    history = world.run(generations=generations)
    print("  GENERATION 0  — one undifferentiated population:")
    print(_histogram(history[0]))
    print(f"\n  GENERATION {generations}  — after selection through sound:")
    print(_histogram(history[-1]))

    species = world.species()
    print(f"\n  species    : {len(species)} distinct -> "
          + ", ".join(f"{k} ≈ {int(v)}Hz" for k, v in species.items()))

    print("  heredity   : each species' winning gene broadcast over the modem —")
    for name, info in world.broadcast_genes().items():
        mark = "✓" if info["ok"] else "✗"
        print(f"               {name:<5} gene {info['gene']:>4} Hz "
              f"-> sound -> decoded {info['recovered']} {mark} "
              f"({info['members']} members)")

    speciated = len(species) >= 2
    print("\n  emergence  : a single blob split into separate species ✓" if speciated
          else "\n  emergence  : not enough separation this run")
    return 0 if speciated else 1


def _spark(series, lo, hi, cols=52):
    s = np.asarray(series, dtype=float)
    idx = np.linspace(0, len(s) - 1, cols).astype(int)
    s = s[idx]
    blocks = "▁▂▃▄▅▆▇█"
    if hi - lo < 1e-9:
        return blocks[0] * cols
    norm = np.clip((s - lo) / (hi - lo), 0, 1)
    return "".join(blocks[int(round(n * (len(blocks) - 1)))] for n in norm)


def run_brain(generations: int, pop: int, seed: int) -> int:
    from wavecore import brain as bm

    print("  organisms whose BRAIN runs a continuous loop on a moving frequency.")
    print("  genes = control gains (kp, kd); evolution breeds perfect self-regulators.")
    print("  perfection = tracks the moving target AND regenerates after a knock,")
    print("               under noise, with an inertial body — error below 2.0 Hz.\n")
    print("   gen   track-err  recover  jitter")
    print("   ---   ---------  -------  ------")

    def show(r):
        if r["gen"] < 12 or r["gen"] % 10 == 0:
            print(f"   {r['gen']:>3}     {r['track']:>6.2f}    {r['recover']:>6.2f}   {r['jitter']:>5.2f}")

    best, hist, reached = bm.evolve_brains(center=440.0, generations=generations,
                                           pop=pop, seed=seed, on_generation=show)
    final = hist[-1]
    print(f"\n  result     : {'PERFECTION reached' if reached else 'budget spent (closest kept)'} "
          f"at gen {final['gen']}  ->  brain kp={best.kp:.2f}, kd={best.kd:.2f}")

    # Show the perfected brain chasing the continuous frequency (noise-free for clarity).
    target = bm.setpoint(440.0, bm._STEPS)
    traj, errs = bm.live(best, target, start=440.0, steps=bm._STEPS, perturbations=bm._PERTURB)
    lo, hi = float(min(target.min(), min(traj))), float(max(target.max(), max(traj)))
    print("\n  the perfected brain chasing the continuous frequency (+300Hz knock at t=55):")
    print("    target   " + _spark(target, lo, hi))
    print("    brain    " + _spark(traj, lo, hi))
    print(f"\n  regeneration: after the knock it re-locked onto the moving target, "
          f"ending {errs[-1]:.1f} Hz away.")
    return 0 if reached else 1


def run_track(wav, generations: int, seed: int) -> int:
    import os

    from wavecore import tracker as tk

    if wav:
        sig, sr = tk.load_wav(wav)
        src = wav
    else:
        sig, sr = tk.synth_signal()
        src = "synthesized melody (C E G A G E D C, with vibrato + hiss)"

    pitch = tk.instantaneous_pitch(sig, sr)
    print("  a brain following the pitch of a REAL signal (a learned phase-locked loop)")
    print(f"  input      : {src}")
    print(f"  estimated  : {len(pitch)} pitch frames, {pitch.min():.0f}-{pitch.max():.0f} Hz\n")
    print("   evolving a brain to follow the contour:")

    def show(g, e):
        if g < 6 or g % 10 == 0:
            print(f"     gen {g:>2}  follow-error {e:5.2f} Hz")

    best, _ = tk.fit_brain_to(pitch, generations=generations, seed=seed, on_generation=show)
    traj, errs = tk.follow(best, pitch)
    traj = np.array(traj)
    lo, hi = float(min(pitch.min(), traj.min())), float(max(pitch.max(), traj.max()))
    print(f"\n  brain      : kp={best.kp:.2f} kd={best.kd:.2f}, "
          f"mean follow error {np.mean(errs[3:]):.2f} Hz")
    print("\n  pitch contour vs the brain following it:")
    print("    input    " + _spark(pitch, lo, hi))
    print("    brain    " + _spark(traj, lo, hi))

    os.makedirs("runs", exist_ok=True)
    tk.write_wav("runs/input.wav", tk.render_pitch(pitch, sr), sr)
    tk.write_wav("runs/followed.wav", tk.render_pitch(traj, sr), sr)
    print("\n  audio out  : runs/input.wav (estimated pitch) and runs/followed.wav (brain's follow)")
    print("               — play them back to hear the brain track the melody.")
    return 0


def run_loop(wav, chunk: int, seed: int) -> int:
    import os

    from wavecore import automation as au
    from wavecore import tracker as tk

    if wav:
        sig, sr = tk.load_wav(wav)
        src = wav
    else:
        sig, sr = tk.synth_signal()
        src = "synthesized melody stream"
    pitch = tk.instantaneous_pitch(sig, sr)

    print("  continuous loop automation: stream pitch in chunks, follow + self-retune")
    print(f"  input      : {src}  ({len(pitch)} frames, {chunk}/chunk)")
    print("  it starts with a poor brain on purpose, notices, and fixes itself.\n")
    print("   chunk   mean-error   action")
    print("   -----   ----------   ------")

    def show(r):
        print(f"   {r['chunk']:>5}   {r['error']:>8.2f}Hz   {r['action'] or 'tracking'}")

    follow, retunes = au.run_stream(pitch, chunk=chunk, seed=seed, on_chunk=show)
    n_chunks = (len(pitch) + chunk - 1) // chunk
    print(f"\n  summary    : {len(pitch)} frames in {n_chunks} chunks, "
          f"self-retuned {len(retunes)} time(s), unattended")

    os.makedirs("runs", exist_ok=True)
    tk.write_wav("runs/stream_follow.wav", tk.render_pitch(follow, sr), sr)
    print("  audio out  : runs/stream_follow.wav (the brain's continuous follow)")
    return 0


def run_auto(ticks: int, seed: int, state, resume: bool) -> int:
    from wavecore.autonomous import AutonomousWorld

    a = AutonomousWorld(seed=seed, max_ticks=ticks, state_path=state)
    resumed = a.load() if (resume and state) else False

    print("  a self-driving ecosystem: perceive -> decide -> act -> persist")
    if resumed:
        print(f"  resumed    : from {state} at tick {a.tick}")
    print(f"  budget     : {ticks} ticks max; it stops early if it self-stabilises\n")
    print("   tick  species  mutation  decision the agent made")
    print("   ----  -------  --------  ----------------------")

    def show(ev):
        if ev["actions"]:
            print(f"   {ev['tick']:>4}  {ev['species']:>7}  {ev['mutation']:>8}  "
                  + "; ".join(ev["actions"]))

    a.run(on_event=show)
    sp = a.world.species()
    print(f"\n  stopped    : {a.stopped_because} at tick {a.tick}")
    print(f"  ecosystem  : {len(sp)} species -> "
          + ", ".join(f"{k} ≈ {int(v)}Hz" for k, v in sp.items()))
    if state:
        print(f"  persisted  : {state}  (run again with --resume to continue it)")
    return 0


def run_overseer(goal: int, budget: int, seed: int) -> int:
    from wavecore.overseer import Overseer

    o = Overseer(goal_species=goal, budget=budget, seed=seed)
    print(f"  an autonomous experimenter. goal: produce exactly {goal} stable species")
    print(f"  budget     : {budget} trials; it stops early the moment it hits the goal\n")
    print("   trial  niches  bandwidth  ->  species  ticks")
    print("   -----  ------  ---------      -------  -----")

    def show(r):
        flag = "   <- GOAL" if r["hit"] else ""
        print(f"   {r['trial']:>5}  {r['niches']:>6}  {r['bandwidth']:>9.0f}      "
              f"{r['species']:>7}  {r['ticks']:>5}{flag}")

    best, _ = o.run(on_trial=show)
    verdict = "goal met" if best["hit"] else "closest found"
    print(f"\n  best config: {best['niches']} niches, bandwidth {best['bandwidth']:.0f} "
          f"-> {best['species']} species ({verdict})")
    return 0 if best["hit"] else 1


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
        ("5. WORLD  — all four pillars wired into one loop; species emerge",
         lambda: run_world(generations=40, pop=120, seed=0)),
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
    e.add_argument("--tesla369", action="store_true",
                   help="loop the target through 369/639/963 Hz (a nod to the folklore)")

    w = sub.add_parser("world", help="all four pillars in one loop; watch species emerge")
    w.add_argument("--generations", type=int, default=40)
    w.add_argument("--pop", type=int, default=120)
    w.add_argument("--seed", type=int, default=0)

    au = sub.add_parser("auto", help="run the self-driving ecosystem autonomously")
    au.add_argument("--ticks", type=int, default=200)
    au.add_argument("--seed", type=int, default=0)
    au.add_argument("--state", default=None, help="JSON file to persist/resume the genome")
    au.add_argument("--resume", action="store_true", help="continue from --state if it exists")

    ov = sub.add_parser("overseer", help="autonomous agent that experiments to hit a goal")
    ov.add_argument("--goal", type=int, default=3, help="target number of stable species")
    ov.add_argument("--budget", type=int, default=8, help="max trials")
    ov.add_argument("--seed", type=int, default=0)

    b = sub.add_parser("brain", help="evolve self-regulating brains until one is perfect")
    b.add_argument("--generations", type=int, default=80)
    b.add_argument("--pop", type=int, default=40)
    b.add_argument("--seed", type=int, default=0)

    tr = sub.add_parser("track", help="evolve a brain to follow the pitch of real audio")
    tr.add_argument("--wav", default=None, help="input WAV (defaults to a synthesized melody)")
    tr.add_argument("--generations", type=int, default=40)
    tr.add_argument("--seed", type=int, default=0)

    lp = sub.add_parser("loop", help="continuous stream automation; tracks and self-retunes")
    lp.add_argument("--wav", default=None, help="input WAV (defaults to a synthesized stream)")
    lp.add_argument("--chunk", type=int, default=10, help="frames per streamed chunk")
    lp.add_argument("--seed", type=int, default=0)
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
        return run_evolve(args.generations, args.drift, args.pop, args.seed,
                          tesla369=args.tesla369)
    if args.cmd == "world":
        return run_world(args.generations, args.pop, args.seed)
    if args.cmd == "auto":
        return run_auto(args.ticks, args.seed, args.state, args.resume)
    if args.cmd == "overseer":
        return run_overseer(args.goal, args.budget, args.seed)
    if args.cmd == "brain":
        return run_brain(args.generations, args.pop, args.seed)
    if args.cmd == "track":
        return run_track(args.wav, args.generations, args.seed)
    if args.cmd == "loop":
        return run_loop(args.wav, args.chunk, args.seed)
    return 2


if __name__ == "__main__":
    sys.exit(main())
