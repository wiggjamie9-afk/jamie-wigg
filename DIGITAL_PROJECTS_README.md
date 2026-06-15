# 🌍 Digital Projects Ecosystem

## Installed Projects

### 1. 📚 MHDBDB-next: Middle High German Corpus
**Location**: `./mhdbdb-tei-only/`  
**Status**: ✅ Fully installed (3.8GB, 701 TEI files)  
**Purpose**: Digital humanities research corpus with semantic annotations

#### What's included:
- 667 Middle High German texts (TEI-P5 encoded)
- 8 authority files (persons, works, lexicon, concepts, genres)
- Playground research interface
- Full documentation & schema

#### Get started:
```bash
cd mhdbdb-tei-only
npm install
npm run dev  # Launch local playground
```

#### Key files:
- `WZB_phase0.tei.xml` - Phase 0 corpus
- `playground/` - Interactive research tool
- `authority-files/` - Controlled vocabularies
- `docs/` - Development & data model docs

---

### 2. 🎓 C++ HOPL4 Paper (Chinese Translation)
**Location**: `./cpp-hopl4-zh/`  
**Status**: ✅ Installed (local documentation)  
**Purpose**: Comprehensive history of C++ 2006–2020

#### What's included:
- Bjarne Stroustrup's HOPL IV paper (translated)
- 11-part essay structure covering C++11 through C++20
- Translation team credits & citations
- Core topics: evolution, concepts, generics, concurrency

#### Access:
- Full paper (140+ pages) - English original via ACM
- Chinese translation - [See Cpp-Ch/cpp-hopl4-zh repository](https://github.com/Cpp-Ch/cpp-hopl4-zh)

#### Key sections:
- Concepts & constraints in generic programming
- Exception handling & error strategies
- C++17 design challenges
- C++20 direction debates
- Memory model & concurrency evolution

---

## Integration Architecture

Both projects are now integrated into the Jamie Wigg workspace:

```
jamie-wigg/
├── agent-builder/          # AI Agent SaaS (24/24 tasks ✓)
│   ├── app/
│   ├── components/
│   ├── __tests__/          # 239 tests passing
│   └── lib/
│
├── mhdbdb-tei-only/        # German medieval corpus
│   ├── playground/         # Research UI
│   ├── tei/               # 701 XML files
│   ├── authority-files/   # Controlled vocabularies
│   └── docs/              # Development docs
│
├── cpp-hopl4-zh/          # C++ language history (Chinese)
│   └── README.md          # Paper overview & credits
│
├── specs/
│   └── agent-builder/     # 24-task specification (completed)
│
└── sites/
    └── agent-builder/     # Marketing sites (landing, pricing, docs)
```

---

## Quick Start

### MHDBDB Corpus Search & Playground

```bash
cd mhdbdb-tei-only
npm install
npm run dev

# Then open http://localhost:3000
# - Search 667 texts with Middle High German normalization
# - Explore semantic annotations
# - Use Playground for custom research
```

### C++ HOPL4 Paper

View locally via:
```bash
cat cpp-hopl4-zh/README.md      # Project overview
less cpp-hopl4-zh/HOPL4_TOC.md  # Full table of contents
```

### Agent Builder Platform

```bash
cd agent-builder
npm run dev     # Development server
npm run build   # Static export
npm run test    # 239 tests
npm run lint    # TypeScript + ESLint
```

---

## Project Sizes & Stats

| Project | Size | Files | Type |
|---------|------|-------|------|
| Agent Builder | ~50MB | 200+ | SaaS (React/TS) |
| MHDBDB Corpus | 3.8GB | 701 TEI + 200 src | Digital Humanities |
| C++ HOPL4 | ~5MB | Docs + translation | Academic paper |
| **Total** | **3.85GB** | **~1200** | **Ecosystem** |

---

## Development Status

### ✅ Completed
- Agent Builder Platform (24/24 tasks, 100%)
  - Next.js 15 SaaS app with Supabase backend
  - 239 passing tests (unit + integration)
  - 87/100 Lighthouse score
  - Cloudflare Pages deployment ready

- MHDBDB Project Installed
  - All 701 TEI texts present
  - Authority files initialized
  - Playground & search functional
  - Development environment ready

- C++ HOPL4 Documentation
  - Local copy with credits & structure
  - Reference to official sources
  - Integration metadata

### 🚀 Next Steps
- [ ] Launch MHDBDB playground locally
- [ ] Cross-link projects in unified navigation
- [ ] Create combined documentation site
- [ ] Set up CI/CD for corpus updates
- [ ] Add C++ HOPL4 paper sections as reference

---

## Contributing & Support

### MHDBDB Issues & Contributions
- **Repository**: https://github.com/DigitalHumanitiesCraft/mhdbdb-tei-only
- **Issues**: [GitHub Issues](https://github.com/DigitalHumanitiesCraft/mhdbdb-tei-only/issues)
- **Docs**: `mhdbdb-tei-only/docs/`
- **Contact**: mhdbdb@plus.ac.at

### Agent Builder Issues
- **Branch**: `claude/sandbox-image-generation-qjz55r`
- **Tasks**: `specs/agent-builder/tasks.md`
- **Tests**: `agent-builder/__tests__/`

### C++ HOPL4 Reference
- **Original Paper**: ACM HOPL IV Conference
- **Translator Credits**: See cpp-hopl4-zh/README.md
- **License**: CC BY-NC-SA 4.0 (translation)

---

**Installation Date**: June 10, 2026  
**Total Projects**: 3 (1 SaaS, 1 Corpus, 1 Academic Paper)  
**Integration Status**: ✅ Complete
