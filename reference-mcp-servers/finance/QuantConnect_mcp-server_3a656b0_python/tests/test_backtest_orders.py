import pytest

from main import mcp
from test_project import Project
from test_backtests import Backtest
from utils import (
    validate_models, 
    ensure_request_raises_validation_error_when_omitting_an_arg,
    ensure_request_fails_when_including_an_invalid_arg
)
from models import (
    ReadBacktestOrdersRequest,
    BacktestOrdersResponse
)


# Static helpers for common operations:
class BacktestOrders:

    @staticmethod
    async def read(project_id, backtest_id, start=0, end=100):
        output_model = await validate_models(
            mcp, 'read_backtest_orders', 
            {
                'projectId': project_id, 
                'backtestId': backtest_id, 
                'start': start, 
                'end': end
            },
            BacktestOrdersResponse
        )
        return output_model.orders


# Test suite:
class TestBacktestOrders:

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        'language, algo', 
        [
            ('Py', 'order_properties.py'),
            ('C#', 'OrderProperties.cs')
        ]
    )
    async def test_read_backtest_orders(self, language, algo):
        # Backtest the template algorithm.
        project_id, backtest_id = await Backtest.run_algorithm(language)
        # Try to read the orders.
        await BacktestOrders.read(project_id, backtest_id)
        # Delete the project to clean up.
        await Project.delete(project_id)
        # Try to read orders from an algorithm that uses order 
        # properties.
        project_id, backtest_id = await Backtest.run_algorithm(language, algo)
        orders = (await BacktestOrders.read(project_id, backtest_id))
        assert len(orders) > 0
        for order in orders:
            assert order.quantity == 1
            assert order.tag == 'some tag'
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language', ['Py', 'C#'])
    async def test_read_backtest_orders_with_invalid_args(self, language):
        # Start a backtest using the default algorithm template.
        project_id, backtest_id = await Backtest.run_algorithm(
            language, wait_to_complete=False
        )
        # Test the invalid requests.
        tool_name = 'read_backtest_orders'
        class_ = ReadBacktestOrdersRequest
        minimal_payload = {
            'projectId': project_id,
            'backtestId': backtest_id,
            'start': 0,
            'end': 100
        }
        await ensure_request_raises_validation_error_when_omitting_an_arg(
            tool_name, class_, minimal_payload
        )
        await ensure_request_fails_when_including_an_invalid_arg(
            mcp, tool_name, minimal_payload, [
                # Try to read the orders from a backtest that doesn't 
                # exist.
                {'backtestId': ' '},
                # Try to read more than 100 orders at once.
                {'start': 0, 'end': 200}
            ]
        )
        # Delete the project to clean up.
        await Project.delete(project_id)
