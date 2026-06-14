---
name: plan-enforcer
version: 1.0.0
description: |
  Enforce explicit plan execution. Ensures every action follows the written plan
  without deviation. Verifies each step, flags deviations, and prevents scope creep
  mid-execution. Essential for keeping complex multi-step projects on track.
compatibility: claude-code cursor opencode gemini codex
license: MIT
---

# Plan Enforcer — Explicit Execution Without Deviation

Lock in a plan and execute it step-by-step with zero deviation. No mid-execution scope creep, no "let me just add this", no forgetting what you were building.

## Why Plan Enforcer?

### The Problem

Without explicit plan enforcement:
- Mid-execution you "optimize" and end up refactoring unrelated code
- A small improvement request becomes a 3-hour rabbit hole
- You finish the main task but forgot a critical step
- Merge conflicts because someone changed direction mid-branch

### The Solution

**Plan Enforcer** makes execution bulletproof:

1. **Write the plan once** — Use `/spec-quick` or `/spec-run` to generate a detailed plan
2. **Lock it in** — `/plan-enforcer lock <plan-file>` — this is your contract
3. **Execute step-by-step** — `/plan-enforcer step` — next action only
4. **Verify each step** — Automatic verification against plan before moving forward
5. **Flag deviations** — Any attempt to deviate raises a blocker with reasoning
6. **Sign off** — `/plan-enforcer complete` — verifies all steps executed, all goals met

---

## Workflow

### 1. Lock the Plan

```bash
/spec-quick "build OAuth integration for my-api"
# Generates: specs/oauth-integration/{requirements,design,tasks}.md

/plan-enforcer lock specs/oauth-integration/tasks.md
# Locked. No changes to plan until /unlock is called.
# Task list becomes the execution contract.
```

**Locked plan includes:**
- Task list (T1, T2, T3, … with stable IDs)
- Dependencies (which tasks must finish before others)
- Success criteria (how you know T1 is "done")
- Estimated effort (for reality-checking)

### 2. Execute Step-by-Step

```bash
/plan-enforcer step
# Returns:
# - Next task (T1: "Create OAuth schema in Postgres")
# - Dependencies (none — it's first)
# - Success criteria ("PostgreSQL migration creates oauth_tokens table")
# - Blockers (none)
# - Time estimate (2 hours)

# You do the work
# ... (write migration, test, commit)

/plan-enforcer verify T1
# Checks:
# - Did you create the migration? ✓
# - Does it create oauth_tokens? ✓
# - Did you test it? ✓
# - Ready for next step.
```

### 3. Flag Deviations

If you try to do something not on the plan:

```bash
# You want to refactor the user model (not on plan)
/plan-enforcer verify T1
# ⚠️ DEVIATION: You're modifying user_model.py
# This is not in task T1 (OAuth schema). 
# 
# Current plan path: Create schema → Implement endpoints → Add tests
#
# Options:
# 1. /plan-enforcer defer "user model refactor" 
#    (adds as follow-up task after OAuth is done)
# 2. /plan-enforcer unlock (breaks the contract — requires reasoning)
# 3. Ignore this check and proceed (logged as violation)

/plan-enforcer defer "user model refactor"
# Noted. Will be a follow-up task after OAuth complete.
# Continue with T1? [yes/no]
```

### 4. Track Progress

```bash
/plan-enforcer status
# 
# Plan: OAuth Integration
# Locked: 2026-06-14 17:30 UTC
# Current: Task T2 "Implement OAuth endpoints"
#
# Progress:
# ✓ T1: Create OAuth schema (2h, completed)
# → T2: Implement OAuth endpoints (3h, in progress for 45m)
# ○ T3: Add OAuth tests (2h, blocked on T2)
# ○ T4: Update docs (1h, blocked on T3)
#
# Deviations: 0
# Deferred: 1 (user model refactor)
# Time remaining: ~5 hours (original estimate 7h, 2h spent)
```

### 5. Complete & Sign Off

```bash
/plan-enforcer complete
#
# Verifying all tasks completed...
# ✓ T1: Create OAuth schema — PASS
# ✓ T2: Implement OAuth endpoints — PASS
# ✓ T3: Add OAuth tests — PASS (100% coverage)
# ✓ T4: Update docs — PASS
#
# All criteria met. Zero deviations. Ready to merge.
#
# Deferred tasks: 1
# /plan-enforcer defer-list
#   - user model refactor
#
# Sign off? [yes/no]
```

---

## Commands

| Command | What it does |
|---|---|
| `lock <plan>` | Lock a plan file; no changes allowed until `/unlock` |
| `step` | Get next task in plan |
| `verify <task-id>` | Verify task is complete (checks success criteria) |
| `status` | Show progress, deviations, time remaining |
| `defer <description>` | Defer a deviation as a follow-up task |
| `defer-list` | List all deferred tasks |
| `complete` | Verify all tasks done, sign off |
| `unlock` | Break the contract (requires reasoning for why) |
| `deviate-log` | Show all deviations + resolutions |
| `revert <task-id>` | Undo a task (move back one step) |
| `extend <task-id> <time>` | Extend time estimate for a task |

---

## Plan Format

Plan Enforcer works with standard `/spec-quick` output:

```markdown
# OAuth Integration

## Tasks

### T1: Create OAuth Schema
- **Effort:** 2h
- **Dependencies:** None
- **Success Criteria:**
  - PostgreSQL migration creates `oauth_tokens` table
  - Fields: id, user_id, provider, access_token, refresh_token, expires_at, created_at
  - Unique index on (user_id, provider)
- **Acceptance:**
  - Migration runs without errors
  - Tests pass: `pytest tests/test_oauth_schema.py -v`
  - No linting errors: `ruff check src/oauth`

### T2: Implement OAuth Endpoints
- **Effort:** 3h
- **Dependencies:** T1
- **Success Criteria:**
  - POST /auth/oauth/authorize → returns provider URL
  - POST /auth/oauth/callback → creates session
  - GET /auth/oauth/status → returns provider + email
- **Acceptance:**
  - All endpoints return 200 / 401 as expected
  - Tests: `pytest tests/test_oauth_endpoints.py -v`
  - No type errors: `mypy src/oauth`

### T3: Add OAuth Tests
- **Effort:** 2h
- **Dependencies:** T2
- **Success Criteria:**
  - 100% test coverage: `oauth_endpoints.py`, `oauth_schema.py`
  - All integration tests pass
- **Acceptance:**
  - Coverage report: `pytest --cov=src/oauth`
  - All tests green

### T4: Update Docs
- **Effort:** 1h
- **Dependencies:** T3
- **Success Criteria:**
  - docs/oauth.md includes: setup, endpoints, examples, error handling
- **Acceptance:**
  - Docs render without errors
  - All code examples tested
```

---

## Integration with Other Skills

### With `/spec-quick`

```bash
/spec-quick "build OAuth integration"
# Generates specs/oauth-integration/tasks.md

/plan-enforcer lock specs/oauth-integration/tasks.md
# Ready to enforce
```

### With `/spec-run`

```bash
/spec-run oauth-integration
# Runs all tasks in parallel agents

/plan-enforcer status
# Shows which agents are working on which tasks
```

### With `/code-review`

```bash
# After completing all tasks:
/plan-enforcer complete
# All tasks verified

# Then run review:
/code-review --comment
# Review against plan objectives
```

---

## Deviation Handling

### Types of Deviations

| Type | Example | Resolution |
|---|---|---|
| **Scope creep** | Refactoring user model (not in plan) | Defer as follow-up |
| **Optimization** | "Let me make this 10% faster" (not T-critical) | Defer as follow-up |
| **Discovery** | "This approach won't work, need different strategy" | `/plan-enforcer revert` + replan |
| **Emergency** | "Security patch needed immediately" | `/plan-enforcer unlock` + new plan |

### Example: Handle a Blocker

```bash
/plan-enforcer step
# T2: Implement OAuth endpoints

# You discover: Postgres version doesn't support latest OAuth library
/plan-enforcer blocker "Postgres 16 incompatible with oauth-lib 2.0"

# Plan Enforcer pauses execution:
# Suggestion: Revert T1, upgrade Postgres, re-plan T1-T4
# Or: Use oauth-lib 1.9 (older but compatible)

# Resolution:
/plan-enforcer revert T1
# Back to step 0

/spec-quick "rebuild OAuth with oauth-lib 1.9"
# New plan generated

/plan-enforcer lock specs/oauth-integration-v2/tasks.md
```

---

## Best Practices

1. **Lock early** — Don't start a task without a locked plan
2. **Step-by-step** — Use `/plan-enforcer step` for next action, not just "go build it"
3. **Defer, don't ignore** — Good ideas that aren't on plan should be deferred, not skipped
4. **Verify each step** — Don't skip verification; it catches issues early
5. **Time estimates** — Be honest about effort; helps catch derails
6. **Sign off** — Requires explicit completion, not just "I think I'm done"

---

## Real-World Example

### Scenario: Build a Webhook Integration

```bash
# Day 1: Lock the plan
/spec-quick "add Stripe webhook integration"
/plan-enforcer lock specs/stripe-webhook/tasks.md

# Day 2: Execute
/plan-enforcer step  # T1: Create webhook table
# ... write migration, test
/plan-enforcer verify T1  # ✓

/plan-enforcer step  # T2: Implement webhook receiver
# ... write endpoint, test
# Temptation: "Let me add retry logic" (not on plan)
/plan-enforcer defer "Add exponential backoff retries"
/plan-enforcer verify T2  # ✓

# Day 3: Continue
/plan-enforcer step  # T3: Add signature verification
# ... write verification, test
/plan-enforcer verify T3  # ✓

/plan-enforcer step  # T4: Update docs
# ... write docs
/plan-enforcer verify T4  # ✓

# Day 4: Sign off
/plan-enforcer complete
# All tasks verified. Ready to merge.
# Deferred: 1 task (retries) — schedule for next sprint
```

---

## Why It Works

**Without Plan Enforcer:**
- You intend to build OAuth in 7 hours
- Mid-way, you optimize the user schema
- That leads to refactoring sessions
- 14 hours later you're done, exhausted, and forgot to add tests

**With Plan Enforcer:**
- Lock: 7-hour plan with specific tasks + success criteria
- Step 1-4: Execute each task, verify, move forward
- Temptations deferred (good ideas, wrong time)
- 8 hours later: All tasks done, tested, documented, ready to merge
- Deferred work scheduled for next sprint

---

## License

MIT — See LICENSE in the repo.

---

**Plan Enforcer:** Build it once, build it right.
