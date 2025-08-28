import os
import hashlib
import hmac
from typing import Dict, Any
import json

def generate_btc_address() -> str:
    """Generate a new BTC address (placeholder - in production use HD wallet)"""
    # This is a placeholder - in production you'd use a proper HD wallet
    # For now, return a testnet address or use a service
    return "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"

def generate_ln_invoice(amount_sats: str, memo: str) -> str:
    """Generate Lightning Network invoice (placeholder)"""
    # This is a placeholder - in production you'd connect to LND/CLN
    # For now, return a mock invoice
    sats = int(float(amount_sats) * 100000000)  # Convert BTC to sats
    return f"lnbc{sats}1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784w"

def generate_evm_address() -> str:
    """Generate EVM address for USDC (placeholder)"""
    # This is a placeholder - in production you'd use a proper wallet
    return "0x742d35Cc6635C0532925a3b8D2F3ED3e9"

def generate_webhook_signature(payload: Dict[str, Any], secret: str) -> str:
    """Generate HMAC signature for webhook"""
    payload_str = json.dumps(payload, separators=(',', ':'), sort_keys=True)
    signature = hmac.new(
        secret.encode('utf-8'),
        payload_str.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return signature

def verify_webhook_signature(payload: Dict[str, Any], signature: str, secret: str) -> bool:
    """Verify webhook signature"""
    expected_signature = generate_webhook_signature(payload, secret)
    return hmac.compare_digest(signature, expected_signature)

def generate_secure_token() -> str:
    """Generate a secure random token"""
    return hashlib.sha256(os.urandom(32)).hexdigest()
