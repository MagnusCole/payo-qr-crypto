# Payo Backend - Crypto Payment Gateway

Backend API para Payo, una pasarela de pagos cripto pura que permite crear invoices y recibir pagos en BTC Lightning, BTC on-chain y USDC Base.

## 🚀 Características

- **API REST** para gestión de invoices
- **Listeners blockchain** en tiempo real
- **Webhooks** para notificaciones de pago
- **Soporte multi-método**: BTC Lightning, BTC on-chain, USDC Base
- **Base de datos PostgreSQL** con SQLAlchemy async
- **FastAPI** con documentación automática

## 📋 Prerequisitos

- Python 3.8+
- PostgreSQL
- API keys para servicios externos (opcional)

## 🛠️ Instalación

1. **Crear entorno virtual:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

3. **Configurar base de datos:**
```bash
# Crear base de datos PostgreSQL
createdb payo_db

# O configurar la conexión en backend/app/database.py
```

4. **Configurar variables de entorno (opcional):**
```bash
export DATABASE_URL="postgresql+asyncpg://user:password@localhost/payo_db"
```

## 🚀 Ejecutar

```bash
python run.py
```

El servidor estará disponible en `http://localhost:8000`

## 📚 API Endpoints

### Crear Invoice
```http
POST /api/invoices
Content-Type: application/json

{
  "amount_pen": 120.00,
  "method": "USDC_BASE",
  "description": "Servicio de diseño"
}
```

### Obtener Invoice
```http
GET /api/invoices/{invoice_id}
```

### Listar Invoices
```http
GET /api/invoices?status=pending&method=BTC_LN
```

### Webhook
```http
POST /api/webhooks/{webhook_id}
X-Signature: <hmac-signature>
Content-Type: application/json

{
  "type": "invoice.updated",
  "invoice_id": "inv_123",
  "status": "confirmed",
  "tx_hash": "0x...",
  "amount_received": "31.52"
}
```

## 🔧 Configuración

### Base de Datos
Por defecto usa SQLite para desarrollo. Para producción, configura PostgreSQL en `database.py`.

### Blockchain Listeners
- **BTC on-chain**: Usa Blockstream API (gratuita)
- **BTC Lightning**: Placeholder (necesita conexión LND/CLN)
- **USDC Base**: Usa Basescan API (requiere API key)

### Webhooks
Los webhooks incluyen firma HMAC-SHA256 para seguridad.

## 🏗️ Arquitectura

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── database.py          # Configuración BD
│   ├── models/              # Modelos SQLAlchemy
│   ├── routers/             # Endpoints REST
│   ├── services/            # Lógica de negocio
│   ├── listeners/           # Listeners blockchain
│   └── utils/               # Utilidades cripto
├── requirements.txt
├── run.py                   # Script de inicio
└── README.md
```

## 🔒 Seguridad

- **HMAC signatures** en webhooks
- **Rate limiting** básico
- **Validación** de inputs
- **Timeouts** en requests externos

## 🚦 Estados de Invoice

- `pending`: Esperando pago
- `detected`: Pago detectado, esperando confirmaciones
- `confirmed`: Pago confirmado
- `expired`: Invoice expirada
- `underpaid`: Pago insuficiente

## 🔗 Integración Frontend

El backend está diseñado para trabajar con el frontend React/Vite existente. Los endpoints coinciden con los hooks de `usePayo.ts`.

## 📝 Desarrollo

Para desarrollo local:
1. Ejecutar `python run.py`
2. Visitar `http://localhost:8000/docs` para documentación Swagger
3. Usar `http://localhost:8000/redoc` para documentación ReDoc

## 🚀 Producción

Para despliegue en producción:
1. Configurar PostgreSQL
2. Configurar API keys de servicios externos
3. Configurar variables de entorno
4. Usar un servidor ASGI (ej: Gunicorn + Uvicorn)
5. Configurar HTTPS
6. Configurar monitoreo y logging
