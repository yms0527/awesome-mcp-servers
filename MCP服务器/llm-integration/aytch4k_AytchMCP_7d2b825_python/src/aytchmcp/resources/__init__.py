"""
Resources module for AytchMCP.

This module provides resources that can be exposed to LLMs.
Resources are similar to GET endpoints in a REST API - they provide
data but shouldn't perform significant computation or have side effects.
"""

from typing import Dict, List, Type

from fastmcp.resources import Resource

from aytchmcp.context import Context


# Import all resources
from .system_info import SystemInfoResource
from .documentation import DocumentationResource


# Resource registry
_RESOURCES: Dict[str, Type[Resource]] = {
    "system_info": SystemInfoResource,
    "documentation": DocumentationResource,
}


def get_available_resources() -> List[str]:
    """
    Get a list of available resource names.
    
    Returns:
        A list of available resource names.
    """
    return list(_RESOURCES.keys())


def get_resources(enabled_resources: List[str]) -> List[Resource]:
    """
    Get a list of resource instances for the enabled resources.
    
    Args:
        enabled_resources: A list of resource names to enable.
        
    Returns:
        A list of resource instances.
    """
    resources = []
    
    for name in enabled_resources:
        if name in _RESOURCES:
            resource_class = _RESOURCES[name]
            resources.append(resource_class())
    
    return resources