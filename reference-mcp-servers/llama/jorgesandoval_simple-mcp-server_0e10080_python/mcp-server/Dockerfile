FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Expose port for Anthropic MCP server
EXPOSE 3000

# Configure environment variables
ENV MCP_PORT=3000

# Run the Anthropic MCP server
CMD ["python", "anthropic_mcp_server.py"] 