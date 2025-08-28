import httpx
from typing import Dict, Optional
from decimal import Decimal

class ExchangeRateService:
    """Service to get exchange rates for PEN to crypto conversion"""

    COINGECKO_API = "https://api.coingecko.com/api/v3"

    # Fallback rates (in case API is down)
    FALLBACK_RATES = {
        "BTC": 0.000026,  # 1 PEN = ~0.000026 BTC
        "USDC": 0.27      # 1 PEN = ~0.27 USDC
    }

    async def get_btc_rate(self) -> Decimal:
        """Get BTC/PEN exchange rate"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.COINGECKO_API}/simple/price",
                    params={
                        "ids": "bitcoin",
                        "vs_currencies": "pen"
                    }
                )
                data = response.json()
                rate = data["bitcoin"]["pen"]
                return Decimal(str(rate))
        except Exception:
            # Fallback to hardcoded rate
            return Decimal(str(self.FALLBACK_RATES["BTC"]))

    async def get_usdc_rate(self) -> Decimal:
        """Get USDC/PEN exchange rate"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.COINGECKO_API}/simple/price",
                    params={
                        "ids": "usd-coin",
                        "vs_currencies": "pen"
                    }
                )
                data = response.json()
                rate = data["usd-coin"]["pen"]
                return Decimal(str(rate))
        except Exception:
            # Fallback to hardcoded rate
            return Decimal(str(self.FALLBACK_RATES["USDC"]))

    async def convert_pen_to_crypto(self, amount_pen: float, method: str) -> str:
        """Convert PEN amount to crypto amount based on method"""
        if method == "BTC_LN" or method == "BTC":
            rate = await self.get_btc_rate()
            crypto_amount = Decimal(str(amount_pen)) / rate
            return f"{crypto_amount:.8f}"  # BTC has 8 decimals
        elif method == "USDC_BASE":
            rate = await self.get_usdc_rate()
            crypto_amount = Decimal(str(amount_pen)) * rate
            return f"{crypto_amount:.6f}"  # USDC has 6 decimals
        else:
            raise ValueError(f"Unsupported method: {method}")

# Global instance
exchange_service = ExchangeRateService()
