#!/usr/bin/env python3
"""Unified model-cleanup entry point.

Process every provider at once (``--provider all``) or a single provider, with
the same flags as the provider-specific scripts plus ``--add-mapped-model`` for
multi-provider additions defined in models.yaml.

Examples:
    python cleanup_models.py --provider all --dry-run --verbose
    python cleanup_models.py --provider openrouter --add-model mistralai/mistral-medium
    python cleanup_models.py --provider all --add-mapped-model glm-5
    python cleanup_models.py --provider all --delete-model "model-a" "model-b" --dry-run
"""

import argparse
import sys

from cleanup_base import (
    DEFAULT_MODELS_CONFIG,
    DEFAULT_PROVIDERS_CONFIG,
    UnifiedModelCleaner,
    configure_logging,
)

# Importing the provider modules registers their bespoke cleaner subclasses
# (OpenRouter free twins, OpenCode Go prefix routing) via register_cleaner().
import cleanup_openrouter_models  # noqa: F401
import cleanup_opencode_go_models  # noqa: F401


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Unified LiteLLM model cleanup")
    parser.add_argument("--provider", required=True,
                        help="Provider name or 'all'")
    parser.add_argument("--config", default="config.yaml", help="Path to config file")
    parser.add_argument("--providers-config", default=DEFAULT_PROVIDERS_CONFIG)
    parser.add_argument("--models-config", default=DEFAULT_MODELS_CONFIG)
    parser.add_argument("--dry-run", action="store_true", help="Preview changes only")
    parser.add_argument("--verbose", action="store_true", help="Detailed logging")
    parser.add_argument("--add-model", nargs="+", metavar="MODEL_ID",
                        help="Add one or more models (space-separated)")
    parser.add_argument("--add-mapped-model", metavar="NAME",
                        help="Add a model defined in models.yaml across providers")
    parser.add_argument("--delete-model", nargs="+", metavar="NAME",
                        help="Delete one or more models by model_name")
    parser.add_argument("--model-name", help="Custom name (single-model additions only)")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    configure_logging(args.verbose)

    if args.model_name and args.add_model and len(args.add_model) > 1:
        print("Error: --model-name can only be used when adding a single model", file=sys.stderr)
        return 2

    unified = UnifiedModelCleaner(args.config, args.providers_config)

    if args.provider != "all" and args.provider not in unified.cleaners:
        print(f"Error: unknown provider '{args.provider}'. "
              f"Known: all, {', '.join(unified.manager.names())}", file=sys.stderr)
        return 2

    try:
        if args.add_mapped_model:
            unified.add_mapped(args.add_mapped_model, args.dry_run, args.verbose,
                               args.models_config)
        elif args.add_model:
            unified.add(args.provider, args.add_model, args.dry_run, args.verbose,
                        args.model_name)
        elif args.delete_model:
            unified.delete(args.provider, args.delete_model, args.dry_run, args.verbose)
        else:
            unified.validate(args.provider, args.dry_run, args.verbose)
    except (FileNotFoundError, KeyError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
