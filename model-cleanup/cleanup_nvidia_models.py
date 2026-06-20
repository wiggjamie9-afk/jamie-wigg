#!/usr/bin/env python3
"""Nvidia NIM-specific model cleanup (all models free -> 1e-09 cost)."""

from cleanup_base import run_provider_cli

PROVIDER = "nvidia"

if __name__ == "__main__":
    run_provider_cli(PROVIDER)
