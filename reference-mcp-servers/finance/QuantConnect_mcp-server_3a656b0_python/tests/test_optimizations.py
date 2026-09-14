import pytest
from time import sleep

from main import mcp
from test_project import Project
from test_files import Files
from test_backtests import Backtest
from utils import (
    validate_models, 
    ensure_request_fails, 
    ensure_request_raises_validation_error,
    ensure_request_raises_validation_error_when_omitting_an_arg,
    ensure_request_fails_when_including_an_invalid_arg
)
from models import (
    EstimateOptimizationRequest,
    CreateOptimizationRequest,
    ReadOptimizationRequest,
    ListOptimizationRequest,
    EstimateOptimizationResponse,
    UpdateOptimizationRequest,
    AbortOptimizationRequest,
    DeleteOptimizationRequest,
    ListOptimizationResponse,
    ReadOptimizationResponse,
    RestResponse
)


TEST_ALGORITHMS = [
    ('Py', 'parameter_optimization.py'),
    ('C#', 'ParameterOptimization.cs')
]

DEFAULT_SETTINGS = {
    'target': 'TotalPerformance.PortfolioStatistics.SharpeRatio',
    'target_to': 'max',
    'strategy': 'QuantConnect.Optimizer.Strategies.GridSearchOptimizationStrategy',
    'parameters': [
        {'name': 'sma_slow', 'min': 252, 'max': 252+21, 'step': 21},
        {'name': 'sma_fast', 'min': 10, 'max': 110, 'step': 50},
    ],
    'node_type': 'O2-8',
    'parallel_nodes': 2,
    'name': 'Test Optimization',
    'estimated_cost': 1,
}

# Static helpers for common operations:
class Optimization:

    @staticmethod
    async def estimate(
            project_id, target, target_to, strategy, parameters, 
            name='Test Optimization', **kwargs):
        output_model = await validate_models(
            mcp, 'estimate_optimization_time',
            {
                'projectId': project_id,
                'name': name,
                'target': target,
                'targetTo': target_to, 
                'strategy': strategy,
                'parameters': parameters
            } | kwargs,
            EstimateOptimizationResponse
        )
        return output_model.estimate


    @staticmethod
    async def create(
            project_id, compile_id, 
            target=DEFAULT_SETTINGS['target'], 
            target_to=DEFAULT_SETTINGS['target_to'], 
            strategy=DEFAULT_SETTINGS['strategy'], 
            parameters=DEFAULT_SETTINGS['parameters'], 
            node_type=DEFAULT_SETTINGS['node_type'], 
            parallel_nodes=DEFAULT_SETTINGS['parallel_nodes'], 
            name=DEFAULT_SETTINGS['name'], 
            estimated_cost=DEFAULT_SETTINGS['estimated_cost'], 
            **kwargs):
        output_model = await validate_models(
            mcp, 'create_optimization', 
            {
                'projectId': project_id, 
                'target': target, 
                'targetTo': target_to,
                'strategy': strategy,
                'compileId': compile_id,
                'parameters': parameters,
                'estimatedCost': estimated_cost,
                'nodeType': node_type,
                'parallelNodes': parallel_nodes,
                'name': name
            } | kwargs,
            ListOptimizationResponse
        )
        return output_model.optimizations[0]

    @staticmethod
    async def read(optimization_id):
        output_model = await validate_models(
            mcp, 'read_optimization', {'optimizationId': optimization_id}, 
            ReadOptimizationResponse
        )
        return output_model.optimization

    @staticmethod
    async def update(optimization_id, name):
        return await validate_models(
            mcp, 'update_optimization', 
            {'optimizationId': optimization_id, 'name': name}, RestResponse
        )

    @staticmethod
    async def abort(optimization_id):
        return await validate_models(
            mcp, 'abort_optimization', {'optimizationId': optimization_id}, 
            RestResponse
        )

    @staticmethod
    async def delete(optimization_id):
        return await validate_models(
            mcp, 'delete_optimization', {'optimizationId': optimization_id}, 
            RestResponse
        )

    @staticmethod
    async def list(project_id):
        output_model = await validate_models(
            mcp, 'list_optimizations', {'projectId': project_id}, 
            ListOptimizationResponse
        )
        return output_model.optimizations

    @staticmethod
    async def wait_for_job_to_start(optimization_id):
        attempts = 0
        while attempts < 10:
            attempts += 1
            optimization = await Optimization.read(optimization_id)
            if optimization.status.value != 'new':
                return optimization
            sleep(18)
        assert False, "Optimization job didn't start in time."

    @staticmethod
    async def wait_for_job_to_complete(optimization_id):
        attempts = 0
        while attempts < 6*5:  # 5 minutes
            attempts += 1
            optimization = await Optimization.read(optimization_id)
            if optimization.status.value == 'completed':
                return optimization
            sleep(10)
        assert False, "Optimization job didn't complete in time."

    @staticmethod
    async def wait_for_job_to_abort(optimization_id):
        attempts = 0
        while attempts < 6:
            attempts += 1
            optimization = await Optimization.read(optimization_id)
            if optimization.status.value == 'aborted':
                return optimization
            sleep(5)
        assert False, "Optimization job didn't abort in time."

# Test suite:
class TestOptimization:

    async def _check_response(self, optimization):
        assert optimization.criterion.target.value == DEFAULT_SETTINGS['target']
        assert optimization.criterion.extremum.value == \
            DEFAULT_SETTINGS['target_to']
        parameters = DEFAULT_SETTINGS['parameters']
        assert len(optimization.parameters) == len(parameters)
        for input_p, output_p in zip(parameters, optimization.parameters):
            assert output_p.name == input_p['name']
            assert output_p.min == input_p['min']
            assert output_p.max == input_p['max']
            assert output_p.step == input_p['step']
        assert optimization.name == DEFAULT_SETTINGS['name']
        assert optimization.nodeType.value == DEFAULT_SETTINGS['node_type']

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language', ['Py', 'C#'])
    async def test_estimate_optimization(self, language):
        # Create a new project and backtest it.
        project_id, _ = await Backtest.run_algorithm(language)
        # Try to estimate the cost of an optimization job.
        await Optimization.estimate(
            project_id, 
            'TotalPerformance.PortfolioStatistics.SharpeRatio', 
            'max', 
            'QuantConnect.Optimizer.Strategies.GridSearchOptimizationStrategy', 
            [{'name': 'p', 'min': 0, 'max': 1, 'step': 1}]
        )
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language', ['Py', 'C#'])
    async def test_estimate_optimization_with_invalid_args(self, language):
        # Run a backtest with the template algorithm.
        project_id, _ = await Backtest.run_algorithm(language)
        # Test the invalid requests.
        tool_name = 'estimate_optimization_time'
        class_ = EstimateOptimizationRequest
        minimal_payload = {
            'projectId': project_id,
            'name': 'Test Optimization',
            'target': 'TotalPerformance.PortfolioStatistics.SharpeRatio',
            'targetTo': 'max', 
            'strategy': 'QuantConnect.Optimizer.Strategies.GridSearchOptimizationStrategy',
            'parameters': [{'name': 'p', 'min': 0, 'max': 1, 'step': 1}]
        }
        # Try to estimate the cost of an optimization without 
        # providing all the required arguments.
        await ensure_request_raises_validation_error_when_omitting_an_arg(
            tool_name, class_, minimal_payload
        )
        invalid_args = [
            # Try to estimate the cost of an optimization with an
            # unsupported strategy.
            {'strategy': 'QuantConnect.Optimizer.Strategies.EulerSearchOptimizationStrategy'},
            # Try to estimate the cost of an optimization with an
            # unsupported target.
            {'target': ' '},
            # Try to estimate the cost of an optimization with an
            # unsupported "targetTo" value.
            {'targetTo': ' '}
        ]
        for arg in invalid_args:
            await ensure_request_raises_validation_error(
                tool_name, class_, minimal_payload | arg
            )
        await ensure_request_fails_when_including_an_invalid_arg(
            mcp, tool_name, minimal_payload, [
                # Try to estimate the cost of an optimization for a 
                # project that doesn't exist.
                {'projectId': -1},
                # Try to estimate the cost of an optimization without 
                # any parameters.
                {'parameters': []}
            ]
        )
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_create_optimization(self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Try to create an optimization job.
        await self._check_response(
            await Optimization.create(project_id, compile_id)
        )
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_create_optimization_with_invalid_args(
            self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Test the invalid requests.
        tool_name = 'create_optimization'
        class_ = CreateOptimizationRequest
        minimal_payload = {
            'projectId': project_id,
            'name': 'Test Optimization',
            'target': 'TotalPerformance.PortfolioStatistics.SharpeRatio',
            'targetTo': 'max', 
            'strategy': 'QuantConnect.Optimizer.Strategies.GridSearchOptimizationStrategy',
            'parameters': [{'name': 'p', 'min': 0, 'max': 1, 'step': 1}],
            'compileId': compile_id,
            'estimatedCost': 1,
            'nodeType': 'O2-8',
            'parallelNodes': 2,
        }
        # Try to create an optimization without providing all the 
        # required arguments.
        await ensure_request_raises_validation_error_when_omitting_an_arg(
            tool_name, class_, minimal_payload
        )
        invalid_args = [
            # Try to optimize with an unsupported target.
            {'target': ' '},
            # Try to optimize with an unsupported `targetTo`.
            {'targetTo': ' '},
            # Try to optimize with an unsupported strategy.
            {'strategy': 'QuantConnect.Optimizer.Strategies.EulerSearchOptimizationStrategy'},
            # Try to optimize with in unsupported node type.
            {'nodeType': 'B2-8'}
        ]
        for arg in invalid_args:
            await ensure_request_raises_validation_error(
                tool_name, class_, minimal_payload | arg
            )
        await ensure_request_fails_when_including_an_invalid_arg(
            mcp, tool_name, minimal_payload, [
                # Try to optimize a project that doesn't exist.
                {'projectId': -1},
                # Try to optimize without any parameters.
                {'parameters': []}
            ]
        )
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_read_optimization(self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Start the optimization.
        opt_id = (
            await Optimization.create(project_id, compile_id)
        ).optimizationId
        # Try to read the optimziation.
        await self._check_response(
            await Optimization.wait_for_job_to_complete(opt_id)
        )
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    async def test_read_optimization_with_invalid_args(self):
        tool_name = 'read_optimization'
        # Try to read an optimization without providing the Id.
        await ensure_request_raises_validation_error(
            tool_name, ReadOptimizationRequest, {}
        )
        # Try to read an optimization that doesn't exist.
        await ensure_request_fails(mcp, tool_name, {'optimizationId': ' '})


    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_list_optimization(self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Try to list the optimizations of a project that has no
        # optimization results.
        optimizations = await Optimization.list(project_id)
        assert len(optimizations) == 0
        # Run the optimization.
        await Optimization.wait_for_job_to_complete(
            (await Optimization.create(project_id, compile_id)).optimizationId
        )
        # Try to list the optimizations of a project with some 
        # optimization results.
        optimizations = await Optimization.list(project_id)
        assert len(optimizations) == 1
        await self._check_response(optimizations[0])
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    async def test_list_optimizations_with_invalid_args(self):
        # Try to list optimizations without providing the project Id.
        await ensure_request_raises_validation_error(
            'list_optimizations', ListOptimizationRequest, {}
        )

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_update_optimization(self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Start the optimization.
        opt_id = (
            await Optimization.create(project_id, compile_id)
        ).optimizationId
        # Try to update the optimization name.
        name = 'New Optimization Name'
        await Optimization.update(opt_id, name)
        optimization = await Optimization.read(opt_id)
        assert optimization.name == name
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_update_optimization_with_invalid_args(
            self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Start the optimization.
        opt_id = (
            await Optimization.create(project_id, compile_id)
        ).optimizationId
        # Test the invalid requests.
        tool_name = 'update_optimization'
        class_ = UpdateOptimizationRequest
        minimal_payload = {'optimizationId': opt_id, 'name': 'New name'}
        # Try to update an optimization name without providing all the 
        # required arguments.
        await ensure_request_raises_validation_error_when_omitting_an_arg(
            tool_name, class_, minimal_payload
        )
        # Try to update an optimization that doesn't exist.
        await ensure_request_fails(
            mcp, tool_name, minimal_payload | {'optimizationId': ' '}
        )
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_abort_optimization(self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Start the optimization.
        opt_id = (
            await Optimization.create(project_id, compile_id)
        ).optimizationId
        # Wait for the optimization to start.
        await Optimization.wait_for_job_to_start(opt_id)
        # Try to abort the optimization.
        await Optimization.abort(opt_id)
        await Optimization.wait_for_job_to_abort(opt_id)
        optimization = await Optimization.read(opt_id)
        assert optimization.status.value == 'aborted'
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_abort_optimization_with_invalid_args(
            self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Start the optimization.
        opt_id = (
            await Optimization.create(project_id, compile_id)
        ).optimizationId
        # Test the invalid requests.
        tool_name = 'abort_optimization'
        class_ = AbortOptimizationRequest
        # Try to abort an optimization without providing the Id.
        await ensure_request_raises_validation_error(tool_name, class_, {})
        # Try to abort an optimization that doesn't exist.
        await ensure_request_fails(mcp, tool_name, {'optimizationId': ' '})
        # Try to abort an optimization that's already complete.
        await Optimization.wait_for_job_to_complete(opt_id)
        await ensure_request_fails(mcp, tool_name, {'optimizationId': opt_id})
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_delete_optimization(self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Start the optimization.
        opt_id = (
            await Optimization.create(project_id, compile_id)
        ).optimizationId
        # Try to delete the optimization.
        await Optimization.delete(opt_id)
        await ensure_request_fails(
            mcp, 'read_optimization', {'optimizationId': opt_id}
        )
        # Delete the project to clean up.
        await Project.delete(project_id)

    @pytest.mark.asyncio
    @pytest.mark.parametrize('language, algo', TEST_ALGORITHMS)
    async def test_delete_optimization_with_invalid_args(
            self, language, algo):
        # Create and compile the project.
        project_id, compile_id = await Files.setup_project(language, algo)
        # Start the optimization.
        await Optimization.create(project_id, compile_id)
        # Test the invalid requests.
        tool_name = 'delete_optimization'
        # Try to delete an optimization without providing the Id.
        await ensure_request_raises_validation_error(
            tool_name, DeleteOptimizationRequest, {}
        )
        # Try to delete an optimization that doesn't exist.
        await ensure_request_fails(mcp, tool_name, {'optimizationId': ' '})
        # Delete the project to clean up.
        await Project.delete(project_id)
