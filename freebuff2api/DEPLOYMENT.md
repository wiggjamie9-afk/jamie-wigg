# Freebuff2API Deployment Guide

## Quick Start

### Local Development

```bash
# Copy example config and update with your token
cp config.json.example config.json
# Edit config.json and add your AUTH_TOKENS

# Build and run
make dev
# or
go run . -config config.json
```

Server will be available at `http://localhost:8080`

### Docker

Build and run with Docker:

```bash
docker build -t freebuff2api:latest .
docker run -d --name freebuff2api \
  -p 8080:8080 \
  -e AUTH_TOKENS="your_token_here" \
  freebuff2api:latest
```

### Docker Compose

```bash
# Create .env file with your configuration
cp .env.example .env
# Edit .env and add your AUTH_TOKENS

# Start services
docker compose up -d

# View logs
docker compose logs -f freebuff2api

# Stop services
docker compose down
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `AUTH_TOKENS` | (required) | Comma-separated Freebuff auth tokens |
| `LISTEN_ADDR` | `:8080` | Listen address and port |
| `UPSTREAM_BASE_URL` | `https://codebuff.com` | Freebuff backend URL |
| `ROTATION_INTERVAL` | `6h` | How often to rotate auth tokens |
| `REQUEST_TIMEOUT` | `15m` | Timeout for upstream requests |
| `API_KEYS` | (empty) | Comma-separated client API keys for proxy auth |
| `HTTP_PROXY` | (empty) | HTTP proxy for outbound requests |

## Kubernetes Deployment

Example Kubernetes manifests:

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: freebuff2api-config
data:
  LISTEN_ADDR: ":8080"
  UPSTREAM_BASE_URL: "https://codebuff.com"
  ROTATION_INTERVAL: "6h"
  REQUEST_TIMEOUT: "15m"
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: freebuff2api-secret
type: Opaque
stringData:
  AUTH_TOKENS: "token1,token2"
  API_KEYS: "api-key-1,api-key-2"
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: freebuff2api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: freebuff2api
  template:
    metadata:
      labels:
        app: freebuff2api
    spec:
      containers:
      - name: freebuff2api
        image: ghcr.io/quorinex/freebuff2api:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: freebuff2api-config
        - secretRef:
            name: freebuff2api-secret
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: freebuff2api
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
  selector:
    app: freebuff2api
```

### HPA (Optional)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: freebuff2api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: freebuff2api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## AWS ECS Deployment

### Task Definition

```json
{
  "family": "freebuff2api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "freebuff2api",
      "image": "ghcr.io/quorinex/freebuff2api:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "LISTEN_ADDR",
          "value": ":8080"
        },
        {
          "name": "UPSTREAM_BASE_URL",
          "value": "https://codebuff.com"
        }
      ],
      "secrets": [
        {
          "name": "AUTH_TOKENS",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:freebuff2api/auth-tokens"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/freebuff2api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## Health Checks

The proxy exposes a health check endpoint at `GET /health`:

```bash
curl http://localhost:8080/health
# {"status":"healthy"}
```

## Logging

Server logs are printed to stdout. In production, capture with your logging infrastructure:

```bash
# View logs
docker compose logs freebuff2api

# Follow logs
docker compose logs -f freebuff2api

# Filter by pattern
docker compose logs freebuff2api | grep "error"
```

## Security Considerations

1. **API Key Authentication** — If enabled (`API_KEYS`), clients must provide valid Bearer tokens
2. **Token Rotation** — Tokens rotate automatically on the specified interval
3. **HTTPS** — Deploy behind a reverse proxy (Nginx, Caddy) with TLS
4. **Rate Limiting** — Consider adding rate limiting at the reverse proxy level
5. **Secrets Management** — Store auth tokens in a secrets manager (AWS Secrets Manager, Vault, etc.)

## Troubleshooting

### No upstream response

```
{"error":"Gateway error"}
```

- Check `UPSTREAM_BASE_URL` is correct
- Check `AUTH_TOKENS` are valid and not expired
- Check network connectivity to upstream

### Unauthorized errors

```
{"error":"Unauthorized"}
```

- If using `API_KEYS`, ensure client sends valid `Authorization: Bearer <key>` header
- If proxy is open, this shouldn't happen — check config

### Token rotation issues

Check logs for rotation messages:

```
Rotated to token index 1
```

If rotation doesn't happen as expected, verify `ROTATION_INTERVAL` is set correctly (e.g., `6h`, `2h30m`)
