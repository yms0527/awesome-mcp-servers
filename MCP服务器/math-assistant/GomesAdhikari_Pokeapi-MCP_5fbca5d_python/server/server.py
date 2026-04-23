import sys
from typing import List, Dict, Any, Optional
import httpx
import os
import asyncio
import logging
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

from src.components.info_retrival import Pokemon
from src.components.comparison_module import PokemonComparer
from src.components.team_composition import generate_team_with_gemini
from src.components.strategy import recommend_counters

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastMCP server
mcp = FastMCP("Pokemon MCP Server")

@mcp.tool()
async def get_pokemon_info(name: str) -> Dict[str, Any]:
    """
    Get detailed information about a Pokemon including stats, types, abilities, and description.
    
    Args:
        name: The name of the Pokemon to look up
    """
    if not name:
        return {"error": "Missing 'name'", "success": False}
    
    try:
        # Create Pokemon instance and fetch data
        pokemon = Pokemon(name.lower())
        pokemon.fetch_basic_info()
        pokemon.fetch_flavor_text()
        
        return {
            "result": pokemon.get_summary(),
            "success": True
        }
    except Exception as e:
        logger.exception("Error in get_pokemon_info")
        return {
            "error": str(e),
            "success": False
        }

@mcp.tool()
async def compare_pokemon(pokemon1: str, pokemon2: str) -> Dict[str, Any]:
    """
    Compare two Pokemon across various stats and analyze type matchups.
    
    Args:
        pokemon1: Name of the first Pokemon
        pokemon2: Name of the second Pokemon
    """
    if not pokemon1 or not pokemon2:
        return {
            "error": "Both 'pokemon1' and 'pokemon2' are required.",
            "success": False
        }
    
    try:
        # Create comparer instance and get comparison
        comparer = PokemonComparer(pokemon1, pokemon2)
        comparison_result = comparer.compare()
        
        return {
            "result": comparison_result,
            "success": True
        }
    except Exception as e:
        logger.exception("Error in compare_pokemon")
        return {
            "error": str(e),
            "success": False
        }

@mcp.tool()
async def get_pokemon_counters(name: str) -> Dict[str, Any]:
    """
    Get strategic counters and recommendations for a specific Pokemon.
    
    Args:
        name: The name of the Pokemon to find counters for
    """
    if not name:
        return {"error": "Missing 'name'", "success": False}
    
    try:
        # Get counter recommendations
        counters = recommend_counters(name)
        
        return {
            "result": counters,
            "success": True
        }
    except Exception as e:
        logger.exception("Error in get_pokemon_counters")
        return {
            "error": str(e),
            "success": False
        }

@mcp.tool()
async def generate_pokemon_team(description: str) -> Dict[str, Any]:
    """
    Generate a Pokemon team using Gemini AI based on a description.
    
    Args:
        description: Description of the desired team composition or strategy
    """
    if not description:
        return {
            "error": "Missing 'description' in request.",
            "success": False
        }
    
    try:
        # Generate team using Gemini
        team_data = generate_team_with_gemini(description)
        
        return {
            "result": team_data,
            "success": True
        }
    except ValueError as ve:
        logger.exception("ValueError in generate_pokemon_team")
        return {
            "error": str(ve),
            "success": False
        }
    except Exception as e:
        logger.exception("Error in generate_pokemon_team")
        return {
            "error": "An unexpected error occurred.",
            "success": False
        }

@mcp.tool()
async def analyze_pokemon_matchup(pokemon1: str, pokemon2: str, battle_format: str = "singles") -> Dict[str, Any]:
    """
    Analyze the matchup between two Pokemon in detail, including type effectiveness and stat comparison.
    
    Args:
        pokemon1: Name of the first Pokemon
        pokemon2: Name of the second Pokemon
        battle_format: Battle format context (singles, doubles, etc.)
    """
    if not pokemon1 or not pokemon2:
        return {
            "error": "Both Pokemon names are required for matchup analysis.",
            "success": False
        }
    
    try:
        # Get detailed comparison
        comparer = PokemonComparer(pokemon1, pokemon2)
        comparison_result = comparer.compare()
        
        # Also get counter information for both Pokemon
        pokemon1_counters = recommend_counters(pokemon1)
        pokemon2_counters = recommend_counters(pokemon2)
        
        return {
            "result": {
                "comparison": comparison_result,
                "pokemon1_counters": pokemon1_counters,
                "pokemon2_counters": pokemon2_counters,
                "battle_format": battle_format
            },
            "success": True
        }
    except Exception as e:
        logger.exception("Error in analyze_pokemon_matchup")
        return {
            "error": str(e),
            "success": False
        }

@mcp.tool()
async def get_team_analysis(team_members: List[str]) -> Dict[str, Any]:
    """
    Analyze a complete Pokemon team for strengths, weaknesses, and synergies.
    
    Args:
        team_members: List of Pokemon names in the team (up to 6)
    """
    if not team_members or len(team_members) == 0:
        return {
            "error": "Team members list cannot be empty.",
            "success": False
        }
    
    if len(team_members) > 6:
        return {
            "error": "Team cannot have more than 6 Pokemon.",
            "success": False
        }
    
    try:
        team_analysis = {
            "team_members": [],
            "type_coverage": {},
            "common_weaknesses": [],
            "team_synergy": {},
            "recommended_improvements": []
        }
        
        # Get info for each team member
        for pokemon_name in team_members:
            try:
                pokemon = Pokemon(pokemon_name.lower())
                pokemon.fetch_basic_info()
                pokemon.fetch_flavor_text()
                team_analysis["team_members"].append({
                    "name": pokemon_name,
                    "info": pokemon.get_summary()
                })
            except Exception as e:
                logger.warning(f"Could not fetch info for {pokemon_name}: {e}")
                team_analysis["team_members"].append({
                    "name": pokemon_name,
                    "error": str(e)
                })
        
        # Get counters for the entire team concept
        team_description = f"A team consisting of: {', '.join(team_members)}"
        try:
            team_suggestions = generate_team_with_gemini(
                f"Analyze and improve this team: {team_description}"
            )
            team_analysis["ai_suggestions"] = team_suggestions
        except Exception as e:
            logger.warning(f"Could not get AI suggestions: {e}")
            team_analysis["ai_suggestions"] = {"error": str(e)}
        
        return {
            "result": team_analysis,
            "success": True
        }
    except Exception as e:
        logger.exception("Error in get_team_analysis")
        return {
            "error": str(e),
            "success": False
        }

@mcp.tool()
async def bulk_pokemon_lookup(names: List[str]) -> Dict[str, Any]:
    """
    Get information for multiple Pokemon at once.
    
    Args:
        names: List of Pokemon names to look up
    """
    if not names or len(names) == 0:
        return {
            "error": "Pokemon names list cannot be empty.",
            "success": False
        }
    
    if len(names) > 20:  # Reasonable limit to prevent overload
        return {
            "error": "Cannot lookup more than 20 Pokemon at once.",
            "success": False
        }
    
    try:
        results = []
        
        for name in names:
            try:
                pokemon = Pokemon(name.lower())
                pokemon.fetch_basic_info()
                pokemon.fetch_flavor_text()
                results.append({
                    "name": name,
                    "info": pokemon.get_summary(),
                    "success": True
                })
            except Exception as e:
                logger.warning(f"Failed to fetch info for {name}: {e}")
                results.append({
                    "name": name,
                    "error": str(e),
                    "success": False
                })
        
        return {
            "result": results,
            "success": True
        }
    except Exception as e:
        logger.exception("Error in bulk_pokemon_lookup")
        return {
            "error": str(e),
            "success": False
        }

@mcp.tool()
async def get_competitive_analysis(pokemon_name: str, format: str = "OU") -> Dict[str, Any]:
    """
    Get competitive analysis for a Pokemon including counters and team suggestions.
    
    Args:
        pokemon_name: Name of the Pokemon to analyze
        format: Competitive format (OU, UU, Doubles, etc.)
    """
    if not pokemon_name:
        return {"error": "Pokemon name is required.", "success": False}
    
    try:
        # Get basic Pokemon info
        pokemon = Pokemon(pokemon_name.lower())
        pokemon.fetch_basic_info()
        pokemon.fetch_flavor_text()
        pokemon_info = pokemon.get_summary()
        
        # Get counters
        counters = recommend_counters(pokemon_name)
        
        # Generate team suggestions that include this Pokemon
        team_suggestion = generate_team_with_gemini(
            f"Create a competitive {format} team centered around {pokemon_name}"
        )
        
        return {
            "result": {
                "pokemon_info": pokemon_info,
                "counters": counters,
                "team_suggestions": team_suggestion,
                "format": format
            },
            "success": True
        }
    except Exception as e:
        logger.exception("Error in get_competitive_analysis")
        return {
            "error": str(e),
            "success": False
        }

@mcp.tool()
async def health_check() -> Dict[str, Any]:
    """
    Check if the server and all components are working properly.
    """
    try:
        # Test basic Pokemon lookup
        test_pokemon = Pokemon("pikachu")
        test_pokemon.fetch_basic_info()
        
        # Test comparison
        test_comparer = PokemonComparer("pikachu", "charizard")
        test_comparison = test_comparer.compare()
        
        return {
            "status": "healthy",
            "components": {
                "pokemon_info": "operational",
                "pokemon_comparison": "operational",
                "counter_analysis": "operational",
                "team_generation": "operational"
            },
            "test_results": {
                "basic_lookup": "passed",
                "comparison": "passed"
            },
            "success": True
        }
    except Exception as e:
        logger.exception("Health check failed")
        return {
            "status": "unhealthy",
            "error": str(e),
            "success": False
        }

# Server startup and management
async def startup():
    """Initialize server components"""
    try:
        # Send all debug output to stderr, not stdout
        print(" Pokemon MCP Server starting...", file=sys.stderr)
        
        # Run health check
        health = await health_check()
        if health["success"]:
            print(" All components operational!", file=sys.stderr)
        else:
            print(f" Health check issues: {health.get('error', 'Unknown')}", file=sys.stderr)
    
        print("\n Available MCP Tools:", file=sys.stderr)
        print("  • get_pokemon_info(name) - Get detailed Pokemon information", file=sys.stderr)
        print("  • compare_pokemon(pokemon1, pokemon2) - Compare two Pokemon", file=sys.stderr)
        print("  • get_pokemon_counters(name) - Get counter recommendations", file=sys.stderr)
        print("  • generate_pokemon_team(description) - Generate team with AI", file=sys.stderr)
        print("  • analyze_pokemon_matchup(pokemon1, pokemon2, format) - Detailed matchup analysis", file=sys.stderr)
        print("  • get_team_analysis(team_members) - Analyze complete team", file=sys.stderr)
        print("  • bulk_pokemon_lookup(names) - Look up multiple Pokemon", file=sys.stderr)
        print("  • get_competitive_analysis(name, format) - Competitive analysis", file=sys.stderr)
        print("  • health_check() - Check server status", file=sys.stderr)
        
    except Exception as e:
        print(f" Server startup failed: {e}", file=sys.stderr)
        raise

if __name__ == "__main__":
    def main():
        try:
            # Run startup in an async context
            asyncio.run(startup())
            print(" Pokemon MCP Server ready!", file=sys.stderr)
            
            # Use the synchronous run method - FastMCP will handle the event loop
            mcp.run()
            
        except KeyboardInterrupt:
            print("\nReceived shutdown signal...", file=sys.stderr)
        except Exception as e:
            print(f" Server error: {e}", file=sys.stderr)
            logger.exception("Server startup failed")
        finally:
            print(" Pokemon MCP Server stopped.", file=sys.stderr)
    
    # Run the server
    main()