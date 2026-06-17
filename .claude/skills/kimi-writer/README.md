# Kimi Writer Skill

Autonomous writing agent powered by kimi-k2-thinking for creating long-form content: novels, books, short stories, guides, and interconnected narratives.

## Quick Start

```bash
# Generate a new work with a prompt
/kimi-writer "Write a 5-chapter mystery novel set in Victorian London"

# Or interactive mode (you'll be prompted for input)
/kimi-writer

# Resume interrupted work from a saved checkpoint
/kimi-writer --recover output/my_project/.context_summary_20250107_143022.md

# List available recovery checkpoints
/kimi-writer --list
```

## What Kimi Writer Does

The agent:
1. **Plans** — analyzes your creative brief and structures the work
2. **Generates** — writes content across iterations (up to 300)
3. **Manages context** — auto-compresses when approaching token limits
4. **Saves progress** — writes output files in real-time, auto-backup every 50 iterations
5. **Recovers gracefully** — interrupted? Use `--recover` to pick up where you left off

## Integration with Nucleus

Kimi Writer complements the Nucleus orchestration pipeline:

- **Nucleus (Mary agent)** — handles video/carousel/multimodal coordination
- **Kimi Writer** — autonomous long-form content generation, story development

Use case: Mary generates marketing copy → Kimi Writer expands into blog posts / guides / short stories for SEO.

## Output Structure

Works are organized in `output/` as self-contained directories:

```
output/
└── my_mystery_novel/
    ├── chapter_01.md      (fully formatted)
    ├── chapter_02.md
    ├── chapter_03.md
    ├── ...
    ├── .context_summary_20250107_143022.md  (auto-saved)
    └── .context_summary_20250107_145033.md  (auto-saved)
```

Each markdown file is production-ready: proper headings, paragraph breaks, semantic formatting.

## Tips

**Be Specific**
- ✓ "Write a 10-chapter sci-fi novel exploring generational ships and memory loss, 3000-4000 words per chapter"
- ✗ "Write something creative"

**Set Clear Scope**
- Specify chapter/section count
- Set word count targets
- Define tone/style/themes

**Let It Work**
- The agent runs autonomously
- Complex tasks take many iterations — that's normal
- Check `output/` folder in real-time to monitor progress

**Recovery**
- Files are saved immediately (no work is lost)
- Use `--recover` with the latest `.context_summary_*.md` to continue
- Context summaries are timestamped, so you can checkpoint multiple versions

## Configuration

Edit the skill's `index.ts` to customize:

```typescript
// Model and API
const MODEL = "kimi-k2-thinking";
const TEMPERATURE = 1.0;
const MAX_TOKENS = 65536;

// Context management
const TOKEN_LIMIT = 200000;
const COMPRESSION_THRESHOLD = 180000;  // 90% of limit

// Agent behavior
const MAX_ITERATIONS = 300;
const BACKUP_INTERVAL = 50;  // iterations

// File output
const OUTPUT_DIR = "output";
```

## Environment Setup

Kimi Writer requires:

1. **API key** — Set `MOONSHOT_API_KEY` in `.env`:
   ```
   MOONSHOT_API_KEY=your-kimi-api-key-here
   ```

2. **Python runtime** — The underlying agent is Python-based. Ensure Python 3.9+ is installed.

3. **File system access** — Must be able to write to `output/` directory.

## Troubleshooting

**"MOONSHOT_API_KEY not set"**
- Create `.env` file at repo root with `MOONSHOT_API_KEY=your-key`
- Get key from: https://platform.moonshot.cn/

**Agent seems stuck**
- Normal for complex tasks — agent runs up to 300 iterations
- Check `output/` folder for saved progress
- Use Ctrl+C to interrupt safely (context is auto-saved)

**Token limit issues**
- Agent auto-compresses at 180K tokens (90% of 200K limit)
- Watch for compression messages in output
- Files are saved before each compression step

## Related Skills

- `/dream <description>` — one-shot creative asset (uses Kimi Writer for long-form text)
- `/album-launch <brief>` — fan-out cover art, music, video, + landing section
- `/spec-quick <description>` — structured specs (pairs well with Kimi Writer for detailed design docs)

## Performance Metrics

| Task | Duration | Typical Output |
|---|---|---|
| 5-chapter novel | 30-45 min | 15K-25K words |
| 10 short stories | 45-90 min | 25K-40K words |
| Comprehensive guide | 60-120 min | 30K-50K words |

Times vary by complexity, iteration depth, and token usage.

## For One-Person Builders

Kimi Writer is ideal for:
- **Content SEO** — long-form blog posts, guides, case studies
- **Product docs** — technical manuals, API references, user guides
- **Story development** — novels, short story collections, interactive fiction
- **Marketing collateral** — white papers, ebooks, thought leadership

Set it running while you handle other tasks. Recovery mode means no lost work.

---

**Created:** Jamie Wigg's Ecosystem  
**Model:** kimi-k2-thinking (Moonshot AI)  
**License:** MIT (with attribution to Moonshot AI)
