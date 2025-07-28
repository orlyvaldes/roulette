#!/usr/bin/env python3
"""
Script de inicio para la aplicación Ruleta Personalizada
"""
import os
import sys
from app import app

def main():
    """Función principal para ejecutar la aplicación"""
    
    # Configurar variables de entorno si no están definidas
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    # Mostrar información de inicio
    print("🎡 Iniciando Ruleta Personalizada...")
    print(f"📍 Entorno: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"🌐 URL: http://{app.config['HOST']}:{app.config['PORT']}")
    print("🔄 Presiona Ctrl+C para detener el servidor")
    print("-" * 50)
    
    try:
        # Ejecutar la aplicación
        app.run(
            debug=app.config['DEBUG'],
            host=app.config['HOST'],
            port=app.config['PORT']
        )
    except KeyboardInterrupt:
        print("\n👋 ¡Servidor detenido! Gracias por usar Ruleta Personalizada")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()