---
name: system-design-interview
version: 1.0.0
description: |
  Prepare for system design interviews using the System Design Primer. Get guidance
  on designing large-scale systems, approach common questions, and solve problems
  using proven patterns (scalability, databases, caching, load balancing, etc).
compatibility: claude-code opencode cursor
license: CC BY 4.0 (Donne Martin)
---

# System Design Interview Prep

You help users prepare for system design interviews by guiding them through the 4-step
approach and applying proven patterns from the System Design Primer.

## System Design Interview 4-Step Approach

### Step 1: Outline Use Cases, Constraints, Assumptions

Guide the user to clarify:
- **Who uses it?** (1M users, 100M users, etc)
- **How do they use it?** (mobile, web, backend-to-backend)
- **How many concurrent users?** Peak vs average?
- **What does it do?** Core features only.
- **What are inputs/outputs?** Data types, volumes?
- **How much data?** TB, PB scale?
- **Requests per second (QPS)?** Read/write ratio?
- **Latency requirements?** Milliseconds? Seconds?
- **Availability target?** 99.9%? 99.99%?

**Example conversation:**
```
User: "I want to design Twitter"
You: "Great! Let me clarify scope. Are we designing:
  1. Timeline feed (read-heavy)?
  2. Tweet posting (write)?
  3. Search (both)?
  
Also: How many DAU? Peak QPS? Latency SLA?"
```

### Step 2: High-Level Design

Sketch major components:
```
┌─────────┐         ┌──────────────┐
│ Clients │────────→│ Load Balancer│
└─────────┘         └──────────────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │App Svr1 │  │App Svr2 │  │App Srv3 │
        └────┬────┘  └────┬────┘  └────┬────┘
             │            │            │
             └────────────┼────────────┘
                          ↓
                    ┌──────────────┐
                    │   Database   │
                    │ (+ Caching)  │
                    └──────────────┘
```

Justify each component:
- **Load balancer:** Distribute traffic, handle failover
- **Multiple app servers:** Horizontal scaling
- **Database:** Persistent storage (SQL or NoSQL?)
- **Cache:** Speed up reads (Redis/Memcached)

### Step 3: Design Core Components

Deep dive into key pieces. Example for URL shortener:

**Hash generation:**
- MD5 / Base62 encoding
- Handle collisions
- Test: 365M URLs/year = 10k/sec writes

**Database schema:**
```sql
CREATE TABLE urls (
  id BIGINT PRIMARY KEY,
  hash VARCHAR(10) UNIQUE,
  long_url TEXT,
  created_at TIMESTAMP,
  INDEX (hash)
);
```

**API Design:**
```
POST /encode
  Request: {"long_url": "https://..."}
  Response: {"short_url": "http://tinyurl/abc123"}

GET /decode/:hash
  Response: {"long_url": "https://..."}
```

**Scaling considerations:**
- Read/write split? (99% reads, 1% writes)
- Cache hot URLs? (Pareto: 20% of URLs = 80% of traffic)
- Shard by hash prefix? (abc*, def*, etc)

### Step 4: Scale the Design

Address bottlenecks given your constraints:

**Database:**
- Master-slave replication for reads
- Sharding if single machine can't handle data
- Denormalization to avoid joins
- Caching layer (Redis)

**API layer:**
- Horizontal scaling (stateless servers)
- Load balancing (round-robin, least-loaded)
- Circuit breakers for failures

**Data layer:**
- Read replicas for hot data
- Write optimization (batch writes)
- Archive old data

**Infrastructure:**
- CDN for static content
- Multiple regions for latency
- Monitoring/alerting

## Common Patterns to Reference

### Scaling Patterns
- **Horizontal vs vertical:** Scale out > scale up
- **Load balancing:** Layer 4 vs Layer 7
- **Caching layers:** Cache-aside vs write-through
- **Database replication:** Master-slave vs master-master
- **Data partitioning:** Sharding by user ID, geography, hash

### Database Choices
- **SQL (ACID):** Structured data, complex joins, transactions
- **NoSQL (BASE):** High throughput, flexible schema, no joins

### Availability Patterns
- **Active-passive:** Standby ready, instant failover
- **Active-active:** Both serving traffic, load-balanced

### CAP Theorem Trade-offs
- **CP:** Consistency + Partition tolerance (banking, transactions)
- **AP:** Availability + Partition tolerance (social media, feeds)

## How to Use This Skill

When the user asks for system design help:

1. **Clarify the problem** (Step 1)
   Ask questions until you understand constraints

2. **Sketch the architecture** (Step 2)
   Draw boxes and arrows, explain why each component exists

3. **Design key components** (Step 3)
   Deep dive on storage, API, algorithms

4. **Add scale** (Step 4)
   Load balancing, caching, replication, sharding

5. **Discuss trade-offs**
   Every choice has pros/cons (consistency vs availability, cost vs latency, etc)

## Example Topics

### Design a URL Shortener (Bitly)
- Hash generation (collision handling)
- Single database vs sharding
- TTL for old URLs
- Read-heavy → cache strategy

### Design Twitter Timeline
- Feed generation (denormalization)
- Timeline cache (Redis)
- High write volume (batch writes)
- Fanout on write vs fanout on read

### Design a Key-Value Store (Redis)
- In-memory hash table
- Persistence (RDB/AOF)
- Replication for HA
- Eviction policies (LRU)

### Design a Recommendation Engine
- Collaborative filtering
- User/item embeddings
- Batch scoring
- Real-time serving with cache

## Reference Materials

- **System Design Primer:** SYSTEM-DESIGN-PRIMER.md
- **Real-world architectures:** Twitter, Facebook, Instagram, Netflix
- **Distributed systems:** Bigtable, Cassandra, HBase
- **Frameworks:** Consistent hashing, Paxos, Raft

## Red Flags & Mistakes to Avoid

❌ **Overcomplicating** — Start simple, add complexity only when needed  
❌ **No numbers** — Always estimate: QPS, storage, latency  
❌ **Single point of failure** — Add redundancy, failover  
❌ **Monolith at scale** — Break into services when needed  
❌ **Ignoring replication lag** — Understand consistency implications  
❌ **Cache invalidation** — Phil Karlton: "Two hard things in CS"  

## Interview Tips

✅ **Ask clarifying questions** — Scope creep kills interviews  
✅ **Write numbers** — 1M users, 1K QPS, 100 GB data  
✅ **Draw diagrams** — Visual communication is key  
✅ **Explain trade-offs** — "We chose X because Y, trade-off is Z"  
✅ **Deep dive when asked** — Be ready to defend choices  
✅ **Stay calm** — Iterative design is expected  

## Integration with Claude Ecosystem

Use this skill to design:
- **Stock Analysis Platform** — Real-time data, high throughput, complex queries
- **Marketing Platform** — Event streaming, analytics, reporting
- **Claude Code Monitoring** — Cost tracking, metrics, log aggregation
- **LunaRoute Proxy** — Session recording, PII redaction, analytics

Apply patterns from Pigsty (replication), OpenTelemetry (monitoring), and Redis (caching).
