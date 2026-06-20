#!/usr/bin/env python3
"""Ollama-specific model cleanup (local models, free -> 1e-09 cost)."""

from cleanup_base import run_provider_cli

PROVIDER = "ollama"

if __name__ == "__main__":
    run_provider_cli(PROVIDER)
