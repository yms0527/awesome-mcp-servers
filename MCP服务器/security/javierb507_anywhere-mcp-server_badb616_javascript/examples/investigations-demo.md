# Investigations Feature Demo

This document demonstrates the investigations management feature in the AlienVault USM Anywhere MCP Server, aligned with SANS incident response methodology.

## Overview

The investigations feature enables Security Operations Center (SOC) analysts to:
- Create and manage security investigations following the SANS 6-step process
- Track investigation status (open, in_progress, resolved, closed) and priority
- Assign investigations to team members for collaborative response
- Document findings with timestamped notes for audit trails
- Link related alarms and events to build complete incident context
- Maintain chain of custody for potential legal proceedings

## Available Commands

### 1. List Investigations

**Natural Language:**
> "Show me all open investigations for account MyCompany"

**MCP Tool Call:**
```json
{
  "name": "get_investigations",
  "arguments": {
    "account_name": "MyCompany",
    "status": "open",
    "page": 0,
    "size": 20
  }
}
```

### 2. Get Investigation Details

**Natural Language:**
> "Get details for investigation abc-123-def"

**MCP Tool Call:**
```json
{
  "name": "get_investigation_details",
  "arguments": {
    "investigation_id": "abc-123-def"
  }
}
```

### 3. Create New Investigation

**Natural Language:**
> "Create a new critical investigation called 'Data Breach Response' assigned to security.team with description 'Investigating suspicious data access patterns'"

**MCP Tool Call:**
```json
{
  "name": "create_investigation",
  "arguments": {
    "account_name": "MyCompany",
    "name": "Data Breach Response",
    "description": "Investigating suspicious data access patterns",
    "priority": "critical",
    "assignee": "security.team",
    "tags": ["data-breach", "urgent", "compliance"]
  }
}
```

### 4. Update Investigation Status

**Natural Language:**
> "Update investigation xyz-789 to mark it as resolved"

**MCP Tool Call:**
```json
{
  "name": "update_investigation",
  "arguments": {
    "investigation_id": "xyz-789",
    "status": "resolved"
  }
}
```

### 5. Add Investigation Note

**Natural Language:**
> "Add a note to investigation abc-123 with the latest findings"

**MCP Tool Call:**
```json
{
  "name": "add_investigation_note",
  "arguments": {
    "investigation_id": "abc-123",
    "content": "Investigation findings: No evidence of data exfiltration found. Suspicious activity was due to automated backup process running outside normal hours."
  }
}
```

### 6. Filter Investigations

**Natural Language:**
> "Show me all high priority investigations assigned to john.doe created in the last week"

**MCP Tool Call:**
```json
{
  "name": "get_investigations",
  "arguments": {
    "account_name": "MyCompany",
    "priority": "high",
    "assignee": "john.doe",
    "created_after": 1672531200000,
    "page": 0,
    "size": 50
  }
}
```

## Integration Workflows

### Creating Investigation from Alarm

1. **Get alarm details:**
   ```
   "Get details for alarm alarm-456"
   ```

2. **Create investigation with alarm:**
   ```
   "Create a new investigation called 'Security Incident Investigation' for alarm alarm-456 with high priority"
   ```

### Investigation Lifecycle Management

1. **Create Investigation:** Start with basic information
2. **Add Evidence:** Link relevant alarms and events
3. **Document Progress:** Add notes throughout the investigation
4. **Update Status:** Mark as in_progress → resolved/closed
5. **Archive:** Delete completed investigations when no longer needed

## Best Practices

### Investigation Naming
- Use descriptive names that indicate the type of incident
- Include date or incident ID for reference
- Examples: "2024-01-15 Malware Incident", "INC-001 Data Breach Response"

### Priority Guidelines
- **Critical:** Active breaches, data theft, system compromise
- **High:** Malware infections, policy violations, suspicious activity
- **Medium:** Failed login attempts, configuration issues
- **Low:** Routine investigations, compliance checks

### Documentation
- Add notes for key findings and decisions
- Document evidence collection and analysis steps
- Include remediation actions taken
- Note lessons learned for future reference

## API Response Examples

### Successful Investigation Creation Response
```json
{
  "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Potential Data Breach - SQL Injection Attack",
  "description": "Multiple SQL injection attempts detected from IP 192.168.1.100",
  "status": "open",
  "priority": "critical",
  "assignee": "security.team",
  "created_by": "api-client",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "tags": ["sql-injection", "data-breach", "critical"],
  "alarm_count": 3,
  "event_count": 45,
  "_links": {
    "self": {
      "href": "/api/2.0/investigations/f47ac10b-58cc-4372-a567-0e02b2c3d479"
    }
  }
}
```

### Investigation with Notes Response
```json
{
  "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Potential Data Breach - SQL Injection Attack",
  "status": "in_progress",
  "notes": [
    {
      "id": "note-001",
      "content": "Initial triage complete. Confirmed SQL injection attempts targeting customer database.",
      "author": "john.doe",
      "created_at": "2025-01-15T10:45:00Z"
    },
    {
      "id": "note-002",
      "content": "Affected systems isolated from network. Beginning forensic analysis.",
      "author": "jane.smith",
      "created_at": "2025-01-15T11:00:00Z"
    }
  ]
}
```

## SANS-Aligned Investigation Workflow

### 1. Preparation Phase
```javascript
// Ensure your team is ready with predefined investigation templates
const investigationTemplates = {
  malware: {
    name: "Malware Incident - {date}",
    priority: "high",
    tags: ["malware", "endpoint-security"],
    description: "Potential malware infection detected. Requires immediate triage."
  },
  dataBreachAttempt: {
    name: "Data Breach Attempt - {date}",
    priority: "critical",
    tags: ["data-breach", "compliance", "urgent"],
    description: "Suspicious data access patterns detected. Possible exfiltration attempt."
  }
};
```

### 2. Identification Phase
**Natural Language Example:**
> "Check for any critical alarms in the last 24 hours that might indicate a security incident"

**Response includes alarm analysis and automatic investigation creation for critical findings**

### 3. Containment Phase
**Natural Language Example:**
> "Update investigation abc-123 to in_progress status and add a note about isolating affected systems"

**Tool automatically documents containment actions with timestamps**

### 4. Eradication Phase
**Natural Language Example:**
> "Add note to investigation documenting malware removal and system patching completed"

### 5. Recovery Phase
**Natural Language Example:**
> "Update investigation status to resolved and document that all systems have been restored to normal operation"

### 6. Lessons Learned
**Natural Language Example:**
> "Add final notes to investigation with recommendations for preventing similar incidents"

## Error Handling Examples

### Permission Denied
```json
{
  "error": "Access denied. You may not have permission to create investigations.",
  "status": 403,
  "details": "Ensure your API client has the 'investigations:write' scope"
}
```

### Invalid Status Transition
```json
{
  "error": "Investigation status transition not allowed. Check current status and workflow rules.",
  "status": 409,
  "details": "Cannot change status from 'closed' to 'open'"
}
```

## Claude Code Integration Examples

### Complex Investigation Workflow
```
User: "I see multiple failed login attempts from external IPs. Start an investigation."

Claude: I'll help you investigate these failed login attempts. Let me first check for related alarms.

[Searches for authentication-related alarms]

I found 47 failed login attempts from 3 different IP addresses in the last hour. This appears to be a brute force attack. I'll create a high-priority investigation for this incident.

[Creates investigation with relevant details]

Investigation created successfully:
- Name: "Brute Force Attack Investigation - 2025-01-15"
- Priority: High
- Status: Open
- Linked alarms: 3
- Assigned to: security.team

I've also noticed that one of the IPs (192.168.100.55) eventually had a successful login. This requires immediate attention.

User: "Check if that IP accessed any sensitive data after login"

Claude: I'll search for events from that IP address after the successful login.

[Searches events filtered by source IP and timestamp]

Critical finding: The IP 192.168.100.55 accessed the customer database and performed several SELECT queries on the users table. I'll add this finding to the investigation.

[Adds detailed note to investigation]

User: "Immediately disable that user account and add containment notes"

Claude: I understand the urgency. While I cannot directly disable user accounts, I'll document the containment action you need to take:

[Updates investigation with containment note]

Added containment note:
"URGENT: User account 'john.smith' compromised via brute force attack. Account must be disabled immediately. IP 192.168.100.55 accessed customer database post-compromise. Initiating incident response protocol."

[Updates investigation status to 'in_progress' and priority to 'critical']

Investigation updated:
- Status: In Progress
- Priority: Critical
- Latest note documents the immediate containment needed

Please ensure the compromised account is disabled through your identity management system immediately.
```

### Automated Investigation Enrichment
```
User: "Enrich investigation xyz-789 with all related security events from the past week"

Claude: I'll enrich the investigation with related security events. Let me first get the investigation details.

[Retrieves investigation details to understand context]

This investigation is about "Suspicious Outbound Traffic to Known C2 Server". I'll search for related events.

[Searches for events with matching IPs, domains, or indicators]

Found 156 related events:
- 89 DNS queries to suspicious domains
- 45 outbound connections on port 443
- 22 process creation events on affected hosts

[Adds comprehensive analysis note to investigation]

Investigation enriched with:
✓ Complete timeline of suspicious activities
✓ List of all affected systems (8 endpoints identified)
✓ Network indicators of compromise (IoCs)
✓ Correlation with threat intelligence data

The pattern suggests a possible advanced persistent threat (APT). Recommend escalating to senior analyst for further investigation.
```

## Best Practices Summary

1. **Always Document**: Every action taken during an investigation should be documented with notes
2. **Follow Status Workflow**: open → in_progress → resolved → closed
3. **Use Meaningful Titles**: Include date, incident type, and severity in investigation names
4. **Tag Appropriately**: Use consistent tags for easier searching and reporting
5. **Link Evidence**: Always link related alarms and events to maintain context
6. **Assign Responsibility**: Ensure every investigation has an assignee
7. **Time-Sensitive Response**: Critical investigations should be addressed within 15 minutes
8. **Regular Updates**: Add progress notes at least every hour for active investigations
9. **Complete Closure**: Include lessons learned and preventive measures in final notes

This comprehensive approach ensures thorough incident response aligned with industry standards.