from api_connection import post
from models import (
    BasicFilesRequest,
    CodeCompletionRequest,
    ErrorEnhanceRequest,
    PEP8ConvertRequest,
    BasicFilesRequest,
    SearchRequest,

    BacktestInitResponse,
    CodeCompletionResponse,
    ErrorEnhanceResponse,
    PEP8ConvertResponse,
    SyntaxCheckResponse,
    SearchResponse
)

def register_ai_tools(mcp):
    # Get backtest initialization errors
    @mcp.tool(
        annotations={
            'title': 'Check initialization errors', 'readOnlyHint': True
        }
    )
    async def check_initialization_errors(
            model: BasicFilesRequest) -> BacktestInitResponse:
        """Run a backtest for a few seconds to initialize the algorithm 
        and get inialization errors if any."""
        return await post('/ai/tools/backtest-init', model)
    
    # Complete code
    @mcp.tool(annotations={'title': 'Complete code', 'readOnlyHint': True})
    async def complete_code(
            model: CodeCompletionRequest) -> CodeCompletionResponse:
        """Show the code completion for a specific text input."""
        return await post('/ai/tools/complete', model)

    # Enchance error message
    @mcp.tool(
        annotations={'title': 'Enhance error message', 'readOnlyHint': True}
    )
    async def enhance_error_message(
            model: ErrorEnhanceRequest) -> ErrorEnhanceResponse:
        """Show additional context and suggestions for error messages."""
        return await post('/ai/tools/error-enhance', model)

    # Update code to PEP8
    @mcp.tool(
        annotations={'title': 'Update code to PEP8', 'readOnlyHint': True}
    )
    async def update_code_to_pep8(
            model: PEP8ConvertRequest) -> PEP8ConvertResponse:
        """Update Python code to follow PEP8 style."""
        return await post('/ai/tools/pep8-convert', model)

    # Check syntax
    @mcp.tool(annotations={'title': 'Check syntax', 'readOnlyHint': True})
    async def check_syntax(model: BasicFilesRequest) -> SyntaxCheckResponse:
        """Check the syntax of a code."""
        return await post('/ai/tools/syntax-check', model)

    # Search
    @mcp.tool(annotations={'title': 'Search QuantConnect', 'readOnlyHint': True})
    async def search_quantconnect(model: SearchRequest) -> SearchResponse:
        """Search for content in QuantConnect."""
        return await post('/ai/tools/search', model)
