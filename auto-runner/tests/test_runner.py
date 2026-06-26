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


def test_hook_generator_varies_and_never_posts(tmp_path):
    from presets import HookGeneratorJob

    job = HookGeneratorJob(out_dir=str(tmp_path / "drafts"))
    hooks = {job.run({"tick": t})["angle"] for t in range(5)}
    assert len(hooks) == 5                       # rotates through all wedge angles
    out = job.run({"tick": 0})
    assert out["posted"] is False                # drafts only, never auto-posts
    assert os.path.exists(out["wrote"])


def test_gumroad_job_invents_nothing_without_token(monkeypatch, tmp_path):
    from presets import GumroadSalesJob

    monkeypatch.delenv("GUMROAD_ACCESS_TOKEN", raising=False)
    out = GumroadSalesJob(out_dir=str(tmp_path / "r")).run({"tick": 1})
    assert out["status"] == "setup-needed"       # no token -> no fabricated numbers


def test_gumroad_parse_computes_revenue():
    from presets import GumroadSalesJob

    payload = {"sales": [{"product_name": "Studio", "price": 14900, "created_at": "x"},
                         {"product_name": "Studio", "price": 14900, "created_at": "y"}]}
    parsed = GumroadSalesJob._parse(payload)
    assert parsed["count"] == 2
    assert parsed["revenue_usd"] == 298.0        # 2 x $149.00, prices are in cents


def test_serve_runs_fixed_ticks_without_real_sleep(tmp_path):
    sch = Scheduler([HeartbeatJob(interval=0)], state_path=str(tmp_path / "s.json"))
    clock = {"t": 0.0}

    def fake_clock():
        clock["t"] += 1
        return clock["t"]

    total = serve(sch, interval=999, ticks=4, force=True,
                  sleep=lambda _s: None, clock=fake_clock, emit=lambda _m: None)
    assert total == 4
