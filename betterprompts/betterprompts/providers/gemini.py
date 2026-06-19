import warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="google.*")
import google.generativeai as genai  # noqa: E402
from google.api_core.exceptions import ResourceExhausted
from .base import ProviderError, RateLimitError


class GeminiProvider:
    def __init__(self, api_key: str, model: str = "gemini-2.5-flash-lite"):
        if not api_key:
            raise ProviderError("Gemini API key not provided")
        self.api_key = api_key
        self.model = model
        genai.configure(api_key=api_key)

    def improve(self, system: str, user: str) -> str:
        try:
            model = genai.GenerativeModel(self.model)
            response = model.generate_content(
                f"{system}\n\n{user}",
                safety_settings=[
                    {
                        "category": "HARM_CATEGORY_UNSPECIFIED",
                        "threshold": "BLOCK_NONE",
                    }
                ],
            )
            if response.text:
                return response.text
            raise ProviderError("Gemini returned empty response")
        except ResourceExhausted as e:
            raise RateLimitError(f"Gemini rate limit exceeded: {e}")
        except Exception as e:
            if "quota" in str(e).lower():
                raise RateLimitError(f"Gemini quota exceeded: {e}")
            raise ProviderError(f"Gemini error: {e}")
