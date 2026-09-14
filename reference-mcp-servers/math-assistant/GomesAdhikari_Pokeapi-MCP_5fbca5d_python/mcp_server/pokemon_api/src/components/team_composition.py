from google import genai
from dotenv import load_dotenv
import os
import json
import re
from .info_retrival import Pokemon  # adjust import path as needed

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

client = genai.Client(api_key=api_key)

def extract_json_from_text(text: str):
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            return None
    return None

def generate_team_with_gemini(description: str) -> dict:
    prompt = f"""
You are a Pokémon team builder.

Given this description:
\"\"\"{description}\"\"\"

Please respond ONLY in valid JSON format with two keys:
- 'description': a natural language description explaining the team strategy
- 'team': a list of six Pokémon objects, each with 'name' and 'role' fields

Example:

{{
    "description": "This is a balanced team featuring strong defense and a fire-type attacker.",
    "team": [
        {{"name": "Charizard", "role": "Fire Attacker"}},
        {{"name": "Snorlax", "role": "Tank"}}
    ]
}}
"""

    response = client.models.generate_content(
        model='gemini-2.0-flash-001',
        contents=prompt
    )

    raw_text = response.text
    team_data = None

    try:
        team_data = json.loads(raw_text)
    except json.JSONDecodeError:
        team_data = extract_json_from_text(raw_text)

    if not team_data:
        raise ValueError(f"Failed to parse JSON from Gemini response. Raw response: {raw_text}")

    # Add image URL for each Pokémon in the team
    for poke in team_data.get("team", []):
        try:
            poke_obj = Pokemon(poke["name"].lower())
            poke_obj.fetch_basic_info()
            poke["image_url"] = poke_obj.get_image_url()
        except Exception:
            poke["image_url"] = None

    return team_data
