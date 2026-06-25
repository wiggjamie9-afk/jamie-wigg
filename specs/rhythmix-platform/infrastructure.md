# RHYTHMIX Platform — Infrastructure Configuration

## Overview

This document details provisioning, configuration, and deployment of the RHYTHMIX Platform infrastructure stack:
- **Redis** (Upstash) — job queue, rate limiting, caching
- **S3 Bucket** — output video storage
- **CloudFront Distribution** — global CDN for delivery

All configurations use **Infrastructure-as-Code** (Terraform) for reproducibility and version control.

---

## Part 1: Redis (Upstash)

### 1.1 Upstash Cluster Provisioning

**Region:** us-east-1 (nearest to Vercel Edge Functions)
**Tier:** Pro (500MB, auto-scaling to 1GB)
**Features:**
- Multi-AZ replication for high availability
- Automatic daily backups (7-day retention)
- RESP3 protocol support
- Built-in monitoring and alerts

### 1.2 Manual Provisioning (Web Dashboard)

1. Log in to [upstash.com](https://upstash.com)
2. Click **Create Database** → **Redis**
3. Configure:
   - **Type:** Serverless Redis
   - **Region:** us-east-1 (N. Virginia)
   - **Database Name:** `rhythmix-cache-prod`
   - **Eviction Policy:** LRU (important for cache overflow)
   - **TLS/SSL:** Enabled (required for secure connection)
4. Accept defaults for backup & replication
5. Copy connection details (Redis URL with password)

### 1.3 Environment Variables

Store these in Vercel Secrets (or `.env.local` for development):

```bash
# Upstash Redis
UPSTASH_REDIS_URL=redis://default:XXX@us-east-1-yyyy.upstash.io:12345
UPSTASH_REDIS_TOKEN=XXX  # if using Upstash REST API
```

### 1.4 Redis Schema & Initial Setup

**Job Queue (FIFO)**
```bash
# During initialization (run once per environment):
LPUSH queue:video "placeholder"
LPOP queue:video

# Ongoing:
# - Workers push to RIGHT, pull from LEFT for FIFO ordering
# - TTL: None (jobs persist until processed)
```

**Rate Limit Counters**
```bash
# Daily quota tracking
SET quota:user_123:2024-06-25 0 EX 86400  # expires in 24h
INCR quota:user_123:2024-06-25
# Max: 20 for Pro users, 5 for Free users
```

**Cache Results**
```bash
# 30-day TTL for generated videos
SET cache:sha256_abcdef123 '{"url":"https://...", "model":"flux"}' EX 2592000
# 1-hour TTL for metadata
SET cache:metadata:job_123 '{"status":"complete"}' EX 3600
```

**Model Status (Real-time)**
```bash
HSET model_status flux online suno offline replicate online
HGET model_status flux
```

### 1.5 Testing Connection

```bash
# From Node.js (using ioredis or node-redis):
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.UPSTASH_REDIS_URL,
});

redis.on('error', err => console.log('Redis Client Error', err));
await redis.connect();

const result = await redis.ping();
console.log(result);  // Should output: "PONG"

await redis.disconnect();
```

### 1.6 Upstash Terraform Module (Optional)

If using Terraform for Upstash provisioning (requires `terraform-provider-upstash`):

```hcl
# terraform/redis.tf

terraform {
  required_providers {
    upstash = {
      source  = "upstash/upstash"
      version = "~> 1.0"
    }
  }
}

provider "upstash" {
  api_key = var.upstash_api_key
  email   = var.upstash_email
}

resource "upstash_redis_database" "rhythmix_cache" {
  database_name = "rhythmix-cache-prod"
  region        = "us-east-1"
  eviction_mode = "LRU"  # Evict least recently used on memory limit
  tls           = true
}

output "redis_url" {
  value       = upstash_redis_database.rhythmix_cache.endpoint
  description = "Upstash Redis connection URL"
  sensitive   = true
}

# Variables
variable "upstash_api_key" {
  description = "Upstash API key"
  type        = string
  sensitive   = true
}

variable "upstash_email" {
  description = "Upstash account email"
  type        = string
}
```

**Deploy:**
```bash
terraform apply \
  -var="upstash_api_key=$UPSTASH_API_KEY" \
  -var="upstash_email=$UPSTASH_EMAIL"
```

---

## Part 2: S3 Bucket Configuration

### 2.1 Bucket Creation & Policies

**Terraform Configuration** (`terraform/s3.tf`):

```hcl
# Create S3 bucket for video outputs
resource "aws_s3_bucket" "rhythmix_outputs" {
  bucket = "rhythmix-platform-outputs"

  tags = {
    Name        = "RHYTHMIX Platform Outputs"
    Environment = "production"
    Purpose     = "Video generation pipeline"
  }
}

# Enable versioning (optional, disabled to save costs)
resource "aws_s3_bucket_versioning" "rhythmix_outputs" {
  bucket = aws_s3_bucket.rhythmix_outputs.id

  versioning_configuration {
    status = "Disabled"  # Disabled for cost savings
  }
}

# Enable server-side encryption (AES-256)
resource "aws_s3_bucket_server_side_encryption_configuration" "rhythmix_outputs" {
  bucket = aws_s3_bucket.rhythmix_outputs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block public access by default (then selectively allow CloudFront)
resource "aws_s3_bucket_public_access_block" "rhythmix_outputs" {
  bucket = aws_s3_bucket.rhythmix_outputs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CORS configuration
resource "aws_s3_bucket_cors_configuration" "rhythmix_outputs" {
  bucket = aws_s3_bucket.rhythmix_outputs.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = [
      "https://cdn.rhythmix.com",
      "https://studio.starlightmix.com",
      "http://localhost:3000"  # development only
    ]
    expose_headers = ["ETag", "Content-Length"]
    max_age_seconds = 3000
  }
}
```

### 2.2 Lifecycle Rules (Auto-Cleanup)

```hcl
# Lifecycle policy: delete after 30 days
resource "aws_s3_bucket_lifecycle_configuration" "rhythmix_outputs" {
  bucket = aws_s3_bucket.rhythmix_outputs.id

  rule {
    id     = "delete-old-outputs"
    status = "Enabled"

    expiration {
      days = 30  # Delete objects after 30 days
    }

    # Optional: Move to cheaper storage before deletion
    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7  # Clean up incomplete uploads
    }
  }
}
```

### 2.3 Bucket Policy (CloudFront + API Access)

```hcl
# S3 bucket policy allowing CloudFront to read
data "aws_cloudfront_origin_access_identity" "rhythmix_oai" {
  comment = "RHYTHMIX Platform CloudFront OAI"
}

resource "aws_s3_bucket_policy" "rhythmix_outputs" {
  bucket = aws_s3_bucket.rhythmix_outputs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudFrontAccess"
        Effect = "Allow"
        Principal = {
          AWS = data.aws_cloudfront_origin_access_identity.rhythmix_oai.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.rhythmix_outputs.arn}/*"
      },
      {
        Sid    = "APIUploadAccess"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/rhythmix-api-role"
        }
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.rhythmix_outputs.arn}/*"
      }
    ]
  })
}

# Data source for current AWS account
data "aws_caller_identity" "current" {}
```

### 2.4 IAM Role for Vercel Edge Functions

```hcl
# Create IAM role for Vercel deployment
resource "aws_iam_role" "rhythmix_api_role" {
  name = "rhythmix-api-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          # Vercel AWS account ID (public knowledge)
          AWS = "arn:aws:iam::361570287869:root"
        }
        Action = "sts:AssumeRole"
        Condition = {
          StringEquals = {
            "sts:ExternalId" = var.vercel_external_id
          }
        }
      }
    ]
  })
}

# Attach policy allowing S3 bucket operations
resource "aws_iam_role_policy" "rhythmix_s3_policy" {
  name = "rhythmix-s3-policy"
  role = aws_iam_role.rhythmix_api_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.rhythmix_outputs.arn,
          "${aws_s3_bucket.rhythmix_outputs.arn}/*"
        ]
      }
    ]
  })
}

variable "vercel_external_id" {
  description = "Vercel external ID for cross-account access"
  type        = string
  sensitive   = true
}
```

### 2.5 Object Storage Format

Generated files follow this structure:

```
s3://rhythmix-platform-outputs/
├── 2024-06/
│   ├── 24/
│   │   ├── job_abc123def456/
│   │   │   ├── output.mp4          (480MB, main video)
│   │   │   ├── output.jpg          (2.5MB, thumbnail)
│   │   │   ├── metadata.json       (5KB, job metadata)
│   │   │   └── processing.log      (50KB, debug log, optional)
│   │   └── job_xyz789uvw012/
│   │       └── ...
│   └── 25/
│       └── ...
└── 2024-07/
    └── ...
```

**Metadata JSON schema:**
```json
{
  "job_id": "job_abc123def456",
  "user_id": "user_789",
  "model": "flux",
  "status": "complete",
  "created_at": "2024-06-24T12:34:56Z",
  "completed_at": "2024-06-24T13:45:12Z",
  "processing_time_sec": 71,
  "input_prompt": "A sunset on Mars with Earth visible",
  "output_format": "mp4",
  "dimensions": "1920x1080",
  "duration_sec": 30,
  "file_size_bytes": 502619136,
  "cached": false,
  "cdn_url": "https://cdn.rhythmix.com/2024-06/24/job_abc123def456/output.mp4"
}
```

### 2.6 Deploy S3 Stack

```bash
cd terraform

terraform init
terraform plan -out=s3.tfplan
terraform apply s3.tfplan

# Output
terraform output redis_url
terraform output s3_bucket_name
terraform output cloudfront_oai_id
```

---

## Part 3: CloudFront Distribution

### 3.1 CloudFront Terraform Configuration

```hcl
# terraform/cloudfront.tf

# CloudFront distribution for S3 origin
resource "aws_cloudfront_distribution" "rhythmix_cdn" {
  origin {
    domain_name = aws_s3_bucket.rhythmix_outputs.bucket_regional_domain_name
    origin_id   = "S3-rhythmix-outputs"

    s3_origin_config {
      origin_access_identity = data.aws_cloudfront_origin_access_identity.rhythmix_oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"  # optional

  # Cache behavior for videos (1-day TTL)
  cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-rhythmix-outputs"

    path_pattern = "*/output.mp4"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }

      headers = ["Origin"]
    }

    min_ttl             = 0
    default_ttl         = 86400    # 1 day (24 hours)
    max_ttl             = 31536000 # 1 year (for immutable content)
    compress            = true
    viewer_protocol_policy = "https-only"
  }

  # Cache behavior for metadata (5-min TTL)
  cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-rhythmix-outputs"

    path_pattern = "*/metadata.json"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl             = 0
    default_ttl         = 300     # 5 minutes
    max_ttl             = 600     # 10 minutes
    compress            = true
    viewer_protocol_policy = "https-only"
  }

  # Cache behavior for thumbnails (1 day TTL)
  cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-rhythmix-outputs"

    path_pattern = "*/output.jpg"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl             = 0
    default_ttl         = 86400    # 1 day
    max_ttl             = 31536000 # 1 year
    compress            = true
    viewer_protocol_policy = "https-only"
  }

  # Default cache behavior (catch-all)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-rhythmix-outputs"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl             = 0
    default_ttl         = 3600     # 1 hour
    max_ttl             = 86400    # 1 day
    compress            = true
    viewer_protocol_policy = "https-only"
  }

  # SSL/TLS certificate (ACM)
  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate.rhythmix_cdn.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  # Custom domain
  aliases = ["cdn.rhythmix.com"]

  # Logging (optional, costs $0.01/1000 requests)
  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.rhythmix_logs.bucket_domain_name
    prefix          = "cloudfront-logs/"
  }

  # HTTP/2 push enabled
  http_version = "http2and3"

  # Geo-restriction (optional)
  restrictions {
    geo_restriction {
      restriction_type = "none"  # Allow all countries
    }
  }

  # Cache invalidation policy
  tags = {
    Name        = "RHYTHMIX CDN"
    Environment = "production"
  }
}

# ACM Certificate for HTTPS
resource "aws_acm_certificate" "rhythmix_cdn" {
  provider          = aws.us-east-1  # CloudFront requires ACM in us-east-1
  domain_name       = "cdn.rhythmix.com"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "RHYTHMIX CDN Certificate"
  }
}

# Certificate validation (DNS CNAME)
resource "aws_acm_certificate_validation" "rhythmix_cdn" {
  provider        = aws.us-east-1
  certificate_arn = aws_acm_certificate.rhythmix_cdn.arn

  timeouts {
    create = "5m"
  }
}

# CloudWatch alarm for high error rate
resource "aws_cloudwatch_metric_alarm" "rhythmix_cdn_errors" {
  alarm_name          = "rhythmix-cdn-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = "300"
  statistic           = "Average"
  threshold           = "5"  # Alert if >5% 4xx errors
  alarm_description   = "Alert when CloudFront 4xx error rate exceeds 5%"
  alarm_actions       = [aws_sns_topic.rhythmix_alerts.arn]

  dimensions = {
    DistributionId = aws_cloudfront_distribution.rhythmix_cdn.id
  }
}

# CloudWatch alarm for origin errors
resource "aws_cloudwatch_metric_alarm" "rhythmix_cdn_origin_errors" {
  alarm_name          = "rhythmix-cdn-origin-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = "300"
  statistic           = "Average"
  threshold           = "1"  # Alert if >1% 5xx errors
  alarm_description   = "Alert when CloudFront 5xx error rate exceeds 1%"
  alarm_actions       = [aws_sns_topic.rhythmix_alerts.arn]

  dimensions = {
    DistributionId = aws_cloudfront_distribution.rhythmix_cdn.id
  }
}

# SNS topic for alerts
resource "aws_sns_topic" "rhythmix_alerts" {
  name = "rhythmix-cloudfront-alerts"
}

resource "aws_sns_topic_subscription" "rhythmix_alerts_email" {
  topic_arn = aws_sns_topic.rhythmix_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

variable "alert_email" {
  description = "Email for CloudFront alerts"
  type        = string
}
```

### 3.2 DNS Configuration (Route 53)

```hcl
# terraform/route53.tf

# Route 53 record for CloudFront
resource "aws_route53_record" "rhythmix_cdn" {
  zone_id = data.aws_route53_zone.rhythmix.zone_id
  name    = "cdn.rhythmix.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.rhythmix_cdn.domain_name
    zone_id                = aws_cloudfront_distribution.rhythmix_cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

# Data source for existing zone
data "aws_route53_zone" "rhythmix" {
  name          = "rhythmix.com"
  private_zone  = false
}
```

### 3.3 CloudFront Behaviors & Cache Keys

**Cache Key Strategy:**
- **Videos** (`output.mp4`): Based on URL path only (immutable)
- **Metadata** (`metadata.json`): URL path + query params (mutable)
- **Thumbnails** (`output.jpg`): URL path only

```hcl
# Cache policy (modern approach, replaces forwarded_values)
resource "aws_cloudfront_cache_policy" "video_cache" {
  name            = "rhythmix-video-cache"
  comment         = "Cache policy for video outputs"
  default_ttl     = 86400    # 1 day
  max_ttl         = 31536000 # 1 year
  min_ttl         = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true

    query_strings_config {
      query_string_behavior = "none"  # Don't cache query params
    }

    headers_config {
      header_behavior = "none"  # Don't vary on headers
    }
  }
}

resource "aws_cloudfront_cache_policy" "metadata_cache" {
  name            = "rhythmix-metadata-cache"
  comment         = "Cache policy for metadata (short TTL)"
  default_ttl     = 300  # 5 minutes
  max_ttl         = 600  # 10 minutes
  min_ttl         = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true

    query_strings_config {
      query_string_behavior = "all"  # Cache all query params
    }

    headers_config {
      header_behavior = "none"
    }
  }
}
```

### 3.4 Deploy CloudFront Stack

```bash
cd terraform

# Initialize AWS provider for us-east-1
terraform init

# Add ACM certificate to Route 53 (manual DNS validation)
terraform plan -out=cloudfront.tfplan

terraform apply cloudfront.tfplan

# Get CloudFront domain
terraform output cloudfront_domain_name
terraform output cloudfront_distribution_id
```

### 3.5 Cache Invalidation

When re-uploading content with same path, invalidate CloudFront cache:

```bash
# Invalidate all video files
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "*/output.mp4" "*/output.jpg"

# Invalidate specific job
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/2024-06/24/job_abc123def456/*"
```

---

## Part 4: Cost Breakdown

### Monthly Costs (Estimated)

| Component | Usage | Cost |
|---|---|---|
| **Redis (Upstash)** | 500MB tier + 1M commands | $45/month |
| **S3 Storage** | 1TB stored (avg) | $23/month |
| **S3 PUT/GET** | 100K uploads, 1M downloads | $15/month |
| **CloudFront Data Out** | 500GB egress/month | $42.50/month |
| **CloudFront Requests** | 100M requests/month | $8/month |
| **S3 Lifecycle** | Automatic cleanup | Free |
| **ACM Certificate** | HTTPS for cdn.rhythmix.com | Free |
| **Route 53** | DNS hosting + queries | ~$5/month |
| **CloudWatch Alarms** | 3 alarms | $0.30/month |
| | | |
| **Total** | | **~$138.80/month** |

**Scaling Scenarios:**

| Scenario | Monthly Cost | Notes |
|---|---|---|
| Low usage (10M jobs/month) | ~$180 | Development/testing |
| Medium usage (100M jobs/month) | ~$280 | Production standard |
| High usage (1B jobs/month) | ~$1,200+ | Scale up Redis to 2GB, add S3 replication |

**Cost Optimization Tips:**
1. Use **S3 Intelligent-Tiering** if storage grows >10TB/month
2. Set S3 lifecycle to **30 days** (not longer) to reduce storage costs
3. Enable **CloudFront compression** (gzip) — saves ~60% bandwidth
4. Use **CloudFront regional edge caches** (auto-enabled) — saves origin bandwidth
5. Monitor **CloudFront hit ratio** — target >95%

---

## Part 5: Deployment Checklist

### Pre-Deployment

- [ ] AWS account created with billing enabled
- [ ] Terraform CLI installed (`terraform >= 1.0`)
- [ ] AWS credentials configured (`aws configure`)
- [ ] Domain `rhythmix.com` registered and Route 53 zone created
- [ ] Upstash account created, API key obtained
- [ ] Vercel project linked to GitHub repo
- [ ] Node.js 20+ installed locally

### Terraform Deployment

- [ ] Clone repo and navigate to `terraform/` directory
- [ ] Create `terraform.tfvars` with required variables:
  ```hcl
  upstash_api_key       = "..."
  upstash_email         = "..."
  vercel_external_id    = "..."  # from Vercel settings
  alert_email           = "jamie.jack.28@hotmail.com"
  aws_region            = "us-east-1"
  ```
- [ ] Run `terraform init` (downloads providers)
- [ ] Run `terraform plan` (review changes)
- [ ] Run `terraform apply` (provision resources)
- [ ] Verify outputs:
  ```bash
  terraform output redis_url
  terraform output s3_bucket_name
  terraform output cloudfront_domain_name
  ```

### Post-Deployment

- [ ] **ACM Certificate Validation**: Check Route 53 for CNAME validation records, wait for certificate to issue (~5 min)
- [ ] **Redis Connection Test**: Run test script to verify Redis connectivity
- [ ] **S3 Bucket Test**: Upload test file to S3, verify lifecycle rules active
  ```bash
  aws s3 cp test.txt s3://rhythmix-platform-outputs/test.txt
  aws s3 ls s3://rhythmix-platform-outputs/
  ```
- [ ] **CloudFront Test**: Verify CDN responds with correct cache headers
  ```bash
  curl -I https://cdn.rhythmix.com/2024-06/24/job_test/output.mp4
  # Should show: cache-control: max-age=86400
  ```
- [ ] **DNS Validation**: Verify `cdn.rhythmix.com` resolves to CloudFront
  ```bash
  dig cdn.rhythmix.com
  nslookup cdn.rhythmix.com
  ```

### Environment Variables

Store in Vercel Secrets for deployed Edge Functions:

```bash
# Redis
UPSTASH_REDIS_URL=redis://default:XXX@us-east-1-yyyy.upstash.io:12345

# AWS S3
AWS_S3_BUCKET=rhythmix-platform-outputs
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# CloudFront
CDN_DOMAIN=https://cdn.rhythmix.com

# Other
WEBHOOK_SECRET=your-secret-key-here
```

### Monitoring Setup

- [ ] **CloudWatch Dashboards**: Create dashboard for:
  - CloudFront cache hit ratio (target >95%)
  - CloudFront error rates (target <1% 4xx, <0.1% 5xx)
  - S3 request patterns
  - Redis memory usage
- [ ] **SNS Alerts**: Configure email notifications for:
  - CloudFront 4xx errors >5%
  - CloudFront 5xx errors >1%
  - Redis memory >80%
  - S3 egress >100GB/day
- [ ] **Log Aggregation**: Optional but recommended
  - Enable CloudFront access logs (→ S3 bucket)
  - Enable S3 access logs
  - Forward to ELK or similar for analysis

### Rollback Procedure

If issues arise:

```bash
# View current state
terraform show

# Revert to previous version
terraform destroy
# Or selective destruction:
terraform destroy -target=aws_cloudfront_distribution.rhythmix_cdn

# Re-apply after fixes
terraform apply
```

---

## Part 6: Local Development Setup

### 6.1 Local Redis (Docker)

For testing without Upstash:

```bash
docker run -d \
  --name rhythmix-redis \
  -p 6379:6379 \
  redis:7-alpine
```

**Test connection:**
```bash
redis-cli ping  # PONG
redis-cli LPUSH queue:video test
redis-cli LPOP queue:video  # test
```

### 6.2 Local S3 (LocalStack)

```bash
docker run -d \
  --name localstack \
  -p 4566:4566 \
  localstack/localstack
```

**Create bucket:**
```bash
aws --endpoint-url=http://localhost:4566 \
  s3 mb s3://rhythmix-platform-outputs
```

### 6.3 Environment Variables (`.env.local`)

```bash
# Development
UPSTASH_REDIS_URL=redis://localhost:6379
AWS_S3_BUCKET=rhythmix-platform-outputs
AWS_REGION=us-east-1
AWS_ENDPOINT_URL_S3=http://localhost:4566  # LocalStack
CDN_DOMAIN=http://localhost:3000
WEBHOOK_SECRET=dev-secret-key
```

---

## Part 7: Security Hardening

### 7.1 Secrets Management

- [ ] **Rotate AWS credentials** monthly
- [ ] **Rotate Upstash tokens** quarterly
- [ ] Never commit `.env` files or secrets
- [ ] Use AWS Secrets Manager for production secrets (optional)
- [ ] Audit IAM permissions monthly

### 7.2 S3 Bucket Hardening

- [ ] Public access blocked by default ✓ (in Terraform)
- [ ] Encryption enabled (AES-256) ✓ (in Terraform)
- [ ] MFA delete disabled (not needed for generated content)
- [ ] Bucket versioning disabled (cost savings)
- [ ] Lifecycle rules enforce 30-day deletion

### 7.3 CloudFront Hardening

- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] TLS 1.2+ only
- [ ] HTTP/2 enabled
- [ ] Origin Access Identity restricts direct S3 access
- [ ] Logging enabled (optional, inspect access patterns)

### 7.4 Redis Hardening

- [ ] TLS enabled (Upstash default)
- [ ] Password protected (Upstash default)
- [ ] IP whitelisting (configure in Upstash dashboard if needed)
- [ ] No public internet exposure

---

## Part 8: Troubleshooting

### CloudFront Not Serving Files

**Symptom:** 403 Forbidden from CloudFront

**Solution:**
1. Verify S3 bucket policy includes CloudFront OAI
2. Check file exists in S3:
   ```bash
   aws s3 ls s3://rhythmix-platform-outputs/2024-06/24/job_abc123def456/
   ```
3. Wait 5 min for invalidation to propagate

### Redis Connection Timeouts

**Symptom:** ECONNREFUSED or ETIMEDOUT

**Solution:**
1. Verify Redis URL in env vars (check for typos)
2. Test connectivity:
   ```bash
   redis-cli -u $UPSTASH_REDIS_URL ping
   ```
3. Check Upstash dashboard for outages or upgrades

### High CloudFront Costs

**Symptom:** Bill >$200/month

**Solution:**
1. Check cache hit ratio (target >95%)
   ```bash
   # CloudWatch metric: CloudFront -> CacheHitRate
   ```
2. Verify cache TTLs are correct (1 day for videos, 5 min for metadata)
3. Enable gzip compression (saves 60% bandwidth)
4. Monitor S3 egress usage (large uncompressed files)

### S3 Lifecycle Not Deleting Files

**Symptom:** Objects persist after 30 days

**Solution:**
1. Verify lifecycle rule is enabled:
   ```bash
   aws s3api get-bucket-lifecycle-configuration --bucket rhythmix-platform-outputs
   ```
2. Check object metadata (ensure no retention policies)
3. Wait 24 hours for S3 lifecycle service to run

---

## Part 9: Monitoring & Observability

### Key Metrics to Track

| Metric | Target | Tool |
|---|---|---|
| CloudFront cache hit ratio | >95% | CloudWatch |
| CloudFront latency (p99) | <500ms | CloudWatch |
| S3 PUT latency (p99) | <200ms | CloudWatch |
| Redis response time | <50ms | Upstash dashboard |
| Daily video storage | 500GB-1TB | S3 metrics |
| CDN egress | 500-1000 GB/month | CloudFront metrics |

### CloudWatch Dashboard JSON

```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          [ "AWS/CloudFront", "CacheHitRate", { "stat": "Average" } ],
          [ ".", "Requests", { "stat": "Sum" } ],
          [ ".", "BytesDownloaded", { "stat": "Sum" } ],
          [ ".", "4xxErrorRate", { "stat": "Average" } ],
          [ ".", "5xxErrorRate", { "stat": "Average" } ]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "CloudFront Performance"
      }
    }
  ]
}
```

---

## Part 10: Future Improvements

- [ ] Enable S3 Intelligent-Tiering for >10TB storage
- [ ] Configure S3 cross-region replication (disaster recovery)
- [ ] Implement CloudFront Lambda@Edge for custom caching logic
- [ ] Add S3 bucket analytics dashboard
- [ ] Enable CloudFront field-level encryption for sensitive metadata
- [ ] Set up AWS Budget alerts for cost control
- [ ] Implement Redis cluster mode for higher availability (if >1GB needed)
- [ ] Use AWS Global Accelerator for multi-region failover (if expanding globally)

---

## References

- **AWS S3 Documentation**: https://docs.aws.amazon.com/s3/
- **AWS CloudFront Guide**: https://docs.aws.amazon.com/cloudfront/
- **Upstash Redis Docs**: https://upstash.com/docs/redis/overview
- **Terraform AWS Provider**: https://registry.terraform.io/providers/hashicorp/aws/
- **Vercel Edge Functions**: https://vercel.com/docs/edge-functions

---

**Last Updated:** 2024-06-25  
**Maintained By:** RHYTHMIX Infrastructure Team  
**Version:** 1.0.0
