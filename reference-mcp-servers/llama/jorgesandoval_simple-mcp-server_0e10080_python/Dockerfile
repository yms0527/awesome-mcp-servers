FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY mcp-server/ ./mcp_server/

EXPOSE 3000

CMD ["python", "mcp_server/anthropic_mcp_server.py"] 