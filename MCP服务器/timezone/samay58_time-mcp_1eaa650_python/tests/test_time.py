import asyncio
import json
import pytest
from src.time_mcp.tools import get_current_time
from src.time_mcp.models import TimeRequest


@pytest.mark.asyncio
async def test_get_current_time():
    # Create a test request for a known timezone (e.g., "America/New_York")
    params = TimeRequest(timezone="America/New_York")
    result = await get_current_time(params)
    data = json.loads(result)

    # Assert that the timezone matches and current_time is present
    assert data["timezone"] == "America/New_York"
    assert "T" in data["current_time"]  # ISO format check


if __name__ == "__main__":
    asyncio.run(test_get_current_time())
    print("Test passed!")
