# System Setup Guide

## Requirements

### Required
- **Node.js 20+** — JavaScript runtime
- **pnpm 9+** — Package manager (faster than npm)
- **Git** — Version control
- **ffmpeg** — Video processing (for HyperFrames)

### Optional but Recommended
- **TypeScript** — Type checking
- **Supabase CLI** — Local database development
- **Playground** — Interactive testing

## Installation by OS

### macOS (Recommended for iMac)

```bash
# Using Homebrew (install brew first: https://brew.sh)
brew install node pnpm git ffmpeg

# Verify versions
node -v          # Should be v20+
pnpm -v          # Should be 9+
ffmpeg -version  # Should show version info
```

### Linux (Ubuntu/Debian)

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm
npm install -g pnpm

# ffmpeg
sudo apt-get install -y ffmpeg git

# Verify
node -v && pnpm -v && ffmpeg -version
```

### Windows

- **Node.js**: https://nodejs.org (20+)
- **pnpm**: `npm install -g pnpm`
- **Git**: https://git-scm.com
- **ffmpeg**: https://ffmpeg.org/download.html or `choco install ffmpeg`

---

## Verification

Run the automated check:

```bash
bash scripts/setup-system.sh
```

Should show:
```
✓ Node.js: v20.x.x
✓ pnpm: 9.x.x
✓ ffmpeg: ffmpeg version 6.x
✓ Git: git version 2.x.x
✓ TypeScript: Version 5.x.x (optional)
✓ Supabase CLI: 1.x.x (optional)
```

---

## Environment Setup

### 1. Global packages (one-time)

```bash
npm install -g pnpm supabase typescript @types/node
```

### 2. Project dependencies

```bash
# Agent Builder
cd agent-builder && npm install && cd ..

# MHDBDB (optional)
cd mhdbdb-tei-only && npm install && cd ..
```

### 3. Verify installations

```bash
# Agent Builder
cd agent-builder
npm run lint
npm run test
npm run build
cd ..
```

---

## Recommended Tools (Optional)

| Tool | Purpose | Install |
|------|---------|---------|
| **VS Code** | Code editor | https://code.microsoft.com |
| **Claude Code extension** | IDE integration | In VS Code Extensions |
| **Docker** | Container runtime | https://docker.com |
| **Insomnia** | API testing | https://insomnia.rest |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `pnpm: command not found` | Run `npm install -g pnpm` |
| `Node version too old` | Update from https://nodejs.org |
| `ffmpeg: command not found` | `brew install ffmpeg` (macOS) or see install guide |
| `Permission denied` scripts | Run `chmod +x scripts/*.sh` |
| Build fails with TS errors | Run `npm install` again, might be stale node_modules |

---

## Next Steps

1. ✅ Install system tools
2. ✅ Run `bash scripts/setup-system.sh`
3. ✅ Install project dependencies (`npm install`)
4. → Continue with Step 5: GitHub Integration Setup

