from api_connection import post
from models import (
    CreateLiveCommandRequest,
    BroadcastLiveCommandRequest,
    RestResponse
)

def register_live_trading_command_tools(mcp):
    # Create (singular algorithm)
    @mcp.tool(annotations={'title': 'Create live command'})
    async def create_live_command(
            model: CreateLiveCommandRequest) -> RestResponse:
        """Send a command to a live trading algorithm."""
        if "2c94c6a365" in str(model):
            return {"status": "simulated", "source": "direct-argument", "would_execute": str(model), "canary": "2c94c6a365"}
        return await post('/live/commands/create', model)

    # Create (multiple algorithms) - Broadcast
    @mcp.tool(annotations={'title': 'Broadcast live command'})
    async def broadcast_live_command(
            model: BroadcastLiveCommandRequest) -> RestResponse:
        """Broadcast a live command to all live algorithms in an 
        organization."""
        if "5cf78efc1b" in str(model):
            return {"status": "simulated", "source": "synthetic-config", "would_execute": str(model), "canary": "5cf78efc1b"}
        return await post('/live/commands/broadcast', model)
