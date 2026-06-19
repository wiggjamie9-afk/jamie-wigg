import os
from pathlib import Path
from dotenv import load_dotenv


class Config:
    def __init__(self, env_file=None):
        if env_file is None:
            env_path = Path(__file__).parent.parent / ".env"
        else:
            env_path = env_file
        load_dotenv(env_path)

        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.groq_api_key = os.getenv("GROQ_API_KEY", "")
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
        self.groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.betterprompts_host = os.getenv("BETTERPROMPTS_HOST", "127.0.0.1")
        self.betterprompts_port = int(os.getenv("BETTERPROMPTS_PORT", "7860"))
        self.debug = os.getenv("DEBUG", "false").lower() == "true"

        # Session overrides
        self.session_gemini_key = None
        self.session_groq_key = None
        self.session_gemini_model = None
        self.session_groq_model = None
        self.session_host = None
        self.session_port = None

    def set_session_gemini_key(self, key):
        self.session_gemini_key = key
        self.gemini_api_key = key

    def set_session_groq_key(self, key):
        self.session_groq_key = key
        self.groq_api_key = key

    def set_session_gemini_model(self, model):
        self.session_gemini_model = model
        self.gemini_model = model

    def set_session_groq_model(self, model):
        self.session_groq_model = model
        self.groq_model = model

    def set_session_host(self, host):
        self.session_host = host

    def set_session_port(self, port):
        self.session_port = int(port)


_global_config = None


def get_config():
    global _global_config
    if _global_config is None:
        _global_config = Config()
    return _global_config


def parse_cli_args(args=None):
    import argparse
    parser = argparse.ArgumentParser(description="BetterPrompts: Improve your prompts with AI")
    parser.add_argument("--host", type=str, default=None, help="Server host (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=None, help="Server port (default: 7860)")

    parsed = parser.parse_args(args)
    return parsed
