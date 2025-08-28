from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import invoices, webhooks
from .database import engine, Base
from .listeners import start_listeners
from .services.exchange_rate import ExchangeRateService
import asyncio

async def create_tables():
    """Create database tables asynchronously"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(
    title="Payo Crypto Payment Gateway",
    description="Backend API for Payo - Pure crypto payment gateway",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(invoices.router, prefix="/api", tags=["invoices"])
app.include_router(webhooks.router, prefix="/api", tags=["webhooks"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and start blockchain listeners on app startup"""
    await create_tables()
    await start_listeners()

@app.get("/")
async def root():
    return {"message": "Payo Crypto Payment Gateway API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/exchange-rates")
async def get_exchange_rates():
    """Get current exchange rates for supported cryptocurrencies"""
    exchange_service = ExchangeRateService()
    rates = await exchange_service.get_rates()
    return rates
