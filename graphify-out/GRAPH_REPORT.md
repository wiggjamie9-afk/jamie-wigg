# Graph Report - /home/user/jamie-wigg  (2026-04-30)

## Corpus Check
- Corpus is ~2,584 words - fits in a single context window. You may not need a graph.

## Summary
- 29 nodes · 23 edges · 5 communities detected
- Extraction: 70% EXTRACTED · 26% INFERRED · 4% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_RHYTHMIX Landing Pages|RHYTHMIX Landing Pages]]
- [[_COMMUNITY_AI Music Competitors|AI Music Competitors]]
- [[_COMMUNITY_Remotion Project Setup|Remotion Project Setup]]
- [[_COMMUNITY_RHYTHMIX Pricing & Offers|RHYTHMIX Pricing & Offers]]
- [[_COMMUNITY_ESLint Flat Config|ESLint Flat Config]]

## God Nodes (most connected - your core abstractions)
1. `RHYTHMIX Creator Testimonials` - 5 edges
2. `RemotionRoot Component` - 4 edges
3. `RHYTHMIX Landing Page (Hero+Stats)` - 4 edges
4. `RHYTHMIX Product (AI Music Platform)` - 3 edges
5. `Remotion Config` - 2 edges
6. `Tailwind Webpack Override` - 2 edges
7. `MyComposition Component` - 2 edges
8. `MyComp Composition Definition` - 2 edges
9. `RHYTHMIX Pricing Tiers` - 2 edges
10. `RHYTHMIX Lifetime Access Deal $149` - 2 edges

## Surprising Connections (you probably didn't know these)
- `MyComposition Component` --semantically_similar_to--> `RHYTHMIX Product (AI Music Platform)`  [AMBIGUOUS] [semantically similar]
  video/src/Composition.tsx → text.txt
- `RHYTHMIX Landing Page (Hero+Stats)` --semantically_similar_to--> `RHYTHMIX Landing Page Duplicate`  [INFERRED] [semantically similar]
  text.txt → text 2.txt
- `Remotion Video README` --references--> `Remotion Config`  [INFERRED]
  video/README.md → video/remotion.config.ts
- `Remotion Video README` --references--> `RemotionRoot Component`  [INFERRED]
  video/README.md → video/src/Root.tsx
- `RHYTHMIX Landing Page (Hero+Stats)` --conceptually_related_to--> `RHYTHMIX Features/Pricing/FAQ Sections`  [INFERRED]
  text.txt → text 3.txt

## Hyperedges (group relationships)
- **Remotion Video Registration Flow** — index_registerroot_call, root_remotionroot, root_mycomp_composition, composition_mycomposition [EXTRACTED 0.95]
- **RHYTHMIX Marketing Page Funnel** — text_rhythmix_brand, text3_rhythmix_14_features, text3_rhythmix_testimonials, text3_rhythmix_pricing_tiers, text3_rhythmix_lifetime_deal [INFERRED 0.90]
- **RHYTHMIX Competitor Comparison Set** — text3_competitor_suno, text3_competitor_udio, text3_competitor_landr, text_rhythmix_brand [EXTRACTED 0.85]

## Communities

### Community 0 - "RHYTHMIX Landing Pages"
Cohesion: 0.33
Nodes (6): MyComposition Component, MyComp Composition Definition, RHYTHMIX Landing Page Duplicate, RHYTHMIX Features/Pricing/FAQ Sections, RHYTHMIX Product (AI Music Platform), RHYTHMIX Landing Page (Hero+Stats)

### Community 1 - "AI Music Competitors"
Cohesion: 0.33
Nodes (6): LANDR (Competitor), Suno (Competitor), Udio (Competitor), Spotify Distribution, RHYTHMIX Creator Testimonials, Apple TV+ Sync Placement

### Community 2 - "Remotion Project Setup"
Cohesion: 0.5
Nodes (5): index.ts registerRoot Entrypoint, Remotion Video README, Remotion Config, Tailwind Webpack Override, RemotionRoot Component

### Community 3 - "RHYTHMIX Pricing & Offers"
Cohesion: 0.5
Nodes (4): RHYTHMIX 14 Core AI Features, RHYTHMIX Lifetime Access Deal $149, RHYTHMIX Pricing Tiers, Gumroad CTA Link

### Community 9 - "ESLint Flat Config"
Cohesion: 1.0
Nodes (1): Remotion ESLint Flat Config

## Ambiguous Edges - Review These
- `MyComposition Component` → `RHYTHMIX Product (AI Music Platform)`  [AMBIGUOUS]
  video/src/Composition.tsx · relation: semantically_similar_to

## Knowledge Gaps
- **9 isolated node(s):** `index.ts registerRoot Entrypoint`, `RHYTHMIX Landing Page Duplicate`, `RHYTHMIX Features/Pricing/FAQ Sections`, `Suno (Competitor)`, `Udio (Competitor)` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `ESLint Flat Config`** (1 nodes): `Remotion ESLint Flat Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `MyComposition Component` and `RHYTHMIX Product (AI Music Platform)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `RHYTHMIX Product (AI Music Platform)` connect `RHYTHMIX Landing Pages` to `RHYTHMIX Pricing & Offers`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `MyComp Composition Definition` connect `RHYTHMIX Landing Pages` to `Remotion Project Setup`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `RemotionRoot Component` (e.g. with `Tailwind Webpack Override` and `Remotion Video README`) actually correct?**
  _`RemotionRoot Component` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `RHYTHMIX Landing Page (Hero+Stats)` (e.g. with `RHYTHMIX Landing Page Duplicate` and `RHYTHMIX Features/Pricing/FAQ Sections`) actually correct?**
  _`RHYTHMIX Landing Page (Hero+Stats)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `index.ts registerRoot Entrypoint`, `RHYTHMIX Landing Page Duplicate`, `RHYTHMIX Features/Pricing/FAQ Sections` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._