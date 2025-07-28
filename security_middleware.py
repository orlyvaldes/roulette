"""
Security middleware for Flask Roulette Application
"""
import re
import time
from functools import wraps
from flask import request, jsonify, current_app
from werkzeug.exceptions import TooManyRequests

class SecurityMiddleware:
    """Comprehensive security middleware"""
    
    def __init__(self, app=None):
        self.app = app
        self.blocked_ips = set()
        self.suspicious_patterns = [
            r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>',
            r'javascript:',
            r'on\w+\s*=',
            r'data:text\/html',
            r'vbscript:',
            r'expression\s*\(',
            r'union\s+select',
            r'drop\s+table',
            r'insert\s+into',
            r'delete\s+from',
            r'<iframe',
            r'<object',
            r'<embed',
        ]
        
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize security middleware with Flask app"""
        self.app = app
        app.before_request(self.before_request)
        app.after_request(self.after_request)
    
    def before_request(self):
        """Security checks before processing request"""
        # Check if IP is blocked
        client_ip = self.get_client_ip()
        if client_ip in self.blocked_ips:
            current_app.logger.warning(f"Blocked IP attempted access: {client_ip}")
            return jsonify({'error': 'Access denied'}), 403
        
        # Validate request size
        if request.content_length and request.content_length > current_app.config.get('MAX_CONTENT_LENGTH', 1024*1024):
            current_app.logger.warning(f"Large request from {client_ip}: {request.content_length} bytes")
            return jsonify({'error': 'Request too large'}), 413
        
        # Check for malicious patterns in URL
        if self.contains_malicious_patterns(request.url):
            self.log_security_incident('malicious_url', {
                'url': request.url,
                'ip': client_ip
            })
            return jsonify({'error': 'Invalid request'}), 400
        
        # Check User-Agent
        user_agent = request.headers.get('User-Agent', '')
        if self.is_suspicious_user_agent(user_agent):
            self.log_security_incident('suspicious_user_agent', {
                'user_agent': user_agent,
                'ip': client_ip
            })
        
        # Validate form data if present
        if request.method == 'POST' and request.form:
            for key, value in request.form.items():
                if self.contains_malicious_patterns(str(value)):
                    self.log_security_incident('malicious_form_data', {
                        'field': key,
                        'value': str(value)[:100],
                        'ip': client_ip
                    })
                    # Don't block, just log and sanitize
    
    def after_request(self, response):
        """Security headers and post-processing"""
        # Add security headers
        response.headers.update({
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': self.get_csp_header(),
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        })
        
        # Remove server information
        response.headers.pop('Server', None)
        
        return response
    
    def get_client_ip(self):
        """Get real client IP address"""
        # Check for forwarded headers (when behind proxy)
        forwarded_ips = request.headers.get('X-Forwarded-For', '')
        if forwarded_ips:
            return forwarded_ips.split(',')[0].strip()
        
        real_ip = request.headers.get('X-Real-IP')
        if real_ip:
            return real_ip
        
        return request.remote_addr
    
    def contains_malicious_patterns(self, text):
        """Check if text contains malicious patterns"""
        if not text:
            return False
        
        text_lower = text.lower()
        for pattern in self.suspicious_patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        
        return False
    
    def is_suspicious_user_agent(self, user_agent):
        """Check for suspicious user agents"""
        if not user_agent:
            return True
        
        suspicious_agents = [
            'sqlmap',
            'nikto',
            'nmap',
            'masscan',
            'curl',  # Be careful with this one
            'wget',
            'python-requests',
            'bot',
            'crawler',
            'spider'
        ]
        
        user_agent_lower = user_agent.lower()
        return any(agent in user_agent_lower for agent in suspicious_agents)
    
    def get_csp_header(self):
        """Generate Content Security Policy header"""
        return (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data:; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
    
    def log_security_incident(self, incident_type, details):
        """Log security incidents"""
        incident = {
            'timestamp': time.time(),
            'type': incident_type,
            'details': details,
            'endpoint': request.endpoint,
            'method': request.method
        }
        
        current_app.logger.warning(f"SECURITY INCIDENT: {incident_type} - {details}")
        
        # In a real application, you might want to:
        # - Store incidents in a database
        # - Send alerts to security team
        # - Implement automatic IP blocking
        # - Integrate with SIEM systems
    
    def block_ip(self, ip_address, reason="Security violation"):
        """Block an IP address"""
        self.blocked_ips.add(ip_address)
        current_app.logger.warning(f"IP blocked: {ip_address} - Reason: {reason}")
    
    def unblock_ip(self, ip_address):
        """Unblock an IP address"""
        self.blocked_ips.discard(ip_address)
        current_app.logger.info(f"IP unblocked: {ip_address}")

def require_https(f):
    """Decorator to require HTTPS in production"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if current_app.config.get('ENV') == 'production':
            if not request.is_secure:
                return jsonify({'error': 'HTTPS required'}), 400
        return f(*args, **kwargs)
    return decorated_function

def validate_json_input(required_fields=None):
    """Decorator to validate JSON input"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({'error': 'Content-Type must be application/json'}), 400
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No JSON data provided'}), 400
            
            if required_fields:
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    return jsonify({
                        'error': 'Missing required fields',
                        'missing_fields': missing_fields
                    }), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator