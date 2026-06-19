# Ponytail Audit: `claude/kindness-counts-ux-strategy-kwui9s`

**Branch stats:** 21,314 files changed | 876,781 insertions | 2,141 deletions

## 🚨 High-Impact Findings (Ponytail: ULTRA Mode)

### 1. **Security Skills Template Explosion** (76 new skills, ~355 files)
- **Pattern:** Each `analyzing-<topic>` skill is a full folder: `LICENSE`, `SKILL.md`, `references/api-reference.md`, `scripts/agent.py`
- **Problem:** Identical structure across 76 topics. Ponytail says: **YAGNI + consolidate into data-driven registry**
- **Recommendation:** 
  ```
  .agents/skills/security-analysis/
  ├── SKILL.md (meta)
  ├── topics.json (76 topics as config)
  ├── generate-topic-skills.mjs (single generator)
  └── templates/ (shared LICENSE, api-reference template)
  ```
  **Savings:** ~300 files → ~5 files. **Deletion over addition.**

### 2. **Video Frame Duplication** (19,000+ frame PNG files)
- **Pattern:** `sunny-bedtime-videos/book-*/frames/` each contains hundreds of duplicated PNGs
- **Problem:** Generated content committed as-is. Ponytail: **Does this need to be in version control at all?**
- **Recommendation:**
  - Move frames to `.gitignore`
  - Commit only the `generate-frames.sh` / `.mjs` generator
  - Keep one example frame as documentation
  - **Savings:** ~19,000 binary files → 1-2 checked in (+ generator script)

### 3. **Tutorials Code Duplication** (multiple `tutorial-builder.mjs`, repetitive `index.html`)
- **Pattern:** Each tutorial folder has identical boilerplate `index.html`, `hyperframes.json`, `meta.json`
- **Problem:** `videos/tutorials/bookreader-pro/`, `languagelens/`, `mathtutor-pro/` all nearly identical
- **Recommendation:**
  ```
  videos/tutorials/
  ├── tutorial-builder.mjs (unified, single copy)
  ├── config.json (tutorial definitions)
  └── generate-all.mjs (fan-out generator)
  
  # Remove redundant index.html, hyperframes.json, meta.json from each folder
  # Keep output only if needed; regenerate on build
  ```
  **Savings:** ~250 HTML/JSON files → 2 config files + 1 generator

### 4. **Skills Directory Sync Overhead**
- **Pattern:** `.agents/skills/` has 754 items changed
- **Problem:** Are all of these hand-edited, or mostly generated/synced?
- **Recommendation:** If synced from upstream, use a `skills-lock.json` (you already have this!) instead of committing the full tree. **Commit only the lock file.**

---

## 📊 Quantification

| Category | Current | After Ponytail | Savings |
|---|---|---|---|
| Security skills files | 355 | ~15 (config + generator) | **96% ↓** |
| Frame PNG commits | 19,000+ | ~2 (example + generator) | **99.9% ↓** |
| Tutorial boilerplate | 250+ | ~4 (config + generator) | **98% ↓** |
| Total files in branch | 21,314 | ~18,000 | **~15% ↓** |

---

## 🛠️ Action Plan (Priority Order)

### Phase 1: Immediate (cut ~19,000 files)
```bash
# 1. Add frames to .gitignore
echo "sunny-bedtime-videos/*/frames/" >> .gitignore

# 2. Remove committed frames (keep generator, remove outputs)
git rm -r sunny-bedtime-videos/book-*/frames/
git add .gitignore
```

### Phase 2: Short-term (cut ~300 files)
```bash
# Consolidate 76 security skills into one parameterized skill
# (requires: creating topics.json + skill generator)
```

### Phase 3: Follow-up (clean up tutorials)
```bash
# Consolidate tutorial boilerplate into data-driven config
# (tutorials can be regenerated on build, not stored)
```

---

## ✅ What NOT to Cut (Ponytail: trust boundaries)

- **SKILL.md content itself** — actual documentation is valuable
- **agent.py logic** — the actual security analysis scripts
- **LICENSE files** — legal requirement (but can be shared via symlink if identical)
- **Version bumps** — if genuinely needed

---

## Code Style Markers

When you simplify, mark intentional shortcuts with:
```python
# ponytail: generated from topics.json; upgrade path: parameterized template system if >200 topics
```

```bash
# ponytail: frames are output, not source; regenerate from build script. Upgrade: distributed CDN cache if >1GB
```

---

## Summary

**Your branch is solving real problems** (security skills, video generation, tutorials). **But you're storing outputs, not sources.** Ponytail says: commit the generator, the config, the source. Output is rebuild-able.

**Estimated final commit size:** 876k → ~150k (83% reduction from removing generated frames + boilerplate).

---

**Next steps:**
1. Review Phases 1–3 above
2. Run `git rm` on frames (largest savings, zero risk)
3. Consolidate skills into topic-registry pattern
4. Regenerate tutorials from config on build

Apply `/ponytail-review` after edits to confirm minimization.
