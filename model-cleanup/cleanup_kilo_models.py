#!/usr/bin/env python3
"""Kilo-specific model cleanup."""

from cleanup_base import run_provider_cli

PROVIDER = "kilo"

if __name__ == "__main__":
    run_provider_cli(PROVIDER)
