import pytest
from unittest.mock import Mock, patch, MagicMock
from betterprompts.providers.base import ProviderError, RateLimitError
from betterprompts.providers.gemini import GeminiProvider
from betterprompts.providers.groq import GroqProvider


class TestGeminiProviderInit:
    def test_init_with_valid_key(self):
        with patch("betterprompts.providers.gemini.genai") as mock_genai:
            provider = GeminiProvider("test_key", "gemini-2.5-flash-lite")
            assert provider.api_key == "test_key"
            assert provider.model == "gemini-2.5-flash-lite"
            mock_genai.configure.assert_called_once_with(api_key="test_key")

    def test_init_with_no_key_raises_error(self):
        with pytest.raises(ProviderError):
            GeminiProvider("", "gemini-2.5-flash-lite")

    def test_init_with_custom_model(self):
        with patch("betterprompts.providers.gemini.genai"):
            provider = GeminiProvider("test_key", "gemini-custom")
            assert provider.model == "gemini-custom"


class TestGeminiProviderImprove:
    def test_improve_returns_text(self):
        with patch("betterprompts.providers.gemini.genai") as mock_genai:
            mock_response = Mock()
            mock_response.text = "Improved prompt"
            mock_model = Mock()
            mock_model.generate_content.return_value = mock_response
            mock_genai.GenerativeModel.return_value = mock_model

            provider = GeminiProvider("test_key", "gemini-2.5-flash-lite")
            result = provider.improve("system prompt", "user prompt")
            assert result == "Improved prompt"

    def test_improve_empty_response_raises_error(self):
        with patch("betterprompts.providers.gemini.genai") as mock_genai:
            mock_response = Mock()
            mock_response.text = ""
            mock_model = Mock()
            mock_model.generate_content.return_value = mock_response
            mock_genai.GenerativeModel.return_value = mock_model

            provider = GeminiProvider("test_key", "gemini-2.5-flash-lite")
            with pytest.raises(ProviderError):
                provider.improve("system prompt", "user prompt")

    def test_improve_none_response_raises_error(self):
        with patch("betterprompts.providers.gemini.genai") as mock_genai:
            mock_response = Mock()
            mock_response.text = None
            mock_model = Mock()
            mock_model.generate_content.return_value = mock_response
            mock_genai.GenerativeModel.return_value = mock_model

            provider = GeminiProvider("test_key", "gemini-2.5-flash-lite")
            with pytest.raises(ProviderError):
                provider.improve("system prompt", "user prompt")


class TestGeminiProviderErrorMapping:
    def test_resource_exhausted_maps_to_rate_limit_error(self):
        with patch("betterprompts.providers.gemini.genai") as mock_genai:
            from google.api_core.exceptions import ResourceExhausted
            mock_model = Mock()
            mock_model.generate_content.side_effect = ResourceExhausted("Rate limit")
            mock_genai.GenerativeModel.return_value = mock_model

            provider = GeminiProvider("test_key", "gemini-2.5-flash-lite")
            with pytest.raises(RateLimitError):
                provider.improve("system prompt", "user prompt")

    def test_quota_error_maps_to_rate_limit_error(self):
        with patch("betterprompts.providers.gemini.genai") as mock_genai:
            mock_model = Mock()
            mock_model.generate_content.side_effect = Exception("quota exceeded")
            mock_genai.GenerativeModel.return_value = mock_model

            provider = GeminiProvider("test_key", "gemini-2.5-flash-lite")
            with pytest.raises(RateLimitError):
                provider.improve("system prompt", "user prompt")

    def test_generic_error_maps_to_provider_error(self):
        with patch("betterprompts.providers.gemini.genai") as mock_genai:
            mock_model = Mock()
            mock_model.generate_content.side_effect = Exception("Something went wrong")
            mock_genai.GenerativeModel.return_value = mock_model

            provider = GeminiProvider("test_key", "gemini-2.5-flash-lite")
            with pytest.raises(ProviderError):
                provider.improve("system prompt", "user prompt")


class TestGroqProviderInit:
    def test_init_with_valid_key(self):
        with patch("betterprompts.providers.groq.Groq") as mock_groq:
            provider = GroqProvider("test_key", "llama-3.3-70b-versatile")
            assert provider.api_key == "test_key"
            assert provider.model == "llama-3.3-70b-versatile"
            mock_groq.assert_called_once_with(api_key="test_key")

    def test_init_with_no_key_raises_error(self):
        with pytest.raises(ProviderError):
            GroqProvider("", "llama-3.3-70b-versatile")

    def test_init_with_custom_model(self):
        with patch("betterprompts.providers.groq.Groq"):
            provider = GroqProvider("test_key", "llama-custom")
            assert provider.model == "llama-custom"


class TestGroqProviderImprove:
    def test_improve_returns_text(self):
        with patch("betterprompts.providers.groq.Groq") as mock_groq:
            mock_response = Mock()
            mock_choice = Mock()
            mock_choice.message.content = "Improved prompt"
            mock_response.choices = [mock_choice]
            mock_client = Mock()
            mock_client.chat.completions.create.return_value = mock_response
            mock_groq.return_value = mock_client

            provider = GroqProvider("test_key", "llama-3.3-70b-versatile")
            result = provider.improve("system prompt", "user prompt")
            assert result == "Improved prompt"

    def test_improve_empty_response_raises_error(self):
        with patch("betterprompts.providers.groq.Groq") as mock_groq:
            mock_response = Mock()
            mock_response.choices = []
            mock_client = Mock()
            mock_client.chat.completions.create.return_value = mock_response
            mock_groq.return_value = mock_client

            provider = GroqProvider("test_key", "llama-3.3-70b-versatile")
            with pytest.raises(ProviderError):
                provider.improve("system prompt", "user prompt")

    def test_improve_none_content_raises_error(self):
        with patch("betterprompts.providers.groq.Groq") as mock_groq:
            mock_response = Mock()
            mock_choice = Mock()
            mock_choice.message.content = None
            mock_response.choices = [mock_choice]
            mock_client = Mock()
            mock_client.chat.completions.create.return_value = mock_response
            mock_groq.return_value = mock_client

            provider = GroqProvider("test_key", "llama-3.3-70b-versatile")
            with pytest.raises(ProviderError):
                provider.improve("system prompt", "user prompt")


class TestGroqProviderErrorMapping:
    def test_rate_limit_error_maps_correctly(self):
        with patch("betterprompts.providers.groq.Groq") as mock_groq:
            mock_client = Mock()
            mock_client.chat.completions.create.side_effect = Exception("rate_limit exceeded")
            mock_groq.return_value = mock_client

            provider = GroqProvider("test_key", "llama-3.3-70b-versatile")
            with pytest.raises(RateLimitError):
                provider.improve("system prompt", "user prompt")

    def test_quota_error_maps_correctly(self):
        with patch("betterprompts.providers.groq.Groq") as mock_groq:
            mock_client = Mock()
            mock_client.chat.completions.create.side_effect = Exception("quota exceeded")
            mock_groq.return_value = mock_client

            provider = GroqProvider("test_key", "llama-3.3-70b-versatile")
            with pytest.raises(RateLimitError):
                provider.improve("system prompt", "user prompt")

    def test_generic_error_maps_to_provider_error(self):
        with patch("betterprompts.providers.groq.Groq") as mock_groq:
            mock_client = Mock()
            mock_client.chat.completions.create.side_effect = Exception("Something went wrong")
            mock_groq.return_value = mock_client

            provider = GroqProvider("test_key", "llama-3.3-70b-versatile")
            with pytest.raises(ProviderError):
                provider.improve("system prompt", "user prompt")
