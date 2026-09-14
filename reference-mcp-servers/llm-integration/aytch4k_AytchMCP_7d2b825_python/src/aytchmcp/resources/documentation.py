"""
Documentation Resource for AytchMCP.

This resource provides documentation to LLMs.
"""

import os
from pathlib import Path
from typing import Dict, List, Optional, Any

from fastmcp.resources import Resource
from pydantic import BaseModel, Field

from aytchmcp.context import Context
from aytchmcp.config import config


class DocumentationEntry(BaseModel):
    """Documentation entry model."""
    
    title: str = Field(description="The title of the documentation entry")
    content: str = Field(description="The content of the documentation entry")
    path: str = Field(description="The path to the documentation file")
    tags: List[str] = Field(description="Tags associated with the documentation entry")
    last_modified: str = Field(description="Last modified timestamp")


class DocumentationResponse(BaseModel):
    """Documentation response model."""
    
    entries: List[DocumentationEntry] = Field(
        description="List of documentation entries"
    )
    total_entries: int = Field(description="Total number of documentation entries")
    query: Optional[str] = Field(
        description="The query used to filter documentation entries"
    )


class DocumentationResource(Resource):
    """Resource that provides documentation."""
    
    name: str = "documentation"
    description: str = "Provides documentation for the MCP server and its components"
    response_model: type[DocumentationResponse] = DocumentationResponse
    uri: str = "docs://content"
    
    async def read(
        self, context: Context, query: Optional[str] = None, tags: Optional[List[str]] = None
    ) -> DocumentationResponse:
        """
        Fetch documentation.
        
        Args:
            context: The context object.
            query: Optional query to filter documentation entries.
            tags: Optional tags to filter documentation entries.
            
        Returns:
            Documentation entries.
        """
        # Get documentation entries
        entries = self._get_documentation_entries(query, tags)
        
        return DocumentationResponse(
            entries=entries,
            total_entries=len(entries),
            query=query,
        )
    
    def _get_documentation_entries(
        self, query: Optional[str] = None, tags: Optional[List[str]] = None
    ) -> List[DocumentationEntry]:
        """
        Get documentation entries.
        
        Args:
            query: Optional query to filter documentation entries.
            tags: Optional tags to filter documentation entries.
            
        Returns:
            List of documentation entries.
        """
        entries = []
        
        # Get documentation directory
        docs_dir = self._get_docs_dir()
        
        if not docs_dir.exists():
            return entries
        
        # Get all markdown files
        markdown_files = list(docs_dir.glob("**/*.md"))
        
        for file_path in markdown_files:
            # Read file content
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Extract title from first line
            title = content.split("\n")[0].strip("# ")
            
            # Extract tags from frontmatter
            file_tags = self._extract_tags(content)
            
            # Filter by tags if provided
            if tags and not any(tag in file_tags for tag in tags):
                continue
            
            # Filter by query if provided
            if query and query.lower() not in content.lower() and query.lower() not in title.lower():
                continue
            
            # Get last modified timestamp
            last_modified = os.path.getmtime(file_path)
            last_modified_str = str(last_modified)
            
            # Create entry
            entry = DocumentationEntry(
                title=title,
                content=content,
                path=str(file_path.relative_to(docs_dir)),
                tags=file_tags,
                last_modified=last_modified_str,
            )
            
            entries.append(entry)
        
        return entries
    
    def _get_docs_dir(self) -> Path:
        """
        Get the documentation directory.
        
        Returns:
            Path to the documentation directory.
        """
        # Check if docs directory is specified in config
        config_path = os.environ.get("CONFIG_PATH", "./config")
        config_path = Path(config_path)
        
        # Check if docs directory is specified in config
        docs_config_path = config_path / "docs.json"
        if docs_config_path.exists():
            import json
            
            with open(docs_config_path, "r") as f:
                docs_config = json.load(f)
                
                if "docs_dir" in docs_config:
                    return Path(docs_config["docs_dir"])
        
        # Default to docs directory in the project root
        return Path("./docs")
    
    def _extract_tags(self, content: str) -> List[str]:
        """
        Extract tags from frontmatter.
        
        Args:
            content: The content to extract tags from.
            
        Returns:
            List of tags.
        """
        tags = []
        
        # Check if content has frontmatter
        if content.startswith("---"):
            # Extract frontmatter
            frontmatter_end = content.find("---", 3)
            if frontmatter_end != -1:
                frontmatter = content[3:frontmatter_end].strip()
                
                # Extract tags
                for line in frontmatter.split("\n"):
                    if line.startswith("tags:"):
                        tags_str = line[5:].strip()
                        
                        # Parse tags
                        if tags_str.startswith("[") and tags_str.endswith("]"):
                            # Array format: tags: [tag1, tag2]
                            tags = [tag.strip().strip("'\"") for tag in tags_str[1:-1].split(",")]
                        else:
                            # List format: tags: tag1, tag2
                            tags = [tag.strip().strip("'\"") for tag in tags_str.split(",")]
        
        return tags