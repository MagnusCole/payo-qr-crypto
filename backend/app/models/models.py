from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    invoices = relationship("Invoice", back_populates="user")
    settings = relationship("Settings", back_populates="user", uselist=False)

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    method = Column(String, nullable=False)  # BTC_LN, BTC, USDC_BASE
    amount_pen = Column(Float, nullable=False)
    amount_crypto = Column(String, nullable=False)
    asset = Column(String, nullable=False)
    chain = Column(String, nullable=False)
    address_or_pr = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="pending")
    description = Column(Text)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="invoices")
    payment = relationship("Payment", back_populates="invoice", uselist=False)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=False)
    tx_hash = Column(String, nullable=False)
    amount_received = Column(String, nullable=False)
    confirmations = Column(Integer, default=0)
    detected_at = Column(DateTime(timezone=True), nullable=False)
    confirmed_at = Column(DateTime(timezone=True))

    invoice = relationship("Invoice", back_populates="payment")

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Wallet addresses
    btc_address = Column(String)  # BTC on-chain address or xpub
    btc_xpub = Column(String)  # Optional xpub for HD wallet
    ln_endpoint = Column(String)  # Lightning Network endpoint
    evm_address = Column(String)  # USDC Base address

    # Webhook configuration
    webhook_url = Column(String)
    webhook_secret = Column(String)

    # Preferences
    default_expiry_min = Column(Integer, default=15)
    conf_target = Column(Integer, default=1)  # Confirmation target for BTC
    tolerance_pct = Column(Float, default=1.0)  # Tolerance percentage

    user = relationship("User", back_populates="settings")
