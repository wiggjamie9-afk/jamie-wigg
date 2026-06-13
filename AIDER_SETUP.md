# Aider AI Coding Assistant

Aider is a terminal-based AI pair programmer that works directly in your git repository. It understands your codebase context and can make surgical code changes while keeping you in control.

## Installation

Aider is already installed in an isolated Python environment.

### On Your Mac

```bash
# Install Aider (one-time)
python3 -m pip install aider-ai

# Verify installation
aider --version

# Or using the installer
python -m pip install aider-install
aider-install
```

## Quick Start

### Basic Usage

```bash
# Navigate to your project
cd ~/jamie-wigg-workspace/event-platform

# Start Aider
aider

# Tell Aider what to do:
# "Add TypeScript validation to EventForm component"
# "Fix the theme toggle button alignment"
# "Create a new API endpoint for bulk event creation"
```

### Connecting to Claude

Set your API key:

```bash
export ANTHROPIC_API_KEY=your-key-here

# Start Aider with Claude (default)
aider --model claude-opus-4-1
```

### Connecting to Other Models

```bash
# DeepSeek
aider --model deepseek --api-key deepseek=your-key

# GPT-4o
aider --model gpt-4o --api-key openai=your-key

# o3-mini
aider --model o3-mini --api-key openai=your-key

# List available models
aider --list-models
```

## Working with Event Platform

### Example Workflows

**Add a new feature:**

```bash
aider --model claude-opus-4-1

# In Aider:
# "Add a dark mode toggle to the EventCard component. Use the existing theme system."
# Aider will:
# - Find EventCard.tsx
# - Understand the theme system
# - Add the toggle with proper styling
# - Commit changes automatically
```

**Fix a bug:**

```bash
# "The EventMap is not zooming to the correct coordinates. Fix it to use the
#  centerpoint of all events instead of the first event"
# Aider reads EventMap.tsx, finds the bug, fixes it
```

**Refactor code:**

```bash
# "The EventForm component is too long. Split it into smaller components:
#  EventFormBasics, EventFormLocation, EventFormAssets"
# Aider refactors with full context awareness
```

**Write tests:**

```bash
# "Write comprehensive tests for the semantic search algorithm in 
#  src/app/api/search-events/route.ts"
```

## Key Aider Commands

```bash
# In the Aider prompt:
/help              # Show help
/exit              # Exit Aider
/code              # View code snippets in git history
/diff              # Show what would change
/test              # Run tests
/clear             # Clear chat history
/ls                # List files Aider is aware of
/open <file>       # Add file to context
/drop <file>       # Remove file from context
/git <command>     # Run git command
/run <command>     # Run shell command
```

## Aider Configuration

Create `~/.aider/aider.conf.yml`:

```yaml
model: claude-opus-4-1

# Files to always include
files:
  - event-platform/src/

# Files to always exclude
exclude:
  - node_modules
  - .next
  - dist

# Auto-commit changes
auto_commit: true

# Verbose mode
verbose: false

# Temperature for model
temperature: 0
```

Or set environment variables:

```bash
export AIDER_MODEL=claude-opus-4-1
export AIDER_AUTO_COMMIT=true
export AIDER_VERBOSE=false
```

## Workflow Examples

### Add Allottee Management Module

```bash
cd ~/jamie-wigg-workspace/event-platform
aider --model claude-opus-4-1

# You paste the TypeScript interfaces and ask:
# "Implement a complete allottee management module with:
#  1. Supabase schema for allottees table
#  2. React component AllotteeForm for creating/editing
#  3. AllotteeList component displaying records
#  4. API endpoints in route.ts
#  5. Type definitions
#  Make it use our existing theme system and integrate with EventForm"
```

Aider will:
1. Create the schema migration
2. Build the React components
3. Write the API endpoints
4. Add proper TypeScript types
5. Integrate with existing code
6. Commit everything with descriptive messages

### Improve Performance

```bash
# "The EventList component is rendering slowly with 1000+ events.
#  Implement virtualization using react-window and memoization."
```

### Add Testing

```bash
# "Write integration tests for the semantic search endpoint using vitest"
```

## Aider + Git Integration

Aider understands your git repository:

```bash
# Aider automatically:
# - Reads .gitignore to exclude files
# - Uses git to understand code history
# - Makes atomic commits for each change
# - Keeps your repo clean

# View what Aider changed
git log --oneline -5

# See the diffs
git diff HEAD~3 HEAD
```

## Advanced Features

### Multi-file Edits

Aider can edit multiple files in a single request:

```bash
# "Update the event API schema to add an 'allottees' field.
#  Also update the TypeScript types and the React component that uses it."
# → Aider edits schema.sql, types.ts, and component.tsx atomically
```

### Context from Chat History

Aider remembers conversation context:

```bash
aider
# You: "Create an allottee management feature"
# Aider: [creates files]
# You: "Now add validation"
# Aider: [adds validation to previously created files]
# You: "Use our theme system for colors"
# Aider: [updates components to use theme]
```

### Create from Scratch

```bash
# "Create a new 'BankManagement' feature module with:
#  - src/components/BankForm.tsx
#  - src/hooks/useBank.ts
#  - src/app/api/banks/route.ts
#  - Full integration with existing event platform"
```

## Troubleshooting

```bash
# Check configuration
aider --show-config

# Use verbose mode for debugging
aider --verbose

# Use a different model to test
aider --model gpt-4o

# Check what files Aider sees
# Then in Aider: /ls
```

## Performance Tips

1. **Add specific files** — Tell Aider which files matter:
   ```bash
   aider src/components/EventForm.tsx src/lib/supabase.ts
   ```

2. **Use smaller requests** — More specific = better results:
   ```
   ✅ "Add email validation to the contact field in EventForm"
   ❌ "Improve the entire event platform"
   ```

3. **Break large changes into steps**:
   ```
   1. "Create the Supabase schema"
   2. "Create the React component"
   3. "Create the API endpoint"
   ```

## Aider vs Other Tools

| Aspect | Aider | IDE Copilot | Other AI Assistants |
|--------|-------|-----------|-------------------|
| **Codebase Understanding** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Multi-file Edits** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Git Integration** | ⭐⭐⭐⭐⭐ | Limited | Limited |
| **Cost** | Free (your API key) | Paid | Varies |
| **Terminal-native** | ⭐⭐⭐⭐⭐ | IDE-bound | Various |

## Your Stack Now

| Tool | Purpose |
|------|---------|
| **Hermes** | Conversational AI, messaging bots |
| **OpenHands** | Autonomous agent workflows |
| **Aider** | AI-assisted code editing (your pair programmer) |
| **Polsia** | Structured data language |
| **Content Tools** | Automation (Python scripts) |

## Next Steps on Mac

1. Install Aider:
   ```bash
   python3 -m pip install aider-ai
   ```

2. Set API key:
   ```bash
   export ANTHROPIC_API_KEY=your-key
   ```

3. Start coding with AI assistance:
   ```bash
   cd ~/jamie-wigg-workspace/event-platform
   aider
   ```

## Resources

- **Docs**: https://aider.chat/docs/
- **GitHub**: https://github.com/Aider-AI/aider
- **Leaderboard**: https://aider.chat/docs/leaderboards/
- **Chat**: https://discord.gg/Tv2uQnppNF (Discord)

---

Aider + Hermes + OpenHands = complete AI development stack.
