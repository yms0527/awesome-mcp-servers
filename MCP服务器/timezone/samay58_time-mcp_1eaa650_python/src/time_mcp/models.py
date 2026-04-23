from pydantic import BaseModel, Field


class TimeRequest(BaseModel):
    """
    Model for a time query.

    Attributes:
        timezone: A string representing the timezone (e.g., "America/Los_Angeles").
    """

    timezone: str = Field(
        "UTC", description="IANA timezone name (e.g., 'America/New_York')"
    )
