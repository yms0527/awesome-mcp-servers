import pytest

from main import mcp
from utils import validate_models
from models import AccountResponse


class TestAccount:

    @pytest.mark.asyncio
    async def test_read_account(self):
        await validate_models(
            mcp, 'read_account', output_class=AccountResponse
        )
