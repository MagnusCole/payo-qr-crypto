import asyncio
import httpx
import logging
from typing import Callable, Awaitable, Dict
from .base_listener import BlockchainListener

logger = logging.getLogger(__name__)

class USDCListener(BlockchainListener):
    """USDC on Base payment listener using Basescan API"""

    BASESCAN_API = "https://api.basescan.org/api"
    API_KEY = "YOUR_BASESCAN_API_KEY"  # Get from Basescan

    USDC_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"  # USDC on Base

    async def start_listening(self, callback: Callable[[str, str, str, int], Awaitable[None]]):
        """Start listening for USDC payments"""
        self.payment_callback = callback

        while True:
            try:
                await self._check_payments()
                await asyncio.sleep(15)  # Check every 15 seconds (EVM is faster than BTC)
            except Exception as e:
                logger.error(f"USDC listener error: {str(e)}")
                await asyncio.sleep(5)

    async def _check_payments(self):
        """Check for new USDC transfers to monitored addresses"""
        if not self.monitored_addresses:
            return

        for address in self.monitored_addresses.copy():
            try:
                # Get ERC-20 transfers for the address
                async with httpx.AsyncClient() as client:
                    params = {
                        "module": "account",
                        "action": "tokentx",
                        "contractaddress": self.USDC_CONTRACT,
                        "address": address,
                        "page": 1,
                        "offset": 10,
                        "sort": "desc",
                        "apikey": self.API_KEY
                    }

                    response = await client.get(self.BASESCAN_API, params=params)
                    data = response.json()

                if data.get("status") == "1":
                    transactions = data.get("result", [])
                    for tx in transactions:
                        await self._process_transaction(address, tx)

            except Exception as e:
                logger.error(f"Error checking address {address}: {str(e)}")

    async def _process_transaction(self, address: str, tx: Dict):
        """Process a USDC transaction"""
        tx_hash = tx["hash"]
        from_address = tx["from"]
        to_address = tx["to"]
        value = tx["value"]  # This is in smallest unit (wei for USDC)

        # Convert from wei to USDC (6 decimals)
        amount_received = str(int(value) / 10**6)

        # Check if this is a payment to our address
        if to_address.lower() == address.lower():
            # Get confirmation status
            confirmations = int(tx.get("confirmations", 0))

            # For USDC, we require 3 confirmations
            if confirmations >= 3:
                status = "confirmed"
            elif confirmations > 0:
                status = "detected"
            else:
                return  # Not confirmed yet

            # Call payment callback
            if self.payment_callback:
                # Map address back to invoice_id (placeholder logic)
                invoice_id = f"usdc_{address[:12]}"

                await self.payment_callback(
                    invoice_id=invoice_id,
                    tx_hash=tx_hash,
                    amount_received=amount_received,
                    confirmations=confirmations
                )

                # Remove address from monitoring once payment is confirmed
                if confirmations >= 3:
                    self.remove_address(address)
