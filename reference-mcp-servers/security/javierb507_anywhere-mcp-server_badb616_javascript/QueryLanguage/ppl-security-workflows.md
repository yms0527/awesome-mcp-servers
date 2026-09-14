# PPL Security Workflows Guide

Comprehensive guide for security analysis using Piped Processing Language (PPL) in USM Anywhere. PPL provides a powerful, pipeline-based approach to log analysis that's particularly effective for security investigations.

## Table of Contents

1. [PPL Fundamentals](#ppl-fundamentals)
2. [Basic Security Workflows](#basic-security-workflows)
3. [Advanced Threat Hunting](#advanced-threat-hunting)
4. [Authentication Analysis Pipelines](#authentication-analysis-pipelines)
5. [Network Traffic Analysis](#network-traffic-analysis)
6. [Log Correlation Workflows](#log-correlation-workflows)
7. [Statistical Security Analysis](#statistical-security-analysis)
8. [Performance Optimization](#performance-optimization)
9. [Best Practices](#best-practices)

## PPL Fundamentals

### Basic Pipeline Structure

PPL queries follow a pipeline pattern where data flows through a series of commands:

```ppl
search source=<index> [initial_filter]
| command1 [parameters]
| command2 [parameters]
| command3 [parameters]
```

### Core PPL Commands for Security

- `search`: Entry point, defines data source and initial filtering
- `where`: Filter records based on conditions
- `fields`: Select specific fields to include/exclude
- `stats`: Statistical aggregations (count, avg, sum, etc.)
- `sort`: Order results
- `head`/`tail`: Limit number of results
- `eval`: Create calculated fields
- `rename`: Rename fields for clarity

### Common Field References

PPL uses the same field structure as SQL:
- `message.event_name`: Event type
- `message.source_address`: Source IP
- `message.timestamp`: Event timestamp
- `message.priority`: Event priority level
- `message.source_username`: Associated username

## Basic Security Workflows

### 1. High Priority Events Analysis

**Purpose**: Monitor and analyze high-priority security events

```ppl
search source=logs message.priority="high"
| where message.timestamp >= relative_time(now(), "-24h")
| stats count() by message.event_name, message.source_address
| where count > 1
| sort - count
| head 20
```

**Workflow Breakdown**:
1. Search logs for high-priority events
2. Filter to last 24 hours
3. Group by event name and source address
4. Show only sources with multiple events
5. Sort by frequency (descending)
6. Limit to top 20 results

**Use Case**: Daily security monitoring, incident prioritization

### 2. Failed Authentication Monitoring

**Purpose**: Track and analyze failed authentication attempts

```ppl
search source=logs message.event_name="*login*fail*"
| where message.timestamp >= relative_time(now(), "-1h")
| stats count() as failed_attempts by message.source_address, message.source_username
| where failed_attempts > 5
| eval threat_level=case(
    failed_attempts > 20, "Critical",
    failed_attempts > 10, "High", 
    failed_attempts > 5, "Medium"
)
| sort - failed_attempts
| head 15
```

**Workflow Features**:
- Dynamic threat level calculation
- Configurable thresholds
- Real-time monitoring capability

## Advanced Threat Hunting

### 3. Lateral Movement Detection Pipeline

**Purpose**: Detect potential lateral movement through network analysis

```ppl
search source=logs message.event_type="network"
| where message.timestamp >= relative_time(now(), "-2h")
| where isnotnull(message.source_address) AND isnotnull(message.destination_address)
| stats count() as connections, 
        dc(message.destination_address) as unique_destinations,
        values(message.destination_address) as target_hosts
        by message.source_address
| where unique_destinations > 10 OR connections > 50
| eval risk_score = (unique_destinations * 2) + (connections / 10)
| sort - risk_score
| head 10
```

**Advanced Features**:
- Multiple aggregation functions
- Risk scoring algorithm
- Comprehensive host enumeration

### 4. Geographic Anomaly Detection

**Purpose**: Identify authentication attempts from unusual locations

```ppl
search source=logs message.event_name="*login*"
| where message.timestamp >= relative_time(now(), "-24h")
| where isnotnull(message.source_country) AND isnotnull(message.source_username)
| stats count() as login_attempts, 
        dc(message.source_country) as countries_count,
        values(message.source_country) as countries
        by message.source_username
| where countries_count > 1
| eval geographic_risk = case(
    countries_count > 5, "Very High",
    countries_count > 3, "High",
    countries_count > 1, "Medium"
)
| sort - countries_count
| head 20
```

**Security Insights**:
- Multi-country access detection
- User-based geographic profiling
- Risk classification

## Authentication Analysis Pipelines

### 5. Brute Force Attack Analysis

**Purpose**: Comprehensive brute force attack detection and analysis

```ppl
search source=logs message.event_name="*login*fail*"
| where message.timestamp >= relative_time(now(), "-4h")
| bucket message.timestamp span=5m
| stats count() as attempts_per_5min by message.timestamp, message.source_address
| where attempts_per_5min > 10
| sort message.timestamp
| eval attack_intensity = case(
    attempts_per_5min > 50, "Severe",
    attempts_per_5min > 30, "High",
    attempts_per_5min > 10, "Moderate"
)
| stats max(attempts_per_5min) as peak_attempts,
        avg(attempts_per_5min) as avg_attempts,
        count() as attack_periods,
        values(attack_intensity) as intensity_levels
        by message.source_address
| sort - peak_attempts
```

**Temporal Analysis Features**:
- Time-bucket analysis
- Attack intensity classification
- Peak vs. average comparison

### 6. Successful Login After Failed Attempts

**Purpose**: Detect potentially compromised accounts

```ppl
search source=logs (message.event_name="*login*fail*" OR message.event_name="*login*success*")
| where message.timestamp >= relative_time(now(), "-2h")
| eval login_result = case(
    match(message.event_name, ".*success.*"), "success",
    match(message.event_name, ".*fail.*"), "failed"
)
| sort message.timestamp
| stats list(login_result) as login_sequence,
        count(eval(login_result="failed")) as failed_count,
        count(eval(login_result="success")) as success_count
        by message.source_address, message.source_username
| where failed_count > 5 AND success_count > 0
| eval success_after_failure = if(
    match(mvjoin(login_sequence, ","), ".*failed.*success.*"), "YES", "NO"
)
| where success_after_failure="YES"
| sort - failed_count
```

**Pattern Analysis**:
- Sequence tracking
- Success/failure correlation
- Compromise indication

## Network Traffic Analysis

### 7. Port Scanning Detection

**Purpose**: Identify network reconnaissance activities

```ppl
search source=logs message.event_type="network" 
| where message.timestamp >= relative_time(now(), "-1h")
| where isnotnull(message.destination_port)
| stats dc(message.destination_port) as unique_ports,
        dc(message.destination_address) as unique_hosts,
        count() as total_attempts,
        values(message.destination_port) as scanned_ports
        by message.source_address
| where unique_ports > 20 OR unique_hosts > 15
| eval scan_type = case(
    unique_ports > 100, "Comprehensive Port Scan",
    unique_hosts > 50, "Network Sweep",
    unique_ports > 20, "Port Scan",
    "Reconnaissance"
)
| sort - unique_ports
| head 10
```

**Scanning Detection Logic**:
- Port diversity analysis
- Host sweep detection
- Scan type classification

### 8. DNS Tunneling Detection

**Purpose**: Identify potential DNS-based data exfiltration

```ppl
search source=logs message.event_type="dns"
| where message.timestamp >= relative_time(now(), "-2h")
| where isnotnull(message.dns_query)
| eval query_length = len(message.dns_query)
| where query_length > 40
| stats count() as long_queries,
        avg(query_length) as avg_length,
        max(query_length) as max_length,
        values(message.dns_query) as sample_queries
        by message.source_address
| where long_queries > 10
| eval tunneling_risk = case(
    avg_length > 80 AND long_queries > 50, "Very High",
    avg_length > 60 AND long_queries > 20, "High",
    avg_length > 40 AND long_queries > 10, "Medium"
)
| sort - avg_length
| head 15
```

**Tunneling Indicators**:
- Query length analysis
- Frequency patterns
- Risk assessment

## Log Correlation Workflows

### 9. Multi-Source Event Correlation

**Purpose**: Correlate events across different log sources

```ppl
search source=logs 
| where message.timestamp >= relative_time(now(), "-6h")
| where message.source_address!=null
| stats count() as total_events,
        dc(message.event_type) as event_types,
        values(message.event_type) as event_categories,
        dc(message.source_username) as unique_users,
        earliest(message.timestamp) as first_event,
        latest(message.timestamp) as last_event
        by message.source_address
| where event_types > 3
| eval time_span_hours = round((last_event - first_event) / 3600, 2)
| eval activity_score = (total_events * event_types) / time_span_hours
| sort - activity_score  
| head 20
```

**Correlation Features**:
- Multi-dimensional analysis
- Temporal correlation
- Activity scoring

### 10. Incident Timeline Construction

**Purpose**: Build comprehensive incident timelines

```ppl
search source=logs message.source_address="<SUSPICIOUS_IP>"
| where message.timestamp >= relative_time(now(), "-24h")
| sort message.timestamp
| eval readable_time = strftime(message.timestamp, "%Y-%m-%d %H:%M:%S")
| eval event_category = case(
    match(message.event_name, ".*login.*"), "Authentication",
    match(message.event_name, ".*network.*"), "Network",
    match(message.event_name, ".*file.*"), "File System",
    "Other"
)
| table readable_time, event_category, message.event_name, 
        message.source_username, message.destination_address, message.priority
| head 100
```

**Timeline Features**:
- Chronological ordering
- Event categorization
- Human-readable formatting

## Statistical Security Analysis

### 11. Baseline Deviation Detection

**Purpose**: Detect activities that deviate from normal patterns

```ppl
search source=logs message.event_type="authentication"
| where message.timestamp >= relative_time(now(), "-7d")
| bucket message.timestamp span=1h
| stats count() as hourly_auth by message.timestamp
| eventstats avg(hourly_auth) as baseline_avg, 
            stdev(hourly_auth) as baseline_stdev
| eval deviation = abs(hourly_auth - baseline_avg) / baseline_stdev
| where deviation > 2.0
| eval anomaly_level = case(
    deviation > 4, "Extreme",
    deviation > 3, "High", 
    deviation > 2, "Moderate"
)
| sort - deviation
| head 24
```

**Statistical Analysis**:
- Standard deviation calculation
- Anomaly threshold detection
- Severity classification

### 12. User Behavior Analysis

**Purpose**: Analyze user activity patterns for anomaly detection

```ppl
search source=logs isnotnull(message.source_username)
| where message.timestamp >= relative_time(now(), "-30d")
| bucket message.timestamp span=1d
| stats count() as daily_events,
        dc(message.source_address) as unique_ips,
        dc(message.event_type) as event_diversity,
        values(message.source_country) as countries
        by message.timestamp, message.source_username
| eventstats avg(daily_events) as user_avg_events,
            avg(unique_ips) as user_avg_ips
            by message.source_username
| eval activity_anomaly = case(
    daily_events > (user_avg_events * 3), "High Activity",
    unique_ips > (user_avg_ips * 2), "Multi-Location",
    event_diversity > 5, "Diverse Activity",
    "Normal"
)
| where activity_anomaly != "Normal"
| sort - daily_events
```

**Behavioral Analytics**:
- Individual user profiling
- Activity pattern recognition
- Anomaly classification

## Performance Optimization

### PPL Performance Tips

1. **Optimize Search Command**: Use specific source indexes and initial filters
   ```ppl
   search source=security_logs message.priority="high"  # Good
   search source=*  # Avoid - too broad
   ```

2. **Early Filtering**: Apply filters early in the pipeline
   ```ppl
   search source=logs message.timestamp >= relative_time(now(), "-1h")
   | where message.priority="high"  # Filter early
   ```

3. **Efficient Aggregations**: Use appropriate statistical functions
   ```ppl
   | stats count() by field  # Faster than values() for simple counting
   ```

4. **Limit Result Sets**: Use head/tail to control output size
   ```ppl
   | head 50  # Always limit results appropriately
   ```

### Memory-Efficient Patterns

```ppl
# Good: Process data in chunks
search source=logs message.timestamp >= relative_time(now(), "-1h")
| stats count() by message.source_address
| head 100

# Avoid: Large data operations without limits
search source=logs
| stats values(message.event_name) by message.source_address
```

## Best Practices

### Security Analysis Best Practices

1. **Time-Bound Analysis**: Always use appropriate time ranges
2. **Incremental Development**: Start with simple pipelines and add complexity
3. **Result Validation**: Verify findings with complementary queries
4. **Documentation**: Comment complex pipelines for future reference

### Pipeline Development Workflow

```ppl
# Step 1: Basic search and exploration
search source=logs message.priority="high"
| head 10

# Step 2: Add filtering and basic stats
search source=logs message.priority="high"
| where message.timestamp >= relative_time(now(), "-1h")
| stats count() by message.event_name
| head 20

# Step 3: Enhance with advanced analytics
search source=logs message.priority="high"
| where message.timestamp >= relative_time(now(), "-1h")
| stats count() as event_count, 
        dc(message.source_address) as unique_sources
        by message.event_name
| eval events_per_source = round(event_count / unique_sources, 2)
| sort - event_count
| head 20
```

### Error Handling Patterns

```ppl
# Safe field handling
search source=logs
| where isnotnull(message.source_address)  # Prevent null issues
| eval safe_field = coalesce(message.field, "unknown")  # Handle missing fields
```

## Integration Examples

### Claude Code Natural Language Integration

These PPL workflows can be triggered through Claude Code using natural language:

- "Use PPL to find brute force attacks in the last hour"
- "Create a PPL pipeline to detect lateral movement"
- "Build a PPL query for DNS tunneling detection"
- "Show me user behavior anomalies using PPL"

### MCP Tool Usage

```javascript
// Execute PPL query through MCP
execute_advanced_query({
    account_name: "your_account",
    query_string: `search source=logs message.priority="high"
                  | where message.timestamp >= relative_time(now(), "-24h")
                  | stats count() by message.event_name
                  | sort - count
                  | head 20`,
    query_language: "PPL",
    include_performance: true
})
```

## Advanced Patterns

### Pipeline Chaining for Complex Analysis

```ppl
# Multi-stage analysis pipeline
search source=logs message.event_type="authentication"
| where message.timestamp >= relative_time(now(), "-7d")
| stats count() as auth_count by message.source_username, message.source_address
| where auth_count > 100
| join type=inner message.source_address 
    [search source=logs message.event_type="network"
     | where message.timestamp >= relative_time(now(), "-7d")
     | stats dc(message.destination_address) as network_diversity by message.source_address]
| where network_diversity > 20
| eval risk_score = (auth_count / 10) + (network_diversity * 2)
| sort - risk_score
```

### Custom Functions and Macros

```ppl
# Define reusable components
| eval time_of_day = case(
    hour(message.timestamp) >= 9 AND hour(message.timestamp) <= 17, "Business Hours",
    hour(message.timestamp) >= 18 OR hour(message.timestamp) <= 8, "After Hours"
)
```

## Testing and Validation

All PPL workflows in this guide can be tested using:

```bash
# Validation tool
node dist/test/advanced-query-validation.js

# Direct MCP execution
validate_query_syntax(
    query_string="search source=logs | head 10",
    query_language="PPL"
)
```

---

**Note**: PPL provides powerful pipeline-based analysis capabilities particularly suited for security workflows. The streaming nature of PPL makes it excellent for real-time analysis and complex data transformations. Always test pipelines with limited data sets before applying to large time ranges.