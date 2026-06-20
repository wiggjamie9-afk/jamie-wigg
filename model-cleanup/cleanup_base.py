"""Core, config-driven logic shared by every model-cleanup script.

The public surface mirrors the architecture documented in README.md:

    BaseModelCleaner          abstract YAML load/save/sort/validate/update
    ConfigDrivenModelCleaner  concrete cleaner driven by providers.yaml
    ProviderManager           loads providers.yaml into ProviderConfig objects
    UnifiedModelCleaner       one ConfigDrivenModelCleaner per provider
    DetectionStrategy         prefix vs api_base model identification

Pricing units differ per provider, so everything that varies lives in
providers.yaml. Provider-specific scripts subclass ConfigDrivenModelCleaner
only when a provider needs genuinely bespoke behaviour (e.g. OpenRouter's free
twins, OpenCode Go's prefix routing).
"""

from __future__ import annotations

import argparse
import logging
import os
import re
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import requests
import yaml

logger = logging.getLogger("model_cleanup")

# LiteLLM-compatible sentinel cost for free models. Using a tiny non-zero value
# keeps LiteLLM from emitting "no pricing configured" warnings while still
# costing effectively nothing.
FREE_COST = 1e-09

DEFAULT_PROVIDERS_CONFIG = "providers.yaml"
DEFAULT_MODELS_CONFIG = "models.yaml"
DEFAULT_CONFIG = "config.yaml"


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def dig(obj: Any, dotted: Optional[str]) -> Any:
    """Walk a dotted path (``a.b.c``) through nested dicts; None if absent."""
    if not dotted:
        return None
    cur = obj
    for part in dotted.split("."):
        if isinstance(cur, dict):
            cur = cur.get(part)
        else:
            return None
    return cur


def to_cost(value: Any, scale: float) -> Optional[float]:
    """Coerce an API price into a per-token float, honouring the free sentinel."""
    if value is None:
        return None
    try:
        cost = float(value) * scale
    except (TypeError, ValueError):
        return None
    if cost <= 0:
        return FREE_COST
    return cost


def pct_change(old: Optional[float], new: Optional[float]) -> str:
    """Format a percentage delta for logging, e.g. ``(-70.0%)``."""
    if not old or old == 0 or new is None:
        return ""
    delta = (new - old) / old * 100.0
    return f" ({delta:+.1f}%)"


# --------------------------------------------------------------------------- #
# Provider configuration + detection strategies
# --------------------------------------------------------------------------- #
@dataclass
class ProviderConfig:
    name: str
    order: int = 999
    api_url: str = ""
    api_key_env: Optional[str] = None
    detection_strategy: str = "prefix"
    detection_value: str = ""
    litellm_prefix: str = ""
    api_base: Optional[str] = None
    name_prefix: str = ""
    models_key: Optional[str] = None
    id_field: str = "id"
    input_field: Optional[str] = None
    output_field: Optional[str] = None
    price_scale: float = 1.0
    all_free: bool = False
    free_variants: bool = False
    special_models: List[str] = field(default_factory=list)
    prefix_routing: Dict[str, str] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, name: str, raw: Dict[str, Any]) -> "ProviderConfig":
        detection = raw.get("detection", {}) or {}
        pricing = raw.get("pricing", {}) or {}
        return cls(
            name=name,
            order=raw.get("order", 999),
            api_url=raw.get("api_url", ""),
            api_key_env=raw.get("api_key_env"),
            detection_strategy=detection.get("strategy", "prefix"),
            detection_value=detection.get("value", ""),
            litellm_prefix=raw.get("litellm_prefix", ""),
            api_base=raw.get("api_base"),
            name_prefix=raw.get("name_prefix", ""),
            models_key=raw.get("models_key"),
            id_field=raw.get("id_field", "id"),
            input_field=pricing.get("input_field"),
            output_field=pricing.get("output_field"),
            price_scale=pricing.get("scale", 1.0),
            all_free=raw.get("all_free", False),
            free_variants=raw.get("free_variants", False),
            special_models=raw.get("special_models", []) or [],
            prefix_routing=raw.get("prefix_routing", {}) or {},
        )


class DetectionStrategy(ABC):
    """Decides whether a config entry belongs to a given provider."""

    def __init__(self, value: str):
        self.value = value

    @abstractmethod
    def matches(self, litellm_params: Dict[str, Any]) -> bool: ...


class PrefixDetectionStrategy(DetectionStrategy):
    def matches(self, litellm_params: Dict[str, Any]) -> bool:
        model = litellm_params.get("model", "") or ""
        return model.startswith(self.value)


class ApiBaseDetectionStrategy(DetectionStrategy):
    def matches(self, litellm_params: Dict[str, Any]) -> bool:
        api_base = litellm_params.get("api_base", "") or ""
        return api_base.rstrip("/") == self.value.rstrip("/")


def build_detection_strategy(cfg: ProviderConfig) -> DetectionStrategy:
    if cfg.detection_strategy == "api_base":
        return ApiBaseDetectionStrategy(cfg.detection_value)
    return PrefixDetectionStrategy(cfg.detection_value)


# --------------------------------------------------------------------------- #
# Base cleaner
# --------------------------------------------------------------------------- #
class BaseModelCleaner(ABC):
    """YAML load/save/sort/validate/cost-update shared by all providers."""

    def __init__(self, config_path: str = DEFAULT_CONFIG):
        self.config_path = config_path
        self.config: Dict[str, Any] = {}

    # ---- YAML I/O --------------------------------------------------------- #
    def load_config(self) -> None:
        if not os.path.exists(self.config_path):
            raise FileNotFoundError(f"Configuration file not found: {self.config_path}")
        logger.info("Loading configuration from %s", self.config_path)
        with open(self.config_path, "r", encoding="utf-8") as fh:
            self.config = yaml.safe_load(fh) or {}
        self.config.setdefault("model_list", [])

    def save_config(self, dry_run: bool = False) -> None:
        if dry_run:
            logger.info("[DRY-RUN] No changes made to file. Use without --dry-run to apply changes.")
            return
        with open(self.config_path, "w", encoding="utf-8") as fh:
            yaml.dump(self.config, fh, sort_keys=False, default_flow_style=False)
        logger.info("Saved configuration to %s", self.config_path)

    @property
    def model_list(self) -> List[Dict[str, Any]]:
        return self.config.setdefault("model_list", [])

    def sort_models(self) -> None:
        """Alphabetically sort by model_name, then litellm model string."""
        self.model_list.sort(
            key=lambda m: (
                str(m.get("model_name", "")).lower(),
                str((m.get("litellm_params") or {}).get("model", "")).lower(),
            )
        )

    # ---- Provider-specific hooks ----------------------------------------- #
    @abstractmethod
    def fetch_available_models(self) -> Dict[str, Dict[str, Any]]:
        """Return ``{model_id: {input_cost_per_token, output_cost_per_token}}``."""

    @abstractmethod
    def is_provider_model(self, entry: Dict[str, Any]) -> bool: ...

    @abstractmethod
    def litellm_params_for(self, model_id: str) -> Dict[str, Any]:
        """Build litellm_params (model/api_base/costs) for a new model id."""

    @abstractmethod
    def generate_model_name(self, model_id: str, taken: set) -> str: ...

    @abstractmethod
    def is_special(self, model_id: str) -> bool: ...

    # ---- Operations ------------------------------------------------------- #
    def provider_entries(self) -> List[Dict[str, Any]]:
        return [m for m in self.model_list if self.is_provider_model(m)]

    def validate_and_update(self, dry_run: bool, verbose: bool) -> Dict[str, int]:
        """Remove deprecated models and sync costs against the live API."""
        entries = self.provider_entries()
        logger.info("Found %d %s models in configuration", len(entries), self.provider_name)
        available = self._safe_fetch()

        removed, updated = 0, 0
        if available is None:
            logger.warning("Skipping validation/cost-update (could not reach API)")
        else:
            survivors = []
            for entry in self.model_list:
                if not self.is_provider_model(entry):
                    survivors.append(entry)
                    continue
                model_id = self.model_id_of(entry)
                if model_id not in available and not self.is_special(model_id):
                    logger.info("Removing deprecated model '%s' (name: %s)",
                                model_id, entry.get("model_name"))
                    removed += 1
                    continue
                if self._apply_cost_update(entry, available.get(model_id), verbose):
                    updated += 1
                survivors.append(entry)
            self.config["model_list"] = survivors

        self.sort_models()
        if removed == 0 and updated == 0:
            logger.info("No cost updates needed - all costs are current")
            logger.info("✅ All %s models are valid with current costs", self.provider_name)
        else:
            logger.info("Identified %d models with cost updates; removed %d deprecated",
                        updated, removed)
            if dry_run:
                logger.info("[DRY-RUN] Would update %d models and remove %d", updated, removed)
        self.save_config(dry_run)
        return {"removed": removed, "updated": updated}

    def add_models(self, model_ids: List[str], dry_run: bool, verbose: bool,
                   model_name: Optional[str] = None) -> Dict[str, int]:
        if model_name and len(model_ids) > 1:
            raise ValueError("--model-name can only be used when adding a single model")
        available = self._safe_fetch() or {}
        taken = {m.get("model_name") for m in self.model_list}
        existing_ids = {self.model_id_of(m) for m in self.provider_entries()}

        added, failed = 0, 0
        for model_id in model_ids:
            for entry in self.expand_new_entries(model_id, available, taken, existing_ids,
                                                 model_name):
                if entry is None:
                    failed += 1
                    continue
                self.model_list.append(entry)
                taken.add(entry["model_name"])
                existing_ids.add(self.model_id_of(entry))
                params = entry["litellm_params"]
                logger.info("Added model '%s' with name '%s'", params["model"], entry["model_name"])
                logger.info("  Input cost: %s", params.get("input_cost_per_token"))
                logger.info("  Output cost: %s", params.get("output_cost_per_token"))
                added += 1

        self.sort_models()
        if added:
            logger.info("✅ Successfully added %d model(s)", added)
        if failed:
            logger.warning("⚠️  Failed to add %d model(s)", failed)
        self.save_config(dry_run)
        return {"added": added, "failed": failed}

    def delete_models(self, names: List[str], dry_run: bool, verbose: bool) -> Dict[str, int]:
        wanted = set(names)
        survivors, deleted = [], 0
        for entry in self.model_list:
            if entry.get("model_name") in wanted and self.is_provider_model(entry):
                logger.info("Deleting model '%s' (%s)", entry.get("model_name"),
                            self.model_id_of(entry))
                deleted += 1
                continue
            survivors.append(entry)
        self.config["model_list"] = survivors
        self.sort_models()
        logger.info("%sDeleted %d model(s)", "[DRY-RUN] Would have " if dry_run else "", deleted)
        self.save_config(dry_run)
        return {"deleted": deleted}

    # ---- Shared building blocks (overridable) ---------------------------- #
    def expand_new_entries(self, model_id, available, taken, existing_ids, model_name):
        """Yield the entries to add for a single model id (list of dict|None)."""
        if model_id not in available and not self.is_special(model_id):
            logger.warning("Model '%s' not found in %s API - skipping", model_id, self.provider_name)
            return [None]
        if model_id in existing_ids:
            logger.info("Model '%s' already present - skipping", model_id)
            return []
        name = model_name or self.generate_model_name(model_id, taken)
        return [{
            "model_name": name,
            "litellm_params": self.litellm_params_for(model_id, available.get(model_id)),
        }]

    def _safe_fetch(self) -> Optional[Dict[str, Dict[str, Any]]]:
        try:
            models = self.fetch_available_models()
            logger.info("Fetched %d available models from %s API", len(models), self.provider_name)
            return models
        except requests.RequestException as exc:
            logger.error("Error fetching models from API: %s", exc)
            return None

    def _apply_cost_update(self, entry, pricing, verbose) -> bool:
        if not pricing:
            return False
        params = entry.setdefault("litellm_params", {})
        changed = False
        for key, new in (("input_cost_per_token", pricing.get("input_cost_per_token")),
                         ("output_cost_per_token", pricing.get("output_cost_per_token"))):
            if new is None:
                continue
            old = params.get(key)
            if old != new:
                changed = True
                if verbose:
                    label = "Input" if key.startswith("input") else "Output"
                    logger.info("Cost update for %s (name: %s)",
                                params.get("model"), entry.get("model_name"))
                    logger.info("  %s cost: %s → %s%s", label, old, new, pct_change(old, new))
                params[key] = new
        return changed

    @property
    @abstractmethod
    def provider_name(self) -> str: ...

    @abstractmethod
    def model_id_of(self, entry: Dict[str, Any]) -> str: ...


# --------------------------------------------------------------------------- #
# Config-driven concrete cleaner
# --------------------------------------------------------------------------- #
class ConfigDrivenModelCleaner(BaseModelCleaner):
    """A BaseModelCleaner whose behaviour is fully described by ProviderConfig."""

    def __init__(self, cfg: ProviderConfig, config_path: str = DEFAULT_CONFIG):
        super().__init__(config_path)
        self.cfg = cfg
        self.detection = build_detection_strategy(cfg)

    @property
    def provider_name(self) -> str:
        return self.cfg.name

    # ---- API ------------------------------------------------------------- #
    def _headers(self) -> Dict[str, str]:
        headers = {"Accept": "application/json"}
        if self.cfg.api_key_env:
            key = os.environ.get(self.cfg.api_key_env)
            if key:
                headers["Authorization"] = f"Bearer {key}"
            else:
                logger.warning("%s not set; %s request may be unauthenticated",
                               self.cfg.api_key_env, self.cfg.name)
        return headers

    def fetch_available_models(self) -> Dict[str, Dict[str, Any]]:
        logger.info("Fetching available models with pricing from %s API...", self.cfg.name)
        resp = requests.get(self.cfg.api_url, headers=self._headers(), timeout=30)
        resp.raise_for_status()
        payload = resp.json()
        items = dig(payload, self.cfg.models_key) if self.cfg.models_key else payload
        if items is None:
            items = payload.get("data", []) if isinstance(payload, dict) else payload
        result: Dict[str, Dict[str, Any]] = {}
        for item in items or []:
            model_id = item.get(self.cfg.id_field) if isinstance(item, dict) else None
            if not model_id:
                continue
            result[model_id] = self.parse_model_pricing(item)
        return result

    def parse_model_pricing(self, item: Dict[str, Any]) -> Dict[str, Any]:
        if self.cfg.all_free:
            return {"input_cost_per_token": FREE_COST, "output_cost_per_token": FREE_COST}
        return {
            "input_cost_per_token": to_cost(dig(item, self.cfg.input_field), self.cfg.price_scale),
            "output_cost_per_token": to_cost(dig(item, self.cfg.output_field), self.cfg.price_scale),
        }

    # ---- Identification -------------------------------------------------- #
    def is_provider_model(self, entry: Dict[str, Any]) -> bool:
        return self.detection.matches(entry.get("litellm_params", {}) or {})

    def model_id_of(self, entry: Dict[str, Any]) -> str:
        model = (entry.get("litellm_params", {}) or {}).get("model", "") or ""
        if self.cfg.litellm_prefix and model.startswith(self.cfg.litellm_prefix):
            return model[len(self.cfg.litellm_prefix):]
        return model

    def is_special(self, model_id: str) -> bool:
        return model_id in self.cfg.special_models

    # ---- Construction of new entries ------------------------------------- #
    def _api_base_for(self, model_id: str) -> Optional[str]:
        for prefix, base in self.cfg.prefix_routing.items():
            if model_id.startswith(prefix):
                return base
        return self.cfg.api_base

    def litellm_params_for(self, model_id: str, pricing: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        pricing = pricing or {}
        params: Dict[str, Any] = {"model": f"{self.cfg.litellm_prefix}{model_id}"}
        api_base = self._api_base_for(model_id)
        if api_base:
            params["api_base"] = api_base
        if self.cfg.all_free:
            params["input_cost_per_token"] = FREE_COST
            params["output_cost_per_token"] = FREE_COST
        else:
            params["input_cost_per_token"] = pricing.get("input_cost_per_token", FREE_COST)
            params["output_cost_per_token"] = pricing.get("output_cost_per_token", FREE_COST)
        return params

    def generate_model_name(self, model_id: str, taken: set) -> str:
        slug = model_id.split("/")[-1]
        slug = re.sub(r"[^a-zA-Z0-9._-]+", "-", slug).strip("-").lower()
        base = f"{self.cfg.name_prefix}{slug}"
        candidate, i = base, 2
        while candidate in taken:
            candidate = f"{base}-{i}"
            i += 1
        return candidate


# --------------------------------------------------------------------------- #
# Provider registry + unified cleaner
# --------------------------------------------------------------------------- #
class ProviderManager:
    """Loads providers.yaml into ProviderConfig objects."""

    def __init__(self, providers_path: str = DEFAULT_PROVIDERS_CONFIG):
        self.providers_path = providers_path
        self.providers: Dict[str, ProviderConfig] = {}
        self.load()

    def load(self) -> None:
        if not os.path.exists(self.providers_path):
            raise FileNotFoundError(f"Providers file not found: {self.providers_path}")
        with open(self.providers_path, "r", encoding="utf-8") as fh:
            raw = yaml.safe_load(fh) or {}
        for name, cfg in (raw.get("providers") or {}).items():
            self.providers[name] = ProviderConfig.from_dict(name, cfg)

    def names(self) -> List[str]:
        return sorted(self.providers, key=lambda n: self.providers[n].order)

    def get(self, name: str) -> ProviderConfig:
        if name not in self.providers:
            raise KeyError(f"Unknown provider '{name}'. Known: {', '.join(self.names())}")
        return self.providers[name]


# Provider scripts that need bespoke behaviour register a subclass here.
_CLEANER_OVERRIDES: Dict[str, type] = {}


def register_cleaner(provider: str, cls: type) -> None:
    _CLEANER_OVERRIDES[provider] = cls


def make_cleaner(cfg: ProviderConfig, config_path: str) -> ConfigDrivenModelCleaner:
    cls = _CLEANER_OVERRIDES.get(cfg.name, ConfigDrivenModelCleaner)
    return cls(cfg, config_path)


class UnifiedModelCleaner:
    """Creates one cleaner per provider and delegates every operation."""

    def __init__(self, config_path: str = DEFAULT_CONFIG,
                 providers_path: str = DEFAULT_PROVIDERS_CONFIG):
        self.config_path = config_path
        self.manager = ProviderManager(providers_path)
        self.cleaners: Dict[str, ConfigDrivenModelCleaner] = {
            name: make_cleaner(self.manager.get(name), config_path)
            for name in self.manager.names()
        }

    def _run(self, provider: str, op, *args, **kwargs):
        cleaner = self.cleaners[provider]
        cleaner.load_config()
        result = op(cleaner, *args, **kwargs)
        return result

    def targets(self, provider: str) -> List[str]:
        return self.manager.names() if provider == "all" else [provider]

    def validate(self, provider, dry_run, verbose):
        for name in self.targets(provider):
            logger.info("=== %s ===", name)
            self._run(name, BaseModelCleaner.validate_and_update, dry_run, verbose)

    def add(self, provider, model_ids, dry_run, verbose, model_name=None):
        for name in self.targets(provider):
            logger.info("=== %s ===", name)
            self._run(name, BaseModelCleaner.add_models, model_ids, dry_run, verbose, model_name)

    def delete(self, provider, names, dry_run, verbose):
        for name in self.targets(provider):
            logger.info("=== %s ===", name)
            self._run(name, BaseModelCleaner.delete_models, names, dry_run, verbose)

    def add_mapped(self, mapped_key, dry_run, verbose, models_path=DEFAULT_MODELS_CONFIG):
        mapping = _load_mapped_model(models_path, mapped_key)
        providers = mapping.get("providers", {})
        for name, model_id in providers.items():
            if name not in self.cleaners:
                logger.warning("Provider '%s' in mapping not configured - skipping", name)
                continue
            logger.info("=== %s (mapped: %s) ===", name, mapped_key)
            self._run(name, BaseModelCleaner.add_models, [model_id], dry_run, verbose,
                      mapping.get("display_name"))


def _load_mapped_model(models_path: str, key: str) -> Dict[str, Any]:
    if not os.path.exists(models_path):
        raise FileNotFoundError(f"Models file not found: {models_path}")
    with open(models_path, "r", encoding="utf-8") as fh:
        raw = yaml.safe_load(fh) or {}
    models = raw.get("models", {})
    if key not in models:
        raise KeyError(f"Model '{key}' not defined in {models_path}")
    return models[key]


# --------------------------------------------------------------------------- #
# CLI helpers
# --------------------------------------------------------------------------- #
def configure_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


def add_common_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--config", default=DEFAULT_CONFIG, help="Path to config file")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes only")
    parser.add_argument("--verbose", action="store_true", help="Detailed logging")
    parser.add_argument("--add-model", nargs="+", metavar="MODEL_ID", help="Add one or more models")
    parser.add_argument("--delete-model", nargs="+", metavar="NAME", help="Delete models by name")
    parser.add_argument("--model-name", help="Custom name (single-model additions only)")


def dispatch(cleaner: BaseModelCleaner, args: argparse.Namespace) -> None:
    """Run the operation selected by parsed CLI args against one cleaner."""
    cleaner.load_config()
    if args.add_model:
        cleaner.add_models(args.add_model, args.dry_run, args.verbose, args.model_name)
    elif args.delete_model:
        cleaner.delete_models(args.delete_model, args.dry_run, args.verbose)
    else:
        cleaner.validate_and_update(args.dry_run, args.verbose)


def run_provider_cli(provider: str, providers_path: str = DEFAULT_PROVIDERS_CONFIG) -> None:
    """Standard ``main()`` for a provider-specific script."""
    parser = argparse.ArgumentParser(description=f"{provider} model cleanup")
    add_common_args(parser)
    args = parser.parse_args()
    configure_logging(args.verbose)
    manager = ProviderManager(providers_path)
    cleaner = make_cleaner(manager.get(provider), args.config)
    dispatch(cleaner, args)
