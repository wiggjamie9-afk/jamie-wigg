# GRAPH_REPORT.md — RHYTHMIX Workspace Knowledge Graph

Generated: 2026-05-30  
Corpus: 536 files · ~464K words (code: 233, documents: 303)  
Extraction: AST (tree-sitter, 233 code files) + heuristic semantic (303 doc/config files)

---

## Graph Statistics

| Metric | Value |
|---|---|
| Total nodes | 8,711 |
| Total edges | 14,086 |
| Communities detected | 814 |
| Largest connected component | 5,140 nodes |
| Isolated nodes | 26 |
| Graph density | 0.000371 |

### Edge provenance

| Type | Count |
|---|---|
| EXTRACTED | 13,670 |
| INFERRED | 416 |
| AMBIGUOUS | 0 |

---

## Top Communities

| # | Label | Nodes |
|---|---|---|
| 1 | three.min.js / ms() | 170 |
| 2 | We / pr | 158 |
| 3 | jn / Mn | 140 |
| 4 | .push() / clone() | 125 |
| 5 | toJSON() / .fromArray() | 110 |
| 6 | copy() / ri | 102 |
| 7 | applyMatrix4() / .fromBufferAttribute() | 95 |
| 8 | CLAUDE / zapier-workflows | 84 |
| 9 | .constructor() / update() | 66 |
| 10 | qe / dn | 58 |
| 11 | ue() / Mi | 52 |
| 12 | history.ts / history.test.ts | 51 |
| 13 | home / tasks | 49 |
| 14 | me / .floor() | 48 |
| 15 | be() / .floor() | 46 |

---

## High-Degree Nodes (God Nodes)

The nodes with the most connections — architectural hubs and cross-cutting concerns:

| Rank | Node | Label | Degree |
|---|---|---|---|
| 1 | `rhythmix_soul_60s_three_min_js` | three.min.js | 364 |
| 2 | `rhythmix_soul_60s_three_min_copy` | copy() | 189 |
| 3 | `rhythmix_soul_60s_three_min_tl_push` | .push() | 114 |
| 4 | `CLAUDE.md` | CLAUDE | 108 |
| 5 | `rhythmix_venue_rock_gsap_min_js` | gsap.min.js | 107 |
| 6 | `rhythmix_promo_gsap_min_js` | gsap.min.js | 107 |
| 7 | `rhythmix_soul_60s_gsap_min_js` | gsap.min.js | 107 |
| 8 | `rhythmix_getit_60s_gsap_min_js` | gsap.min.js | 107 |
| 9 | `rhythmix_livenow_60s_gsap_min_js` | gsap.min.js | 107 |
| 10 | `rhythmix_backstory_60s_gsap_min_js` | gsap.min.js | 107 |
| 11 | `rhythmix_15s_gsap_min_js` | gsap.min.js | 107 |
| 12 | `rhythmix_square_60s_gsap_min_js` | gsap.min.js | 107 |
| 13 | `rhythmix_overview_60s_gsap_min_js` | gsap.min.js | 107 |
| 14 | `rhythmix_launch_60s_gsap_min_js` | gsap.min.js | 107 |
| 15 | `rhythmix_anthem_60s_gsap_min_js` | gsap.min.js | 107 |
| 16 | `rhythmix_itslive_60s_gsap_min_js` | gsap.min.js | 107 |
| 17 | `rhythmix_venue_rave_gsap_min_js` | gsap.min.js | 107 |
| 18 | `rhythmix_square_gsap_min_js` | gsap.min.js | 107 |
| 19 | `rhythmix_iphone_60s_gsap_min_js` | gsap.min.js | 107 |
| 20 | `rhythmix_32s_gsap_min_js` | gsap.min.js | 107 |

---

## Community Detail

### Key semantic clusters

#### Community 0: three.min.js / ms() (170 nodes)

- **three.min.js** (degree 364)
- **ms()** (degree 17)
- **fs()** (degree 17)
- **_c()** (degree 11)
- **lc** (degree 10)

#### Community 1: We / pr (158 nodes)

- **We** (degree 76)
- **pr** (degree 75)
- **.multiplyScalar()** (degree 38)
- **add()** (degree 38)
- **.normalize()** (degree 31)

#### Community 2: jn / Mn (140 nodes)

- **jn** (degree 47)
- **Mn** (degree 38)
- **updateMatrixWorld()** (degree 27)
- **.constructor()** (degree 26)
- **.invert()** (degree 20)

#### Community 3: .push() / clone() (125 nodes)

- **.push()** (degree 114)
- **clone()** (degree 37)
- **Ii** (degree 31)
- **.setAttribute()** (degree 29)
- **constructor()** (degree 26)

#### Community 4: toJSON() / .fromArray() (110 nodes)

- **toJSON()** (degree 34)
- **.fromArray()** (degree 30)
- **.toArray()** (degree 28)
- **parse()** (degree 20)
- **.fromJSON()** (degree 19)

#### Community 5: copy() / ri (102 nodes)

- **copy()** (degree 189)
- **ri** (degree 19)
- **dispose()** (degree 19)
- **.setValues()** (degree 18)
- **ka()** (degree 15)

#### Community 6: applyMatrix4() / .fromBufferAttribute() (95 nodes)

- **applyMatrix4()** (degree 39)
- **.fromBufferAttribute()** (degree 30)
- **ml** (degree 25)
- **.distanceTo()** (degree 19)
- **.raycast()** (degree 18)

#### Community 7: CLAUDE / zapier-workflows (84 nodes)

- **CLAUDE** (degree 108) — `CLAUDE.md`
- **zapier-workflows** (degree 1) — `CLAUDE.md`
- **voice-wake-say** (degree 1) — `CLAUDE.md`
- **voice-ai-voices** (degree 1) — `CLAUDE.md`
- **self-improving-agent** (degree 1) — `CLAUDE.md`

#### Community 8: .constructor() / update() (66 nodes)

- **.constructor()** (degree 39)
- **update()** (degree 29)
- **Vo** (degree 12)
- **.addEventListener()** (degree 12)
- **Ca()** (degree 11)

#### Community 9: qe / dn (58 nodes)

- **qe** (degree 33)
- **dn** (degree 20)
- **makeEmpty()** (degree 19)
- **isEmpty()** (degree 15)
- **.distanceToSquared()** (degree 14)

#### Community 10: ue() / Mi (52 nodes)

- **ue()** (degree 41)
- **Mi** (degree 32)
- **de()** (degree 26)
- **oo** (degree 21)
- **pl()** (degree 8)

#### Community 11: history.ts / history.test.ts (51 nodes)

- **history.ts** (degree 21)
- **history.test.ts** (degree 20)
- **library-grid.tsx** (degree 18)
- **eviction-toast.tsx** (degree 10)
- **library-card.tsx** (degree 9)

---

## Outputs

| File | Description |
|---|---|
| `graphify-out/graph.json` | Full graph in node-link JSON (8,711 nodes, 14,086 edges) |
| `graphify-out/graph.html` | Interactive ForceAtlas2 visualization (6.5 MB) |
| `graphify-out/GRAPH_REPORT.md` | This report |

## How to query

```bash
graphify query "How does the HyperFrames video pipeline work?"
graphify query "What skills are available?"
graphify query "How is the Studio deployed?"
graphify path "rhythmix-author" "studio"
graphify explain "coherence_engine"
```

## Audit trail

- AST extraction: tree-sitter, 233 code files → 6,038 nodes, 12,578 edges
- Semantic extraction: heuristic (headers, links, imports) on 303 doc/config files → 2,609 nodes, 2,421 edges  
- Cache hits: 6 files from previous run
- Merge: 8,561 unique nodes, 14,102 unique edges
- Community detection: Leiden algorithm, 814 communities
