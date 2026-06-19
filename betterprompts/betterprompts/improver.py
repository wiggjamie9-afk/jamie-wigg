from .config import get_config
from .providers.base import ProviderError, RateLimitError
from .providers.gemini import GeminiProvider
from .providers.groq import GroqProvider


class PromptImprover:
    def __init__(self):
        self.config = get_config()

    def improve(self, user_prompt: str, mode: str = "Beautify", target_language: str = None) -> tuple:
        """Improve a prompt using Gemini, falling back to Groq if needed.

        Args:
            user_prompt: The prompt to improve
            mode: The improvement mode (Beautify, Clarify, Translate)
            target_language: Target language for Translate mode

        Returns:
            Tuple of (improved_prompt, provider_name)
        """
        from .prompts import get_system_prompt

        system_prompt = get_system_prompt(mode)
        if target_language:
            system_prompt += f"\nTranslate to: {target_language}"

        improved = self._try_gemini(system_prompt, user_prompt)
        if improved:
            return improved, "Gemini"

        improved = self._try_groq(system_prompt, user_prompt)
        if improved:
            return improved, "Groq"

        raise ProviderError("Both Gemini and Groq providers failed. Check your API keys.")

    def _try_gemini(self, system_prompt: str, user_prompt: str) -> str | None:
        try:
            if not self.config.gemini_api_key:
                return None
            provider = GeminiProvider(
                self.config.gemini_api_key,
                self.config.gemini_model,
            )
            return provider.improve(system_prompt, user_prompt)
        except (ProviderError, RateLimitError):
            return None
        except Exception:
            return None

    def _try_groq(self, system_prompt: str, user_prompt: str) -> str | None:
        try:
            if not self.config.groq_api_key:
                return None
            provider = GroqProvider(
                self.config.groq_api_key,
                self.config.groq_model,
            )
            return provider.improve(system_prompt, user_prompt)
        except (ProviderError, RateLimitError):
            return None
        except Exception:
            return None
