from abc import ABC, abstractmethod
from typing import Callable, Awaitable

class BlockchainListener(ABC):
    """Abstract base class for blockchain listeners"""

    def __init__(self):
        self.monitored_addresses: set[str] = set()
        self.payment_callback: Callable[[str, str, str, int], Awaitable[None]] | None = None

    def add_address(self, address: str):
        """Add address to monitor"""
        self.monitored_addresses.add(address)

    def remove_address(self, address: str):
        """Remove address from monitoring"""
        self.monitored_addresses.discard(address)

    def add_invoice(self, invoice: str):
        """Add Lightning invoice to monitor (alias for add_address)"""
        self.add_address(invoice)

    @abstractmethod
    async def start_listening(self, callback: Callable[[str, str, str, int], Awaitable[None]]):
        """Start listening for payments"""
        pass
