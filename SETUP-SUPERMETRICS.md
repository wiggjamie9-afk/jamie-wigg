# Supermetrics MCP — marketing data for Claude

**What it is:** Supermetrics' hosted MCP server gives Claude live, read-only access to marketing
data across 200+ sources — Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads, Microsoft Ads,
Google Analytics 4, Google Search Console, HubSpot, Salesforce, Shopify, Klaviyo, Mailchimp,
and more — through one connection. Claude queries live APIs (no cached exports, no fabricated
numbers) and answers plain-English questions like "which RHYTHMIX ad creative had the best CPC
last week?".

**Why it's in this stack:** it is the RESEARCH branch of the automation layer
(`docs/AUTOMATION.md`) — campaign performance Q&A, weekly metrics digests, and data-backed
input to `/rhythmix-new` angles and `/album-launch` briefs.

## Setup (hosted connector — no code, no server in `.mcp.json`)

1. In the Claude connector directory, add **"Supermetrics Marketing Analytics"**
   (claude.ai → Settings → Connectors, or via supermetrics.com/products/supermetrics-mcp).
2. Authorize with your Supermetrics account (OAuth), then connect the ad/analytics accounts
   you want queryable inside Supermetrics.
3. Enable the connector for the chats/sessions where you want it. Done — ~2 minutes.

Requires a Supermetrics plan with API/MCP access; the connector is OAuth-based, so **no keys go
in `.env`** and there is nothing to install in this repo.

## Tools it exposes

`data_source_discovery`, `accounts_discovery`, `field_discovery`, `data_query`,
`get_async_query_results`, `get_today`, plus account/team management. Typical flow:
discover source → discover accounts → discover fields → `data_query`.

## How to use it here

- Ad-hoc: "pull last 30 days of Meta Ads spend and CPM for RHYTHMIX, compare to prior 30".
- Scheduled: the **weekly-metrics-digest** routine in `docs/AUTOMATION.md`.
- Feeding creative: ask for top-performing hooks/creatives before writing a new Promo script.

## References

- Product: https://supermetrics.com/products/supermetrics-mcp
- Claude guide: https://supermetrics.com/blog/analyze-marketing-data-with-claude
- Docs: https://docs.supermetrics.com/docs/supermetrics-for-claude
