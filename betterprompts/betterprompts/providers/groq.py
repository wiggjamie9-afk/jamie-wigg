from groq import Groq
from .base import ProviderError, RateLimitError


class GroqProvider:
    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        if not api_key:
            raise ProviderError("Groq API key not provided")
        self.api_key = api_key
        self.model = model
        self.client = Groq(api_key=api_key)

    def improve(self, system: str, user: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
            )
            if response.choices and response.choices[0].message.content:
                return response.choices[0].message.content
            raise ProviderError("Groq returned empty response")
        except Exception as e:
            error_str = str(e).lower()
            if "rate_limit" in error_str or "quota" in error_str:
                raise RateLimitError(f"Groq rate limit exceeded: {e}")
            raise ProviderError(f"Groq error: {e}")
