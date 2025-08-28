#!/usr/bin/env python3
"""
Payo Backend - Integrated Test Script
Inicia el servidor y ejecuta pruebas automáticamente
"""

import subprocess
import time
import requests
import threading
import sys
import os

def run_server():
    """Ejecutar el servidor simple"""
    try:
        # Cambiar al directorio backend
        os.chdir("D:\\Projects\\payo\\backend")

        # Ejecutar el servidor
        process = subprocess.Popen([
            "D:\\Projects\\payo\\backend\\venv\\Scripts\\python.exe",
            "simple_server.py"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        return process
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return None

def test_api():
    """Probar las APIs"""
    time.sleep(2)  # Esperar que el servidor inicie

    tests = [
        ("Health Check", "GET", "/health"),
        ("Exchange Rates", "GET", "/api/exchange-rates"),
        ("List Invoices", "GET", "/api/invoices"),
        ("Create Invoice", "POST", "/api/invoices"),
        ("Root", "GET", "/"),
    ]

    results = []

    for test_name, method, endpoint in tests:
        try:
            url = f"http://localhost:8000{endpoint}"
            if method == "GET":
                response = requests.get(url, timeout=5)
            else:
                response = requests.post(url, json={"test": "data"}, timeout=5)

            print(f"✅ {test_name}: {response.status_code}")
            if response.status_code in [200, 201]:
                print(f"   Response: {response.json()}")
            results.append(True)

        except Exception as e:
            print(f"❌ {test_name}: Error - {e}")
            results.append(False)

    return results

def main():
    """Función principal"""
    print("🚀 Payo Backend - Integrated Test")
    print("=" * 50)

    # Iniciar servidor
    print("📡 Starting server...")
    server_process = run_server()

    if not server_process:
        print("❌ Failed to start server")
        return

    try:
        # Ejecutar pruebas
        print("🧪 Running tests...")
        results = test_api()

        # Resultados
        print("\n" + "=" * 50)
        print("📊 Test Results:")

        passed = sum(results)
        total = len(results)

        for i, (test_name, _, _) in enumerate([
            ("Health Check", "GET", "/health"),
            ("Exchange Rates", "GET", "/api/exchange-rates"),
            ("List Invoices", "GET", "/api/invoices"),
            ("Create Invoice", "POST", "/api/invoices"),
            ("Root", "GET", "/"),
        ]):
            status = "✅ PASS" if results[i] else "❌ FAIL"
            print(f"   {status} {test_name}")

        print(f"\n🎯 Overall: {passed}/{total} tests passed")

        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print("⚠️  Some tests failed.")

    finally:
        # Detener servidor
        print("\n🛑 Stopping server...")
        server_process.terminate()
        server_process.wait()
        print("👋 Server stopped")

if __name__ == "__main__":
    main()
