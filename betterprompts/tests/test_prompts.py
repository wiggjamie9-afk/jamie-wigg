import pytest
from betterprompts.prompts import get_system_prompt, parse_response


class TestSystemPrompts:
    def test_beautify_prompt_exists(self):
        prompt = get_system_prompt("Beautify")
        assert prompt
        assert isinstance(prompt, str)
        assert "grammar" in prompt.lower() or "tone" in prompt.lower()

    def test_clarify_prompt_exists(self):
        prompt = get_system_prompt("Clarify")
        assert prompt
        assert isinstance(prompt, str)
        assert "default" in prompt.lower() or "assumption" in prompt.lower()

    def test_translate_prompt_exists(self):
        prompt = get_system_prompt("Translate")
        assert prompt
        assert isinstance(prompt, str)
        assert "translate" in prompt.lower()

    def test_invalid_mode_defaults_to_beautify(self):
        prompt = get_system_prompt("InvalidMode")
        beautify_prompt = get_system_prompt("Beautify")
        assert prompt == beautify_prompt


class TestResponseParsing:
    def test_parse_simple_response(self):
        response = "This is an improved prompt"
        parsed = parse_response(response)
        assert parsed == "This is an improved prompt"

    def test_parse_strips_whitespace(self):
        response = "  \nThis is an improved prompt\n  "
        parsed = parse_response(response)
        assert parsed == "This is an improved prompt"

    def test_parse_empty_string(self):
        response = ""
        parsed = parse_response(response)
        assert parsed == ""

    def test_parse_multiline_response(self):
        response = "Line 1\nLine 2\nLine 3"
        parsed = parse_response(response)
        assert "Line 1" in parsed
        assert "Line 2" in parsed
        assert "Line 3" in parsed

    def test_parse_preserves_internal_spacing(self):
        response = "This  has  multiple  spaces"
        parsed = parse_response(response)
        assert "  " in parsed


class TestPromptModes:
    def test_beautify_mode_is_valid(self):
        from betterprompts.prompts import SYSTEM_PROMPTS
        assert "Beautify" in SYSTEM_PROMPTS

    def test_clarify_mode_is_valid(self):
        from betterprompts.prompts import SYSTEM_PROMPTS
        assert "Clarify" in SYSTEM_PROMPTS

    def test_translate_mode_is_valid(self):
        from betterprompts.prompts import SYSTEM_PROMPTS
        assert "Translate" in SYSTEM_PROMPTS

    def test_all_prompts_are_strings(self):
        from betterprompts.prompts import SYSTEM_PROMPTS
        for mode, prompt in SYSTEM_PROMPTS.items():
            assert isinstance(prompt, str)
            assert len(prompt) > 0
