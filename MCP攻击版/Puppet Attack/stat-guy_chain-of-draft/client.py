"""
OpenAI-compatible client wrapper for the Chain of Draft MCP server.
Provides a drop-in replacement for OpenAI and Anthropic clients.
"""

import os
import time
import uuid
import anthropic
from dotenv import load_dotenv

from analytics import AnalyticsService
from complexity import ComplexityEstimator
from examples import ExampleDatabase
from format import FormatEnforcer
from reasoning import ReasoningSelector, create_cod_prompt, create_cot_prompt

# Load environment variables
load_dotenv()

class ChainOfDraftClient:
    """
    Drop-in replacement for OpenAI client that uses Chain of Draft reasoning.
    Provides both OpenAI and Anthropic-compatible interfaces.
    """
    
    def __init__(self, api_key=None, base_url=None, **kwargs):
        """Initialize the client with optional API key and settings."""
        # Initialize the underlying LLM client
        self.client = anthropic.Anthropic(api_key=api_key or os.environ.get("ANTHROPIC_API_KEY"))
        
        # Initialize services
        self.analytics = AnalyticsService()
        self.complexity_estimator = ComplexityEstimator()
        self.example_db = ExampleDatabase()
        self.format_enforcer = FormatEnforcer()
        self.reasoning_selector = ReasoningSelector(self.analytics)
        
        # Default settings
        self.default_settings = {
            "max_words_per_step": 5,
            "enforce_format": True,
            "adaptive_word_limit": True,
            "track_analytics": True,
            "model": "claude-3-5-sonnet-20240620",
            "max_tokens": 500
        }
        
        # Update with any provided kwargs
        self.settings = {**self.default_settings, **kwargs}
    
    # OpenAI-style completions
    async def completions(self, model=None, prompt=None, **kwargs):
        """
        OpenAI-compatible completions interface.
        
        Args:
            model: Model to use (default from settings)
            prompt: The problem to solve
            **kwargs: Additional parameters including domain
            
        Returns:
            OpenAI-style completion response
        """
        if not prompt:
            raise ValueError("Prompt is required")
            
        # Extract reasoning problem from prompt
        problem = prompt
        
        # Determine domain from kwargs or infer
        domain = kwargs.get("domain", "general")
        
        # Process reasoning request
        result = await self.solve_with_reasoning(
            problem, 
            domain, 
            model=model or self.settings["model"],
            **kwargs
        )
        
        # Format in OpenAI style response
        return {
            "id": f"cod-{uuid.uuid4()}",
            "object": "completion",
            "created": int(time.time()),
            "model": model or self.settings["model"],
            "choices": [{
                "text": result["final_answer"],
                "index": 0,
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": len(prompt.split()),
                "completion_tokens": result["token_count"],
                "total_tokens": len(prompt.split()) + result["token_count"]
            },
            # Add custom fields for CoD-specific data
            "reasoning": result["reasoning_steps"],
            "approach": result["approach"]
        }
    
    # ChatCompletions-style method
    async def chat(self, model=None, messages=None, **kwargs):
        """
        OpenAI-compatible chat completions interface.
        
        Args:
            model: Model to use (default from settings)
            messages: Chat history with the last user message as the problem
            **kwargs: Additional parameters including domain
            
        Returns:
            OpenAI-style chat completion response
        """
        if not messages:
            raise ValueError("Messages are required")
            
        # Extract last user message as the problem
        last_user_msg = next((m["content"] for m in reversed(messages) 
                             if m["role"] == "user"), "")
        
        if not last_user_msg:
            raise ValueError("No user message found in the provided messages")
        
        # Determine domain from kwargs or infer
        domain = kwargs.get("domain", "general")
        
        # Process reasoning request
        result = await self.solve_with_reasoning(
            last_user_msg, 
            domain, 
            model=model or self.settings["model"],
            **kwargs
        )
        
        # Format in OpenAI style response
        return {
            "id": f"cod-{uuid.uuid4()}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": model or self.settings["model"],
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": f"{result['reasoning_steps']}\n\n####\n{result['final_answer']}"
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": sum(len(m.get("content", "").split()) for m in messages),
                "completion_tokens": result["token_count"],
                "total_tokens": sum(len(m.get("content", "").split()) for m in messages) + result["token_count"]
            }
        }
    
    # Anthropic-style messages
    async def messages(self, model=None, messages=None, **kwargs):
        """
        Anthropic-compatible messages interface.
        
        Args:
            model: Model to use (default from settings)
            messages: Chat history with the last user message as the problem
            **kwargs: Additional parameters including domain
            
        Returns:
            Anthropic-style message response
        """
        if not messages:
            raise ValueError("Messages are required")
            
        # Extract last user message as the problem
        last_user_msg = next((m["content"] for m in reversed(messages) 
                             if m["role"] == "user"), "")
        
        if not last_user_msg:
            raise ValueError("No user message found in the provided messages")
        
        # Determine domain from kwargs or infer
        domain = kwargs.get("domain", "general")
        
        # Process reasoning request
        result = await self.solve_with_reasoning(
            last_user_msg, 
            domain, 
            model=model or self.settings["model"],
            **kwargs
        )
        
        # Format in Anthropic style response
        return {
            "id": f"msg_{uuid.uuid4()}",
            "type": "message",
            "role": "assistant",
            "model": model or self.settings["model"],
            "content": [
                {
                    "type": "text",
                    "text": f"{result['reasoning_steps']}\n\n####\n{result['final_answer']}"
                }
            ],
            "usage": {
                "input_tokens": sum(len(m.get("content", "").split()) for m in messages),
                "output_tokens": result["token_count"]
            },
            # Add custom fields
            "reasoning_approach": result["approach"],
            "word_limit": result["word_limit"]
        }
    
    # Core reasoning implementation
    async def solve_with_reasoning(self, problem, domain="general", **kwargs):
        """
        Solve a problem using the appropriate reasoning approach.
        
        Args:
            problem: The problem text
            domain: Problem domain (math, code, logic, etc.)
            **kwargs: Additional parameters and settings
            
        Returns:
            Dictionary with reasoning steps and answer
        """
        start_time = time.time()
        
        # Override settings with kwargs
        local_settings = {**self.settings, **kwargs}
        
        # Determine complexity and select approach
        complexity = await self.complexity_estimator.estimate_complexity(problem, domain)
        
        if local_settings.get("approach"):
            # Manually specified approach
            approach = local_settings["approach"]
            approach_reason = "Manually specified"
        else:
            # Auto-select based on problem
            approach, approach_reason = await self.reasoning_selector.select_approach(
                problem, domain, complexity
            )
        
        # Determine word limit
        if local_settings["adaptive_word_limit"] and approach == "CoD":
            word_limit = complexity  # Use estimated complexity as word limit
        else:
            word_limit = local_settings["max_words_per_step"]
        
        # Get examples
        examples = await self.example_db.get_examples(domain, approach)
        
        # Create prompt based on approach
        if approach == "CoD":
            prompt = create_cod_prompt(problem, domain, word_limit, examples)
        else:
            prompt = create_cot_prompt(problem, domain, examples)
        
        # Generate response from LLM
        response = await self.client.messages.create(
            model=local_settings.get("model", "claude-3-5-sonnet-20240620"),
            max_tokens=local_settings.get("max_tokens", 500),
            system=prompt["system"],
            messages=[{"role": "user", "content": prompt["user"]}]
        )
        
        # Extract reasoning and answer
        full_response = response.content[0].text
        parts = full_response.split("####")
        
        reasoning = parts[0].strip()
        answer = parts[1].strip() if len(parts) > 1 else "No clear answer found"
        
        # Apply format enforcement if needed
        if local_settings["enforce_format"] and approach == "CoD":
            reasoning = self.format_enforcer.enforce_word_limit(reasoning, word_limit)
            adherence = self.format_enforcer.analyze_adherence(reasoning, word_limit)
        else:
            adherence = None
        
        # Record analytics
        if local_settings["track_analytics"]:
            execution_time = (time.time() - start_time) * 1000  # ms
            await self.analytics.record_inference(
                problem=problem,
                domain=domain,
                approach=approach,
                word_limit=word_limit,
                tokens_used=len(full_response.split()),
                execution_time=execution_time,
                reasoning=reasoning,
                answer=answer,
                metadata={
                    "complexity": complexity,
                    "approach_reason": approach_reason,
                    "adherence": adherence
                }
            )
        
        return {
            "reasoning_steps": reasoning,
            "final_answer": answer,
            "token_count": len(full_response.split()),
            "approach": approach,
            "complexity": complexity,
            "word_limit": word_limit
        }
    
    # Utility methods
    async def get_performance_stats(self, domain=None):
        """Get performance statistics for CoD vs CoT approaches."""
        return await self.analytics.get_performance_by_domain(domain)
    
    async def get_token_reduction_stats(self):
        """Get token reduction statistics for CoD vs CoT."""
        return await self.analytics.get_token_reduction_stats()
    
    def update_settings(self, **kwargs):
        """Update the client settings."""
        self.settings.update(kwargs)
        return self.settings
