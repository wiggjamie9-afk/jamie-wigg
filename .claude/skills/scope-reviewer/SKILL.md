---
name: scope-reviewer
version: 1.0.0
description: |
  Automated scope creep detection and prevention. Reviews every code change against
  the plan, flags unplanned work, catches premature optimization, and prevents
  "while we're at it" refactoring. Integrates with Plan Enforcer + Spec Writer
  for end-to-end discipline.
compatibility: claude-code cursor opencode gemini codex
license: MIT
---

# Scope Reviewer — Catch Creep Before Merge

Prevent scope creep before it happens. Every change gets reviewed: Is this on plan? Is this the right time? Is this adding risk?

## Why Scope Reviewer?

### The Scope Creep Pattern

Classic project death:

```
Day 1: Plan a 7-hour feature (Spec: clear, locked)
Day 2: 2 hours in, "we should optimize the user model" (not on plan)
Day 3: Optimization leads to refactoring sessions (4 hours)
Day 4: "While we're at it, fix these old bugs" (not on plan, 2 hours)
Day 5: "Let me add retry logic to the payment flow" (nice-to-have, 3 hours)
Day 6: You ship late, exhausted, missing the original feature
```

### The Solution

**Scope Reviewer** prevents this:

1. **Lock the spec** — What's on plan? What's not?
2. **Review every code change** — Does it align with spec?
3. **Flag deviations immediately** — "This code isn't on spec"
4. **Offer resolutions** — Defer, descope, or defend
5. **Track creep** — See what you added + impact
6. **Sign off clean** — No hidden work in commits

---

## Workflow

### 1. Baseline: Lock the Spec

```bash
/spec-writer init "build OAuth"
# → specs/oauth/tasks.md

/scope-reviewer baseline specs/oauth/tasks.md
# Baseline locked. All future changes reviewed against this.
# 
# On-plan tasks:
# - T1: Create OAuth schema
# - T2: Implement OAuth endpoints
# - T3: Add tests
# - T4: Update docs
#
# Off-plan code will be flagged.
```

### 2. Code Review: Detect Deviations

```bash
# You write code for T1 (OAuth schema)
# But you also refactor the user_model (not on spec)

/scope-reviewer review
#
# Reviewing changes against baseline...
#
# ✓ ON-PLAN:
#   - src/oauth/schema.py (10 new functions, T1)
#   - tests/test_oauth_schema.py (50 assertions, T1)
#
# ⚠️ OFF-PLAN (CREEP):
#   - src/user/model.py (refactored email validation)
#     Lines changed: 45
#     Reasoning: "Better validation for OAuth email check"
#     Plan task: None (not on spec)
#     Risk: Medium (touches auth path)
#
# ⚠️ OFF-PLAN (PREMATURE OPT):
#   - src/oauth/cache.py (new file)
#     Lines changed: 30
#     Reasoning: "Cache OAuth tokens for performance"
#     Plan task: T2 (endpoints, not caching)
#     Risk: Medium (adds complexity, not spec'd)
#
# Resolution options:
# 1. Defer: Add "cache OAuth tokens" as follow-up task
# 2. Descope: Remove changes, focus on T1
# 3. Defend: "This is critical for T2, can't be deferred"
#    (requires architectural justification)
#
# Choose: [defer/descope/defend]
```

### 3. Justified Deviations

If you choose **defend**, you justify:

```bash
/scope-reviewer defend "OAuth caching required for T2"
#
# Defense claim: "OAuth cache needed for performance of T2"
#
# Checking...
# 
# Spec T2 target: "100 auth requests/sec"
# Without cache: ~50 req/sec (50% shortfall)
# With cache: ~150 req/sec (150% surplus)
#
# Verdict: ✓ JUSTIFIED
# Reason: T2's success criteria can't be met without caching.
# Adding as spec'd but embedded (not separate task).
#
# Logged as: Spec Dependency (T1.5 - sub-task of T1)
# Risk: Low (justifiably critical)
```

### 4. Track Creep Impact

```bash
/scope-reviewer status
#
# Spec: OAuth Integration (locked 2026-06-14)
# Original plan: 7 hours
# Current work: 8.5 hours
# Creep: +1.5 hours (+21%)
#
# Changes by type:
# ✓ On-plan: 150 LOC
# ⚠️ Deferred: 45 LOC (user model refactor, caching)
# ⚠️ Justified: 30 LOC (OAuth caching, spec-critical)
# ⚠️ Risky: 0 LOC
#
# Creep breakdown:
# - User model refactor: +0.5h (deferred)
# - OAuth caching: +0.5h (justified, now spec'd)
# - Retry logic: +0.5h (deferred)
#
# If all deferred tasks included: Total = 9.5h (+36% creep)
```

### 5. Pre-Merge Review

```bash
# Ready to merge. Run scope review first.

/scope-reviewer final-check
#
# Final review before merge...
#
# ✓ Spec: OAuth Integration
# ✓ All on-plan tasks complete
# ✓ All deferred tasks logged
# ✓ All justified changes explained
#
# Deferred tasks (will be follow-up PR):
# - User model refactor (estimated 0.5h)
# - Retry logic for Stripe (estimated 1h)
#
# Creep impact: +21% (acceptable range: <30%)
#
# Ready to merge? [yes/no]
```

### 6. Post-Merge: Schedule Deferred Work

```bash
/scope-reviewer deferred-list
#
# Deferred tasks (from OAuth PR):
#
# 1. User model email validation refactor
#    Effort: 0.5h
#    Context: Needed for OAuth email checks
#    Priority: Medium
#
# 2. Retry logic for Stripe OAuth
#    Effort: 1h
#    Context: Improves reliability, not critical
#    Priority: Low
#
# Create follow-up PRs? [yes/no]
```

---

## Commands

| Command | What it does |
|---|---|
| `baseline <spec>` | Lock spec as baseline for scope reviews |
| `review` | Check current changes against spec |
| `defend <justification>` | Justify off-plan changes (must be convincing) |
| `status` | Show creep impact, changes by type, risk level |
| `final-check` | Pre-merge review (all criteria met?) |
| `deferred-list` | List off-plan work, effort, priority |
| `creep-report` | Detailed creep analysis (types, impact, timeline) |
| `risk-assess <change>` | Assess risk of specific change (touches auth? data? performance?) |
| `compare <commit-a> <commit-b>` | Compare creep between two branches |

---

## Creep Categories

### Type 1: Optimization (Premature)

```bash
# Spec: Implement payment flow (simple, MVP)
# You add: caching, connection pooling, batch processing
# 
# Verdict: Defer unless blocking spec success criteria
# Example: If spec requires 100 payments/sec and simple version only does 20, then cache is justified
# Counter-example: If spec requires 10 payments/sec and simple version does 50, cache is premature
```

### Type 2: Refactoring (Unplanned)

```bash
# Spec: Add OAuth
# You refactor: user model, email validation, session handling
# 
# Verdict: Defer unless touching code is broken/unmaintainable
# Example: If existing email validation is broken and blocks OAuth, fix it now
# Counter-example: If email validation "just works", leave it for refactoring task
```

### Type 3: "While We're At It" (Scope Creep)

```bash
# Spec: Build checkout with Stripe
# You add: Apple Pay, Google Pay, PayPal, buy-now-pay-later
# 
# Verdict: Defer (scope creep)
# These are separate features, not in original spec
```

### Type 4: Discovery (Legitimate Blocker)

```bash
# Spec: Implement OAuth (assumed simple)
# You discover: Postgres version incompatible with OAuth library
# 
# Verdict: Not creep, legitimate blocker
# Action: Re-plan with new approach or upgrade
```

---

## Risk Levels

| Risk | Impact | Example |
|---|---|---|
| **Low** | Touches non-critical code, well-tested | Docs update, comment clarification |
| **Medium** | Touches business logic, but isolated | Add cache, optimize query |
| **High** | Touches auth/payment/core paths | Refactor user model, change session handling |
| **Critical** | Major architectural change | Switch database, redesign API |

**Creep rule:** 
- Low risk: OK to keep in current PR
- Medium risk: Defer unless justifiably critical
- High+ risk: Always defer or descope

---

## Integration with Other Skills

### With Spec Writer

```bash
/spec-writer init "build checkout"
# → specs/checkout/tasks.md

/scope-reviewer baseline specs/checkout/tasks.md
# Ready to review against spec
```

### With Plan Enforcer

```bash
/plan-enforcer lock specs/checkout/tasks.md
/plan-enforcer step
# → T1: Create schema

# You write code for T1 + refactor user model (off-plan)

/scope-reviewer review
# ⚠️ User model refactor is off-plan

/plan-enforcer defer "User model refactor"
# Logged as deferred
```

### With Code Review

```bash
# After code changes:
/scope-reviewer review
# Flags creep

# Then run:
/code-review --comment
# Reviews code quality + adherence to plan
```

---

## Example Scenarios

### Scenario 1: Justified Caching

```bash
# Spec: Build API that handles 100 requests/sec
# Plan: T1 schema, T2 endpoints, T3 tests

# You implement T1, T2 normally
# You discover: API does 40 req/sec (not 100)
# Root cause: No caching, hitting DB every time

/scope-reviewer defend "Caching required for 100 req/sec"
# 
# Verdict: ✓ JUSTIFIED
# Adding cache is now part of T2 (not separate task)
# +0.5h effort, acceptable (still on timeline)
```

### Scenario 2: Deferred Refactoring

```bash
# Spec: Add OAuth
# You notice: User model email validation is messy

/scope-reviewer review
# ⚠️ OFF-PLAN: Refactoring user model
# 
# Verdict: Defer
# Reason: Not blocking OAuth; can clean up later

/scope-reviewer defer "Clean up email validation"
# 
# Logged as follow-up task (Medium priority)
```

### Scenario 3: Creep Accumulation

```bash
# Spec: Simple checkout (7h, T1-T4)

# Day 1: Add email verification (off-plan) → defer
# Day 2: Add SMS notifications (off-plan) → defer
# Day 3: Add loyalty points (off-plan) → defer

/scope-reviewer status
# 
# Creep: +3 hours (43% over plan)
# 
# ⚠️ WARNING: Exceeds 30% threshold
# Recommend: Focus on core feature, merge, then deferred tasks in next PR
```

---

## Best Practices

1. **Lock spec first** — Don't review creep without a baseline
2. **Flag early** — Review changes before commit, not after
3. **Justify or defer** — Don't ignore flags; defend or defer
4. **Respect the plan** — Deferred work gets its own task/PR
5. **Track impact** — Know how much creep you're adding
6. **Sign off clean** — Final check before merge

---

## Real-World Example

### Feature: Build Stripe Integration (Checkout)

**Spec locked: 7 hours, 4 tasks**

```
Day 1:
✓ T1: Schema created (1h)
⚠️ While coding, refactor user model (30m, off-plan)
→ /scope-reviewer defer "Clean user model"

Day 2:
✓ T2: API endpoints built (2h)
⚠️ Discover: API does 20 req/sec, need 100
→ /scope-reviewer defend "Add caching for performance"
→ Verdict: ✓ Justified (now part of T2)
→ +0.5h effort (T2 now = 2.5h)

Day 3:
✓ T3: Tests added (2h, 100% coverage)
⚠️ "Let's add retry logic for declined cards" (off-plan)
→ /scope-reviewer defer "Retry logic for card declines"

Day 4:
✓ T4: Docs updated (1h)

Final:
/scope-reviewer final-check
# 
# Original: 7h
# Actual: 7.5h (+0.5h for justified caching)
# Creep: 0% (deferred work doesn't count)
# 
# Deferred (follow-up PR):
# - Clean user model (0.5h)
# - Retry logic (1h)
```

---

## Why It Works

**Without Scope Reviewer:**
- Plan: 7 hours
- Reality: 14 hours (refactoring, optimizing, adding features)
- Result: Late, exhausted, original scope half-done

**With Scope Reviewer:**
- Plan: 7 hours
- Reality: 7.5 hours (justified performance fix)
- Deferred: 1.5 hours (refactoring, retry logic — next sprint)
- Result: On time, clean, prioritized work

---

## License

MIT — See LICENSE in the repo.

---

**Scope Reviewer:** Plan the work, work the plan, ship on time.
