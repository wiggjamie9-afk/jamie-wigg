#!/usr/bin/env python3
"""Requesty-specific model cleanup (preserves existing names for load balancing)."""

from cleanup_base import run_provider_cli

PROVIDER = "requesty"

if __name__ == "__main__":
    run_provider_cli(PROVIDER)
