# Stock Recommendation Platform - Architecture

## System Overview

The Stock Recommendation Platform is a FastAPI-based microservice that provides real-time stock data and AI-powered investment recommendations using technical analysis.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│               (Web, Mobile, Desktop, CLI)                   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Application Server                      │
│  (uvicorn/gunicorn on http://0.0.0.0:8000)                 │
├─────────────────────────────────────────────────────────────┤
│  API Endpoints Layer                                         │
│  ├─ Health Check (/health)                                  │
│  ├─ Stock Data Routes (/api/stocks/...)                     │
│  ├─ Recommendation Routes (/api/recommendations/...)        │
│  └─ Portfolio Routes (/api/portfolio/...)                   │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer (app.main)                            │
│  ├─ Price Fetching                                          │
│  ├─ Data Aggregation                                        │
│  └─ Recommendation Generation                               │
├─────────────────────────────────────────────────────────────┤
│  Technical Analysis Layer (app.utils)                       │
│  ├─ Moving Averages (SMA, EMA)                             │
│  ├─ Momentum Indicators (RSI, MACD)                        │
│  ├─ Volatility Metrics (Bollinger Bands)                   │
│  └─ Signal Generation                                       │
├─────────────────────────────────────────────────────────────┤
│  Configuration Layer (app.config)                           │
│  ├─ API Settings                                            │
│  ├─ Analysis Parameters                                     │
│  └─ Environment Variables                                   │
└─────────────────────────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Polygon API (External)                          │
│  ├─ Real-time Stock Quotes                                  │
│  ├─ Historical Aggregates                                   │
│  └─ Market Data                                             │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
StockRecommendationPlatform/
├── app/                          # Application package
│   ├── __init__.py              # Package initialization
│   ├── main.py                  # FastAPI application (500+ LOC)
│   ├── config.py                # Configuration management
│   └── utils.py                 # Technical analysis utilities
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── Dockerfile                   # Docker image definition
├── docker-compose.yml           # Docker Compose orchestration
├── setup.sh                     # Unix setup script
├── setup.bat                    # Windows setup script
├── README.md                    # Complete documentation
├── QUICKSTART.md               # 5-minute setup guide
└── ARCHITECTURE.md             # This file
```

## Module Descriptions

### app/main.py (FastAPI Application)
**Responsibility**: API route definitions and request handling

**Key Components**:
- FastAPI app initialization with CORS
- Pydantic models (StockPrice, DailyAggregate, StockRecommendation)
- Health check endpoint
- Stock data endpoints (price, daily aggregates)
- Recommendation endpoints (single, batch, portfolio)
- Error handling with appropriate HTTP status codes

**Dependencies**: fastapi, httpx, pydantic

### app/config.py (Configuration)
**Responsibility**: Centralized settings management

**Key Components**:
- BaseSettings from pydantic-settings
- API configuration
- Polygon API credentials
- Analysis parameters
- Thresholds and limits
- Environment variable loading

**Dependencies**: pydantic-settings

### app/utils.py (Technical Analysis)
**Responsibility**: Financial calculations and indicators

**Key Functions**:
- `calculate_moving_average()` - Simple moving average
- `calculate_sma()` - SMA for all points
- `calculate_ema()` - Exponential moving average
- `calculate_momentum()` - Price change percentage
- `calculate_rsi()` - Relative Strength Index
- `calculate_volatility()` - Historical volatility
- `calculate_macd()` - MACD indicator
- `calculate_bollinger_bands()` - Bollinger Bands
- `generate_signal()` - Combined signal generation

**Dependencies**: None (pure Python)

## API Design

### Request/Response Flow

```
Client Request
    ↓
FastAPI Router
    ↓
Request Validation (Pydantic)
    ↓
Business Logic (main.py)
    ↓
External API Call (Polygon)
    ↓
Data Processing (utils.py)
    ↓
Response Model (Pydantic)
    ↓
JSON Response to Client
```

### Endpoint Categories

#### 1. Health Check
- **GET** `/health`
- Status: operational
- API ready: true/false

#### 2. Stock Data
- **GET** `/api/stocks/{symbol}/price`
- **GET** `/api/stocks/{symbol}/daily`

#### 3. Recommendations
- **GET** `/api/recommendations/{symbol}`
- **GET** `/api/recommendations/batch`

#### 4. Portfolio
- **POST** `/api/portfolio/analyze`

## Data Models

### Input Models
```python
- Query Parameters: symbol, timespan, period, limit
- Path Parameters: symbol
- Request Body: portfolio holdings
```

### Output Models
```python
- StockPrice
  - symbol, price, timestamp, change_percent
  
- DailyAggregate
  - symbol, date, open, high, low, close, volume, vwap
  
- StockRecommendation
  - symbol, action, confidence, reason, target_price, analysis_date
  
- HealthResponse
  - status, timestamp, api_ready
```

## Technical Analysis Logic

### Recommendation Algorithm

```
1. Fetch historical price data (30-252 days)
   ↓
2. Calculate technical indicators
   ├─ 20-day and 50-day moving averages
   ├─ Momentum (price change %)
   ├─ RSI (Relative Strength Index)
   └─ MACD crossovers
   ↓
3. Evaluate conditions
   ├─ Uptrend: price > MA20 > MA50 + momentum > 2%
   ├─ Downtrend: price < MA20 < MA50 + momentum < -2%
   └─ Neutral: no clear trend
   ↓
4. Generate recommendation
   ├─ Action: BUY/SELL/HOLD
   ├─ Confidence: 0.0 - 1.0
   ├─ Reason: human-readable explanation
   └─ Target: optional price target
```

### Confidence Scoring

```
Base: 0.5 (neutral)

+ Uptrend: +0.2 to +0.45 (confidence up to 0.95)
+ Strong momentum: +0.1 to +0.2
+ RSI oversold: +0.15
+ MACD bullish: +0.1

- Downtrend: -0.2 to -0.45 (confidence down to 0.05)
- Weak momentum: -0.1 to -0.2
- RSI overbought: -0.15
- MACD bearish: -0.1
- High volatility: ×0.8 (reduce confidence)

Final: clamp(0.0, confidence, 1.0)
```

## Deployment Architectures

### Local Development
```
Developer Machine
    ↓
Python 3.8+
    ↓
Virtual Environment (venv)
    ↓
pip install requirements.txt
    ↓
uvicorn app.main:app --reload
    ↓
http://localhost:8000
```

### Docker Container
```
Host Machine
    ↓
Docker Engine
    ↓
Docker Image (Dockerfile)
    ├─ Base: python:3.11-slim
    ├─ Dependencies: pip install
    ├─ Code: COPY
    └─ CMD: uvicorn app.main:app
    ↓
Container Runtime
    ↓
http://localhost:8000
```

### Docker Compose (Full Stack)
```
docker-compose.yml
    ├─ stock-api service
    │   └─ StockRecommendationPlatform container
    └─ nginx service (optional)
        └─ Reverse proxy to stock-api
        
http://localhost:8000 (direct)
http://localhost:80 (via proxy)
```

### Production Deployment (Cloud)

```
Application Tier
    ├─ Gunicorn + Uvicorn (ASGI workers)
    ├─ Load balancer (2+ instances)
    └─ Environment: Heroku/Railway/Render/AWS/GCP

Reverse Proxy
    ├─ Nginx or CDN
    └─ HTTPS/TLS termination

External APIs
    ├─ Polygon API (stock data)
    └─ Optional monitoring/logging services

Database (Optional)
    ├─ Redis (caching)
    └─ PostgreSQL (historical analysis)
```

## Error Handling

### HTTP Status Codes
```
200 OK              - Successful request
400 Bad Request     - Invalid parameters
401 Unauthorized    - Invalid API key
404 Not Found       - Symbol not found
500 Server Error    - Internal error
503 Unavailable     - External API timeout
```

### Exception Handling
```python
- HTTPException (FastAPI)
  ├─ status_code: HTTP status
  ├─ detail: error message
  └─ headers: optional response headers

- Validation Errors (Pydantic)
  └─ Automatic 422 response

- Timeout Errors (httpx)
  └─ Converted to 503 Service Unavailable
```

## Security Considerations

### API Key Management
- Stored in environment variables (.env)
- Never committed to git
- Validated before API calls
- Rotatable without code changes

### CORS Configuration
```python
# Current: Open to all origins (development)
allow_origins=["*"]

# Production: Restrict to specific domains
allow_origins=["https://yourdomain.com"]
```

### Input Validation
- All inputs validated with Pydantic
- Query parameters: length limits, enum values
- Path parameters: format validation
- Request bodies: schema validation

### Rate Limiting
- Polygon API: Subject to plan limits
- Consider Redis-based rate limiter for production
- Implement caching to reduce API calls

## Performance Optimization

### Caching Strategy
```
Current:
- No internal caching (stateless)

Recommended:
- Redis cache for stock prices (5 min TTL)
- In-memory cache for technical indicators (1 hour)
- Database cache for historical analysis results
```

### Database Integration
```
Optional PostgreSQL:
├─ Stock price history
├─ User portfolios
├─ Recommendation history
└─ Analysis results
```

### Monitoring & Logging
```
Metrics to track:
├─ Request count/latency
├─ API error rates
├─ Polygon API rate usage
├─ Recommendation accuracy
└─ System resources (CPU, memory)

Logging:
├─ Request/response logs
├─ Error stack traces
├─ API call details
└─ Analysis debugging
```

## Scalability

### Horizontal Scaling
```
Load Balancer
    ├─ Instance 1: FastAPI
    ├─ Instance 2: FastAPI
    └─ Instance N: FastAPI
    
    → Redis (session/cache)
    → PostgreSQL (state)
```

### Asynchronous Processing
```
Current: Synchronous (blocking requests)

Future:
├─ Celery task queue
├─ RabbitMQ/Redis broker
└─ Long-running analysis jobs
```

## Development Workflow

### Adding a New Endpoint
1. Define Pydantic model in main.py
2. Implement business logic in main.py
3. Add async route handler with proper error handling
4. Test with Swagger UI (/docs)
5. Update README with endpoint documentation

### Adding a New Indicator
1. Implement calculation function in utils.py
2. Add unit tests
3. Integrate into recommendation logic
4. Update analysis documentation

### Testing
```bash
# Unit tests
pytest tests/

# Integration tests
pytest tests/integration/

# API tests
curl http://localhost:8000/api/...

# Load testing
locust -f loadtest.py
```

## Dependencies

### Runtime
```
fastapi==0.104.1      - Web framework
uvicorn==0.24.0       - ASGI server
python-dotenv==1.0.0  - Environment variables
httpx==0.25.2         - Async HTTP client
pydantic==2.5.0       - Data validation
pydantic-settings==2.1.0 - Settings
requests==2.31.0      - HTTP requests
numpy==1.24.3         - Numerical computing
pandas==2.0.3         - Data analysis
scipy==1.11.4         - Scientific computing
```

### Development
```
pytest               - Testing framework
pytest-asyncio      - Async testing
locust              - Load testing
black               - Code formatting
pylint              - Code linting
mypy                - Type checking
```

## Future Enhancements

### Phase 1: Analysis Improvements
- [ ] Machine learning predictions
- [ ] Sentiment analysis from news/social
- [ ] Volume-based signals
- [ ] Options Greeks calculator

### Phase 2: User Features
- [ ] User authentication/authorization
- [ ] Portfolio persistence
- [ ] Alert notifications
- [ ] Custom indicator configuration

### Phase 3: Infrastructure
- [ ] Caching layer (Redis)
- [ ] Database integration (PostgreSQL)
- [ ] Real-time WebSocket updates
- [ ] GraphQL API

### Phase 4: Analytics
- [ ] Recommendation accuracy tracking
- [ ] Backtesting framework
- [ ] Performance dashboards
- [ ] User analytics

## Maintenance

### Regular Tasks
```
Daily:   - Monitor API health
         - Check error rates
         
Weekly:  - Review recommendation accuracy
         - Update dependencies
         - Backup data
         
Monthly: - Performance analysis
         - Security audit
         - User feedback review
         
Yearly:  - Major version upgrades
         - Architecture review
         - Disaster recovery drill
```

### Monitoring Checklist
- [ ] API response times
- [ ] Error rates and types
- [ ] Polygon API rate limits
- [ ] Server resource usage
- [ ] Database performance
- [ ] Recommendation accuracy

---

For detailed setup and usage, see [README.md](README.md) and [QUICKSTART.md](QUICKSTART.md).
