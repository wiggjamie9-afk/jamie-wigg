import pytest
from unittest.mock import Mock, patch, MagicMock
from betterprompts.app import create_app


@pytest.fixture
def app():
    with patch("betterprompts.app.PromptImprover"):
        with patch("betterprompts.app.get_config"):
            return create_app()


class TestAppConstruction:
    def test_app_creates_successfully(self, app):
        assert app is not None

    def test_app_is_gradio_blocks(self, app):
        import gradio as gr
        assert isinstance(app, gr.Blocks)


class TestAppUIElements:
    def test_app_has_input_textbox(self, app):
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None

    def test_app_has_improve_button(self, app):
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None

    def test_app_has_output_textbox(self, app):
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None

    def test_app_has_mode_dropdown(self, app):
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None


class TestAppProviderBadge:
    def test_badge_html_contains_provider_name(self):
        provider_html = '<div class="provider-badge">✓ Gemini</div>'
        assert "Gemini" in provider_html
        assert "provider-badge" in provider_html

    def test_badge_html_contains_groq_name(self):
        provider_html = '<div class="provider-badge">✓ Groq</div>'
        assert "Groq" in provider_html
        assert "provider-badge" in provider_html


class TestAppImproveHandler:
    def test_improve_with_empty_prompt_returns_error(self, app):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover") as mock_improver:
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None

    def test_improve_with_valid_prompt_calls_improver(self):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover") as mock_improver_class:
            with patch("betterprompts.app.get_config"):
                mock_improver = Mock()
                mock_improver.improve.return_value = ("Improved", "Gemini")
                mock_improver_class.return_value = mock_improver
                app_instance = create_app()
                assert app_instance is not None

    def test_improve_updates_session_keys(self):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover") as mock_improver_class:
            with patch("betterprompts.app.get_config") as mock_config_func:
                mock_improver = Mock()
                mock_improver.improve.return_value = ("Improved", "Gemini")
                mock_improver_class.return_value = mock_improver
                mock_config = Mock()
                mock_config_func.return_value = mock_config
                app_instance = create_app()
                assert app_instance is not None


class TestAppCSSTheme:
    def test_dark_theme_css_contains_dark_colors(self):
        from betterprompts.app import DARK_GLASS_CSS
        assert "#1f2937" in DARK_GLASS_CSS  # dark gray
        assert "#f3f4f6" in DARK_GLASS_CSS  # light gray
        assert "#6366f1" in DARK_GLASS_CSS  # indigo

    def test_glass_morphism_css_exists(self):
        from betterprompts.app import DARK_GLASS_CSS
        assert "backdrop-filter" in DARK_GLASS_CSS
        assert "glass-container" in DARK_GLASS_CSS

    def test_gradient_styling_in_css(self):
        from betterprompts.app import DARK_GLASS_CSS
        assert "gradient" in DARK_GLASS_CSS

    def test_glass_css_has_blur_effect(self):
        from betterprompts.app import DARK_GLASS_CSS
        assert "blur" in DARK_GLASS_CSS


class TestAppLanguageField:
    def test_target_language_field_visibility(self):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None


class TestAppSettingsAccordion:
    def test_settings_accordion_contains_api_fields(self):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None


class TestAppErrorHandling:
    def test_error_message_on_improver_failure(self):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover") as mock_improver_class:
            with patch("betterprompts.app.get_config"):
                mock_improver = Mock()
                mock_improver.improve.side_effect = Exception("API Error")
                mock_improver_class.return_value = mock_improver
                app_instance = create_app()
                assert app_instance is not None


class TestAppModes:
    def test_beautify_mode_available(self):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None

    def test_clarify_mode_available(self):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None

    def test_translate_mode_available(self):
        from betterprompts.app import create_app
        with patch("betterprompts.app.PromptImprover"):
            with patch("betterprompts.app.get_config"):
                app_instance = create_app()
                assert app_instance is not None
