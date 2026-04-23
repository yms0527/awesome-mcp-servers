from setuptools import setup, find_packages

setup(
    name="mcp-server",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.95.0",
        "uvicorn>=0.22.0",
        "pydantic>=2.0.0",
        "typing-extensions>=4.5.0",
        "requests>=2.28.0",
        "python-dotenv>=1.0.0",
    ],
    author="Your Name",
    author_email="your.email@example.com",
    description="A Model Context Protocol (MCP) server implementation",
    keywords="mcp, ai, tools",
    python_requires=">=3.8",
)