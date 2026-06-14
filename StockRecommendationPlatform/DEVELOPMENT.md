# Stock Recommendation Platform - Development Guide

This guide helps developers extend and improve the Stock Recommendation Platform.

## Development Environment Setup

### Prerequisites
- Python 3.8+
- pip or poetry
- Git
- Docker (optional)

### Initial Setup

```bash
# Clone and enter directory
cd StockRecommendationPlatform

# Run setup script
./setup.sh  # macOS/Linux
# or
setup.bat   # Windows

# Activate virtual environment
source venv/bin/activate
# or on Windows:
venv\Scripts\activate
```

### Install Development Dependencies

```bash
# Core dependencies
pip install -r requirements.txt

# Development tools
pip install pytest pytest-asyncio pytest-cov black pylint mypy
pip install ipython jupyter  # Interactive development
```

## Project Structure Walkthrough

### app/main.py - FastAPI Application
The core API application with route definitions.

**Key Sections**:
```python
# 1. Imports and app initialization
from fastapi import FastAPI
app = FastAPI(title="...", version="1.0.0")

# 2. Models (Pydantic)
class StockPrice(BaseModel):
    symbol: str
    price: float
    ...

# 3. Routes
@app.get("/health")
async def health_check(): ...

@app.get("/api/stocks/{symbol}/price")
async def get_stock_price(symbol: str): ...

# 4. Main entry point
if __name__ == "__main__":
    uvicorn.run(app, ...)
```

### app/config.py - Configuration
Centralized settings using Pydantic.

```python
class Settings(BaseSettings):
    polygon_api_key: str = os.getenv("POLYGON_API_KEY", "")
    default_analysis_period: int = 30
    # More settings...

settings = Settings()
```

### app/utils.py - Technical Analysis
Utility functions for financial calculations.

```python
def calculate_moving_average(prices: List[float], period: int) -> float:
    """Calculate SMA"""
    
def calculate_rsi(prices: List[float], period: int = 14) -> float:
    """Calculate RSI"""
    
# More indicators...
```

## Common Development Tasks

### Running the Development Server

```bash
# With auto-reload
uvicorn app.main:app --reload --port 8000

# With custom settings
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# With logging
uvicorn app.main:app --reload --log-level debug
```

### Testing the API

#### Using curl
```bash
# Health check
curl http://localhost:8000/health

# Get stock price
curl http://localhost:8000/api/stocks/AAPL/price

# Get recommendation
curl "http://localhost:8000/api/recommendations/AAPL?period=30"

# Batch recommendations
curl "http://localhost:8000/api/recommendations/batch?symbols=AAPL,GOOGL"
```

#### Using Python
```python
import requests

response = requests.get("http://localhost:8000/api/stocks/AAPL/price")
data = response.json()
print(data)
```

#### Using Interactive Docs
Visit: http://localhost:8000/docs

### Code Formatting

```bash
# Format code with Black
black app/

# Check code style
pylint app/

# Type checking
mypy app/
```

## Adding New Features

### 1. Adding a New Technical Indicator

**Step 1**: Implement in `app/utils.py`

```python
def calculate_stochastic(prices: List[float], period: int = 14) -> Dict[str, float]:
    """
    Calculate Stochastic Oscillator
    
    Args:
        prices: List of closing prices
        period: Lookback period (default 14)
    
    Returns:
        Dict with %K and %D values
    """
    if not prices or len(prices) < period:
        return {"k": None, "d": None}
    
    recent = prices[-period:]
    lowest = min(recent)
    highest = max(recent)
    
    if highest == lowest:
        k = 50.0
    else:
        k = ((prices[-1] - lowest) / (highest - lowest)) * 100
    
    # %D is 3-period SMA of %K
    # Implementation...
    
    return {"k": k, "d": d}
```

**Step 2**: Integrate into recommendations (in `app/main.py`)

```python
@app.get("/api/recommendations/{symbol}")
async def get_recommendation(symbol: str):
    # ... existing code ...
    
    # Add stochastic signal
    stoch = calculate_stochastic(closes, period=14)
    
    if stoch["k"] and stoch["k"] < 20:
        signals.append("Stochastic oversold")
        confidence += 0.1
    elif stoch["k"] and stoch["k"] > 80:
        signals.append("Stochastic overbought")
        confidence -= 0.1
```

**Step 3**: Test and document

```bash
# Test manually
curl "http://localhost:8000/api/recommendations/AAPL"

# Update README with new indicator
```

### 2. Adding a New API Endpoint

**Step 1**: Create Pydantic model (if needed)

```python
class AnalysisResult(BaseModel):
    symbol: str
    analysis_type: str
    metrics: Dict[str, float]
    timestamp: str
```

**Step 2**: Implement route in `app/main.py`

```python
@app.get("/api/stocks/{symbol}/analysis")
async def analyze_stock(
    symbol: str = Query(..., description="Stock symbol"),
    period: int = Query(30, ge=5, le=252)
):
    """Advanced stock analysis endpoint"""
    
    try:
        # Implementation
        return {
            "symbol": symbol,
            "analysis_type": "technical",
            "metrics": {...},
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Step 3**: Test with Swagger UI

Visit: http://localhost:8000/docs

### 3. Adding Database Integration

**Install SQLAlchemy**:
```bash
pip install sqlalchemy python-dotenv
```

**Create database models** (`app/models.py`):
```python
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class StockPrice(Base):
    __tablename__ = "stock_prices"
    
    id = Column(Integer, primary_key=True)
    symbol = Column(String(10), index=True)
    price = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
```

**Use in routes**:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./stocks.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@app.get("/api/stocks/{symbol}/history")
async def get_history(symbol: str):
    session = SessionLocal()
    prices = session.query(StockPrice).filter(
        StockPrice.symbol == symbol
    ).order_by(StockPrice.timestamp.desc()).limit(100).all()
    return prices
```

## Testing

### Unit Tests

Create `tests/test_utils.py`:

```python
import pytest
from app.utils import calculate_moving_average, calculate_rsi

def test_calculate_moving_average():
    prices = [10, 20, 30, 40, 50]
    sma = calculate_moving_average(prices, period=3)
    assert sma == 40.0  # (30+40+50)/3

def test_calculate_rsi_overbought():
    prices = list(range(1, 30))  # Strong uptrend
    rsi = calculate_rsi(prices, period=14)
    assert rsi > 70  # Overbought
```

### Integration Tests

Create `tests/test_api.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_invalid_symbol():
    response = client.get("/api/stocks/INVALID/price")
    assert response.status_code == 404
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test
pytest tests/test_utils.py::test_calculate_moving_average

# Run with coverage
pytest --cov=app tests/

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_api.py
```

## Performance Optimization

### 1. Caching Results

```python
from functools import lru_cache
from datetime import datetime, timedelta

class CacheEntry:
    def __init__(self, data, ttl=300):
        self.data = data
        self.expires_at = datetime.utcnow() + timedelta(seconds=ttl)
    
    def is_valid(self):
        return datetime.utcnow() < self.expires_at

# Simple in-memory cache
cache = {}

def get_cached(key, fetch_fn, ttl=300):
    if key in cache and cache[key].is_valid():
        return cache[key].data
    
    data = fetch_fn()
    cache[key] = CacheEntry(data, ttl)
    return data

# Usage in route
@app.get("/api/stocks/{symbol}/price")
async def get_stock_price(symbol: str):
    def fetch():
        # ... actual API call ...
    
    return get_cached(f"price:{symbol}", fetch, ttl=60)
```

### 2. Async/Await Best Practices

```python
# Good: Use async all the way through
async def fetch_multiple_stocks(symbols: List[str]):
    async with httpx.AsyncClient() as client:
        tasks = [fetch_stock(symbol, client) for symbol in symbols]
        return await asyncio.gather(*tasks)

# Not ideal: Blocking calls in async function
async def slow_fetch():
    import time
    time.sleep(5)  # ❌ Blocks event loop
```

## Debugging

### Logging

```python
import logging

logger = logging.getLogger(__name__)

@app.get("/api/stocks/{symbol}/price")
async def get_stock_price(symbol: str):
    logger.info(f"Fetching price for {symbol}")
    try:
        # ...
    except Exception as e:
        logger.error(f"Error fetching {symbol}: {str(e)}")
        raise
```

### Debug Mode

```bash
# Run with debug logging
uvicorn app.main:app --reload --log-level debug
```

### Interactive Debugging

```python
# Add breakpoint
import pdb; pdb.set_trace()

# Or use IPython
from IPython import embed; embed()
```

## Deployment Preparation

### Pre-deployment Checklist

```bash
# Run tests
pytest

# Check code quality
pylint app/
mypy app/

# Format code
black app/

# Update requirements
pip freeze > requirements.txt

# Test Docker build
docker build -t stock-platform:latest .

# Test Docker Compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Environment Configuration for Production

Update `.env` for production:

```env
POLYGON_API_KEY=<your-production-key>
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=false
CACHE_ENABLED=true
CACHE_TTL=600
LOG_LEVEL=WARNING
```

## Release Process

### 1. Update Version

Edit in `app/__init__.py`:
```python
__version__ = "1.1.0"
```

### 2. Update Changelog

Create `CHANGELOG.md`:
```
## [1.1.0] - 2024-01-15
### Added
- New Stochastic Oscillator indicator
- Portfolio analysis endpoint
- WebSocket support for live updates

### Fixed
- Fixed RSI calculation for short periods
- Improved error handling for invalid symbols

### Changed
- Updated dependencies
```

### 3. Create Release Tag

```bash
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

## Contribution Guidelines

### Code Style

- Follow PEP 8
- Use type hints
- Write docstrings
- Keep functions small and focused

### Naming Conventions

```python
# Functions: snake_case
def calculate_moving_average(): ...

# Classes: PascalCase
class StockPrice(BaseModel): ...

# Constants: UPPER_CASE
API_TIMEOUT = 10

# Private: prefix with underscore
def _internal_function(): ...
```

### Commit Messages

```
[FEATURE] Add stochastic oscillator indicator
[BUGFIX] Fix RSI calculation edge case
[DOCS] Update API documentation
[REFACTOR] Simplify recommendation logic
[TEST] Add unit tests for utils
```

## Resources

### Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Pydantic Docs](https://docs.pydantic.dev/)
- [Polygon API Docs](https://polygon.io/docs/stocks)
- [Technical Analysis Guide](https://www.investopedia.com/)

### Tools
- [Swagger UI](http://localhost:8000/docs) - Interactive API docs
- [ReDoc](http://localhost:8000/redoc) - API documentation
- [Postman](https://www.postman.com/) - API testing
- [Docker Hub](https://hub.docker.com/) - Container registry

### Community
- FastAPI Discord
- Stack Overflow tags: fastapi, polygon-api, technical-analysis
- GitHub Discussions

## Troubleshooting

### Common Issues

**Issue**: Import errors after adding new module
```bash
# Solution: Update PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

**Issue**: Port already in use
```bash
# Solution: Use different port
uvicorn app.main:app --port 8001
```

**Issue**: Async timeout errors
```bash
# Solution: Increase timeout in config
POLYGON_API_TIMEOUT=30
```

## Questions?

- Check [README.md](README.md)
- Review [ARCHITECTURE.md](ARCHITECTURE.md)
- Check [QUICKSTART.md](QUICKSTART.md)
- Consult API documentation at `/docs`
