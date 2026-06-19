import gradio as gr
from .improver import PromptImprover
from .config import get_config


DARK_GLASS_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --text-primary: #f3f4f6;
    --text-secondary: #d1d5db;
    --border-color: rgba(255, 255, 255, 0.1);
    --glass-bg: rgba(31, 41, 55, 0.7);
}

body {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    font-family: 'Inter', sans-serif;
}

.gradio-container {
    max-width: 800px !important;
    background: transparent;
}

/* Glass morphism containers */
.glass-container {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
}

/* Textbox styling */
.gradio-textbox {
    background: var(--glass-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 12px !important;
    color: var(--text-primary) !important;
}

.gradio-textbox input,
.gradio-textbox textarea {
    background: transparent !important;
    color: var(--text-primary) !important;
    border: none !important;
    caret-color: var(--primary-color) !important;
}

.gradio-textbox input::placeholder,
.gradio-textbox textarea::placeholder {
    color: var(--text-secondary) !important;
}

/* Dropdown styling */
.gradio-dropdown {
    background: var(--glass-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 12px !important;
}

.gradio-dropdown select {
    background: var(--glass-bg) !important;
    color: var(--text-primary) !important;
    border: none !important;
}

.gradio-dropdown select option {
    background: var(--bg-primary);
    color: var(--text-primary);
}

/* Button styling */
.gradio-button {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;
    color: white !important;
    border: none !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
}

.gradio-button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3) !important;
}

.gradio-button:active {
    transform: translateY(0) !important;
}

/* Accordion styling */
.gradio-accordion {
    background: var(--glass-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 12px !important;
}

.gradio-accordion > div {
    background: transparent !important;
    border: none !important;
}

.gradio-accordion-header {
    background: transparent !important;
    border: none !important;
    color: var(--text-primary) !important;
    font-weight: 600 !important;
}

/* Label styling */
.gradio-label {
    color: var(--text-primary) !important;
    font-weight: 600 !important;
}

/* Info text */
.gradio-info {
    color: var(--text-secondary) !important;
}

/* Output/result box */
.gradio-textbox.gradio-readonly {
    background: var(--glass-bg) !important;
    border: 2px solid var(--primary-color) !important;
}

/* Provider badge */
.provider-badge {
    display: inline-block;
    padding: 8px 16px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.2));
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    color: var(--primary-color);
    font-weight: 600;
    font-size: 14px;
    margin-top: 12px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Loading spinner */
.gr-load {
    color: var(--primary-color) !important;
}

/* Error styling */
.gradio-error {
    background: rgba(239, 68, 68, 0.1) !important;
    border: 1px solid rgba(239, 68, 68, 0.3) !important;
    color: #fca5a5 !important;
    border-radius: 8px !important;
}
"""


def create_app():
    improver = PromptImprover()
    config = get_config()

    def improve_prompt(user_prompt, mode, target_language, api_key_gemini, api_key_groq, model_gemini, model_groq):
        if not user_prompt or not user_prompt.strip():
            return "", "❌ Error: Please enter a prompt to improve"

        if api_key_gemini:
            config.set_session_gemini_key(api_key_gemini)
        if api_key_groq:
            config.set_session_groq_key(api_key_groq)
        if model_gemini:
            config.set_session_gemini_model(model_gemini)
        if model_groq:
            config.set_session_groq_model(model_groq)

        try:
            improved, provider = improver.improve(user_prompt, mode, target_language)
            provider_html = f'<div class="provider-badge">✓ {provider}</div>'
            return improved, provider_html
        except Exception as e:
            return "", f"❌ Error: {str(e)}"

    with gr.Blocks() as demo:
        gr.HTML("""
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #f3f4f6; margin: 0; font-size: 2.5rem;">✨ BetterPrompts</h1>
            <p style="color: #d1d5db; margin-top: 8px; font-size: 1.1rem;">Improve your prompts with AI</p>
        </div>
        """)

        with gr.Column(scale=1):
            user_prompt = gr.Textbox(
                label="Your Prompt",
                placeholder="Enter a prompt you'd like to improve...",
                lines=4,
                elem_classes="glass-container",
            )

            with gr.Row():
                mode = gr.Dropdown(
                    choices=["Beautify", "Clarify", "Translate"],
                    value="Beautify",
                    label="Mode",
                    elem_classes="glass-container",
                )

            target_language = gr.Textbox(
                label="Target Language (for Translate mode)",
                placeholder="e.g., Spanish, French, Japanese",
                elem_classes="glass-container",
                visible=False,
            )

            def update_language_visibility(selected_mode):
                return gr.update(visible=(selected_mode == "Translate"))

            mode.change(update_language_visibility, inputs=mode, outputs=target_language)

            improve_btn = gr.Button("✨ Improve Prompt", scale=0)

            improved_prompt = gr.Textbox(
                label="Improved Prompt",
                lines=4,
                interactive=False,
                elem_classes="glass-container",
            )

            provider_badge = gr.HTML(value="")

            with gr.Accordion("⚙️ Settings", open=False):
                gr.HTML("<p style='color: #d1d5db; font-size: 0.9rem;'>Configure API keys and models for this session (optional)</p>")

                api_key_gemini = gr.Textbox(
                    label="Gemini API Key",
                    type="password",
                    placeholder="Leave blank to use .env key",
                    elem_classes="glass-container",
                )

                model_gemini = gr.Textbox(
                    label="Gemini Model",
                    value="gemini-2.5-flash-lite",
                    elem_classes="glass-container",
                )

                api_key_groq = gr.Textbox(
                    label="Groq API Key",
                    type="password",
                    placeholder="Leave blank to use .env key",
                    elem_classes="glass-container",
                )

                model_groq = gr.Textbox(
                    label="Groq Model",
                    value="llama-3.3-70b-versatile",
                    elem_classes="glass-container",
                )

            improve_btn.click(
                fn=improve_prompt,
                inputs=[user_prompt, mode, target_language, api_key_gemini, api_key_groq, model_gemini, model_groq],
                outputs=[improved_prompt, provider_badge],
            )

        gr.HTML("""
        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="color: #9ca3af; font-size: 0.9rem;">
                Powered by Gemini (primary) and Groq (fallback)
            </p>
        </div>
        """)

    return demo
