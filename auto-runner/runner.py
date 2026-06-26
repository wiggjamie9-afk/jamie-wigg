#!/usr/bin/env python3
"""auto-runner — a real automation loop that keeps running after you start it.

    python runner.py --once                 # run every job once, print results
    python runner.py --ticks 5 --interval 1 # run 5 ticks, 1s apart (demo)
    python runner.py --serve --interval 3600 # run forever, hourly (real use)

HONEST SCOPE
------------
This is the *engine*. It runs jobs on a schedule, forever, after you start it —
that part is completely real. It does NOT, by itself, make money. Revenue
happens only when a job connects a real product to real customers (value someone
pays for). The loop is the lever; your product + audience are the source. See
README.md for the honest revenue boundary and what you must supply.
"""
from __future__ import annotations

import argparse
import json
import os
import time
import traceback

from jobs import default_jobs


class Scheduler:
    def __init__(self, jobs, state_path="runs/runner_state.json"):
        self.jobs = jobs
        self.state_path = state_path
        self.last_run = {}
        self.tick_count = 0
        self.log = []
        self._load()

    def _due(self, job, now, force):
        if force:
            return True
        last = self.last_run.get(job.name)
        return last is None or (now - last) >= job.interval

    def tick(self, now, force=False):
        """Run all due jobs once. One job failing never stops the others."""
        self.tick_count += 1
        results = []
        for job in self.jobs:
            if not self._due(job, now, force):
                continue
            try:
                out = job.run({"now": now, "tick": self.tick_count})
                status = "ok"
            except Exception as exc:  # isolate failures — the loop must survive
                out = {"error": str(exc),
                       "where": traceback.format_exc().strip().splitlines()[-1]}
                status = "error"
            self.last_run[job.name] = now
            rec = {"tick": self.tick_count, "job": job.name, "status": status, "result": out}
            self.log.append(rec)
            results.append(rec)
        self._save()
        return results

    def _load(self):
        if os.path.exists(self.state_path):
            with open(self.state_path) as f:
                s = json.load(f)
            self.last_run = s.get("last_run", {})
            self.tick_count = s.get("tick_count", 0)

    def _save(self):
        os.makedirs(os.path.dirname(os.path.abspath(self.state_path)), exist_ok=True)
        with open(self.state_path, "w") as f:
            json.dump({"last_run": self.last_run, "tick_count": self.tick_count,
                       "log": self.log[-200:]}, f, indent=2)


def serve(scheduler, interval, ticks=None, force=False,
          sleep=time.sleep, clock=time.time, emit=print):
    """Drive the scheduler: `ticks` passes (or forever if None), `interval` apart."""
    n = 0
    while ticks is None or n < ticks:
        for r in scheduler.tick(clock(), force=force):
            emit(f"[tick {r['tick']:>3}] {r['job']:<14} {r['status']:<5} {r['result']}")
        n += 1
        if ticks is not None and n >= ticks:
            break
        sleep(interval)
    return scheduler.tick_count


def main(argv=None):
    ap = argparse.ArgumentParser(description="A continuously-running automation loop.")
    ap.add_argument("--once", action="store_true", help="run every job once and exit")
    ap.add_argument("--ticks", type=int, default=None, help="number of passes (demo)")
    ap.add_argument("--interval", type=float, default=3600.0, help="seconds between passes")
    ap.add_argument("--serve", action="store_true", help="run forever")
    args = ap.parse_args(argv)

    sch = Scheduler(default_jobs())
    if args.once:
        for r in sch.tick(time.time(), force=True):
            print(f"[tick {r['tick']}] {r['job']}: {r['status']} {r['result']}")
        return 0

    ticks = None if args.serve else (args.ticks if args.ticks is not None else 1)
    print("auto-runner: starting loop. Ctrl-C to stop.  (engine is real; "
          "revenue depends on the jobs you connect — see README.md)")
    serve(sch, args.interval, ticks=ticks, force=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
