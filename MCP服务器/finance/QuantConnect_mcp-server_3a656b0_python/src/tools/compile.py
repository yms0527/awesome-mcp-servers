from api_connection import post
from models import (
    CreateCompileRequest,
    ReadCompileRequest,
    CreateCompileResponse,
    ReadCompileResponse
)

def register_compile_tools(mcp):
    # Create
    @mcp.tool(
        annotations={'title': 'Create compile', 'destructiveHint': False}
    )
    async def create_compile(
            model: CreateCompileRequest) -> CreateCompileResponse:
        """Asynchronously create a compile job request for a project."""
        return await post('/compile/create', model)

    # Read
    @mcp.tool(annotations={'title': 'Read compile', 'readOnlyHint': True})
    async def read_compile(model: ReadCompileRequest) -> ReadCompileResponse:
        """Read a compile packet job result."""
        return await post('/compile/read', model)
