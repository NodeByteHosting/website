# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in NodeByte Hosting, please **do not** open a public GitHub issue. Instead, please report it responsibly to our security team.

### How to Report

Email: **security@nodebyte.host**

Please include:
- Description of the vulnerability
- Steps to reproduce (if applicable)
- Affected versions
- Potential impact
- Suggested fix (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Resolution**: We aim to patch critical vulnerabilities within 2 weeks

## Security Best Practices

### For Administrators

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use strong values for `NEXTAUTH_SECRET`
   - Rotate API keys regularly
   - Store sensitive data in database, not environment files

2. **Database Security**
   - Use strong passwords for PostgreSQL
   - Enable SSL/TLS for database connections
   - Keep PostgreSQL updated
   - Use principle of least privilege for database users

3. **Access Control**
   - Regularly audit admin users
   - Revoke access for inactive users
   - Use strong passwords (minimum 12 characters)
   - Enable two-factor authentication (when available)

4. **API Key Management**
   - Generate new keys in the admin panel
   - Immediately disable compromised keys
   - Use the "Reset" functionality if needed
   - Never share API keys via email or chat

5. **Webhook Security**
   - Test webhooks before enabling
   - Monitor webhook delivery failures
   - Use HTTPS for Discord webhook URLs
   - Disable webhooks that are no longer needed

### For Developers

1. **Code Review**
   - All changes require code review
   - Security-sensitive code gets extra scrutiny
   - Follow secure coding practices

2. **Dependencies**
   - Keep dependencies updated
   - Run `npm audit` regularly
   - Review security advisories
   - Use `npm ci` instead of `npm install` for stability

3. **Authentication**
   - Never hardcode credentials
   - Use environment variables or database storage
   - Implement proper session management
   - Validate and sanitize all inputs

4. **Database**
   - Use parameterized queries (Prisma handles this)
   - Implement row-level security when needed
   - Avoid SQL injection vulnerabilities
   - Use migrations for schema changes

5. **API Security**
   - Validate request payloads
   - Use appropriate HTTP status codes
   - Implement rate limiting (recommended)
   - Log suspicious activity

## Known Security Considerations

### API Key Protection
- API keys (Pterodactyl, GitHub, Crowdin, Resend) are masked as `••••••••••••••••••••` in the UI
- Keys are stored in the database, not in `.env` files
- Once saved, keys cannot be viewed again (only reset)
- The system uses string comparison to prevent saving masked values

### Session Management
- Sessions are encrypted and stored server-side
- Session cookies have `httpOnly` and `secure` flags
- Session expiration is configurable
- All admin operations require valid session

### Maintenance Mode
- Non-admin users are redirected to `/maintenance` page
- Admins can bypass maintenance mode
- Login and session endpoints still work during maintenance

## Version Support

| Version | Status | Support Until |
|---------|--------|---------------|
| 3.2.x   | Current | TBD |
| 3.1.x   | Security Only | TBD |
| < 3.1   | Unsupported | - |

**Note**: Versions older than the current major version may have limited security support.

## Security Disclosure

We appreciate responsible disclosure and will:
- Acknowledge receipt of your report
- Work on a fix without public disclosure
- Release a patch update
- Credit you in the release notes (if desired)

## Security Headers

The platform implements:
- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Compliance

This project aims to follow:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- Security best practices for Next.js applications

## Incident Response

If a security incident occurs:
1. We will acknowledge the incident
2. Work on immediate mitigation
3. Prepare a security patch
4. Release information publicly once patched
5. Provide guidance to affected users

## Security Contacts

- **Security Team**: security@nodebyte.host
- **General Support**: support@nodebyte.host
- **Discord**: https://discord.gg/nodebyte

---

**Last Updated:** December 22, 2025

Thank you for helping keep NodeByte Hosting secure!
