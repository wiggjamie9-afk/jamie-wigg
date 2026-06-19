# Ponytail Phase 2-3: Security Skills & Tutorial Consolidation

## Summary

Two major consolidation opportunities identified via ponytail minimalism:

1. **Security Skills (Phase 2):** 76 separate skills → 1 parameterized skill (save 1.3 MB disk, 75-86% faster topic onboarding)
2. **Tutorials (Phase 3):** 3 tutorials with 96.5% boilerplate → config-driven architecture (87-94% boilerplate reduction)

Both follow ponytail principles: **deletion over addition, data-driven over template duplication, one source of truth instead of 76.**

---

## Phase 2: Security Skills Consolidation

### Current State (Bloat Pattern)

**Location:** `.agents/skills/analyzing-*/`

```
analyzing-active-directory-acl-abuse/
├── LICENSE                    (identical across all 76)
├── SKILL.md                   (35-45% template boilerplate)
├── scripts/
│   └── agent.py              (40-60% boilerplate: argparse, JSON marshaling, error handling)
└── references/
    └── api-reference.md      (tool-specific)

× 76 skills = 355 files, ~3.9 MB, 59.8K lines of code
```

### Symptoms

- **Maintenance nightmare:** Bug fix to CLI args? Update 76 agent.py files.
- **Template duplication:** Every SKILL.md starts with identical metadata + "When to Use" + "Prerequisites" sections.
- **Boilerplate code:** ~17 KB of duplicate argparse setup, JSON marshaling, error handling across all 76 files.
- **Onboarding friction:** Adding a new `analyzing-*` skill takes 60-90 minutes (create folder, copy boilerplate, write 3 files).

### Proposed Solution

**Single parameterized skill** with a topic registry:

```
.agents/skills/analyzing/                    (replaces 76 folders)
├── LICENSE                                   (shared)
├── SKILL.md                                  (generic template with placeholders)
├── scripts/
│   ├── agent.py                             (orchestrator, ~50 lines)
│   │   └── Loads topics.json, imports topic module dynamically
│   └── topics/
│       ├── active_directory_acl_abuse.py
│       ├── android_malware_with_apktool.py
│       ├── ... (74 more)
│       └── windows_shellbag_artifacts.py
├── references/
│   └── topics/
│       ├── active-directory-acl-abuse.md
│       ├── android-malware-with-apktool.md
│       ├── ... (74 more)
│       └── windows-shellbag-artifacts.md
└── topics.json                               (NEW: registry of 76 topics with metadata)
```

### Implementation Roadmap

#### Phase 2a: Proof of Concept (1-2 days)

**Goal:** Migrate 10 topics to validate approach. If successful, Phase 2b proceeds immediately.

1. **Create consolidated skill structure** (1h)
   - Move `.agents/skills/analyzing-*/` → `.agents/skills/analyzing/`
   - Create `scripts/topics/` and `references/topics/` directories
   - Create `topics.json` with entries for all 76 topics (copy metadata from existing SKILL.mds)

2. **Write parameterized orchestrator** (2-3h)
   - `scripts/agent.py`: Load topics.json, dynamically import topic module, call `analyze()` interface
   - Standard argparse CLI that accepts topic name + delegates to topic module
   - Error handling, JSON output formatting (shared across all topics)

3. **Migrate first 10 topics** (3-4h)
   - For each of 10 representative topics (AD, Android, API, Azure, Bootkit, Browser, Campaign, Certificate, Cloud Storage, Cobalt Strike):
     - Extract topic-specific constants from original `agent.py`
     - Create `scripts/topics/{topic_slug}.py` with `analyze(argv, **kwargs)` function
     - Copy topic-specific docstring/metadata to `references/topics/{topic_slug}.md`
   - Delete original 10 `analyzing-{topic}/` folders

4. **Validate & test** (1h)
   - Invoke orchestrator: `analyzing active-directory-acl-abuse --dc-ip 192.168.1.1`
   - Compare output with original skill output
   - Verify help text, error handling work as expected

5. **Measure & confirm savings** (30m)
   - Disk space: original 10 folders (150 files, ~520 KB) → consolidated (topic modules + shared, ~80 KB)
   - Confirm 85% reduction on sampled topics

#### Phase 2b: Full Migration (2-3 days)

**Prerequisite:** Phase 2a PoC passes validation.

1. **Migrate remaining 66 topics** (2 days)
   - Batch migrate in groups of 10-15 (avoid context bloat, easier to debug)
   - Use a migration script: read original agent.py, extract constants, write topic module

2. **Update documentation** (4h)
   - Update `.claude/skills/` symlink to point to consolidated skill
   - Update `skills-lock.json` with single entry for `analyzing` skill (instead of 76)
   - Create `MIGRATION_NOTES.md` explaining new topic-addition workflow

3. **Add CLI enhancements** (optional, 4h)
   - Shell completion for topic names
   - `analyzing --list` to show all topics
   - `analyzing --search <keyword>` to find topics by name/description

4. **Final validation** (2h)
   - Run all 76 topics (spot-check 10+ to confirm functionality)
   - Verify no regressions in output format or exit codes

### Benefits

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Disk usage | 3.9 MB | 2.6 MB | **33% reduction** |
| Boilerplate code | ~17 KB | ~2 KB | **88% reduction** |
| Total lines | 59.8K | ~50K | **12% reduction** |
| New topic time | 60-90 min | 12-22 min | **75-86% faster** |
| CLI bug fixes | 76 changes | 1 change | **96% fewer changes** |
| Maintenance paths | 76 parallel | 1 shared | **Single source of truth** |

### Upgrade Paths (Deferred Simplifications)

**Mark with `ponytail:` comments:**

```python
# ponytail: topics.json registry; upgrade path: add AI-assisted topic-generation
# when >200 topics (parameterize even further via config)
```

```python
# ponytail: hard-coded import path; upgrade path: plugin loader if external topic packages needed
```

---

## Phase 3: Tutorial Boilerplate Consolidation

### Current State (Duplication Pattern)

**Location:** `videos/tutorials/`

```
videos/tutorials/
├── tutorial-builder.mjs         (source of truth, 713 lines)
│   └── Embeds tutorial data (name, tagline, features, colors, CTA) in code
├── generate-tutorials.mjs       (separate video generation pipeline)
├── bookreader-pro/
│   ├── index.html               (254 lines, 6.8 KB — 96.5% identical to others)
│   ├── package.json             (duplicated)
│   ├── hyperframes.json         (duplicated structure)
│   └── meta.json                (identical)
├── languagelens/                (same structure)
└── mathtutor-pro/               (same structure)

Total: 22.2 KB boilerplate (3 tutorials)
```

### Symptoms

- **HTML duplication:** 746 lines of near-identical CSS, layout, animations across 3 files.
- **Config in code:** Metadata (title, tagline, features, colors, CTA) lives in `tutorial-builder.mjs`, hard to edit without running builder.
- **Adding tutorials:** Copy entire folder + modify 8 lines per file = 30 mins of manual work.
- **Source confusion:** Unclear which files are source (builder config) vs. generated (index.html, JSON).

### Proposed Solution

**Config-driven architecture** with parameterized templates:

```
videos/tutorials/
├── config.json                                (NEW: single config for all metadata)
├── templates/
│   ├── index.html                           (parameterized, ~50 lines)
│   └── package.json                         (parameterized)
├── generate-all.mjs                         (unified builder: reads config, renders templates)
├── generate-tutorials.mjs                   (video generation — separate concern)
├── package.json                             (updated scripts)
├── bookreader-pro/                          (auto-generated from config)
├── languagelens/                            (auto-generated from config)
└── mathtutor-pro/                           (auto-generated from config)
```

### config.json Structure

```json
{
  "version": "0.4.42",
  "defaults": {
    "width": 1920,
    "height": 1080,
    "duration": 8,
    "fps": 30
  },
  "tutorials": [
    {
      "id": "mathtutor-pro",
      "name": "MathTutor Pro",
      "tagline": "Solve Math Problems Step-by-Step",
      "description": "AI-powered step-by-step guidance...",
      "icon": "∑",
      "accentColor": "#10b981",
      "accentLight": "#34d399",
      "features": [
        "Step-by-step solutions",
        "AI explanations",
        "Visual demonstrations"
      ],
      "cta": "Start Learning Math"
    },
    {
      "id": "bookreader-pro",
      "name": "BookReader Pro",
      ...
    },
    {
      "id": "languagelens",
      "name": "LanguageLens",
      ...
    }
  ]
}
```

### Implementation Roadmap

#### Phase 3a: Config Extraction (1 day)

1. **Create `config.json`** (2h)
   - Extract metadata from existing HTML files + tutorial-builder.mjs
   - For each tutorial: name, tagline, description, icon, accent colors, features, CTA button text

2. **Update `tutorial-builder.mjs`** (2h)
   - Replace hardcoded tutorials array with `config.json` import
   - Keep HTML generation logic unchanged (verify it still works)
   - Run `npm run build` and confirm output matches original

3. **Add `.gitignore` entries** (30m)
   - `videos/tutorials/bookreader-pro/`
   - `videos/tutorials/languagelens/`
   - `videos/tutorials/mathtutor-pro/`
   - (Source of truth = config.json + templates; output = generated)

#### Phase 3b: Templatize & Unify (1 day)

1. **Extract HTML template** (2h)
   - Create `videos/tutorials/templates/index.html` (parameterized, ~50 lines + template variables)
   - Replace hardcoded text with placeholders: `{{name}}`, `{{tagline}}`, `{{accentColor}}`, etc.
   - Use simple string replacement or a lightweight template engine (EJS, Nunjucks)

2. **Refactor `generate-all.mjs`** (2h)
   - Replaces `tutorial-builder.mjs`
   - Read `config.json`
   - For each tutorial:
     - Render HTML template with tutorial metadata
     - Generate `package.json`, `hyperframes.json`, `meta.json`
     - Write to `tutorials/{tutorial_id}/` folder
   - Call `generate-tutorials.mjs` for video generation (optional flag)

3. **Update `package.json` scripts** (1h)
   ```json
   {
     "build": "node generate-all.mjs",
     "build:videos": "node generate-tutorials.mjs",
     "build:full": "npm run build && npm run build:videos"
   }
   ```

4. **Test & validate** (1h)
   - `npm run build`
   - Verify generated HTML matches original
   - Confirm folder structure is identical
   - Delete `tutorial-builder.mjs` (no longer needed)

### Benefits

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Boilerplate (3 tuts) | 22.2 KB | 3 KB | **87% reduction** |
| Boilerplate (10 tuts) | 72 KB | 4 KB | **94% reduction** |
| New tutorial time | 30 min | 2 min | **93% faster** |
| Config centralization | None | 1 file | **Single source of truth** |
| Template maintenance | 3 copies | 1 copy | **3× fewer changes** |

### Source vs. Generated Clarity

**After Phase 3:**

| File | Type | Notes |
|------|------|-------|
| config.json | Source | All metadata |
| templates/index.html | Source | Parameterized |
| templates/package.json | Source | Parameterized |
| generate-all.mjs | Source | Builder logic |
| generate-tutorials.mjs | Source | Video generation |
| tutorials/*/index.html | Generated | Output of generate-all.mjs |
| tutorials/*/package.json | Generated | Output of generate-all.mjs |
| tutorials/*/hyperframes.json | Generated | Output of generate-all.mjs |
| tutorials/*/meta.json | Generated | Output of generate-all.mjs |

---

## Effort & Timeline

| Phase | Duration | Effort | Blockage |
|-------|----------|--------|----------|
| **Phase 2a** (PoC security skills) | 1-2 days | 1 dev | Low |
| **Phase 2b** (full security skills) | 2-3 days | 1 dev | Low (depends on Phase 2a) |
| **Phase 3a** (config extraction) | 1 day | 1 dev | Low |
| **Phase 3b** (templatize + unify) | 1 day | 1 dev | Low |
| **Parallel possible** | — | — | Yes; Phase 2 & 3 independent |

**Total: 5-7 days for both phases (or 3-4 days if run in parallel).**

---

## Deprecation & Rollback Risk

**Low risk:**

- Users invoke skills by name (e.g., `/analyzing-active-directory-acl-abuse`). Internal restructuring is invisible to CLI surface.
- If Phase 2 rollback needed: keep original 76 folders as symlinks into consolidated skill (backward compatible).
- Tutorial generation is entirely local; if Phase 3 breaks, revert `generate-all.mjs` to `tutorial-builder.mjs`.

---

## Ponytail Markers

When implementing, mark intentional simplifications:

```python
# ponytail: dynamic module loading; upgrade path: plugin registry if >100 topics
# ponytail: string templates; upgrade path: proper templating engine if >50 tutorials
```

These mark where future complexity can be deferred, keeping current code minimal.

---

## Next Steps

1. **Approve Phase 2a PoC** → execute security skills consolidation (1-2 days)
2. **Approve Phase 3a** → execute config extraction for tutorials (1 day)
3. **Run both in parallel** for 3-4 day total turnaround
4. **Measure savings & validate** before Phase 2b / 3b full migration
