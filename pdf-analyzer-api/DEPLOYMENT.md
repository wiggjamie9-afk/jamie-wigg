# Deployment Guide - PDF Analyzer API

Deploy the PDF Analyzer API to production on various platforms.

## Quick Deploy (Render)

Easiest way to deploy in 5 minutes.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/pdf-analyzer-api.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com (sign in with GitHub)
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Configure:
   - **Name**: `pdf-analyzer-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
5. Add environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
6. Click "Deploy"

✅ Live at: `https://pdf-analyzer-api-xxx.onrender.com`

---

## Docker Deployment

### Local Development

```bash
# Build image
docker build -t pdf-analyzer-api .

# Run container
docker run -p 8000:8000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  pdf-analyzer-api

# Or use docker-compose
docker-compose up
```

### Docker Hub

```bash
# Build and tag
docker build -t YOUR_USERNAME/pdf-analyzer-api:latest .

# Push to Docker Hub
docker login
docker push YOUR_USERNAME/pdf-analyzer-api:latest

# Run from Docker Hub
docker run -p 8000:8000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  YOUR_USERNAME/pdf-analyzer-api:latest
```

---

## Cloud Platforms

### Vercel (Recommended for API)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod \
  --env ANTHROPIC_API_KEY=sk-ant-...
```

**Note**: Requires `api/` folder for Vercel Functions. Convert main.py to Vercel format.

### Railway.app

1. Connect GitHub repository
2. Railway auto-detects Python project
3. Set environment variables:
   - `ANTHROPIC_API_KEY`
4. Deploy button → Deploy
5. Get public URL

**Pros**: Simple, free tier available, auto-deploys

### PythonAnywhere

1. Upload files via FTP or git
2. Create virtual environment
3. Set up WSGI application
4. Add environment variables
5. Reload web app

**Pros**: Python-focused, easy setup

### AWS (EC2)

```bash
# SSH into instance
ssh -i key.pem ubuntu@instance-ip

# Install Python and pip
sudo apt update
sudo apt install python3.11 python3-pip git

# Clone repo
git clone https://github.com/your-repo/pdf-analyzer-api.git
cd pdf-analyzer-api

# Set up virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit with your API key

# Run with systemd
sudo nano /etc/systemd/system/pdf-analyzer.service
```

Add to systemd service:
```ini
[Unit]
Description=PDF Analyzer API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/pdf-analyzer-api
Environment="PATH=/home/ubuntu/pdf-analyzer-api/venv/bin"
ExecStart=/home/ubuntu/pdf-analyzer-api/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable pdf-analyzer
sudo systemctl start pdf-analyzer
```

### Heroku (Deprecated but still works)

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create pdf-analyzer-api

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=sk-ant-...

# Add Procfile
echo "web: python main.py" > Procfile

# Deploy
git push heroku main
```

---

## Using Docker Compose

### Development

```bash
# Start services
docker-compose up

# View logs
docker-compose logs -f pdf-analyzer

# Stop services
docker-compose down
```

### Production

```bash
# Build production image
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Run in background
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Monitor
docker-compose logs -f
```

---

## With Nginx Reverse Proxy

Create `nginx.conf`:

```nginx
upstream pdf_analyzer {
    server pdf-analyzer:8000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://pdf_analyzer;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:
```bash
docker-compose up -d
# Access at http://your-domain.com:80
```

---

## Performance Optimization

### 1. Gunicorn (Production Server)

```bash
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

### 2. Add to Dockerfile

```dockerfile
RUN pip install gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
```

### 3. Auto-scaling

On Render/Railway: Set max instances in settings
On AWS: Use Auto Scaling Group
On Heroku: Add dynos

---

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
pip install sentry-sdk
```

Add to main.py:
```python
import sentry_sdk
sentry_sdk.init(os.getenv("SENTRY_DSN"))
```

### Prometheus (Metrics)

```bash
pip install prometheus-client
```

### Logging to Stdout

```python
import logging
logging.basicConfig(level=logging.INFO)
```

---

## Cost Estimates

| Platform | Cost |
|----------|------|
| Render | Free - $50/month |
| Railway | Free - $10/month |
| Vercel | Free - $20/month |
| Heroku | $7-50/month |
| AWS (t3.micro) | $5-15/month |

Plus:
- **Claude API**: ~$0.06 per 1000 tokens
- 100 analyses/month: ~$6-10

---

## Environment Checklist

Before deploying, ensure:

- [ ] `ANTHROPIC_API_KEY` set in production environment
- [ ] Python version matches (3.9+)
- [ ] All dependencies in requirements.txt
- [ ] .env file not committed to git
- [ ] Health check endpoint `/` working
- [ ] CORS configured if needed
- [ ] SSL/HTTPS enabled
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Rate limiting considered

---

## Troubleshooting Deployment

### Port Already in Use
```bash
lsof -i :8000
kill -9 <PID>
```

### API Key Not Found
```bash
# Verify environment variable is set
env | grep ANTHROPIC_API_KEY

# Check .env file exists
cat .env
```

### PDF Processing Errors
- Check PDF file is valid
- Ensure PyPDF2 is installed
- Check system memory for large PDFs

### SSL Certificate Errors
- Use HTTPS in production
- Configure SSL on your platform
- Update API calls to use HTTPS

---

## Scaling Considerations

### Single Instance (< 100 req/min)
- Render/Railway free tier
- Simple deployment

### Multi-Instance (100-1000 req/min)
- Load balancer (Nginx)
- Multiple worker processes
- Database for caching

### Enterprise (1000+ req/min)
- Kubernetes cluster
- Redis cache
- Database (PostgreSQL)
- CDN for static files
- Separate worker queue

---

## Security in Production

1. **Environment Variables**
   - Never commit secrets
   - Use platform secret management

2. **HTTPS Only**
   - Redirect HTTP to HTTPS
   - Use strong SSL certificates

3. **Rate Limiting**
   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   ```

4. **CORS**
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   app.add_middleware(CORSMiddleware, allow_origins=["*"])
   ```

5. **Authentication**
   - Add API key validation
   - Implement JWT if needed

---

## Next Steps

1. ✅ Choose deployment platform
2. ✅ Set up environment variables
3. ✅ Deploy
4. ✅ Test endpoints
5. ✅ Set up monitoring
6. ✅ Configure CI/CD

---

## Support

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- FastAPI Docs: https://fastapi.tiangolo.com/deployment/
- Docker Docs: https://docs.docker.com/
