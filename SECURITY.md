# Security Guidelines

## 🔐 Best Practices

### Environment Variables
- Never commit `.env` files
- Use `.env.example` templates
- Rotate API keys regularly
- Use strong, unique passwords

### API Keys
- Claude: Keep in backend only
- GitHub: Use minimal required scopes
- Rotate keys monthly
- Never share in code/logs

### HTTPS
- Always use HTTPS in production
- Use security headers
- Enable CORS only for trusted domains
- Validate all inputs

### Authentication
- Implement rate limiting
- Add request signing
- Use API keys for service-to-service
- Never log sensitive data

### Database
- Use parameterized queries
- Encrypt sensitive data
- Regular backups
- Restricted access

## 🛡️ Deployment Security

### Railway
- Use private deployments
- Enable HTTPS
- Set environment variables securely
- Monitor logs for suspicious activity

### Vercel
- Use environment variables
- Enable preview protection
- Set up branch protection
- Use GitHub integration securely

### Docker
- Use base images from official sources
- Scan images for vulnerabilities
- Use non-root user
- Minimal layers for attack surface

## 🔍 Code Security

### Dependencies
- Keep dependencies updated
- Use `npm audit` and `pip audit`
- Review new package permissions
- Monitor security advisories

### Code Review
- Peer review all code
- Check for security issues
- Test edge cases
- Validate user input

### Logging
- Never log API keys or passwords
- Don't log PII
- Use appropriate log levels
- Secure log storage

## 📋 Security Checklist

- [ ] API keys in environment variables
- [ ] HTTPS enabled in production
- [ ] CORS configured correctly
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Logging doesn't leak secrets
- [ ] Dependencies up to date
- [ ] Security headers set
- [ ] Database backups automated
- [ ] Access controls implemented

## 🚨 Security Incident Response

If you discover a security vulnerability:

1. **Don't open a public issue**
2. **Email security team**: security@example.com
3. **Include**:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## 📞 Security Contact

Email: security@example.com
Response time: 24 hours
