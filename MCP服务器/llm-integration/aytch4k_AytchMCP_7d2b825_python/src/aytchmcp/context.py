"""
Context module for AytchMCP.

This module provides the Context object that gives tools and resources
access to MCP capabilities.
"""

from typing import Any, Dict, Optional, TypeVar, Generic, List, Union
import uuid

from loguru import logger
from pydantic import BaseModel

from aytchmcp.config import config


T = TypeVar("T")


class Context:
    """
    Context object for AytchMCP tools and resources.
    
    This object provides access to MCP capabilities and additional
    functionality specific to AytchMCP.
    """

    def __init__(self, user_id: Optional[str] = None, conversation_id: Optional[str] = None, request_id: Optional[str] = None):
        """
        Initialize the Context object.
        
        Args:
            user_id: The user ID.
            conversation_id: The conversation ID.
            request_id: The request ID.
        """
        self._user_id = user_id or str(uuid.uuid4())
        self._conversation_id = conversation_id or str(uuid.uuid4())
        self._request_id = request_id or str(uuid.uuid4())
        self._cache: Dict[str, Any] = {}

    @property
    def user_id(self) -> str:
        """Get the user ID."""
        return self._user_id

    @property
    def conversation_id(self) -> str:
        """Get the conversation ID."""
        return self._conversation_id

    @property
    def request_id(self) -> str:
        """Get the request ID."""
        return self._request_id

    async def get_llm_response(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> str:
        """
        Get a response from the LLM.
        
        Args:
            prompt: The prompt to send to the LLM.
            model: The model to use. If None, uses the configured model.
            temperature: The temperature to use for generation.
            max_tokens: The maximum number of tokens to generate.
            **kwargs: Additional parameters to pass to the LLM.
            
        Returns:
            The LLM response.
        """
        # Use the configured LLM provider
        provider = config.llm.provider
        model = model or config.llm.model
        
        # Get the API key from the environment variable
        import os
        api_key = os.environ.get(config.llm.api_key_env_var)
        
        if not api_key:
            logger.warning(f"API key not found in environment variable {config.llm.api_key_env_var}")
            return "Error: API key not configured"
        
        # Merge additional parameters from config and kwargs
        params = {**config.llm.additional_params, **kwargs}
        
        # Call the appropriate LLM provider
        if provider == "openai":
            return await self._call_openai(prompt, model, api_key, temperature, max_tokens, params)
        elif provider == "anthropic":
            return await self._call_anthropic(prompt, model, api_key, temperature, max_tokens, params)
        elif provider == "openrouter":
            return await self._call_openrouter(prompt, model, api_key, temperature, max_tokens, params)
        elif provider == "ninjachat":
            return await self._call_ninjachat(prompt, model, api_key, temperature, max_tokens, params)
        else:
            logger.error(f"Unsupported LLM provider: {provider}")
            return f"Error: Unsupported LLM provider: {provider}"

    async def _call_openai(
        self, 
        prompt: str, 
        model: str, 
        api_key: str, 
        temperature: float,
        max_tokens: Optional[int],
        params: Dict[str, Any]
    ) -> str:
        """Call the OpenAI API."""
        try:
            import openai
            
            openai.api_key = api_key
            if config.llm.api_base_url:
                openai.api_base = config.llm.api_base_url
            
            response = await openai.ChatCompletion.acreate(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens,
                **params
            )
            
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {e}")
            return f"Error calling OpenAI API: {str(e)}"

    async def _call_anthropic(
        self, 
        prompt: str, 
        model: str, 
        api_key: str, 
        temperature: float,
        max_tokens: Optional[int],
        params: Dict[str, Any]
    ) -> str:
        """Call the Anthropic API."""
        try:
            import anthropic
            
            client = anthropic.Anthropic(api_key=api_key)
            if config.llm.api_base_url:
                # Set custom API base URL if provided
                client.api_url = config.llm.api_base_url
            
            response = client.messages.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens or 1000,
                **params
            )
            
            return response.content[0].text
        except Exception as e:
            logger.error(f"Error calling Anthropic API: {e}")
            return f"Error calling Anthropic API: {str(e)}"
    
    async def _call_openrouter(
        self,
        prompt: str,
        model: str,
        api_key: str,
        temperature: float,
        max_tokens: Optional[int],
        params: Dict[str, Any]
    ) -> str:
        """Call the OpenRouter API."""
        try:
            import os
            import httpx
            
            # Get the model from environment variable if not specified
            if model == "openrouter":
                env_var = config.llm.openrouter_model_env_var
                model = os.environ.get(env_var, "openai/gpt-4-turbo")
            
            # Prepare the API URL
            api_url = config.llm.api_base_url or "https://openrouter.ai/api/v1/chat/completions"
            
            # Prepare the request payload
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature,
                "max_tokens": max_tokens or 1000,
                **params
            }
            
            # Prepare headers
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://aytch4k.com",  # Replace with your site URL
                "X-Title": config.branding.name
            }
            
            # Make the API call
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    api_url,
                    json=payload,
                    headers=headers
                )
                
                response.raise_for_status()
                result = response.json()
                
                return result["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Error calling OpenRouter API: {e}")
            return f"Error calling OpenRouter API: {str(e)}"
    
    async def _call_ninjachat(
        self,
        prompt: str,
        model: str,
        api_key: str,
        temperature: float,
        max_tokens: Optional[int],
        params: Dict[str, Any]
    ) -> str:
        """Call the NinjaChat API."""
        try:
            import os
            import httpx
            
            # Get the model from environment variable if not specified
            if model == "ninjachat":
                env_var = config.llm.ninjachat_model_env_var
                model = os.environ.get(env_var, "default-model")
            
            # Prepare the API URL
            api_url = config.llm.api_base_url or "https://api.ninjachat.ai/api/chat"
            
            # Prepare the request payload
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature,
                "max_tokens": max_tokens or 1000,
                **params
            }
            
            # Prepare headers
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            # Make the API call
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    api_url,
                    json=payload,
                    headers=headers
                )
                
                response.raise_for_status()
                result = response.json()
                
                # Extract the response content based on NinjaChat's API response format
                # Adjust this based on the actual response structure
                return result["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Error calling NinjaChat API: {e}")
            return f"Error calling NinjaChat API: {str(e)}"

    def cache_get(self, key: str, default: Optional[T] = None) -> Optional[T]:
        """
        Get a value from the cache.
        
        Args:
            key: The cache key.
            default: The default value to return if the key is not found.
            
        Returns:
            The cached value, or the default if not found.
        """
        return self._cache.get(key, default)

    def cache_set(self, key: str, value: Any) -> None:
        """
        Set a value in the cache.
        
        Args:
            key: The cache key.
            value: The value to cache.
        """
        self._cache[key] = value

    def cache_delete(self, key: str) -> None:
        """
        Delete a value from the cache.
        
        Args:
            key: The cache key.
        """
        if key in self._cache:
            del self._cache[key]

    def log(self, message: str, level: str = "INFO") -> None:
        """
        Log a message.
        
        Args:
            message: The message to log.
            level: The log level.
        """
        log_func = getattr(logger, level.lower())
        log_func(f"[{self.user_id}] {message}")

    def get_config(self) -> Dict[str, Any]:
        """
        Get the current configuration.
        
        Returns:
            The current configuration as a dictionary.
        """
        return config.model_dump()