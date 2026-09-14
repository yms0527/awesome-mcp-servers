import os
import threading
import logging
from typing import Optional, List, Callable, Any

logger = logging.getLogger(__name__)

SILICONFLOW_API_KEYS_ENV_VAR: str = "SILICONFLOW_API_KEYS"

SILICONFLOW_API_BASE_URL: str = "https://api.siliconflow.cn"
SILICONFLOW_IMAGE_GENERATION_ENDPOINT: str = "/v1/images/generations"

SUPPORTED_MODEL_IDS: List[str] = [
    "black-forest-labs/FLUX.1-schnell",
    "black-forest-labs/FLUX.1-dev",
    "Pro/black-forest-labs/FLUX.1-schnell",
    "LoRA/black-forest-labs/FLUX.1-dev",
]
DEFAULT_MODEL_ID_FALLBACK: str = "black-forest-labs/FLUX.1-schnell"
DEFAULT_NUM_INFERENCE_STEPS_FALLBACK: int = 20
DEFAULT_GUIDANCE_SCALE_FALLBACK: float = 7.5
DEFAULT_BATCH_SIZE: int = 1

ASPECT_RATIO_TO_RESOLUTION: dict[str, str] = {
    "1:1": "1024x1024", "1:2": "512x1024", "3:2": "768x512",
    "3:4": "768x1024", "16:9": "1024x576", "9:16": "576x1024",
}
SUPPORTED_ASPECT_RATIOS: List[str] = list(ASPECT_RATIO_TO_RESOLUTION.keys())
DEFAULT_ASPECT_RATIO_FALLBACK: str = "1:1"

_api_keys_list: List[str] = []
_current_key_index: int = 0
_key_lock = threading.Lock()

def load_api_keys_from_env():
    global _api_keys_list, _current_key_index
    keys_str = os.getenv(SILICONFLOW_API_KEYS_ENV_VAR)
    if keys_str:
        _api_keys_list = [key.strip() for key in keys_str.split(',') if key.strip()]
        _current_key_index = 0
        if _api_keys_list:
            logger.info(f"Successfully loaded {len(_api_keys_list)} SiliconFlow API Key(s).")
        else:
            logger.warning(f"{SILICONFLOW_API_KEYS_ENV_VAR} set but no valid keys found.")
    else:
        _api_keys_list = [] 

def get_next_api_key() -> Optional[str]:
    global _current_key_index
    with _key_lock:
        if not _api_keys_list:
            return None
        key_to_use = _api_keys_list[_current_key_index]
        _current_key_index = (_current_key_index + 1) % len(_api_keys_list)
        return key_to_use

DEFAULT_HTTP_HOST: str = "0.0.0.0"
DEFAULT_HTTP_PORT: int = 8080

def get_env_or_fallback(var_name: str, fallback_value: Any, cast_type: Callable[[str], Any] = str) -> Any:
    value_str = os.getenv(var_name)
    if value_str is not None:
        try: return cast_type(value_str)
        except ValueError:
            logging.getLogger(__name__).warning( 
                f"Cannot cast env var '{var_name}' ('{value_str}') to {cast_type.__name__}. Using fallback: {fallback_value}"
            )
            return fallback_value
    return fallback_value

APP_DEFAULT_MODEL_ID: str = get_env_or_fallback("DEFAULT_MODEL_ID", DEFAULT_MODEL_ID_FALLBACK)
if APP_DEFAULT_MODEL_ID not in SUPPORTED_MODEL_IDS:
    logging.getLogger(__name__).warning(
        f"DEFAULT_MODEL_ID ('{APP_DEFAULT_MODEL_ID}') from .env is not in SUPPORTED_MODEL_IDS. "
        f"Using fallback: {DEFAULT_MODEL_ID_FALLBACK}."
    )
    APP_DEFAULT_MODEL_ID = DEFAULT_MODEL_ID_FALLBACK

APP_DEFAULT_ASPECT_RATIO: str = get_env_or_fallback("DEFAULT_ASPECT_RATIO", DEFAULT_ASPECT_RATIO_FALLBACK)
if APP_DEFAULT_ASPECT_RATIO not in SUPPORTED_ASPECT_RATIOS:
    logging.getLogger(__name__).warning(
        f"DEFAULT_ASPECT_RATIO ('{APP_DEFAULT_ASPECT_RATIO}') from .env is not a supported ratio. "
        f"Using fallback: {DEFAULT_ASPECT_RATIO_FALLBACK}."
    )
    APP_DEFAULT_ASPECT_RATIO = DEFAULT_ASPECT_RATIO_FALLBACK

APP_DEFAULT_NUM_INFERENCE_STEPS: int = get_env_or_fallback(
    "DEFAULT_NUM_INFERENCE_STEPS", DEFAULT_NUM_INFERENCE_STEPS_FALLBACK, int
)
APP_DEFAULT_GUIDANCE_SCALE: float = get_env_or_fallback(
    "DEFAULT_GUIDANCE_SCALE", DEFAULT_GUIDANCE_SCALE_FALLBACK, float
)

def log_effective_defaults():
    logger.info(f"Effective APP_DEFAULT_MODEL_ID: {APP_DEFAULT_MODEL_ID}")
    logger.info(f"Effective APP_DEFAULT_ASPECT_RATIO: {APP_DEFAULT_ASPECT_RATIO}")
    logger.info(f"Effective APP_DEFAULT_NUM_INFERENCE_STEPS: {APP_DEFAULT_NUM_INFERENCE_STEPS}")
    logger.info(f"Effective APP_DEFAULT_GUIDANCE_SCALE: {APP_DEFAULT_GUIDANCE_SCALE}")
