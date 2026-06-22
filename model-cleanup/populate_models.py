#!/usr/bin/env python3
"""Auto-populate models.yaml by fuzzy-matching a model across providers.

Providers name the same underlying model differently (``glm-5.1`` vs ``glm-5-1``
vs ``glm-5p1``; ``z-ai/glm-5`` vs ``glm-5``). This script fetches each provider's
live catalogue and uses tiered fuzzy matching to find the best id for a
canonical key, writing the result into models.yaml.

Matching tiers (highest score wins regardless of API order):
    1.00  exact id match
    0.90  id matches with a vendor prefix stripped (z-ai/glm-5.1 <-> glm-5.1)
    0.85  normalized forms equal (case, separators, p-as-point)
    0.75  normalized forms equal with one trailing suffix stripped
    0.60  substring fallback (only when nothing better exists)

NOTE: populate_models.py rewrites the entire models.yaml via yaml.dump, so any
hand-written comments are lost. A .yaml.backup is written before each save.
"""

import argparse
import os
import re
import shutil
import sys
from typing import Dict, List, Optional, Tuple

import yaml

from cleanup_base import (
    DEFAULT_CONFIG,
    DEFAULT_MODELS_CONFIG,
    DEFAULT_PROVIDERS_CONFIG,
    ProviderManager,
    configure_logging,
    logger,
    make_cleaner,
)

TRAILING_SUFFIXES = (":free", "-fw", "-el", "-t", "-it")


def normalize(text: str) -> str:
    """Lowercase, drop separators, treat 'p' between digits as a decimal point."""
    text = text.lower()
    text = re.sub(r"(\d)p(\d)", r"\1.\2", text)        # 5p1 -> 5.1
    text = re.sub(r"[\s_/:-]+", "", text)               # drop separators
    text = text.replace(".", "")                        # 5.1 -> 51 for comparison
    return text


def strip_one_suffix(model_id: str) -> str:
    for suffix in TRAILING_SUFFIXES:
        if model_id.endswith(suffix):
            return model_id[: -len(suffix)]
    return model_id


def score(key: str, model_id: str) -> float:
    """Score a candidate provider model id against the canonical key."""
    if key == model_id:
        return 1.00
    # vendor prefix stripped, e.g. z-ai/glm-5.1 -> glm-5.1
    if "/" in model_id and model_id.split("/", 1)[1] == key:
        return 0.90
    nk, nm = normalize(key), normalize(model_id)
    # also consider the vendor-stripped form for normalization
    nm_tail = normalize(model_id.split("/", 1)[1]) if "/" in model_id else nm
    if nk in (nm, nm_tail):
        return 0.85
    if normalize(strip_one_suffix(key)) in (normalize(strip_one_suffix(model_id)),
                                             normalize(strip_one_suffix(model_id.split("/")[-1]))):
        return 0.75
    if nk and (nk in nm or nm in nk):
        return 0.60
    return 0.0


def best_match(key: str, model_ids: List[str]) -> Optional[Tuple[str, float]]:
    best, best_score = None, 0.0
    for model_id in model_ids:
        s = score(key, model_id)
        if s > best_score:
            best, best_score = model_id, s
    return (best, best_score) if best else None


def load_models_yaml(path: str) -> Dict:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as fh:
            return yaml.safe_load(fh) or {}
    return {}


def save_models_yaml(path: str, data: Dict, dry_run: bool) -> None:
    if dry_run:
        logger.info("[DRY-RUN] Would write %s", path)
        return
    if os.path.exists(path):
        shutil.copyfile(path, f"{path}.backup")
        logger.info("Backed up existing models.yaml to %s.backup", path)
    with open(path, "w", encoding="utf-8") as fh:
        yaml.dump(data, fh, sort_keys=False, default_flow_style=False)
    logger.info("Wrote %s", path)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Populate models.yaml via fuzzy matching")
    parser.add_argument("model_key", help="Canonical model key (e.g. minimax-m3, glm-5.1)")
    parser.add_argument("--display-name", help="Display name (default: MODEL_KEY)")
    parser.add_argument("--description", default="", help="Description for the entry")
    parser.add_argument("--provider", help="Comma-separated subset of providers")
    parser.add_argument("--providers-config", default=DEFAULT_PROVIDERS_CONFIG)
    parser.add_argument("--models-config", default=DEFAULT_MODELS_CONFIG)
    parser.add_argument("--config", default=DEFAULT_CONFIG)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--force", action="store_true", help="Overwrite an existing entry")
    parser.add_argument("--skip-existing", action="store_true",
                        help="Leave a pre-existing entry alone")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    configure_logging(args.verbose)

    models_data = load_models_yaml(args.models_config)
    models_data.setdefault("models", {})
    key = args.model_key

    if key in models_data["models"]:
        if args.skip_existing:
            logger.info("Entry '%s' already exists; --skip-existing set, nothing to do", key)
            return 0
        if not args.force:
            logger.error("Entry '%s' already exists. Use --force to overwrite or "
                         "--skip-existing to leave it.", key)
            return 1

    manager = ProviderManager(args.providers_config)
    targets = ([p.strip() for p in args.provider.split(",")] if args.provider
               else manager.names())

    matches: Dict[str, str] = {}
    for name in targets:
        try:
            cleaner = make_cleaner(manager.get(name), args.config)
        except KeyError as exc:
            logger.warning("%s", exc)
            continue
        try:
            available = cleaner.fetch_available_models()
        except Exception as exc:  # network / parse — keep going across providers
            logger.warning("Could not fetch %s catalogue: %s", name, exc)
            continue
        result = best_match(key, list(available.keys()))
        if result:
            model_id, s = result
            logger.info("%-14s match: %-40s score=%.2f", name, model_id, s)
            matches[name] = model_id
        else:
            logger.info("%-14s no match", name)

    if not matches:
        logger.error("No matches found for '%s' across providers", key)
        return 1

    models_data["models"][key] = {
        "display_name": args.display_name or key,
        "description": args.description,
        "providers": matches,
    }
    save_models_yaml(args.models_config, models_data, args.dry_run)
    logger.info("✅ Populated '%s' with %d provider match(es)", key, len(matches))
    return 0


if __name__ == "__main__":
    sys.exit(main())
