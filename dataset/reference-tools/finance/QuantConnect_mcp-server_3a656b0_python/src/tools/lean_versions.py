from api_connection import post
from models import LeanVersionsResponse 

def register_lean_version_tools(mcp):
    # Read
    @mcp.tool(
        annotations={'title': 'Read LEAN versions', 'readOnlyHint': True}
    )
    async def read_lean_versions() -> LeanVersionsResponse:
        """Returns a list of LEAN versions with basic information for 
        each version.
        """
        return await post('/lean/versions/read')
