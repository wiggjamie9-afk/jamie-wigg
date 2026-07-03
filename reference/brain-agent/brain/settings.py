import os


class Settings:
    """Configuration loaded from environment (with safe defaults)."""

    def __init__(self):
        self.OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
        self.TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
        self.MAX_USERS = int(os.environ.get("BRAIN_MAX_USERS", "20"))
