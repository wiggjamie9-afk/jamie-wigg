# SKILLS-GTM — Go-To-Market Prompt Library

A role-specific prompt library for running a full cold-to-close revenue motion.
Every file is a reference of copy-paste **starting points** — calibrated by
persona, trigger, and seniority — not fill-in-the-blank templates. The point is
to give a rep (or an AI agent acting as one) a strong first draft they edit with
real context, never to send raw.

## How it's organised

```
skills-gtm/
├── roles/                      # prompts by who's running the play
│   ├── sdr-bdr/                #   top-of-funnel: outbound, signals, objections, follow-up
│   ├── account-executive/      #   mid-funnel: discovery, demo, ROI, close
│   ├── sales-manager/          #   pipeline review, rep coaching, forecasting
│   ├── revops/                 #   CRM hygiene, attribution, territory design
│   ├── customer-success/       #   QBRs, expansion, churn risk
│   └── founder/                #   founder-led outbound, board materials
├── industries/                 # the same motion, re-tuned per vertical
│   ├── saas.md  fintech.md  healthcare.md
│   ├── manufacturing.md  professional-services.md  ecommerce.md
├── methodologies/              # named frameworks applied to concrete prompts
│   ├── meddpicc.md  spin-selling.md  challenger-sale.md
│   ├── gap-selling.md  value-selling.md  sandler.md
└── workflows/                  # end-to-end playbooks that chain the above
    ├── cold-to-close.md  discovery-mastery.md  demo-to-proposal.md
    ├── qbr-excellence.md  competitive-displacement.md
```

## How to read a prompt entry

Every prompt in `roles/`, `industries/`, and `methodologies/` follows the same shape:

```
## Prompt 01 — <name>
**Role:**          who runs it
**Trigger:**       the signal or moment that prompts it
**Structure:**     the skeleton (e.g. Signal observation > pain bridge > ask)
**Example output:** a realistic, specific draft
**Why it works:**  the reasoning, not just the copy
**Word count:**    a real length constraint
**Avg. score:**    a rough quality band for self-grading
```

`workflows/` files are different: they sequence stages (owner, goal, exit
criteria, which role files to pull from) into a single motion, ending with the
common failure modes for that play.

## How to use it

1. **Pick your entry point.** Know your role? Start in `roles/`. Selling into a
   specific vertical? Layer in the matching `industries/` file. Running a named
   process? Open the `methodologies/` file. Want the whole motion? Start with
   `workflows/cold-to-close.md`.
2. **Take the starting point, then make it real.** Swap `[Company]`/`[Name]`
   placeholders, anchor on a *verified* signal, and cut anything generic.
3. **Self-score against the band.** If your edited draft would land below the
   prompt's `Avg. score` range, it's not ready to send.
4. **Chain across folders.** A workflow stage will tell you which role and
   methodology files to draw from — follow the cross-references.

## Conventions

- **Markdown only** — every file is plain `.md`, safe to grep, diff, and paste.
- **Starting points, never templates** — if a draft reads like it could go to
  anyone, it's wrong. Calibrate to one buyer.
- **Signals must be verifiable** — outbound prompts lead on facts a prospect
  can't dispute (a real job change, a real hire, a real funding round).
- **Add, don't overwrite** — new plays get a new `## Prompt NN` block or a new
  file; keep existing numbering stable so cross-references hold.
