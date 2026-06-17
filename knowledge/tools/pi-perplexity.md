# pi-perplexity: Perplexity Search Plugin for oh-my-pi

Perplexity Pro/Max web search integration for the oh-my-pi agent framework. Reverse-engineered OAuth + SSE client that enables multi-step reasoning and source citations in LLM agent workflows.

GitHub: `pi-perplexity` (Bun + TypeScript) · oh-my-pi ecosystem · MIT (typical)

## Why It's Relevant Here

Two hooks:

1. **Web search tool for Nucleus agents** — Nucleus orchestrates multi-step tasks; pi-perplexity is the "web search expert" agent can delegate to. Whereas MindSearch is a standalone research agent, pi-perplexity is a *tool* (callable, returns formatted result in one shot). Lighter than running a full MindSearch instance.

2. **Reverse-engineered Perplexity API** — Perplexity is a premium reasoning-first search engine (reasoning + multi-step fact-checking before returning answer). This plugin extracts that capability without paying per-API-call — by mimicking the desktop/web client's internal OAuth flow. Comparable to OpenClaw Zero Token pattern (browser login gateway).

⚠️ **Supply-chain note**: This is reverse-engineered from the Perplexity macOS app. Perplexity doesn't publish an official public API for this endpoint. Works today, may break on header/schema changes. Monitor for deprecation.

## Architecture

### Auth (Phase 2)

Two paths:

**Path 1: Desktop App Extraction (macOS only)**
- Read JWT from Perplexity macOS app's keychain/defaults (`defaults read ai.perplexity.mac authToken`)
- Fast, requires app to be installed and logged in
- Fallback if fails

**Path 2: Email OTP (cross-platform)**
- POST to Perplexity CSRF endpoint → get cookie
- POST email + cookie → Perplexity sends OTP to inbox
- POST email + OTP → receive JWT
- Slower, works anywhere, no app required

**Token Storage**:
```typescript
interface StoredToken {
  jwt: string;
  expires: number;
  email?: string;
  acquiredAt: number;
}
```
Stored in `~/.config/pi-perplexity/auth.json` with 0600 permissions.

**Expiry Handling**: Reactive (on HTTP 401/403, prompt user to re-auth) rather than proactive. Simpler, avoids spurious re-auth.

### SSE Client (Phase 3)

**Endpoint**: `https://www.perplexity.ai/rest/sse/perplexity_ask` (POST)

**Request body**:
```json
{
  "version": "2.18",
  "source": "webSearch",
  "query": "<user query>",
  "mode": "copilot",
  "attachments": [],
  "params": {
    "recency": "month",
    "search_focus": "general"
  }
}
```

**Response**: SSE stream of JSON events:
```typescript
interface StreamEvent {
  type: string; // "chunk_event", "web_result", "source_result", etc.
  chunks?: StreamBlock[];
  web_results?: WebResult[];
  sources?: StreamSource[];
  error_code?: string;
  error_message?: string;
  [key: string]: unknown; // loose schema
}

interface MarkdownBlock {
  intended_usage: string; // e.g. "answer", "followup"
  chunk_starting_offset: number; // for splice merging
  text: string;
}

interface StreamBlock {
  intended_usage: string;
  chunks: MarkdownBlock[];
}

interface WebResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  source?: string;
}

interface StreamSource {
  snippet: string;
  title: string;
  url: string;
  ageSeconds?: number;
  publishedDate?: string;
}
```

**Event Merging Logic** (incremental, critical for correctness):
- Accumulate events with same `intended_usage`
- For markdown blocks with `chunk_starting_offset`, splice text at offset (handles mid-chunk updates)
- Merge `web_results` + `sources` lists, deduplicate by URL

**Stream Parser**:
```typescript
async function* readSseEvents<T>(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal
): AsyncGenerator<T>
```
Reads SSE `data:` lines, parses JSON, yields typed events. Handles `[DONE]` marker. Abort-aware.

### Search Client (Phase 3)

```typescript
interface SearchParams {
  query: string;
  recency?: "hour" | "day" | "week" | "month" | "year";
  limit?: number;
  signal?: AbortSignal;
}

interface SearchResult {
  answer: string; // synthesized from markdown blocks
  sources: SearchSource[]; // deduplicated web results
  model: string; // Perplexity model identifier
  requestId: string; // UUID for tracing
}

async function searchPerplexity(
  params: SearchParams,
  jwt: string
): Promise<SearchResult>
```

Steps:
1. Build request body with params
2. POST to endpoint with required headers (`User-Agent`, `Authorization: Bearer ${jwt}`, etc.)
3. Iterate SSE events, merge incrementally
4. On stream end, extract answer (markdown blocks → concatenate)
5. Extract sources (web_results + sources_list, deduplicate by URL)
6. Return structured result

### Response Formatting (Phase 4)

**LLM Output Format**:
```
## Answer
<synthesized answer text>

## Sources
N sources
[1] Title (2d ago)
    https://url
    snippet preview...
...

## Meta
Provider: perplexity (oauth)
Model: <display_model>
Request: <uuid>
```

Features:
- Age calculation: `(Date.now() - publishedDate) / 1000` → "2d ago", "3h ago", "just now"
- Snippet truncation: 240 chars max
- Source limit: configurable (default 10)
- Readable by LLMs and humans

### Plugin Integration (Phase 5)

**oh-my-pi Tool Definition**:
```typescript
const factory: CustomToolFactory = (api) => {
  return {
    name: "perplexity_search",
    label: "Perplexity Search",
    description: "...",
    parameters: api.typebox.Type.Object({
      query: Type.String({ description: "Search query" }),
      recency: Type.Optional(Type.Union([
        Type.Literal("hour"),
        Type.Literal("day"),
        Type.Literal("week"),
        Type.Literal("month"),
        Type.Literal("year"),
      ])),
      limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50 })),
    }),

    async execute(toolCallId, params, onUpdate, ctx, signal) {
      // 1. Load or acquire JWT (authenticate if needed)
      // 2. Call searchPerplexity(params)
      // 3. Format result via formatForLLM()
      // 4. Return { content: [{ type: "text", text }], details }
    },
  };
};

export default factory;
```

**oh-my-pi Manifest** (`package.json`):
```json
{
  "name": "pi-perplexity",
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.ts",
  "omp": {
    "name": "Perplexity Search",
    "description": "Web search via Perplexity Pro/Max subscription (OAuth)",
    "tools": "src/index.ts",
    "settings": {
      "email": {
        "type": "string",
        "description": "Perplexity account email (for OTP login)",
        "env": "PERPLEXITY_EMAIL"
      }
    }
  },
  "peerDependencies": {
    "@oh-my-pi/pi-tui": "*"
  },
  "devDependencies": {
    "@oh-my-pi/pi-tui": "workspace:*",
    "@oh-my-pi/pi-agent-core": "workspace:*",
    "@sinclair/typebox": "*",
    "typescript": "*"
  }
}
```

**Tool Description** (`src/prompts/tool-description.md`):
```markdown
# Perplexity Search

Search the web using Perplexity Pro with multi-step reasoning and source citations.

**Use for**: Questions requiring up-to-date web information, fact-checking, trend discovery.
**Prefer**: Primary sources; corroborate claims across multiple results.
**Include**: Source links in response.

**Params**:
- query: Search query (required)
- recency: Filter by time — hour, day, week, month, year (optional)
- limit: Maximum number of sources to return (optional)
```

## Implementation Phases

| Phase | Component | Estimate | Notes |
|---|---|---|---|
| 1 | Scaffold (package.json, tsconfig, factory skeleton) | 30 min | No blockers |
| 2 | Auth (JWT storage, desktop app extraction, email OTP) | 2 hours | Requires testing both paths |
| 3 | SSE Client (stream parser, event merging, search client) | 3 hours | **Critical path** — complex merge logic |
| 4 | Formatting (LLM output, age calculation, truncation) | 1 hour | Straightforward |
| 5 | Plugin Wiring (connect auth+search+format in factory) | 1 hour | Integration |
| 6 | Login Command (optional, for `omp perplexity login`) | 30 min | Optional |
| 7 | Testing (unit + integration + fixtures) | 2 hours | Fixture data from real Perplexity SSE |

**Total**: ~10 hours

## Risk Areas & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Reverse-engineered API instability** | Headers, body format, SSE schema may change | Keep client thin, loose types (optional fields everywhere), monitor Perplexity app updates |
| **JWT expiry variance** | Perplexity JWTs may have short lifetimes | 5-minute buffer in token storage; reactive re-auth on 401/403 |
| **macOS-only desktop extraction** | Path 1 only works on macOS | Email OTP fallback for Linux/Windows; acceptable for initial version |
| **Cloudflare challenges** | Perplexity uses Cloudflare; User-Agent + headers bypass rules | User-Agent from macOS app (reverse-engineered); may break if Cloudflare rules change |
| **Rate limiting** | Perplexity may throttle repeated searches | Fallback gracefully, cache results client-side, document limits |

## Fit & Caveats

- **Not an official API** — reverse-engineered from web/macOS app. Perplexity could change headers, endpoint, schema without notice. Use with awareness that maintenance cost exists.
- **Requires Perplexity account** — either desktop app (macOS) or email login. Free Perplexity account may have rate limits; Pro/Max recommended for agent workflows.
- **Lighter than MindSearch** — MindSearch is a full research agent framework; pi-perplexity is a single-call tool (fast, low-latency, for Nucleus delegation).
- **oh-my-pi ecosystem only** — plugin model specific to oh-my-pi agents. Not a standalone library (could be refactored to be, but not in initial scope).

## Ecosystem Integration Patterns

### 1. Nucleus Web Search Delegation

```
Nucleus loop:
├─ Task: "Generate promo for new AI startup"
├─ Delegate to perplexity_search: "What's the latest funding announcement from this startup?"
│  ├─ Search with recency=week
│  └─ Return answer + sources
├─ Pass findings to rhythmix-author (script generation)
└─ Render → publish
```

### 2. Real-time Fact-Checking in Agent Loops

Agent writes a claim → perplexity_search verifies → agent updates response if needed.

### 3. Competitive Intelligence

Periodic scheduled agent task: `perplexity_search("trends in music AI 2024")` → summarize findings → feed into strategy docs.

## Related Tools in Ecosystem

| Tool | Relationship |
|---|---|
| **MindSearch** | Standalone research agent; pi-perplexity is a lightweight tool for quick web searches |
| **Nucleus** | Orchestration layer; pi-perplexity = micro-tool for search sub-tasks |
| **oh-my-pi** | Plugin host framework; pi-perplexity integrates as a custom tool |
| **OpenClaw Zero Token** | Similar reverse-engineered gateway pattern (web LLM access via browser login) |

## Setup & Usage

### Quick Start

```bash
# Prerequisites
brew install bun  # or use existing Bun installation
npm install -g oh-my-pi  # or local development

# Clone and build
git clone https://github.com/path/to/pi-perplexity
cd pi-perplexity
bun install
bun run src/index.ts  # verify no errors

# Register with oh-my-pi
omp plugin install ./pi-perplexity

# First use: authenticate
# Agent invokes perplexity_search tool → prompted for login if no JWT stored
# Either extracts from macOS app OR sends OTP to email
```

### Configuration

Set in `.env` or environment:
```
PERPLEXITY_EMAIL=your.email@example.com  # optional, for OTP login
```

### First Search

```
Agent: "Search for recent AI announcements"
Tool invocation:
  perplexity_search(
    query="AI announcements 2024",
    recency="month",
    limit=10
  )
Result: Formatted answer + sources
```

## References

- **Reverse-engineered from**: Perplexity macOS app (`ai.perplexity.mac`)
- **API Endpoint**: `https://www.perplexity.ai/rest/sse/perplexity_ask`
- **oh-my-pi**: https://github.com/path/to/oh-my-pi
- **Build Tools**: Bun, TypeScript, @sinclair/typebox
- **Auth Methods**: Desktop JWT extraction (macOS), Email OTP (cross-platform)

---

**Use Case for Ecosystem:** Lightweight web search tool (tool, not agent) for Nucleus orchestration loops. Reverse-engineered Perplexity OAuth client (desktop app extraction + email OTP auth) with SSE streaming and incremental event merging. Two auth paths (macOS desktop or email); formatted output suitable for LLM consumption. Lighter than full MindSearch research agent; faster single-call lookups for fact-checking and trend discovery during RHYTHMIX campaign generation.
