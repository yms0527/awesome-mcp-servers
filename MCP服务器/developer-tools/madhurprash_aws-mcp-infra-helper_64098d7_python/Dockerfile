FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for diagrams (graphviz)
RUN apt-get update && apt-get install -y --no-install-recommends \
    graphviz \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir boto3 diagrams mcp-server

# Copy your helper script
COPY aws-iac-helper.py /app/

# Make the script executable
RUN chmod +x /app/aws-iac-helper.py

# Set the entry point
ENTRYPOINT ["python", "/app/aws-iac-helper.py"]