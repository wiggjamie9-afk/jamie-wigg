# Scheduled Agent Loops: The Five-Step Pattern

Design pattern for building repeatable AI agent workflows that run on a schedule, gather their own context, reason autonomously, take guarded actions, and maintain state for the next run. Shift from one-shot prompting to hands-off outcomes.

Core insight: **Schedule, Context, Decide, Act, Verify** — five steps wired together so the agent runs itself.

## Why Loops Matter

**Prompt (one-shot):**
- You type a question
- Agent answers
- You move on
- Repeat tomorrow manually

**Loop (scheduled):**
- Timer fires (7am, every hour)
- Agent wakes, gathers fresh data
- Reasons about the outcome
- Takes actions through tools (with guardrails)
- Records what it did
- Sleeps until next trigger
- You don't type the same prompt again

**Leverage shift**: Not "what's the answer to my question?" but "here's an outcome I want daily, run it for me."

## Five-Step Anatomy

### 1. Schedule the Trigger

Wakes the loop on an interval. Options:

| Tool | Setup | Use Case |
|---|---|---|
| **Cron** | `0 7 * * *` (7am daily) | Simple, local, Unix-native |
| **n8n schedule trigger** | UI time picker, recurrence | No-code, cloud-based, integrations |
| **Claude Code scheduled task** | Python `schedule` library or GitHub Actions | Lightweight, works in the codebase |
| **AWS EventBridge** | Cron expression, Lambda target | Enterprise, high reliability |
| **Zapier** | Scheduled task + webhook | Integrations, approval flows |

### 2. Load the Outcome

Tell the agent what "done" looks like, not "be helpful."

**Bad**: "Analyze my inbox." (Vague, unbounded.)

**Good**: "Find my 10 highest-priority follow-ups and draft a concise next step for each." (Specific, measurable, scoped.)

Define:
- What data does it need?
- What tools can it call?
- When is it done? (5 drafts, all approved, error < 3%)
- What's the output format? (JSON, email, Slack message, CRM update)

### 3. Pull Context

Fetch only relevant data. Too much context = noise. Too little = hallucinations.

**Example: Morning sales loop**
```
Load:
├─ Last 24h CRM changes (new leads, status updates)
├─ Email replies from yesterday (by account)
├─ Call transcripts from last 3 days (if any)
├─ Account health scores (at-risk, growing, stable)
├─ Message templates (pre-approved email drafts)
└─ Salesperson's calendar (if available)

Exclude:
├─ Full email history (too noisy)
├─ All past CRM records (context explosion)
├─ Unrelated department data (other teams' emails)
└─ Raw system logs (irrelevant)
```

**Data sources**:
- CRM API (Salesforce, Pipedrive, HubSpot)
- Email service (Gmail API, Outlook)
- Transcription service (Otter, Google Recorder)
- Internal docs (Notion, Confluence)
- Structured data (CSV, JSON, database query)

Load as JSON. Keep schema consistent so the agent knows what fields to expect.

### 4. Decide and Act

The agent loop (iterate until done or stop condition):

1. **Reason** — Agent reads context, considers the outcome, plans sub-tasks
2. **Call tools** — Agent invokes tools (draft email, query CRM, fetch docs)
3. **Observe results** — Tool results come back
4. **Iterate or finish** — Loop again if more work, or return final answer

**Guardrails**:
- Restrict which tools the agent can call (e.g., read-only vs. write)
- Cap iterations (max 5 loops, then return best effort)
- Validate parameters before tool execution (e.g., email recipients, amounts)
- Reject suspicious patterns (e.g., draft to unlisted contacts)

**Example iteration**:
```
Agent: "I need to check account XYZ's history to prioritize this follow-up."
Tool call: get_account_history(account_id="XYZ")
Result: [last contact 3d ago, high urgency signal, $50k at-risk deal]
Agent: "This is high priority. Drafting escalation email..."
Tool call: draft_email(template="urgent_follow_up", recipient="sarah@...")
Result: Draft ready
Agent: "Done. Returning drafts for approval."
```

### 5. Verify and Record

Gates check the output before anything happens in the real world.

**Checks**:
- Policy validation: Does the output match compliance rules?
- Hallucination detection: Are all facts grounded in the context?
- Risky action routing: Require human approval for send/write/spend
- Format validation: Is the output valid JSON / email / whatever?

**Routing**:
- ✅ Low-risk (draft email) → queue for send
- ⚠️ Medium-risk (CRM update) → require human approval
- 🚫 High-risk (bulk delete, external transfer) → block and alert

**Record**:
```json
{
  "run_id": "2024-06-17T07:00:00Z",
  "outcome": "draft_follow_ups",
  "status": "success",
  "count": 10,
  "approved": 8,
  "pending_review": 2,
  "errors": [],
  "next_context": {
    "last_approved_id": "drafts_2024-06-17",
    "approved_count": 8,
    "pending_ids": ["draft_2", "draft_5"]
  }
}
```

Next run reads the log and picks up from there. Prevents duplicates, enables stateful loops.

## Three Ways to Build One

### 1. Claude Code Scheduled Tasks

**Best for**: Simple, transparent workflows tied to the codebase.

**Setup**:
```python
# schedules/morning-sales-loop.py
import schedule
import time
from pathlib import Path

def run_loop():
    # Load outcome
    outcome = "Find 10 highest-priority follow-ups, draft next steps"
    
    # Pull context
    crm_changes = load_crm_changes(hours=24)
    emails = load_recent_emails(hours=24)
    
    # Decide and act
    result = call_claude_with_context(
        system="You are a sales agent...",
        context={"crm": crm_changes, "emails": emails},
        outcome=outcome,
    )
    
    # Verify and record
    verified = verify_drafts(result)
    log_run(verified)
    
    # Return for approval
    return verified

schedule.every().day.at("07:00").do(run_loop)

while True:
    schedule.run_pending()
    time.sleep(60)
```

**Trigger**: Run as a cron job or GitHub Action.

**Pros**: Lives in the codebase, version-controlled, integrates with Claude Code skills.
**Cons**: Requires infrastructure (scheduler runner), monitoring setup.

### 2. n8n Schedule Trigger + AI Agent Node

**Best for**: No-code, cloud-based, integrations with 9000+ services.

**Workflow**:
```
Schedule trigger (7am daily)
  ↓
Fetch CRM (Pipedrive/Salesforce node)
  ↓
Fetch Emails (Gmail node)
  ↓
AI Agent node (Claude with tools)
  ↓
Condition: Check for risky actions
  ├─ Yes → Send to approval (Slack, Email)
  ├─ No → Execute action (update CRM, send email)
  ↓
Log to database
```

**Setup**:
1. Create new workflow in n8n
2. Add Schedule trigger, set recurrence (daily, weekly, custom cron)
3. Add data-fetch nodes (CRM, email, docs)
4. Add AI Agent node, attach tools (draft, update, send)
5. Add Condition node to route by risk level
6. Add approval node (human-in-loop)
7. Add execution nodes (send, update, record)
8. Test, enable, monitor

**Pros**: Visual, no code, built-in integrations, approval flows, cloud-hosted.
**Cons**: n8n subscription, less flexibility than code.

### 3. Cron + Agent Service

**Best for**: Maximum control, scalability, custom logic.

**Architecture**:
```
Cron trigger → HTTP POST to /run-loop
  ↓
Agent service (Node.js, Python, Go)
  ├─ Load outcome from config
  ├─ Fetch context from APIs
  ├─ Call LLM with tools
  ├─ Execute approved actions
  ├─ Iterate until done
  ├─ Validate & record
  └─ Return status (200 = success, 429 = backoff, etc.)
```

**Code sketch** (Node.js + Express):
```typescript
import Anthropic from "@anthropic-ai/sdk";
import express from "express";

const app = express();
const client = new Anthropic();

app.post("/run-loop", async (req, res) => {
  try {
    const outcome = "draft_follow_ups";
    const context = await loadContext();
    
    const result = await runAgentLoop(outcome, context);
    
    const verified = await verify(result);
    await logRun(verified);
    
    res.json({ status: "success", result: verified });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

async function runAgentLoop(outcome, context) {
  const messages = [
    {
      role: "user",
      content: `Outcome: ${outcome}\n\nContext: ${JSON.stringify(context)}`,
    },
  ];
  
  let iterations = 0;
  const maxIterations = 5;
  
  while (iterations < maxIterations) {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      system: "You are a sales agent...",
      tools: [
        { name: "draft_email", ... },
        { name: "get_account_history", ... },
      ],
      messages,
    });
    
    if (response.stop_reason === "end_turn") {
      return response.content;
    }
    
    // Execute tool calls, collect results
    const toolResults = [];
    for (const block of response.content) {
      if (block.type === "tool_use") {
        const result = await executeTool(block.name, block.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }
    }
    
    // Feed results back
    messages.push({ role: "assistant", content: response.content });
    messages.push({ role: "user", content: toolResults });
    
    iterations++;
  }
  
  throw new Error("Max iterations reached");
}

app.listen(3000, () => console.log("Agent service running on :3000"));
```

**Trigger via cron**:
```bash
0 7 * * * curl -X POST http://localhost:3000/run-loop
```

**Pros**: Full control, scalable, custom tools, stateful.
**Cons**: More setup, ops burden, error handling.

## Best Practices That Actually Matter

### 1. Define 'Done' First

Before you write a single prompt, answer: What does success look like?

✅ **Good**:
- "Generate 5 draft follow-up emails for high-priority leads (score > 80)"
- "Flag accounts at risk of churn (no contact in 14d + health < 50)"
- "Summarize the top 3 action items from yesterday's call transcripts"

❌ **Bad**:
- "Analyze my CRM"
- "Be helpful"
- "Do something with my emails"

### 2. Feed It the Right Context, Not All of It

Too much context = hallucinations, longer latency, higher cost.

**Rule**: Load enough signal to make the decision, not everything in the database.

**CRM loop**: Last 24h changes, top 5 accounts by deal size, recent interactions.
**Email loop**: Last 50 emails from priority senders, not all 10,000.
**Call summary loop**: Last 3 transcripts, not 6 months.

### 3. Add Guardrails

Restrict, validate, cap.

```python
# Tools the agent CAN use
ALLOWED_TOOLS = [
  "draft_email",
  "get_account_history",
  "get_call_transcript",
  "list_follow_ups"
]

# Tools it CANNOT use
BLOCKED_TOOLS = [
  "delete_record",
  "mass_email",
  "change_permissions",
  "transfer_funds"
]

# Validation before tool execution
def execute_tool(name, params):
  if name not in ALLOWED_TOOLS:
    raise PermissionError(f"Tool {name} not allowed")
  
  # Validate parameter ranges
  if name == "send_email":
    if not is_valid_email(params["to"]):
      raise ValueError("Invalid recipient")
    if len(params["to"]) > 10:
      raise ValueError("Max 10 recipients per email")
  
  return run_tool(name, params)

# Cap iterations
MAX_ITERATIONS = 5
for i in range(MAX_ITERATIONS):
  # ...
  if stop_condition_met():
    break
else:
  # Timeout: return best effort
  return partial_result
```

### 4. Keep a Human in the Loop for Risky Steps

Not everything needs approval, but money/compliance/external sends do.

**Auto-approve** (low-risk):
- Draft emails
- Internal status summaries
- Flag lists (read-only)

**Require approval** (medium-risk):
- Send external email
- Update CRM record
- Schedule meeting

**Block and alert** (high-risk):
- Delete records
- Bulk operations
- Access sensitive data

Implement as a simple routing rule:
```python
def route_by_risk(result):
  risk = calculate_risk(result)
  
  if risk == "low":
    execute(result)
  elif risk == "medium":
    send_for_approval(result)  # Slack, email, etc.
  elif risk == "high":
    block_and_alert(result)
```

### 5. Start Small

One narrow workflow, one tool set, one success metric.

**Week 1**: Draft follow-ups (read-only, no sends).
**Week 2**: Approve + send drafts (human-in-loop).
**Week 3**: Auto-send low-risk drafts, approve others.
**Month 2**: Add second outcome (flag at-risk accounts).

Expand only after you can measure it's reliable (< 5% errors, < 2 hours latency).

## Worked Example: Morning Sales Loop

**Goal**: Every morning at 7am, identify the 10 highest-priority follow-ups and draft a next step for each.

**Schedule**: `0 7 * * *` (every day at 7am)

**Load context**:
```json
{
  "crm_changes": [
    {
      "account": "Acme Corp",
      "field": "last_contact",
      "value": "2024-06-16",
      "days_ago": 1
    },
    ...
  ],
  "email_replies": [
    {
      "from": "sarah@acme.com",
      "subject": "RE: contract questions",
      "body": "Can we discuss pricing next week?",
      "timestamp": "2024-06-16T14:30:00Z"
    },
    ...
  ],
  "call_transcripts": [
    {
      "account": "Acme Corp",
      "duration": "23m",
      "key_points": ["budget approved", "pilot in Q3"],
      "timestamp": "2024-06-16T10:00:00Z"
    },
    ...
  ],
  "account_health": [
    {
      "account": "Acme Corp",
      "health_score": 95,
      "deal_stage": "negotiation",
      "deal_size": "$500k"
    },
    ...
  ]
}
```

**Prompt to agent**:
```
You are a sales operations agent. Your outcome is to identify the 10 highest-priority follow-ups from the context below and draft a concise next step for each.

Prioritize by:
1. Recency of last contact + deal size (higher is more urgent)
2. Open questions or action items from transcripts/emails
3. Account health score (at-risk > growing > stable)

For each follow-up, draft a 2–3 sentence email using the provided templates. Return a JSON array of objects:
[
  {
    "account": "Acme Corp",
    "priority": 1,
    "reason": "High-value deal, awaiting pricing response",
    "draft_email": "Hi Sarah, ...",
    "template_used": "urgent_follow_up"
  },
  ...
]

You can call these tools:
- get_account_history(account_id)
- get_message_template(template_name)
- draft_email(...)

Stop when you have 10 drafts or when you've exhausted high-priority leads.
```

**Agent's iteration**:
1. Reads context, identifies top candidates
2. Calls `get_account_history("acme_corp")` for more detail
3. Calls `get_message_template("urgent_follow_up")` to format consistently
4. Drafts 10 emails
5. Returns JSON array

**Verify**:
```python
def verify_sales_loop_output(result):
  checks = {
    "count": len(result) == 10,
    "has_drafts": all("draft_email" in r for r in result),
    "no_invented_emails": all(is_real_email(r["from"]) for r in result),
    "no_risky_claims": not any("guarantee" in r["draft_email"].lower() for r in result),
  }
  
  if all(checks.values()):
    return {"status": "approved", "result": result}
  else:
    return {"status": "review_needed", "result": result, "failed_checks": checks}
```

**Route**:
- If approved → queue emails for send (human reviews queue once)
- If review_needed → send to Slack for sales ops to check

**Log**:
```json
{
  "run_id": "2024-06-17T07:00:00Z",
  "outcome": "morning_sales_loop",
  "status": "success",
  "drafts": 10,
  "approved": 10,
  "sent": 8,
  "pending_review": 2,
  "next_context": {
    "last_run": "2024-06-17T07:00:00Z",
    "sent_count": 8,
    "pending_ids": ["draft_2", "draft_5"]
  }
}
```

**Next day**: Loop wakes at 7am again, reads the log, skips already-sent drafts, processes new CRM changes.

## Fit & Caveats

- **Not a replacement for prompting** — loops *use* prompts, but wrap them in schedule + context + guardrails.
- **State management is hard** — Keep logs simple; don't try to build persistent memory without a database.
- **Hallucinations increase with complexity** — More outcomes per loop = more opportunity for the agent to invent. Start small.
- **Approval flows are slow** — If every result needs human approval, you haven't saved time. Design outcomes where most runs are auto-approved.
- **API/tool changes break loops** — If the CRM API changes, your loop breaks. Monitor and update.

## Ecosystem Integration Patterns

### Pattern 1: Nucleus + Scheduled Loops

Nucleus orchestrates video generation. Scheduled loops handle research, fact-checking, audience updates:

```
Morning loop (7am):
├─ Fetch latest trends (MindSearch)
├─ Check audience growth (analytics API)
├─ Draft script outline
└─ Log findings for Nucleus to use in generation

Nucleus workflow:
├─ Read loop findings
├─ Generate video (script → composition → render)
└─ Publish
```

### Pattern 2: Claude Code Skills + Scheduled Tasks

Skills live in the codebase. Scheduled task invokes the skill:

```python
# Claude Code skill: `/analyze-sentiment`
def analyze_sentiment(emails: list[str]) -> dict:
  # Claude call with tool use
  pass

# Scheduled task
def daily_sentiment_loop():
  emails = load_recent_emails(hours=24)
  sentiment = analyze_sentiment(emails)
  flag_negative(sentiment)
  log_run(sentiment)

schedule.every().day.at("09:00").do(daily_sentiment_loop)
```

### Pattern 3: Agent Framework (Kimi K2, MiroFlow) as Loop

Use a hierarchical agent framework as the decision/act step:

```
Scheduled loop:
├─ Load context (CRM, emails, transcripts)
├─ Invoke Kimi K2 agent with outcome
│  ├─ Kimi decomposes into sub-tasks
│  ├─ Calls tools (read account, draft email, etc.)
│  └─ Returns structured result
├─ Verify & route (human-in-loop for risky)
└─ Record log
```

## References

- **Pattern origin**: From Anthropic's agent patterns and best practices
- **Implementations**: n8n (no-code), Claude Code (Python), Any LLM service with tool use (Kimi K2, Claude via API)
- **Related patterns**: Agentic loops, multi-turn reasoning, tool use guardrails
- **Best practice source**: "Prompt vs. Loop" framing

---

**Use Case for Ecosystem:** Design pattern for turning one-shot prompts into hands-off, scheduled outcomes. Schedule + Context + Decide + Act + Verify. Applicable to Nucleus (research + fact-checking sub-tasks), Claude Code scheduled tasks (sales loops, sentiment analysis, daily briefings), and Kimi K2 agentic workflows. Shift from "I'll ask the agent" to "the agent runs every morning and I approve the results once."
