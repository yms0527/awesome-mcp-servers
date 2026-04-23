from typing import Protocol, Literal, Callable
from pydantic import BaseModel
from github import Github
import base64


class GithubPackageSource(BaseModel):
    source_type: Literal["github"] = "github"
    repo: str


class LocalPackageSource(BaseModel):
    source_type: Literal["local"] = "local"
    dockerfile_path: str


class BuiltinPackageSource(BaseModel):
    source_type: Literal["builtin"] = "builtin"


PackageSource = GithubPackageSource | LocalPackageSource | BuiltinPackageSource


class Package(BaseModel):
    name: str
    description: str
    source: PackageSource
    get_dockerfile_content: Callable[[], str]


class Registry(Protocol):
    """
    A registry of MCP packages, how to find and retrieve them. It is not responsible for installing them.
    """

    def get(self, name: str) -> Package: ...
    def search(self, query: str) -> list[Package]: ...


class GitHubRegistry:
    def __init__(self, github: Github = Github()):
        self.github = github

    def get(self, name: str) -> Package:
        """Get a package by its exact name."""
        try:
            github_repo = self.github.get_repo(name)
            source = GithubPackageSource(repo=name)
            return Package(
                name=name,
                description=github_repo.description or "",
                source=source,
                get_dockerfile_content=lambda: self._get_dockerfile_content(source),
            )
        except Exception as e:
            raise ValueError(f"GitHub repo {name} not found") from e

    def search(self, query: str) -> list[Package]:
        """Search for packages matching the query."""
        repos = self.github.search_repositories(query=f"{query} topic:mcp")

        packages = []
        for repo in repos.get_page(0):
            source = GithubPackageSource(repo=repo.full_name)
            packages.append(
                Package(
                    name=f"{repo.owner.login}/{repo.name}",
                    description=repo.description or "",
                    source=source,
                    get_dockerfile_content=lambda: self._get_dockerfile_content(source),
                )
            )
        return packages

    def _get_dockerfile_content(self, source: GithubPackageSource) -> str:
        """Get the Dockerfile content for a package."""
        try:
            repo = self.github.get_repo(source.repo)
            content = repo.get_contents("Dockerfile")

            if hasattr(content, "content"):
                return base64.b64decode(content.content).decode("utf-8")
            raise ValueError("Dockerfile not found")

        except Exception as e:
            raise ValueError(f"Could not fetch Dockerfile from {source.repo}") from e
