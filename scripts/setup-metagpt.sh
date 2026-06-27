#!/usr/bin/env bash
# Install MetaGPT (geekan/MetaGPT) in an ISOLATED venv so it never collides with
# the RHYTHMIX toolchain. MetaGPT pins numpy 1.24.3, which conflicts with
# kokoro-onnx (HyperFrames TTS needs numpy>=2.0.2) — keep it in its own env.
#
# Usage:  bash scripts/setup-metagpt.sh [venv_dir]
# Then:   source <venv_dir>/bin/activate
#         metagpt --init-config        # edit ~/.metagpt/config2.yaml, add your LLM api_key
#         metagpt "Create a 2048 game" # generates a repo in ./workspace
#
# Requires: Python >=3.9 and <3.12 (3.11 recommended). Node + pnpm for full use.
set -euo pipefail

VENV="${1:-.venv-metagpt}"

PYVER="$(python3 -c 'import sys;print("%d.%d"%sys.version_info[:2])')"
case "$PYVER" in
  3.9|3.10|3.11) : ;;
  *) echo "MetaGPT needs Python >=3.9,<3.12 — found $PYVER. Use pyenv/conda to get 3.11." >&2; exit 1 ;;
esac

echo ">> creating venv at $VENV (python $PYVER)"
python3 -m venv "$VENV"
# shellcheck disable=SC1091
source "$VENV/bin/activate"

python -m pip install -q --upgrade pip
# setuptools>=81 removed distutils install_layout, which breaks the setup.py
# builds of fire/jieba/python-docx/ta that MetaGPT depends on. Pin it.
python -m pip install -q "setuptools<81" wheel

echo ">> pre-building the legacy setup.py deps"
python -m pip install "fire" "jieba" "python-docx" "ta"

echo ">> installing metagpt"
python -m pip install metagpt

python -c "import metagpt; print('MetaGPT import OK')"
echo
echo "Done. Next:"
echo "  source $VENV/bin/activate"
echo "  metagpt --init-config   # then add your LLM api_key to ~/.metagpt/config2.yaml"
echo "  metagpt \"Create a 2048 game\""
