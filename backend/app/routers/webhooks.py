from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..database import get_db
from ..services.invoice_service import InvoiceService
from ..services.webhook_service import WebhookService
from pydantic import BaseModel

router = APIRouter()

class WebhookPayload(BaseModel):
    type: str  # "invoice.updated"
    invoice_id: str
    status: str
    method: str
    tx_hash: Optional[str] = None
    amount_expected: str
    amount_received: str
    received_at: str

@router.post("/webhooks/{webhook_id}")
async def handle_webhook(
    webhook_id: str,
    payload: WebhookPayload,
    x_signature: Optional[str] = Header(None, alias="X-Signature"),
    db: AsyncSession = Depends(get_db)
):
    """Handle incoming webhooks from blockchain listeners"""

    try:
        # Verify webhook signature (in production)
        # if not WebhookService.verify_signature(payload.dict(), x_signature, webhook_secret):
        #     raise HTTPException(status_code=401, detail="Invalid signature")

        # Process webhook based on type
        if payload.type == "invoice.updated":
            success = await InvoiceService.update_invoice_status(
                db=db,
                invoice_id=payload.invoice_id,
                status=payload.status,
                tx_hash=payload.tx_hash,
                amount_received=payload.amount_received
            )

            if not success:
                raise HTTPException(status_code=404, detail="Invoice not found")

            # Here you could trigger additional business logic
            # like sending emails, updating external systems, etc.

            return {"status": "processed", "invoice_id": payload.invoice_id}

        else:
            raise HTTPException(status_code=400, detail=f"Unknown webhook type: {payload.type}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

@router.post("/webhooks/test/{user_id}")
async def test_webhook(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Test webhook endpoint - creates a test notification"""

    # Create a test payload
    test_payload = WebhookPayload(
        type="invoice.updated",
        invoice_id="test_inv_123",
        status="confirmed",
        method="BTC_LN",
        tx_hash="test_tx_hash_123",
        amount_expected="0.0001",
        amount_received="0.0001",
        received_at="2025-08-28T12:00:00Z"
    )

    # Send test webhook
    success = await WebhookService.send_webhook(test_payload, "https://example.com/webhook")

    return {
        "status": "test_sent" if success else "test_failed",
        "payload": test_payload.dict()
    }
