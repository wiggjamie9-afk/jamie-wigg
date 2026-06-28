# Step 1 — Extract a workflow breakdown from a YouTube video

Video understanding needs a model that ingests video directly, so this step runs
in **Google AI Studio** (aistudio.google.com), not here. Start a chat with the
latest Gemini Pro model that supports video, paste the YouTube link, and use the
prompt below. Then bring the output back here and the `n8n-workflow-generator`
skill converts it to importable JSON.

## Primary prompt

```
Analyze this n8n tutorial video and break down the complete workflow:

1. List every node used (in order)
2. For each node, specify:
   - Node type (HTTP Request, AI Agent, Code, etc.)
   - Configuration settings shown (every dropdown selection and text field)
   - Connections to other nodes (including IF true/false branches)
3. Include any API endpoints, credentials, or parameters mentioned
4. Note the trigger type (Manual, Webhook, Schedule, Gmail, etc.)

Be extremely detailed — I need to recreate this workflow exactly.
```

## If Gemini misses detail — re-scan by timestamp

```
Go through the video again at these timestamps and extract:
- [0:00-2:00] What trigger is used and its exact settings?
- [2:00-5:00] What are the exact AI Agent / model settings (model, system prompt, temperature)?
- [5:00-8:00] What tools / sub-nodes are connected, and to which ports?

Be specific about every dropdown selection and text field shown on screen.
```

## For complex multi-branch workflows

```
For this workflow, also include:
- All conditional branches (IF true/false paths)
- Loop configurations (batch size, iterations, wait/poll intervals)
- Error-handling nodes
- Any sub-workflows or nested agents, and how they're wired
```

## Then, here

Paste the breakdown into Claude Code and say something like
"turn this into importable n8n JSON" — the `n8n-workflow-generator` skill writes
`automation/<slug>/workflow.json` + a README and validates it before handing back.
```
