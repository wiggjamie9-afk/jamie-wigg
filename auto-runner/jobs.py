"""Jobs the runner executes on a schedule.

Each Job has a name, an interval (seconds), and a run(ctx) method that returns a
small result dict.

HONEST NOTE ON REVENUE
----------------------
Jobs tagged [REVENUE-ADJACENT] are where real money work attaches. By default
they use SAFE STUBS that touch nothing external — they do not post, email,
spend, or scrape. You must connect your own real product data and channels
(and review the output) before anything reaches a customer. This runner will
never auto-spam, fake activity, or game a platform — those lose money and get
accounts banned. Automation multiplies a real offer; it cannot invent one.
"""
from __future__ import annotations

import json
import os


class Job:
    def __init__(self, name, interval):
        self.name = name
        self.interval = float(interval)

    def run(self, ctx):
        raise NotImplementedError


class HeartbeatJob(Job):
    """Proves the loop is alive and running. Harmless, always safe."""

    def __init__(self, interval=0):
        super().__init__("heartbeat", interval)

    def run(self, ctx):
        return {"alive": True, "tick": ctx["tick"]}


class DailyReportJob(Job):
    """[REVENUE-ADJACENT] Summarise sales/traffic for you.

    Connect your real numbers by passing `metrics_source` — a function that
    returns a dict (e.g. pulled from Gumroad/Stripe/Plausible). The default is a
    stub that returns nothing real, on purpose.
    """

    def __init__(self, interval=86400, metrics_source=None, out_dir="reports"):
        super().__init__("daily_report", interval)
        self.metrics_source = metrics_source or (lambda: {
            "sales": None, "visitors": None,
            "note": "STUB — connect Gumroad/Stripe/analytics here",
        })
        self.out_dir = out_dir

    def run(self, ctx):
        metrics = self.metrics_source()
        os.makedirs(self.out_dir, exist_ok=True)
        path = os.path.join(self.out_dir, f"report_{ctx['tick']}.json")
        with open(path, "w") as f:
            json.dump(metrics, f, indent=2)
        return {"wrote": path, "metrics": metrics}


class ContentDraftJob(Job):
    """[REVENUE-ADJACENT] Draft promo copy for YOUR review. Never posts anywhere.

    Rotates through your product's talking points and writes a draft to disk.
    You (or a connected, reviewed pipeline) decide whether to publish it.
    """

    def __init__(self, interval=86400, product="Your Product", link="<your link>",
                 points=None, out_dir="drafts"):
        super().__init__("content_draft", interval)
        self.product = product
        self.link = link
        self.points = points or ["the core benefit", "who it's for", "a clear call to action"]
        self.out_dir = out_dir

    def run(self, ctx):
        point = self.points[ctx["tick"] % len(self.points)]
        draft = f"{self.product} — {point}. Learn more: {self.link}"
        os.makedirs(self.out_dir, exist_ok=True)
        path = os.path.join(self.out_dir, f"draft_{ctx['tick']}.txt")
        with open(path, "w") as f:
            f.write(draft + "\n")
        return {"wrote": path, "preview": draft, "posted": False}


def default_jobs():
    """A demo lineup. interval=0 means 'run every tick' so you can see it work."""
    return [
        HeartbeatJob(interval=0),
        DailyReportJob(interval=0),
        ContentDraftJob(interval=0, product="STARLIGHTMIX Studio",
                        link="https://studio.starlightmix.com"),
    ]
