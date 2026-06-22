#!/usr/bin/env python3
"""OpenRouter-specific model cleanup.

OpenRouter exposes many models in both paid and free (``:free``) flavours. When
adding a model we register both variants under the same model_name so LiteLLM
load-balances across them.
"""

from cleanup_base import (
    ConfigDrivenModelCleaner,
    register_cleaner,
    run_provider_cli,
)

PROVIDER = "openrouter"


class OpenRouterModelCleaner(ConfigDrivenModelCleaner):
    def expand_new_entries(self, model_id, available, taken, existing_ids, model_name):
        base_id = model_id[:-5] if model_id.endswith(":free") else model_id
        if base_id not in available and not self.is_special(base_id):
            from cleanup_base import logger
            logger.warning("Model '%s' not found in %s API - skipping", base_id, self.provider_name)
            return [None]
        if base_id in existing_ids:
            from cleanup_base import logger
            logger.info("Model '%s' already present - skipping", base_id)
            return []
        name = model_name or self.generate_model_name(base_id, taken)
        entries = [{
            "model_name": name,
            "litellm_params": self.litellm_params_for(base_id, available.get(base_id)),
        }]
        free_id = f"{base_id}:free"
        if self.cfg.free_variants and free_id in available:
            entries.append({
                "model_name": name,
                "litellm_params": self.litellm_params_for(free_id, available.get(free_id)),
            })
        return entries


register_cleaner(PROVIDER, OpenRouterModelCleaner)


if __name__ == "__main__":
    run_provider_cli(PROVIDER)
