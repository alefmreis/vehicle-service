# Security

This document outlines the security measures implemented in the vehicle-service application.

## Security Improvements Implemented

### 1. Dependency Security
- **Fixed 24 out of 25 dependency vulnerabilities** identified by npm audit
- Remaining vulnerability is a low-severity AWS SDK v2 issue that requires migration to v3 (breaking change)
- Regular dependency updates recommended to maintain security posture

### 2. Authentication & Authorization

#### Password Security
- **Minimum password length**: 8 characters enforced via validation decorators
- **Password hashing**: Using bcrypt with 16 salt rounds for secure password storage
- **JWT Secret Key validation**: Enforces minimum 32-character secret keys
- Generate secure keys using: `openssl rand -base64 32`

#### Rate Limiting
- **Authentication endpoints**: Limited to 5 requests per 15 minutes per IP
  - `/api/v1/accounts/login`
  - `/api/v1/accounts` (create account)
- **General API endpoints**: Limited to 100 requests per 15 minutes per IP
  - All vehicle CRUD operations
  - Password reset operations
- Rate limiting provides defense-in-depth against brute force attacks

### 3. HTTP Security Headers
- **Helmet.js middleware** enabled to set secure HTTP headers:
  - Content Security Policy (CSP)
  - X-Frame-Options (clickjacking protection)
  - X-Content-Type-Options (MIME-sniffing protection)
  - Strict-Transport-Security (HSTS)
  - And other security headers

### 4. CORS Configuration
- **Configurable CORS origins** via `CORS_ALLOWED_ORIGINS` environment variable
- Supports comma-separated list of allowed origins
- **Production recommendation**: Never use `*` (wildcard), specify exact origins
- Example: `CORS_ALLOWED_ORIGINS=https://myapp.com,https://staging.myapp.com`

### 5. AWS Region Validation
- **Input validation** for DynamoDB region parameter
- Prevents injection attacks via region configuration
- Supports standard AWS regions (e.g., `us-west-2`, `eu-central-1`)
- Supports special regions: `us-gov-*`, `cn-*`, and `local` for development

## Environment Variables

### Required Security Configuration

```bash
# JWT Secret Key - MUST be at least 32 characters long
# Generate using: openssl rand -base64 32
JWT_SECRET_KEY=your-secure-32-character-minimum-secret-key

# CORS Configuration - Comma-separated list of allowed origins
# Use specific origins in production, never use * in production
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://staging.yourdomain.com

# AWS Region - Must be valid AWS region format
AWS_DYNAMO_DB_REGION=us-east-1
```

## Security Best Practices

### For Deployment

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use secrets management systems (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Rotate JWT secret keys periodically

2. **CORS Configuration**
   - Set specific allowed origins in production
   - Never use wildcard (`*`) in production environments

3. **HTTPS/TLS**
   - Always use HTTPS in production
   - Configure TLS termination at load balancer or reverse proxy
   - Use TLS 1.2 or higher

4. **Monitoring & Logging**
   - Monitor rate limit violations
   - Set up alerts for suspicious authentication patterns
   - Review logs regularly for security incidents

5. **Database Security**
   - Use IAM roles for DynamoDB access when possible
   - Rotate access keys regularly
   - Enable DynamoDB encryption at rest
   - Use VPC endpoints for private connectivity

### For Development

1. **Local Development**
   - Use `.env.test` for test environments
   - Generate unique JWT secrets for each environment
   - Never use production credentials locally

2. **Code Review**
   - Review all authentication and authorization changes
   - Validate input sanitization
   - Check for sensitive data exposure in logs

## Known Limitations

### CodeQL False Positives
The CodeQL security scanner reports 2 false positives regarding missing rate limiting on account routes. These are false positives because:
- Rate limiting middleware is correctly applied before all authorization middleware
- The scanner is analyzing the final callback function, not the route middleware chain
- Manual verification confirms rate limiting is active on all reported routes

### Remaining npm Vulnerabilities
1 low-severity vulnerability remains in AWS SDK v2:
- **Issue**: JavaScript SDK v2 users should validate region parameter
- **Mitigation**: We've implemented region validation in `DynamoDBClient.ts`
- **Future**: Consider migrating to AWS SDK v3 (requires code changes)

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

Please do not open public issues for security vulnerabilities.

## Security Update Policy

- Security patches are released as soon as possible
- Critical vulnerabilities are addressed within 24-48 hours
- High-priority vulnerabilities within 7 days
- Medium/Low priority vulnerabilities in next regular release

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
