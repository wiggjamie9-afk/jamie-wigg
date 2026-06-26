# auto-runner

A real automation loop that **keeps running after you start it**. It's a small
job scheduler: register jobs with intervals, start it, and it executes them
forever — reporting, drafting content, health checks, whatever you attach.

```bash
python runner.py --once                   # run every job once, print results
python runner.py --ticks 5 --interval 1   # run 5 passes, 1s apart (demo)
python runner.py --serve --interval 3600  # run forever, hourly (real use)
```

4 tests, no dependencies (Python stdlib only). Failures in one job never stop
the loop; state persists to `runs/runner_state.json` so it resumes.

## The honest revenue boundary (read this)

The loop is **real** and runs forever. It does **not, by itself, make money.**

```
money = a product people want  ×  people who see it  ×  a way to pay
        └─ the runner can speed up the middle; it cannot create the ends ─┘
```

Revenue happens only when a job connects a **real product** to **real
customers**. The engine is the lever; your product and audience are the source.
Jobs tagged `[REVENUE-ADJACENT]` (`daily_report`, `content_draft`) ship as
**safe stubs** — they write to disk for your review and touch nothing external.
They never auto-post, auto-email, auto-spend, scrape, or fake activity, because
those lose money and get accounts banned. You connect real value, and you stay
in the loop on anything that reaches a customer.

## Using it for e-commerce / a business strategy

Here is the honest map. The runner automates the **repetitive operations** of a
real store so a solo operator can run it — but each loop only pays off once a
real offer exists behind it.

| Loop (a job you'd add) | What it automates | What YOU must supply |
|---|---|---|
| `daily_report` | pull sales + traffic, email you a summary | a live checkout (Gumroad/Stripe) + analytics keys |
| `content_draft` | draft promo posts on a schedule for review | a product worth talking about + a channel |
| `restock_alert` | warn when inventory/credits run low | a real inventory/source to read |
| `abandoned_followup` | flag carts that didn't convert | a store that captures carts + your written email |
| `review_request` | nudge buyers for a testimonial post-purchase | real customers + their consent |
| `price_experiment` | rotate a price/offer, log which converts | enough live traffic to measure |

**The realistic flywheel** (none of the human parts are optional):

1. **Offer** — you make a product people actually want (human work).
2. **Checkout** — wire a real payment link. *This repo already has one:
   STARLIGHTMIX Studio sells lifetime licenses via Gumroad with an
   auto-delivery Worker.* That's a genuine automated sales loop you already own.
3. **Traffic** — you build at least a small audience (human work; the runner can
   *draft* content but you approve + post until you trust a pipeline).
4. **Automate the middle** — point the runner's jobs at the real data and
   channels so reporting, follow-ups, and content cadence run themselves.
5. **Measure + iterate** — `daily_report` and `price_experiment` tell you what's
   working; you change the offer/copy; repeat.

Steps 1 and 3 are where money is actually won or lost, and no loop can do them
for you. Steps 2, 4, 5 are where this runner genuinely saves you hours every
week — which is real value, just not "money from nothing."

## Running the real STARLIGHTMIX preset

`presets.py` makes `STRATEGY.md` executable for the actual product:

```bash
python runner.py --preset starlightmix --ticks 5 --interval 0   # see it work
python runner.py --preset starlightmix --serve --interval 86400 # daily, for real
```

- **`hook_generator`** drafts a faceless short-form video brief (hook + what to
  show + caption + CTA) rotating through the product's wedge angles, to
  `drafts/`. It never posts — you record the 15s demo and approve the copy.
- **`gumroad_sales`** reports your **real** sales once you set a token:

  ```bash
  export GUMROAD_ACCESS_TOKEN=your_token   # from Gumroad → Settings → Advanced
  python runner.py --preset starlightmix --once
  ```

  With no token it returns `setup-needed` and **invents nothing**.

What the loop does NOT do (your accounts, your hands): deploy the app, publish
the Gumroad product, configure DNS, or record/post the videos.

## Adding your own job

```python
from jobs import Job

class RestockAlert(Job):
    def __init__(self, source):           # source = your real inventory reader
        super().__init__("restock_alert", interval=3600)
        self.source = source
    def run(self, ctx):
        level = self.source()             # YOUR real data
        return {"low": level < 10, "level": level}
```

Register it in `default_jobs()` (or your own list) and the loop runs it forever.
Keep anything that contacts a customer behind your review until you trust it.
