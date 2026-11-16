from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("pokedex")

POKEAPI_BASE = "https://pokeapi.co/api/v2"

async def fetch_pokemon_data(name: str) -> dict[str, Any] | None:
    """Fetch data from the PokéAPI for a given Pokémon."""
    url = f"{POKEAPI_BASE}/pokemon/{name.lower()}"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=15.0)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None

def format_pokemon(data: dict[str, Any]) -> str:
    """Format Pokémon data into a readable string."""
    name = data["name"].title()
    types = ", ".join(t["type"]["name"] for t in data["types"])
    abilities = ", ".join(a["ability"]["name"] for a in data["abilities"])
    stats = "\n".join(
        f"  - {s['stat']['name']}: {s['base_stat']}"
        for s in data["stats"]
    )

    return f"""
    Name: {name}
    Types: {types}
    Abilities: {abilities}
    Base Stats:
    {stats}
    """

@mcp.tool()
async def get_pokemon_info(pokemon: str) -> str:
    """Get info about a Pokémon by name.

    Args:
        pokemon: The name of the Pokémon (e.g. "pikachu")
    """
    data = await fetch_pokemon_data(pokemon)
    if not data:
        return f"Could not find data for Pokémon '{pokemon}'. Please check the name."

    return format_pokemon(data)

if __name__ == "__main__":
    mcp.run(transport="stdio")
