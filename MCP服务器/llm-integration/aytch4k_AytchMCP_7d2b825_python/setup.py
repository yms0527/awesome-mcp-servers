from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as f:
    requirements = f.read().splitlines()

setup(
    name="aytchmcp",
    version="0.1.0",
    author="Aytch4K",
    author_email="info@aytch4k.com",
    description="Aytch4K Model Context Protocol Server",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Aytch4K/AytchMCP",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.9",
    install_requires=[req for req in requirements if not req.startswith("#")],
    extras_require={
        "dev": [
            "pytest>=7.4.3",
            "pytest-asyncio>=0.21.1",
            "black>=23.10.1",
            "isort>=5.12.0",
            "mypy>=1.6.1",
            "ruff>=0.1.3",
            "build>=1.0.3",
        ],
    },
    entry_points={
        "console_scripts": [
            "aytchmcp=aytchmcp.cli:main",
        ],
    },
)