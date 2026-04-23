from enum import Enum
from typing import Protocol, Optional
from pydantic import BaseModel


class ServerStatus(str, Enum):
    CREATED = "created"
    RUNNING = "running"
    STOPPED = "stopped"


class Server(BaseModel):
    name: str
    package: str
    docker_image_id: str
    container_id: str
    status: ServerStatus
    env: dict[str, str]


class StateManager(Protocol):
    """Responsible for storing the metadata about the state of the system, including what MCP servers are running."""

    def list(self) -> list[Server]: ...
    def get(self, name: str) -> Optional[Server]: ...
    def set(self, name: str, server: Server) -> None: ...
    def delete(self, name: str) -> None: ...
