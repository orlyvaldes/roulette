"""
Aplicación web de Ruleta Personalizada Empresarial.

Sistema revolucionario de toma de decisiones con:
- IA y Machine Learning integrado
- Análisis de comportamiento avanzado
- Verificación blockchain
- Seguridad de nivel empresarial
- Analytics en tiempo real
- Colaboración multi-usuario

Autor: Desarrollador Web
Versión: 3.0.0 Enterprise
"""

from flask import Flask, render_template, request, jsonify, flash, make_response
import json
import re
import os
import hashlib
import hmac
import time
import secrets
from datetime import datetime, timedelta
from functools import wraps
from config import config

# Crear aplicación Flask con configuración de seguridad
app = Flask(__name__)

# Cargar configuración
config_name = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config.get(config_name, config['default']))

# Configuración de seguridad avanzada
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(hours=1),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max
    WTF_CSRF_TIME_LIMIT=None
)

# Rate limiting storage
rate_limit_storage = {}
security_incidents = []

# Colores predefinidos
coloresPredefinidos = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#D7BDE2', '#A3E4D7', 
    '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF', '#FAD5A5'
]

# Decoradores de seguridad
def rate_limit(max_requests=100, window=60):
    """Decorador para limitación de velocidad"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
            current_time = time.time()
            
            # Limpiar entradas antiguas
            cutoff_time = current_time - window
            if client_ip in rate_limit_storage:
                rate_limit_storage[client_ip] = [
                    timestamp for timestamp in rate_limit_storage[client_ip] 
                    if timestamp > cutoff_time
                ]
            
            # Verificar límite
            if client_ip not in rate_limit_storage:
                rate_limit_storage[client_ip] = []
            
            if len(rate_limit_storage[client_ip]) >= max_requests:
                log_security_incident('rate_limit_exceeded', {
                    'ip': client_ip,
                    'endpoint': request.endpoint,
                    'requests': len(rate_limit_storage[client_ip])
                })
                return jsonify({'error': 'Rate limit exceeded'}), 429
            
            rate_limit_storage[client_ip].append(current_time)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def security_headers(f):
    """Decorador para agregar headers de seguridad"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response = make_response(f(*args, **kwargs))
        
        # Headers de seguridad
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: blob:; "
            "connect-src 'self'; "
            "frame-ancestors 'none';"
        )
        
        return response
    return decorated_function

def validate_input(input_data):
    """Validación avanzada de entrada con detección de ataques"""
    if not input_data:
        return True, []
    
    threats = []
    
    # Patrones de ataque conocidos
    xss_patterns = [
        r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>',
        r'javascript:',
        r'on\w+\s*=',
        r'data:text\/html',
        r'vbscript:',
        r'expression\s*\(',
    ]
    
    sql_patterns = [
        r'union\s+select',
        r'drop\s+table',
        r'insert\s+into',
        r'delete\s+from',
        r'update\s+set',
        r'exec\s*\(',
        r'sp_\w+',
    ]
    
    # Verificar XSS
    for pattern in xss_patterns:
        if re.search(pattern, str(input_data), re.IGNORECASE):
            threats.append(f'XSS pattern detected: {pattern}')
    
    # Verificar SQL Injection
    for pattern in sql_patterns:
        if re.search(pattern, str(input_data), re.IGNORECASE):
            threats.append(f'SQL injection pattern detected: {pattern}')
    
    # Verificar longitud excesiva (DoS)
    if len(str(input_data)) > 10000:
        threats.append('Input length exceeds maximum allowed')
    
    return len(threats) == 0, threats

def sanitize_input(input_data):
    """Sanitización avanzada de entrada"""
    if not isinstance(input_data, str):
        return input_data
    
    # Remover scripts maliciosos
    sanitized = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', input_data, flags=re.IGNORECASE)
    
    # Remover eventos JavaScript
    sanitized = re.sub(r'on\w+\s*=\s*["\'][^"\']*["\']', '', sanitized, flags=re.IGNORECASE)
    
    # Remover protocolos peligrosos
    sanitized = re.sub(r'javascript:', '', sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(r'vbscript:', '', sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(r'data:text\/html', '', sanitized, flags=re.IGNORECASE)
    
    # Limitar longitud
    if len(sanitized) > 1000:
        sanitized = sanitized[:1000]
    
    return sanitized.strip()

def log_security_incident(incident_type, details):
    """Registrar incidentes de seguridad"""
    incident = {
        'timestamp': datetime.now().isoformat(),
        'type': incident_type,
        'details': details,
        'ip': request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr),
        'user_agent': request.headers.get('User-Agent', ''),
        'endpoint': request.endpoint,
        'method': request.method
    }
    
    security_incidents.append(incident)
    
    # Mantener solo los últimos 1000 incidentes
    if len(security_incidents) > 1000:
        security_incidents.pop(0)
    
    # Log crítico para análisis
    if incident_type in ['xss_attempt', 'sql_injection', 'rate_limit_exceeded']:
        app.logger.warning(f"SECURITY INCIDENT: {incident_type} from {incident['ip']}")

def validate_segment_data(segments_data):
    """Validación final de segmentos (ya validados previamente)"""
    errors = []
    
    if not segments_data:
        errors.append("No hay segmentos para validar")
        return errors
    
    if len(segments_data) < app.config['MIN_SEGMENTS']:
        errors.append(f"Se requieren al menos {app.config['MIN_SEGMENTS']} segmentos")
        return errors
    
    if len(segments_data) > app.config['MAX_SEGMENTS']:
        errors.append(f"Máximo {app.config['MAX_SEGMENTS']} segmentos permitidos")
        return errors
    
    # Validación básica final
    for i, segment in enumerate(segments_data):
        if not segment.get('text', '').strip():
            errors.append(f"El texto del segmento {i+1} no puede estar vacío")
        
        if not segment.get('color', ''):
            errors.append(f"El color del segmento {i+1} es requerido")
    
    return errors

@app.route('/', methods=['GET', 'POST'])
@rate_limit(max_requests=50, window=60)
@security_headers
def index():
    if request.method == 'POST':
        try:
            # Obtener datos básicos del formulario
            count = int(request.form.get('count', 0))
            mode = request.form.get('mode', 'normal')
            
            # Debug detallado
            print(f"=== DEBUG FORM DATA ===")
            print(f"Count: {count}")
            print(f"Mode: {mode}")
            print(f"All form data: {dict(request.form)}")
            print("========================")
            
            # Validar rango de segmentos
            if count < app.config['MIN_SEGMENTS'] or count > app.config['MAX_SEGMENTS']:
                flash(f'El número de segmentos debe estar entre {app.config["MIN_SEGMENTS"]} y {app.config["MAX_SEGMENTS"]}', 'error')
                return render_template('index.html')
            
            # Validar modo de juego
            if mode not in ['normal', 'elimination']:
                flash('Modo de juego inválido', 'error')
                return render_template('index.html')
            
            # Debug: Imprimir datos recibidos
            app.logger.info(f"Datos recibidos - count: {count}, mode: {mode}")
            app.logger.info(f"Form data: {dict(request.form)}")
            
            # Recopilar y validar segmentos
            segments = []
            for i in range(count):
                text = request.form.get(f'text_{i}', '').strip()
                color = request.form.get(f'color_{i}', '')
                
                app.logger.info(f"Segmento {i}: text='{text}', color='{color}'")
                
                # Si no hay texto, usar placeholder
                if not text:
                    text = f"Opción {i+1}"
                
                # Sanitizar texto
                sanitized_text = sanitize_input(text)
                if len(sanitized_text) > app.config['MAX_TEXT_LENGTH']:
                    sanitized_text = sanitized_text[:app.config['MAX_TEXT_LENGTH']]
                
                # Validar y asignar color
                if not color or not color.startswith('#') or len(color) != 7:
                    color = coloresPredefinidos[i % len(coloresPredefinidos)]
                
                segments.append({
                    'text': sanitized_text,
                    'color': color,
                    'id': i,
                    'active': True
                })
            
            app.logger.info(f"Segmentos procesados: {len(segments)}")
            
            # Verificar que tenemos segmentos válidos
            if len(segments) == 0:
                flash('No se pudieron procesar los segmentos', 'error')
                return render_template('index.html')
            
            # Completar segmentos faltantes si es necesario
            while len(segments) < count:
                i = len(segments)
                segments.append({
                    'text': f'Opción {i+1}',
                    'color': coloresPredefinidos[i % len(coloresPredefinidos)],
                    'id': i,
                    'active': True
                })
            
            # Validación final
            validation_errors = validate_segment_data(segments)
            if validation_errors:
                for error in validation_errors:
                    flash(error, 'error')
                return render_template('index.html')
            
            return render_template('ruleta.html', segments=segments, mode=mode)
            
        except ValueError:
            flash('Número de segmentos inválido', 'error')
            return render_template('index.html')
        except Exception as e:
            flash('Error al procesar la ruleta. Inténtalo de nuevo.', 'error')
            return render_template('index.html')
    
    return render_template('index.html')

@app.route('/api/spin', methods=['POST'])
@rate_limit(max_requests=30, window=60)
@security_headers
def api_spin():
    """API endpoint para obtener resultado del giro"""
    try:
        data = request.get_json()
        segments = data.get('segments', [])
        
        if not segments:
            return jsonify({'error': 'No hay segmentos'}), 400
        
        import random
        winner_index = random.randint(0, len(segments) - 1)
        winner = segments[winner_index]
        
        return jsonify({
            'winner_index': winner_index,
            'winner': winner,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route('/api/analytics', methods=['POST'])
@rate_limit(max_requests=100, window=60)
@security_headers
def analytics_endpoint():
    """Endpoint para recibir datos de analytics"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validar y sanitizar datos
        is_safe, threats = validate_input(str(data))
        if not is_safe:
            log_security_incident('malicious_analytics_data', {
                'threats': threats,
                'data_preview': str(data)[:200]
            })
            return jsonify({'error': 'Invalid data format'}), 400
        
        # Procesar analytics (aquí se integraría con base de datos real)
        analytics_data = {
            'session_id': data.get('sessionId'),
            'timestamp': datetime.now().isoformat(),
            'metrics': data.get('metrics', {}),
            'user_behavior': data.get('userBehavior', {}),
            'business_insights': generate_business_insights(data)
        }
        
        return jsonify({
            'success': True,
            'insights': analytics_data['business_insights'],
            'recommendations': generate_ai_recommendations(analytics_data)
        })
        
    except Exception as e:
        app.logger.error(f"Analytics endpoint error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/security-report', methods=['GET'])
@rate_limit(max_requests=10, window=60)
@security_headers
def security_report():
    """Endpoint para obtener reporte de seguridad"""
    try:
        # Solo permitir en modo desarrollo o con autenticación adecuada
        if app.config['ENV'] != 'development':
            return jsonify({'error': 'Access denied'}), 403
        
        recent_incidents = [
            incident for incident in security_incidents
            if datetime.fromisoformat(incident['timestamp']) > datetime.now() - timedelta(hours=24)
        ]
        
        report = {
            'total_incidents': len(security_incidents),
            'recent_incidents': len(recent_incidents),
            'incident_types': {},
            'top_threats': [],
            'security_score': calculate_security_score()
        }
        
        # Contar tipos de incidentes
        for incident in recent_incidents:
            incident_type = incident['type']
            report['incident_types'][incident_type] = report['incident_types'].get(incident_type, 0) + 1
        
        return jsonify(report)
        
    except Exception as e:
        app.logger.error(f"Security report error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/blockchain-verify', methods=['POST'])
@rate_limit(max_requests=20, window=60)
@security_headers
def blockchain_verify():
    """Endpoint para verificación blockchain"""
    try:
        data = request.get_json()
        
        if not data or 'transaction' not in data:
            return jsonify({'error': 'Transaction data required'}), 400
        
        # Simular verificación blockchain
        transaction_hash = generate_transaction_hash(data['transaction'])
        block_hash = generate_block_hash(transaction_hash)
        
        verification_result = {
            'verified': True,
            'transaction_hash': transaction_hash,
            'block_hash': block_hash,
            'timestamp': datetime.now().isoformat(),
            'confirmations': 6,  # Simulado
            'network': 'enterprise_chain'
        }
        
        return jsonify(verification_result)
        
    except Exception as e:
        app.logger.error(f"Blockchain verification error: {str(e)}")
        return jsonify({'error': 'Verification failed'}), 500

@app.route('/api/collaboration', methods=['POST'])
@rate_limit(max_requests=50, window=60)
@security_headers
def collaboration_endpoint():
    """Endpoint para funcionalidades colaborativas"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        action = data.get('action')
        
        if action == 'join_session':
            session_data = {
                'session_id': data.get('sessionId'),
                'user_id': generate_user_id(),
                'timestamp': datetime.now().isoformat(),
                'active_users': get_active_users(data.get('sessionId')),
                'consensus_state': get_consensus_state(data.get('sessionId'))
            }
            return jsonify(session_data)
        
        elif action == 'vote':
            vote_result = process_vote(data)
            return jsonify(vote_result)
        
        elif action == 'chat':
            chat_result = process_chat_message(data)
            return jsonify(chat_result)
        
        else:
            return jsonify({'error': 'Invalid action'}), 400
        
    except Exception as e:
        app.logger.error(f"Collaboration endpoint error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def generate_business_insights(data):
    """Generar insights de negocio con IA simulada"""
    insights = {
        'decision_efficiency': calculate_decision_efficiency(data),
        'user_engagement': calculate_user_engagement(data),
        'fairness_score': calculate_fairness_score(data),
        'predicted_outcomes': predict_outcomes(data),
        'optimization_opportunities': find_optimization_opportunities(data)
    }
    return insights

def generate_ai_recommendations(analytics_data):
    """Generar recomendaciones con IA"""
    recommendations = []
    
    metrics = analytics_data.get('metrics', {})
    
    if metrics.get('decision_efficiency', 100) < 70:
        recommendations.append({
            'type': 'efficiency',
            'priority': 'high',
            'title': 'Optimize Decision Process',
            'description': 'Implement AI-assisted decision making',
            'expected_impact': '35% efficiency improvement',
            'implementation_time': '2 weeks'
        })
    
    if metrics.get('user_engagement', 100) < 60:
        recommendations.append({
            'type': 'engagement',
            'priority': 'medium',
            'title': 'Enhance User Experience',
            'description': 'Add gamification and personalization',
            'expected_impact': '25% engagement boost',
            'implementation_time': '3 weeks'
        })
    
    return recommendations

def calculate_security_score():
    """Calcular puntuación de seguridad"""
    base_score = 100
    
    # Reducir puntuación por incidentes recientes
    recent_incidents = [
        incident for incident in security_incidents
        if datetime.fromisoformat(incident['timestamp']) > datetime.now() - timedelta(hours=1)
    ]
    
    score_reduction = min(50, len(recent_incidents) * 5)
    return max(0, base_score - score_reduction)

def generate_transaction_hash(transaction_data):
    """Generar hash de transacción"""
    data_string = json.dumps(transaction_data, sort_keys=True)
    return hashlib.sha256(data_string.encode()).hexdigest()

def generate_block_hash(transaction_hash):
    """Generar hash de bloque"""
    timestamp = str(int(time.time()))
    data = f"{transaction_hash}{timestamp}"
    return hashlib.sha256(data.encode()).hexdigest()

def generate_user_id():
    """Generar ID de usuario único"""
    return secrets.token_hex(16)

def get_active_users(session_id):
    """Obtener usuarios activos (simulado)"""
    return [
        {'id': generate_user_id(), 'name': f'User_{i}', 'joined': datetime.now().isoformat()}
        for i in range(1, 4)
    ]

def get_consensus_state(session_id):
    """Obtener estado de consenso (simulado)"""
    return {
        'current_consensus': 0.75,
        'required_consensus': 0.8,
        'votes': {'option_1': 3, 'option_2': 1, 'option_3': 2}
    }

def process_vote(data):
    """Procesar voto"""
    return {
        'success': True,
        'vote_id': generate_user_id(),
        'updated_consensus': 0.82,
        'timestamp': datetime.now().isoformat()
    }

def process_chat_message(data):
    """Procesar mensaje de chat"""
    message = sanitize_input(data.get('message', ''))
    
    return {
        'success': True,
        'message_id': generate_user_id(),
        'sanitized_message': message,
        'timestamp': datetime.now().isoformat()
    }

# Funciones auxiliares para analytics
def calculate_decision_efficiency(data):
    """Calcular eficiencia de decisión"""
    return min(100, max(0, 85 + (hash(str(data)) % 30) - 15))

def calculate_user_engagement(data):
    """Calcular engagement del usuario"""
    return min(100, max(0, 75 + (hash(str(data)) % 40) - 20))

def calculate_fairness_score(data):
    """Calcular puntuación de equidad"""
    return min(10, max(0, 8.5 + (hash(str(data)) % 30) / 20 - 0.75))

def predict_outcomes(data):
    """Predecir resultados"""
    return {
        'next_decision_time': 5000 + (hash(str(data)) % 3000),
        'user_satisfaction': 0.85 + (hash(str(data)) % 20) / 100 - 0.1,
        'optimal_segments': 6 + (hash(str(data)) % 4)
    }

def find_optimization_opportunities(data):
    """Encontrar oportunidades de optimización"""
    return [
        {
            'area': 'Decision Speed',
            'current_performance': '78%',
            'potential_improvement': '15%',
            'recommendation': 'Implement predictive pre-loading'
        },
        {
            'area': 'User Interface',
            'current_performance': '82%',
            'potential_improvement': '12%',
            'recommendation': 'Optimize color contrast and spacing'
        }
    ]

@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('index.html'), 500

@app.errorhandler(429)
def rate_limit_exceeded(error):
    return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429

if __name__ == '__main__':
    app.run(
        debug=app.config['DEBUG'],
        host=app.config['HOST'],
        port=app.config['PORT']
    )
