#!/usr/bin/env bash
# Installs the 7 OSINT/security tools cataloged in security-and-ai-tools.md
# Target: Linux or macOS. Run on your own machine, not in a Claude sandbox.
#
# Usage:
#   bash setup/install-security-tools.sh                  # install all
#   bash setup/install-security-tools.sh sherlock nuclei  # install specific tools
#
# Tools install to: $HOME/security-tools/
# Binaries that go on PATH end up in $HOME/.local/bin or $(go env GOPATH)/bin.

set -euo pipefail

TOOLS_DIR="${HOME}/security-tools"
mkdir -p "$TOOLS_DIR"

OS="$(uname -s)"
case "$OS" in
    Linux*)  PLATFORM=linux ;;
    Darwin*) PLATFORM=macos ;;
    *)       echo "Unsupported OS: $OS"; exit 1 ;;
esac

log()  { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*" >&2; }
err()  { printf '\033[1;31m[err]\033[0m %s\n'  "$*" >&2; }

need() {
    command -v "$1" >/dev/null 2>&1 || {
        err "Missing prerequisite: $1. Install it and re-run."
        return 1
    }
}

# ---------- Sherlock (Python) ----------
install_sherlock() {
    log "Installing Sherlock"
    if command -v pipx >/dev/null 2>&1; then
        pipx install --force sherlock-project
    else
        warn "pipx not found, falling back to pip --user"
        need python3 || return 1
        python3 -m pip install --user --upgrade sherlock-project
    fi
    log "Run with: sherlock <username>"
}

# ---------- Ghidra (Java) ----------
install_ghidra() {
    log "Installing Ghidra"
    need curl || return 1
    need unzip || return 1
    if ! command -v java >/dev/null 2>&1; then
        warn "Java 17+ required for Ghidra. Install JDK 17 or later, then re-run."
        return 1
    fi
    cd "$TOOLS_DIR"
    if [ -d ghidra ]; then
        warn "ghidra/ already exists in $TOOLS_DIR — skipping. Delete it to reinstall."
        return 0
    fi
    # Get the latest release URL from the GitHub API
    local url
    url="$(curl -sSL https://api.github.com/repos/NationalSecurityAgency/ghidra/releases/latest \
        | grep -oE 'https://[^"]+ghidra_[0-9._]+_PUBLIC_[0-9]+\.zip' | head -n1)"
    if [ -z "$url" ]; then
        err "Could not resolve Ghidra download URL. Get it manually from https://github.com/NationalSecurityAgency/ghidra/releases"
        return 1
    fi
    curl -L -o ghidra.zip "$url"
    unzip -q ghidra.zip
    rm ghidra.zip
    mv ghidra_* ghidra
    log "Run with: $TOOLS_DIR/ghidra/ghidraRun"
}

# ---------- Nuclei (Go) ----------
install_nuclei() {
    log "Installing Nuclei"
    if command -v go >/dev/null 2>&1; then
        go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
        log "Run with: nuclei -u <target>  (ensure \$(go env GOPATH)/bin is on PATH)"
    else
        warn "Go not found. Falling back to prebuilt binary download."
        need curl || return 1
        need unzip || return 1
        cd "$TOOLS_DIR"
        local arch; arch="$(uname -m)"
        case "$arch" in
            x86_64|amd64) arch=amd64 ;;
            arm64|aarch64) arch=arm64 ;;
            *) err "Unsupported arch: $arch"; return 1 ;;
        esac
        local url
        url="$(curl -sSL https://api.github.com/repos/projectdiscovery/nuclei/releases/latest \
            | grep -oE 'https://[^"]+nuclei_[0-9.]+_'"${PLATFORM}"'_'"${arch}"'\.zip' | head -n1)"
        [ -z "$url" ] && { err "Could not resolve nuclei download URL"; return 1; }
        curl -L -o nuclei.zip "$url"
        unzip -o -q nuclei.zip -d nuclei
        rm nuclei.zip
        log "Run with: $TOOLS_DIR/nuclei/nuclei -u <target>"
    fi
}

# ---------- Wifiphisher (Python, Linux only, requires root for runtime) ----------
install_wifiphisher() {
    log "Installing Wifiphisher"
    if [ "$PLATFORM" != linux ]; then
        warn "Wifiphisher only supports Linux. Skipping on $PLATFORM."
        return 0
    fi
    need git || return 1
    need python3 || return 1
    cd "$TOOLS_DIR"
    if [ ! -d wifiphisher ]; then
        git clone https://github.com/wifiphisher/wifiphisher.git
    fi
    cd wifiphisher
    warn "wifiphisher's setup.py requires root and a wireless adapter that supports monitor mode."
    warn "When you're ready: cd $TOOLS_DIR/wifiphisher && sudo python3 setup.py install"
    log "Cloned to $TOOLS_DIR/wifiphisher (not yet installed system-wide)"
}

# ---------- SecLists (wordlists, ~10GB) ----------
install_seclists() {
    log "Installing SecLists (large download — 10GB+)"
    need git || return 1
    cd "$TOOLS_DIR"
    if [ -d SecLists ]; then
        warn "SecLists already cloned — pulling latest"
        cd SecLists && git pull --ff-only
    else
        git clone --depth=1 https://github.com/danielmiessler/SecLists.git
    fi
    log "Wordlists at: $TOOLS_DIR/SecLists"
}

# ---------- PhoneInfoga (Go) ----------
install_phoneinfoga() {
    log "Installing PhoneInfoga"
    need curl || return 1
    cd "$TOOLS_DIR"
    mkdir -p phoneinfoga && cd phoneinfoga
    bash <(curl -sSL https://raw.githubusercontent.com/sundowndev/phoneinfoga/master/support/scripts/install)
    log "Run with: $TOOLS_DIR/phoneinfoga/phoneinfoga scan -n '+33xxxxxxxxx'"
}

# ---------- LaZagne (Python, primarily Windows) ----------
install_lazagne() {
    log "Installing LaZagne"
    need git || return 1
    cd "$TOOLS_DIR"
    if [ ! -d LaZagne ]; then
        git clone https://github.com/AlessandroZ/LaZagne.git
    fi
    warn "LaZagne is Windows-focused. On Linux/macOS only browser/Wi-Fi modules work; most credential stores are Windows-only."
    warn "On Windows, prebuilt .exe is available at https://github.com/AlessandroZ/LaZagne/releases"
    log "Source at: $TOOLS_DIR/LaZagne (cd into Linux/ or Mac/ subdir to run)"
}

# ---------- Driver ----------
ALL=(sherlock ghidra nuclei wifiphisher seclists phoneinfoga lazagne)
TARGETS=("${@:-${ALL[@]}}")

for t in "${TARGETS[@]}"; do
    case "$t" in
        sherlock)    install_sherlock ;;
        ghidra)      install_ghidra ;;
        nuclei)      install_nuclei ;;
        wifiphisher) install_wifiphisher ;;
        seclists)    install_seclists ;;
        phoneinfoga) install_phoneinfoga ;;
        lazagne)     install_lazagne ;;
        *) err "Unknown tool: $t (valid: ${ALL[*]})" ;;
    esac
done

log "Done. Tools installed under: $TOOLS_DIR"
