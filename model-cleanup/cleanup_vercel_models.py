#!/usr/bin/env python3
"""Vercel AI Gateway-specific model cleanup."""

from cleanup_base import run_provider_cli

PROVIDER = "vercel"

if __name__ == "__main__":
    run_provider_cli(PROVIDER)
