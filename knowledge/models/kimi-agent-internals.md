# Kimi Agent Internals: Architecture & Source Analysis

Analysis of Moonshot AI's Kimi agent architecture and runtime. Kimi K2.5 powers the agents at kimi.com/chat, kimi.com/agent, and specialized endpoints. Source code confirmed as production by Moonshot AI (Reddit, January 2026).

## System Overview

Kimi agents operate as specialized task-specific interfaces over the K2.5 base model:

| Agent Type | Use Case | Tools |
|---|---|---|
| Base Chat | General conversation | 9 tools (web search, file upload, memory) |
| OK Computer | Code execution + browser automation | 29 tools (Jupyter kernel, Chrome control, file system) |
| Docs | Document generation | DOCX/PDF templates, formatting |
| Sheets | Spreadsheet operations | XLSX parsing, formula execution |
| Slides | Presentation building | Slide template rendering |
| Websites | Web app scaffolding | React webapp templates, CSS framework |

## Architecture

### Container Model

Kimi runs as isolated Linux containers with:
- Dedicated filesystem per session (`/tmp/kimi-sessions/<uuid>/`)
- Chromium browser instance (custom security policy)
- Jupyter kernel for code execution
- Control plane coordinating runtime requests
- PDF.js viewer for document handling

**Security Model:**
- Namespace isolation (containers)
- Capability restrictions (no privileged syscalls)
- Input sanitization (browser navigation, file operations)
- Output validation (code execution results)
- Chrome profile separation per session

### Runtime Components

**1. Browser Guard (`browser_guard.py` — 41KB)**
- Automated Chrome control via DevTools Protocol
- Tab/page management
- JavaScript injection and evaluation
- Form filling, screenshot capture
- Navigation history tracking
- Cookie/localStorage access

**2. Jupyter Kernel (`jupyter_kernel.py` — 17KB)**
- IPython kernel with custom kernel server
- Code cell execution in isolated Python process
- Output capture (stdout, stderr, display data)
- Error handling and traceback formatting
- Variable state persistence across cells

**3. Control Plane (`kernel_server.py` — 10KB)**
- HTTP API for agent → container communication
- Request routing (code execution, browser ops, file I/O)
- Session lifecycle management
- Output streaming back to agent

**4. Filesystem**
- Session-scoped temp directories
- File upload handling (multipart)
- Artifact output (HTML, PDF, images)
- Download delivery (Content-Disposition headers)

## Agent Prompts

### Base Chat Prompt (`base-chat.md`)
- Conversational interface without execution capabilities
- Web search integration (Moonshot search API)
- File upload and analysis
- Memory system (episodic + semantic)
- Fallback for unsupported requests

Structure:
```
System context (model capabilities)
→ Tool descriptions (search, upload, memory)
→ Response guidelines
→ Safety constraints
```

### OK Computer Prompt (`ok-computer.md`)
- Enhanced with code execution and browser automation
- Full filesystem access within session
- Chrome tab orchestration
- Jupyter notebook environment
- Multi-tool coordination patterns

Key additions over Base Chat:
- `execute_code` tool (Python in Jupyter)
- `browser_*` tools (navigate, click, screenshot, evaluate)
- `file_*` tools (read, write, list directory)
- `create_artifact` (save output)

### Specialized Prompts

**Docs** — DOCX generation, styling, template expansion
**Sheets** — XLSX parsing, formula handling, data manipulation
**Slides** — Presentation slide generation from Markdown
**Websites** — React component generation, routing setup, Tailwind styling

## Tool System

### Base Chat Tools (9 tools)
- `search_web` — web search via Moonshot API
- `upload_file` — handle file uploads
- `read_file` — access uploaded files
- `memory_store` — persist facts across conversations
- `memory_retrieve` — query stored memory
- `memory_list` — enumerate stored facts
- `memory_delete` — remove stored facts
- `get_time` — current timestamp
- `check_rate_limit` — quota tracking

### OK Computer Tools (29 tools)

**Code Execution:**
- `execute_code` — Python in Jupyter
- `install_package` — pip install
- `get_kernel_status` — runtime health

**Browser Automation:**
- `browser_create_tab` — new Chrome tab
- `browser_navigate` — URL navigation
- `browser_click` — DOM element clicking
- `browser_type_text` — keyboard input
- `browser_screenshot` — page capture
- `browser_evaluate` — JavaScript execution
- `browser_wait_for` — condition polling
- `browser_get_cookies` — session data
- `browser_set_cookies` — session injection

**File Operations:**
- `file_write` — create/overwrite file
- `file_read` — read file contents
- `file_append` — append to file
- `file_delete` — remove file
- `file_list` — directory contents
- `file_stat` — file metadata

**Session Management:**
- `create_artifact` — save output for download
- `get_downloads` — list generated files
- `clear_session` — reset container state

**Utilities:**
- `get_time`, `check_rate_limit`

## Skill System

### Skill Definition Structure

Each skill is a bundle:
```
skill-name/
├── SKILL.md              # Metadata + description
├── scripts/              # Language-specific implementation
│   ├── *.py              # Python scripts
│   ├── *.cs              # C# validators/converters
│   └── *.js              # Browser-side logic
├── assets/templates/     # Output templates
│   ├── base.html
│   ├── styles.css
│   └── variables.json
└── validator/            # Config validation
    ├── schema.json       # JSON Schema
    └── rules.md          # Validation rules
```

### Implemented Skills

**DOCX Skill**
- Python docx library integration
- C# template expansion (.NET)
- Supported: headings, tables, images, styling, page breaks
- Validation: schema enforcement, size limits

**XLSX Skill**
- openpyxl for spreadsheet generation
- Formula support (basic Excel functions)
- Multi-sheet workbooks
- Data validation rules

**PDF Skill**
- ReportLab + pdfkit backends
- HTML → PDF conversion (chromium-based)
- Template rendering (Jinja2)

**WebApp Skill**
- React 19 component scaffolding
- Next.js boilerplate generation
- Tailwind CSS framework
- Routing templates (React Router v6)
- Build output (Next.js export)

## Memory System

Kimi uses structured memory with three layers:

**1. Episodic** — conversation history
- Raw messages (user → assistant)
- Tool calls and results
- Timestamps

**2. Semantic** — fact storage
- Key-value facts (`user_preference: dark_mode`)
- Reasoning chains
- Domain knowledge

**3. Procedural** — skill registry
- Saved prompts
- Custom tool definitions
- Workflow templates

Memory format (internal):
```json
{
  "episodic": [
    {
      "type": "message",
      "role": "user",
      "content": "...",
      "timestamp": "2026-01-15T10:30:00Z"
    }
  ],
  "semantic": {
    "fact_id": {
      "key": "...",
      "value": "...",
      "confidence": 0.95,
      "source": "user_stated"
    }
  },
  "procedural": {
    "skill_name": { "definition": "..." }
  }
}
```

## Execution Flow

**User Request → Agent Processing:**

1. **Input Processing**
   - Parse user message
   - Query memory (semantic)
   - Determine execution path (chat vs. code vs. browser)

2. **Planning**
   - Decide which tools to use
   - For OK Computer: decide code execution, browser automation, or both
   - For Docs: determine template and parameters

3. **Execution**
   - Call tools in sequence or parallel
   - Code execution runs in Jupyter container
   - Browser automation orchestrates Chrome tabs
   - Streaming partial results back to user

4. **Output Handling**
   - Collect tool results
   - For skills: generate artifacts (DOCX, PDF, HTML)
   - Update memory (facts learned)
   - Return to user

5. **Artifact Delivery**
   - Save to session filesystem
   - Generate download links
   - Cleanup on session end

## Integration Patterns for Nucleus

Kimi agents complement Nucleus/Mary for:

1. **Code Execution** — Kimi OK Computer runs arbitrary Python, Nucleus calls it via MCP
2. **Browser Automation** — Kimi controls Chrome, Nucleus triggers task completion verification
3. **Document Generation** — Kimi skills (DOCX, PDF, XLSX) output to Nucleus storage
4. **Web Apps** — Kimi scaffolds React, Nucleus deploys + monitors

**Recommended Architecture:**
- **Kimi agents** — autonomous task execution, browser control, code sandboxing
- **Nucleus** — orchestration, memory coordination (via shared Cognee layer), asset management
- **Shared memory** — episodic facts sync between systems for context continuity

## Security Model

Kimi's threat model:

| Threat | Mitigation |
|---|---|
| Code injection | Jupyter cells isolated; output sanitization |
| Browser hijacking | Chrome profile per session; no persistent login |
| File access | Restricted to `/tmp/kimi-sessions/<uuid>/` |
| Network exfiltration | No outbound API calls; results only to user |
| Memory disclosure | Encrypted container cleanup on session end |
| Privilege escalation | No `sudo`; kernel runs as unprivileged user |

## File Structure (Production Verified)

```
kimi-runtime/
├── browser_guard.py         # Chrome DevTools orchestration
├── jupyter_kernel.py        # IPython kernel wrapper
├── kernel_server.py         # HTTP control plane
├── utils.py                 # Helpers
├── etc/
│   ├── chromium/            # Chrome policies (CSP, CORS)
│   ├── chromium.d/          # Launch flags
│   └── ImageMagick-6/       # Image processing policy
├── pdf-viewer/              # PDF.js extension (4MB)
└── skills/
    ├── docx/
    ├── xlsx/
    ├── pdf/
    └── webapp-building/
```

## For Nucleus Integration

**Use Kimi when you need:**
- Sandboxed Python execution (no direct subprocess risks)
- Chrome automation (form filling, data extraction, screenshots)
- Document generation (styled Word/PDF output)
- Web app scaffolding (React boilerplate)

**Bridge pattern:**
```python
# Nucleus orchestrator
nucleus_task = "analyze_market_trends"
kimi_code_execution = await kimi.execute_code(
    "import requests; df = requests.get(...).json()"
)
result = nucleus_memory.store(
    "market_trends",
    kimi_code_execution.output
)
```

## References

- **Reddit discussion** (January 2026) — Moonshot AI confirmed this is production code
- **Kimi.com** — Live agent interfaces (chat, agent, specialized endpoints)
- **License** — CC0 (extracted material) + CC BY 4.0 (analysis) + Apache 2.0 (third-party)

---

**Use Case for Ecosystem:** Kimi agent architecture pattern informs Nucleus design: container isolation, tool-based execution, memory coordination, skill system, artifact generation. Consider adopting Kimi's episodic/semantic/procedural memory split for enhanced learning across agent types.
