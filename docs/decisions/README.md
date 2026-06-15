# Decisions (ADRs & PDRs)

This directory holds architecture and product decision records for RHYTHMIX and STARLIGHTMIX Studio.

## Format

Each decision is a Markdown file following MADR (Markdown Any Decision Record) format. Decisions are immutable once published; superseded decisions link to their successors.

- **ADR** (Architecture Decision Record) — technical implementation choices, tool selection, architectural patterns
- **PDR** (Product Decision Record) — strategic/upstream-driven decisions affecting feature scope, user-facing behavior

## File naming

- `adr/<number>-<slug>.md` — Architecture decisions
- `pdr/<number>-<slug>.md` — Product decisions
- Use 4-digit numbers: `0001`, `0002`, etc.

## Current Decisions

### Architecture (ADR)

- **ADR-0001** — HyperFrames over Remotion for Promos ([adr/0001-hyperframes-over-remotion-for-promos.md](adr/0001-hyperframes-over-remotion-for-promos.md))
  - Status: Accepted
  - Why: HTML composition + GSAP avoids Remotion complexity; faster iteration and local preview; browser-native playback
  - Consequence: All new video Promos use HyperFrames folder structure; Remotion setup in `video/` is dormant

## Creating a New ADR

1. Load the `decisions` skill first: `claude` will prompt for `/decisions`
2. Use MADR template in the skill
3. Write in the `docs/decisions/` directory
4. Link to the ADR from relevant code comments (e.g., "See ADR-0002")
5. Reference in CLAUDE.md's Skill Requirements section if it affects agent behavior

## Questions to answer in an ADR

- **Decision**: What are we deciding on?
- **Context**: What is the issue we're solving?
- **Consequences**: What are the downstream effects (good and bad)?
- **Alternatives considered**: What did we rule out and why?
- **Status**: Proposed, Accepted, Superseded (→ ADR-NNNN)
