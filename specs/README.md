# specs/

Spec-driven feature planning. Each subfolder is one feature or campaign.

## Layout

```
specs/<feature-slug>/
├── requirements.md   # what the feature must do — stable IDs R1, R2, ...
├── design.md         # how it will be built — references requirement IDs
└── tasks.md          # implementation checklist — stable IDs T1, T2, ...
```

## Lifecycle

1. **Generate** — `/spec-quick <description>` produces all three files in one pass after a short clarifying round. For RHYTHMIX video campaigns, use `/rhythmix-spec` instead (pre-fills the brand-specific questions).
2. **Analyze (optional)** — `/spec-analyze <slug>` surfaces ambiguities, contradictions, and gaps in `requirements.md` and rewrites them in place after the user resolves each finding.
3. **Execute** — `/spec-run <slug>` parses `tasks.md`, builds a dependency graph from explicit `depends:` + file overlap, and runs each wave as parallel `Agent` calls in isolated contexts.

Or skip execution and instead `/to-issues specs/<slug>/tasks.md` to publish tasks as GitHub issues for human or AFK-agent assignment.

## File conventions

- **Stable IDs** — `R1`, `T1`, etc. Never reuse a removed ID. New items get the next free number.
- **Cross-references** — tasks declare which requirements they `satisfies:`. Keep this explicit so analysis can detect orphaned requirements or unmotivated tasks.
- **`files:` globs** in `tasks.md` are authoritative for parallel-execution safety. `spec-run` uses them to detect file-overlap and serialize colliding tasks.

## What lives outside this folder

- **PRDs** — `/to-prd` publishes a problem-statement-and-user-stories PRD to GitHub issues. Different shape, different purpose (PRDs are for human alignment; specs are for execution).
- **ADRs** — `docs/adr/` records permanent architectural decisions. Specs reference ADRs; specs do not replace them.
- **Domain language** — `CONTEXT.md` at the repo root. Specs use the glossary; they do not redefine terms.
