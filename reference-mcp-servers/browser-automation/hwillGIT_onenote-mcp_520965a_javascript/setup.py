from setuptools import setup, find_packages

setup(
    name="onenote-mcp",
    version="0.1.0",
    description="MCP server for OneNote web app integration using browser-use",
    author="AI Assistant",
    packages=find_packages(),
    install_requires=[
        "browser-use>=0.1.40",
        "mcp>=1.2.0",
        "playwright>=1.30.0",
        "httpx>=0.22.0",
    ],
    python_requires=">=3.10",
    entry_points={
        "console_scripts": [
            "onenote-mcp=onenote_mcp:main",
        ],
    },
)