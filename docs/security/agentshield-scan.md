# AgentShield Security Report

**Date:** 2026-06-26T07:27:14.455Z
**Target:** /home/user/jamie-wigg/.claude
**Grade:** D (58/100)

## Summary

| Metric | Value |
|--------|-------|
| Files scanned | 211 |
| Total findings | 439 |
| Critical | 0 |
| High | 201 |
| Medium | 15 |
| Low | 223 |
| Info | 0 |
| Auto-fixable | 0 |

## Skill Health

| Metric | Value |
|--------|-------|
| Skills discovered | 13 |
| Instrumented | 0 |
| Versioned | 0 |
| Rollback-ready | 0 |
| With history | 0 |

## Score Breakdown

| Category | Score |
|----------|-------|
| Secrets | 90/100 |
| Permissions | 0/100 |
| Hooks | 100/100 |
| MCP Servers | 100/100 |
| Agents | 0/100 |

## Findings

### 🟡 Agent has no tools restriction: agents/ab-test-analyzer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/ab-test-analyzer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/abandoned-cart.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/abandoned-cart.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/access-auditor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/access-auditor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/accounts-payable.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/accounts-payable.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/ad-copywriter.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/ad-copywriter.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/ai-policy-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/ai-policy-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/anomaly-detector.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/anomaly-detector.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/api-documentation.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/api-documentation.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/api-tester.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/api-tester.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/audio-producer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/audio-producer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/benefits-advisor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/benefits-advisor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/blockchain-analyst.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/blockchain-analyst.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/book-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/book-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/brand-designer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/brand-designer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/brand-monitor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/brand-monitor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/bug-hunter.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/bug-hunter.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/capacity-planner.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/capacity-planner.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/changelog.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/changelog.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/churn-predictor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/churn-predictor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/churn-prevention.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/churn-prevention.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/client-manager.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/client-manager.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/clinical-notes.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/clinical-notes.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/code-reviewer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/code-reviewer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/cold-outreach.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/cold-outreach.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/commercial-re.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/commercial-re.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/community-manager.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/community-manager.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/compensation-benchmarker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/compensation-benchmarker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/competitor-pricing.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/competitor-pricing.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/competitor-watch.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/competitor-watch.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/compliance-checker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/compliance-checker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/content-repurposer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/content-repurposer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/contract-reviewer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/contract-reviewer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/copy-trader.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/copy-trader.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/copywriter.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/copywriter.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/cost-optimizer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/cost-optimizer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/curriculum-designer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/curriculum-designer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Encoded payload or decode instruction detected

- **Severity:** high
- **Category:** injection
- **File:** `agents/curriculum-designer.md:14`
- **Description:** Found "backward design principles" — Reversed text instruction — evasion technique to hide commands from pattern matching. Encoding is used to evade pattern-based detection of malicious instructions.
- **Evidence:** `backward design principles`

### 🟡 Agent has no tools restriction: agents/customer-support.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/customer-support.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/daily-planner.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/daily-planner.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/daily-standup.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/daily-standup.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/dashboard-builder.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/dashboard-builder.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/data-cleaner.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/data-cleaner.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/data-entry.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/data-entry.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/deal-forecaster.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/deal-forecaster.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/dependency-scanner.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/dependency-scanner.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/deploy-guardian.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/deploy-guardian.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/discord-business.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/discord-business.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/docs-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/docs-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Environment probing instruction detected

- **Severity:** high
- **Category:** injection
- **File:** `agents/docs-writer.md:113`
- **Description:** Found "Find users" — Instructs agent to enumerate system resources — attack surface mapping. System enumeration is often the first stage of an attack chain.
- **Evidence:** `Find users`

### 🟡 Agent has no tools restriction: agents/dropshipping-researcher.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/dropshipping-researcher.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/echo.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/echo.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/ecommerce-dev.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/ecommerce-dev.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/email-sequence.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/email-sequence.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/erp-admin.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/erp-admin.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/essay-grader.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/essay-grader.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/etl-pipeline.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/etl-pipeline.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/exit-interview.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/exit-interview.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/expense-tracker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/expense-tracker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/family-coordinator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/family-coordinator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/feature-request.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/feature-request.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/financial-forecaster.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/financial-forecaster.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/fitness-coach.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/fitness-coach.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/flashcard-generator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/flashcard-generator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/flight-scraper.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/flight-scraper.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/focus-timer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/focus-timer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/fraud-detector.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/fraud-detector.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/game-designer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/game-designer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/gdpr-auditor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/gdpr-auditor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/geo-agent.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/geo-agent.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/github-issue-triager.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/github-issue-triager.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/github-pr-reviewer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/github-pr-reviewer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/growth-agent.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/growth-agent.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/habit-tracker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/habit-tracker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/hackernews-agent.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/hackernews-agent.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/home-automation.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/home-automation.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/inbox-zero.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/inbox-zero.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/incident-logger.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/incident-logger.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/incident-responder.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/incident-responder.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/influencer-finder.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/influencer-finder.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/infra-monitor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/infra-monitor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/instagram-reels-creator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/instagram-reels-creator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/interview-bot.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/interview-bot.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/inventory-forecaster.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/inventory-forecaster.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/inventory-tracker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/inventory-tracker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/invoice-manager.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/invoice-manager.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/invoice-tracker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/invoice-tracker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/job-applicant.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/job-applicant.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/journal-prompter.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/journal-prompter.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/language-tutor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/language-tutor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/lead-gen.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/lead-gen.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/lead-qualifier.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/lead-qualifier.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/legal-brief-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/legal-brief-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/linkedin-content.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/linkedin-content.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/listing-scout.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/listing-scout.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/localization.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/localization.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/log-analyzer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/log-analyzer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/market-analyzer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/market-analyzer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/meal-planner.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/meal-planner.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/medication-checker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/medication-checker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/meeting-notes.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/meeting-notes.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/meeting-scheduler.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/meeting-scheduler.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/meeting-transcriber.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/meeting-transcriber.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/metrics.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/metrics.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/migration-helper.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/migration-helper.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/morning-briefing.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/morning-briefing.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/multi-account-social.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/multi-account-social.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/multimedia-content-pipeline.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/multimedia-content-pipeline.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/music-producer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/music-producer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/nda-generator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/nda-generator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/negotiation-agent.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/negotiation-agent.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/news-curator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/news-curator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/newsletter.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/newsletter.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/notion-organizer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/notion-organizer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/nps-followup.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/nps-followup.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/objection-handler.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/objection-handler.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/onboarding-flow.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/onboarding-flow.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/onboarding-guide.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/onboarding-guide.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/onboarding.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/onboarding.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/orion.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/orion.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/overnight-coder.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/overnight-coder.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Encoded payload or decode instruction detected

- **Severity:** high
- **Category:** injection
- **File:** `agents/overnight-coder.md:72`
- **Description:** Found "backward compatibility rather than breaking it" — Reversed text instruction — evasion technique to hide commands from pattern matching. Encoding is used to evade pattern-based detection of malicious instructions.
- **Evidence:** `backward compatibility rather than breaking it`

### 🟡 Agent has no tools restriction: agents/patent-analyzer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/patent-analyzer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/patient-intake.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/patient-intake.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/performance-reviewer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/performance-reviewer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/personal-crm.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/personal-crm.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/phishing-detector.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/phishing-detector.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/phone-receptionist.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/phone-receptionist.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/podcast-producer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/podcast-producer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/policy-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/policy-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/portfolio-rebalancer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/portfolio-rebalancer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/pr-merger.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/pr-merger.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/price-monitor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/price-monitor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/pricing-optimizer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/pricing-optimizer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/product-lister.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/product-lister.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/product-scrum.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/product-scrum.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/proofreader.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/proofreader.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/property-video.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/property-video.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/proposal-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/proposal-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/qa-tester.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/qa-tester.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/quiz-maker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/quiz-maker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/radar.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/radar.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/raspberry-pi.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/raspberry-pi.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/reading-digest.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/reading-digest.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/recruiter.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/recruiter.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Encoded payload or decode instruction detected

- **Severity:** high
- **Category:** injection
- **File:** `agents/recruiter.md:85`
- **Description:** Found "backward compatibility thinking

" — Reversed text instruction — evasion technique to hide commands from pattern matching. Encoding is used to evade pattern-based detection of malicious instructions.
- **Evidence:** `backward compatibility thinking

`

### 🟡 Agent has no tools restriction: agents/reddit-scout.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/reddit-scout.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/release-notes.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/release-notes.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/report-generator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/report-generator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/research-assistant.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/research-assistant.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/resume-optimizer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/resume-optimizer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/resume-screener.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/resume-screener.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/revenue-analyst.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/revenue-analyst.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/review-responder.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/review-responder.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/risk-assessor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/risk-assessor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/route-optimizer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/route-optimizer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/runbook-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/runbook-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/sales-assistant.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/sales-assistant.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/schema-designer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/schema-designer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/scout.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/scout.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/script-builder.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/script-builder.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/sdr-outbound.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/sdr-outbound.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/security-hardener.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/security-hardener.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/self-healing-server.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/self-healing-server.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/seo-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/seo-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/short-form-video.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/short-form-video.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/sla-monitor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/sla-monitor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/soc2-preparer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/soc2-preparer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/social-media.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/social-media.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/sql-assistant.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/sql-assistant.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/storyboard-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/storyboard-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/study-planner.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/study-planner.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Encoded payload or decode instruction detected

- **Severity:** high
- **Category:** injection
- **File:** `agents/study-planner.md:19`
- **Description:** Found "Backward planning from exam dates and deadlines to daily tasks
" — Reversed text instruction — evasion technique to hide commands from pattern matching. Encoding is used to evade pattern-based detection of malicious instructions.
- **Evidence:** `Backward planning from exam dates and deadlines to daily tasks
`

### 🟡 Agent has no tools restriction: agents/survey-analyzer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/survey-analyzer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/symptom-triage.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/symptom-triage.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/tax-preparer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/tax-preparer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/telemarketer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/telemarketer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/test-writer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/test-writer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/threat-monitor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/threat-monitor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/thumbnail-designer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/thumbnail-designer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/tiktok-repurposer.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/tiktok-repurposer.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/tiktok-video-creator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/tiktok-video-creator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/time-tracker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/time-tracker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/trading-bot.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/trading-bot.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/transcription.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/transcription.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/travel-planner.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/travel-planner.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/tutor.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/tutor.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/ugc-video.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/ugc-video.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/upwork-proposal.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/upwork-proposal.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/usage-analytics.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/usage-analytics.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/ux-researcher.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/ux-researcher.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/vendor-evaluator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/vendor-evaluator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/video-ad-creator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/video-ad-creator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/video-scripter.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/video-scripter.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/voicemail-transcriber.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/voicemail-transcriber.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/vuln-scanner.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/vuln-scanner.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/wellness-coach.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/wellness-coach.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/whatsapp-business.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/whatsapp-business.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/workout-tracker.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/workout-tracker.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/x-twitter-growth.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/x-twitter-growth.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/youtube-seo.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/youtube-seo.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🟡 Agent has no tools restriction: agents/youtube-shorts-creator.md

- **Severity:** high
- **Category:** agents
- **File:** `agents/youtube-shorts-creator.md`
- **Description:** This agent definition is structured but does not specify an explicit tools array. Without a tools list, it may inherit all available tools by default, including Bash, Write, and Edit. Always specify the minimum set of tools needed.
- **Fix:** Add an explicit tools array to the frontmatter

### 🔵 No PreToolUse security hooks configured

- **Severity:** medium
- **Category:** misconfiguration
- **File:** `settings.json`
- **Description:** No PreToolUse hooks are defined. These hooks can catch dangerous operations before they run, providing an essential security layer.
- **Fix:** Add PreToolUse hooks for security-sensitive operations

### 🔵 Agent definition effective size is 5149 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/ai-policy-writer.md`
- **Description:** The agent definition at agents/ai-policy-writer.md has an effective size of 5149 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `5149 effective characters (5765 raw)`

### 🔵 Agent processes external content: agents/gdpr-auditor.md

- **Severity:** medium
- **Category:** agents
- **File:** `agents/gdpr-auditor.md`
- **Description:** This agent appears to process external or user-provided content. Ensure prompt injection defenses are in place: validate inputs, use system prompts to anchor behavior, and never trust content from external sources.

### 🔵 Agent definition effective size is 6609 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/legal-brief-writer.md`
- **Description:** The agent definition at agents/legal-brief-writer.md has an effective size of 6609 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `6609 effective characters (6678 raw)`

### 🔵 Agent definition effective size is 5231 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/linkedin-content.md`
- **Description:** The agent definition at agents/linkedin-content.md has an effective size of 5231 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `5231 effective characters (5608 raw)`

### 🔵 Hardcoded internal IP with port: 10.0.1.42:6379

- **Severity:** medium
- **Category:** secrets
- **File:** `agents/log-analyzer.md:70`
- **Description:** Found "10.0.1.42:6379" — Class A private IP (10.x.x.x) with port. Hardcoded internal IPs expose network topology and service locations. Use environment variables or DNS names instead.
- **Evidence:** `10.0.1.42:6379`
- **Fix:** Replace with environment variable or DNS name

### 🔵 Agent definition effective size is 7121 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/nda-generator.md`
- **Description:** The agent definition at agents/nda-generator.md has an effective size of 7121 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `7121 effective characters (7494 raw)`

### 🔵 Agent definition effective size is 5956 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/performance-reviewer.md`
- **Description:** The agent definition at agents/performance-reviewer.md has an effective size of 5956 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `5956 effective characters (5986 raw)`

### 🔵 Agent definition effective size is 5753 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/podcast-producer.md`
- **Description:** The agent definition at agents/podcast-producer.md has an effective size of 5753 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `5753 effective characters (6149 raw)`

### 🔵 Agent definition effective size is 5752 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/policy-writer.md`
- **Description:** The agent definition at agents/policy-writer.md has an effective size of 5752 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `5752 effective characters (5787 raw)`

### 🔵 Hardcoded internal IP with port: 192.168.1.100:18789

- **Severity:** medium
- **Category:** secrets
- **File:** `agents/security-hardener.md:73`
- **Description:** Found "192.168.1.100:18789" — Class C private IP (192.168.x.x) with port. Hardcoded internal IPs expose network topology and service locations. Use environment variables or DNS names instead.
- **Evidence:** `192.168.1.100:18789`
- **Fix:** Replace with environment variable or DNS name

### 🔵 Agent definition effective size is 5317 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/ux-researcher.md`
- **Description:** The agent definition at agents/ux-researcher.md has an effective size of 5317 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `5317 effective characters (6399 raw)`

### 🔵 Agent definition effective size is 6915 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/video-scripter.md`
- **Description:** The agent definition at agents/video-scripter.md has an effective size of 6915 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `6915 effective characters (6965 raw)`

### 🔵 Agent definition effective size is 5547 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/x-twitter-growth.md`
- **Description:** The agent definition at agents/x-twitter-growth.md has an effective size of 5547 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `5547 effective characters (5991 raw)`

### 🔵 Agent definition effective size is 6289 characters (>5000 threshold)

- **Severity:** medium
- **Category:** agents
- **File:** `agents/youtube-seo.md`
- **Description:** The agent definition at agents/youtube-seo.md has an effective size of 6289 characters after discounting fenced code blocks and markdown tables. Unusually large agent definitions may contain hidden malicious instructions buried in legitimate-looking text. Review the full content carefully, especially any instructions near the end of the file.
- **Evidence:** `6289 effective characters (7103 raw)`

### ⚪ No Stop hooks for session-end verification

- **Severity:** low
- **Category:** misconfiguration
- **File:** `settings.json`
- **Description:** Hooks are configured but no Stop hooks exist. Stop hooks run when a session ends and are useful for final verification — checking for uncommitted secrets, ensuring console.log statements were removed, or auditing file changes.
- **Fix:** Add a Stop hook for session-end checks

### ⚪ Agent has no model specified: agents/ab-test-analyzer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/ab-test-analyzer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/abandoned-cart.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/abandoned-cart.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/access-auditor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/access-auditor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/accounts-payable.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/accounts-payable.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/ad-copywriter.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/ad-copywriter.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/ai-policy-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/ai-policy-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/anomaly-detector.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/anomaly-detector.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/api-documentation.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/api-documentation.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/api-tester.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/api-tester.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/audio-producer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/audio-producer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/benefits-advisor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/benefits-advisor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/blockchain-analyst.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/blockchain-analyst.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/book-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/book-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/brand-designer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/brand-designer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/brand-monitor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/brand-monitor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/bug-hunter.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/bug-hunter.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/capacity-planner.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/capacity-planner.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/changelog.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/changelog.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/churn-predictor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/churn-predictor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/churn-prevention.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/churn-prevention.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/client-manager.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/client-manager.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/clinical-notes.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/clinical-notes.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/code-reviewer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/code-reviewer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/cold-outreach.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/cold-outreach.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/commercial-re.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/commercial-re.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/community-manager.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/community-manager.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/compensation-benchmarker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/compensation-benchmarker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/competitor-pricing.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/competitor-pricing.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/competitor-watch.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/competitor-watch.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/compliance-checker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/compliance-checker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/content-repurposer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/content-repurposer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/contract-reviewer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/contract-reviewer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/copy-trader.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/copy-trader.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/copywriter.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/copywriter.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/cost-optimizer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/cost-optimizer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/curriculum-designer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/curriculum-designer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/customer-support.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/customer-support.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/daily-planner.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/daily-planner.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/daily-standup.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/daily-standup.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/dashboard-builder.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/dashboard-builder.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/data-cleaner.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/data-cleaner.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/data-entry.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/data-entry.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/deal-forecaster.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/deal-forecaster.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/dependency-scanner.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/dependency-scanner.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/deploy-guardian.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/deploy-guardian.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/discord-business.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/discord-business.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/docs-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/docs-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/dropshipping-researcher.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/dropshipping-researcher.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/echo.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/echo.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/ecommerce-dev.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/ecommerce-dev.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/email-sequence.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/email-sequence.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/erp-admin.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/erp-admin.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/essay-grader.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/essay-grader.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/etl-pipeline.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/etl-pipeline.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/exit-interview.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/exit-interview.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/expense-tracker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/expense-tracker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/family-coordinator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/family-coordinator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/feature-request.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/feature-request.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/financial-forecaster.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/financial-forecaster.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/fitness-coach.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/fitness-coach.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/flashcard-generator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/flashcard-generator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/flight-scraper.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/flight-scraper.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/focus-timer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/focus-timer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/fraud-detector.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/fraud-detector.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/game-designer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/game-designer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/gdpr-auditor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/gdpr-auditor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/geo-agent.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/geo-agent.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/github-issue-triager.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/github-issue-triager.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/github-pr-reviewer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/github-pr-reviewer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/growth-agent.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/growth-agent.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/habit-tracker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/habit-tracker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/hackernews-agent.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/hackernews-agent.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/home-automation.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/home-automation.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/inbox-zero.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/inbox-zero.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/incident-logger.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/incident-logger.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/incident-responder.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/incident-responder.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/influencer-finder.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/influencer-finder.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/infra-monitor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/infra-monitor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/instagram-reels-creator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/instagram-reels-creator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/interview-bot.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/interview-bot.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/inventory-forecaster.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/inventory-forecaster.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/inventory-tracker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/inventory-tracker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/invoice-manager.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/invoice-manager.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/invoice-tracker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/invoice-tracker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/job-applicant.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/job-applicant.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/journal-prompter.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/journal-prompter.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/language-tutor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/language-tutor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/lead-gen.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/lead-gen.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/lead-qualifier.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/lead-qualifier.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/legal-brief-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/legal-brief-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/linkedin-content.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/linkedin-content.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/listing-scout.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/listing-scout.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/localization.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/localization.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/log-analyzer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/log-analyzer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/market-analyzer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/market-analyzer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/meal-planner.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/meal-planner.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/medication-checker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/medication-checker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/meeting-notes.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/meeting-notes.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/meeting-scheduler.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/meeting-scheduler.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/meeting-transcriber.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/meeting-transcriber.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/metrics.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/metrics.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/migration-helper.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/migration-helper.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/morning-briefing.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/morning-briefing.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/multi-account-social.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/multi-account-social.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/multimedia-content-pipeline.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/multimedia-content-pipeline.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/music-producer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/music-producer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/nda-generator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/nda-generator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/negotiation-agent.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/negotiation-agent.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/news-curator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/news-curator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/newsletter.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/newsletter.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/notion-organizer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/notion-organizer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/nps-followup.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/nps-followup.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/objection-handler.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/objection-handler.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/onboarding-flow.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/onboarding-flow.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/onboarding-guide.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/onboarding-guide.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/onboarding.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/onboarding.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/orion.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/orion.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/overnight-coder.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/overnight-coder.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/patent-analyzer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/patent-analyzer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/patient-intake.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/patient-intake.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/performance-reviewer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/performance-reviewer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/personal-crm.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/personal-crm.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/phishing-detector.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/phishing-detector.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/phone-receptionist.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/phone-receptionist.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/podcast-producer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/podcast-producer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/policy-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/policy-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/portfolio-rebalancer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/portfolio-rebalancer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/pr-merger.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/pr-merger.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/price-monitor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/price-monitor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/pricing-optimizer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/pricing-optimizer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/product-lister.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/product-lister.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/product-scrum.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/product-scrum.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/proofreader.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/proofreader.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/property-video.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/property-video.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/proposal-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/proposal-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/qa-tester.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/qa-tester.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/quiz-maker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/quiz-maker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/radar.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/radar.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/raspberry-pi.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/raspberry-pi.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/reading-digest.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/reading-digest.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/recruiter.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/recruiter.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/reddit-scout.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/reddit-scout.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/release-notes.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/release-notes.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/report-generator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/report-generator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/research-assistant.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/research-assistant.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/resume-optimizer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/resume-optimizer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/resume-screener.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/resume-screener.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/revenue-analyst.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/revenue-analyst.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/review-responder.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/review-responder.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/risk-assessor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/risk-assessor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/route-optimizer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/route-optimizer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/runbook-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/runbook-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/sales-assistant.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/sales-assistant.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/schema-designer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/schema-designer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/scout.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/scout.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/script-builder.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/script-builder.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/sdr-outbound.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/sdr-outbound.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/security-hardener.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/security-hardener.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/self-healing-server.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/self-healing-server.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/seo-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/seo-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/short-form-video.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/short-form-video.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/sla-monitor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/sla-monitor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/soc2-preparer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/soc2-preparer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/social-media.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/social-media.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/sql-assistant.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/sql-assistant.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/storyboard-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/storyboard-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/study-planner.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/study-planner.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/survey-analyzer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/survey-analyzer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/symptom-triage.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/symptom-triage.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/tax-preparer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/tax-preparer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/telemarketer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/telemarketer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/test-writer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/test-writer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/threat-monitor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/threat-monitor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/thumbnail-designer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/thumbnail-designer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/tiktok-repurposer.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/tiktok-repurposer.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/tiktok-video-creator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/tiktok-video-creator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/time-tracker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/time-tracker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/trading-bot.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/trading-bot.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/transcription.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/transcription.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/travel-planner.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/travel-planner.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/tutor.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/tutor.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/ugc-video.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/ugc-video.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/upwork-proposal.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/upwork-proposal.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/usage-analytics.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/usage-analytics.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/ux-researcher.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/ux-researcher.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/vendor-evaluator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/vendor-evaluator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/video-ad-creator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/video-ad-creator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/video-scripter.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/video-scripter.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/voicemail-transcriber.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/voicemail-transcriber.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/vuln-scanner.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/vuln-scanner.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/wellness-coach.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/wellness-coach.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/whatsapp-business.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/whatsapp-business.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/workout-tracker.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/workout-tracker.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/x-twitter-growth.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/x-twitter-growth.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/youtube-seo.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/youtube-seo.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Agent has no model specified: agents/youtube-shorts-creator.md

- **Severity:** low
- **Category:** misconfiguration
- **File:** `agents/youtube-shorts-creator.md`
- **Description:** No model is specified in the agent frontmatter. This will use the default model, which may be more expensive than needed. Specify 'haiku' for lightweight tasks.

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/album-launch.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "album-launch" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/album-launch.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "album-launch" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/dream.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "dream" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/dream.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "dream" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/rhythmix-new.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "rhythmix-new" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/rhythmix-new.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "rhythmix-new" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/rhythmix-site.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "rhythmix-site" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/rhythmix-site.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "rhythmix-site" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/rhythmix-spec.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "rhythmix-spec" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/rhythmix-spec.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "rhythmix-spec" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-build.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-build" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-build.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-build" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-design.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-design" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-design.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-design" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-sitemap.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-sitemap" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-sitemap.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-sitemap" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-styleguide.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-styleguide" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-styleguide.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-styleguide" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-wireframe.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-wireframe" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/site-wireframe.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "site-wireframe" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/spec-analyze.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "spec-analyze" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/spec-analyze.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "spec-analyze" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/spec-quick.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "spec-quick" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/spec-quick.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "spec-quick" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

### ⚪ Example config: Skill is missing observation hooks and feedback hooks

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/spec-run.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "spec-run" does not define observation hooks and feedback hooks in SKILL.md. ECC 2.0 self-improving skills need explicit observe/feedback hooks so runs can be inspected and amended safely.
- **Evidence:** `observation hooks and feedback hooks`

### ⚪ Example config: Skill is missing version metadata and rollback metadata

- **Severity:** low
- **Category:** skills
- **Runtime Confidence:** docs/example
- **File:** `commands/spec-run.md`
- **Description:** This finding comes from docs or sample configuration in the repository. It indicates risky guidance or example defaults, not confirmed active runtime exposure. The skill "spec-run" does not define version metadata and rollback metadata. Self-amending skills need explicit version and rollback markers so regressions can be evaluated and reversed.
- **Evidence:** `version metadata and rollback metadata`

