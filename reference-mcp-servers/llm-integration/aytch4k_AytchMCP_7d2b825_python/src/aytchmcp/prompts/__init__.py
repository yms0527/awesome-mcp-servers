"""
Prompts module for AytchMCP.

This module provides reusable templates that help LLMs interact with the server effectively.
"""

from typing import Dict, Any, Optional, List
from pathlib import Path
import os
import json

from loguru import logger


class PromptTemplate:
    """
    Prompt template class.
    
    This class represents a reusable prompt template that can be filled with variables.
    """
    
    def __init__(self, template: str, name: str = "", description: str = ""):
        """
        Initialize a prompt template.
        
        Args:
            template: The template string with placeholders.
            name: The name of the template.
            description: The description of the template.
        """
        self.template = template
        self.name = name
        self.description = description
    
    def format(self, **kwargs) -> str:
        """
        Format the template with the provided variables.
        
        Args:
            **kwargs: Variables to use in the template.
            
        Returns:
            The formatted prompt.
        """
        return self.template.format(**kwargs)


class PromptLibrary:
    """
    Prompt library class.
    
    This class provides access to a library of prompt templates.
    """
    
    def __init__(self):
        """Initialize the prompt library."""
        self._prompts: Dict[str, PromptTemplate] = {}
        self._load_prompts()
    
    def _load_prompts(self):
        """Load prompts from the prompts directory."""
        # Get prompts directory
        prompts_dir = self._get_prompts_dir()
        
        if not prompts_dir.exists():
            logger.warning(f"Prompts directory not found: {prompts_dir}")
            return
        
        # Load prompts from JSON files
        for file_path in prompts_dir.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    prompt_data = json.load(f)
                
                # Create prompt template
                template = PromptTemplate(
                    template=prompt_data["template"],
                    name=prompt_data.get("name", file_path.stem),
                    description=prompt_data.get("description", ""),
                )
                
                # Add to library
                self._prompts[template.name] = template
                logger.info(f"Loaded prompt template: {template.name}")
            except Exception as e:
                logger.error(f"Error loading prompt template from {file_path}: {e}")
        
        # Load prompts from text files
        for file_path in prompts_dir.glob("*.txt"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    template_text = f.read()
                
                # Create prompt template
                template = PromptTemplate(
                    template=template_text,
                    name=file_path.stem,
                    description="",
                )
                
                # Add to library
                self._prompts[template.name] = template
                logger.info(f"Loaded prompt template: {template.name}")
            except Exception as e:
                logger.error(f"Error loading prompt template from {file_path}: {e}")
    
    def _get_prompts_dir(self) -> Path:
        """
        Get the prompts directory.
        
        Returns:
            Path to the prompts directory.
        """
        # Check if prompts directory is specified in config
        config_path = os.environ.get("CONFIG_PATH", "./config")
        config_path = Path(config_path)
        
        # Check if prompts directory is specified in config
        prompts_config_path = config_path / "prompts.json"
        if prompts_config_path.exists():
            try:
                with open(prompts_config_path, "r") as f:
                    prompts_config = json.load(f)
                    
                    if "prompts_dir" in prompts_config:
                        return Path(prompts_config["prompts_dir"])
            except Exception as e:
                logger.error(f"Error loading prompts config: {e}")
        
        # Default to prompts directory in the project root
        return Path("./prompts")
    
    def get(self, name: str) -> Optional[PromptTemplate]:
        """
        Get a prompt template by name.
        
        Args:
            name: The name of the prompt template.
            
        Returns:
            The prompt template, or None if not found.
        """
        return self._prompts.get(name)
    
    def list(self) -> List[str]:
        """
        List all available prompt templates.
        
        Returns:
            A list of prompt template names.
        """
        return list(self._prompts.keys())


# Global prompt library instance
prompt_library = PromptLibrary()