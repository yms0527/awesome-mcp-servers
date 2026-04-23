"""
Calculator Tool for AytchMCP.

This tool provides basic and advanced calculation capabilities.
"""

import math
import re
from typing import Dict, Any, Optional, Union, List

from fastmcp.tools import Tool
from pydantic import BaseModel, Field

from aytchmcp.context import Context


class CalculatorInput(BaseModel):
    """Calculator tool input model."""
    
    expression: str = Field(
        description="The mathematical expression to evaluate"
    )
    precision: Optional[int] = Field(
        default=6,
        description="Number of decimal places in the result"
    )
    variables: Optional[Dict[str, float]] = Field(
        default=None,
        description="Variables to use in the expression"
    )


class CalculatorOutput(BaseModel):
    """Calculator tool output model."""
    
    result: Union[float, int, str] = Field(
        description="The result of the calculation"
    )
    formatted_result: str = Field(
        description="The formatted result with specified precision"
    )
    steps: Optional[List[str]] = Field(
        default=None,
        description="Steps taken to solve the expression"
    )
    error: Optional[str] = Field(
        default=None,
        description="Error message if calculation failed"
    )


# Define safe functions and constants
_safe_functions = {
    'abs': abs,
    'round': round,
    'min': min,
    'max': max,
    'sum': sum,
    'len': len,
    'sin': math.sin,
    'cos': math.cos,
    'tan': math.tan,
    'asin': math.asin,
    'acos': math.acos,
    'atan': math.atan,
    'atan2': math.atan2,
    'sinh': math.sinh,
    'cosh': math.cosh,
    'tanh': math.tanh,
    'exp': math.exp,
    'log': math.log,
    'log10': math.log10,
    'log2': math.log2,
    'sqrt': math.sqrt,
    'pow': pow,
    'degrees': math.degrees,
    'radians': math.radians,
    'ceil': math.ceil,
    'floor': math.floor,
    'trunc': math.trunc,
    'factorial': math.factorial,
    'gcd': math.gcd,
}

_safe_constants = {
    'pi': math.pi,
    'e': math.e,
    'tau': math.tau,
    'inf': math.inf,
    'nan': math.nan,
}

async def calculator_tool(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculator tool that evaluates mathematical expressions.
    
    Args:
        input_data: The input data.
        
    Returns:
        The calculation result.
    """
    # Parse input
    parsed_input = CalculatorInput(**input_data)
    
    try:
        # Prepare variables
        variables = {}
        variables.update(_safe_constants)
        
        if parsed_input.variables:
            variables.update(parsed_input.variables)
        
        # Clean and validate the expression
        expression = _clean_expression(parsed_input.expression)
        
        # Evaluate the expression
        result, steps = _evaluate_expression(expression, variables)
        
        # Format the result
        if isinstance(result, (int, float)):
            if result.is_integer():
                formatted_result = str(int(result))
            else:
                formatted_result = f"{result:.{parsed_input.precision}f}"
        else:
            formatted_result = str(result)
        
        output = CalculatorOutput(
            result=result,
            formatted_result=formatted_result,
            steps=steps,
        )
        
        return output.dict()
    except Exception as e:
        # Log error
        from loguru import logger
        logger.error(f"Calculator error: {e}")
        
        output = CalculatorOutput(
            result="Error",
            formatted_result="Error",
            error=str(e),
        )
        return output.dict()

def _clean_expression(expression: str) -> str:
    """
    Clean and validate the expression.
    
    Args:
        expression: The expression to clean.
        
    Returns:
        The cleaned expression.
    """
    # Remove any potentially unsafe characters
    expression = re.sub(r'[^0-9+\-*/().,%\s\w]', '', expression)
    
    # Replace % with /100*
    expression = expression.replace('%', '/100*')
    
    # Replace ^ with **
    expression = expression.replace('^', '**')
    
    return expression

def _evaluate_expression(expression: str, variables: Dict[str, Any]) -> tuple[Union[float, int, str], List[str]]:
    """
    Evaluate the expression.
    
    Args:
        expression: The expression to evaluate.
        variables: Variables to use in the expression.
        
    Returns:
        The result and steps taken.
    """
    steps = []
    
    # Check for simple arithmetic
    if re.match(r'^[\d\s+\-*/().]+$', expression):
        # Simple arithmetic expression
        steps.append(f"Evaluating arithmetic expression: {expression}")
        result = eval(expression, {"__builtins__": {}}, {})
        steps.append(f"Result: {result}")
        return result, steps
    
    # Check for function calls
    function_pattern = r'([a-zA-Z_][a-zA-Z0-9_]*)\s*\('
    functions_used = re.findall(function_pattern, expression)
    
    # Validate functions
    for func_name in functions_used:
        if func_name not in _safe_functions:
            raise ValueError(f"Function '{func_name}' is not allowed")
    
    # Create a safe environment with allowed functions
    safe_env = {"__builtins__": {}}
    safe_env.update(_safe_functions)
    safe_env.update(variables)
    
    # Evaluate the expression
    steps.append(f"Evaluating expression: {expression}")
    result = eval(expression, safe_env, {})
    steps.append(f"Result: {result}")
    
    return result, steps