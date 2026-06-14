# System Design Primer — Claude Ecosystem Reference

**Source:** Donne Martin's System Design Primer (CC BY 4.0)  
**Repository:** https://github.com/donnemartin/system-design-primer  
**Purpose:** Comprehensive guide to designing large-scale systems and interview preparation

---

## Quick Reference

### System Design Interview Approach (4 Steps)

**Step 1: Outline use cases, constraints, assumptions**
- Who uses it? How? How many users?
- What does it do? Inputs/outputs?
- How much data? Requests/sec? Read/write ratio?

**Step 2: Create high-level design**
- Sketch main components and connections
- Justify your ideas

**Step 3: Design core components**
- Deep dive into each critical piece
- API, schema, algorithms

**Step 4: Scale the design**
- Identify bottlenecks
- Load balancing, caching, sharding, replication
- Everything is a trade-off

---

## Core Concepts

### Performance vs Scalability
- **Performance problem:** System slow for single user
- **Scalability problem:** System fast for single user but slow under heavy load

### Latency vs Throughput
- **Latency:** Time to perform action
- **Throughput:** Number of actions per unit time
- Goal: Maximal throughput with acceptable latency

### Availability vs Consistency (CAP Theorem)
In distributed systems, choose 2 of 3:
- **Consistency:** Every read gets latest write or error
- **Availability:** Every request gets response (may be stale)
- **Partition Tolerance:** System works despite network failures

**Trade-offs:**
- **CP:** Consistency + Partition tolerance (atomic reads/writes)
- **AP:** Availability + Partition tolerance (eventual consistency)

### Consistency Patterns
- **Weak:** Best effort (VoIP, video chat)
- **Eventual:** Data propagates asynchronously (DNS, email)
- **Strong:** Synchronous replication (databases, file systems)

### Availability Patterns
- **Active-Passive Failover:** Standby takes over on failure
- **Active-Active Failover:** Both handle traffic, distribute load

### Availability Metrics (Uptime)
- **99.9% (three 9s):** ~43 min/month downtime
- **99.99% (four 9s):** ~4 min/month downtime

---

## Key Components

### Load Balancer
Distributes traffic, prevents overload, eliminates single point of failure

**Routing Options:**
- Random, least loaded, session/cookies, round robin
- Layer 4 (transport): Fast, less flexible
- Layer 7 (application): Flexible, higher CPU

### Reverse Proxy
Centralizes internal services, provides unified interface

**Benefits:** Security, SSL termination, compression, caching, load balancing

### Horizontal Scaling
Scale out with commodity hardware > scale up with expensive hardware

**Trade-offs:** Complexity, stateless servers, distributed data stores, downstream scaling

### DNS (Domain Name System)
Translates domain to IP address

**Caching:** Hierarchical, with TTL (time-to-live)  
**Routing:** Weighted round robin, latency-based, geolocation-based

### CDN (Content Delivery Network)
Geographically distributed proxy servers serving content

**Push CDN:** Upload content, rewrite URLs (small traffic)  
**Pull CDN:** Auto-fetch on first request (heavy traffic)

---

## Database Patterns

### Master-Slave Replication
- Master: reads + writes
- Slaves: reads only (replicated from master)
- Failover: Promote slave if master fails

**Issue:** Write bottleneck on master, replication lag

### Master-Master Replication
- Both masters: reads + writes, coordinate on writes
- Failover: System continues on either failure

**Issues:** Load balancer needed, consistency tradeoff, conflict resolution

### Federation (Functional Partitioning)
Split database by function (users, forums, products)

**Benefits:** Less replication lag, more cache hits, parallel writes  
**Trade-offs:** Joins across dbs harder, application logic complex

### Sharding (Data Partitioning)
Distribute data across databases by shard key (user_id, geography)

**Benefits:** Less traffic, more cache hits, parallel writes  
**Trade-offs:** Uneven distribution, complex joins, rebalancing hard

### Denormalization
Redundant data in multiple tables to avoid expensive joins

**Trade-off:** Faster reads, slower/complex writes, more storage

### SQL Tuning
- Schema: Use CHAR for fixed-length, TEXT for large blocks
- Indices: B-trees for fast lookups
- Joins: Denormalize if expensive
- Query cache: Can help or hurt

---

## NoSQL

**Consistency Model:** BASE (Basically Available, Soft state, Eventual consistency)

### Key-Value Store
O(1) reads/writes, in-memory or SSD

**Use:** Cache layer, real-time data  
**Examples:** Redis, Memcached

### Document Store
JSON/XML documents with query language

**Use:** Flexible schema, occasionally-changing data  
**Examples:** MongoDB, CouchDB, DynamoDB

### Wide Column Store
Nested map: ColumnFamily<RowKey, Columns<ColKey, Value, Timestamp>>

**Use:** Large datasets, high availability  
**Examples:** Bigtable, HBase, Cassandra

### Graph Database
Nodes + relationships optimized for complex relationships

**Use:** Social networks, recommendations  
**Examples:** Neo4j, FlockDB

### SQL vs NoSQL

**Choose SQL:**
- Structured data, strict schema
- Relational data, complex joins
- ACID transactions needed
- Clear scaling patterns

**Choose NoSQL:**
- Semi-structured, flexible schema
- Non-relational data
- No complex joins needed
- TB/PB scale, high throughput needed

---

## Caching

### Client Caching
Browser/OS level, reduces server load

### CDN Caching
Geographic distribution of static content

### Web Server Caching
Reverse proxy (Varnish) serves static/dynamic content

### Database Caching
Built-in optimization (tune for your use case)

### Application Caching
In-memory (Redis, Memcached) between app and storage

### Cache Update Strategies

**Cache-Aside (Lazy Loading)**
```
Look in cache → miss → query db → add to cache → return
```
Fast subsequent reads, stale data risk, 3 trips per miss

**Write-Through**
```
Write to cache → cache writes to db → return
```
No stale data, slow writes, new nodes empty

**Write-Behind (Write-Back)**
```
Write to cache → async to db → return
```
Fast writes, data loss risk if cache fails

**Refresh-Ahead**
```
Auto-refresh cache before expiry
```
Reduces latency if predictions accurate

---

## Asynchronism

### Message Queues
Decouple components, handle async work

**Trade-off:** Can add latency/complexity for non-critical work

### Task Queues
Background job processing with scheduling

**Example:** Celery for Python

### Back Pressure
Limit queue size to prevent memory issues, return HTTP 503 if full

---

## Communication

### HTTP
Request/response protocol, stateless, cacheable

**Verbs:** GET (read), POST (create), PUT (replace), PATCH (update), DELETE

### TCP
Connection-oriented, guaranteed delivery, in-order, flow control

**Use:** Reliability critical (web, email, SSH, FTP)

### UDP
Connectionless, no guarantees, efficient

**Use:** Low latency critical (VoIP, video, gaming)

### RPC (Remote Procedure Call)
Client calls procedure on remote server as if local

**Use:** Internal APIs, performance-critical  
**Trade-off:** Coupling, new API per operation, hard to debug

### REST
Client/server, resources via URIs, stateless, cacheable

**Use:** Public APIs, HTTP endpoints  
**Trade-off:** Not good for complex queries, multiple roundtrips for nested data

---

## Back-of-Envelope Calculations

### Powers of Two
```
2^10 = 1K (thousand)
2^20 = 1M (million)
2^30 = 1B (billion)
2^40 = 1T (trillion)
```

### Latency Hierarchy (rough)
```
L1 cache:              0.5 ns
L2 cache:              7 ns
Main memory:           100 ns
SSD random:            150 µs
SSD sequential 1MB:    1 ms
HDD:                   10 ms
Datacenter roundtrip:  500 µs
```

### Throughput
```
Memory:    4 GB/s
SSD:       1 GB/s
HDD:       100 MB/s
Network:   100 MB/s (1 Gbps)
```

---

## Common Interview Questions

**Design:**
- Pastebin (URL shortener)
- Twitter timeline
- Web crawler
- Mint.com (finance)
- Social network
- Key-value store
- Amazon sales ranking
- Scalable system on AWS

**OOP Design:**
- Hash map
- LRU cache
- Call center
- Deck of cards
- Parking lot
- Chat server

---

## Real-World Reference Architectures

**Data Processing:** MapReduce, Spark, Storm  
**Databases:** Bigtable, HBase, Cassandra, DynamoDB, MongoDB  
**File Systems:** GFS, HDFS  
**Infrastructure:** Chubby, Dapper, Kafka, Zookeeper

**Company Architectures:** Twitter, Facebook, Instagram, Netflix, Uber, WhatsApp, YouTube

---

## Integration with Claude Ecosystem

This primer is integrated with:

1. **System Design Skills** — `/system-design-interview` for interview prep
2. **Architecture Reference** — Design patterns for all ecosystem tools
3. **Scale Principles** — Applied to Claude Code, marketing platform, stock analysis
4. **Trade-off Analysis** — Every design decision documented

Use this guide when:
- Designing new services (Stock Platform, LunaRoute, etc.)
- Optimizing existing systems (Pigsty database, caching layers)
- Preparing for architecture interviews
- Evaluating technology choices

---

**License:** CC BY 4.0 — Donne Martin  
**Repository:** https://github.com/donnemartin/system-design-primer
