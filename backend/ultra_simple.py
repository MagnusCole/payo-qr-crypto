#!/usr/bin/env python3
"""
Ultra Simple Payo Backend Test
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"message": "Payo Backend is working!", "status": "healthy"}
        self.wfile.write(json.dumps(response).encode())

    def log_message(self, format, *args):
        pass  # Silenciar logs

# Ejecutar servidor
server_address = ('', 8000)
httpd = HTTPServer(server_address, SimpleHandler)
print("🚀 Simple server running on http://localhost:8000")
print("Test with: curl http://localhost:8000")
httpd.serve_forever()
