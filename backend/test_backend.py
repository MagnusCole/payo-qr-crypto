#!/usr/bin/env python3
"""
Payo Backend - Test Script

Script para probar la funcionalidad básica del backend.
Ejecutar después de iniciar el servidor.
"""

import asyncio
import json
import requests
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_create_invoice():
    """Test invoice creation"""
    try:
        payload = {
            "amount_pen": 100.00,
            "method": "USDC_BASE",
            "description": "Test invoice"
        }
        response = requests.post(
            f"{BASE_URL}/api/invoices",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ Create invoice: {response.status_code}")
        if response.status_code == 200:
            invoice = response.json()
            print(f"   Invoice ID: {invoice.get('id')}")
            print(f"   Amount PEN: {invoice.get('amount_pen')}")
            print(f"   Amount Crypto: {invoice.get('amount_crypto')}")
            print(f"   Address: {invoice.get('payment_address')}")
            return invoice.get('id')
        return None
    except Exception as e:
        print(f"❌ Create invoice failed: {e}")
        return None

def test_get_invoice(invoice_id):
    """Test invoice retrieval"""
    try:
        response = requests.get(f"{BASE_URL}/api/invoices/{invoice_id}")
        print(f"✅ Get invoice: {response.status_code}")
        if response.status_code == 200:
            invoice = response.json()
            print(f"   Status: {invoice.get('status')}")
            print(f"   Method: {invoice.get('method')}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Get invoice failed: {e}")
        return False

def test_list_invoices():
    """Test invoice listing"""
    try:
        response = requests.get(f"{BASE_URL}/api/invoices")
        print(f"✅ List invoices: {response.status_code}")
        if response.status_code == 200:
            invoices = response.json()
            print(f"   Total invoices: {len(invoices)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ List invoices failed: {e}")
        return False

def test_exchange_rates():
    """Test exchange rate service"""
    try:
        response = requests.get(f"{BASE_URL}/api/exchange-rates")
        print(f"✅ Exchange rates: {response.status_code}")
        if response.status_code == 200:
            rates = response.json()
            print(f"   BTC rate: {rates.get('BTC', 'N/A')}")
            print(f"   USDC rate: {rates.get('USDC', 'N/A')}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Exchange rates failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Payo Backend Tests")
    print("=" * 50)

    # Wait a moment for server to start
    import time
    time.sleep(2)

    results = []

    # Test health
    results.append(("Health Check", test_health()))

    # Test exchange rates
    results.append(("Exchange Rates", test_exchange_rates()))

    # Test invoice operations
    invoice_id = test_create_invoice()
    if invoice_id:
        results.append(("Create Invoice", True))
        results.append(("Get Invoice", test_get_invoice(invoice_id)))
    else:
        results.append(("Create Invoice", False))
        results.append(("Get Invoice", False))

    results.append(("List Invoices", test_list_invoices()))

    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    passed = 0
    total = len(results)

    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {status} {test_name}")
        if success:
            passed += 1

    print(f"\n🎯 Overall: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Backend is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the output above.")

if __name__ == "__main__":
    main()
