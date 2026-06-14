# Stock Recommendation Platform - Quick Start Guide

Get the Stock Recommendation Platform running in 5 minutes!

## Option 1: Traditional Setup (Recommended for Development)

### Step 1: Clone/Enter Directory
```bash
cd /home/user/jamie-wigg/StockRecommendationPlatform
```

### Step 2: Run Setup Script

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

### Step 3: Get API Key
1. Go to https://polygon.io/
2. Sign up for a free account
3. Copy your API key

### Step 4: Configure
Edit the `.env` file:
```
POLYGON_API_KEY=your_api_key_here
```

### Step 5: Run Server
```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

### Step 6: Test
Open http://localhost:8000/docs in your browser

---

## Option 2: Docker Setup (Recommended for Production)

### Step 1: Ensure Docker is Installed
```bash
docker --version
docker-compose --version
```

### Step 2: Get API Key
Visit https://polygon.io/ and get your free API key

### Step 3: Create .env File
```bash
cp .env.example .env
# Edit .env and add your POLYGON_API_KEY
```

### Step 4: Run with Docker Compose
```bash
docker-compose up -d
```

The API will be available at http://localhost:8000

### Step 5: View Logs
```bash
docker-compose logs -f
```

### Step 6: Stop
```bash
docker-compose down
```

---

## First API Call

### Get Stock Price
```bash
curl http://localhost:8000/api/stocks/AAPL/price
```

### Get Recommendation
```bash
curl "http://localhost:8000/api/recommendations/AAPL?period=30"
```

### Get Multiple Recommendations
```bash
curl "http://localhost:8000/api/recommendations/batch?symbols=AAPL,GOOGL,MSFT"
```

---

## Using the Interactive API Docs

The API includes built-in interactive documentation:

1. **Swagger UI**: http://localhost:8000/docs
   - Test endpoints directly
   - See request/response examples

2. **ReDoc**: http://localhost:8000/redoc
   - Beautiful API documentation
   - Organized by endpoint type

---

## Example Python Script

Create `test_api.py`:

```python
import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    # Test health check
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(json.dumps(response.json(), indent=2))
    
    # Get stock price
    print("\nGetting AAPL price...")
    response = requests.get(f"{BASE_URL}/api/stocks/AAPL/price")
    print(json.dumps(response.json(), indent=2))
    
    # Get recommendation
    print("\nGetting AAPL recommendation...")
    response = requests.get(f"{BASE_URL}/api/recommendations/AAPL?period=60")
    rec = response.json()
    print(f"Symbol: {rec['symbol']}")
    print(f"Action: {rec['action']}")
    print(f"Confidence: {rec['confidence']:.2%}")
    print(f"Reason: {rec['reason']}")
    
    # Batch recommendations
    print("\nGetting batch recommendations...")
    response = requests.get(
        f"{BASE_URL}/api/recommendations/batch",
        params={"symbols": "AAPL,GOOGL,MSFT,TSLA"}
    )
    data = response.json()
    for rec in data["recommendations"]:
        print(f"{rec['symbol']}: {rec['action']} ({rec['confidence']:.2%})")

if __name__ == "__main__":
    test_api()
```

Run it:
```bash
pip install requests
python test_api.py
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find what's using port 8000
lsof -i :8000  # macOS/Linux

# Use different port
uvicorn app.main:app --port 8001
```

### API Key Error
- Verify your API key in `.env` is correct
- Restart the server after editing `.env`
- Check Polygon API status: https://polygon.io/status

### Permission Denied (Windows)
```bash
# Run PowerShell as Administrator, then:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module Not Found
```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

---

## Next Steps

1. **Explore the Docs**: http://localhost:8000/docs
2. **Build an App**: Use the API with your frontend
3. **Deploy**: Use Docker or cloud platforms (Heroku, Railway, Render)
4. **Customize**: Edit `app/main.py` to add your own logic

---

## Common Use Cases

### Dashboard Application
```python
# Get latest recommendations for your watchlist
symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "META", "AMZN"]
response = requests.get(
    "http://localhost:8000/api/recommendations/batch",
    params={"symbols": ",".join(symbols)}
)
recommendations = response.json()["recommendations"]

# Display in your dashboard
for rec in recommendations:
    print(f"{rec['symbol']}: {rec['action']} ({rec['confidence']:.0%})")
```

### Automated Trading Bot
```python
# Generate signal for algorithmic trading
def generate_trade_signal(symbol):
    response = requests.get(
        f"http://localhost:8000/api/recommendations/{symbol}",
        params={"period": 60}
    )
    rec = response.json()
    
    if rec['action'] == 'BUY' and rec['confidence'] > 0.75:
        return 'BUY'
    elif rec['action'] == 'SELL' and rec['confidence'] > 0.75:
        return 'SELL'
    else:
        return 'HOLD'
```

### Portfolio Monitoring
```python
# Monitor your portfolio daily
portfolio = [
    {"symbol": "AAPL", "shares": 10},
    {"symbol": "GOOGL", "shares": 5},
]

for holding in portfolio:
    response = requests.get(
        f"http://localhost:8000/api/stocks/{holding['symbol']}/price"
    )
    price_data = response.json()
    current_price = price_data['price']
    value = holding['shares'] * current_price
    print(f"{holding['symbol']}: ${value:,.2f}")
```

---

## Support

- **API Docs**: http://localhost:8000/docs
- **GitHub**: Check the repository for issues
- **Polygon API**: https://polygon.io/docs/stocks

---

Happy trading! 📈
