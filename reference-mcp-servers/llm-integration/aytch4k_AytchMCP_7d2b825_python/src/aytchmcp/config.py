"""
Configuration module for AytchMCP.

This module handles loading configuration from various sources:
1. Default configuration
2. Configuration files
3. Environment variables
"""

import os
import json
from pathlib import Path
from typing import Any, Dict, Optional, Union

from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Load environment variables from .env file if it exists
load_dotenv()


class BrandingConfig(BaseModel):
    """Branding configuration."""

    name: str = Field(default="Aytch4K MCP", description="Name of the MCP server")
    description: str = Field(
        default="Aytch4K Model Context Protocol Server",
        description="Description of the MCP server",
    )
    logo_url: Optional[str] = Field(
        default=None, description="URL to the logo image"
    )
    primary_color: str = Field(
        default="#4A90E2", description="Primary brand color (hex)"
    )
    secondary_color: str = Field(
        default="#50E3C2", description="Secondary brand color (hex)"
    )


class LLMConfig(BaseModel):
    """LLM integration configuration."""

    provider: str = Field(
        default="openai",
        description="LLM provider (openai, anthropic, openrouter, ninjachat, etc.)"
    )
    model: str = Field(
        default="gpt-4",
        description="Model name to use"
    )
    api_key_env_var: str = Field(
        default="OPENAI_API_KEY",
        description="Environment variable name for the API key",
    )
    api_base_url: Optional[str] = Field(
        default=None,
        description="Base URL for the API (if not default)"
    )
    additional_params: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional parameters for the LLM"
    )
    # OpenRouter specific configuration
    openrouter_model_env_var: str = Field(
        default="OPENROUTER_MODEL",
        description="Environment variable name for the OpenRouter model",
    )
    # NinjaChat specific configuration
    ninjachat_model_env_var: str = Field(
        default="NINJACHAT_MODEL",
        description="Environment variable name for the NinjaChat model",
    )


class ServerConfig(BaseModel):
    """Server configuration."""

    host: str = Field(
        default="0.0.0.0", description="Host to bind the server to"
    )
    port: int = Field(default=8000, description="Port to bind the server to")
    log_level: str = Field(
        default="INFO", description="Logging level"
    )
    debug: bool = Field(default=False, description="Enable debug mode")
    cors_origins: list[str] = Field(
        default=["*"], description="CORS allowed origins"
    )
    max_request_size: int = Field(
        default=10 * 1024 * 1024, description="Maximum request size in bytes"
    )


class MCPConfig(BaseModel):
    """MCP configuration."""

    branding: BrandingConfig = Field(default_factory=BrandingConfig)
    llm: LLMConfig = Field(default_factory=LLMConfig)
    server: ServerConfig = Field(default_factory=ServerConfig)
    tools_enabled: list[str] = Field(
        default=["echo", "weather", "calculator"],
        description="List of enabled tools",
    )
    resources_enabled: list[str] = Field(
        default=["system_info", "documentation"],
        description="List of enabled resources",
    )


def load_config(config_path: Optional[Union[str, Path]] = None) -> MCPConfig:
    """
    Load configuration from various sources.

    Args:
        config_path: Path to the configuration directory or file.
            If a directory, it will look for config.json, branding.json, llm.json.
            If a file, it will load that specific file.
            If None, it will use the CONFIG_PATH environment variable or default to ./config.

    Returns:
        MCPConfig: The loaded configuration.
    """
    # Default configuration
    config = MCPConfig()

    # Determine config path
    if config_path is None:
        config_path = os.environ.get("CONFIG_PATH", "./config")
    
    config_path = Path(config_path)

    # Load from config files
    if config_path.is_dir():
        # Load main config if it exists
        main_config_path = config_path / "config.json"
        if main_config_path.exists():
            with open(main_config_path, "r") as f:
                config_dict = json.load(f)
                config = MCPConfig.model_validate(config_dict)

        # Load branding config if it exists
        branding_config_path = config_path / "branding.json"
        if branding_config_path.exists():
            with open(branding_config_path, "r") as f:
                branding_dict = json.load(f)
                config.branding = BrandingConfig.model_validate(branding_dict)

        # Load LLM config if it exists
        llm_config_path = config_path / "llm.json"
        if llm_config_path.exists():
            with open(llm_config_path, "r") as f:
                llm_dict = json.load(f)
                config.llm = LLMConfig.model_validate(llm_dict)

        # Load server config if it exists
        server_config_path = config_path / "server.json"
        if server_config_path.exists():
            with open(server_config_path, "r") as f:
                server_dict = json.load(f)
                config.server = ServerConfig.model_validate(server_dict)
    elif config_path.is_file():
        # Load from a single config file
        with open(config_path, "r") as f:
            config_dict = json.load(f)
            config = MCPConfig.model_validate(config_dict)

    # Override with environment variables
    if "MCP_HOST" in os.environ:
        config.server.host = os.environ["MCP_HOST"]
    if "MCP_PORT" in os.environ:
        config.server.port = int(os.environ["MCP_PORT"])
    if "LOG_LEVEL" in os.environ:
        config.server.log_level = os.environ["LOG_LEVEL"]
    if "DEBUG" in os.environ:
        config.server.debug = os.environ["DEBUG"].lower() in ("true", "1", "yes")

    return config


# Global configuration instance
config = load_config()