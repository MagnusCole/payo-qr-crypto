# 🎭 Payo Mocks - Servicios Gratuitos de Prueba

Este directorio contiene **mocks gratuitos** para probar todas las funcionalidades de Payo sin costos asociados.

## 🚀 Inicio Rápido

### 1. Iniciar Backend con Mocks
```bash
cd backend
python simple_server.py
```
El servidor se ejecutará en `http://localhost:8000`

### 2. Probar los Mocks
```bash
python test_mocks.py
```

### 3. Iniciar Frontend
```bash
npm run dev
```
Ve a `http://localhost:8080`

## 🎯 Funcionalidades de Mocks Disponibles

### ✅ **Completamente Gratuito**
- **Exchange Rates**: Tasas simuladas con variación realista
- **Invoice Creation**: Creación de facturas con datos realistas
- **Payment Simulation**: Simulación completa de pagos
- **State Changes**: Cambios automáticos de estado
- **Webhook Testing**: Servidor mock para probar webhooks

### 🔧 **Herramientas Incluidas**

#### `simple_server.py` - Backend Principal
```bash
# Endpoints disponibles:
/health                    # Estado del servidor
/api/exchange-rates       # Tasas de cambio simuladas
/api/invoices             # Lista de facturas
/api/invoices/{id}        # Factura específica
/api/invoices/{id}/pay    # Simular pago
```

#### `mock_services.py` - Herramientas Avanzadas
```bash
# Generar facturas de prueba
python mock_services.py generate 5

# Simular pago completo
python mock_services.py pay inv_001

# Servidor de webhooks mock
python mock_services.py webhook
```

#### `test_mocks.py` - Suite de Pruebas
```bash
# Ejecutar todas las pruebas
python test_mocks.py
```

## 🎮 **Cómo Probar el Flujo Completo**

### 1. **Crear Factura**
```bash
curl -X POST http://localhost:8000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{"amount_pen": 100, "method": "BTC", "description": "Prueba"}'
```

### 2. **Ver Estado Inicial**
```bash
curl http://localhost:8000/api/invoices/inv_001
# Status: "pending"
```

### 3. **Simular Pago**
```bash
curl -X POST http://localhost:8000/api/invoices/inv_001/pay
```

### 4. **Ver Estado Final**
```bash
curl http://localhost:8000/api/invoices/inv_001
# Status: "confirmed"
```

## 🎨 **Características de los Mocks**

### **Tasas de Cambio Realistas**
- Variación automática ±2%
- Actualización cada request
- Valores basados en mercado real

### **Facturas Dinámicas**
- IDs únicos generados automáticamente
- Estados que cambian con el tiempo
- Direcciones crypto válidas simuladas
- QR codes funcionales

### **Pagos Simulados**
- Cambios de estado automáticos
- Transacciones hash simuladas
- Confirmaciones progresivas
- Timeline de estados

## 🔄 **Flujo de Estados Simulado**

```
pending (0-5min) → detected (5-10min) → confirmed (10min+)
```

Los estados cambian automáticamente basado en el tiempo de creación de la factura.

## 🌐 **Testing con Webhooks**

### Iniciar Servidor Mock
```bash
python mock_services.py webhook
```

### Configurar Webhook en tu app
```bash
# El webhook endpoint estará en:
http://localhost:3001/webhook
```

### Enviar Webhook de Prueba
```bash
curl -X POST http://localhost:3001/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "payment.confirmed", "invoice_id": "inv_001"}'
```

## 📊 **Datos de Prueba Incluidos**

### **Facturas de Ejemplo**
- Múltiples métodos de pago (BTC, BTC_LN, USDC_BASE)
- Estados variados (pending, detected, confirmed, expired)
- Montos aleatorios entre S/50 - S/500
- Descripciones realistas

### **Tasas de Cambio**
- BTC: ~85,000 PEN (con variación)
- USDC: ~1.00 PEN (estable)
- PEN: ~0.25 USD (conversión inversa)

## 🎯 **Próximos Pasos**

Una vez que los mocks funcionan correctamente:

1. **Prueba la UI completa** en `http://localhost:8080`
2. **Crea facturas** desde la interfaz
3. **Simula pagos** usando los endpoints mock
4. **Verifica webhooks** con el servidor mock
5. **Prueba diferentes escenarios** de pago

## 💡 **Tips para Desarrollo**

- Los mocks **no requieren APIs externas**
- **No hay límites de rate** ni costos
- **Datos persistentes** durante la sesión
- **Reinicio automático** al reiniciar el servidor
- **Logs detallados** para debugging

## 🚨 **Limitaciones**

- **No hay persistencia** entre reinicios del servidor
- **Estados se resetean** al reiniciar
- **No hay validación real** de transacciones blockchain
- **Simulación básica** de confirmaciones

¡Estos mocks te permiten **probar completamente** Payo **sin gastar un centavo**! 🎉
