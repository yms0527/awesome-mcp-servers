#!/usr/bin/env python3
"""
This module contains the AI functions for the AI assistant.
"""
# Standard Library Imports
import os
from dotenv import load_dotenv
import asyncio
from concurrent.futures import TimeoutError
import logging
from typing import Optional

# Third Party Imports
import google.generativeai as genai


# Load environment variables from .env file
load_dotenv()

class AIError(Exception):
    pass

# Initialize Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise AIError("GEMINI_API_KEY not found in environment variables")
genai.configure(api_key=api_key)

async def generate_with_timeout(prompt: str, timeout: int = 10, max_retries: int = 3) -> str:
    """Generate content with timeout and retries"""
    if not prompt:
        raise AIError("Prompt cannot be empty")
    if len(prompt) > 1_000_000:  # Example limit
        raise AIError("Prompt too long")
        
    logger = logging.getLogger(__name__)
    model = genai.GenerativeModel('gemini-2.0-flash')
        
    for attempt in range(max_retries):
        try:
            loop = asyncio.get_event_loop()
            response = await asyncio.wait_for(
                loop.run_in_executor(
                    None, 
                    lambda: model.generate_content(prompt)
                ),
                timeout=timeout
            )
            return response.text.strip()
        except TimeoutError:
            logger.error(f"LLM generation timed out! Attempt {attempt + 1}/{max_retries}")
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
            else:
                raise
        except Exception as e:
            logger.error(f"Error in LLM generation: {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
            else:
                raise AIError(f"Failed to generate response: {e}")

def parse_llm_response(response_text: str) -> dict:
    """Parse the LLM response to extract the function call or final answer"""
    logger = logging.getLogger(__name__)
    
    if not response_text:
        logger.error("Empty response text from LLM")
        return None
        
    try:
        for line in response_text.split('\n'):
            line = line.strip()
            if line.startswith("FUNCTION_CALL:"):
                _, function_info = line.split(":", 1)
                parts = [p.strip() for p in function_info.split("|")]
                if len(parts) < 1:
                    logger.error("Invalid function call format: not enough parts")
                    continue
                    
                return {
                    "type": "function_call",
                    "name": parts[0],
                    "parameters": parts[1:] if len(parts) > 1 else []
                }
            elif line.startswith("FINAL_ANSWER:"):
                _, value = line.split(":", 1)
                return {
                    "type": "final_answer",
                    "value": value.strip()
                }
                
        logger.error(f"Could not parse LLM response: {response_text}")
        return None
    except Exception as e:
        logger.error(f"Error parsing LLM response: {e}")
        return None
