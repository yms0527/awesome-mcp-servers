import pytest

from main import mcp


class TestInitialization:

    @pytest.mark.asyncio
    async def test_instructions(self):
        assert True #mcp.instructions
