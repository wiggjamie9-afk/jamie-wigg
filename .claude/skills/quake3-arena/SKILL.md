---
name: quake3-arena
description: Quake III Arena GPL source reference and compilation guide. Open-source 3D game engine with modular architecture (engine, game logic, tools). Cross-platform support (Win32, Linux, macOS). Reference for building lightweight offline-capable games, map editing pipelines, and low-end device optimization. Perfect for 100 APPS mission tactical games for underserved markets.
metadata:
  tags: game-engine, quake3, gpl, open-source, game-development, offline-games, tactical-games, map-editor, compilation
---

## When to use

User asks for:
- "How do I compile Quake III engine?"
- "Create a lightweight tactical game for offline use"
- "Build a game optimized for $30 Android phones"
- "Learn from game engine architecture patterns"
- "Set up a game map editor workflow"
- "Understand modular game code organization"

Perfect for:
- 100 APPS mission tactical/strategy games
- Offline-first games for underserved markets
- Low-end device optimization (Android 5+, 512MB RAM)
- Understanding GPL-licensed game engine architecture
- Cross-platform compilation strategy
- Map editor and content pipeline design

## Overview

Quake III Arena is a professional 3D game engine released under GPL by id Software. It demonstrates production-grade game architecture with clean separation between:

- **Engine** — rendering, physics, networking, file I/O
- **Game Code** — logic, AI, rule systems (shipped as bytecode VMs)
- **Tools** — map editor (Q3Radiant), map compiler (q3map), bot route compiler (bspc)
- **Build System** — cross-platform compilation with cons (Perl-based, pre-dates SCons)

**Release Status**: Fully open-source, GPL v2, third-party libs properly licensed (zlib, JPEG, MD4, etc.)

## Architecture

### Directory Structure

```
code/                          # Core engine and game source
├── game/                      # Game logic (AI, weapons, rules)
├── cgame/                     # Client game (HUD, rendering hints)
├── q3_ui/ & ui/              # Menu system
├── qcommon/                   # Shared engine code
├── client/                    # Client-side rendering, input, sound
├── server/                    # Server logic, entity management
├── renderer/                  # OpenGL rendering pipeline
├── botlib/                    # Bot AI and pathfinding
├── jpeg-6/                    # JPEG codec library
└── win32/, unix/, macosx/    # OS-specific implementations

lcc/                           # Retargetable C compiler (generates Q3VM bytecode)
q3asm/                         # Bytecode assembler
q3map/                         # Map compiler (.map → .bsp)
q3radiant/                     # Map editor (build 200f)
code/bspc/                     # Bot route compiler
```

### Module Overview

| Module | Purpose | Lines | Language |
|--------|---------|-------|----------|
| **Engine** | Core runtime, networking, file I/O | ~45K | C |
| **Game** | Game rules, weapons, AI logic | ~25K | C |
| **Client** | Rendering, HUD, input | ~30K | C |
| **Renderer** | OpenGL pipeline, texture management | ~35K | C |
| **BotLib** | Pathfinding, AI decision making | ~15K | C |
| **Tools** | Compilation, editing, routing | ~20K | C++ |

**Total**: ~170K lines of compilable source code.

## Build System

### Platform-Specific Builds

#### Windows (VC7/Visual Studio 2003)

**Project Files:**
```
code/quake3.sln              # Main engine + game
q3radiant/Radiant.sln        # Map editor
```

**QVM Compilation** (game bytecode):
```bash
# Requires: lcc.exe, q3cpp.exe, q3rcc.exe, q3asm.exe
# Precompiled binaries in: lcc/bin/ and code/win32/mod-sdk-setup/bin/

cd code/game
compile_game.bat             # Generates game.qvm

cd code/cgame
compile_cgame.bat            # Generates cgame.qvm

cd code/ui
compile_ui.bat               # Generates ui.qvm
```

#### GNU/Linux

**Build System**: cons (Perl-based predecessor to SCons)

**Requirements:**
- GCC 2.95 compatible
- NASM (assembler)
- X11 dev headers (libX11-dev, libxpm-dev, libxext-dev, libxvideo-dev)
- ALSA dev headers (optional, for sound)

**Typical Compile:**
```bash
cd code
./unix/cons -- gcc=gcc-2.95 g++=g++-2.95
```

**Output:**
```
build-linux-i386/         # Compiled binaries and qvm files
├── quake3.x86            # Main executable
├── baseq3/
│   ├── qvm/
│   │   ├── game.qvm
│   │   ├── cgame.qvm
│   │   └── ui.qvm
│   └── pak0.pk3          # Asset container
```

#### macOS (OSX)

**Project File:**
```
code/macosx/Quake3.pbproj  # Project Builder format
```

**Xcode Compilation:**
```bash
open code/macosx/Quake3.pbproj
# Build → Run (in Xcode IDE)
```

## Key Technologies

### Q3VM (Quake III Virtual Machine)

Game logic runs in a **sandboxed bytecode VM** instead of native code:

**Advantages:**
- Security (no direct hardware access from game DLLs)
- Portability (VM bytecode identical across platforms)
- Safety (bounds checking, stack protection)
- Mod compatibility (game code updates without engine rebuild)

**Compilation Pipeline:**
```
C source code → lcc (compile to assembly)
                  ↓
          q3rcc (C preprocessor)
                  ↓
          q3asm (bytecode assembler)
                  ↓
          game.qvm (portable bytecode)
```

### Networking Architecture

**Client-Server Model:**
- Clients send **command snapshots** (input)
- Server broadcasts **entity state snapshots** (game world)
- ~30 Hz tickrate for competitive play
- Prediction and lag compensation built-in

**Bandwidth Optimization:**
- Huffman compression for snapshots
- Delta compression (only transmit changes)
- ~4KB/sec per player at 30 Hz

### Asset System (PK3 Files)

Game assets stored in **.pk3 containers** (ZIP-based):
```
baseq3.pk3/
├── pak0.pk3              # Core game assets
├── textures/             # .tga files
├── models/               # .md3 (vertex-animated models)
├── sprites/              # Particle systems
├── sound/                # .wav audio
└── maps/
    ├── q3dm1.bsp         # Compiled map
    └── q3dm1.aas         # AI routing file
```

## Map System

### Map Compilation Pipeline

```
Map Editor (.map file)
        ↓
q3map (compiler)
        ↓
q3map -light (lighting pass)
        ↓
bspc (AI routing)
        ↓
Game-Ready .bsp + .aas files
```

**Q3Radiant Features:**
- Real-time preview
- Texture mapping
- Entity placement (spawns, weapons, objectives)
- Light configuration
- Brush-based geometry

**Output Files:**
- **.bsp** — Compiled map geometry and lightmaps
- **.aas** — Area Awareness System (bot pathfinding)

## Licensing & Third-Party Code

### GPL v2 Core
The entire engine and game logic are GPL v2.

### Third-Party Libraries (Permissive Licenses)

| Library | Files | Purpose | License |
|---------|-------|---------|---------|
| **zlib** | unzip.c (4299 lines) | ZIP file I/O | Zlib (permissive) |
| **MD4** | md4.c (299 lines) | Checksums | RSA (permissive) |
| **JPEG** | jpeg-6/ | Image codec | IJG (permissive) |
| **ADPCM** | snd_adpcm.c (330 lines) | Audio codec | Permissive |
| **libc** | bg_lib.c (1324 lines) | Standard lib | BSD-2 |

**Key Rule**: If distributing modified source, all GPL sections must stay GPL. Third-party libs can be distributed under their original licenses (compatible with GPL).

## Compilation on Modern Systems

### Challenges on Current Hardware

The original codebase targets **GCC 2.95** (released 2001). Modern compilers require updates:

**Common Issues:**
- Implicit function declarations (now errors)
- Missing `#include` directives
- Non-ISO C constructs
- Signed/unsigned comparison warnings
- Inline assembly syntax changes

**Solutions:**

1. **Use container approach** (recommended):
   ```bash
   docker run -it ubuntu:16.04 bash
   apt-get install gcc-2.95 nasm x11-dev
   # Compile inside container
   ```

2. **Update toolchain** (moderate effort):
   - Patch source for GCC 4.x/5.x compatibility
   - Fix inline assembly for modern syntax
   - Add missing includes

3. **Reference cleaned forks**:
   - ioquake3 (community maintained)
   - OpenArena (derived project)
   - ReactQuake3

### Modern Build Example (Linux, GCC 11+)

```bash
# Clone with patches applied
git clone https://github.com/ioquake/ioq3.git
cd ioq3
make
# Outputs to build/release-linux-x86_64/ioquake3.x86_64
```

## 100 APPS Mission Application

### Tactical Game for Offline Markets

**Concept**: Simplified grid-based strategy game (farmer resource management):

**Architecture** (based on Q3 patterns):

```
Engine Layer
├── Physics (tile-based movement)
├── Networking (removed for offline)
├── Rendering (OpenGL ES 2.0 for mobile)
└── Audio (minimal, low-bandwidth)
    ↓
Game Logic (QVM-style bytecode)
├── Turn management
├── Resource economy
├── NPC AI (pathfinding from BotLib)
└── Win/lose conditions
    ↓
Assets (PK3-style container)
├── Textures (64×64, low-res)
├── Models (low-poly)
├── Maps (10-15 tiles)
└── Audio (8-bit sampled)
    ↓
Final: ~50MB APK, 512MB RAM baseline
```

**Key Optimizations** (from Q3 approach):

1. **Bytecode VM** → Reduces native code footprint
2. **Binary asset format** → No XML/JSON parsing overhead
3. **Predictable memory** → Pre-allocated pools (no malloc in game loop)
4. **Network-free** → No server connectivity (single-player only)
5. **Fixed-function rendering** → OpenGL ES 1.x (older phones)

### Multiplayer for Unconnected Communities

**Q3-style LAN mode** (no internet required):

```
Device A                   Device B
(WiFi Direct)
├─ Listens on 27960/udp
└─ Accepts commands
                    Sends snapshots every 33ms
                    (LAN latency ~5-20ms)
```

Works with any local network (school Wi-Fi, community center mesh).

## Development Workflow

### Rapid Prototyping (Q3 Approach)

```
1. Map Design (Q3Radiant)
   └─ Create test level in 30 min

2. Game Logic (C code, QVM compilation)
   └─ Iterate in 5-10 min cycles

3. Testing (run engine with qvm)
   └─ Immediate feedback

4. Asset Tweaking
   └─ Reload without recompile
```

**vs. traditional rebuild**: No full engine recompile for logic changes (major speedup).

### Modding Support

The QVM system enables **safe user mods**:

```
Community Member
  ├─ Downloads source game.c
  ├─ Modifies rules
  └─ Compiles to game.qvm
         ↓
Server
  ├─ Loads custom game.qvm
  └─ No engine changes needed
```

Perfect for game jams or community-driven game evolution.

## File Reference

| File | Purpose | Lines |
|------|---------|-------|
| `code/qcommon/q_shared.h` | Shared constants, data types | 500 |
| `code/qcommon/q_math.c` | Vector/matrix math | 800 |
| `code/renderer/tr_main.c` | Rendering pipeline | 3000+ |
| `code/server/sv_main.c` | Server tick, entity updates | 2000+ |
| `code/client/cl_main.c` | Client-side logic | 2500+ |
| `code/game/g_main.c` | Game module entry | 200 |
| `code/game/ai_main.c` | Bot AI tick | 1500+ |
| `q3radiant/radiant/mainframe.cpp` | Map editor main window | 1000+ |

## Performance Characteristics

### Original System (Q3 release, 2000)

| Metric | Value | Hardware |
|--------|-------|----------|
| **FPS** | 60+ | GeForce4 Ti, 256MB RAM |
| **Map Size** | 8-16 MB (compiled) | 1024×1024 typical |
| **Network** | 4KB/sec @ 30 Hz | Modem-friendly |
| **Startup** | 15-20 sec | 7200 RPM HDD |

### Mobile Adaptation Target (100 APPS)

| Metric | Target | Notes |
|--------|--------|-------|
| **FPS** | 30 stable | Android 5+, Mali T720 |
| **Map Size** | 2-4 MB | 256×256 grid |
| **Network** | 0 KB/sec | Offline only |
| **Memory** | 256MB peak | Shared OS/app |
| **Startup** | 3-5 sec | Flash storage |

## Compilation Troubleshooting

### Issue: "cons command not found"

**Solution**: cons is a Perl script in `code/unix/`
```bash
cd code
./unix/cons -- gcc=gcc-4.9 g++=g++-4.9
```

### Issue: Missing X11 headers on Linux

**Solution**: Install X11 dev packages
```bash
# Ubuntu/Debian
sudo apt-get install libx11-dev libxext-dev libxpm-dev libxvideo-dev

# RHEL/CentOS
sudo yum install libX11-devel libXext-devel libXpm-devel libXvideo-devel
```

### Issue: "undefined reference to alsa"

**Solution**: Install ALSA dev (or disable with `--no-alsa`)
```bash
sudo apt-get install libasound2-dev
```

### Issue: Inline assembly errors (GCC 4.9+)

**Fix**: Update asm constraints
```c
// Old (GCC 2.95)
asm volatile("pushl %%eax" : : : "eax");

// New (GCC 4.9+)
asm volatile("pushl %%eax" ::: "eax", "memory");
```

## Modern Alternatives & References

### Community Maintained Forks

| Project | Status | Focus |
|---------|--------|-------|
| **ioquake3** | Active | Modern toolchain, cross-platform |
| **OpenArena** | Maintained | Community assets, GPL content |
| **ReactQuake3** | Experimental | WebGL/React port |

### Learning Resources

- **Source Code Tour**: Start with `code/qcommon/q_shared.h` (type system)
- **Entity System**: `code/server/g_main.c` (game loop, entity ticking)
- **Rendering**: `code/renderer/tr_main.c` (command buffer, shader system)
- **Networking**: `code/server/sv_snapshot.c` (state serialization)

## Integration with 100 APPS Pipeline

### From Video to Game

**Workflow:**
```
1. HyperFrames video (describe game concept)
   └─ `/rhythmix-new` or `/dream`

2. Game asset generation
   └─ Stylized textures via FLUX/DOP

3. Game code (Q3 approach)
   └─ QVM bytecode for logic, assets in PK3

4. Mobile build
   └─ APK via Gradle + Android SDK

5. Distribution
   └─ Play Store + direct download
```

### Asset Pipeline Integration

```
Design → FLUX (textures) → Q3Map (compile)
Audio → TTS (Kokoro) → WAV (compress)
Config → JSON → PK3 (binary pack)
```

## Summary

Quake III Arena represents **production-grade game architecture** optimized for:

✅ **Modular code** — Clean separation (engine/game/tools)  
✅ **Safety** — Sandboxed game logic (VM)  
✅ **Portability** — Cross-platform source  
✅ **Performance** — Low-bandwidth networking, efficient rendering  
✅ **Extensibility** — Mod-friendly bytecode system  
✅ **Documentation** — 20+ year lifespan means patterns well-understood  

**For 100 APPS**: Use Q3 architecture as blueprint for offline tactical games targeting $30 phones with 512MB RAM. The bytecode VM approach + binary asset format directly translates to the ~50MB APK constraint.

