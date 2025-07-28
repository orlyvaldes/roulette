#!/usr/bin/env python3
"""
Production deployment script for Secure Flask Roulette
"""
import os
import sys
import secrets
import subprocess
from pathlib import Path

def generate_secret_key():
    """Generate a secure secret key"""
    return secrets.token_hex(32)

def create_env_file():
    """Create production .env file"""
    env_content = f"""# Production Environment Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY={generate_secret_key()}

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Server Configuration
PORT=5000

# Security Configuration
WTF_CSRF_TIME_LIMIT=3600
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True

# Application Limits
MAX_CONTENT_LENGTH=1048576
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Created .env file with secure configuration")

def install_dependencies():
    """Install Python dependencies"""
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True, capture_output=True, text=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False
    return True

def setup_redis():
    """Setup Redis (instructions)"""
    print("""
🔧 Redis Setup Required:
   
   Ubuntu/Debian:
   sudo apt update
   sudo apt install redis-server
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   
   CentOS/RHEL:
   sudo yum install redis
   sudo systemctl start redis
   sudo systemctl enable redis
   
   macOS:
   brew install redis
   brew services start redis
   
   Docker:
   docker run -d --name redis -p 6379:6379 redis:alpine
""")

def setup_nginx():
    """Generate Nginx configuration"""
    nginx_config = """
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files
    location /static {
        alias /path/to/your/app/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Block common attack patterns
    location ~* \.(php|asp|aspx|jsp)$ {
        return 444;
    }
    
    location ~* /\. {
        deny all;
    }
}
"""
    
    with open('nginx.conf.example', 'w') as f:
        f.write(nginx_config)
    
    print("✅ Created nginx.conf.example")

def setup_systemd():
    """Generate systemd service file"""
    service_content = """[Unit]
Description=Secure Flask Roulette
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/app
Environment=PATH=/path/to/your/app/venv/bin
ExecStart=/path/to/your/app/venv/bin/python secure_app.py
Restart=always
RestartSec=10

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/path/to/your/app

[Install]
WantedBy=multi-user.target
"""
    
    with open('roulette.service.example', 'w') as f:
        f.write(service_content)
    
    print("✅ Created roulette.service.example")

def setup_gunicorn():
    """Generate Gunicorn configuration"""
    gunicorn_config = """# Gunicorn configuration for production
import multiprocessing

# Server socket
bind = "127.0.0.1:5000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "/var/log/roulette/access.log"
errorlog = "/var/log/roulette/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "secure_roulette"

# Server mechanics
daemon = False
pidfile = "/var/run/roulette.pid"
user = "www-data"
group = "www-data"
tmp_upload_dir = None

# SSL (if terminating SSL at Gunicorn level)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"
"""
    
    with open('gunicorn.conf.py', 'w') as f:
        f.write(gunicorn_config)
    
    print("✅ Created gunicorn.conf.py")

def create_startup_script():
    """Create production startup script"""
    startup_script = """#!/bin/bash
# Production startup script for Secure Flask Roulette

set -e

echo "🚀 Starting Secure Flask Roulette in production mode..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Run deploy.py first."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Check Redis connection
echo "🔍 Checking Redis connection..."
python -c "import redis; r = redis.Redis(); r.ping(); print('✅ Redis connected')" || {
    echo "❌ Redis not available. Please install and start Redis."
    exit 1
}

# Run with Gunicorn
echo "🌟 Starting application with Gunicorn..."
exec gunicorn --config gunicorn.conf.py secure_app:app
"""
    
    with open('start_production.sh', 'w') as f:
        f.write(startup_script)
    
    os.chmod('start_production.sh', 0o755)
    print("✅ Created start_production.sh")

def security_checklist():
    """Display security checklist"""
    checklist = """
🔒 SECURITY CHECKLIST FOR PRODUCTION:

✅ Application Security:
   □ SECRET_KEY is randomly generated and secure
   □ Debug mode is disabled (FLASK_DEBUG=False)
   □ CSRF protection is enabled
   □ Input validation and sanitization implemented
   □ Rate limiting configured
   □ Security headers added

✅ Server Security:
   □ Server is updated with latest security patches
   □ Firewall is configured (only ports 22, 80, 443 open)
   □ SSH key authentication enabled (password auth disabled)
   □ Non-root user for application
   □ File permissions properly set

✅ SSL/TLS:
   □ Valid SSL certificate installed
   □ HTTPS redirect configured
   □ Strong cipher suites configured
   □ HSTS header enabled

✅ Database/Redis:
   □ Redis password authentication enabled
   □ Redis bound to localhost only
   □ Regular backups configured

✅ Monitoring:
   □ Log monitoring setup
   □ Error tracking configured
   □ Security incident alerting
   □ Performance monitoring

✅ Backup & Recovery:
   □ Regular automated backups
   □ Backup restoration tested
   □ Disaster recovery plan

⚠️  IMPORTANT NOTES:
   - Change default passwords
   - Regularly update dependencies
   - Monitor security logs
   - Implement intrusion detection
   - Regular security audits
"""
    print(checklist)

def main():
    """Main deployment function"""
    print("🔧 Secure Flask Roulette - Production Deployment Setup")
    print("=" * 60)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher required")
        sys.exit(1)
    
    # Create necessary files
    if not os.path.exists('.env'):
        create_env_file()
    else:
        print("⚠️  .env file already exists, skipping creation")
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Setup configuration files
    setup_nginx()
    setup_systemd()
    setup_gunicorn()
    create_startup_script()
    
    # Setup instructions
    setup_redis()
    
    print("\n" + "=" * 60)
    print("✅ Deployment setup completed!")
    print("\n📋 Next steps:")
    print("1. Install and configure Redis")
    print("2. Configure Nginx with the provided example")
    print("3. Set up SSL certificates")
    print("4. Configure systemd service")
    print("5. Run security checklist")
    print("6. Start the application: ./start_production.sh")
    
    # Show security checklist
    security_checklist()

if __name__ == '__main__':
    main()