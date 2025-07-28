"""
Configuración para la aplicación de Ruleta Personalizada
"""
import os

class Config:
    """Configuración base"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'ruleta_secret_key_2024_super_secure'
    DEBUG = False
    TESTING = False
    
    # Configuración de la ruleta
    MIN_SEGMENTS = 2
    MAX_SEGMENTS = 20
    MAX_TEXT_LENGTH = 50
    
    # Configuración del servidor
    HOST = '0.0.0.0'
    PORT = 5000

class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    ENV = 'development'

class ProductionConfig(Config):
    """Configuración para producción"""
    DEBUG = False
    ENV = 'production'
    
    # En producción, usar variables de entorno
    SECRET_KEY = os.environ.get('SECRET_KEY')
    if not SECRET_KEY:
        raise ValueError("No SECRET_KEY set for production environment")

class TestingConfig(Config):
    """Configuración para testing"""
    TESTING = True
    DEBUG = True
    WTF_CSRF_ENABLED = False

# Configuraciones disponibles
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}