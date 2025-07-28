"""
Secure Flask Roulette Application
Enhanced with comprehensive security measures
"""

import os
import re
import json
import secrets
import hashlib
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from flask_wtf import FlaskForm, CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from wtforms import StringField, IntegerField, SelectField, HiddenField
from wtforms.validators import DataRequired, Length, NumberRange, Regexp
from werkzeug.middleware.proxy_fix import ProxyFix
from markupsafe import Markup, escape
import redis

# Initialize Flask app with security configurations
app = Flask(__name__)

# Apply proxy fix for proper IP detection behind reverse proxy
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Security Configuration
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', secrets.token_hex(32)),
    WTF_CSRF_TIME_LIMIT=3600,  # 1 hour CSRF token validity
    WTF_CSRF_SSL_STRICT=True,
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(hours=2),
    MAX_CONTENT_LENGTH=1 * 1024 * 1024,  # 1MB max request size
    SEND_FILE_MAX_AGE_DEFAULT=31536000,  # 1 year cache for static files
)

# Application Configuration
app.config.update(
    MIN_SEGMENTS=2,
    MAX_SEGMENTS=20,
    MAX_TEXT_LENGTH=50,
    DEBUG=False,  # Always False for security
    TESTING=False,
)

# Initialize security extensions
csrf = CSRFProtect(app)

# Initialize rate limiter with Redis backend (fallback to memory)
try:
    redis_client = redis.Redis(
        host=os.environ.get('REDIS_HOST', 'localhost'),
        port=int(os.environ.get('REDIS_PORT', 6379)),
        db=0,
        decode_responses=True
    )
    redis_client.ping()  # Test connection
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        storage_uri=f"redis://{os.environ.get('REDIS_HOST', 'localhost')}:{os.environ.get('REDIS_PORT', 6379)}"
    )
except (redis.ConnectionError, redis.RedisError):
    # Fallback to memory storage
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        storage_uri="memory://"
    )

# Predefined safe colors (hex validation)
SAFE_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#D7BDE2', '#A3E4D7',
    '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF', '#FAD5A5'
]

# Security incident logging
security_incidents = []

class RouletteForm(FlaskForm):
    """Secure form for roulette creation with comprehensive validation"""
    
    count = IntegerField(
        'Number of segments',
        validators=[
            DataRequired(message="Number of segments is required"),
            NumberRange(min=2, max=20, message="Number of segments must be between 2 and 20")
        ]
    )
    
    mode = SelectField(
        'Game mode',
        choices=[('normal', 'Normal'), ('elimination', 'Elimination')],
        validators=[DataRequired(message="Game mode is required")]
    )
    
    # Dynamic fields will be added in the view

def create_segment_fields(form, count):
    """Dynamically add segment fields with validation"""
    for i in range(count):
        # Text field with strict validation
        text_field = StringField(
            f'Segment {i+1} text',
            validators=[
                DataRequired(message=f"Text for segment {i+1} is required"),
                Length(min=1, max=50, message="Text must be between 1 and 50 characters"),
                Regexp(
                    r'^[a-zA-Z0-9\s\-_.,!?áéíóúñüÁÉÍÓÚÑÜ]+$',
                    message="Text contains invalid characters"
                )
            ]
        )
        
        # Color field with validation
        color_field = SelectField(
            f'Segment {i+1} color',
            choices=[(color, color) for color in SAFE_COLORS],
            validators=[DataRequired(message=f"Color for segment {i+1} is required")]
        )
        
        setattr(form, f'text_{i}', text_field)
        setattr(form, f'color_{i}', color_field)

def security_headers(response):
    """Add comprehensive security headers"""
    response.headers.update({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data:; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        ),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    })
    return response

@app.after_request
def after_request(response):
    """Apply security headers to all responses"""
    return security_headers(response)

def log_security_incident(incident_type, details):
    """Log security incidents for monitoring"""
    incident = {
        'timestamp': datetime.utcnow().isoformat(),
        'type': incident_type,
        'details': details,
        'ip': get_remote_address(),
        'user_agent': request.headers.get('User-Agent', '')[:200],  # Limit length
        'endpoint': request.endpoint,
        'method': request.method
    }
    
    security_incidents.append(incident)
    
    # Keep only last 1000 incidents to prevent memory issues
    if len(security_incidents) > 1000:
        security_incidents.pop(0)
    
    # Log critical incidents
    if incident_type in ['xss_attempt', 'csrf_failure', 'rate_limit_exceeded']:
        app.logger.warning("SECURITY INCIDENT: %s from %s", incident_type, incident['ip'])

def validate_and_sanitize_input(text):
    """Comprehensive input validation and sanitization"""
    if not text:
        return ""
    
    # Convert to string and limit length
    text = str(text)[:app.config['MAX_TEXT_LENGTH']]
    
    # Check for malicious patterns
    malicious_patterns = [
        r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>',
        r'javascript:',
        r'on\w+\s*=',
        r'data:text\/html',
        r'vbscript:',
        r'expression\s*\(',
        r'<iframe',
        r'<object',
        r'<embed',
        r'<link',
        r'<meta',
    ]
    
    for pattern in malicious_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            log_security_incident('xss_attempt', {'pattern': pattern, 'input': text[:100]})
            # Return sanitized version instead of rejecting
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    # Additional sanitization
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    text = re.sub(r'[^\w\s\-_.,!?áéíóúñüÁÉÍÓÚÑÜ]', '', text)
    
    return text.strip()

def validate_color(color):
    """Validate color is in safe list"""
    if color not in SAFE_COLORS:
        log_security_incident('invalid_color', {'color': color})
        return SAFE_COLORS[0]  # Return default color
    return color

@app.route('/', methods=['GET', 'POST'])
@limiter.limit("30 per minute")
def index():
    """Main route with comprehensive security"""
    form = RouletteForm()
    
    if request.method == 'POST':
        # Validate CSRF token
        try:
            csrf.validate_csrf(form.csrf_token.data)
        except Exception:
            log_security_incident('csrf_failure', {'token': form.csrf_token.data})
            flash('Security token expired. Please try again.', 'error')
            return redirect(url_for('index'))
        
        # Basic form validation
        if not form.validate():
            for field, errors in form.errors.items():
                for error in errors:
                    flash(f'{field}: {error}', 'error')
            return render_template('secure_index.html', form=form)
        
        count = form.count.data
        mode = form.mode.data
        
        # Create dynamic fields for validation
        create_segment_fields(form, count)
        
        # Process segments with validation
        segments = []
        for i in range(count):
            text_key = f'text_{i}'
            color_key = f'color_{i}'
            
            raw_text = request.form.get(text_key, '').strip()
            raw_color = request.form.get(color_key, '')
            
            # Validate and sanitize
            clean_text = validate_and_sanitize_input(raw_text)
            if not clean_text:
                clean_text = f"Option {i+1}"
            
            clean_color = validate_color(raw_color)
            
            segments.append({
                'text': clean_text,
                'color': clean_color,
                'id': i,
                'active': True
            })
        
        # Final validation
        if len(segments) != count:
            flash('Invalid segment data', 'error')
            return redirect(url_for('index'))
        
        # Store segments in session for the roulette page
        from flask import session
        session['segments'] = segments
        session['mode'] = mode
        session.permanent = True
        
        return redirect(url_for('roulette'))
    
    return render_template('secure_index.html', form=form)

@app.route('/roulette')
@limiter.limit("20 per minute")
def roulette():
    """Roulette display page"""
    from flask import session
    
    segments = session.get('segments')
    mode = session.get('mode', 'normal')
    
    if not segments:
        flash('No roulette data found. Please create a new roulette.', 'error')
        return redirect(url_for('index'))
    
    return render_template('secure_roulette.html', segments=segments, mode=mode)

@app.route('/api/spin', methods=['POST'])
@limiter.limit("60 per minute")
def api_spin():
    """Secure API endpoint for roulette spinning"""
    try:
        # Validate content type
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        segments = data.get('segments', [])
        if not segments or not isinstance(segments, list):
            return jsonify({'error': 'Invalid segments data'}), 400
        
        # Validate segments
        if len(segments) < 2 or len(segments) > 20:
            return jsonify({'error': 'Invalid number of segments'}), 400
        
        # Generate secure random result
        import secrets
        winner_index = secrets.randbelow(len(segments))
        
        # Validate winner index
        if winner_index >= len(segments):
            winner_index = 0
        
        winner = segments[winner_index]
        
        return jsonify({
            'winner_index': winner_index,
            'winner': {
                'text': escape(winner.get('text', '')),
                'color': validate_color(winner.get('color', SAFE_COLORS[0])),
                'id': int(winner.get('id', 0))
            },
            'success': True
        })
        
    except Exception as e:
        app.logger.error("Spin API error: %s", str(e))
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health')
@limiter.limit("10 per minute")
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

# Error handlers with security considerations
@app.errorhandler(400)
def bad_request(error):
    """Handle bad requests securely"""
    return render_template('error.html', 
                         error_code=400, 
                         error_message="Bad Request"), 400

@app.errorhandler(403)
def forbidden(error):
    """Handle forbidden requests"""
    return render_template('error.html', 
                         error_code=403, 
                         error_message="Forbidden"), 403

@app.errorhandler(404)
def not_found(error):
    """Handle not found errors"""
    return render_template('error.html', 
                         error_code=404, 
                         error_message="Page Not Found"), 404

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle large request errors"""
    log_security_incident('large_request', {'size': request.content_length})
    return render_template('error.html', 
                         error_code=413, 
                         error_message="Request Too Large"), 413

@app.errorhandler(429)
def rate_limit_exceeded(error):
    """Handle rate limit exceeded"""
    log_security_incident('rate_limit_exceeded', {'limit': str(error.description)})
    return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429

@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors"""
    return render_template('error.html', 
                         error_code=500, 
                         error_message="Internal Server Error"), 500

# Security monitoring endpoint (admin only)
@app.route('/admin/security-report')
@limiter.limit("5 per minute")
def security_report():
    """Security monitoring endpoint - should be protected in production"""
    # In production, add proper authentication here
    if not app.debug:
        return jsonify({'error': 'Access denied'}), 403
    
    recent_incidents = [
        incident for incident in security_incidents
        if datetime.fromisoformat(incident['timestamp']) > 
           datetime.utcnow() - timedelta(hours=24)
    ]
    
    return jsonify({
        'total_incidents': len(security_incidents),
        'recent_incidents': len(recent_incidents),
        'incidents': recent_incidents[-10:],  # Last 10 incidents
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    # Production-ready startup
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    if debug:
        app.logger.warning("Running in debug mode - not suitable for production!")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )