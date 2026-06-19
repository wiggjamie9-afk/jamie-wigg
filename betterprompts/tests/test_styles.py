import pytest
from betterprompts.app import DARK_GLASS_CSS


class TestDarkTheme:
    def test_dark_background_color_defined(self):
        assert "#1f2937" in DARK_GLASS_CSS

    def test_light_text_color_defined(self):
        assert "#f3f4f6" in DARK_GLASS_CSS

    def test_secondary_gray_color_defined(self):
        assert "#d1d5db" in DARK_GLASS_CSS

    def test_primary_indigo_color_defined(self):
        assert "#6366f1" in DARK_GLASS_CSS

    def test_primary_dark_indigo_defined(self):
        assert "#4f46e5" in DARK_GLASS_CSS


class TestGlassMorphism:
    def test_glass_container_class_defined(self):
        assert ".glass-container" in DARK_GLASS_CSS

    def test_backdrop_filter_blur_defined(self):
        assert "backdrop-filter" in DARK_GLASS_CSS
        assert "blur" in DARK_GLASS_CSS

    def test_glass_border_color_translucent(self):
        assert "rgba(255, 255, 255, 0.1)" in DARK_GLASS_CSS

    def test_glass_background_rgba(self):
        assert "rgba(31, 41, 55, 0.7)" in DARK_GLASS_CSS


class TestButtonStyling:
    def test_button_gradient_defined(self):
        assert ".gradio-button" in DARK_GLASS_CSS
        assert "gradient" in DARK_GLASS_CSS

    def test_button_hover_transform(self):
        assert "translateY" in DARK_GLASS_CSS

    def test_button_box_shadow_on_hover(self):
        assert "box-shadow" in DARK_GLASS_CSS

    def test_button_indigo_color(self):
        assert "6366f1" in DARK_GLASS_CSS or "4f46e5" in DARK_GLASS_CSS


class TestInputStyling:
    def test_textbox_styling_defined(self):
        assert ".gradio-textbox" in DARK_GLASS_CSS

    def test_input_placeholder_color(self):
        assert "placeholder" in DARK_GLASS_CSS

    def test_caret_color_set_to_primary(self):
        assert "caret-color" in DARK_GLASS_CSS

    def test_input_transparent_background(self):
        assert "transparent" in DARK_GLASS_CSS


class TestAccordionStyling:
    def test_accordion_styling_defined(self):
        assert ".gradio-accordion" in DARK_GLASS_CSS

    def test_accordion_has_glass_effect(self):
        assert "backdrop-filter" in DARK_GLASS_CSS


class TestScrollbarStyling:
    def test_scrollbar_track_defined(self):
        assert "::-webkit-scrollbar-track" in DARK_GLASS_CSS

    def test_scrollbar_thumb_defined(self):
        assert "::-webkit-scrollbar-thumb" in DARK_GLASS_CSS

    def test_scrollbar_dark_colors(self):
        assert "1f2937" in DARK_GLASS_CSS or "111827" in DARK_GLASS_CSS


class TestResponsiveness:
    def test_max_width_defined_for_container(self):
        assert "max-width" in DARK_GLASS_CSS

    def test_padding_defined(self):
        assert "padding" in DARK_GLASS_CSS


class TestFontStyling:
    def test_inter_font_imported(self):
        assert "Inter" in DARK_GLASS_CSS

    def test_font_weights_defined(self):
        assert "400" in DARK_GLASS_CSS
        assert "500" in DARK_GLASS_CSS
        assert "600" in DARK_GLASS_CSS


class TestErrorStyling:
    def test_error_class_defined(self):
        assert ".gradio-error" in DARK_GLASS_CSS

    def test_error_background_rgba(self):
        assert "rgba(239, 68, 68" in DARK_GLASS_CSS

    def test_error_text_color(self):
        assert "#fca5a5" in DARK_GLASS_CSS


class TestDropdownStyling:
    def test_dropdown_styling_defined(self):
        assert ".gradio-dropdown" in DARK_GLASS_CSS

    def test_dropdown_option_background(self):
        assert "option" in DARK_GLASS_CSS


class TestLabelStyling:
    def test_label_styling_defined(self):
        assert ".gradio-label" in DARK_GLASS_CSS

    def test_label_font_weight_600(self):
        assert "font-weight" in DARK_GLASS_CSS
