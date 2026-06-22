#!/usr/bin/env python3
"""Poe-specific model cleanup."""

from cleanup_base import run_provider_cli

PROVIDER = "poe"

if __name__ == "__main__":
    run_provider_cli(PROVIDER)
