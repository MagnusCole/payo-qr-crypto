# Payo Backend - Logging Configuration

import logging
import logging.config
from pathlib import Path
import json
from typing import Dict, Any

def setup_logging(log_level: str = "INFO", log_to_file: bool = False) -> None:
    """Setup logging configuration"""

    # Create logs directory
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)

    # Base logging configuration
    config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            },
            "json": {
                "format": json.dumps({
                    "timestamp": "%(asctime)s",
                    "level": "%(levelname)s",
                    "logger": "%(name)s",
                    "message": "%(message)s",
                    "module": "%(module)s",
                    "function": "%(funcName)s",
                    "line": "%(lineno)d"
                })
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": log_level,
                "formatter": "detailed"
            }
        },
        "root": {
            "level": log_level,
            "handlers": ["console"]
        },
        "loggers": {
            "app": {
                "level": log_level,
                "handlers": ["console"],
                "propagate": False
            },
            "uvicorn": {
                "level": log_level,
                "handlers": ["console"],
                "propagate": False
            },
            "sqlalchemy": {
                "level": "WARNING",
                "handlers": ["console"],
                "propagate": False
            }
        }
    }

    # Add file handler if requested
    if log_to_file:
        config["handlers"]["file"] = {
            "class": "logging.FileHandler",
            "level": log_level,
            "formatter": "json",
            "filename": "logs/payo_backend.log"
        }
        config["root"]["handlers"].append("file")
        config["loggers"]["app"]["handlers"].append("file")
        config["loggers"]["uvicorn"]["handlers"].append("file")

    logging.config.dictConfig(config)

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)
