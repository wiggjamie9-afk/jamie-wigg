# n8n — Visual Workflow Automation Platform

n8n is a fair-code workflow automation platform with 400+ integrations. Build complex automations visually without coding.

## Installation

### Quick Start (npx)

```bash
# Run n8n instantly (requires Node.js)
npx n8n

# Access at http://localhost:5678
```

### Docker (Recommended for Mac)

```bash
# Create volume
docker volume create n8n_data

# Run n8n
docker run -it --rm --name n8n -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n

# Access at http://localhost:5678
```

### Persistent Docker (Always Running)

```bash
docker run -d --name n8n -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e NODE_ENV=production \
  docker.n8n.io/n8nio/n8n
```

Check status:

```bash
docker ps | grep n8n
docker logs -f n8n
```

## Supported Integrations (400+)

**Communication:**
- Slack, Discord, Telegram, WhatsApp, Email, SMS

**Databases:**
- Supabase, PostgreSQL, MongoDB, MySQL, Firebase

**APIs:**
- REST, GraphQL, Webhooks

**Cloud:**
- AWS, Google Cloud, Azure

**Social Media:**
- Twitter, LinkedIn, Facebook, Instagram

**Development:**
- GitHub, GitLab, Jira

**Payments:**
- Stripe, PayPal, Square

**And 350+ more...**

## Event Platform Workflows

### Workflow 1: Auto-Post Events to Social Media

1. Start → New event created in Supabase
2. Check → Is it public?
3. Generate → Create thumbnail + caption
4. Post → Share on Twitter, LinkedIn, Discord
5. Log → Save success/failure

**Setup:**
1. Open http://localhost:5678
2. Click "Create Workflow"
3. Add trigger: Supabase (table: events, event: insert)
4. Add node: If condition (public === true)
5. Add node: Generate image (call API)
6. Add node: Twitter (post tweet)
7. Add node: Slack (notify team)
8. Save and activate

### Workflow 2: Daily Digest Email

1. Trigger → Every morning at 9 AM
2. Fetch → Get events from today
3. Format → Create HTML email
4. Send → Email to subscribers
5. Log → Record sent

**Nodes:**
- Cron trigger (0 9 * * *)
- HTTP GET (fetch events)
- Function (format HTML)
- Gmail (send email)
- Supabase (log result)

### Workflow 3: Event Registration Confirmation

1. Trigger → User registers for event
2. Get → Event details
3. Generate → PDF ticket
4. Send → Email with ticket
5. Update → Mark in database

**Nodes:**
- Webhook (registration form)
- Supabase (get event)
- Function (create ticket data)
- PDF generator (create ticket)
- Gmail (send email)
- Supabase (update registration)

### Workflow 4: Sync Events Across Platforms

1. Trigger → Event updated in Supabase
2. Transform → Format for each platform
3. Push → Update Google Calendar
4. Push → Update Slack channels
5. Push → Update website
6. Log → Sync status

**Nodes:**
- Supabase trigger (update)
- Function (format data)
- Google Calendar (create/update event)
- Slack API (post update)
- HTTP POST (update website)
- Supabase (log sync)

### Workflow 5: AI-Powered Event Recommendations

1. Trigger → User views event
2. Get → User preferences
3. Get → Similar events
4. Score → Calculate relevance
5. Send → Push notification

**Nodes:**
- Webhook (user action)
- Supabase (get user profile)
- HTTP POST (semantic search API)
- Function (score & rank)
- Firebase (push notification)

## Example Workflow: Event Creation Pipeline

Save as `event_creation_workflow.json`:

```json
{
  "nodes": [
    {
      "parameters": {
        "title": "User Creates Event",
        "description": "Webhook from mobile app"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "parameters": {
        "resource": "executeQuery",
        "query": "INSERT INTO events (title, date, location) VALUES ($1, $2, $3)"
      },
      "name": "Save to Database",
      "type": "n8n-nodes-base.postgres"
    },
    {
      "parameters": {
        "resource": "generic",
        "url": "http://localhost:3000/api/generate-event-assets"
      },
      "name": "Generate Image",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "parameters": {
        "channel": "#events"
      },
      "name": "Notify Slack",
      "type": "n8n-nodes-base.slack"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [["Save to Database"]]
    },
    "Save to Database": {
      "main": [["Generate Image"]]
    },
    "Generate Image": {
      "main": [["Notify Slack"]]
    }
  }
}
```

## Advanced Features

### Conditional Logic

Route workflows based on data:

```
User submits event
  ↓
Is title over 100 chars?
  ├─ Yes → Truncate title
  └─ No → Continue
  ↓
Validate location
  ├─ Valid → Create event
  └─ Invalid → Notify user
```

### Error Handling

Handle failures gracefully:

```
Try → Create event
Error? → Send error notification
Retry? → Exponential backoff
Success → Continue
```

### Parallel Processing

Run multiple tasks simultaneously:

```
Event created
  ├─→ Generate image
  ├─→ Create calendar entry
  ├─→ Post to social
  └─→ Send notification
       ↓
       Merge results
```

### Scheduled Workflows

Run on schedule (cron):

```bash
# Every morning at 9 AM
0 9 * * *

# Every hour
0 * * * *

# Weekdays at 5 PM
0 17 * * 1-5

# First of month
0 0 1 * *
```

## Integration with Event Platform

### API Endpoint for Workflows

Create `event-platform/src/app/api/webhooks/n8n/route.ts`:

```typescript
export async function POST(request: Request) {
  const data = await request.json();
  
  // Handle different event types
  switch (data.event_type) {
    case 'event_created':
      // Trigger n8n workflow
      break;
    case 'registration_submitted':
      // Trigger different workflow
      break;
  }
  
  return Response.json({ success: true });
}
```

Configure n8n webhook to call:
```
POST http://localhost:3000/api/webhooks/n8n
```

## n8n vs Other Tools

| Feature | n8n | Zapier | Make | IFTTT |
|---------|-----|--------|------|-------|
| **Self-hosted** | ✅ | ❌ | ❌ | ❌ |
| **Visual Editor** | ✅ | ✅ | ✅ | ✅ |
| **Integrations** | 400+ | 3000+ | 1000+ | 100+ |
| **Cost** | Free | $$ | $ | Free/$ |
| **Complex Logic** | ✅ | ✅ | ✅ | Limited |
| **Code Nodes** | ✅ | Limited | ✅ | ❌ |

**Use n8n for:**
- Self-hosted workflows (privacy/control)
- Complex automations
- Custom integrations
- Cost-effective at scale

## Deployment

### On Your Server

1. Install Docker
2. Run n8n container
3. Access via HTTPS
4. Create workflows
5. Activate automations

### With Reverse Proxy (Caddy)

```bash
# Caddyfile
n8n.example.com {
  reverse_proxy localhost:5678
}
```

### Environment Variables

```bash
docker run -e N8N_HOST=n8n.example.com \
  -e WEBHOOK_URL=https://n8n.example.com/ \
  -e DB_TYPE=postgres \
  -e DB_POSTGRESDB_HOST=postgres \
  n8n
```

## Troubleshooting

```bash
# Check n8n logs
docker logs -f n8n

# Reset workflows
docker exec n8n n8n db:reset

# Clear data
docker volume rm n8n_data
docker volume create n8n_data

# Restart
docker restart n8n
```

## Learning Resources

- **Docs**: https://docs.n8n.io/
- **Integrations**: https://n8n.io/integrations/
- **Examples**: https://n8n.io/workflows/
- **Community**: https://community.n8n.io/
- **Blog**: https://blog.n8n.io/

## Workflow Templates for Event Platform

Start with pre-built templates:

1. **Social Media Auto-Post** — Post to Twitter, LinkedIn, Discord
2. **Email Notifications** — Send confirmations, reminders
3. **Database Sync** — Keep data in sync across platforms
4. **Schedule Management** — Manage calendar & reminders
5. **User Onboarding** — Welcome new members

## Quick Start on Mac

1. **Install Docker** (if not already):
   ```bash
   brew install docker
   ```

2. **Start n8n**:
   ```bash
   docker run -d --name n8n -p 5678:5678 \
     -v n8n_data:/home/node/.n8n \
     docker.n8n.io/n8nio/n8n
   ```

3. **Open editor**:
   ```bash
   open http://localhost:5678
   ```

4. **Create first workflow**:
   - Click "Create Workflow"
   - Add webhook trigger
   - Add Supabase node
   - Add HTTP request
   - Save and test

5. **Activate**:
   - Click "Activate" toggle
   - Workflow now runs automatically

---

n8n + Aider + LangGraph + Hermes = complete automation stack.
