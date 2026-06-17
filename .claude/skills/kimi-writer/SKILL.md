# /kimi-writer

Autonomous writing agent powered by kimi-k2-thinking for creating novels, books, short story collections, and long-form content.

## Usage

```
/kimi-writer "Create a 5-chapter mystery novel set in Victorian London"
/kimi-writer "Write 7 sci-fi short stories exploring memory and identity"
/kimi-writer "Compose a comprehensive Python programming guide"
```

Or interactive mode:
```
/kimi-writer
# Then enter your prompt when asked
```

Resume interrupted work:
```
/kimi-writer --recover output/my_project/.context_summary_20250107_143022.md
```

## Features

**🤖 Autonomous Writing**
- Agent plans and executes creative writing independently
- Real-time streaming of reasoning and generation
- Up to 300 iterations for complex tasks

**📚 Multiple Formats**
- Novels with chapters
- Short story collections
- Books (guides, references, etc.)
- Interconnected narratives

**⚡ Real-Time Streaming**
- See agent's thought process (🧠 reasoning)
- Watch content generation live (💬 content)
- Tool progress updates (🔧 file operations)

**💾 Smart Context Management**
- Automatic compression at 180K tokens (90% of limit)
- Context summaries saved every 50 iterations
- Full recovery from saved checkpoints

**🔄 Recovery Mode**
- Resume interrupted work from context summaries
- Preserves agent state and work in progress
- Timestamped backups for version control

**📊 Token Monitoring**
- Real-time token usage display
- Automatic optimization when approaching limits
- Transparent cost tracking

**🛠️ Tool Use**
- `create_project`: Organize writing into project folder
- `write_file`: Create/append/overwrite markdown files
- `compress_context`: Manage token usage automatically

## How It Works

The Agent's Loop:
1. Receives your creative brief
2. Reasons about the task using kimi-k2-thinking
3. Decides which tools to call (create project, write files, etc.)
4. Reviews results and continues
5. Repeats until task is complete (max 300 iterations)

Context Management:
- Token Limit: 200,000 tokens
- Compression Trigger: 180,000 tokens (90%)
- Auto-Backup: Every 50 iterations
- Recovery: Via saved context summaries

## Examples

**Example 1: Novel**
```bash
/kimi-writer "Write a mystery novel set in Victorian London with 10 chapters"
```

**Example 2: Short Story Collection**
```bash
/kimi-writer "Create 7 interconnected sci-fi short stories exploring the theme of memory"
```

**Example 3: Educational Book**
```bash
/kimi-writer "Write a comprehensive guide to Python programming with 15 chapters and code examples"
```

**Example 4: Fantasy World**
```bash
/kimi-writer "Build a fantasy novel trilogy opening with book 1 (8 chapters) introducing the world and main characters"
```

## Tips for Best Results

✓ **Be Specific**
- Good: "Create a 5-chapter romance novel set in modern Tokyo with themes of forbidden love"
- Less good: "Write something interesting"

✓ **Set Clear Scope**
- Good: "Write 10 interconnected short stories (2000-3000 words each)"
- Less good: "Write a lot of stories"

✓ **Let It Work**
- The agent works autonomously - don't interrupt unless necessary
- Complex tasks may take many iterations - that's normal
- Check the output folder to monitor progress in real-time

✓ **Recovery is Easy**
- If interrupted, files are saved
- Use --recover with the latest context summary to continue
- No work is lost

## Project Output Structure

The agent creates an organized project folder:

```
output/
└── your_project_name/
    ├── chapter_01.md
    ├── chapter_02.md
    ├── chapter_03.md
    ├── ...
    ├── .context_summary_20250107_143022.md  (auto-saved)
    └── .context_summary_20250107_145033.md  (auto-saved)
```

Each markdown file contains:
- Title/heading
- Complete chapter/story content
- Properly formatted text

## Advanced Features

**Real-Time Streaming Output**
```
🧠 Reasoning: Planning chapter structure...
💬 Writing: Chapter 1: The Detective Arrives...
🔧 Tool Call (write_file): Created chapter_01.md [5,234 words]
```

**Iteration Counter**
```
Iteration 23/300 | Tokens: 87,234/200,000 (43.6%)
```

**Context Compression**
```
⚠️ Compressing context (tokens: 187,432/200,000)
✓ Context compressed: Summary saved
```

**Graceful Interruption**
- Press Ctrl+C to stop
- Agent saves current context automatically
- Resume later with --recover flag

## Technical Details

| Parameter | Value |
|-----------|-------|
| Model | kimi-k2-thinking |
| Temperature | 1.0 (optimized) |
| Max Tokens per Call | 65,536 (64K) |
| Context Window | 200,000 tokens |
| Max Iterations | 300 |
| Compression Threshold | 180,000 tokens |
| Auto-Backup Frequency | Every 50 iterations |
| Output Format | Markdown (.md) |

## Configuration

Edit `kimi-writer.py` to customize:

```python
# Model and API
MODEL = "kimi-k2-thinking"
TEMPERATURE = 1.0
MAX_TOKENS = 65536

# Context management
TOKEN_LIMIT = 200000
COMPRESSION_THRESHOLD = 180000  # 90% of limit

# Agent behavior
MAX_ITERATIONS = 300
BACKUP_INTERVAL = 50  # iterations

# File output
OUTPUT_DIR = "output"
```

## Troubleshooting

**"MOONSHOT_API_KEY not set"**
- Create `.env` file with: `MOONSHOT_API_KEY=your-key`
- Get key from: https://platform.moonshot.cn/

**"401 Unauthorized"**
- Verify API key is correct
- Check .env file exists in project directory

**Agent seems stuck**
- Normal for complex tasks - agent can run 300 iterations
- Check output folder for progress
- Use Ctrl+C to interrupt and save

**Token limit issues**
- Agent auto-compresses at 180K tokens
- See compression messages in output
- Files are saved before compression

## Related

- **GitHub:** https://github.com/Doriandarko/kimi-writer
- **Creator:** Pietro Schirano (@Doriandarko)
- **Model:** Moonshot AI's kimi-k2-thinking
- **License:** MIT (with attribution)

## Integration with Nucleus

**Use Case:** Automated book/story/content generation for marketing campaigns

- Mary agent delegates long-form writing to Kimi Writer
- Generates campaign narratives, backstories, promotional content
- Produces markdown output suitable for web publishing
- Feeds into carousel/video generation pipeline
