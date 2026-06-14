---
name: spec-writer
version: 1.0.0
description: |
  Write better specs that prevent ambiguity, scope creep, and rework. Structured
  specification generation with requirements, design, and tasks. Includes ambiguity
  detection, clarity scoring, and cross-file consistency checks. Essential for
  planning complex features before building.
compatibility: claude-code cursor opencode gemini codex
license: MIT
---

# Spec Writer — Structure & Clarity for Better Plans

Write specs that prevent misunderstandings. No vague requirements, no hidden scope, no "we should have discussed this first."

## Why Spec Writer?

### The Problem with Bad Specs

Bad spec = bad execution:
- "Build a checkout flow" (what does checkout include? payments? shipping? discounts?)
- Ambiguous success criteria ("works well" vs. "processes 100 transactions/sec in <500ms")
- Hidden dependencies (Database changes, third-party APIs, other teams)
- Rework (3 days in, you realize the scope was wrong)

### The Solution

**Spec Writer** forces clarity:

1. **Structured sections** — Requirements, design, tasks (not free-form rambling)
2. **Ambiguity detection** — Finds vague language ("works well", "fast", "simple")
3. **Clarity scoring** — 0-100: how clear is this spec? (target: 85+)
4. **Dependency mapping** — What else needs to happen first?
5. **Effort estimation** — Realistic time-boxing per task
6. **Acceptance criteria** — Concrete, testable, not subjective

---

## Workflow

### 1. Generate Initial Spec

```bash
/spec-writer init "build checkout flow with payments"
# 
# Questions:
# 1. Who uses this? (customers, admin, both?)
# 2. What payment processors? (Stripe? PayPal? Crypto?)
# 3. What currencies? (USD only? Multi-currency?)
# 4. Shipping? (Physical goods, downloads, both?)
# 5. Success metric? (Transaction time? Success rate? Cost?)
# 6. MVP or full-featured?
#
# Answer each, then:
```

### 2. Structured Output

```markdown
# Checkout Flow Specification

## Requirements

**Functional (what it does):**
- R1: Customer can enter payment details (card, PayPal, Apple Pay)
- R2: Customer can enter shipping address (with validation)
- R3: System applies coupon codes (15% off, flat $5 off)
- R4: System calculates tax (based on address, item type)
- R5: Customer reviews order before confirming
- R6: Payment processed via Stripe (Stripe::Charge)
- R7: Order confirmation sent via email

**Non-Functional (how well it does it):**
- NFR1: Page load <2 sec (Core Web Vitals: LCP <2.5s, CLS <0.1)
- NFR2: Checkout process <3 minutes (customer perception)
- NFR3: Payment success rate >99.5% (Stripe + fallback)
- NFR4: PCI-DSS compliant (no CC storage in DB)
- NFR5: Works on mobile + desktop (responsive)

**Constraints:**
- C1: Stripe API rate limit: 100 req/sec
- C2: Tax calculation: use TaxJar (3rd party)
- C3: Shipping: use EasyPost (3rd party)
- C4: Database: PostgreSQL 16 (existing)

## Design

**Happy Path (normal flow):**
```
Customer → Enter Cart
         → Shipping Address (validate)
         → Payment Method (validate)
         → Apply Coupon (if exists)
         → Confirm Order
         → Submit to Stripe
         → Receive Confirmation
         → Email sent
```

**Unhappy Paths:**
```
Invalid Address → Show error, ask again
Invalid Card → Show error (Stripe decline codes), suggest alternative
Coupon expired → Show error, allow continue without
Tax calculation fails → Use default tax rate, log alert
Email fails → Log, don't block checkout (async queue)
```

**Technology:**
- Frontend: React (existing)
- Backend: FastAPI (Python, existing)
- Payments: Stripe API (Charges endpoint)
- Tax: TaxJar API
- Shipping: EasyPost API
- Database: PostgreSQL (orders table)

**Database Schema Changes:**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  status ENUM ('pending', 'paid', 'fulfilled', 'cancelled'),
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  shipping DECIMAL(10,2),
  discount DECIMAL(10,2),
  total DECIMAL(10,2),
  stripe_charge_id VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id BIGINT REFERENCES products(id),
  quantity INT,
  price DECIMAL(10,2),
  created_at TIMESTAMP
);

CREATE TABLE checkout_sessions (
  id UUID PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  cart_id UUID REFERENCES carts(id),
  status ENUM ('started', 'address_entered', 'payment_entered', 'confirmed'),
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);
```

## Tasks

### T1: Create Order Database Schema
- **Effort:** 1h
- **Dependencies:** None
- **Success Criteria:**
  - PostgreSQL migrations create tables above
  - Migrations are reversible
- **Acceptance:**
  - `pytest tests/test_order_schema.py -v` passes
  - `alembic upgrade head` succeeds
  - `alembic downgrade -1` succeeds

### T2: Build Checkout API Endpoint
- **Effort:** 3h
- **Dependencies:** T1
- **Success Criteria:**
  - POST /checkout/session → creates session, returns session_id
  - POST /checkout/address → validates, stores shipping_address
  - POST /checkout/payment → validates payment method
  - GET /checkout/session/{id} → returns current state
- **Acceptance:**
  - All endpoints return 200 / 400 / 500 as appropriate
  - `pytest tests/test_checkout_api.py -v` passes
  - Input validation: SQLAlchemy models + Pydantic

### T3: Integrate Stripe Payment Processing
- **Effort:** 2h
- **Dependencies:** T2
- **Success Criteria:**
  - POST /checkout/confirm → calls Stripe Charge endpoint
  - Handles Stripe errors (declined, rate limit, network)
  - Stores stripe_charge_id in order table
  - Sends confirmation email (async)
- **Acceptance:**
  - `pytest tests/test_stripe_integration.py -v` passes
  - Stripe webhook verification enabled
  - Error handling: retry logic for rate limits

### T4: Build Checkout React UI
- **Effort:** 4h
- **Dependencies:** T2
- **Success Criteria:**
  - Form: shipping address input + validation
  - Form: payment method selection (card, PayPal, Apple Pay)
  - Form: coupon code input + validation
  - Review screen: order summary before submission
  - Success screen: confirmation + order number
- **Acceptance:**
  - Component tests: `npm run test` passes
  - Mobile responsive: 375px (iPhone) + 1920px (desktop)
  - Accessibility: a11y score >90 (axe)

### T5: Add Coupon & Tax Calculation
- **Effort:** 2h
- **Dependencies:** T2
- **Success Criteria:**
  - POST /checkout/coupon/{code} → applies discount, returns new total
  - Coupon validation: code exists, not expired, user eligible
  - Tax calculation: TaxJar API call based on address + items
  - Discount applied before tax calculation
- **Acceptance:**
  - `pytest tests/test_coupons.py -v` passes
  - `pytest tests/test_tax_calculation.py -v` passes
  - TaxJar API mocked in tests

### T6: Add Email Confirmation
- **Effort:** 1h
- **Dependencies:** T3
- **Success Criteria:**
  - Order confirmation email sent asynchronously (RQ job)
  - Email includes: order items, total, tracking link
  - Failed email: logged, doesn't block checkout
- **Acceptance:**
  - `pytest tests/test_email_queue.py -v` passes
  - Email template renders without errors
  - Async job completes within 30 seconds

### T7: Add Tests & Documentation
- **Effort:** 2h
- **Dependencies:** T6
- **Success Criteria:**
  - 100% code coverage: checkout module
  - Integration tests: full happy path
  - docs/checkout.md: API reference + examples
- **Acceptance:**
  - Coverage: `pytest --cov=src/checkout` ≥100%
  - Docs render without errors
  - Examples tested (runnable)

## Acceptance Criteria (Spec Level)

**Feature is done when:**
- [ ] All 7 tasks complete
- [ ] Happy path works end-to-end (customer → payment → confirmation)
- [ ] Error paths handled (invalid address, card declined, etc.)
- [ ] Page load <2sec, checkout <3min
- [ ] 100% test coverage
- [ ] Deployed to staging, QA sign-off
```

### 3. Ambiguity Detection

```bash
/spec-writer ambiguity
# 
# Checking for vague language...
#
# ⚠️ AMBIGUOUS (Clarity: 42%):
# - "Should work fast" → Suggest: "Load <2sec (Core Web Vitals: LCP <2.5s)"
# - "Handle errors gracefully" → Suggest: "Log all errors, show user-friendly message"
# - "Customers can pay easily" → Suggest: "Payment success rate >99.5%"
# - "Works on mobile" → Suggest: "Responsive design (375px-1920px), touch-friendly"
#
# Suggestions applied? [yes/no]
```

### 4. Clarity Scoring

```bash
/spec-writer clarity
#
# Clarity Score: 87/100 (Good)
#
# Strong:
# ✓ All requirements have success criteria
# ✓ All tasks have effort estimates
# ✓ All tasks have acceptance tests
#
# Improvements:
# ○ T4 (UI): Add accessibility criteria (a11y target: 90+)
# ○ T3 (Stripe): Specify retry logic for rate limits
# ○ Design: Add error state diagrams
#
# Apply suggestions? [yes/no]
```

### 5. Dependency Mapping

```bash
/spec-writer dependencies
#
# Task Graph:
#
#   T1 (Schema)
#    ↓
#   T2 (API) ←─── T3 (Stripe)
#    ↓              ↓
#   T4 (UI)      T6 (Email)
#    ↓
#   T5 (Coupons & Tax)
#    ↓
#   T7 (Tests & Docs)
#
# Critical Path: T1 → T2 → T4 → T5 → T7 (13h)
# Parallel: T3, T6 (can start once T2 done)
# Total Effort: 15h (1h buffer)
#
# Deploy blocker: All tests green (T7)
```

### 6. Cross-Check with Existing Code

```bash
/spec-writer cross-check my-api
#
# Checking against existing my-api...
#
# ✓ Database: PostgreSQL 16 (confirmed)
# ✓ Framework: FastAPI (confirmed)
# ✓ Patterns: Pydantic models (confirmed)
# ✓ Testing: pytest (confirmed)
#
# ⚠️ API Endpoint Naming:
# Your spec: POST /checkout/session, POST /checkout/address
# Existing: POST /api/v1/{resource} pattern
# Suggestion: POST /api/v1/checkout/sessions (plural)
#
# ⚠️ Email Queue:
# Your spec: RQ for async email
# Existing: RQ for background jobs (confirmed, consistent)
#
# Apply naming fixes? [yes/no]
```

---

## Commands

| Command | What it does |
|---|---|
| `init <description>` | Start spec wizard with questions |
| `ambiguity` | Find vague language, suggest improvements |
| `clarity` | Score clarity 0-100, suggest fixes |
| `dependencies` | Map task dependencies, find critical path |
| `cross-check <project>` | Check against existing project conventions |
| `estimate` | Estimate total effort + effort per task |
| `validate` | Check all required sections present |
| `export <format>` | Export spec as Markdown, JSON, PDF |
| `compare <spec-a> <spec-b>` | Compare two specs (scope, effort, dependencies) |
| `lint` | Check formatting, broken links, missing info |

---

## Spec Structure (Standard)

Every spec from Spec Writer includes:

```
# Feature Name

## Requirements
- Functional (R1, R2, R3, ...)
- Non-Functional (NFR1, NFR2, ...)
- Constraints (C1, C2, ...)

## Design
- Happy Path diagram
- Error Paths
- Technology choices (with justification)
- Schema changes (SQL)
- API changes

## Tasks
- T1, T2, ... (with effort, dependencies, acceptance criteria)

## Acceptance Criteria
- Feature-level checklist (not task-level)
```

---

## Best Practices

1. **Start with questions** — `/spec-writer init` asks clarifying questions, not free-form
2. **Aim for clarity >85** — Use ambiguity detection to fix vague language
3. **Explicit dependencies** — Don't assume; map them visually
4. **Realistic estimates** — Include testing, docs, rework buffer
5. **Testable criteria** — "Works well" is not acceptance; "handles 1000 orders/day with <2sec" is
6. **Cross-check early** — Verify against existing project conventions before building

---

## Example: Good Spec vs. Bad Spec

### ❌ Bad Spec

```
Feature: Add user profiles

Description: Users should be able to create and edit their profiles with all relevant information.

Tasks:
- Create profile table
- Add profile API
- Add UI for profiles
- Test everything

Timeline: 1 week
```

**Problems:**
- What is "relevant information"? (phone, bio, avatar, social links?)
- "Edit their profiles" — who can edit? (user only, admin, moderators?)
- "Add UI for profiles" — what pages? (create, edit, view, list?)
- "Test everything" — unit, integration, or e2e?
- Clarity score: 25/100

### ✅ Good Spec

```
# User Profiles

## Requirements

**Functional:**
- R1: User can create profile with: email, full_name, bio (200 chars), avatar (JPG/PNG, <5MB)
- R2: User can edit their own profile (name, bio, avatar)
- R3: User can view their own profile
- R4: Admin can view any user's profile
- R5: Admin can disable a profile (soft delete)

**Non-Functional:**
- NFR1: Avatar upload <5 sec
- NFR2: Profile page load <1 sec
- NFR3: Avatar resize to 200x200 (thumbnail), 500x500 (full)

## Tasks

### T1: Create Profile Schema
- Effort: 1h
- Acceptance: PostgreSQL migration passes; columns: user_id, full_name, bio, avatar_path, created_at, updated_at

### T2: Add Profile API
- Effort: 2h
- Dependencies: T1
- Acceptance: POST /api/v1/profiles, GET /api/v1/profiles/{id}, PUT /api/v1/profiles/{id} all working

### T3: Add Avatar Upload & Resize
- Effort: 2h
- Dependencies: T2
- Acceptance: Avatar uploaded, stored, resized, served via CDN

### T4: Build Profile UI
- Effort: 3h
- Dependencies: T2
- Acceptance: Create page, edit page, view page all working on mobile + desktop

### T5: Add Tests
- Effort: 2h
- Dependencies: T4
- Acceptance: 100% code coverage; all paths tested

## Acceptance Criteria

- [ ] All 5 tasks complete
- [ ] User can create + edit + view profile
- [ ] Admin can view any profile
- [ ] Avatar upload working
- [ ] 100% test coverage
- [ ] Deployed to staging
```

**Clarity score: 92/100**

---

## Integration with Plan Enforcer

```bash
/spec-writer init "build checkout"
# Generates: specs/checkout/{requirements,design,tasks}.md

/spec-writer clarity
# Clarity: 87/100 → improve to 90+

/spec-writer validate
# ✓ All required sections present
# ✓ All tasks have effort + acceptance criteria

/plan-enforcer lock specs/checkout/tasks.md
# Now execute the spec step-by-step
```

---

## License

MIT — See LICENSE in the repo.

---

**Spec Writer:** Clear specs, clear code, clear outcomes.
