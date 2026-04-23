from typing import Protocol, Optional
from mcpd.state import Server, StateManager, ServerStatus
from pydantic import BaseModel
import io
import docker
from docker import DockerClient


class ServerSpec(BaseModel):
    """
    A specificaiton for an MCP server that can be run by an executor.
    """

    name: str
    package: str
    docker_image_id: str
    env: dict[str, str]


class Executor(Protocol):
    def create_and_run(self, spec: ServerSpec, server_name: Optional[str]) -> Server:
        """Run an MCP server with the given specification and environment variables"""
        ...

    def create(self, spec: ServerSpec, server_name: Optional[str] = None) -> Server:
        """Create a stopped MCP server. You must call run() to start it."""
        ...

    def stop(self, server_name: str) -> Server:
        """Stop the MCP server with the given name"""
        ...

    def run(self, server_name: str) -> Server:
        """Run the MCP server with the given name"""
        ...

    def connect_stdio(self, server_name: str) -> tuple[io.TextIO, io.TextIO]:
        """
        Connect to the stdin and stdout of the MCP server with the given name.
        Returns a tuple (stdin, stdout) where stdin is a writable stream and stdout is a readable stream.
        """
        ...


class DockerExecutor:
    def __init__(self, client: DockerClient, state_manager: StateManager):
        self.client = client
        self.state = state_manager

    def create_and_run(
        self, spec: ServerSpec, server_name: Optional[str] = None
    ) -> Server:
        server = self.create(spec, server_name)
        return self.run(server.name)

    def create(self, spec: ServerSpec, server_name: Optional[str] = None) -> Server:
        name = server_name or spec.name

        if self.state.get(name) is not None:
            raise ValueError(f"Server with name {name} already exists")

        try:
            image = self.client.images.get(spec.docker_image_id)
        except docker.errors.ImageNotFound:
            # Pull the image if not found locally
            image = self.client.images.pull(spec.docker_image_id)

        # Create the container
        container = self.client.containers.create(
            image=image.id, name=name, environment=spec.env, detach=True
        )

        server = Server(
            name=name,
            package=spec.package,
            docker_image_id=spec.docker_image_id,
            container_id=container.id,
            status=ServerStatus.CREATED,
            env=spec.env,
        )

        self.state.set(name, server)
        return server

    def stop(self, server_name: str) -> Server:
        server = self.state.get(server_name)
        if server is None:
            raise ValueError(f"Server {server_name} not found")

        container = self.client.containers.get(server.container_id)
        container.stop()

        server.status = ServerStatus.STOPPED
        self.state.set(server_name, server)
        return server

    def run(self, server_name: str) -> Server:
        server = self.state.get(server_name)
        if server is None:
            raise ValueError(f"Server {server_name} not found")

        container = self.client.containers.get(server.container_id)
        container.start()

        server.status = ServerStatus.RUNNING
        self.state.set(server_name, server)
        return server

    def connect_stdio(self, server_name: str) -> tuple[io.TextIO, io.TextIO]:
        server = self.state.get(server_name)
        if server is None:
            raise ValueError(f"Server {server_name} not found")

        container = self.client.containers.get(server.container_id)
        socket = container.attach_socket(params={"stdin": 1, "stdout": 1, "stream": 1})

        return (
            io.TextIOWrapper(socket.makefile("wb")),
            io.TextIOWrapper(socket.makefile("rb")),
        )
