# 🔒 Secure Flask Roulette - Security Documentation

## Overview

This is a comprehensive security upgrade of the Flask Roulette application, implementing industry-standard security practices to protect against common web vulnerabilities.

## 🛡️ Security Features Implemented

### 1. Cross-Site Scripting (XSS) Prevention
- **Input Sanitization**: All user inputs are sanitized using regex patterns and HTML escaping
- **Output Encoding**: All dynamic content is properly escaped in templates using `|e` filter
- **Content Security Policy**: Strict CSP headers prevent inline script execution
- **Validation**: Client-side and server-side input validation with pattern matching

### 2. Cross-Site Request Forgery (CSRF) Protection
- **Flask-WTF Integration**: CSRF tokens on all forms
- **Token Validation**: Server-side CSRF token verification
- **Time-Limited Tokens**: CSRF tokens expire after 1 hour
- **Secure Token Generation**: Cryptographically secure token generation

### 3. Input Validation & Sanitization
- **Length Limits**: Maximum 50 characters for text inputs
- **Pattern Validation**: Regex patterns to allow only safe characters
- **Color Validation**: Predefined safe color palette
- **SQL Injection Prevention**: Parameterized queries and input sanitization
- **File Upload Protection**: Restricted file types and size limits

### 4. Rate Limiting
- **Flask-Limiter**: Redis-backed rate limiting
- **Endpoint-Specific Limits**: Different limits for different endpoints
- **IP-Based Tracking**: Rate limiting per IP address
- **Graceful Degradation**: Memory fallback if Redis unavailable

### 5. Security Headers
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Browser XSS protection
- **Strict-Transport-Security**: Forces HTTPS connections
- **Content-Security-Policy**: Prevents code injection
- **Referrer-Policy**: Controls referrer information

### 6. Session Security
- **Secure Cookies**: HTTPOnly and Secure flags
- **SameSite Protection**: CSRF protection via SameSite attribute
- **Session Timeout**: Automatic session expiration
- **Secure Session Storage**: Server-side session management

### 7. Error Handling
- **Custom Error Pages**: No sensitive information disclosure
- **Security Logging**: All security incidents logged
- **Graceful Degradation**: Proper error handling without crashes
- **Rate Limit Responses**: Proper 429 responses

### 8. Production Security
- **Debug Mode Disabled**: No debug information in production
- **Environment Variables**: Sensitive data in environment variables
- **Secret Key Management**: Cryptographically secure secret keys
- **HTTPS Enforcement**: SSL/TLS configuration
- **Reverse Proxy Support**: Proper IP detection behind proxies

## 🚀 Quick Start

### Development Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env

# Run development server
python secure_app.py
```

### Production Deployment
```bash
# Run deployment script
python deploy.py

# Follow the generated instructions
./start_production.sh
```

## 📁 File Structure

```
secure-roulette/
├── secure_app.py              # Main secure application
├── secure_config.py           # Security configuration
├── security_middleware.py     # Security middleware
├── deploy.py                  # Production deployment script
├── requirements.txt           # Python dependencies
├── .env.example              # Environment template
├── templates/
│   ├── secure_index.html     # Secure main page
│   ├── secure_roulette.html  # Secure roulette page
│   └── error.html            # Error page template
└── static/                   # Static assets
```

## 🔧 Configuration

### Environment Variables
```bash
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-super-secret-key-here

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Security Configuration
WTF_CSRF_TIME_LIMIT=3600
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
```

### Rate Limiting Configuration
- Main page: 30 requests per minute
- API endpoints: 60 requests per minute
- Security report: 5 requests per minute

### Input Validation Rules
- Text length: 1-50 characters
- Allowed characters: Letters, numbers, spaces, basic punctuation
- Segments: 2-20 segments maximum
- Colors: Predefined safe palette only

## 🛠️ Security Middleware

The application includes comprehensive security middleware that:

- Blocks malicious IP addresses
- Detects and logs security incidents
- Validates request patterns
- Implements automatic threat detection
- Provides real-time security monitoring

## 📊 Security Monitoring

### Incident Logging
All security incidents are logged with:
- Timestamp
- Incident type
- Client IP address
- User agent
- Request details

### Security Report Endpoint
Access security reports at `/admin/security-report` (development only):
```json
{
  "total_incidents": 0,
  "recent_incidents": 0,
  "incidents": [],
  "timestamp": "2024-01-01T00:00:00"
}
```

## 🔍 Security Testing

### Manual Testing Checklist
- [ ] XSS injection attempts
- [ ] CSRF token validation
- [ ] Rate limiting functionality
- [ ] Input validation bypass attempts
- [ ] SQL injection attempts
- [ ] File upload security
- [ ] Session management
- [ ] Error handling

### Automated Testing
```bash
# Install testing dependencies
pip install pytest pytest-flask

# Run security tests
pytest tests/test_security.py
```

## 🚨 Security Incident Response

### Automatic Responses
1. **Malicious Input Detection**: Log and sanitize
2. **Rate Limit Exceeded**: Temporary IP blocking
3. **CSRF Failure**: Session invalidation
4. **XSS Attempt**: Request blocking and logging

### Manual Response Procedures
1. **Identify**: Monitor logs for security incidents
2. **Contain**: Block malicious IPs if necessary
3. **Investigate**: Analyze attack patterns
4. **Recover**: Restore normal operations
5. **Learn**: Update security measures

## 📋 Production Checklist

### Before Deployment
- [ ] Generate secure SECRET_KEY
- [ ] Configure Redis server
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Test all security features
- [ ] Review firewall rules
- [ ] Update all dependencies

### After Deployment
- [ ] Verify HTTPS is working
- [ ] Test rate limiting
- [ ] Verify CSRF protection
- [ ] Check security headers
- [ ] Monitor error logs
- [ ] Test backup procedures
- [ ] Verify monitoring alerts

## 🔄 Maintenance

### Regular Tasks
- Update dependencies monthly
- Review security logs weekly
- Rotate secret keys quarterly
- Security audit annually
- Backup verification monthly

### Monitoring
- Set up log monitoring
- Configure security alerts
- Monitor rate limiting effectiveness
- Track security incidents
- Performance monitoring

## 📞 Support

For security issues or questions:
1. Check the security logs first
2. Review this documentation
3. Test in development environment
4. Contact security team if needed

## 🔗 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/2.3.x/security/)
- [CSP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Security Headers](https://securityheaders.com/)

---

**⚠️ Important**: This security implementation provides strong protection against common web vulnerabilities, but security is an ongoing process. Regular updates, monitoring, and security audits are essential for maintaining a secure application.