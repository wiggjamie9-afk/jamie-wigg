# 🧬 Genetic OS

A browser-based operating system that is **bred, not designed**.

Every visual trait — palette, glass opacity, corner radii, type scale, spacing, glow, and the
physics of the animated wallpaper ("habitat") — is expressed from a **14-gene genome**. The OS
evolves through a real genetic algorithm: you are the fitness function.

## How it works

| Concept | Implementation |
|---|---|
| Genome | 14 normalized genes (hue, accent shift, saturation, depth, glass, radius, type scale, spacing, glow, habitat mode, habitat scale, metabolism, entropy, cell density) |
| Phenotype | Genes map to CSS custom properties + canvas wallpaper parameters — nothing visual is hardcoded |
| Selection | You pick specimens in the Evolution Chamber (up to 2 parents) |
| Crossover | Uniform — each child gene comes from a random parent |
| Mutation | Per-gene gaussian jitter at an adjustable mutation rate |
| Heredity | Every hatched generation is archived in the Lineage and can be resurrected |

## Apps (in the dock)

- **🧪 Evolution Chamber** — breed six offspring, select parents, HATCH one to make it the living OS
- **🎛️ Gene Editor** — direct germline editing with live re-expression
- **🧬 DNA Viewer** — the genome serialized to a 56 bp ACGT sequence; copy it, share it, inject someone else's
- **🌳 Lineage** — every generation the OS has ever been; tap to resurrect
- **⌨️ Bio-shell** — terminal: `mutate`, `evolve`, `seed <text>`, `load <gen>`, `dna`, `reset`
- **ℹ️ About**

## Run it

Zero build, zero dependencies, one file:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory apps/genetic-os
# → http://localhost:8000
```

Works offline once loaded. Genome + lineage persist in `localStorage`. Touch-friendly
(windows are draggable via pointer events; layout adapts under 640px for iPhone).

## Fun things to try

- `seed rhythmix` in the bio-shell — grows a deterministic genome from any text
- Copy your DNA sequence from the DNA Viewer and inject it on another device — same OS grows
- Crank the mutation slider to 0.9 and breed a few generations of chaos, then resurrect GEN 000
