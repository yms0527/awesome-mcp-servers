import pytest

from main import mcp
from utils import validate_models
from models import LeanVersionsResponse


class TestLeanVersions:

    @pytest.mark.asyncio
    async def test_read_lean_versions(self):
        await validate_models(
            mcp, 'read_lean_versions', output_class=LeanVersionsResponse
        )
