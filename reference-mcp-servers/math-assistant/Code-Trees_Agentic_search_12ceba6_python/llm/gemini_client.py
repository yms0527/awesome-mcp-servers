import os
import asyncio
from dotenv import load_dotenv

import google.generativeai as genai
from concurrent.futures import TimeoutError


async def generate_response(prompt):
    """Generate content with Model calling"""
    load_dotenv()
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
    # Run the sync method in a thread-safe async way
    response = await asyncio.to_thread(model.generate_content, prompt)
    return response.text
