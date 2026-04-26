# Setup scripts

Run these on **your own machine** (Linux or macOS). The Claude Code sandbox is ephemeral — anything installed there disappears.

## Prerequisites

Install whichever you need depending on the tools you want:

- `git`, `curl`, `unzip` — required by most scripts
- `python3` and `pipx` — for Sherlock and Wifiphisher
- `go` (1.21+) — preferred for Nuclei (falls back to binary download)
- `java` (JDK 17+) — required for Ghidra

On Debian/Ubuntu:
```
sudo apt update
sudo apt install -y git curl unzip python3 python3-pip pipx golang openjdk-17-jdk
```

On macOS (with Homebrew):
```
brew install git curl pipx go openjdk@17
```

## Scripts

### `install-security-tools.sh`

Installs the 7 OSINT/security tools to `~/security-tools/`.

```
# Install everything
bash setup/install-security-tools.sh

# Install only specific tools
bash setup/install-security-tools.sh sherlock nuclei seclists
```

Valid names: `sherlock`, `ghidra`, `nuclei`, `wifiphisher`, `seclists`, `phoneinfoga`, `lazagne`.

Notes:
- **Wifiphisher** only supports Linux and needs a wireless adapter with monitor-mode support. The script clones it but does not run `sudo setup.py install` — do that yourself when you're ready.
- **SecLists** is ~10GB.
- **LaZagne** is Windows-focused; on Linux/macOS only a subset works. Use the prebuilt `.exe` from its releases page on Windows.
- **Ghidra** needs JDK 17+ on PATH.

### `install-ai-repos.sh`

Clones reference AI repos to `~/ai-repos/`:

```
bash setup/install-ai-repos.sh
```

- `patchy631/ai-engineering-hub` — 75+ open-source AI projects
- `x1xhlol/system-prompts-and-models-of-ai-tools` — leaked system prompts

## Legal & ethical use

Only run these tools against systems you own or are explicitly authorized to test. Wifiphisher, LaZagne, and credential-recovery tooling are illegal to use against others without permission in most jurisdictions.
