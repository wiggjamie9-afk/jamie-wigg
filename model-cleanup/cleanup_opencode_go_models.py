#!/usr/bin/env python3
"""OpenCode Go-specific model cleanup.

OpenCode Go is OpenAI/Anthropic-compatible and routes by model id prefix
(``openai/``, ``dashscope/``, ``anthropic/``) to a matching api_base. The
routing table lives under ``prefix_routing`` in providers.yaml and is applied by
ConfigDrivenModelCleaner._api_base_for, so this subclass exists mainly to make
the bespoke behaviour explicit and registered.
"""

from cleanup_base import (
    ConfigDrivenModelCleaner,
    register_cleaner,
    run_provider_cli,
)

PROVIDER = "opencode-go"


class OpenCodeGoModelCleaner(ConfigDrivenModelCleaner):
    """Prefix-routed cleaner; routing handled via cfg.prefix_routing."""


register_cleaner(PROVIDER, OpenCodeGoModelCleaner)


if __name__ == "__main__":
    run_provider_cli(PROVIDER)
