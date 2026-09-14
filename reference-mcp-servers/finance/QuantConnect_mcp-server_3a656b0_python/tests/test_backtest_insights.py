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
    ReadBacktestInsightsRequest,
    BacktestInsightsResponse
)


# Static helpers for common operations:
class BacktestInsights:

    @staticmethod
    async def read(project_id, backtest_id, start=0, end=100):
        output_model = await validate_models(
            mcp, 'read_backtest_insights', 
            {
                'projectId': project_id, 
                'backtestId': backtest_id, 
                'start': start, 
                'end': end
            },
            BacktestInsightsResponse
        )
        return output_model.insights


# Test suite:
class TestBacktestInsights:

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        'language, algo', 
        [
            ('Py', 'insights.py'),
            ('C#', 'Insights.cs')
        ]
    )
    async def test_read_backtest_insights(self, language, algo):
        # Backtest and algorithm that emits insights.
        project_id, backtest_id = await Backtest.run_algorithm(language, algo)
        # Try to read the insights.
        insights = await BacktestInsights.read(project_id, backtest_id)
        assert len(insights) == 3
        source_model = 'ConstantAlphaModel(Price,Up,30.00:00:00,0.1,0.2)'
        for insight in insights:
            assert insight.sourceModel == source_model
            assert insight.symbol == 'SPY R735QTJ8XC9X'
            assert insight.type.value == 'price'
            assert insight.direction.value == 'up'
            assert insight.period == 2592000
            assert insight.magnitude == 0.1
            assert insight.confidence == 0.2
            assert insight.weight == 0.3
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language', ['Py', 'C#'])
    async def test_read_backtest_insights_with_invalid_args(self, language):
        # Run a backtest with the template algorithm.
        project_id, backtest_id = await Backtest.run_algorithm(language)
        # Test the invalid requests.
        tool_name = 'read_backtest_insights'
        class_ = ReadBacktestInsightsRequest
        minimal_payload = {
            'projectId': project_id,
            'backtestId': backtest_id,
            'start': 0,
            'end': 100
        }
        # Try to read the insights without providing all the required 
        # arguments.
        await ensure_request_raises_validation_error_when_omitting_an_arg(
            tool_name, class_, minimal_payload
        )
        await ensure_request_fails_when_including_an_invalid_arg(
            mcp, tool_name, minimal_payload, [
                # Try to read the insights from a project that doesn't 
                # exist.
                {'projectId': -1},
                # Try to read the insights from a backtest that doesn't 
                # exist.
                {'backtestId': ' '},
                # Try to read more than 100 insights at once.
                {'start': 0, 'end': 200}
            ]
        )
        # Delete the project to clean up.
        await Project.delete(project_id)
