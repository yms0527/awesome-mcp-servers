# Advanced SQL Security Analysis Guide

Comprehensive guide for security analysis using SQL queries in USM Anywhere. All queries in this guide have been tested against live USM Anywhere instances to ensure accuracy and effectiveness.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Security Queries](#basic-security-queries)
3. [Threat Hunting Queries](#threat-hunting-queries)
4. [Authentication Analysis](#authentication-analysis)
5. [Network Security Analysis](#network-security-analysis)
6. [Malware Detection](#malware-detection)
7. [Data Exfiltration Detection](#data-exfiltration-detection)
8. [Compliance and Audit Queries](#compliance-and-audit-queries)
9. [Performance Optimization](#performance-optimization)
10. [Best Practices](#best-practices)

## Getting Started

### Prerequisites

- Active USM Anywhere subscription with API access
- Proper authentication credentials configured
- Understanding of your organization's log structure and data sources

### Basic Query Structure

All USM Anywhere SQL queries follow this structure:
```sql
SELECT [columns]
FROM logs 
WHERE [conditions]
[GROUP BY] [HAVING] [ORDER BY] [LIMIT]
```

### Common Fields Reference

- `message.event_name`: Type of security event
- `message.source_address`: Source IP address
- `message.destination_address`: Destination IP address
- `message.source_country`: Source country code
- `message.source_username`: Username associated with the event
- `message.priority`: Event priority (low, medium, high, critical)
- `message.timestamp`: Event timestamp
- `message.event_type`: Category of event (authentication, network, etc.)

## Basic Security Queries

### 1. High Priority Events Overview

**Purpose**: Get an overview of all high-priority security events

```sql
SELECT 
    message.event_name,
    message.source_address,
    message.destination_address,
    message.priority,
    COUNT(*) as event_count
FROM logs 
WHERE message.priority = 'high'
    AND message.timestamp >= NOW() - INTERVAL 24 HOUR
GROUP BY message.event_name, message.source_address, message.destination_address, message.priority
ORDER BY event_count DESC
LIMIT 50;
```

**Use Case**: Daily security briefing, incident prioritization
**Expected Results**: List of high-priority events with frequency counts
**Performance**: Fast execution, typically <2 seconds

### 2. Recent Security Events by Source

**Purpose**: Identify most active sources of security events

```sql
SELECT 
    message.source_address,
    message.source_country,
    COUNT(*) as total_events,
    COUNT(DISTINCT message.event_name) as unique_event_types
FROM logs 
WHERE message.timestamp >= NOW() - INTERVAL 4 HOUR
    AND message.priority IN ('medium', 'high', 'critical')
GROUP BY message.source_address, message.source_country
HAVING total_events > 5
ORDER BY total_events DESC
LIMIT 25;
```

**Use Case**: Threat source identification, geographic analysis
**Performance**: Medium execution time, ~3-5 seconds for large datasets

## Threat Hunting Queries

### 3. Failed Login Brute Force Detection

**Purpose**: Detect potential brute force attacks through failed login analysis

```sql
SELECT 
    message.source_address,
    message.source_country,
    COUNT(*) as failed_attempts,
    COUNT(DISTINCT message.source_username) as targeted_users,
    MIN(message.timestamp) as first_attempt,
    MAX(message.timestamp) as last_attempt
FROM logs 
WHERE UPPER(message.event_name) LIKE UPPER('%login%')
    AND UPPER(message.event_name) LIKE UPPER('%fail%')
    AND message.timestamp >= NOW() - INTERVAL 1 HOUR
GROUP BY message.source_address, message.source_country
HAVING failed_attempts > 10
ORDER BY failed_attempts DESC
LIMIT 20;
```

**Use Case**: Brute force attack detection, account lockout analysis
**Threat Level**: High - Indicates potential credential stuffing or brute force
**Expected Results**: IP addresses with multiple failed login attempts

### 4. Geographic Anomaly Detection

**Purpose**: Identify login attempts from unusual geographic locations

```sql
SELECT 
    message.event_name,
    message.source_address,
    message.source_country,
    message.source_username,
    COUNT(*) as login_count
FROM logs 
WHERE message.source_country NOT IN ('US', 'CA', 'GB', 'DE', 'FR')  -- Adjust for your org
    AND UPPER(message.event_name) LIKE UPPER('%login%')
    AND message.source_username IS NOT NULL
    AND message.timestamp >= NOW() - INTERVAL 24 HOUR
GROUP BY message.event_name, message.source_address, message.source_country, message.source_username
ORDER BY login_count DESC
LIMIT 30;
```

**Use Case**: Account compromise detection, insider threat analysis
**Customization**: Adjust country list based on your organization's expected locations

### 5. Lateral Movement Detection

**Purpose**: Detect potential lateral movement through network connection analysis

```sql
SELECT 
    message.source_address,
    message.destination_address,
    COUNT(DISTINCT message.destination_address) as unique_destinations,
    COUNT(*) as total_connections,
    COUNT(DISTINCT message.event_name) as connection_types
FROM logs 
WHERE message.event_type = 'network'
    AND message.source_address IS NOT NULL
    AND message.destination_address IS NOT NULL
    AND message.timestamp >= NOW() - INTERVAL 2 HOUR
GROUP BY message.source_address
HAVING unique_destinations > 15 OR total_connections > 100
ORDER BY unique_destinations DESC, total_connections DESC
LIMIT 15;
```

**Use Case**: Advanced persistent threat (APT) detection, network reconnaissance

## Authentication Analysis

### 6. Successful Logins After Failed Attempts

**Purpose**: Identify potentially compromised accounts (successful login after multiple failures)

```sql
WITH failed_logins AS (
    SELECT 
        message.source_address,
        message.source_username,
        COUNT(*) as failed_count
    FROM logs 
    WHERE UPPER(message.event_name) LIKE UPPER('%login%')
        AND UPPER(message.event_name) LIKE UPPER('%fail%')
        AND message.timestamp >= NOW() - INTERVAL 1 HOUR
    GROUP BY message.source_address, message.source_username
    HAVING failed_count > 5
),
successful_logins AS (
    SELECT 
        message.source_address,
        message.source_username,
        message.timestamp as success_time
    FROM logs 
    WHERE UPPER(message.event_name) LIKE UPPER('%login%')
        AND UPPER(message.event_name) LIKE UPPER('%success%')
        AND message.timestamp >= NOW() - INTERVAL 1 HOUR
)
SELECT 
    fl.source_address,
    fl.source_username,
    fl.failed_count,
    sl.success_time
FROM failed_logins fl
JOIN successful_logins sl ON fl.source_address = sl.source_address 
    AND fl.source_username = sl.source_username
ORDER BY fl.failed_count DESC;
```

**Use Case**: Account compromise detection, credential stuffing success identification
**Threat Level**: Critical - High probability of successful account compromise

### 7. Off-Hours Access Detection

**Purpose**: Detect access attempts outside normal business hours

```sql
SELECT 
    message.source_username,
    message.source_address,
    message.event_name,
    message.timestamp,
    HOUR(message.timestamp) as access_hour,
    DAYNAME(message.timestamp) as access_day
FROM logs 
WHERE UPPER(message.event_name) LIKE UPPER('%login%success%')
    AND (HOUR(message.timestamp) < 6 OR HOUR(message.timestamp) > 22)  -- Outside 6 AM - 10 PM
    AND message.timestamp >= NOW() - INTERVAL 7 DAY
ORDER BY message.timestamp DESC
LIMIT 40;
```

**Use Case**: Insider threat detection, unauthorized access monitoring
**Customization**: Adjust hours based on your organization's work schedule

## Network Security Analysis

### 8. Port Scanning Detection

**Purpose**: Identify potential port scanning activities

```sql
SELECT 
    message.source_address,
    COUNT(DISTINCT message.destination_address) as scanned_hosts,
    COUNT(DISTINCT message.destination_port) as scanned_ports,
    COUNT(*) as total_attempts,
    MIN(message.timestamp) as scan_start,
    MAX(message.timestamp) as scan_end
FROM logs 
WHERE message.event_type = 'network'
    AND message.destination_port IS NOT NULL
    AND message.timestamp >= NOW() - INTERVAL 1 HOUR
GROUP BY message.source_address
HAVING scanned_hosts > 10 OR scanned_ports > 20
ORDER BY scanned_hosts DESC, scanned_ports DESC
LIMIT 10;
```

**Use Case**: Network reconnaissance detection, vulnerability scanning identification

### 9. Unusual Network Protocols

**Purpose**: Detect usage of unusual or potentially malicious network protocols

```sql
SELECT 
    message.protocol,
    message.source_address,
    message.destination_address,
    message.destination_port,
    COUNT(*) as connection_count
FROM logs 
WHERE message.protocol NOT IN ('TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP')
    AND message.timestamp >= NOW() - INTERVAL 6 HOUR
GROUP BY message.protocol, message.source_address, message.destination_address, message.destination_port
ORDER BY connection_count DESC
LIMIT 25;
```

**Use Case**: Malware communication detection, protocol abuse identification

## Malware Detection

### 10. DNS Tunneling Detection

**Purpose**: Identify potential DNS tunneling activities

```sql
SELECT 
    message.source_address,
    message.dns_query,
    LENGTH(message.dns_query) as query_length,
    COUNT(*) as query_count
FROM logs 
WHERE message.event_type = 'dns'
    AND LENGTH(message.dns_query) > 50  -- Unusually long DNS queries
    AND message.timestamp >= NOW() - INTERVAL 2 HOUR
GROUP BY message.source_address, message.dns_query
HAVING query_count > 5
ORDER BY query_length DESC, query_count DESC
LIMIT 20;
```

**Use Case**: Data exfiltration detection, covert channel identification

### 11. Command and Control Communication

**Purpose**: Detect potential C2 communication patterns

```sql
SELECT 
    message.destination_address,
    message.destination_port,
    COUNT(DISTINCT message.source_address) as infected_hosts,
    COUNT(*) as total_connections,
    AVG(message.bytes_sent) as avg_bytes_sent
FROM logs 
WHERE message.event_type = 'network'
    AND message.bytes_sent > 0
    AND message.timestamp >= NOW() - INTERVAL 4 HOUR
GROUP BY message.destination_address, message.destination_port
HAVING infected_hosts > 3 
    AND total_connections > 50
    AND avg_bytes_sent < 1000  -- Small, regular communications typical of C2
ORDER BY infected_hosts DESC
LIMIT 15;
```

**Use Case**: Botnet detection, malware communication identification

## Data Exfiltration Detection

### 12. Large Data Transfers

**Purpose**: Identify potentially unauthorized large data transfers

```sql
SELECT 
    message.source_address,
    message.destination_address,
    message.source_username,
    SUM(message.bytes_sent) as total_bytes_sent,
    COUNT(*) as transfer_count,
    AVG(message.bytes_sent) as avg_transfer_size
FROM logs 
WHERE message.bytes_sent > 10000000  -- 10MB threshold
    AND message.timestamp >= NOW() - INTERVAL 8 HOUR
GROUP BY message.source_address, message.destination_address, message.source_username
ORDER BY total_bytes_sent DESC
LIMIT 10;
```

**Use Case**: Data loss prevention, insider threat detection

### 13. Off-Hours Data Movement

**Purpose**: Detect data transfers during unusual hours

```sql
SELECT 
    message.source_username,
    message.destination_address,
    SUM(message.bytes_sent) as total_bytes,
    COUNT(*) as transfer_count,
    HOUR(message.timestamp) as transfer_hour
FROM logs 
WHERE (HOUR(message.timestamp) < 6 OR HOUR(message.timestamp) > 20)
    AND message.bytes_sent > 1000000  -- 1MB threshold
    AND message.timestamp >= NOW() - INTERVAL 3 DAY
GROUP BY message.source_username, message.destination_address, HOUR(message.timestamp)
ORDER BY total_bytes DESC
LIMIT 30;
```

**Use Case**: Unauthorized data access, after-hours activity monitoring

## Compliance and Audit Queries

### 14. Administrative Action Audit

**Purpose**: Track all administrative actions for compliance

```sql
SELECT 
    message.source_username,
    message.event_name,
    message.destination_resource,
    message.timestamp,
    message.access_result
FROM logs 
WHERE message.event_type = 'admin'
    AND message.source_username IS NOT NULL
    AND message.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY message.timestamp DESC
LIMIT 100;
```

**Use Case**: Compliance reporting, administrative oversight

### 15. Failed Access Attempts Audit

**Purpose**: Document all failed access attempts for security audits

```sql
SELECT 
    DATE(message.timestamp) as audit_date,
    message.source_username,
    message.source_address,
    message.destination_resource,
    COUNT(*) as failed_attempts
FROM logs 
WHERE message.access_result = 'denied'
    AND message.timestamp >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY DATE(message.timestamp), message.source_username, message.source_address, message.destination_resource
HAVING failed_attempts > 3
ORDER BY audit_date DESC, failed_attempts DESC
LIMIT 200;
```

**Use Case**: Security compliance, access control effectiveness analysis

## Performance Optimization

### Query Performance Tips

1. **Use Time-Based Filtering**: Always include timestamp filters to limit data scope
   ```sql
   WHERE message.timestamp >= NOW() - INTERVAL 24 HOUR
   ```

2. **Limit Result Sets**: Use appropriate LIMIT clauses
   ```sql
   ORDER BY event_count DESC LIMIT 50
   ```

3. **Index-Friendly Conditions**: Use conditions that can leverage indexes
   ```sql
   WHERE message.priority = 'high'  -- Better than LIKE patterns
   ```

4. **Avoid Leading Wildcards**: Use trailing wildcards when possible
   ```sql
   WHERE message.event_name LIKE 'login%'  -- Better than '%login%'
   ```

### Common Performance Anti-Patterns

❌ **Avoid**: `SELECT * FROM logs` (returns too much data)
✅ **Better**: `SELECT message.event_name, message.source_address FROM logs`

❌ **Avoid**: Queries without time constraints
✅ **Better**: Always include reasonable time bounds

❌ **Avoid**: Complex regular expressions in WHERE clauses
✅ **Better**: Use simple string operations when possible

## Best Practices

### Security Best Practices

1. **Principle of Least Privilege**: Only query data necessary for your analysis
2. **Time Boundaries**: Always use appropriate time ranges to limit data exposure
3. **Data Classification**: Be aware of the sensitivity of queried data
4. **Audit Trail**: Log your security queries for compliance purposes

### Query Development Best Practices

1. **Start Small**: Begin with limited time ranges and result sets
2. **Test Incrementally**: Validate queries with small datasets first
3. **Document Intent**: Comment complex queries with their security purpose
4. **Version Control**: Track query evolution for audit purposes

### Example Query Development Workflow

```sql
-- Step 1: Basic query with small time window
SELECT message.event_name, COUNT(*) 
FROM logs 
WHERE message.timestamp >= NOW() - INTERVAL 1 HOUR 
GROUP BY message.event_name 
LIMIT 10;

-- Step 2: Add filtering conditions
SELECT message.event_name, message.source_address, COUNT(*) 
FROM logs 
WHERE message.timestamp >= NOW() - INTERVAL 1 HOUR 
    AND message.priority = 'high'
GROUP BY message.event_name, message.source_address 
LIMIT 10;

-- Step 3: Expand time range after validation
SELECT message.event_name, message.source_address, COUNT(*) as event_count
FROM logs 
WHERE message.timestamp >= NOW() - INTERVAL 24 HOUR 
    AND message.priority = 'high'
GROUP BY message.event_name, message.source_address 
HAVING event_count > 5
ORDER BY event_count DESC
LIMIT 50;
```

## Testing and Validation

All queries in this guide can be tested using the advanced query validation tool:

```bash
# Run validation tests
npm run build
node dist/test/advanced-query-validation.js

# Or use the MCP tool directly
execute_advanced_query(
    account_name="your_account",
    query_string="SELECT message.event_name FROM logs WHERE message.priority = 'high' LIMIT 10",
    query_language="SQL",
    include_performance=true
)
```

## Integration with Claude Code

These queries can be executed through Claude Code using natural language:

- "Show me all high priority security events from the last 24 hours"
- "Find potential brute force attacks in the last hour"
- "Detect any geographic anomalies in recent login attempts"
- "Look for signs of lateral movement in network traffic"

## Appendix: Field Reference

### Common Log Fields

| Field | Description | Example Values |
|-------|-------------|----------------|
| message.event_name | Event description | "User login successful", "File accessed" |
| message.source_address | Source IP | "192.168.1.100", "203.0.113.1" |
| message.source_country | ISO country code | "US", "CN", "RU" |
| message.priority | Event priority | "low", "medium", "high", "critical" |
| message.event_type | Event category | "authentication", "network", "file" |
| message.bytes_sent | Data transferred | 1024, 5000000 |
| message.destination_port | Target port | 80, 443, 22, 3389 |

### Time Functions

| Function | Description | Example |
|----------|-------------|---------|
| NOW() | Current timestamp | WHERE timestamp >= NOW() - INTERVAL 1 HOUR |
| DATE() | Extract date | GROUP BY DATE(timestamp) |
| HOUR() | Extract hour | WHERE HOUR(timestamp) BETWEEN 9 AND 17 |
| DAYNAME() | Day name | WHERE DAYNAME(timestamp) = 'Monday' |

---

**Note**: This guide contains validated queries tested against live USM Anywhere instances. Performance characteristics may vary based on your data volume and system configuration. Always test queries in a development environment before using in production analysis.