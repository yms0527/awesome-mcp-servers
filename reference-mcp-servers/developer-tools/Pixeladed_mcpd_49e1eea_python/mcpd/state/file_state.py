import json
from pathlib import Path
from typing import Optional

from platformdirs import user_data_dir

from mcpd.config import APP_NAME, APP_AUTHOR
from .state import Server, StateManager
from pydantic import BaseModel


class ServersState(BaseModel):
    servers: dict[str, Server]


SERVERS_FILE = "servers.json"
DEFAULT_SERVERS_STATE = ServersState(servers={})


class FileStateManager(StateManager):
    """File-based implementation of StateManager that persists state to the user's data directory."""

    @classmethod
    def from_user_data_dir(cls) -> "FileStateManager":
        """Create a FileStateManager from the user's data directory."""
        data_dir = Path(user_data_dir(APP_NAME, APP_AUTHOR))
        return cls(data_dir)

    def __init__(self, data_dir: Path | str):
        data_dir = Path(data_dir)
        data_dir.mkdir(parents=True, exist_ok=True)

        self.state_file = data_dir / SERVERS_FILE
        self._maybe_init_state()

    def _save_state(self, state: ServersState) -> None:
        """Save the state to disk."""
        with open(self.state_file, "w") as f:
            json.dump(state.model_dump(), f, indent=2)

    def list(self) -> list[Server]:
        return list(self._load_state().servers.values())

    def get(self, name: str) -> Optional[Server]:
        return self._load_state().servers.get(name)

    def set(self, name: str, server: Server) -> None:
        state = self._load_state()
        state.servers[name] = server
        self._save_state(state)

    def delete(self, name: str) -> None:
        state = self._load_state()
        if name in state.servers:
            del state.servers[name]
            self._save_state(state)

    def _load_state(self) -> ServersState:
        """Load the state from disk."""
        try:
            with open(self.state_file, "r") as f:
                data = json.load(f)
                return ServersState.model_validate(data)
        except json.JSONDecodeError:
            raise Exception(f"Failed to deserialize state file at {self.state_file}")
        except FileNotFoundError:
            self._maybe_init_state()
            return DEFAULT_SERVERS_STATE

    def _maybe_init_state(self) -> None:
        """Initialize empty state file if it doesn't exist."""
        if not self.state_file.exists():
            self._save_state(DEFAULT_SERVERS_STATE)
