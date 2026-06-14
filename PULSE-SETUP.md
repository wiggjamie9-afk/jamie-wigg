# PULSE — Token Efficiency & Code Compaction Protocol v1.0

## Overview

PULSE reduces token burn **60-70%** while maintaining output quality through code compaction, smart file reading, output compression, and architectural efficiency.

## Core Rules

### 10 Commandments
1. Don't read files already in context
2. Don't read whole files for 5 lines
3. Don't write "WHAT" comments (only "WHY")
4. Don't use 10 lines when 2 do the same thing
5. Don't repeat — extract, template, configure
6. Don't load everything at boot — lazy load
7. Don't write prose when structured output works
8. Don't preamble, recap, or narrate your process
9. Don't keep dead code — git has history
10. Don't sacrifice quality for brevity — same output, fewer tokens

### Code Compaction Checklist

#### JavaScript/TypeScript
- Destructure in function params: `function({ type, data }) {}`
- Object method shorthand: `{ process(x) { return x; } }`
- Async one-liners: `const getUser = async id => db.find(id);`
- Arrow functions: `const double = x => x * 2;`
- Optional chaining: `obj?.prop?.val ?? "default"`
- Map/filter/reduce over loops

#### Python
- List comprehensions: `[i.id for i in items if i.active]`
- Walrus operator: `if data := get_data(): process(data)`
- f-strings: `f"Hello {name}"`
- Unpacking: `first, second, *_ = items`

#### Bash
- Parameter expansion: `filename="${path##*/}"`
- Combine commands: `ls dir/` instead of `cd dir && ls && cd ..`
- Here-strings: `grep pattern <<< "$data"`

#### All Languages
- **COMMENTS:** Delete obvious comments. Keep only WHY.
- **VARIABLES:** Inline single-use variables
- **CONDITIONALS:** Use optional chaining, nullish coalescing, ternaries
- **FUNCTIONS:** Arrow syntax, no unnecessary braces
- **LOOPS:** .map/.filter/.reduce over manual loops
- **OBJECTS:** Shorthand, spread, destructuring
- **STRINGS:** Template literals, no unnecessary interpolation
- **IMPORTS:** Destructure only what you use
- **ERROR HANDLING:** Collapse redundant try/catch
- **DUPLICATION:** Extract if 3+ lines repeat
- **DEAD CODE:** Delete it, don't comment it out

### File Reading Discipline

Before reading ANY file, check:
1. Is this file already in context? → **DON'T RE-READ**
2. Did I write this file this session? → **DON'T RE-READ**
3. Do I need the WHOLE file or just a section? → **READ ONLY THE SECTION**
4. Is this config/boilerplate I've seen 100 times? → **SKIP unless debugging**
5. Can I grep for the specific line? → **GREP, don't cat**

Smart reading tactics:
| Instead of | Do this |
|---|---|
| `cat entire_file.py` | `grep -n "function_name" file.py` |
| `cat package.json` | `jq '.dependencies' package.json` |
| `cat long_log.txt` | `tail -50 long_log.txt` |
| Read every agent file | Read agent index/manifest only |
| Re-read memory files mid-session | Cache key values in working memory |
| `cat file_I_just_wrote.js` | Skip — you wrote it, you know it |
| Read 500-line file for 1 function | `sed -n '45,60p' file.py` |
| Read .env for one variable | `grep "^API_KEY=" .env` |

### Output Format

**Standard Report (max 100 tokens):**
```
{status} | {result_summary} | {next_action}
```

Examples:
- `DONE | Feature X deployed | monitoring`
- `ALERT | DB pool at 95% | investigate in 10m`
- `LEARNING | Pattern confirmed (0.81 confidence) | log observation`

**Output Rules:**
- NO PREAMBLE ("Sure, let me...")
- NO RECAP ("So what I did was...")
- NO FILLER WORDS (basically, essentially, actually, just, simply)
- NO EXPLAINING THE OBVIOUS
- STRUCTURED > PROSE for status
- ONE-LINERS for logs
- TABLES > PARAGRAPHS for comparisons
- CODE > DESCRIPTIONS for solutions
- DIFFS > FULL REWRITES when editing

### Context Window Budget

```
Budget per session:
├── 15% — System prompt + CLAUDE.md + protocol
├── 10% — Memory files (state, logs tail, predictions tail)
├── 5%  — Agent definitions (index only, not full files)
├── 60% — ACTUAL WORK (code, analysis, output)
└── 10% — Buffer for tool responses & conversation

FAIL THRESHOLD: Reading files for 40%+ of context before doing work = FAILURE
```

### Token Metrics (Track Every Session)

- `tokens_read` — total tokens reading files
- `tokens_written` — tokens in output
- `tokens_wasted` — re-reads, filler, dead code
- `read_to_output_ratio` — target: < 2.0
- `compaction_score` — lines removed / lines touched
- `agent_prompt_avg_tokens` — target: < 200
- `memory_boot_tokens` — target: < 1000
- `efficiency_grade` — A/B/C/D/F

### Quality Gate (Non-Negotiable)

Before finalizing ANY compaction:
1. Do tests still pass? → If no, **REVERT**
2. Are edge cases handled? → If no, **REVERT**
3. Is code human readable? → If no, **REVERT**
4. Is output complete? → If no, **REVERT**

**Compaction that breaks things is sabotage, not efficiency.**
Goal: SAME OUTPUT, FEWER TOKENS. Not worse output.

### Consolidation Rules

**Consolidate when:**
- 3+ files share 50%+ identical code
- A file is under 20 lines
- Config spread across 5+ files
- Agent definitions repeat boilerplate

**Never consolidate:**
- Memory files (distinct purposes)
- OPUS_LOCKED protocol files
- Independently versioned/deployed files

### Compaction Sweep (Weekly)

1. Scan all `.js/.ts/.py/.sh` files
2. Flag: dead code, unused imports, verbose patterns, commented-out blocks
3. For each flag: calculate token savings, apply if > 50 tokens AND no behavior change
4. Log: `{file, before_lines, after_lines, tokens_saved}`
5. Aggregate & report in standard format

### Session Hygiene

Every session, flag:
- Unused imports (dead weight)
- Duplicate utilities (same function in 3 files)
- Oversized dependencies (pulling lodash for one function)
- Circular dependencies (cause re-reads)

## Integration Checklist

- ✅ Code compaction patterns learned (all languages)
- ✅ File reading discipline active (5-point gate)
- ✅ Output format locked (100-token standard reports)
- ✅ Context budget allocated (60% work target)
- ✅ Token metrics tracking enabled
- ✅ Quality gate non-negotiable
- ✅ 10 Commandments memorized
- ✅ Consolidation rules understood
- ✅ Weekly compaction sweep scheduled

## Reference

- **Status:** ACTIVE v1.0.0
- **Companion:** PULSE-FULL-AUTONOMY-24-7.md
- **Purpose:** Reduce token burn 60-70% while maintaining output quality
- **Created:** 2026-04-05
- **Integrated:** 2026-06-14
