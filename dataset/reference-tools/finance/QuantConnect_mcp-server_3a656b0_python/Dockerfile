# Use a slim Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install uv
RUN pip install uv

# Copy dependency files
COPY pyproject.toml .

# Generate uv.lock during the build
RUN uv lock

# Install dependencies with uv
RUN uv sync --frozen

# Copy source code
COPY src/ src/

# Run the server
CMD ["uv", "run", "src/main.py"]
