import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ..models.models import Invoice, Payment, User
from .exchange_rate import exchange_service
from ..utils.crypto_utils import generate_btc_address, generate_ln_invoice, generate_evm_address

class InvoiceService:
    """Service for managing invoices"""

    @staticmethod
    async def create_invoice(
        db: AsyncSession,
        user_id: int,
        amount_pen: float,
        method: str,
        description: Optional[str] = None,
        expiry_minutes: int = 15
    ) -> Invoice:
        """Create a new invoice"""

        # Generate unique invoice ID
        invoice_id = f"inv_{uuid.uuid4().hex[:12]}"

        # Convert PEN to crypto
        amount_crypto = await exchange_service.convert_pen_to_crypto(amount_pen, method)

        # Determine asset and chain
        if method == "BTC_LN" or method == "BTC":
            asset = "BTC"
            chain = "bitcoin"
        elif method == "USDC_BASE":
            asset = "USDC"
            chain = "base"
        else:
            raise ValueError(f"Unsupported method: {method}")

        # Generate address or payment request
        if method == "BTC_LN":
            address_or_pr = generate_ln_invoice(amount_crypto, f"Payo Invoice {invoice_id}")
        elif method == "BTC":
            address_or_pr = generate_btc_address()
        elif method == "USDC_BASE":
            address_or_pr = generate_evm_address()
        else:
            raise ValueError(f"Unsupported method: {method}")

        # Calculate expiry time
        expires_at = datetime.utcnow() + timedelta(minutes=expiry_minutes)

        # Create payment URL
        payment_url = f"https://payo.app/pay/{invoice_id}"

        # Create QR data
        qr_data = f"payo:{invoice_id}"

        # Create invoice in database
        invoice = Invoice(
            id=invoice_id,
            user_id=user_id,
            method=method,
            amount_pen=amount_pen,
            amount_crypto=amount_crypto,
            asset=asset,
            chain=chain,
            address_or_pr=address_or_pr,
            status="pending",
            description=description,
            expires_at=expires_at,
            payment_url=payment_url,
            qr_data=qr_data
        )

        db.add(invoice)
        await db.flush()
        await db.refresh(invoice)

        return invoice

    @staticmethod
    async def get_invoice(db: AsyncSession, invoice_id: str) -> Optional[Invoice]:
        """Get invoice by ID with payment information"""
        result = await db.execute(
            select(Invoice).where(Invoice.id == invoice_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def list_invoices(
        db: AsyncSession,
        user_id: int,
        status: Optional[str] = None,
        method: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Invoice]:
        """List invoices for a user with optional filters"""
        query = select(Invoice).where(Invoice.user_id == user_id)

        if status:
            query = query.where(Invoice.status == status)
        if method:
            query = query.where(Invoice.method == method)

        query = query.order_by(Invoice.created_at.desc()).limit(limit).offset(offset)

        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def update_invoice_status(
        db: AsyncSession,
        invoice_id: str,
        status: str,
        tx_hash: Optional[str] = None,
        amount_received: Optional[str] = None,
        confirmations: int = 0
    ) -> bool:
        """Update invoice status and create payment record if needed"""

        # Get invoice
        invoice = await InvoiceService.get_invoice(db, invoice_id)
        if not invoice:
            return False

        # Update invoice status
        await db.execute(
            update(Invoice)
            .where(Invoice.id == invoice_id)
            .values(status=status, updated_at=datetime.utcnow())
        )

        # Create payment record if this is a payment detection/confirmation
        if tx_hash and amount_received and status in ["detected", "confirmed"]:
            payment = Payment(
                invoice_id=invoice_id,
                tx_hash=tx_hash,
                amount_received=amount_received,
                confirmations=confirmations,
                detected_at=datetime.utcnow(),
                confirmed_at=datetime.utcnow() if status == "confirmed" else None
            )
            db.add(payment)

        await db.flush()
        return True

    @staticmethod
    async def check_expired_invoices(db: AsyncSession) -> List[str]:
        """Check for expired invoices and return their IDs"""
        now = datetime.utcnow()
        result = await db.execute(
            select(Invoice.id).where(
                Invoice.status == "pending",
                Invoice.expires_at < now
            )
        )
        expired_ids = result.scalars().all()

        # Update expired invoices
        if expired_ids:
            await db.execute(
                update(Invoice)
                .where(Invoice.id.in_(expired_ids))
                .values(status="expired", updated_at=now)
            )
            await db.flush()

        return expired_ids
