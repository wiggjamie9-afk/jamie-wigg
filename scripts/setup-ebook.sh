#!/usr/bin/env bash
# setup-ebook.sh — install the e-book publishing toolchain used by books/ and /ebook.
#
# Core (required): pandoc (EPUB + the universal engine) + weasyprint (HTML/CSS -> PDF).
# Optional upgrades: quarto (book projects, multi-format) + typst (design-forward PDFs).
#
# Idempotent: skips anything already present. Safe to re-run.
set -euo pipefail

say(){ printf '\033[1;33m»\033[0m %s\n' "$*"; }
ok(){ printf '\033[1;32m✓\033[0m %s\n' "$*"; }
have(){ command -v "$1" >/dev/null 2>&1; }

SUDO=""; [ "$(id -u)" -ne 0 ] && have sudo && SUDO="sudo"

# ---- pandoc (required) -------------------------------------------------------
if have pandoc; then ok "pandoc $(pandoc --version | head -1 | awk '{print $2}') already installed"
else
  say "installing pandoc…"
  if have apt-get; then $SUDO apt-get update -qq && $SUDO apt-get install -y pandoc
  elif have brew; then brew install pandoc
  elif have dnf; then $SUDO dnf install -y pandoc
  else echo "!! install pandoc manually: https://pandoc.org/installing.html"; fi
  have pandoc && ok "pandoc installed"
fi

# ---- weasyprint (required for PDF) ------------------------------------------
if python3 -c "import weasyprint" 2>/dev/null; then ok "weasyprint already installed"
else
  say "installing weasyprint (PDF engine)…"
  # weasyprint needs pango/cairo/gdk-pixbuf at runtime; apt provides them on Debian/Ubuntu.
  if have apt-get; then $SUDO apt-get install -y libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf-2.0-0 libffi-dev libcairo2 2>/dev/null || true; fi
  pip3 install --quiet weasyprint || pip3 install --quiet --user weasyprint
  python3 -c "import weasyprint" 2>/dev/null && ok "weasyprint installed"
fi

# ---- optional: quarto (book projects) ---------------------------------------
if have quarto; then ok "quarto already installed"
else
  say "quarto is optional — install for native multi-format book projects:"
  echo "    https://quarto.org/docs/download/  (or: brew install quarto)"
fi

# ---- optional: typst (design-forward PDFs) ----------------------------------
if have typst; then ok "typst already installed"
else
  say "typst is optional — modern PDF engine (pandoc --pdf-engine=typst):"
  echo "    cargo install --locked typst-cli   # or a release binary from github.com/typst/typst"
fi

echo
ok "core toolchain ready. Build a book with:  bash books/<slug>/build.sh"
