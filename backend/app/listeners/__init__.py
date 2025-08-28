import asyncio
import logging
from typing import Dict, Set
from .btc_listener import BTCListener
from .ln_listener import LightningListener
from .usdc_listener import USDCListener
from ..services.invoice_service import InvoiceService
from ..services.webhook_service import WebhookService
from ..database import AsyncSessionLocal

logger = logging.getLogger(__name__)

class BlockchainListenerManager:
    """Manages all blockchain listeners"""

    def __init__(self):
        self.listeners = {
            "btc": BTCListener(),
            "ln": LightningListener(),
            "usdc": USDCListener()
        }
        self.active_invoices: Dict[str, str] = {}  # invoice_id -> address_or_pr
        self.running = False

    async def start(self):
        """Start all blockchain listeners"""
        if self.running:
            return

        self.running = True
        logger.info("Starting blockchain listeners...")

        # Start listeners in background tasks
        tasks = []
        for name, listener in self.listeners.items():
            task = asyncio.create_task(self._run_listener(name, listener))
            tasks.append(task)

        # Start invoice monitoring task
        monitor_task = asyncio.create_task(self._monitor_invoices())
        tasks.append(monitor_task)

        # Wait for all tasks (they run indefinitely)
        await asyncio.gather(*tasks, return_exceptions=True)

    async def _run_listener(self, name: str, listener):
        """Run a specific blockchain listener"""
        while self.running:
            try:
                await listener.start_listening(self._on_payment_detected)
            except Exception as e:
                logger.error(f"Listener {name} failed: {str(e)}")
                await asyncio.sleep(5)  # Wait before retrying

    async def _monitor_invoices(self):
        """Monitor active invoices and update listeners"""
        while self.running:
            try:
                await self._update_active_invoices()
                await self._check_expired_invoices()
                await asyncio.sleep(30)  # Check every 30 seconds
            except Exception as e:
                logger.error(f"Invoice monitoring failed: {str(e)}")
                await asyncio.sleep(5)

    async def _update_active_invoices(self):
        """Update listeners with active invoice addresses"""
        async with AsyncSessionLocal() as session:
            expired_ids = await InvoiceService.check_expired_invoices(session)

            # Get all pending invoices
            from sqlalchemy import select
            from ..models.models import Invoice

            result = await session.execute(
                select(Invoice.id, Invoice.address_or_pr, Invoice.method)
                .where(Invoice.status == "pending")
            )

            active_invoices = {}
            for row in result.all():
                invoice_id, address_or_pr, method = row
                active_invoices[invoice_id] = address_or_pr

                # Update listeners based on method
                if method == "BTC":
                    self.listeners["btc"].add_address(address_or_pr)
                elif method == "BTC_LN":
                    self.listeners["ln"].add_invoice(address_or_pr)
                elif method == "USDC_BASE":
                    self.listeners["usdc"].add_address(address_or_pr)

            self.active_invoices = active_invoices

            # Remove expired invoices from listeners
            for expired_id in expired_ids:
                if expired_id in self.active_invoices:
                    address_or_pr = self.active_invoices[expired_id]
                    # Remove from appropriate listener
                    for listener in self.listeners.values():
                        listener.remove_address(address_or_pr)

    async def _check_expired_invoices(self):
        """Check for expired invoices and clean up listeners"""
        async with AsyncSessionLocal() as session:
            expired_ids = await InvoiceService.check_expired_invoices(session)

            for expired_id in expired_ids:
                if expired_id in self.active_invoices:
                    address_or_pr = self.active_invoices[expired_id]
                    # Remove from listeners
                    for listener in self.listeners.values():
                        listener.remove_address(address_or_pr)
                    del self.active_invoices[expired_id]

    async def _on_payment_detected(self, invoice_id: str, tx_hash: str, amount_received: str, confirmations: int = 0):
        """Handle payment detection"""
        logger.info(f"Payment detected for invoice {invoice_id}: {tx_hash}")

        async with AsyncSessionLocal() as session:
            # Update invoice status
            if confirmations >= 1:
                status = "confirmed"
            else:
                status = "detected"

            success = await InvoiceService.update_invoice_status(
                db=session,
                invoice_id=invoice_id,
                status=status,
                tx_hash=tx_hash,
                amount_received=amount_received,
                confirmations=confirmations
            )

            if success:
                # Send webhook notification
                await self._send_payment_webhook(invoice_id, status, tx_hash, amount_received)

    async def _send_payment_webhook(self, invoice_id: str, status: str, tx_hash: str, amount_received: str):
        """Send webhook notification for payment"""
        from datetime import datetime

        payload = {
            "type": "invoice.updated",
            "invoice_id": invoice_id,
            "status": status,
            "method": "BTC_LN",  # This should be dynamic based on invoice
            "tx_hash": tx_hash,
            "amount_expected": "0",  # This should come from invoice
            "amount_received": amount_received,
            "received_at": datetime.utcnow().isoformat()
        }

        # In production, get webhook URL from user settings
        webhook_url = "https://example.com/webhook"

        await WebhookService.send_webhook(payload, webhook_url)

# Global instance
listener_manager = BlockchainListenerManager()

async def start_listeners():
    """Start all blockchain listeners"""
    await listener_manager.start()
