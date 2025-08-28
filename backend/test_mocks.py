#!/usr/bin/env python3
"""
Script de prueba para Payo Mocks
Ejecuta pruebas básicas del sistema mock
"""

import json
import sys
import time
from urllib.request import urlopen, Request
from urllib.error import HTTPError

def test_health_check():
    """Probar endpoint de salud"""
    print("🏥 Probando health check...")
    try:
        with urlopen("http://localhost:8000/health") as response:
            data = json.loads(response.read().decode())
            print(f"✅ Health: {data}")
            return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_exchange_rates():
    """Probar tasas de cambio"""
    print("💱 Probando exchange rates...")
    try:
        with urlopen("http://localhost:8000/api/exchange-rates") as response:
            data = json.loads(response.read().decode())
            print(f"✅ Rates: {data}")
            return True
    except Exception as e:
        print(f"❌ Exchange rates failed: {e}")
        return False

def test_create_invoice():
    """Probar creación de invoice"""
    print("📄 Probando creación de invoice...")
    try:
        invoice_data = {
            "amount_pen": 100,
            "method": "BTC",
            "description": "Prueba mock"
        }

        req = Request("http://localhost:8000/api/invoices",
                     data=json.dumps(invoice_data).encode('utf-8'),
                     headers={'Content-Type': 'application/json'},
                     method='POST')

        with urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"✅ Invoice creada: {data['invoice_id']}")
            return data['invoice_id']
    except Exception as e:
        print(f"❌ Create invoice failed: {e}")
        return None

def test_list_invoices():
    """Probar lista de invoices"""
    print("📋 Probando lista de invoices...")
    try:
        with urlopen("http://localhost:8000/api/invoices") as response:
            data = json.loads(response.read().decode())
            print(f"✅ Lista: {len(data)} invoices")
            return True
    except Exception as e:
        print(f"❌ List invoices failed: {e}")
        return False

def test_simulate_payment(invoice_id):
    """Probar simulación de pago"""
    print(f"💰 Probando pago simulado para {invoice_id}...")
    try:
        req = Request(f"http://localhost:8000/api/invoices/{invoice_id}/pay",
                     data=json.dumps({}).encode('utf-8'),
                     headers={'Content-Type': 'application/json'},
                     method='POST')

        with urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"✅ Pago simulado: {data}")
            return True
    except Exception as e:
        print(f"❌ Simulate payment failed: {e}")
        return False

def main():
    """Ejecutar todas las pruebas"""
    print("🧪 Iniciando pruebas de Payo Mocks\n")

    tests = [
        ("Health Check", test_health_check),
        ("Exchange Rates", test_exchange_rates),
        ("List Invoices", test_list_invoices),
    ]

    passed = 0
    total = len(tests)

    for name, test_func in tests:
        if test_func():
            passed += 1
        print()

    # Prueba de creación y pago
    invoice_id = test_create_invoice()
    if invoice_id:
        time.sleep(1)
        if test_simulate_payment(invoice_id):
            passed += 1
        total += 1
    else:
        total += 1

    print(f"📊 Resultados: {passed}/{total} pruebas pasaron")

    if passed == total:
        print("🎉 ¡Todas las pruebas pasaron! Los mocks funcionan correctamente.")
        print("\n💡 Próximos pasos:")
        print("1. Ejecuta 'npm run dev' para iniciar el frontend")
        print("2. Ve a http://localhost:8080 para probar la app")
        print("3. Crea facturas y simula pagos con los mocks")
    else:
        print("⚠️ Algunas pruebas fallaron. Asegúrate de que el backend esté corriendo:")
        print("   cd backend && python simple_server.py")

if __name__ == "__main__":
    main()
