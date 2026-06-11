# Agent Builder API Specification

## Overview

The Agent Builder API provides REST endpoints for creating, managing, and monitoring custom AI agents. All endpoints require Bearer token authentication and return JSON responses.

**Base URL:** `https://api.agentbuilder.com/v1`

**Documentation:** `https://docs.agentbuilder.com/api` (or `/sites/agent-builder/docs.html` in this repo)

---

## Authentication

### Bearer Token

All requests must include an `Authorization` header with a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

Obtain your API key from your [account settings](https://app.agentbuilder.com/settings/api-keys) after signing up for an Agent Builder account.

### Security Recommendations

- Store API keys in environment variables (e.g., `.env` files, not version control)
- Rotate keys every 90 days
- Use separate keys for development, staging, and production
- Revoke compromised keys immediately
- Treat keys like passwords

### Rate Limits

Rate limits vary by plan and are enforced per API key:

| Plan    | Requests/Min | Requests/Day | Concurrent |
|---------|--------------|--------------|-----------|
| Starter | 60           | 10,000       | 2         |
| Pro     | 300          | 100,000      | 10        |
| Addon   | 60           | 10,000       | 2         |

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Maximum requests per minute
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

Responses with HTTP 429 include a `Retry-After` header (seconds).

---

## Endpoints

### 1. List Agents

**Endpoint:** `GET /agents`

Retrieve all agents for the authenticated user. Supports filtering and pagination.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Filter by agent type: `code-review`, `document-processing`, `research`, `security-audit`, `data-analysis`, `customer-support` |
| `limit` | integer | No | Pagination limit (default: 20, max: 100) |
| `offset` | integer | No | Pagination offset (default: 0) |

**Example Request (cURL):**

```bash
curl -X GET https://api.agentbuilder.com/v1/agents \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**Example Request (JavaScript):**

```javascript
const response = await fetch('https://api.agentbuilder.com/v1/agents', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const { data, pagination } = await response.json();
console.log(`Found ${pagination.total} agents`);
data.forEach(agent => console.log(agent.name, agent.type));
```

**Example Response (200 OK):**

```json
{
  "data": [
    {
      "id": "agent-uuid-123",
      "name": "Code Review Agent",
      "type": "code-review",
      "description": "Automated code review for pull requests",
      "tier": "pro",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T14:22:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1,
    "has_more": false
  }
}
```

---

### 2. Create Agent

**Endpoint:** `POST /agents`

Create a new agent with the specified configuration. Returns the agent object with a generated UUID.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Agent display name (max 100 characters) |
| `type` | string | Yes | Agent type: `code-review`, `document-processing`, `research`, `security-audit`, `data-analysis`, `customer-support` |
| `description` | string | No | Agent description (max 500 characters) |
| `tier` | string | Yes | Billing tier: `starter`, `pro`, `addon` |
| `environment` | object | No | Model and configuration settings |
| `environment.model` | string | No | Claude model: `claude-haiku-4.5`, `claude-sonnet-4.6`, `claude-opus-4.8` (default: based on tier) |
| `environment.temperature` | number | No | Sampling temperature 0–1 (default: 0.5) |
| `environment.max_tokens` | integer | No | Max response tokens (default: 2048, max: 8192) |
| `environment.tools` | array | No | Tool names agent can use (e.g., `["github", "git"]`) |
| `environment.system_prompt` | string | No | Custom system prompt (overrides template) |

**Example Request (cURL):**

```bash
curl -X POST https://api.agentbuilder.com/v1/agents \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Security Audit Agent",
    "type": "security-audit",
    "description": "Scans code for vulnerabilities and security best practices",
    "tier": "pro",
    "environment": {
      "model": "claude-opus-4.8",
      "temperature": 0.2,
      "max_tokens": 4096,
      "tools": ["git", "npm", "pip"]
    }
  }'
```

**Example Request (JavaScript):**

```javascript
const config = {
  name: "Data Analysis Agent",
  type: "data-analysis",
  description: "Analyzes datasets and generates insights",
  tier: "starter",
  environment: {
    model: "claude-sonnet-4.6",
    temperature: 0.3,
    max_tokens: 2048
  }
};

const response = await fetch('https://api.agentbuilder.com/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(config)
});

const newAgent = await response.json();
console.log(`Created agent: ${newAgent.id}`);
```

**Example Response (201 Created):**

```json
{
  "id": "agent-uuid-456",
  "name": "Security Audit Agent",
  "type": "security-audit",
  "description": "Scans code for vulnerabilities",
  "tier": "pro",
  "status": "active",
  "environment": {
    "model": "claude-opus-4.8",
    "temperature": 0.2,
    "max_tokens": 4096,
    "tools": ["git", "npm", "pip"],
    "system_prompt": "You are a security auditor specializing in code review..."
  },
  "session": {
    "max_duration": 3600,
    "memory_type": "conversation",
    "context_window": 8192
  },
  "events": ["session_start", "message_sent", "tool_used", "session_end"],
  "prompts": {
    "system": "You are a security auditor...",
    "examples": [],
    "success_criteria": [
      "Identifies OWASP Top 10 vulnerabilities",
      "Suggests secure coding practices",
      "Explains risk severity"
    ]
  },
  "created_at": "2024-01-20T09:15:00Z",
  "updated_at": "2024-01-20T09:15:00Z"
}
```

---

### 3. Get Agent

**Endpoint:** `GET /agents/:id`

Retrieve detailed configuration for a specific agent by UUID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Agent UUID |

**Example Request (cURL):**

```bash
curl -X GET https://api.agentbuilder.com/v1/agents/agent-uuid-123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Request (JavaScript):**

```javascript
const agentId = 'agent-uuid-123';

const response = await fetch(`https://api.agentbuilder.com/v1/agents/${agentId}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

if (response.ok) {
  const agent = await response.json();
  console.log(`Agent: ${agent.name} (${agent.type})`);
  console.log(`Model: ${agent.environment.model}`);
  console.log(`Tier: ${agent.tier}`);
} else if (response.status === 404) {
  console.error('Agent not found');
}
```

**Example Response (200 OK):**

```json
{
  "id": "agent-uuid-123",
  "name": "Code Review Agent",
  "type": "code-review",
  "description": "Automated code review for pull requests",
  "tier": "pro",
  "status": "active",
  "environment": {
    "model": "claude-sonnet-4.6",
    "temperature": 0.1,
    "max_tokens": 4096,
    "tools": ["github", "git"],
    "system_prompt": "You are an expert code reviewer..."
  },
  "session": {
    "max_duration": 3600,
    "memory_type": "context-window",
    "context_window": 16000
  },
  "events": ["session_start", "message_sent", "tool_used", "session_end"],
  "prompts": {
    "system": "You are an expert code reviewer...",
    "examples": ["example_code_review_1", "example_code_review_2"],
    "success_criteria": [
      "Identifies code quality issues",
      "Suggests improvements",
      "Flags security concerns"
    ]
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-16T14:22:00Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Agent not found",
    "agent_id": "agent-uuid-123"
  }
}
```

---

### 4. Delete Agent

**Endpoint:** `DELETE /agents/:id`

Delete an agent and all associated data. **This action is permanent and cannot be undone.**

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Agent UUID |

**Example Request (cURL):**

```bash
curl -X DELETE https://api.agentbuilder.com/v1/agents/agent-uuid-123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Request (JavaScript):**

```javascript
const agentId = 'agent-uuid-123';

const response = await fetch(`https://api.agentbuilder.com/v1/agents/${agentId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

if (response.status === 204) {
  console.log('Agent deleted successfully');
} else {
  console.error('Failed to delete agent');
}
```

**Example Response (204 No Content):**

No body returned on successful deletion. Check the HTTP status code.

**Alternative Response (200 OK):**

```json
{
  "success": true,
  "message": "Agent deleted successfully",
  "id": "agent-uuid-123"
}
```

---

### 5. Get Analytics

**Endpoint:** `GET /analytics`

Retrieve analytics data for your agents, including usage metrics, success rates, and costs.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `agent_id` | string | Filter to specific agent ID (optional) |
| `date_from` | string | Start date in ISO 8601 format (e.g., `2024-01-01`) |
| `date_to` | string | End date in ISO 8601 format |
| `metric` | string | Filter by metric: `sessions`, `messages`, `tokens_used`, `success_rate`, `cost` |

**Example Request (cURL):**

```bash
curl -X GET 'https://api.agentbuilder.com/v1/analytics?agent_id=agent-uuid-123&date_from=2024-01-01&date_to=2024-01-31' \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Request (JavaScript):**

```javascript
const params = new URLSearchParams({
  date_from: '2024-01-01',
  date_to: '2024-01-31',
  metric: 'success_rate'
});

const response = await fetch(`https://api.agentbuilder.com/v1/analytics?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const analytics = await response.json();
console.log(`Success rate: ${(analytics.metrics.success_rate * 100).toFixed(2)}%`);
console.log(`Total cost: $${analytics.metrics.total_cost_usd}`);
```

**Example Response (200 OK):**

```json
{
  "agent_id": "agent-uuid-123",
  "date_range": {
    "from": "2024-01-01",
    "to": "2024-01-31"
  },
  "metrics": {
    "total_sessions": 245,
    "total_messages": 1203,
    "tokens_used": 450230,
    "success_rate": 0.94,
    "avg_response_time_ms": 1230,
    "total_cost_usd": 18.50
  },
  "by_type": {
    "code-review": {
      "sessions": 120,
      "success_rate": 0.96
    }
  },
  "daily_breakdown": [
    {
      "date": "2024-01-01",
      "sessions": 8,
      "messages": 42,
      "tokens_used": 14500,
      "success_rate": 0.92,
      "cost_usd": 0.58
    }
  ]
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Invalid parameters or malformed JSON |
| `INVALID_FIELD` | 400 | Required field missing or invalid |
| `INVALID_TYPE` | 400 | Agent type not recognized |
| `INVALID_TIER` | 400 | Tier value invalid |
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `FORBIDDEN` | 403 | Insufficient permissions (e.g., Pro-only feature on Starter plan) |
| `NOT_FOUND` | 404 | Agent not found |
| `CONFLICT` | 409 | Resource conflict (e.g., name already exists) |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error; try again later |

**Example Error Response:**

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: name",
    "details": {
      "field": "name",
      "reason": "required"
    }
  }
}
```

---

## Webhooks (Enterprise Plan)

Webhooks allow you to receive real-time notifications about agent and session events.

### Supported Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `agent.created` | New agent created | Agent object |
| `agent.updated` | Agent configuration modified | Agent object + changes |
| `agent.deleted` | Agent deleted | Agent ID |
| `session.started` | Agent session initiated | Session object |
| `session.completed` | Agent session ended | Session metrics |
| `session.failed` | Session error | Error details |

### Webhook Configuration

Add a webhook URL in [account settings](https://app.agentbuilder.com/settings/webhooks). Agent Builder will POST events to your endpoint with the following structure:

```json
{
  "id": "webhook-event-uuid",
  "timestamp": "2024-01-20T10:30:00Z",
  "type": "session.completed",
  "agent_id": "agent-uuid-123",
  "data": {
    "session_id": "session-uuid",
    "duration_seconds": 45,
    "messages": 12,
    "tokens_used": 5230,
    "success": true
  },
  "signature": "sha256=..."
}
```

Verify webhook authenticity using the `X-Agent-Builder-Signature` header (HMAC SHA256).

---

## Data Schemas

### Agent Object

```json
{
  "id": "string (uuid)",
  "name": "string (max 100 chars)",
  "type": "enum: code-review | document-processing | research | security-audit | data-analysis | customer-support",
  "description": "string (optional, max 500 chars)",
  "tier": "enum: starter | pro | addon",
  "status": "enum: active | inactive | archived",
  "environment": {
    "model": "enum: claude-haiku-4.5 | claude-sonnet-4.6 | claude-opus-4.8",
    "temperature": "number (0–1)",
    "max_tokens": "integer (1–8192)",
    "tools": "array of strings",
    "system_prompt": "string"
  },
  "session": {
    "max_duration": "integer (seconds)",
    "memory_type": "enum: none | conversation | context-window",
    "context_window": "integer (tokens)"
  },
  "events": "array of strings",
  "prompts": {
    "system": "string",
    "examples": "array of strings",
    "success_criteria": "array of strings"
  },
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}
```

### Session Object

```json
{
  "id": "string (uuid)",
  "agent_id": "string (uuid)",
  "user_id": "string (uuid)",
  "status": "enum: active | completed | failed",
  "started_at": "string (ISO 8601)",
  "ended_at": "string (ISO 8601, optional)",
  "messages": [
    {
      "id": "string (uuid)",
      "role": "enum: user | assistant",
      "content": "string",
      "timestamp": "string (ISO 8601)",
      "tokens": "integer"
    }
  ],
  "metadata": {
    "input_tokens": "integer",
    "output_tokens": "integer",
    "total_tokens": "integer",
    "cost_usd": "number"
  }
}
```

---

## SDK & Code Examples

### Python SDK

```python
import requests

class AgentBuilderClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.agentbuilder.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def list_agents(self, agent_type=None, limit=20, offset=0):
        params = {"limit": limit, "offset": offset}
        if agent_type:
            params["type"] = agent_type
        response = requests.get(f"{self.base_url}/agents", headers=self.headers, params=params)
        return response.json()

    def create_agent(self, name, agent_type, tier, description=None, environment=None):
        payload = {
            "name": name,
            "type": agent_type,
            "tier": tier,
            "description": description,
            "environment": environment or {}
        }
        response = requests.post(f"{self.base_url}/agents", headers=self.headers, json=payload)
        return response.json()

    def get_agent(self, agent_id):
        response = requests.get(f"{self.base_url}/agents/{agent_id}", headers=self.headers)
        return response.json()

    def delete_agent(self, agent_id):
        response = requests.delete(f"{self.base_url}/agents/{agent_id}", headers=self.headers)
        return response.status_code == 204

# Example usage
client = AgentBuilderClient(api_key="your-api-key")
agents = client.list_agents(agent_type="code-review")
print(agents)
```

### Node.js/JavaScript

```javascript
class AgentBuilderClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.agentbuilder.com/v1';
  }

  async request(method, endpoint, body = null) {
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  listAgents(type = null, limit = 20, offset = 0) {
    const params = new URLSearchParams({ limit, offset });
    if (type) params.append('type', type);
    return this.request('GET', `/agents?${params}`);
  }

  createAgent(name, type, tier, config = {}) {
    return this.request('POST', '/agents', {
      name,
      type,
      tier,
      ...config
    });
  }

  getAgent(agentId) {
    return this.request('GET', `/agents/${agentId}`);
  }

  deleteAgent(agentId) {
    return this.request('DELETE', `/agents/${agentId}`);
  }

  getAnalytics(agentId = null, dateFrom = null, dateTo = null) {
    const params = new URLSearchParams();
    if (agentId) params.append('agent_id', agentId);
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    return this.request('GET', `/analytics?${params}`);
  }
}

// Example usage
const client = new AgentBuilderClient('your-api-key');
const agents = await client.listAgents('code-review');
console.log(agents);
```

---

## Support & Contact

- **Documentation:** https://docs.agentbuilder.com
- **Status Page:** https://status.agentbuilder.com
- **Email Support:** api-support@agentbuilder.com
- **Response Time:** Within 24 hours

---

**Version:** 1.0  
**Last Updated:** January 20, 2024  
**Deprecation Policy:** 6-month notice before endpoint removal or breaking changes
