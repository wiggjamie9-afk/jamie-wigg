# OpenManus Automated Notifications Setup

Send task results automatically via email and Slack after OpenManus completes.

## Quick Setup (5 minutes)

### 1. Enable Notifications

Create `.env` file in openmanus directory:

```bash
# Email Configuration
EMAIL_ENABLED=true
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_SENDER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Slack Configuration
SLACK_ENABLED=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 2. Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select: Mail + Windows Computer
3. Copy the 16-character app password
4. Paste in `.env` as `EMAIL_PASSWORD`

### 3. Get Slack Webhook

1. Go to: https://api.slack.com/apps
2. Create New App → From scratch
3. Name: "OpenManus Bot"
4. Choose workspace
5. Enable "Incoming Webhooks"
6. Click "Add New Webhook to Workspace"
7. Select channel (e.g., #automation)
8. Copy webhook URL → `.env` as `SLACK_WEBHOOK_URL`

### 4. Use in Your Code

```python
from notifications import NotificationManager

notifier = NotificationManager()

# After OpenManus task completes:
notifier.notify_task_complete(
    task_name="Data Entry",
    result={
        "rows_processed": 150,
        "success": True,
        "time_taken": "2 minutes"
    },
    client_email="client@example.com",
    client_slack_channel="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
)

# If task fails:
notifier.notify_task_error(
    task_name="Data Entry",
    error="Connection timeout after 5 retries",
    client_email="client@example.com"
)
```

---

## Email Setup Options

### Gmail (Recommended for Testing)
- **SMTP Server:** smtp.gmail.com
- **Port:** 587
- **Requires:** App Password (not regular password)
- **Get App Password:** https://myaccount.google.com/apppasswords

### Outlook/Microsoft
- **SMTP Server:** smtp-mail.outlook.com
- **Port:** 587
- **Requires:** Email + Password

### SendGrid (For Production)
- **SMTP Server:** smtp.sendgrid.net
- **Port:** 587
- **Username:** apikey
- **Password:** Your SendGrid API key
- **Cost:** Free tier: 100 emails/day

### AWS SES (For High Volume)
- **SMTP Server:** email-smtp.[region].amazonaws.com
- **Port:** 587
- **Cost:** $0.10 per 1000 emails

---

## Slack Setup Details

### Option A: Webhook URL (Simple)
- Easy setup
- Works for basic notifications
- Single channel/user only

**Get webhook:**
1. Go to: https://api.slack.com/apps
2. Create App → "From scratch"
3. Enable "Incoming Webhooks"
4. Add webhook to workspace
5. Copy URL

### Option B: Bot Token (Advanced)
- Can send to multiple channels
- Can read messages
- More powerful

**Get bot token:**
1. Create Slack App
2. Go to "OAuth & Permissions"
3. Add scope: `chat:write`
4. Install to workspace
5. Copy Bot Token

---

## Integration with OpenManus

### Auto-Notify After Each Task

Edit your OpenManus workflow to send notifications:

```python
# In your workflow script
import asyncio
from app.agent.manus import Manus
from notifications import NotificationManager

async def run_task_with_notification():
    notifier = NotificationManager()
    
    try:
        agent = await Manus.create()
        result = await agent.run("Your task here")
        
        # Send success notification
        notifier.notify_task_complete(
            task_name="My Task",
            result=result,
            client_email="client@example.com"
        )
        
    except Exception as e:
        # Send error notification
        notifier.notify_task_error(
            task_name="My Task",
            error=str(e),
            client_email="client@example.com"
        )

asyncio.run(run_task_with_notification())
```

### Schedule Notifications

Use cron or GitHub Actions to auto-send:

```bash
# Daily at 9 AM
0 9 * * * cd /path/to/openmanus && python my_workflow.py
```

---

## For Your Service Business

### Client Notification Template

```python
# For each client
clients = [
    {
        "name": "Client A",
        "email": "contacta@company.com",
        "slack_webhook": "https://hooks.slack.com/services/XXXXX"
    },
    {
        "name": "Client B",
        "email": "contactb@company.com",
        "slack_webhook": None  # Email only
    }
]

# Send results to all clients
for client in clients:
    notifier.notify_task_complete(
        task_name=f"Daily Automation - {client['name']}",
        result=task_results,
        client_email=client["email"],
        client_slack_channel=client["slack_webhook"]
    )
```

---

## Troubleshooting

### "Email failed: 535 Authentication failed"
- Gmail: Use 16-char App Password (not your regular password)
- Outlook: Make sure password is correct
- Solution: https://myaccount.google.com/apppasswords

### "Slack failed: 404 not found"
- Webhook URL is invalid
- Solution: Copy fresh webhook URL from https://api.slack.com/apps

### "Connection refused"
- Network blocked
- Check firewall/VPN
- Try different SMTP server

### "Module not found: requests"
```bash
pip install requests
```

---

## Security Best Practices

✅ **DO:**
- Store credentials in `.env` file (gitignored)
- Use app-specific passwords (not account password)
- Rotate API keys monthly
- Use different webhooks per client (optional)

❌ **DON'T:**
- Commit `.env` to git
- Use main account password
- Share webhook URLs publicly
- Log sensitive data

---

## Cost Breakdown

| Service | Cost | Volume |
|---------|------|--------|
| Gmail | Free | 100/day |
| SendGrid | Free | 100/day |
| SendGrid Pro | $20/mo | 40,000+/mo |
| AWS SES | $0.10/1000 | Unlimited |
| Slack Webhooks | Free | Unlimited |

---

## Next Steps

1. ✅ Create `.env` file with credentials
2. ✅ Test notifications: `python notifications.py`
3. ✅ Integrate into your workflow
4. ✅ Set up cron job for scheduling
5. ✅ Add client email/Slack URLs
6. ✅ Start automating!

---

## File Created

- `notifications.py` - Notification manager class
- `NOTIFICATIONS-SETUP.md` - This guide

Use `NotificationManager` to send automated results! 🚀

---

**Status**: Ready to send results automatically  
**Cost**: Free (using Gmail + Slack)  
**Setup Time**: 5 minutes
