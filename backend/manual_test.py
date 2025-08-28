#!/usr/bin/env python3
"""
Payo Backend - Simple Manual Test
Pruebas manuales del backend
"""

import requests
import time

def test_endpoint(name, url, method='GET', data=None):
    """Probar un endpoint específico"""
    try:
        print(f"🔍 Testing {name}...")
        if method == 'GET':
            response = requests.get(url, timeout=5)
        else:
            response = requests.post(url, json=data, timeout=5)

        print(f"✅ {name}: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ {name}: Error - {e}")
        return False

def main():
    """Pruebas manuales"""
    print("🚀 Payo Backend - Manual Tests")
    print("=" * 50)
    print("⚠️  Make sure the server is running on http://localhost:8000")
    print("   Run: python simple_server.py")
    print("")

    # Esperar input del usuario
    input("Press Enter when server is running...")

    # Probar endpoints
    tests = [
        ("Root API", "http://localhost:8000/", "GET"),
        ("Health Check", "http://localhost:8000/health", "GET"),
        ("Exchange Rates", "http://localhost:8000/api/exchange-rates", "GET"),
        ("List Invoices", "http://localhost:8000/api/invoices", "GET"),
        ("Create Invoice", "http://localhost:8000/api/invoices", "POST", {"amount_pen": 100.00, "method": "BTC_ONCHAIN"}),
    ]

    results = []
    for name, url, method, *data in tests:
        success = test_endpoint(name, url, method, data[0] if data else None)
        results.append(success)
        print("")

    # Resultados
    print("=" * 50)
    print("📊 Test Results Summary:")
    passed = sum(results)
    total = len(results)

    for i, (name, _, _, *_) in enumerate(tests):
        status = "✅ PASS" if results[i] else "❌ FAIL"
        print(f"   {status} {name}")

    print(f"\n🎯 Overall: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Backend is working correctly.")
    else:
        print("⚠️  Some tests failed.")

if __name__ == "__main__":
    main()
