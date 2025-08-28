#!/usr/bin/env python3
"""
🚀 Payo Quick Start - Configuración completa con mocks gratuitos
"""

import os
import sys
import time
import subprocess
import webbrowser
from pathlib import Path

def print_header():
    """Mostrar header del programa"""
    print("""
🎭 Payo Quick Start - Mocks Gratuitos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¡Configura Payo completamente GRATIS para pruebas!

Este script iniciará:
✅ Backend con mocks completos
✅ Frontend de desarrollo
✅ Servidor de webhooks mock
✅ Datos de prueba incluidos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    """)

def check_requirements():
    """Verificar requisitos del sistema"""
    print("🔍 Verificando requisitos...")

    # Verificar Python
    try:
        import sys
        print(f"✅ Python {sys.version.split()[0]}")
    except:
        print("❌ Python no encontrado")
        return False

    # Verificar Node.js
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()}")
        else:
            print("❌ Node.js no encontrado")
            return False
    except:
        print("❌ Node.js no encontrado")
        return False

    # Verificar npm
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm {result.stdout.strip()}")
        else:
            print("❌ npm no encontrado")
            return False
    except:
        print("❌ npm no encontrado")
        return False

    return True

def install_dependencies():
    """Instalar dependencias si es necesario"""
    print("\n📦 Verificando dependencias...")

    # Backend dependencies
    backend_req = Path("backend/requirements.txt")
    if backend_req.exists():
        print("✅ Backend requirements.txt encontrado")
    else:
        print("❌ requirements.txt no encontrado")
        return False

    # Frontend dependencies
    frontend_pkg = Path("package.json")
    if frontend_pkg.exists():
        print("✅ Frontend package.json encontrado")
    else:
        print("❌ package.json no encontrado")
        return False

    return True

def start_backend():
    """Iniciar backend con mocks"""
    print("\n🚀 Iniciando backend...")
    try:
        os.chdir("backend")
        process = subprocess.Popen([sys.executable, "simple_server.py"])
        print("✅ Backend iniciado en http://localhost:8000")
        time.sleep(2)  # Esperar que inicie
        return process
    except Exception as e:
        print(f"❌ Error iniciando backend: {e}")
        return None

def start_frontend():
    """Iniciar frontend"""
    print("\n🌐 Iniciando frontend...")
    try:
        os.chdir("..")  # Volver al directorio raíz
        process = subprocess.Popen(["npm", "run", "dev"])
        print("✅ Frontend iniciado en http://localhost:8080")
        time.sleep(3)  # Esperar que inicie
        return process
    except Exception as e:
        print(f"❌ Error iniciando frontend: {e}")
        return None

def start_webhook_mock():
    """Iniciar servidor de webhooks mock"""
    print("\n🎣 Iniciando servidor de webhooks mock...")
    try:
        # Iniciar en background
        process = subprocess.Popen([sys.executable, "backend/mock_services.py", "webhook"])
        print("✅ Webhook server iniciado en http://localhost:3001")
        time.sleep(1)
        return process
    except Exception as e:
        print(f"❌ Error iniciando webhook server: {e}")
        return None

def generate_test_data():
    """Generar datos de prueba"""
    print("\n📝 Generando datos de prueba...")
    try:
        result = subprocess.run([sys.executable, "backend/mock_services.py", "generate", "5"],
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ 5 facturas de prueba generadas")
            return True
        else:
            print(f"❌ Error generando datos: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error generando datos: {e}")
        return False

def open_browser():
    """Abrir navegador con la aplicación"""
    print("\n🌍 Abriendo navegador...")
    try:
        webbrowser.open("http://localhost:8080")
        print("✅ Navegador abierto")
    except Exception as e:
        print(f"⚠️ No se pudo abrir navegador automáticamente: {e}")
        print("   Ve manualmente a: http://localhost:8080")

def show_summary():
    """Mostrar resumen final"""
    print("""
🎉 ¡Payo está listo y funcionando!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 URLs Disponibles:
   • Aplicación: http://localhost:8080
   • Backend API: http://localhost:8000
   • Webhooks Mock: http://localhost:3001

🧪 Funcionalidades de Prueba:
   • Crear facturas con diferentes métodos
   • Simular pagos completos
   • Ver cambios de estado automáticos
   • Probar webhooks

📝 Comandos Útiles:
   • Generar más facturas: python backend/mock_services.py generate 10
   • Simular pago: python backend/mock_services.py pay inv_001
   • Ver documentación: cat backend/MOCKS_README.md

💡 Próximos Pasos:
   1. Crea una factura desde la app
   2. Simula un pago usando los mocks
   3. Verifica que cambie el estado
   4. Prueba diferentes métodos de pago

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¡Disfruta probando Payo completamente GRATIS! 🎭
    """)

def main():
    """Función principal"""
    print_header()

    if not check_requirements():
        print("\n❌ Requisitos no cumplidos. Instala Node.js y Python.")
        sys.exit(1)

    if not install_dependencies():
        print("\n❌ Archivos de dependencias faltantes.")
        sys.exit(1)

    # Iniciar servicios
    backend_process = start_backend()
    if not backend_process:
        sys.exit(1)

    frontend_process = start_frontend()
    if not frontend_process:
        backend_process.terminate()
        sys.exit(1)

    webhook_process = start_webhook_mock()

    # Generar datos de prueba
    generate_test_data()

    # Abrir navegador
    open_browser()

    # Mostrar resumen
    show_summary()

    print("\n⏹️ Presiona Ctrl+C para detener todos los servicios...")

    try:
        # Mantener corriendo hasta que se presione Ctrl+C
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n👋 Deteniendo servicios...")

        # Terminar procesos
        if backend_process:
            backend_process.terminate()
        if frontend_process:
            frontend_process.terminate()
        if webhook_process:
            webhook_process.terminate()

        print("✅ Todos los servicios detenidos. ¡Hasta luego!")

if __name__ == "__main__":
    main()
