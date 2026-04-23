# Security Policy

## Reporting Vulnerabilities

We take security seriously at Arvo. If you discover a security vulnerability, please report it responsibly.

**Email:** security@arvo.guru

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

We will acknowledge receipt within 48 hours and provide a detailed response within 7 days.

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Security Measures

### API Key Security
- API keys are hashed using SHA-256 before storage
- Keys are never stored in plaintext in our database
- Only the key prefix (`arvo_xxxx`) is visible after creation
- Keys can be instantly revoked from your dashboard

### Communication Security
- All API communication uses HTTPS/TLS encryption
- No sensitive data is transmitted over unencrypted channels
- API keys are sent via secure HTTP headers, not URL parameters

### Access Control
- Scoped permissions (read-only or read-write)
- Keys are tied to individual user accounts
- Usage tracking via `last_used_at` timestamp
- Optional key expiration dates

### Local Security
- Your API key is stored locally on your machine only
- The MCP server runs locally and communicates directly with arvo.guru
- No third-party services have access to your credentials

## Best Practices for Users

1. **Keep your API key secret** - Never commit it to version control
2. **Use environment variables** - Store keys in env vars, not config files
3. **Revoke unused keys** - Delete keys you no longer need
4. **Use minimal scopes** - Only grant read-write access when necessary
5. **Monitor usage** - Check `last_used_at` for unexpected activity

## Responsible Disclosure

We follow responsible disclosure practices:
- We will not take legal action against researchers who follow this policy
- We will credit researchers who report valid vulnerabilities (with permission)
- We aim to fix critical vulnerabilities within 30 days

## Contact

For security concerns: security@arvo.guru
For general inquiries: hello@arvo.guru
