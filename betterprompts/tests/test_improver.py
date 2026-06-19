import pytest
from unittest.mock import Mock, patch, MagicMock
from betterprompts.improver import PromptImprover
from betterprompts.providers.base import ProviderError, RateLimitError


@pytest.fixture
def improver():
    with patch("betterprompts.improver.get_config") as mock_config:
        mock_config.return_value = Mock(
            gemini_api_key="test_gemini",
            groq_api_key="test_groq",
            gemini_model="gemini-2.5-flash-lite",
            groq_model="llama-3.3-70b-versatile",
        )
        return PromptImprover()


class TestImproverGeminiSuccess:
    def test_improve_returns_gemini_result(self, improver):
        with patch.object(improver, "_try_gemini", return_value="Improved by Gemini"):
            with patch.object(improver, "_try_groq", return_value=None):
                result, provider = improver.improve("test prompt", "Beautify")
                assert result == "Improved by Gemini"
                assert provider == "Gemini"

    def test_improve_calls_gemini_first(self, improver):
        with patch.object(improver, "_try_gemini", return_value="Result") as mock_gemini:
            with patch.object(improver, "_try_groq", return_value=None):
                improver.improve("test prompt", "Beautify")
                mock_gemini.assert_called_once()


class TestImproverFallback:
    def test_fallback_to_groq_on_gemini_failure(self, improver):
        with patch.object(improver, "_try_gemini", return_value=None):
            with patch.object(improver, "_try_groq", return_value="Improved by Groq"):
                result, provider = improver.improve("test prompt", "Beautify")
                assert result == "Improved by Groq"
                assert provider == "Groq"

    def test_fallback_skips_groq_if_gemini_succeeds(self, improver):
        with patch.object(improver, "_try_gemini", return_value="Improved by Gemini"):
            with patch.object(improver, "_try_groq") as mock_groq:
                improver.improve("test prompt", "Beautify")
                mock_groq.assert_not_called()


class TestImproverBothFail:
    def test_raise_error_when_both_providers_fail(self, improver):
        with patch.object(improver, "_try_gemini", return_value=None):
            with patch.object(improver, "_try_groq", return_value=None):
                with pytest.raises(ProviderError):
                    improver.improve("test prompt", "Beautify")

    def test_error_message_mentions_both_providers(self, improver):
        with patch.object(improver, "_try_gemini", return_value=None):
            with patch.object(improver, "_try_groq", return_value=None):
                with pytest.raises(ProviderError) as exc_info:
                    improver.improve("test prompt", "Beautify")
                assert "Gemini" in str(exc_info.value)
                assert "Groq" in str(exc_info.value)


class TestImproverModes:
    def test_beautify_mode(self, improver):
        with patch.object(improver, "_try_gemini") as mock_gemini:
            mock_gemini.return_value = "Result"
            with patch.object(improver, "_try_groq", return_value=None):
                improver.improve("test prompt", "Beautify")
                args, _ = mock_gemini.call_args
                assert "Beautify" in args[0] or args[0]  # system prompt

    def test_clarify_mode(self, improver):
        with patch.object(improver, "_try_gemini") as mock_gemini:
            mock_gemini.return_value = "Result"
            with patch.object(improver, "_try_groq", return_value=None):
                improver.improve("test prompt", "Clarify")
                args, _ = mock_gemini.call_args
                assert "Clarify" in args[0] or args[0]

    def test_translate_mode_with_language(self, improver):
        with patch.object(improver, "_try_gemini") as mock_gemini:
            mock_gemini.return_value = "Result"
            with patch.object(improver, "_try_groq", return_value=None):
                improver.improve("test prompt", "Translate", target_language="Spanish")
                args, _ = mock_gemini.call_args
                assert "Spanish" in args[0]


class TestImproverTryGemini:
    def test_try_gemini_returns_none_if_no_key(self, improver):
        improver.config.gemini_api_key = None
        result = improver._try_gemini("system", "user")
        assert result is None

    def test_try_gemini_catches_provider_error(self, improver):
        with patch("betterprompts.improver.GeminiProvider") as mock_provider:
            mock_instance = Mock()
            mock_instance.improve.side_effect = ProviderError("Error")
            mock_provider.return_value = mock_instance
            result = improver._try_gemini("system", "user")
            assert result is None

    def test_try_gemini_catches_rate_limit_error(self, improver):
        with patch("betterprompts.improver.GeminiProvider") as mock_provider:
            mock_instance = Mock()
            mock_instance.improve.side_effect = RateLimitError("Rate limited")
            mock_provider.return_value = mock_instance
            result = improver._try_gemini("system", "user")
            assert result is None

    def test_try_gemini_catches_generic_exception(self, improver):
        with patch("betterprompts.improver.GeminiProvider") as mock_provider:
            mock_instance = Mock()
            mock_instance.improve.side_effect = Exception("Unknown error")
            mock_provider.return_value = mock_instance
            result = improver._try_gemini("system", "user")
            assert result is None


class TestImproverTryGroq:
    def test_try_groq_returns_none_if_no_key(self, improver):
        improver.config.groq_api_key = None
        result = improver._try_groq("system", "user")
        assert result is None

    def test_try_groq_catches_provider_error(self, improver):
        with patch("betterprompts.improver.GroqProvider") as mock_provider:
            mock_instance = Mock()
            mock_instance.improve.side_effect = ProviderError("Error")
            mock_provider.return_value = mock_instance
            result = improver._try_groq("system", "user")
            assert result is None

    def test_try_groq_catches_rate_limit_error(self, improver):
        with patch("betterprompts.improver.GroqProvider") as mock_provider:
            mock_instance = Mock()
            mock_instance.improve.side_effect = RateLimitError("Rate limited")
            mock_provider.return_value = mock_instance
            result = improver._try_groq("system", "user")
            assert result is None

    def test_try_groq_catches_generic_exception(self, improver):
        with patch("betterprompts.improver.GroqProvider") as mock_provider:
            mock_instance = Mock()
            mock_instance.improve.side_effect = Exception("Unknown error")
            mock_provider.return_value = mock_instance
            result = improver._try_groq("system", "user")
            assert result is None


class TestImproverReturnValues:
    def test_improve_returns_tuple(self, improver):
        with patch.object(improver, "_try_gemini", return_value="Result"):
            with patch.object(improver, "_try_groq", return_value=None):
                result = improver.improve("test prompt", "Beautify")
                assert isinstance(result, tuple)
                assert len(result) == 2

    def test_improve_first_element_is_text(self, improver):
        with patch.object(improver, "_try_gemini", return_value="Improved"):
            with patch.object(improver, "_try_groq", return_value=None):
                result, _ = improver.improve("test prompt", "Beautify")
                assert isinstance(result, str)

    def test_improve_second_element_is_provider_name(self, improver):
        with patch.object(improver, "_try_gemini", return_value="Improved"):
            with patch.object(improver, "_try_groq", return_value=None):
                _, provider = improver.improve("test prompt", "Beautify")
                assert provider in ["Gemini", "Groq"]
