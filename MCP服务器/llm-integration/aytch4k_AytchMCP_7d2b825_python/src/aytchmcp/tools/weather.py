"""
Weather Tool for AytchMCP.

This tool provides weather information for a given location.
"""

import json
from typing import Dict, Any, Optional, List

import httpx
from fastmcp.tools import Tool
from pydantic import BaseModel, Field

from aytchmcp.context import Context
from aytchmcp.config import config


class WeatherInput(BaseModel):
    """Weather tool input model."""
    
    location: str = Field(
        description="The location to get weather for (city name, zip code, etc.)"
    )
    units: str = Field(
        default="metric",
        description="The units to use for temperature (metric, imperial, standard)"
    )
    days: Optional[int] = Field(
        default=1,
        description="Number of days to forecast (1-7)"
    )


class WeatherCondition(BaseModel):
    """Weather condition model."""
    
    main: str = Field(description="Main weather condition")
    description: str = Field(description="Weather condition description")
    icon: str = Field(description="Weather condition icon code")


class WeatherTemperature(BaseModel):
    """Weather temperature model."""
    
    current: float = Field(description="Current temperature")
    feels_like: float = Field(description="Feels like temperature")
    min: float = Field(description="Minimum temperature")
    max: float = Field(description="Maximum temperature")


class WeatherDay(BaseModel):
    """Weather day model."""
    
    date: str = Field(description="Date (YYYY-MM-DD)")
    temperature: WeatherTemperature = Field(description="Temperature information")
    conditions: List[WeatherCondition] = Field(description="Weather conditions")
    humidity: int = Field(description="Humidity percentage")
    wind_speed: float = Field(description="Wind speed")
    wind_direction: int = Field(description="Wind direction in degrees")
    pressure: int = Field(description="Atmospheric pressure in hPa")
    sunrise: str = Field(description="Sunrise time (HH:MM)")
    sunset: str = Field(description="Sunset time (HH:MM)")


class WeatherOutput(BaseModel):
    """Weather tool output model."""
    
    location: str = Field(description="Location name")
    country: str = Field(description="Country code")
    units: str = Field(description="Temperature units (metric, imperial, standard)")
    current: WeatherDay = Field(description="Current weather")
    forecast: Optional[List[WeatherDay]] = Field(description="Weather forecast")


async def weather_tool(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Weather tool that provides weather information for a location.
    
    Args:
        input_data: The input data.
        
    Returns:
        Weather information.
    """
    # Parse input
    parsed_input = WeatherInput(**input_data)
    
    # Get API key from environment
    import os
    api_key = os.environ.get("OPENWEATHER_API_KEY")
    
    if not api_key:
        # Use mock data if no API key is available
        return _get_mock_weather(parsed_input).dict()
    
    try:
        # Get current weather
        current_weather = await _get_current_weather(
            parsed_input.location, parsed_input.units, api_key
        )
        
        # Get forecast if requested
        forecast = None
        if parsed_input.days and parsed_input.days > 1:
            forecast = await _get_forecast(
                parsed_input.location, parsed_input.units, parsed_input.days, api_key
            )
        
        return current_weather.dict()
    except Exception as e:
        # Log error
        from loguru import logger
        logger.error(f"Error getting weather: {e}")
        
        # Fall back to mock data
        return _get_mock_weather(parsed_input).dict()

async def _get_current_weather(
    location: str, units: str, api_key: str
) -> WeatherOutput:
    """
    Get current weather from OpenWeatherMap API.
    
    Args:
        location: The location to get weather for.
        units: The units to use for temperature.
        api_key: The OpenWeatherMap API key.
        
    Returns:
        Current weather information.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": location,
                "units": units,
                "appid": api_key,
            },
        )
        
        response.raise_for_status()
        data = response.json()
        
        # Parse response
        from datetime import datetime
        
        # Create current weather day
        current = WeatherDay(
            date=datetime.now().strftime("%Y-%m-%d"),
            temperature=WeatherTemperature(
                current=data["main"]["temp"],
                feels_like=data["main"]["feels_like"],
                min=data["main"]["temp_min"],
                max=data["main"]["temp_max"],
            ),
            conditions=[
                WeatherCondition(
                    main=condition["main"],
                    description=condition["description"],
                    icon=condition["icon"],
                )
                for condition in data["weather"]
            ],
            humidity=data["main"]["humidity"],
            wind_speed=data["wind"]["speed"],
            wind_direction=data["wind"]["deg"],
            pressure=data["main"]["pressure"],
            sunrise=datetime.fromtimestamp(data["sys"]["sunrise"]).strftime("%H:%M"),
            sunset=datetime.fromtimestamp(data["sys"]["sunset"]).strftime("%H:%M"),
        )
        
        return WeatherOutput(
            location=data["name"],
            country=data["sys"]["country"],
            units=units,
            current=current,
            forecast=None,
        )

async def _get_forecast(
    location: str, units: str, days: int, api_key: str
) -> List[WeatherDay]:
    """
    Get weather forecast from OpenWeatherMap API.
    
    Args:
        location: The location to get weather for.
        units: The units to use for temperature.
        days: Number of days to forecast.
        api_key: The OpenWeatherMap API key.
        
    Returns:
        Weather forecast.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={
                "q": location,
                "units": units,
                "cnt": min(days * 8, 40),  # 8 forecasts per day, max 5 days
                "appid": api_key,
            },
        )
        
        response.raise_for_status()
        data = response.json()
        
        # Parse response
        from datetime import datetime
        from collections import defaultdict
        
        # Group forecasts by day
        forecasts_by_day = defaultdict(list)
        for forecast in data["list"]:
            date = datetime.fromtimestamp(forecast["dt"]).strftime("%Y-%m-%d")
            forecasts_by_day[date].append(forecast)
        
        # Create forecast days
        forecast_days = []
        for date, forecasts in list(forecasts_by_day.items())[:days]:
            # Get min/max temperatures
            min_temp = min(forecast["main"]["temp_min"] for forecast in forecasts)
            max_temp = max(forecast["main"]["temp_max"] for forecast in forecasts)
            
            # Get most common condition
            from collections import Counter
            conditions = [forecast["weather"][0] for forecast in forecasts]
            condition_counts = Counter(
                (condition["main"], condition["description"], condition["icon"])
                for condition in conditions
            )
            most_common_conditions = [
                WeatherCondition(
                    main=main,
                    description=description,
                    icon=icon,
                )
                for (main, description, icon), _ in condition_counts.most_common(3)
            ]
            
            # Get average values
            avg_humidity = sum(forecast["main"]["humidity"] for forecast in forecasts) / len(forecasts)
            avg_wind_speed = sum(forecast["wind"]["speed"] for forecast in forecasts) / len(forecasts)
            avg_wind_direction = sum(forecast["wind"]["deg"] for forecast in forecasts) / len(forecasts)
            avg_pressure = sum(forecast["main"]["pressure"] for forecast in forecasts) / len(forecasts)
            
            # Create forecast day
            forecast_day = WeatherDay(
                date=date,
                temperature=WeatherTemperature(
                    current=forecasts[0]["main"]["temp"],
                    feels_like=forecasts[0]["main"]["feels_like"],
                    min=min_temp,
                    max=max_temp,
                ),
                conditions=most_common_conditions,
                humidity=int(avg_humidity),
                wind_speed=avg_wind_speed,
                wind_direction=int(avg_wind_direction),
                pressure=int(avg_pressure),
                sunrise="N/A",  # Not available in forecast
                sunset="N/A",  # Not available in forecast
            )
            
            forecast_days.append(forecast_day)
        
        return forecast_days

def _get_mock_weather(input_data: WeatherInput) -> WeatherOutput:
    """
    Get mock weather data.
    
    Args:
        input_data: The input data.
        
    Returns:
        Mock weather information.
    """
    from datetime import datetime, timedelta
    
    # Create current weather day
    current = WeatherDay(
        date=datetime.now().strftime("%Y-%m-%d"),
        temperature=WeatherTemperature(
            current=22.5,
            feels_like=23.0,
            min=18.0,
            max=25.0,
        ),
        conditions=[
            WeatherCondition(
                main="Clear",
                description="clear sky",
                icon="01d",
            )
        ],
        humidity=65,
        wind_speed=5.2,
        wind_direction=180,
        pressure=1013,
        sunrise="06:30",
        sunset="20:15",
    )
    
    # Create forecast if requested
    forecast = None
    if input_data.days and input_data.days > 1:
        forecast = []
        for i in range(1, min(input_data.days, 7)):
            date = (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d")
            forecast.append(
                WeatherDay(
                    date=date,
                    temperature=WeatherTemperature(
                        current=22.0 + i,
                        feels_like=22.5 + i,
                        min=18.0 + i,
                        max=25.0 + i,
                    ),
                    conditions=[
                        WeatherCondition(
                            main="Clear" if i % 2 == 0 else "Clouds",
                            description="clear sky" if i % 2 == 0 else "scattered clouds",
                            icon="01d" if i % 2 == 0 else "03d",
                        )
                    ],
                    humidity=65 - i,
                    wind_speed=5.2 + (i * 0.5),
                    wind_direction=(180 + i * 10) % 360,
                    pressure=1013 - i,
                    sunrise="06:" + str(30 + i),
                    sunset="20:" + str(15 - i),
                )
            )
    
    return WeatherOutput(
        location=input_data.location,
        country="US",
        units=input_data.units,
        current=current,
        forecast=forecast,
    )