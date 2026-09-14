# Security Policy

## Supported Versions
| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Active |

## Reporting a Vulnerability
If you discover a security issue:
1. Do NOT open a public issue.
2. Email the maintainer (see `author` in `package.json`).
3. Include:
   - Description of the issue
   - Steps to reproduce
   - Potential impact
   - Suggested remediation (if any)

## Best Practices for Users
- Always use the latest version
- Restrict `CONTEXT_OPT_ALLOWED_PATHS` to needed directories
- Run in isolated user contexts when possible
- Avoid exposing API keys in logs or config files

## Non-Vulnerabilities
The following are not treated as security issues:
- Missing feature requests
- Tool misuse outside documented guarantees
- Environment misconfiguration

## Disclosure Policy
We prefer responsible disclosure—please allow time for a fix before going public.
