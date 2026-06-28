---
name: n8n-workflow-generator
description: Convert an n8n workflow breakdown (e.g. a Gemini video analysis of a YouTube tutorial) into valid, import-ready n8n JSON. Use when the user pastes a node-by-node workflow breakdown, asks to "turn this tutorial/video into an n8n workflow", says "make this importable n8n JSON", or wants to recreate an n8n automation from a description.
---

# n8n Workflow Generator

Turns a **workflow breakdown** into a single `workflow.json` that imports cleanly
into n8n (Cloud or self-hosted). This is Steps 2–3 of the "YouTube → working
agent" pipeline; Step 1 (video → breakdown) happens in Google AI Studio / Gemini
because it needs native video understanding (see `gemini-extraction-prompt.md`).

## When to use

The user gives you a breakdown that looks like:

```
TRIGGER: Gmail Trigger (poll every 5 min, label Inbox)
↓
NODE: AI Agent (Tools Agent) — model GPT-4, system prompt "...", tools: Gmail Send
↓
NODE: Gmail — Send Email
```

...and wants importable JSON. If they only have a YouTube link, first point them
at `gemini-extraction-prompt.md` to produce the breakdown, then run this.

## Output contract

- Output **one valid JSON document** — the workflow. No markdown fences, no prose
  around it when the user asks for "just the JSON". Write it to
  `automation/<slug>/workflow.json` and also write a short `README.md` (credentials,
  placeholders, sheet/columns, test steps) like the existing pipelines.
- Top-level shape:
  ```json
  { "name": "...", "nodes": [...], "connections": {...}, "settings": { "executionOrder": "v1" }, "pinData": {}, "meta": { "templateCredsSetupCompleted": false } }
  ```

## Authoring rules

1. **Real node types only.** Use exact n8n type strings, e.g.
   `n8n-nodes-base.httpRequest`, `n8n-nodes-base.set`, `n8n-nodes-base.if`,
   `n8n-nodes-base.wait`, `n8n-nodes-base.googleSheets`,
   `n8n-nodes-base.googleSheetsTrigger`, `n8n-nodes-base.youTube`,
   `n8n-nodes-base.stickyNote`, `n8n-nodes-base.scheduleTrigger`,
   `n8n-nodes-base.manualTrigger`, `n8n-nodes-base.gmail`,
   `@n8n/n8n-nodes-langchain.agent`, `@n8n/n8n-nodes-langchain.lmChatOpenAi`,
   `@n8n/n8n-nodes-langchain.lmChatAnthropic`. If unsure whether a node exists,
   prefer `n8n-nodes-base.httpRequest` hitting the service's REST API directly —
   it always imports.
2. **Each node needs**: `parameters`, `id` (unique slug), `name` (unique, human),
   `type`, `typeVersion`, `position` `[x, y]`. Add `credentials` with
   `{ "id": "REPLACE_ME", "name": "<service> account" }` for anything that authenticates.
3. **Never embed secrets.** API keys/tokens become n8n credentials the user adds
   after import. Literal placeholders (sheet IDs, account handles) get an
   `ALL_CAPS_PLACEHOLDER` and a README line.
4. **Connections** live in the top-level `connections` object, keyed by the
   source node's **name** (not id):
   `{ "Node A": { "main": [ [ { "node": "Node B", "type": "main", "index": 0 } ] ] } }`.
   IF nodes have two output arrays: index 0 = true, index 1 = false. Polling loops
   wire the false branch back to the Wait node.
5. **Layout**: lay nodes left→right, ~180–220px apart horizontally; branches step
   ±120–180px vertically. Add one `stickyNote` per logical stage (set `color`,
   `width`, `height`) so the imported canvas reads cleanly — mirror the existing
   pipelines under `automation/`.
6. **AI sub-nodes** (LangChain agent + model/memory/tool) connect through
   non-`main` ports: the model/tool node lists the agent under the right port
   (`ai_languageModel`, `ai_tool`, `ai_memory`). When in doubt, model the agent as
   an `httpRequest` to the provider's API — simpler and version-proof.

## Before you finish — validate

Always run the bundled validator on the file you wrote:

```bash
node .claude/skills/n8n-workflow-generator/validate-workflow.mjs automation/<slug>/workflow.json
```

It checks: valid JSON; required top-level keys; every node has the required
fields; node names are unique; **every connection source and target resolves to a
real node**; and flags leftover `REPLACE_ME`/placeholder strings so you can list
them in the README rather than ship a broken import. Fix everything it reports
before telling the user it's ready.

## Reference

- `gemini-extraction-prompt.md` — the Step-1 prompt to get a breakdown from a
  YouTube video in Google AI Studio (plus the timestamp/branch follow-ups).
- Worked examples in this repo: `automation/veo3-faceless-content-system/` and
  `automation/kling-social-pipeline/` — copy their node patterns, sticky-note
  staging, and README structure.
