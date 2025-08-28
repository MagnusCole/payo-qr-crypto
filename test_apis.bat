@echo off
echo Probando Payo Backend APIs...
echo.

echo 🔍 Health Check:
curl -s http://127.0.0.1:8070/health || echo ❌ No responde
echo.

echo 🔍 Root API:
curl -s http://127.0.0.1:8070/ || echo ❌ No responde
echo.

echo 🔍 Exchange Rates:
curl -s http://127.0.0.1:8070/api/exchange-rates || echo ❌ No responde
echo.

echo 🔍 Crear Invoice de prueba:
curl -s -X POST http://127.0.0.1:8070/api/invoices ^
-H "Content-Type: application/json" ^
-d "{\"amount\": 100, \"currency\": \"PEN\", \"method\": \"btc\"}" || echo ❌ No responde
echo.

echo ✅ Pruebas completadas!
pause
