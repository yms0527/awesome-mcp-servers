from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP
import asyncio
import argparse
import time

# Initialize FastMCP server
mcp = FastMCP(name="weather", description="A weather information tool.", host="127.0.0.1", port=8000, timeout=30)

# Constants
NWS_API_BASE = "https://api.weather.gov"
USER_AGENT = "weather-app/1.0"

# Helper functions

async def make_nws_request(url: str) -> dict[str, Any] | None:
    """Make a request to the NWS API with proper error handling."""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None

def format_alert(feature: dict) -> str:
    """Format an alert feature into a readable string."""
    props = feature["properties"]
    return f"""
Event: {props.get('event', 'Unknown')}
Area: {props.get('areaDesc', 'Unknown')}
Severity: {props.get('severity', 'Unknown')}
Description: {props.get('description', 'No description available')}
Instructions: {props.get('instruction', 'No specific instructions provided')}
"""


# Tool execution implementation

@mcp.tool()
async def get_alerts(state: str) -> str:
    """Get weather alerts for a US state.

    Args:
        state: Two-letter US state code (e.g. CA, NY)
    """
    url = f"{NWS_API_BASE}/alerts/active/area/{state}"
    data = await make_nws_request(url)

    if not data or "features" not in data:
        return "Unable to fetch alerts or no alerts found."

    if not data["features"]:
        return "No active alerts for this state."

    alerts = [format_alert(feature) for feature in data["features"]]
    return "\n---\n".join(alerts)

@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """Get weather forecast for a location.

    Args:
        latitude: Latitude of the location
        longitude: Longitude of the location
    """
    # First get the forecast grid endpoint
    points_url = f"{NWS_API_BASE}/points/{latitude},{longitude}"
    points_data = await make_nws_request(points_url)

    if not points_data:
        return "Unable to fetch forecast data for this location."

    # Get the forecast URL from the points response
    forecast_url = points_data["properties"]["forecast"]
    forecast_data = await make_nws_request(forecast_url)

    if not forecast_data:
        return "Unable to fetch detailed forecast."

    # Format the periods into a readable forecast
    periods = forecast_data["properties"]["periods"]
    forecasts = []
    for period in periods[:5]:  # Only show next 5 periods
        forecast = f"""
{period['name']}:
Temperature: {period['temperature']}°{period['temperatureUnit']}
Wind: {period['windSpeed']} {period['windDirection']}
Forecast: {period['detailedForecast']}
"""
        forecasts.append(forecast)

    return "\n---\n".join(forecasts)

async def main():
    parser = argparse.ArgumentParser(description="Weather Information Tool")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Subparser for get_alerts
    alerts_parser = subparsers.add_parser("get_alerts", help="Get weather alerts for a US state")
    alerts_parser.add_argument("state", type=str, help="Two-letter US state code (e.g., CA, NY)")

    # Subparser for get_forecast
    forecast_parser = subparsers.add_parser("get_forecast", help="Get weather forecast for a location")
    forecast_parser.add_argument("latitude", type=float, help="Latitude of the location")
    forecast_parser.add_argument("longitude", type=float, help="Longitude of the location")

    args = parser.parse_args()

    if args.command == "get_alerts":
        result = await get_alerts(args.state)
        print(result)
    elif args.command == "get_forecast":
        result = await get_forecast(args.latitude, args.longitude)
        print(result)

# Running the FastMCP server

if __name__ == "__main__":
    print("Starting MCP server or running CLI...")
    # import sys
    # if len(sys.argv) > 1:  # Check if arguments are provided
    #     # Run the CLI if arguments are present
    #     asyncio.run(main())
    # else:
    #     # Run the FastMCP server if no arguments are provided
    #     try:
    #         print("MCP about to start.")
    #         mcp.run(transport='stdio')
    #         print("MCP Server started.")
    #     except asyncio.CancelledError:
    #         print("MCP Server was cancelled unexpectedly.")
    #     except Exception as e:
    #         print(f"An error occurred: {e}")
    try:
        print('Starting MCP server weather.py')
        mcp.run()
    except Exception as e:
        print(f"An error occurred: {e}")
        time.sleep(5)
    except asyncio.CancelledError:
        print("MCP Server was cancelled unexpectedly.")


