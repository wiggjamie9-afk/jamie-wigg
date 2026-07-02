# Datadog Cloud Network Monitoring — Use Cases (Query Recipes)

Transcribed from Datadog's "Cloud Network Monitoring Use Cases" reference
(lp.datadoghq.com). A catalogue of ready-made CNM queries grouped by theme.

**Useful links**
- Cloud Network Monitoring Docs
- Network Path Monitoring Blog

Columns below map to the CNM query builder: **Query** · **Group by (client)** · **Group by (server)** · **Measure**.

---

## Part A — Infrastructure & Network

### 1. Service Dependencies

#### 1.1 Upstream dependencies of a selected service
Overview of upstream infra for a given service.

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Top upstream services by TCP retransmits | `server_service:* (client_env:* OR server_env:*)` | service | service | sum of (TCP Retransmits), limit 100 |
| Top upstream hosts by TCP retransmits | `server_service:* (client_env:* OR server_env:*)` | host | service | sum of (TCP Retransmits), limit 100 |
| Top upstream AZs by TCP retransmits | `server_service:* (client_env:* OR server_env:*)` | availability-zone | service | sum of (TCP Retransmits), limit 100 |
| Top upstream regions by TCP retransmits | `server_service:* (client_env:* OR server_env:*)` | region | service | sum of (TCP Retransmits), limit 100 |

#### 1.2 Downstream dependencies of a selected service
Overview of downstream infra for a given service.

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Top downstream services by TCP retransmits | `client_service:* (client_env:* OR server_env:*)` | service | service | sum of (TCP Refusals), limit 100 |
| Top downstream hosts by TCP retransmits | `client_service:* (client_env:* OR server_env:*)` | service | host | sum of (TCP Refusals), limit 100 |
| Top downstream AZs by TCP retransmits | `client_service:* (client_env:* OR server_env:*)` | service | availability-zone | sum of (TCP Refusals), limit 100 |
| Top downstream regions by TCP retransmits | `client_service:* (client_env:* OR server_env:*)` | service | region | sum of (TCP Refusals), limit 100 |

#### 1.3 Traffic from selected service to managed cloud endpoints
Overview of cloud managed endpoints your selected service is communicating with.

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Traffic from selected service to managed cloud endpoints | `client_service:* (client_cloud_endpoint_detection:true OR server_cloud_endpoint_detection:true)` | service | service | sum of (TCP Latency), limit 100 |

### 3. Top Network Talkers

#### 3.1 Host top network talkers
Top talkers & associated metrics at the host level.

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Top hosts downstream of selected service | `client_service:*` | ungrouped traffic | host | (top hosts), limit 100 |
| Latency between selected service and downstream hosts | `client_service:*` | ungrouped traffic | host | avg of (TCP Latency), limit 100 |
| Retransmits between selected service and downstream hosts | `client_service:*` | ungrouped traffic | host | sum of (TCP Retransmits), limit 100 |
| TCP refusals between selected service and downstream hosts | `client_service:*` | ungrouped traffic | host | sum of (TCP Refusals), limit 100 |

#### 3.2 Service top network talkers
Top talkers at the service level.

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Top services downstream of selected service | `client_service:*` | ungrouped traffic | service | sum of (Bytes Sent), limit 100 |
| Latency between selected service and downstream services | `client_service:*` | ungrouped traffic | service | avg of (TCP Latency), limit 100 |
| Retransmits between selected service and downstream services | `client_service:*` | ungrouped traffic | service | sum of (TCP Retransmits), limit 100 |
| TCP refusals between selected service and downstream services | `client_service:*` | ungrouped traffic | service | sum of (TCP Refusals), limit 100 |

#### 3.3 Availability zone top network talkers
Top talkers at the availability-zone level.

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Top AZs downstream of selected service | `client_service:*` | ungrouped traffic | availability-zone | sum of (Bytes Sent), limit 100 |
| Latency between selected service and downstream AZs | `client_service:*` | ungrouped traffic | availability-zone | avg of (TCP Latency), limit 100 |
| Retransmits between selected service and downstream AZs | `client_service:*` | ungrouped traffic | availability-zone | sum of (TCP Retransmits), limit 100 |
| TCP refusals between selected service and downstream AZs | `client_service:*` | ungrouped traffic | availability-zone | sum of (TCP Refusals), limit 100 |

### 4. DNS Traffic
Top DNS queries by DNS metrics (requests, failures, timeouts, NXDOMAIN errors).

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Top DNS queries by DNS requests | `client_service:*` | service | `network.dns_query` | sum of (DNS Requests), limit 100 |
| Top DNS queries by NXDOMAIN errors | `client_service:*` | service | `network.dns_query` | sum of (NXDOMAIN errors), limit 100 |
| Top DNS queries by DNS failures | `client_service:*` | service | `network.dns_query` | sum of (DNS Failures), limit 100 |
| Top DNS queries by DNS timeouts | `client_service:*` | service | `network.dns_query` | sum of (DNS Timeouts), limit 100 |

---

## Part B — Security & Compliance

### 1. TLS Encryption
Visibility into top encrypted and non-encrypted TLS traffic by domain and service.

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Total traffic by TLS version (1.2) | `tls_version:tls_1_2` | ungrouped traffic | ungrouped traffic | sum of (Bytes Sent) |
| Total traffic by TLS version (1.3) | `tls_version:tls_1_3` | ungrouped traffic | ungrouped traffic | sum of (Bytes Sent) |
| Total traffic by TLS version (all other versions) | `-tls_version:tls_1_3 -tls_version:tls_1_2 tls_encrypted:true` | ungrouped traffic | ungrouped traffic | sum of (Bytes Sent) |
| Top TLS encrypted traffic by domain | `client_service:* -server_service:datadog-agent tls_encrypted:true` | ungrouped traffic | domain | sum of (Bytes Sent), limit 100 |
| Top non-TLS traffic by domain | `client_service:* -server_service:datadog-agent tls_encrypted:false` | ungrouped traffic | domain | sum of (Bytes Sent), limit 100 |
| Outgoing TLS traffic by destination (domain) | `client_service:* -server_service:datadog-agent tls_encrypted:true` | ungrouped traffic | domain | sum of (Bytes Sent), limit 100 |
| Outgoing TLS traffic by destination (service) | `client_service:* -server_service:datadog-agent tls_encrypted:true` | ungrouped traffic | service | sum of (Bytes Sent), limit 100 |
| Outgoing non-TLS traffic by destination (domain) | `client_service:* -server_service:datadog-agent tls_encrypted:false` | ungrouped traffic | domain | sum of (Bytes Sent), limit 100 |
| Outgoing non-TLS traffic by destination (service) | `client_service:* -server_service:datadog-agent tls_encrypted:false` | ungrouped traffic | service | sum of (Bytes Sent), limit 100 |

### 2. TLS Ciphers & Version
Visibility into services running non-secure TLS cipher suites and versions.

| Query description | Query | Group by – client | Group by – server | Measure |
|---|---|---|---|---|
| Top services with insecure ciphers | `tls_cipher_insecure:true` | ungrouped traffic | service | sum of (TCP Established Connections), limit 1000 |
| Top services with old TLS versions | `tls_version:(tls_1.0 OR tls_1.1)` | ungrouped traffic | service | sum of (TCP Established Connections), limit 1000 |
| Top services with TLS 1.2 | `tls_version:tls_1.2` | ungrouped traffic | service | sum of (TCP Established Connections), limit 1000 |
| Top services with TLS 1.3 | `tls_version:tls_1.3` | ungrouped traffic | service | sum of (TCP Established Connections), limit 1000 |

---

*Reference only. Query field names (`client_service`, `server_service`, `tls_version`, `tls_encrypted`, `tls_cipher_insecure`, `network.dns_query`, etc.) follow Datadog CNM tag conventions — confirm exact spellings against current Datadog docs before use.*
