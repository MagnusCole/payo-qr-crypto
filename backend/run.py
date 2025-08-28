#!/usr/bin/env python3
"""
Script to run the Payo backend server
"""

import os
import logging
from pathlib import Path
from dotenv import load_dotenv
import uvicorn
from app.main import app

# Load environment variables
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(env_path)

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv("LOG_LEVEL", "INFO").upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("logs/payo_backend.log", mode='a') if os.getenv("LOG_TO_FILE", "false").lower() == "true" else logging.NullHandler()
    ]
)

logger = logging.getLogger(__name__)

def create_logs_dir():
    """Create logs directory if it doesn't exist"""
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)

def main():
    """Main function to run the server"""
    create_logs_dir()

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"

    logger.info(f"Starting Payo Backend Server on {host}:{port}")
    logger.info(f"Debug mode: {debug}")

    if debug:
        logger.info("Running in development mode with auto-reload")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level=os.getenv("LOG_LEVEL", "info").lower(),
        access_log=True
    )

if __name__ == "__main__":
    main()
