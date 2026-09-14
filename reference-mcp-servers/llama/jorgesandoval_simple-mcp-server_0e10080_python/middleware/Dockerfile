FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Expose port for the middleware
EXPOSE 8080

# Configure environment variables (will be overridden by docker-compose)
ENV MCP_SERVER_URL=http://mcp-server-container:3000
ENV OLLAMA_API_URL=http://host.docker.internal:11434/api/generate
ENV MODEL_NAME=gemma:3b

# Run the middleware server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"] 