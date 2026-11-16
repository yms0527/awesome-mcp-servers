import os
import argparse
import asyncio
from datetime import datetime, timedelta
from enum import Enum
import json
from typing import Sequence
from zoneinfo import ZoneInfo
from pydantic import BaseModel
from typing import Any
from mcp.server.fastmcp import FastMCP


mcp = FastMCP("time-fastmcp-server")


class TimeResult(BaseModel):
    timezone: str
    datetime: str
    is_dst: bool

class TimeConversionResult(BaseModel):
    source: TimeResult
    target: TimeResult
    time_difference: str


def get_local_tz(local_tz_override: str | None = None) -> str:
    if local_tz_override:
        return local_tz_override

    tzinfo = datetime.now().astimezone(tz=None).tzinfo
    if str(tzinfo) == "中国标准时间":
        return "Asia/Shanghai"
    if tzinfo is not None:
        return str(tzinfo)
    raise ValueError("Could not determine local timezone - tzinfo is {tzinfo}")

def get_zoneinfo(timezone_name: str) -> ZoneInfo:
    try:
        return ZoneInfo(timezone_name)
    except Exception as e:
        raise ValueError(f"Invalid timezone: {str(e)}")


@mcp.tool()
def get_current_time(timezone_name: str) -> TimeResult:
    """Get the current time in the specified timezone.
    
    Args:
        timezone_name (str): Name of the timezone (e.g., "Asia/Shanghai") or "local" for the system's local timezone.
        
    Returns:
        dict: A dictionary containing:
            - timezone (str): The name of the timezone (e.g., "Asia/Shanghai").
            - datetime (str): ISO-formatted current time (e.g., "2025-04-02T12:34:56").
            - is_dst (bool): Whether daylight saving time (DST) is active.
    """
    if timezone_name == "local":
        timezone_name = get_local_tz(args.local_timezone)
    timezone = get_zoneinfo(timezone_name)
    current_time = datetime.now(timezone)

    return TimeResult(
        timezone=timezone_name,
        datetime=current_time.isoformat(timespec="seconds"),
        is_dst=bool(current_time.dst()),
    )

@mcp.tool()
def convert_time(source_tz: str, time_str: str, target_tz: str) -> TimeConversionResult:
    """Convert a given time from one timezone to another.
    
    Args:
        source_tz (str): Source timezone (e.g., "Asia/Shanghai").
        time_str (str): Time to convert in "HH:MM" (24-hour) format (e.g., "14:30").
        target_tz (str): Target timezone (e.g., "America/New_York").
        
    Returns:
        dict: A dictionary containing:
            - source (dict): The original time in the source timezone.
                - timezone (str): Source timezone name.
                - datetime (str): ISO-formatted time (e.g., "2025-04-02T14:30:00").
                - is_dst (bool): Whether DST is active in the source timezone.
            - target (dict): The converted time in the target timezone.
                - timezone (str): Target timezone name.
                - datetime (str): ISO-formatted time (e.g., "2025-04-02T02:30:00").
                - is_dst (bool): Whether DST is active in the target timezone.
            - time_difference (str): Time difference between zones (e.g., "+8.0h" or "-5.5h").
            
    Raises:
        ValueError: If the time format is invalid or the timezone is unrecognized.
    """
    source_timezone = get_zoneinfo(source_tz)
    target_timezone = get_zoneinfo(target_tz)

    try:
        parsed_time = datetime.strptime(time_str, "%H:%M").time()
    except ValueError:
        raise ValueError("Invalid time format. Expected HH:MM [24-hour format]")

    now = datetime.now(source_timezone)
    source_time = datetime(
        now.year,
        now.month,
        now.day,
        parsed_time.hour,
        parsed_time.minute,
        tzinfo=source_timezone,
    )

    target_time = source_time.astimezone(target_timezone)
    source_offset = source_time.utcoffset() or timedelta()
    target_offset = target_time.utcoffset() or timedelta()
    hours_difference = (target_offset - source_offset).total_seconds() / 3600

    if hours_difference.is_integer():
        time_diff_str = f"{hours_difference:+.1f}h"
    else:
        time_diff_str = f"{hours_difference:+.2f}".rstrip("0").rstrip(".") + "h"

    return TimeConversionResult(
        source=TimeResult(
            timezone=source_tz,
            datetime=source_time.isoformat(timespec="seconds"),
            is_dst=bool(source_time.dst()),
        ),
        target=TimeResult(
            timezone=target_tz,
            datetime=target_time.isoformat(timespec="seconds"),
            is_dst=bool(target_time.dst()),
        ),
        time_difference=time_diff_str,
    )



if __name__ == "__main__":
    import argparse
    import asyncio
    parser = argparse.ArgumentParser(
        description="give a model the ability to handle time queries and timezone conversions"
    )
    parser.add_argument("--local-timezone", type=str, help="Override local timezone")
    args = parser.parse_args()
    mcp.run(transport="stdio")