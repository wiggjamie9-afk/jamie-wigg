"""Ready-to-run job preset for a real product: STARLIGHTMIX Studio.

This makes STRATEGY.md executable. Two real jobs:

- HookGeneratorJob: drafts genuine short-form marketing hooks from the product's
  wedge (the angles from STRATEGY.md §2), one per run, to disk for YOUR review.
  It never posts anywhere.
- GumroadSalesJob: reports your ACTUAL Gumroad sales — but only once you set the
  GUMROAD_ACCESS_TOKEN environment variable. With no token it returns a clear
  setup message and invents nothing.

Honest boundary: this drives the operational cadence. You still record the demo,
approve the copy, and own the Gumroad/deploy accounts.
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request

from jobs import HeartbeatJob, Job

WEDGE = {
    "product": "STARLIGHTMIX Studio",
    "price": "$149 lifetime",
    "link": "https://wiggjamie.gumroad.com/l/rhythmix-studio",
    "promise": ("Own your AI music-video studio — one payment, your own compute, "
                "your files never leave your device."),
    # (angle name, hook template) — the wedge angles from STRATEGY.md
    "angles": [
        ("anti-subscription",
         "Tired of monthly AI-video fees? {product} is {price}. Pay once, own it forever."),
        ("own-compute",
         "Most AI video tools mark up GPU costs. {product} runs on YOUR Replicate key — "
         "you pay cost, not margin."),
        ("privacy",
         "Your tracks and plans never touch our servers — {product} renders on your "
         "device. {price}."),
        ("demo",
         "Watch a raw track become a finished music video in {product}. No timeline, "
         "no editing. {price}."),
        ("who-for",
         "For creators who want their own studio, not another subscription. "
         "{product}, {price}."),
    ],
}


class HookGeneratorJob(Job):
    """[REVENUE-ADJACENT] Draft a faceless short-form video hook. Never posts."""

    def __init__(self, interval=86400, wedge=WEDGE, out_dir="drafts"):
        super().__init__("hook_generator", interval)
        self.wedge = wedge
        self.out_dir = out_dir

    def run(self, ctx):
        angles = self.wedge["angles"]
        name, template = angles[ctx["tick"] % len(angles)]
        hook = template.format(product=self.wedge["product"], price=self.wedge["price"])
        block = (
            f"ANGLE: {name}\n"
            f"HOOK (first 2 seconds, on screen + said): {hook}\n"
            f"SHOW: 15s screen-capture — a raw track becoming a finished music video\n"
            f"CAPTION: {hook}\n"
            f"CTA: {self.wedge['price']} — {self.wedge['link']}\n"
        )
        os.makedirs(self.out_dir, exist_ok=True)
        path = os.path.join(self.out_dir, f"hook_{ctx['tick']}_{name}.txt")
        with open(path, "w") as f:
            f.write(block)
        return {"angle": name, "hook": hook, "wrote": path, "posted": False}


class GumroadSalesJob(Job):
    """[REVENUE-ADJACENT] Report real Gumroad sales (needs GUMROAD_ACCESS_TOKEN)."""

    def __init__(self, interval=86400, out_dir="reports"):
        super().__init__("gumroad_sales", interval)
        self.out_dir = out_dir

    def run(self, ctx):
        token = os.environ.get("GUMROAD_ACCESS_TOKEN")
        if not token:
            return {"status": "setup-needed",
                    "message": "set GUMROAD_ACCESS_TOKEN to pull real sales — no data invented"}
        try:
            data = self._parse(self._fetch(token))
        except Exception as exc:  # network/credential failure — never fabricate
            return {"status": "error", "message": str(exc)}
        os.makedirs(self.out_dir, exist_ok=True)
        path = os.path.join(self.out_dir, f"sales_{ctx['tick']}.json")
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
        return {"status": "ok", "sales": data["count"],
                "revenue_usd": data["revenue_usd"], "wrote": path}

    @staticmethod
    def _fetch(token):
        url = "https://api.gumroad.com/v2/sales?" + urllib.parse.urlencode(
            {"access_token": token})
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.load(resp)

    @staticmethod
    def _parse(payload):
        sales = payload.get("sales", []) if isinstance(payload, dict) else []
        revenue = sum(int(s.get("price", 0)) for s in sales) / 100.0
        return {
            "count": len(sales),
            "revenue_usd": round(revenue, 2),
            "recent": [
                {"product": s.get("product_name"),
                 "price_usd": int(s.get("price", 0)) / 100.0,
                 "at": s.get("created_at")}
                for s in sales[:10]
            ],
        }


def starlightmix_jobs():
    return [HeartbeatJob(interval=0), HookGeneratorJob(interval=0), GumroadSalesJob(interval=0)]


# Codex of Reality — note: every angle is honest HRV-biofeedback framing.
# No "Tesla 3-6-9", no "Schumann lock", no "reality has a frequency" claims.
CODEX_WEDGE = {
    "product": "Codex of Reality",
    "price": "AU$30 lifetime",
    "link": "https://wiggjamie.gumroad.com/l/codex-of-reality",
    "promise": ("An HRV biofeedback studio for your phone — read your heart-rate "
                "variability with the camera and use guided breathing to steady it."),
    "angles": [
        ("see-it",
         "Your phone camera can read your heart-rate variability live. Watch your "
         "nervous system settle in real time. {product}, {price}."),
        ("anti-subscription",
         "A biofeedback studio you own — not another monthly wellness app. "
         "{product}, {price}."),
        ("breath",
         "90 seconds of guided breathing, and you can watch your coherence climb. "
         "{product}."),
        ("no-hardware",
         "No chest strap, no wearable — just your phone camera and your breath. "
         "{product}, {price}."),
        ("who-for",
         "For people who want to actually see their calm, not just count steps. "
         "{product}, {price}."),
    ],
}


def codex_jobs():
    return [
        HeartbeatJob(interval=0),
        HookGeneratorJob(interval=0, wedge=CODEX_WEDGE),
        GumroadSalesJob(interval=0),
    ]
