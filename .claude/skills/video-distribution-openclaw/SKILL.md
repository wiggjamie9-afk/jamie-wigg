---
name: video-distribution-openclaw
description: Automatically route generated videos from the open-models pipeline to OpenClaw for multi-channel distribution (WhatsApp, Telegram, Discord, Slack, iMessage). Monitors output directory, publishes metadata, and handles channel-specific formatting. Use after batch video generation to reach early adopters, communities, and team members across all major platforms.
metadata:
  tags: distribution, openclaw, automation, multi-channel, marketing, 100-apps
---

## When to use

User asks for:
- "Distribute videos to WhatsApp/Telegram/Discord/Slack"
- "Send generated videos to all channels"
- "Share the 100 APPS videos with the community"
- "Broadcast videos to early adopters"
- Post-generation distribution of marketing content

Perfect for:
- Multi-channel content delivery after batch generation
- Reaching underserved market communities on their native platforms
- Team announcements and launch coordination
- A/B testing videos across different channels

## Architecture

Five-stage distribution pipeline:

```
app/outputs/
├── VendorPOS/
│   └── VendorPOS.mp4
├── HerdCheck/
│   └── HerdCheck.mp4
└── GigsMaster/
    └── GigsMaster.mp4
         ↓
   [Metadata Generator]
   (title, description, tags, thumbnail)
         ↓
   [OpenClaw Publisher]
   (authenticate, upload, serialize)
         ↓
   [Channel Routers]
   ├→ WhatsApp (customer outreach)
   ├→ Telegram (community bot)
   ├→ Discord (server channels)
   ├→ Slack (internal + partner)
   └→ iMessage (direct early adopters)
         ↓
   [Delivery Log]
   (track delivery status, timestamps, engagement)
```

## Prerequisites

1. **OpenClaw installed** (on local machine or separate service):
   ```bash
   pip install openclaw
   openclaw auth login  # authenticate
   ```

2. **Channel credentials** in `~/.openclaw/channels.json`:
   ```json
   {
     "whatsapp": {
       "api_key": "your-whatsapp-api-key",
       "phone_number": "+1234567890"
     },
     "telegram": {
       "bot_token": "your-telegram-bot-token",
       "channel_id": "@your_channel"
     },
     "discord": {
       "webhook_url": "https://discord.com/api/webhooks/..."
     },
     "slack": {
       "webhook_url": "https://hooks.slack.com/services/..."
     },
     "imessage": {
       "apple_id": "your-apple-id",
       "contacts": ["contact1@icloud.com", "contact2@icloud.com"]
     }
   }
   ```

3. **Video pipeline running** — videos generated in `app/outputs/`

## Basic usage

### Single video distribution

```python
from app.distribution import VideoDistributor

distributor = VideoDistributor()

# Distribute VendorPOS video to all channels
distributor.publish(
    video_path="app/outputs/VendorPOS/VendorPOS.mp4",
    title="VendorPOS - Mobile POS for Street Vendors",
    description="Simple, offline-capable point-of-sale system for informal retailers",
    tags=["100-apps", "retail", "vendor", "pos"],
    channels=["whatsapp", "telegram", "discord", "slack"]  # skip iMessage for this one
)
```

### Batch distribution (100 APPS mission)

```python
from app.distribution import VideoDistributor
import json
from pathlib import Path

distributor = VideoDistributor()

# Load app catalog
with open("apps.json") as f:
    config = json.load(f)

# Distribute each app's video
for app in config["apps"]:
    video_path = f"app/outputs/{app['name']}/{app['name']}.mp4"
    
    if Path(video_path).exists():
        distributor.publish(
            video_path=video_path,
            title=app["title"],
            description=app["description"],
            tags=app.get("tags", ["100-apps"]),
            channels=["telegram", "discord"]  # public channels
        )
        print(f"✓ {app['name']} distributed")
```

### Watch for new videos and auto-distribute

```python
from app.distribution import VideoWatcher
import time

watcher = VideoWatcher(
    watch_dir="app/outputs/",
    auto_channels=["telegram", "discord"],  # auto-distribute to these
    exclude_channels=["imessage"]  # never send to iMessage without approval
)

# Start watching
watcher.start()

# Keep running in background
while True:
    time.sleep(60)
    # Watcher automatically publishes new videos
    # Check status: watcher.get_status()
```

## Channel-specific formatting

Each channel has different constraints and optimal formats:

### WhatsApp
```python
distributor.publish(
    video_path="...",
    channels=["whatsapp"],
    whatsapp_config={
        "recipient_phone": "+1234567890",
        "caption": "Check out VendorPOS! 📱\n\n[link to landing page]",
        "video_note": True  # send as video note (shorter, looped)
    }
)
```

### Telegram
```python
distributor.publish(
    video_path="...",
    channels=["telegram"],
    telegram_config={
        "channel_id": "@myapp_videos",
        "caption": "🎬 New: VendorPOS\n\nMobile POS system for street vendors\n\n#100apps #retail",
        "parse_mode": "HTML",
        "pin_message": True  # pin important announcements
    }
)
```

### Discord
```python
distributor.publish(
    video_path="...",
    channels=["discord"],
    discord_config={
        "webhook_url": "https://discord.com/api/webhooks/...",
        "embed": {
            "title": "VendorPOS Launch",
            "description": "Simple offline-capable POS for informal retailers",
            "color": 0x00ff00,
            "image": "thumbnail.png"  # auto-generated from first frame
        },
        "ping_roles": ["@everyone"]  # notify specific roles
    }
)
```

### Slack
```python
distributor.publish(
    video_path="...",
    channels=["slack"],
    slack_config={
        "webhook_url": "https://hooks.slack.com/services/...",
        "channel": "#100-apps-launch",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*New App: VendorPOS*\nMobile POS system for street vendors"
                }
            },
            {
                "type": "image",
                "image_url": "thumbnail.png"
            }
        ]
    }
)
```

### iMessage
```python
distributor.publish(
    video_path="...",
    channels=["imessage"],
    imessage_config={
        "recipients": ["founder@icloud.com", "investor@icloud.com"],
        "message": "Check out VendorPOS! Generated with our open-source pipeline.",
        "requires_approval": True  # flag for manual review before sending
    }
)
```

## Cost analysis

| Channel | Cost per video | Rate limit | Best for |
|---------|---|---|---|
| **WhatsApp** | $0.05–$0.10 | 1000/day | Direct outreach, customers |
| **Telegram** | $0 | Unlimited | Community announcements, broadcasts |
| **Discord** | $0 | Unlimited | Community servers, team channels |
| **Slack** | $0 | Unlimited | Internal team, partner orgs |
| **iMessage** | $0 | Per account | Direct early adopters, executives |

**Total cost for 100 videos across all channels:** $5–$10 (WhatsApp only; others free)

## Delivery tracking

Monitor distribution status:

```python
from app.distribution import VideoDistributor

distributor = VideoDistributor()

# Check delivery log
log = distributor.get_delivery_log()

for entry in log:
    print(f"{entry['video']} → {entry['channel']}: {entry['status']}")
    # Output:
    # VendorPOS → telegram: delivered (2026-05-20T14:32:01Z)
    # VendorPOS → discord: delivered (2026-05-20T14:32:15Z)
    # VendorPOS → whatsapp: pending (waiting for credits)
    # VendorPOS → slack: delivered
    # VendorPOS → imessage: pending_approval
```

Export delivery metrics:

```python
metrics = distributor.get_metrics()

print(f"Videos distributed: {metrics['total_videos']}")
print(f"Total deliveries: {metrics['total_deliveries']}")
print(f"Success rate: {metrics['success_rate']*100:.1f}%")
print(f"Channels used: {', '.join(metrics['channels'])}")
print(f"Cost: ${metrics['total_cost']:.2f}")

# Save for reporting
import json
with open("distribution_report.json", "w") as f:
    json.dump(metrics, f, indent=2)
```

## Error recovery

If a delivery fails:

```python
from app.distribution import VideoDistributor

distributor = VideoDistributor()

# Retry failed deliveries
failed = distributor.get_failed_deliveries()

for item in failed:
    print(f"Retrying {item['video']} → {item['channel']}")
    
    try:
        distributor.retry(
            video_path=item['video_path'],
            channel=item['channel'],
            max_retries=3
        )
    except Exception as e:
        print(f"  Still failing: {e}")
        # Log for manual review
```

## Integration with batch video generation

After completing batch generation, automatically distribute:

```python
from app import CompleteVideoPipeline
from app.distribution import VideoDistributor
import json

# Generate videos
config = json.load(open("apps.json"))
pipeline = CompleteVideoPipeline()

distributor = VideoDistributor()

for app in config["apps"]:
    # Generate video
    output = pipeline.generate_video(app["description"], 5, app["name"])
    
    # Auto-distribute to public channels
    distributor.publish(
        video_path=output,
        title=app["title"],
        description=app["description"],
        tags=app.get("tags", ["100-apps"]),
        channels=["telegram", "discord"]  # public only
    )
    
    print(f"✓ {app['name']}: generated + distributed")

# Send approval request for sensitive channels (iMessage to executives)
pending = distributor.get_pending_approvals()
if pending:
    print(f"\n{len(pending)} videos pending approval for iMessage")
    print("Review at: https://dashboard.openclaw.ai/pending")
```

## Webhook and automation

Set up automatic distribution on CI/CD:

```yaml
# .github/workflows/publish-videos.yml
name: Generate and Distribute Videos

on:
  workflow_dispatch:
    inputs:
      app_count:
        description: 'Number of apps to generate'
        required: true
        default: '5'

jobs:
  generate-and-distribute:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate videos
        run: |
          python app/TEST_PIPELINE.py
          python -c "from app.distribution import VideoWatcher; w = VideoWatcher(); w.publish_all()"
      
      - name: Report
        run: |
          python -c "from app.distribution import VideoDistributor; d = VideoDistributor(); print(d.get_metrics())"
```

## Files to reference

- `app/distribution.py` — VideoDistributor, VideoWatcher classes (to be created)
- `app/openclaw_adapter.py` — OpenClaw channel integrations
- `~/.openclaw/channels.json` — channel credentials (gitignored)
- `distribution_report.json` — delivery logs and metrics
- `100_APPS_MISSION.md` — app catalog reference
- `batch-video-apps` skill — batch generation reference
