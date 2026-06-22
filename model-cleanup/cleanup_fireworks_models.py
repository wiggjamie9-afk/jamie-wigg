#!/usr/bin/env python3
"""Fireworks-specific model cleanup."""

from cleanup_base import run_provider_cli

PROVIDER = "fireworks"

if __name__ == "__main__":
    run_provider_cli(PROVIDER)
