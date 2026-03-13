import logging
import sys
import json
from datetime import datetime

class JsonFormatter(logging.Formatter):
    """
    JSON formatter for structured logging.
    Ensure observability and determinism without external dependencies.
    """
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "module": record.module,
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

def setup_logger(name="nexus", level=logging.INFO):
    """
    Sets up a logger with a standard stream handler and a JSON formatter.
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Avoid adding multiple handlers if already setup
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)

        # Determine format based on environment (simple for dev, json for structured)
        # Here we stick to a clear text format for CLI readability as requested,
        # but structured enough to parse.
        formatter = logging.Formatter(
            '[%(asctime)s] [%(levelname)s] [%(module)s] %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger

# Global default logger
logger = setup_logger()
