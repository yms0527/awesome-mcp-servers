# SANS-Aligned Investigation Workflow Guide

This guide provides a structured approach to conducting security investigations using the USM Anywhere MCP Server, following the SANS 6-step incident response process.

## Quick Reference: SANS 6-Step Process

1. **Preparation** - Ready your tools and team
2. **Identification** - Detect and analyze the incident
3. **Containment** - Limit the damage
4. **Eradication** - Remove the threat
5. **Recovery** - Restore normal operations
6. **Lessons Learned** - Document and improve

## Step-by-Step Investigation Workflow

### Step 1: Preparation (Before an Incident)

**Key Actions:**
- Set up investigation templates
- Define team roles and responsibilities
- Establish communication protocols

**MCP Commands:**
```
// Create investigation templates for common scenarios
"Create an investigation template for malware incidents with high priority"
"Create an investigation template for data breach attempts with critical priority"
"Set up default tags for compliance-related investigations"
```

### Step 2: Identification (0-30 minutes)

**Key Actions:**
- Monitor for security alerts
- Validate true vs false positives
- Assess incident severity and scope

**MCP Commands:**
```
// Initial triage
"Show me all critical alarms from the last hour"
"Get details for alarm <alarm-id> to understand the threat"
"Search for related events from the same source IP"

// Create investigation if incident confirmed
"Create a critical investigation for potential ransomware attack detected in alarm <alarm-id>"
"Link alarms <id1>, <id2>, <id3> to the investigation"
```

**Decision Points:**
- Is this a real security incident? → Create investigation
- What's the potential impact? → Set priority (low/medium/high/critical)
- Who should handle this? → Assign to appropriate analyst

### Step 3: Containment (30 minutes - 2 hours)

**Key Actions:**
- Isolate affected systems
- Preserve evidence
- Prevent incident spread

**Short-term Containment:**
```
"Update investigation <id> status to in_progress"
"Add note: Isolated affected hosts 192.168.1.50-55 from network at 14:30 UTC"
"Add note: Disabled user accounts showing suspicious activity: jsmith, mjones"
```

**Long-term Containment:**
```
"Add note: Implemented temporary firewall rules blocking C2 domains"
"Add note: Deployed EDR policy to monitor for similar IoCs across environment"
"Update investigation with new findings from memory forensics"
```

### Step 4: Eradication (2-8 hours)

**Key Actions:**
- Remove malware/threats
- Patch vulnerabilities
- Strengthen defenses

**MCP Commands:**
```
"Add note: Malware removed from 5 endpoints using EDR console"
"Add note: Applied security patches CVE-2024-1234 to all affected systems"
"Add note: Reset credentials for all potentially compromised accounts"
"Link new events showing successful remediation to investigation"
```

**Verification:**
```
"Search for any new alarms related to the original IoCs"
"Check if any events show persistence mechanisms"
```

### Step 5: Recovery (8-24 hours)

**Key Actions:**
- Restore systems to production
- Monitor for reinfection
- Validate business operations

**MCP Commands:**
```
"Add note: Systems restored from clean backups dated 2025-01-14"
"Add note: Enhanced monitoring deployed, no signs of reinfection after 4 hours"
"Update investigation priority to medium as we monitor recovery"
"Search for any anomalous events from recovered systems"
```

**Monitoring Period:**
```
"Show me any new alarms from the previously affected systems"
"Check for events matching the original attack patterns"
```

### Step 6: Lessons Learned (Within 2 weeks)

**Key Actions:**
- Document timeline
- Identify improvements
- Update procedures

**MCP Commands:**
```
"Add comprehensive note with incident timeline and root cause analysis"
"Add note: Recommendations - 1) Implement MFA for admin accounts 2) Update EDR rules 3) Enhance network segmentation"
"Update investigation status to resolved"
"Export investigation details for post-incident report"
```

**Final Documentation Should Include:**
- Complete incident timeline
- Attack vectors and vulnerabilities exploited
- Detection gaps identified
- Response actions taken
- Recommendations for improvement

## Investigation Priority Guidelines

### Critical (Respond within 15 minutes)
- Active data breach
- Ransomware deployment
- Domain controller compromise
- Critical infrastructure attack

### High (Respond within 1 hour)
- Malware infection spreading
- Privileged account compromise
- Web server defacement
- Significant policy violations

### Medium (Respond within 4 hours)
- Isolated malware infection
- Suspicious user behavior
- Failed attack attempts
- Non-critical system compromise

### Low (Respond within 24 hours)
- Policy violations
- Vulnerability findings
- Compliance checks
- Security awareness issues

## Best Practices for Note-Taking

### What to Document
1. **Actions Taken**: Every containment, eradication, or recovery action
2. **Findings**: IoCs, affected systems, attack timeline
3. **Decisions**: Why certain actions were taken or not taken
4. **Evidence**: Screenshots, log excerpts, memory dumps locations
5. **Communications**: When stakeholders were notified

### Note Format Template
```
[TIMESTAMP] - [PHASE] - [ANALYST]
Action: [What was done]
Finding: [What was discovered]
Evidence: [Where evidence is stored]
Next Steps: [What needs to happen next]
```

### Example Note
```
2025-01-15 14:30:00 UTC - CONTAINMENT - john.doe
Action: Isolated subnet 192.168.1.0/24 at firewall level
Finding: Lateral movement attempted to 3 additional hosts
Evidence: Packet captures saved to \\evidence\case-001\pcaps\
Next Steps: Analyze memory dumps from affected hosts
```

## Integration with Other Tools

### Linking Evidence
```
"Link alarm <alarm-id> showing initial compromise to investigation"
"Add events from the past 24 hours matching source IP 10.0.0.50"
"Include all authentication events for user 'compromised.user'"
```

### Collaborative Response
```
"Assign investigation to senior analyst jane.smith"
"Add note: Escalating to incident commander due to critical data exposure"
"Update investigation tags to include 'legal-hold' and 'executive-briefing'"
```

## Automation Opportunities

### Auto-Create Investigations
Set up rules to automatically create investigations when:
- Multiple critical alarms fire within 5 minutes
- Known malware signatures are detected
- Privileged account anomalies occur
- Data exfiltration patterns match

### Template Responses
Create reusable note templates for common actions:
- System isolation procedures
- Evidence collection checklist
- Stakeholder notification templates
- Recovery validation steps

## Metrics and Reporting

Track these key metrics:
- **Mean Time to Detect (MTTD)**: Time from incident start to creation of investigation
- **Mean Time to Contain (MTTC)**: Time from investigation creation to containment
- **Mean Time to Resolve (MTTR)**: Time from investigation creation to resolution
- **False Positive Rate**: Investigations closed as false positives

## Compliance Considerations

For regulated environments, ensure investigations include:
- **PCI DSS**: Document all access to cardholder data during investigation
- **HIPAA**: Note any PHI potentially exposed
- **GDPR**: Track any personal data breach within 72-hour reporting window
- **SOX**: Document any financial system impacts

Remember: A well-documented investigation is crucial for legal proceedings, compliance audits, and improving security posture.