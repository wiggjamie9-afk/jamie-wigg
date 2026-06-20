#!/usr/bin/env python3
"""OpenCode Zen-specific model cleanup."""

from cleanup_base import run_provider_cli

PROVIDER = "opencode-zen"

if __name__ == "__main__":
    run_provider_cli(PROVIDER)
