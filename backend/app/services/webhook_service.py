import httpx
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class WebhookService:
    """Service for sending webhooks to external services"""

    @staticmethod
    async def send_webhook(payload: Dict[str, Any], webhook_url: str, webhook_secret: Optional[str] = None) -> bool:
        """Send webhook to external service"""

        try:
            headers = {"Content-Type": "application/json"}

            # Add signature if secret is provided
            if webhook_secret:
                import hmac
                import hashlib
                import json

                payload_str = json.dumps(payload, separators=(',', ':'), sort_keys=True)
                signature = hmac.new(
                    webhook_secret.encode('utf-8'),
                    payload_str.encode('utf-8'),
                    hashlib.sha256
                ).hexdigest()
                headers["X-Signature"] = signature

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    webhook_url,
                    json=payload,
                    headers=headers,
                    timeout=10.0
                )

                if response.status_code in [200, 201, 202]:
                    logger.info(f"Webhook sent successfully to {webhook_url}")
                    return True
                else:
                    logger.error(f"Webhook failed with status {response.status_code}: {response.text}")
                    return False

        except Exception as e:
            logger.error(f"Error sending webhook to {webhook_url}: {str(e)}")
            return False

    @staticmethod
    def verify_signature(payload: Dict[str, Any], signature: Optional[str], secret: str) -> bool:
        """Verify webhook signature"""
        if not signature:
            return False

        import hmac
        import hashlib
        import json

        payload_str = json.dumps(payload, separators=(',', ':'), sort_keys=True)
        expected_signature = hmac.new(
            secret.encode('utf-8'),
            payload_str.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(signature, expected_signature)
