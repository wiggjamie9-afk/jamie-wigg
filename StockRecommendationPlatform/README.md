# Stock Recommendation Platform

A real-time stock data fetching and AI-powered recommendation engine built with FastAPI and Polygon API integration.

## Features

- **Real-Time Stock Data**: Fetch live stock prices and historical data from Polygon API
- **Technical Analysis**: Calculate moving averages, RSI, MACD, Bollinger Bands, and more
- **AI Recommendations**: Generate BUY/SELL/HOLD signals based on technical indicators
- **Batch Processing**: Get recommendations for multiple stocks in a single request
- **Portfolio Analysis**: Analyze and optimize stock portfolios
- **RESTful API**: Easy-to-use endpoints with comprehensive documentation
- **CORS Enabled**: Works seamlessly with frontend applications

## Project Structure

```
StockRecommendationPlatform/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application and routes
│   ├── config.py            # Configuration settings
│   └── utils.py             # Utility functions for analysis
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

## Installation

### 1. Clone the repository
```bash
cd /home/user/jamie-wigg/StockRecommendationPlatform
```

### 2. Create virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup environment variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Polygon API key
# POLYGON_API_KEY=your_api_key_here
```

Get a free Polygon API key from: https://polygon.io/

### 5. Run the server
```bash
uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints

#### Health Check
```http
GET /health
```

Returns API status and configuration readiness.

#### Get Stock Price
```http
GET /api/stocks/{symbol}/price
```

Get current stock price for a symbol.

**Parameters:**
- `symbol` (required): Stock symbol (e.g., "AAPL")

**Example:**
```bash
curl http://localhost:8000/api/stocks/AAPL/price
```

#### Get Daily Data
```http
GET /api/stocks/{symbol}/daily
```

Get historical daily OHLCV data.

**Parameters:**
- `symbol` (required): Stock symbol
- `timespan` (optional): day, week, month, quarter, year (default: day)
- `limit` (optional): Number of results, 1-252 (default: 30)

**Example:**
```bash
curl "http://localhost:8000/api/stocks/AAPL/daily?timespan=day&limit=60"
```

#### Get Recommendation
```http
GET /api/recommendations/{symbol}
```

Get AI-powered BUY/SELL/HOLD recommendation.

**Parameters:**
- `symbol` (required): Stock symbol
- `period` (optional): Analysis period in days, 5-252 (default: 30)

**Example:**
```bash
curl "http://localhost:8000/api/recommendations/AAPL?period=60"
```

#### Batch Recommendations
```http
GET /api/recommendations/batch
```

Get recommendations for multiple stocks.

**Parameters:**
- `symbols` (required): Comma-separated symbols (e.g., "AAPL,GOOGL,MSFT")

**Example:**
```bash
curl "http://localhost:8000/api/recommendations/batch?symbols=AAPL,GOOGL,MSFT,TSLA"
```

#### Analyze Portfolio
```http
POST /api/portfolio/analyze
```

Analyze a stock portfolio.

**Request Body:**
```json
{
  "holdings": [
    {"symbol": "AAPL", "shares": 100, "buy_price": 150},
    {"symbol": "GOOGL", "shares": 50, "buy_price": 2800}
  ]
}
```

## Technical Analysis Indicators

The platform uses the following technical indicators for recommendations:

### Moving Averages
- **SMA (Simple Moving Average)**: Average price over a period
- **EMA (Exponential Moving Average)**: Weighted average giving more importance to recent prices

### Momentum Indicators
- **RSI (Relative Strength Index)**: Measures overbought/oversold conditions (0-100)
- **MACD (Moving Average Convergence Divergence)**: Trend and momentum indicator
- **Momentum**: Percentage change in price over time

### Volatility
- **Bollinger Bands**: Upper, middle, and lower bands based on standard deviation
- **Historical Volatility**: Annualized standard deviation of returns

## Recommendation Logic

The platform generates recommendations based on:

1. **Price vs. Moving Averages**: 
   - BUY when price > 20-day MA > 50-day MA (with positive momentum)
   - SELL when price < 20-day MA < 50-day MA (with negative momentum)
   - HOLD otherwise

2. **Momentum Analysis**: 
   - Strong uptrend (>2% momentum) increases BUY confidence
   - Strong downtrend (<-2% momentum) increases SELL confidence

3. **Confidence Scoring**:
   - 0.0 = Very Low Confidence
   - 0.5 = Medium Confidence
   - 1.0 = Very High Confidence

## Configuration

Edit `app/config.py` to customize:

```python
# Analysis period defaults
default_analysis_period = 30

# Recommendation confidence thresholds
strong_buy_threshold = 0.80
buy_threshold = 0.65
sell_threshold = 0.35
strong_sell_threshold = 0.20

# API limits
max_batch_symbols = 50

# Cache settings
cache_enabled = True
cache_ttl = 300  # 5 minutes
```

## Example Usage

### Python Client

```python
import requests

BASE_URL = "http://localhost:8000"

# Get stock price
response = requests.get(f"{BASE_URL}/api/stocks/AAPL/price")
print(response.json())

# Get recommendation
response = requests.get(
    f"{BASE_URL}/api/recommendations/AAPL",
    params={"period": 60}
)
recommendation = response.json()
print(f"Action: {recommendation['action']}")
print(f"Confidence: {recommendation['confidence']}")
print(f"Reason: {recommendation['reason']}")

# Get batch recommendations
symbols = "AAPL,GOOGL,MSFT,TSLA,META"
response = requests.get(
    f"{BASE_URL}/api/recommendations/batch",
    params={"symbols": symbols}
)
recommendations = response.json()
for rec in recommendations["recommendations"]:
    print(f"{rec['symbol']}: {rec['action']} (confidence: {rec['confidence']})")
```

### JavaScript/Node.js

```javascript
const BASE_URL = "http://localhost:8000";

// Get recommendation
async function getRecommendation(symbol) {
  const response = await fetch(
    `${BASE_URL}/api/recommendations/${symbol}?period=30`
  );
  const data = await response.json();
  return data;
}

// Usage
getRecommendation("AAPL").then(rec => {
  console.log(`${rec.symbol}: ${rec.action}`);
  console.log(`Confidence: ${rec.confidence}`);
  console.log(`Reason: ${rec.reason}`);
});
```

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t stock-platform .
docker run -p 8000:8000 \
  -e POLYGON_API_KEY=your_key_here \
  stock-platform
```

### Production

For production deployment:

1. Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
2. Set up a reverse proxy (Nginx)
3. Enable HTTPS/SSL
4. Implement rate limiting
5. Add authentication/authorization
6. Set up monitoring and logging

## Security Considerations

- **API Key**: Keep your Polygon API key secure in environment variables
- **Rate Limiting**: Polygon has rate limits - implement caching to avoid excessive calls
- **Input Validation**: All inputs are validated using Pydantic
- **CORS**: Currently open - configure for your specific domain in production

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid API key)
- `404`: Not Found (symbol doesn't exist)
- `500`: Server Error
- `503`: Service Unavailable (API timeout)

## Performance Tips

1. **Use Caching**: Results are cached for 5 minutes by default
2. **Batch Requests**: Use the batch endpoint for multiple symbols
3. **Adjust Periods**: Shorter analysis periods are faster but less reliable
4. **Limit Batch Size**: Keep batch requests under 50 symbols

## Troubleshooting

### "POLYGON_API_KEY not configured"
- Ensure your `.env` file contains `POLYGON_API_KEY=your_key`
- Restart the server after updating `.env`

### "Stock symbol not found"
- Check the symbol is correct (usually uppercase, e.g., "AAPL")
- The symbol may not be available on Polygon API

### Slow responses
- Check your internet connection
- Verify Polygon API is responding (https://polygon.io/status)
- Reduce the analysis period

## Future Enhancements

- Machine learning models for better predictions
- Sentiment analysis from news and social media
- Portfolio optimization algorithms
- Real-time WebSocket updates
- Historical recommendation accuracy tracking
- Custom alert thresholds
- User authentication and saved portfolios
- Advanced charting capabilities

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Polygon API documentation: https://polygon.io/docs/stocks
3. Check FastAPI documentation: https://fastapi.tiangolo.com/

## References

- [Polygon API Documentation](https://polygon.io/docs/stocks)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Technical Analysis Resources](https://www.investopedia.com/)
