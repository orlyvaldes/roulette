"""
Secure configuration for Flask Roulette Application
"""
import os
import secrets
from datetime import timedelta

class BaseConfig:
    """Base configuration with security defaults"""
    
    # Security Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    WTF_CSRF_TIME_LIMIT = int(os.environ.get('WTF_CSRF_TIME_LIMIT', 3600))
    WTF_CSRF_SSL_STRICT = True
    
    # Session Configuration
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)
    
    # Request Limits
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 1 * 1024 * 1024))  # 1MB
    
    # Application Configuration
    MIN_SEGMENTS = 2
    MAX_SEGMENTS = 20
    MAX_TEXT_LENGTH = 50
    
    # File Upload (if needed in future)
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'txt', 'json'}
    
    # Rate Limiting
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL', 'memory://')
    
    # Logging
    LOG_LEVEL = 'INFO'
    LOG_FILE = 'app.log'

class DevelopmentConfig(BaseConfig):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    ENV = 'development'
    
    # Relaxed security for development
    SESSION_COOKIE_SECURE = False
    WTF_CSRF_SSL_STRICT = False
    
    # Development logging
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(BaseConfig):
    """Production configuration with enhanced security"""
    DEBUG = False
    TESTING = False
    ENV = 'production'
    
    # Strict security for production
    SESSION_COOKIE_SECURE = True
    WTF_CSRF_SSL_STRICT = True
    
    # Production logging
    LOG_LEVEL = 'WARNING'
    
    # Validate required environment variables
    @classmethod
    def init_app(cls, app):
        BaseConfig.init_app(app)
        
        # Ensure SECRET_KEY is set in production
        if not os.environ.get('SECRET_KEY'):
            raise ValueError("SECRET_KEY environment variable must be set in production")

class TestingConfig(BaseConfig):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    ENV = 'testing'
    
    # Disable CSRF for testing
    WTF_CSRF_ENABLED = False
    
    # Use in-memory storage for testing
    RATELIMIT_STORAGE_URL = 'memory://'
    
    # Relaxed security for testing
    SESSION_COOKIE_SECURE = False
    WTF_CSRF_SSL_STRICT = False

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default'])