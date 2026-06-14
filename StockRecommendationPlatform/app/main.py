"""
StockRecommendationPlatform - FastAPI Backend
Real-time stock data fetching and AI-powered recommendations
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
import os
from datetime import datetime, timedelta
import json

# Initialize FastAPI app
app = FastAPI(
    title="Stock Recommendation Platform",
    description="Real-time stock data and AI recommendations",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY", "")
POLYGON_BASE_URL = "https://api.polygon.io"

# Pydantic Models
class StockPrice(BaseModel):
    symbol: str
    price: float
    timestamp: str
    change_percent: float

class DailyAggregate(BaseModel):
    symbol: str
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    vwap: Optional[float] = None

class StockRecommendation(BaseModel):
    symbol: str
    action: str  # "BUY", "SELL", "HOLD"
    confidence: float  # 0-1
    reason: str
    target_price: Optional[float] = None
    analysis_date: str

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    api_ready: bool

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "api_ready": bool(POLYGON_API_KEY)
    }

# Stock Data Endpoints
@app.get("/api/stocks/{symbol}/price", response_model=StockPrice)
async def get_stock_price(symbol: str = Query(..., description="Stock symbol (e.g., AAPL)")):
    """
    Get real-time stock price from Polygon API
    """
    if not POLYGON_API_KEY:
        raise HTTPException(
            status_code=400,
            detail="POLYGON_API_KEY not configured"
        )

    try:
        async with httpx.AsyncClient() as client:
            # Fetch latest quote
            url = f"{POLYGON_BASE_URL}/v3/quotes/{symbol}"
            response = await client.get(
                url,
                params={"apikey": POLYGON_API_KEY},
                timeout=10.0
            )

            if response.status_code == 401:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid POLYGON_API_KEY"
                )
            elif response.status_code == 404:
                raise HTTPException(
                    status_code=404,
                    detail=f"Stock symbol {symbol} not found"
                )

            data = response.json()

            if "results" not in data or not data["results"]:
                raise HTTPException(
                    status_code=404,
                    detail=f"No data available for {symbol}"
                )

            result = data["results"][0]

            return {
                "symbol": symbol.upper(),
                "price": result.get("last_quote", {}).get("ask", 0),
                "timestamp": result.get("timeframe", ""),
                "change_percent": result.get("last_quote", {}).get("ask_price", 0) - result.get("last_quote", {}).get("bid_price", 0)
            }

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=503,
            detail="Polygon API timeout"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching stock price: {str(e)}"
        )

@app.get("/api/stocks/{symbol}/daily", response_model=List[DailyAggregate])
async def get_daily_aggregates(
    symbol: str = Query(..., description="Stock symbol"),
    timespan: str = Query("day", description="day, week, month, quarter, year"),
    limit: int = Query(30, ge=1, le=252, description="Number of results")
):
    """
    Get daily aggregates (OHLCV data) for stock analysis
    """
    if not POLYGON_API_KEY:
        raise HTTPException(
            status_code=400,
            detail="POLYGON_API_KEY not configured"
        )

    try:
        async with httpx.AsyncClient() as client:
            url = f"{POLYGON_BASE_URL}/v2/aggs/ticker/{symbol}/range/1/{timespan}"
            response = await client.get(
                url,
                params={
                    "apikey": POLYGON_API_KEY,
                    "limit": limit
                },
                timeout=10.0
            )

            if response.status_code == 404:
                raise HTTPException(
                    status_code=404,
                    detail=f"Stock symbol {symbol} not found"
                )

            data = response.json()

            if "results" not in data:
                return []

            results = []
            for agg in data["results"]:
                results.append({
                    "symbol": symbol.upper(),
                    "date": datetime.fromtimestamp(agg.get("t", 0) / 1000).strftime("%Y-%m-%d"),
                    "open": agg.get("o", 0),
                    "high": agg.get("h", 0),
                    "low": agg.get("l", 0),
                    "close": agg.get("c", 0),
                    "volume": agg.get("v", 0),
                    "vwap": agg.get("vw", None)
                })

            return sorted(results, key=lambda x: x["date"], reverse=True)

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=503,
            detail="Polygon API timeout"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching daily aggregates: {str(e)}"
        )

# Recommendation Endpoints
@app.get("/api/recommendations/{symbol}", response_model=StockRecommendation)
async def get_recommendation(
    symbol: str = Query(..., description="Stock symbol"),
    period: int = Query(30, ge=5, le=252, description="Analysis period in days")
):
    """
    Generate AI-powered stock recommendation based on technical analysis
    """
    try:
        # Fetch daily data
        async with httpx.AsyncClient() as client:
            url = f"{POLYGON_BASE_URL}/v2/aggs/ticker/{symbol}/range/1/day"
            response = await client.get(
                url,
                params={
                    "apikey": POLYGON_API_KEY,
                    "limit": period
                },
                timeout=10.0
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Unable to fetch stock data for analysis"
                )

            data = response.json()

            if "results" not in data or len(data["results"]) < 5:
                raise HTTPException(
                    status_code=400,
                    detail="Insufficient data for recommendation"
                )

            results = sorted(data["results"], key=lambda x: x["t"])
            closes = [r["c"] for r in results]

            # Simple technical analysis
            current_price = closes[-1]
            avg_price_20 = sum(closes[-20:]) / min(20, len(closes))
            avg_price_50 = sum(closes[-50:]) / min(50, len(closes)) if len(closes) >= 50 else sum(closes) / len(closes)

            # Calculate momentum
            momentum = (closes[-1] - closes[0]) / closes[0] * 100 if closes[0] > 0 else 0

            # Generate recommendation based on simple rules
            if current_price > avg_price_20 > avg_price_50 and momentum > 2:
                action = "BUY"
                confidence = min(0.95, 0.7 + (momentum / 100))
                reason = "Strong uptrend detected. Price above 20-day and 50-day averages with positive momentum."
                target = current_price * 1.1
            elif current_price < avg_price_20 < avg_price_50 and momentum < -2:
                action = "SELL"
                confidence = min(0.95, 0.7 + abs(momentum / 100))
                reason = "Strong downtrend detected. Price below 20-day and 50-day averages with negative momentum."
                target = current_price * 0.9
            else:
                action = "HOLD"
                confidence = 0.6 + (abs(momentum) / 200)
                reason = "No clear trend. Consolidating price action. Monitor for breakout."
                target = None

            return {
                "symbol": symbol.upper(),
                "action": action,
                "confidence": min(1.0, max(0.0, confidence)),
                "reason": reason,
                "target_price": target,
                "analysis_date": datetime.utcnow().isoformat()
            }

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=503,
            detail="Analysis timeout"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendation: {str(e)}"
        )

@app.get("/api/recommendations/batch")
async def batch_recommendations(
    symbols: str = Query(..., description="Comma-separated stock symbols (e.g., AAPL,GOOGL,MSFT)")
):
    """
    Get recommendations for multiple stocks
    """
    stock_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]

    if not stock_list:
        raise HTTPException(
            status_code=400,
            detail="At least one symbol required"
        )

    if len(stock_list) > 50:
        raise HTTPException(
            status_code=400,
            detail="Maximum 50 symbols per request"
        )

    recommendations = []
    for symbol in stock_list:
        try:
            rec = await get_recommendation(symbol=symbol)
            recommendations.append(rec)
        except HTTPException:
            # Skip symbols that fail
            continue

    return {
        "count": len(recommendations),
        "timestamp": datetime.utcnow().isoformat(),
        "recommendations": recommendations
    }

# Portfolio endpoints
@app.post("/api/portfolio/analyze")
async def analyze_portfolio(portfolio: dict):
    """
    Analyze a stock portfolio and generate recommendations
    """
    holdings = portfolio.get("holdings", [])

    if not holdings:
        raise HTTPException(
            status_code=400,
            detail="Portfolio must contain at least one holding"
        )

    analysis = {
        "timestamp": datetime.utcnow().isoformat(),
        "portfolio_value": 0,
        "recommendations": [],
        "risk_level": "MODERATE"
    }

    return analysis

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "Stock Recommendation Platform",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "stock_price": "/api/stocks/{symbol}/price",
            "daily_data": "/api/stocks/{symbol}/daily",
            "recommendation": "/api/recommendations/{symbol}",
            "batch_recommendations": "/api/recommendations/batch",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
