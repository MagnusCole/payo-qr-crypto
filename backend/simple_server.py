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
            # Tasas de cambio simuladas
            response = {
                "BTC": 85000.00,
                "USDC": 1.00,
                "PEN": 0.25
            }
            self.wfile.write(json.dumps(response).encode())

        elif parsed_path.path == "/api/invoices":
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Lista de invoices simuladas
            response = [
                {
                    "id": "inv_001",
                    "amount_pen": 100.00,
                    "amount_crypto": 0.00118,
                    "method": "BTC_ONCHAIN",
                    "status": "pending",
                    "created_at": "2025-01-28T10:00:00Z"
                }
            ]
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

            # Invoice simulada
            response = {
                "id": "inv_002",
                "amount_pen": 120.00,
                "amount_crypto": 0.00141,
                "method": "USDC_BASE",
                "status": "pending",
                "payment_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                "created_at": datetime.now().isoformat()
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
