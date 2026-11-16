FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV UV_NO_PROGRESS=1
ENV UV_LINK_MODE=copy

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml ./

RUN uv pip install --system --no-cache-dir . --only-deps

COPY ./src ./src

RUN uv pip install --system --no-cache-dir . --no-deps

EXPOSE 8080

CMD ["flux-mcp-server", "--host", "0.0.0.0", "--port", "8080"]
