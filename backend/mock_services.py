#!/usr/bin/env python3
"""
Mock Services para Payo - Servicios simulados gratuitos
"""

import json
import random
import time
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

class MockWebhookHandler(BaseHTTPRequestHandler):
    """Handler para simular recepción de webhooks"""

    def do_POST(self):
        """Recibir webhooks simulados"""
        parsed_path = urlparse(self.path)

        if parsed_path.path == "/webhook":
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length).decode('utf-8')
                print(f"📨 Webhook recibido: {post_data}")

            response = {"status": "received", "timestamp": datetime.now().isoformat()}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Solo loggear webhooks
        if "webhook" in format:
            print(f"🌐 {format % args}")

def simulate_payment_flow(invoice_id: str, backend_url: str = "http://localhost:8000"):
    """Simular flujo completo de pago"""
    try:
        import urllib.request
        import urllib.error

        print(f"🎯 Simulando pago para invoice {invoice_id}")

        # 1. Obtener invoice actual
        try:
            with urllib.request.urlopen(f"{backend_url}/api/invoices/{invoice_id}") as response:
                invoice = json.loads(response.read().decode())
                print(f"📄 Invoice actual: {invoice['status']}")

            # 2. Simular pago
            data = json.dumps({}).encode('utf-8')
            req = urllib.request.Request(f"{backend_url}/api/invoices/{invoice_id}/pay",
                                       data=data,
                                       headers={'Content-Type': 'application/json'},
                                       method='POST')
            with urllib.request.urlopen(req) as response:
                pay_result = json.loads(response.read().decode())
                print(f"💰 Pago simulado: {pay_result}")

            # 3. Verificar cambio de estado
            time.sleep(2)
            with urllib.request.urlopen(f"{backend_url}/api/invoices/{invoice_id}") as response:
                updated_invoice = json.loads(response.read().decode())
                print(f"✅ Estado final: {updated_invoice['status']}")

        except urllib.error.HTTPError as e:
            print(f"❌ Error HTTP: {e.code} - {e.reason}")
        except Exception as e:
            print(f"❌ Error en simulación: {e}")
    except ImportError:
        print("❌ urllib no disponible")

def generate_test_invoices(backend_url: str = "http://localhost:8000", count: int = 3):
    """Generar facturas de prueba"""
    try:
        import urllib.request
        import urllib.error

        print(f"📝 Generando {count} facturas de prueba...")

        for i in range(count):
            invoice_data = {
                "amount_pen": random.randint(50, 200),
                "method": random.choice(["BTC_LN", "BTC", "USDC_BASE"]),
                "description": f"Factura de prueba #{i+1}"
            }

            try:
                data = json.dumps(invoice_data).encode('utf-8')
                req = urllib.request.Request(f"{backend_url}/api/invoices",
                                           data=data,
                                           headers={'Content-Type': 'application/json'},
                                           method='POST')
                with urllib.request.urlopen(req) as response:
                    result = json.loads(response.read().decode())
                    print(f"✅ Creada invoice {result['id']} - {result['method']}")
            except urllib.error.HTTPError as e:
                print(f"❌ Error HTTP creando invoice: {e.code}")
            except Exception as e:
                print(f"❌ Error creando invoice: {e}")
    except ImportError:
        print("❌ urllib no disponible")

def run_mock_webhook_server(port: int = 3001):
    """Ejecutar servidor de webhooks mock"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, MockWebhookHandler)
    print(f"🎣 Mock Webhook Server corriendo en http://localhost:{port}")
    print("Envía POST requests a /webhook para simular recepción")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Mock webhook server stopped")

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "webhook":
            run_mock_webhook_server()
        elif command == "generate":
            count = int(sys.argv[2]) if len(sys.argv) > 2 else 3
            generate_test_invoices(count=count)
        elif command == "pay":
            if len(sys.argv) > 2:
                simulate_payment_flow(sys.argv[2])
            else:
                print("Uso: python mock_services.py pay <invoice_id>")
    else:
        print("""
🎭 Payo Mock Services

Comandos disponibles:
  python mock_services.py webhook     - Iniciar servidor de webhooks mock
  python mock_services.py generate [n] - Generar n facturas de prueba
  python mock_services.py pay <id>    - Simular pago de invoice

Ejemplos:
  python mock_services.py generate 5
  python mock_services.py pay inv_001
  python mock_services.py webhook
        """)
