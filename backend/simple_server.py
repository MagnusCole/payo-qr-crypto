#!/usr/bin/env python3
"""
Simple Payo Backend Test Server
Servidor básico para probar funcionalidades sin FastAPI
"""

import json
import sqlite3
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import time
from datetime import datetime

class PayoHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)

        if parsed_path.path == "/":
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "message": "Payo Crypto Payment Gateway API",
                "status": "running",
                "version": "1.0.0"
            }
            self.wfile.write(json.dumps(response).encode())

        elif parsed_path.path == "/health":
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"status": "healthy"}
            self.wfile.write(json.dumps(response).encode())

        elif parsed_path.path == "/api/exchange-rates":
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Tasas de cambio simuladas con variación realista
            import random
            import time
            base_rates = {
                "BTC": 85000.00,
                "USDC": 1.00,
                "PEN": 0.25
            }
            # Añadir variación aleatoria para simular mercado real
            response = {}
            for crypto, rate in base_rates.items():
                variation = random.uniform(-0.02, 0.02)  # ±2%
                response[crypto] = round(rate * (1 + variation), 2)
            self.wfile.write(json.dumps(response).encode())

        elif parsed_path.path == "/api/invoices":
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Lista de invoices simuladas con diferentes estados
            from datetime import datetime, timedelta
            import random

            statuses = ["pending", "detected", "confirmed", "expired"]
            methods = ["BTC_LN", "BTC", "USDC_BASE"]

            response = []
            for i in range(5):  # Generar 5 invoices aleatorias
                created_time = datetime.now() - timedelta(hours=random.randint(0, 24))
                status = random.choice(statuses)
                method = random.choice(methods)
                amount_pen = random.randint(50, 500)

                # Calcular amount_crypto basado en método
                if method == "BTC_LN":
                    amount_crypto = round(amount_pen / 85000, 8)
                elif method == "BTC":
                    amount_crypto = round(amount_pen / 85000, 8)
                else:  # USDC_BASE
                    amount_crypto = round(amount_pen / 3.8, 6)

                invoice = {
                    "id": f"inv_{str(i+1).zfill(3)}",
                    "amount_pen": float(amount_pen),
                    "amount_crypto": str(amount_crypto),
                    "method": method,
                    "status": status,
                    "created_at": created_time.isoformat(),
                    "description": f"Factura de prueba #{i+1}"
                }
                response.append(invoice)

            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"error": "Not found"}
            self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        parsed_path = urlparse(self.path)

        if parsed_path.path == "/api/invoices":
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Simular creación de invoice con datos realistas
            import random
            from datetime import datetime, timedelta

            # Obtener datos del POST (simplificado)
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length).decode('utf-8')
                # Parsear JSON básico (simplificado)
                try:
                    import json
                    invoice_data = json.loads(post_data)
                    amount_pen = invoice_data.get('amount_pen', 100)
                    method = invoice_data.get('method', 'BTC_LN')
                except:
                    amount_pen = 100
                    method = 'BTC_LN'
            else:
                amount_pen = 100
                method = 'BTC_LN'

            # Generar datos realistas
            invoice_id = f"inv_{random.randint(1000, 9999)}"
            expires_at = datetime.now() + timedelta(minutes=15)

            # Calcular amount_crypto basado en método
            if method == "BTC_LN":
                amount_crypto = round(amount_pen / 85000, 8)
                address_or_pr = f"lnbc{amount_crypto}..."
                qr_data = f"bitcoin:{address_or_pr}?amount={amount_crypto}"
            elif method == "BTC":
                amount_crypto = round(amount_pen / 85000, 8)
                address_or_pr = "bc1q" + "".join(random.choices("0123456789abcdef", k=38))
                qr_data = f"bitcoin:{address_or_pr}?amount={amount_crypto}"
            else:  # USDC_BASE
                amount_crypto = round(amount_pen / 3.8, 6)
                address_or_pr = "0x" + "".join(random.choices("0123456789abcdef", k=40))
                qr_data = f"ethereum:{address_or_pr}?value={amount_crypto}"

            response = {
                "invoice_id": invoice_id,
                "method": method,
                "amount_pen": float(amount_pen),
                "amount_crypto": str(amount_crypto),
                "asset": "BTC" if method in ["BTC_LN", "BTC"] else "USDC",
                "chain": "bitcoin-lightning" if method == "BTC_LN" else ("bitcoin" if method == "BTC" else "base"),
                "address_or_pr": address_or_pr,
                "expires_at": expires_at.isoformat(),
                "payment_url": f"http://localhost:8080/pay/{invoice_id}",
                "qr_data": qr_data
            }
            self.wfile.write(json.dumps(response).encode())

        elif parsed_path.path.startswith("/api/invoices/") and parsed_path.path.endswith("/pay"):
            # Simular pago de invoice
            invoice_id = parsed_path.path.split("/")[-2]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Simular que el pago fue exitoso
            import random
            response = {
                "invoice_id": invoice_id,
                "status": "confirmed",
                "tx_hash": "simulated_tx_" + "".join(random.choices("0123456789abcdef", k=64)),
                "message": "Pago simulado exitosamente"
            }
            self.wfile.write(json.dumps(response).encode())

        elif parsed_path.path.startswith("/api/invoices/") and not parsed_path.path.endswith("/pay"):
            # Obtener invoice específica por ID
            invoice_id = parsed_path.path.split("/")[-1]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Simular invoice con estado cambiante
            import random
            from datetime import datetime, timedelta

            # Estados posibles que cambian con el tiempo
            base_time = datetime.now()
            invoice_age_minutes = random.randint(0, 30)

            if invoice_age_minutes < 5:
                status = "pending"
            elif invoice_age_minutes < 10:
                status = "detected"
            elif invoice_age_minutes < 15:
                status = "confirmed"
            else:
                status = random.choice(["confirmed", "expired"])

            created_at = base_time - timedelta(minutes=invoice_age_minutes)
            expires_at = created_at + timedelta(minutes=15)

            response = {
                "id": invoice_id,
                "amount_pen": 100.00,
                "amount_crypto": "0.001176",
                "asset": "BTC",
                "chain": "bitcoin",
                "method": "BTC",
                "address_or_pr": "bc1q" + "".join(random.choices("0123456789abcdef", k=38)),
                "status": status,
                "description": "Factura de prueba",
                "expires_at": expires_at.isoformat(),
                "created_at": created_at.isoformat(),
                "updated_at": base_time.isoformat(),
                "payment_url": f"http://localhost:8080/pay/{invoice_id}",
                "qr_data": f"bitcoin:bc1q{''.join(random.choices('0123456789abcdef', k=38))}?amount=0.001176",
                "payment": {
                    "id": 1,
                    "tx_hash": "simulated_tx_" + "".join(random.choices("0123456789abcdef", k=64)),
                    "amount_received": "0.001176",
                    "confirmations": 3 if status == "confirmed" else 0,
                    "detected_at": (created_at + timedelta(minutes=5)).isoformat(),
                    "confirmed_at": (created_at + timedelta(minutes=10)).isoformat() if status == "confirmed" else None
                } if status in ["detected", "confirmed"] else None,
                "state_timeline": [
                    {"status": "pending", "at": created_at.isoformat()},
                    {"status": "detected", "at": (created_at + timedelta(minutes=5)).isoformat()} if status in ["detected", "confirmed"] else None,
                    {"status": "confirmed", "at": (created_at + timedelta(minutes=10)).isoformat()} if status == "confirmed" else None
                ].filter(lambda x: x is not None)
            }
            self.wfile.write(json.dumps(response).encode())

        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"error": "Not found"}
            self.wfile.write(json.dumps(response).encode())

    def log_message(self, format, *args):
        # Silenciar logs del servidor
        pass

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, PayoHandler)
    print("🚀 Payo Backend Server running on http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000")
    print("💚 Health Check: http://localhost:8000/health")
    print("💰 Exchange Rates: http://localhost:8000/api/exchange-rates")
    print("📄 Invoices: http://localhost:8000/api/invoices")
    print("Press Ctrl+C to stop...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
        httpd.shutdown()

if __name__ == "__main__":
    run_server()
