from typing import Protocol
import docker
import io


class Builder(Protocol):
    def build(self, name: str, tag: str, dockerfile_content: str) -> str:
        """Given a specification of an MCP server, create a Docker image locally and return it's tag"""
        ...


class DockerBuilder:
    @classmethod
    def create(cls) -> "DockerBuilder":
        return cls(docker.from_env())

    def __init__(self, client: docker.DockerClient):
        self.client = client

    def build(self, name: str, tag: str, dockerfile_content: str) -> str:
        client = docker.from_env()
        dockerfile_io = io.BytesIO(dockerfile_content.encode("utf-8"))

        # Build the image
        image, _ = client.images.build(
            name=name,
            fileobj=dockerfile_io,
            tag=tag,
            rm=True,  # Remove intermediate containers after build
        )

        return image.id
