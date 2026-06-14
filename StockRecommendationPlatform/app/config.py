"""Configuration management for StockRecommendationPlatform"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings"""

    # API Configuration
    api_title: str = "Stock Recommendation Platform"
    api_version: str = "1.0.0"
    api_description: str = "Real-time stock data and AI-powered recommendations"

    # Polygon API
    polygon_api_key: str = os.getenv("POLYGON_API_KEY", "")
    polygon_base_url: str = "https://api.polygon.io"

    # API Configuration
    api_timeout: int = 10

    # Analysis Configuration
    default_analysis_period: int = 30
    min_analysis_period: int = 5
    max_analysis_period: int = 252

    # Recommendation thresholds
    strong_buy_threshold: float = 0.80
    buy_threshold: float = 0.65
    sell_threshold: float = 0.35
    strong_sell_threshold: float = 0.20

    # Portfolio limits
    max_batch_symbols: int = 50

    # Cache settings
    cache_enabled: bool = True
    cache_ttl: int = 300  # 5 minutes

    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()
