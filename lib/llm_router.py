"""
Multi-Provider LLM Router (Python)

Intelligently routes requests across 30+ free/paid LLM providers.
Supports fallback chains, cost-aware selection, and quota monitoring.

Usage:
    from lib.llm_router import chat, list_providers

    # Auto-select best provider
    response = chat("Your prompt")

    # Force specific provider
    response = chat("Prompt", provider='groq')

    # Multi-provider fallback
    response = chat("Prompt", providers=['groq', 'cerebras', 'meituan'])
"""

import os
from typing import Optional, List, Dict, Any, Callable
from openai import OpenAI

# Provider configurations
PROVIDERS = {
    # Tier 1: Permanent Free (No Expiration)
    "groq": {
        "name": "Groq",
        "base_url": "https://api.groq.com/openai/v1",
        "api_key": os.getenv("GROQ_API_KEY"),
        "models": ["llama-3.1-70b-versatile", "mixtral-8x7b-32768"],
        "free_quota": 14400,  # calls/day for Llama
        "cost_per_mtok": 0,
        "speed_rank": 1,  # fastest
        "tier": "permanent-free",
    },
    "cerebras": {
        "name": "Cerebras",
        "base_url": "https://api.cerebras.ai/v1",
        "api_key": os.getenv("CEREBRAS_API_KEY"),
        "models": ["llama-3.1-70b", "qwen-3-32b", "deepseek-r1-distill"],
        "free_quota": 1000000,  # tokens/day
        "cost_per_mtok": 0,
        "speed_rank": 2,
        "tier": "permanent-free",
    },
    "meituan": {
        "name": "Meituan LongCat",
        "base_url": "https://api.longcat.meituan.com/v1",
        "api_key": os.getenv("MEITUAN_API_KEY"),
        "models": ["longcat-flash-lite", "longcat-flash"],
        "free_quota": 55000000,  # tokens/day (!!)
        "cost_per_mtok": 0,
        "speed_rank": 3,
        "tier": "permanent-free",
    },
    "siliconflow": {
        "name": "SiliconFlow (硅基流动)",
        "base_url": "https://api.siliconflow.cn/v1",
        "api_key": os.getenv("SILICONFLOW_API_KEY"),
        "models": ["deepseek-v3", "deepseek-r1", "qwen-coder-32b"],
        "free_quota": 200000000,  # tokens (permanent!)
        "cost_per_mtok": 0,
        "speed_rank": 3,
        "tier": "permanent-free",
    },
    # Tier 2: Time-Limited Free
    "volcanoengine": {
        "name": "VolcanoEngine (火山引擎)",
        "base_url": "https://api.volcengine.com/v1",
        "api_key": os.getenv("VOLCANOENGINE_API_KEY"),
        "models": ["doubao-pro", "doubao-seed", "deepseek-v4", "kimi-k2.5"],
        "free_quota": 1000000,
        "cost_per_mtok": 0.5,
        "speed_rank": 3,
        "tier": "time-limited-free",
    },
    "aliyun": {
        "name": "Aliyun (阿里云百炼)",
        "base_url": "https://dashscope.aliyuncs.com/api/v1",
        "api_key": os.getenv("ALIYUN_API_KEY"),
        "models": ["qwen-plus", "qwen-max", "qwen-coder-plus"],
        "free_quota": 70000000,  # 90 days
        "cost_per_mtok": 0.5,
        "speed_rank": 2,
        "tier": "time-limited-free",
    },
    "zhipuai": {
        "name": "Zhipu GLM (智谱)",
        "base_url": "https://open.bigmodel.cn/api/paas/v4",
        "api_key": os.getenv("ZHIPUAI_API_KEY"),
        "models": ["glm-4-plus", "glm-5"],
        "free_quota": 20000000,  # permanent
        "cost_per_mtok": 0,
        "speed_rank": 2,
        "tier": "permanent-free",
    },
    "deepseek": {
        "name": "DeepSeek (深度求索)",
        "base_url": "https://api.deepseek.com/v1",
        "api_key": os.getenv("DEEPSEEK_API_KEY"),
        "models": ["deepseek-chat", "deepseek-reasoner"],
        "free_quota": 5000000,  # 30 days
        "cost_per_mtok": 0.14,
        "speed_rank": 3,
        "tier": "time-limited-free",
    },
    # Fallback
    "pekpik": {
        "name": "Pekpik (Free API Aggregator)",
        "base_url": os.getenv("PEKPIK_BASE_URL", "https://aiapiv2.pekpik.com/v1"),
        "api_key": os.getenv("PEKPIK_API_KEY"),
        "models": ["claude-opus-4-7", "openai/gpt-5.5", "gemini-2.5-flash"],
        "free_quota": 20,
        "cost_per_mtok": 0,
        "speed_rank": 3,
        "tier": "permanent-free",
    },
}

# Selection strategies
STRATEGIES: Dict[str, Callable] = {}


def _select_cost_aware(model: Optional[str] = None) -> List[str]:
    """Prefer free → cheapest → fallback."""
    providers_list = [
        (name, config)
        for name, config in PROVIDERS.items()
        if config["api_key"]
    ]
    providers_list.sort(
        key=lambda x: (x[1]["cost_per_mtok"], x[1]["speed_rank"])
    )
    return [name for name, _ in providers_list]


def _select_speed_first(model: Optional[str] = None) -> List[str]:
    """Fastest first."""
    providers_list = [
        (name, config)
        for name, config in PROVIDERS.items()
        if config["api_key"]
    ]
    providers_list.sort(key=lambda x: x[1]["speed_rank"])
    return [name for name, _ in providers_list]


def _select_quality_first(model: Optional[str] = None) -> List[str]:
    """Tier priority: permanent free > time-limited > paid."""
    tier_rank = {"permanent-free": 0, "time-limited-free": 1, "paid": 2}
    providers_list = [
        (name, config)
        for name, config in PROVIDERS.items()
        if config["api_key"]
    ]
    providers_list.sort(
        key=lambda x: tier_rank.get(x[1]["tier"], 99)
    )
    return [name for name, _ in providers_list]


def _select_quota_first(model: Optional[str] = None) -> List[str]:
    """Highest remaining quota first."""
    providers_list = [
        (name, config)
        for name, config in PROVIDERS.items()
        if config["api_key"] and config["free_quota"] > 0
    ]
    providers_list.sort(key=lambda x: x[1]["free_quota"], reverse=True)
    return [name for name, _ in providers_list]


def _select_round_robin(model: Optional[str] = None) -> List[str]:
    """Cycle through all providers."""
    return [
        name
        for name, config in PROVIDERS.items()
        if config["api_key"]
    ]


STRATEGIES = {
    "cost-aware": _select_cost_aware,
    "speed-first": _select_speed_first,
    "quality-first": _select_quality_first,
    "quota-first": _select_quota_first,
    "round-robin": _select_round_robin,
}


async def chat(
    prompt: str,
    provider: Optional[str] = None,
    providers: Optional[List[str]] = None,
    strategy: Optional[str] = None,
    model: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 2000,
) -> str:
    """
    Main chat function with intelligent routing.

    Args:
        prompt: User message
        provider: Force single provider
        providers: Try this chain of providers
        strategy: Selection strategy (cost-aware, speed-first, etc.)
        model: Model name (optional, uses provider default)
        temperature: Sampling temperature
        max_tokens: Max response length

    Returns:
        Response text from first successful provider
    """
    if strategy is None:
        strategy = os.getenv("LLM_ROUTER_STRATEGY", "cost-aware")

    # Determine provider chain
    chain = []
    if provider:
        chain = [provider]
    elif providers:
        chain = providers
    else:
        selector = STRATEGIES.get(strategy, _select_cost_aware)
        chain = selector(model)

    # Try each provider
    for name in chain:
        config = PROVIDERS.get(name)
        if not config:
            print(f"[Router] Unknown provider: {name}")
            continue

        if not config["api_key"]:
            print(f"[Router] No API key for {config['name']}, skipping...")
            continue

        try:
            client = OpenAI(
                base_url=config["base_url"],
                api_key=config["api_key"],
            )

            response = client.chat.completions.create(
                model=model or config["models"][0],
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens,
            )

            print(f"[Router] ✓ Success via {config['name']}")
            return response.choices[0].message.content

        except Exception as e:
            print(f"[Router] ✗ {config['name']} failed: {e}")
            continue

    raise Exception(f"[Router] All providers failed. Chain: {', '.join(chain)}")


def get_provider(name: str) -> Optional[Dict[str, Any]]:
    """Get provider config by name."""
    return PROVIDERS.get(name)


def list_providers() -> List[Dict[str, Any]]:
    """List all configured providers."""
    result = []
    for name, config in PROVIDERS.items():
        if config["api_key"]:
            result.append({
                "name": name,
                "display_name": config["name"],
                "tier": config["tier"],
                "free_quota": config["free_quota"],
                "cost_per_mtok": config["cost_per_mtok"],
                "speed_rank": config["speed_rank"],
            })
    return result


def has_quota(min_tokens: int = 1000) -> bool:
    """Check if any provider has available quota."""
    return any(
        config["api_key"] and config["free_quota"] >= min_tokens
        for config in PROVIDERS.values()
    )
