import asyncio
import httpx
import logging
from typing import Callable, Awaitable, Dict
from .base_listener import BlockchainListener

logger = logging.getLogger(__name__)

class BTCListener(BlockchainListener):
    """Bitcoin on-chain payment listener using Blockstream API"""

    BLOCKSTREAM_API = "https://blockstream.info/api"

    async def start_listening(self, callback: Callable[[str, str, str, int], Awaitable[None]]):
        """Start listening for BTC payments"""
        self.payment_callback = callback

        while True:
            try:
                await self._check_payments()
                await asyncio.sleep(30)  # Check every 30 seconds
            except Exception as e:
                logger.error(f"BTC listener error: {str(e)}")
                await asyncio.sleep(5)

    async def _check_payments(self):
        """Check for new payments to monitored addresses"""
        if not self.monitored_addresses:
            return

        for address in self.monitored_addresses.copy():
            try:
                # Get address transactions
                async with httpx.AsyncClient() as client:
                    response = await client.get(f"{self.BLOCKSTREAM_API}/address/{address}/txs")
                    transactions = response.json()

                # Check recent transactions (last 10)
                for tx in transactions[:10]:
                    await self._process_transaction(address, tx)

            except Exception as e:
                logger.error(f"Error checking address {address}: {str(e)}")

    async def _process_transaction(self, address: str, tx: Dict):
        """Process a transaction to see if it pays our address"""
        tx_hash = tx["txid"]

        # Check if transaction pays our address
        for output in tx["vout"]:
            if output["scriptpubkey_address"] == address:
                amount_received = str(output["value"] / 100000000)  # Convert sats to BTC
                confirmations = tx.get("status", {}).get("confirmed", False)

                if confirmations:
                    # Get confirmation count
                    try:
                        async with httpx.AsyncClient() as client:
                            response = await client.get(f"{self.BLOCKSTREAM_API}/tx/{tx_hash}")
                            tx_details = response.json()
                            confirmations = tx_details.get("status", {}).get("block_height", 0)
                    except:
                        confirmations = 1

                # Call payment callback
                if self.payment_callback:
                    # For BTC, we need to map address back to invoice_id
                    # This is a simplified version - in production you'd maintain a mapping
                    invoice_id = f"btc_{address[:12]}"  # Placeholder mapping

                    await self.payment_callback(
                        invoice_id=invoice_id,
                        tx_hash=tx_hash,
                        amount_received=amount_received,
                        confirmations=confirmations if isinstance(confirmations, int) else 1
                    )

                # Remove address from monitoring once payment is detected
                self.remove_address(address)
                break
