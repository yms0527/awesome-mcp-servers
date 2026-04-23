from api_connection import post
from models import AccountResponse

def register_account_tools(mcp):
    # Read
    @mcp.tool(
        annotations={
            'title': 'Read account',
            'readOnlyHint': True,
            'openWorldHint': True
        }
    )
    async def read_account() -> AccountResponse:
        """Read the organization account status."""
        return await post('/account/read')
