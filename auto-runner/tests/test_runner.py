"""Tests for auto-runner. Run with: python -m pytest"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from jobs import HeartbeatJob, Job  # noqa: E402
from runner import Scheduler, serve  # noqa: E402


class _FailingJob(Job):
    def __init__(self):
        super().__init__("boom", 0)

    def run(self, ctx):
        raise RuntimeError("kaboom")


def test_runs_due_jobs_and_persists(tmp_path):
    path = str(tmp_path / "state.json")
    sch = Scheduler([HeartbeatJob(interval=0)], state_path=path)
    results = sch.tick(now=1000.0)
    assert len(results) == 1 and results[0]["status"] == "ok"
    assert os.path.exists(path)


def test_one_failing_job_does_not_kill_the_loop(tmp_path):
    sch = Scheduler([_FailingJob(), HeartbeatJob(interval=0)],
                    state_path=str(tmp_path / "s.json"))
    results = sch.tick(now=1.0, force=True)
    statuses = {r["job"]: r["status"] for r in results}
    assert statuses["boom"] == "error"          # the failure was caught
    assert statuses["heartbeat"] == "ok"        # the next job still ran


def test_interval_gating(tmp_path):
    sch = Scheduler([HeartbeatJob(interval=100)], state_path=str(tmp_path / "s.json"))
    assert len(sch.tick(now=0.0)) == 1          # first run always fires
    assert len(sch.tick(now=50.0)) == 0         # too soon — gated
    assert len(sch.tick(now=120.0)) == 1        # interval elapsed — fires again


def test_serve_runs_fixed_ticks_without_real_sleep(tmp_path):
    sch = Scheduler([HeartbeatJob(interval=0)], state_path=str(tmp_path / "s.json"))
    clock = {"t": 0.0}

    def fake_clock():
        clock["t"] += 1
        return clock["t"]

    total = serve(sch, interval=999, ticks=4, force=True,
                  sleep=lambda _s: None, clock=fake_clock, emit=lambda _m: None)
    assert total == 4
