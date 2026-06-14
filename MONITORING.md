# Monitoring & Analytics Setup

Complete monitoring and logging configuration for the ecosystem.

## 🔍 Error Tracking with Sentry

### Setup

```bash
# Install Sentry SDK
pip install sentry-sdk

# Add to PDF Analyzer API
```

**In `pdf-analyzer-api/main.py`:**

```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
    environment="production"
)
```

**Environment Variable:**
```
SENTRY_DSN=https://key@sentry.io/project-id
```

### Configure in Dashboard

1. Go to https://sentry.io
2. Create new project
3. Select Python as platform
4. Copy DSN
5. Add to `.env`

---

## 📊 Logging Configuration

### API Logging

**In `pdf-analyzer-api/main.py`:**

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

### Frontend Logging

**In `pdf-analyzer-web/app/page.tsx`:**

```typescript
// Log API calls
const handleAnalyze = async () => {
    console.log('Starting analysis...', { code: code.length });
    
    try {
        const response = await axios.post(`${API_BASE}/analyze`, ...);
        console.log('Analysis successful', { tokens: response.data.tokens_used });
    } catch (err) {
        console.error('Analysis failed', err);
    }
};
```

---

## 📈 Metrics & Analytics

### Key Metrics to Track

1. **API Metrics**
   - Requests per minute
   - Average response time
   - Error rate
   - Token usage per analysis

2. **Frontend Metrics**
   - Page load time
   - User interactions
   - API error frequency
   - Analysis success rate

3. **Business Metrics**
   - Daily active users
   - Analyses per day
   - Average tokens per analysis
   - Error breakdown

### Using Datadog

```python
# Install
pip install datadog

# Initialize
from datadog import initialize, api

options = {
    'api_key': os.getenv("DATADOG_API_KEY"),
    'app_key': os.getenv("DATADOG_APP_KEY")
}

initialize(**options)
```

---

## 🔔 Alerts & Notifications

### Sentry Alerts

Configure in Sentry dashboard:
1. Settings → Alerts
2. Create new alert
3. Trigger: Error rate > 5%
4. Action: Send email/Slack

### Email Alerts

```python
import smtplib
from email.mime.text import MIMEText

def send_alert(subject, message):
    msg = MIMEText(message)
    msg['Subject'] = subject
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, ADMIN_EMAIL, msg.as_string())
```

### Slack Integration

```python
import requests

def send_slack_alert(message):
    webhook = os.getenv("SLACK_WEBHOOK")
    requests.post(webhook, json={"text": message})
```

---

## 📊 Dashboard Setup

### Railway Dashboard
- URL: https://railway.app/dashboard
- View logs, metrics, deployments
- Set up alerts

### Vercel Dashboard
- URL: https://vercel.com/dashboard
- View deployments, analytics, errors
- Configure environment variables

### Sentry Dashboard
- URL: https://sentry.io
- View errors by type
- Track error trends
- Manage alerts

---

## 🎯 Health Checks

### API Health Check

```bash
curl -s http://localhost:8000/ | jq '.status'
```

### Automated Monitoring

```bash
#!/bin/bash
# health-check.sh

API_URL="http://localhost:8000"
WEB_URL="http://localhost:3000"

# Check API
if ! curl -s $API_URL | grep -q "healthy"; then
    echo "API is down!" | mail -s "Alert" admin@example.com
fi

# Check Web
if ! curl -s $WEB_URL | grep -q "PDF Analyzer"; then
    echo "Web app is down!" | mail -s "Alert" admin@example.com
fi
```

---

## 📋 Monitoring Checklist

- [ ] Sentry DSN configured
- [ ] Error logging enabled
- [ ] API metrics collection setup
- [ ] Frontend error tracking added
- [ ] Slack/Email alerts configured
- [ ] Health check script created
- [ ] Dashboard credentials saved
- [ ] Log retention policy set
- [ ] Database backups scheduled
- [ ] Performance baselines established

---

## 🚀 Production Monitoring

### Daily Checklist
- [ ] Check error rates
- [ ] Review performance metrics
- [ ] Verify no unhandled exceptions
- [ ] Check API response times
- [ ] Monitor token usage

### Weekly Review
- [ ] Analyze error trends
- [ ] Review performance graphs
- [ ] Check cost trends
- [ ] Validate backup success
- [ ] Update alert thresholds

### Monthly Review
- [ ] Full system audit
- [ ] Capacity planning
- [ ] Cost optimization
- [ ] Security review
- [ ] Documentation update

---

## 📞 Support Runbook

When alerts fire:

1. **Check Sentry** for error details
2. **Review API logs** for stack trace
3. **Check Railway/Vercel** for deployment status
4. **Verify database** is accessible
5. **Check API quota** with Claude
6. **Restart services** if needed

---

**Contact**: your-email@example.com
**On-call**: rotation schedule
**Escalation**: engineering-team@company.com
