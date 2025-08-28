from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ..database import get_db
from ..models.models import Invoice
from ..services.invoice_service import InvoiceService
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for API
class CreateInvoiceRequest(BaseModel):
    amount_pen: float
    method: str  # BTC_LN, BTC, USDC_BASE
    description: Optional[str] = None

class CreateInvoiceResponse(BaseModel):
    invoice_id: str
    method: str
    amount_pen: float
    amount_crypto: str
    asset: str
    chain: str
    address_or_pr: str
    expires_at: str
    payment_url: str
    qr_data: str

class InvoiceResponse(BaseModel):
    id: str
    amount_pen: float
    amount_crypto: str
    asset: str
    chain: str
    method: str
    address_or_pr: str
    status: str
    description: Optional[str]
    expires_at: str
    created_at: str
    updated_at: str
    payment_url: str
    qr_data: str

class InvoiceFilters(BaseModel):
    status: Optional[str] = None
    method: Optional[str] = None
    limit: int = 50
    offset: int = 0

@router.post("/invoices", response_model=CreateInvoiceResponse)
async def create_invoice(
    request: CreateInvoiceRequest,
    db: AsyncSession = Depends(get_db)
):
    """Create a new invoice"""
    try:
        # For now, use user_id=1 (in production, get from auth)
        user_id = 1

        invoice = await InvoiceService.create_invoice(
            db=db,
            user_id=user_id,
            amount_pen=request.amount_pen,
            method=request.method,
            description=request.description
        )

        return CreateInvoiceResponse(
            invoice_id=invoice.id,
            method=invoice.method,
            amount_pen=invoice.amount_pen,
            amount_crypto=invoice.amount_crypto,
            asset=invoice.asset,
            chain=invoice.chain,
            address_or_pr=invoice.address_or_pr,
            expires_at=invoice.expires_at.isoformat(),
            payment_url=invoice.payment_url,
            qr_data=invoice.qr_data
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating invoice: {str(e)}")

@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get invoice by ID"""
    invoice = await InvoiceService.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    return InvoiceResponse(
        id=invoice.id,
        amount_pen=invoice.amount_pen,
        amount_crypto=invoice.amount_crypto,
        asset=invoice.asset,
        chain=invoice.chain,
        method=invoice.method,
        address_or_pr=invoice.address_or_pr,
        status=invoice.status,
        description=invoice.description,
        expires_at=invoice.expires_at.isoformat(),
        created_at=invoice.created_at.isoformat(),
        updated_at=invoice.updated_at.isoformat(),
        payment_url=invoice.payment_url,
        qr_data=invoice.qr_data
    )

@router.get("/invoices", response_model=List[InvoiceResponse])
async def list_invoices(
    status: Optional[str] = None,
    method: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """List invoices with optional filters"""
    # For now, use user_id=1 (in production, get from auth)
    user_id = 1

    invoices = await InvoiceService.list_invoices(
        db=db,
        user_id=user_id,
        status=status,
        method=method,
        limit=limit,
        offset=offset
    )

    return [
        InvoiceResponse(
            id=invoice.id,
            amount_pen=invoice.amount_pen,
            amount_crypto=invoice.amount_crypto,
            asset=invoice.asset,
            chain=invoice.chain,
            method=invoice.method,
            address_or_pr=invoice.address_or_pr,
            status=invoice.status,
            description=invoice.description,
            expires_at=invoice.expires_at.isoformat(),
            created_at=invoice.created_at.isoformat(),
            updated_at=invoice.updated_at.isoformat(),
            payment_url=invoice.payment_url,
            qr_data=invoice.qr_data
        )
        for invoice in invoices
    ]
