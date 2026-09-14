# MCP Server - Model Context Protocol API

[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Poetry](https://img.shields.io/badge/Poetry-1.7.0-60A5FA.svg?style=flat&logo=poetry)](https://python-poetry.org/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-E6522C.svg?style=flat&logo=prometheus)](https://prometheus.io/)
[![GraphQL](https://img.shields.io/badge/GraphQL-API-E10098.svg?style=flat&logo=graphql)](https://graphql.org/)

MCP Server - это реализация Model Context Protocol (MCP) на базе FastAPI, предоставляющая стандартизированный интерфейс для взаимодействия между LLM-моделями и приложениями.

## Особенности

- 🚀 **Высокопроизводительный API** на базе FastAPI и асинхронных операций
- 🔄 **Полная поддержка MCP** с ресурсами, инструментами, промптами и сэмплированием
- 📊 **Мониторинг и метрики** через Prometheus и Grafana
- 🧩 **Расширяемость** через простые интерфейсы для добавления новых инструментов
- 📝 **GraphQL API** для гибкой работы с данными
- 💬 **WebSocket поддержка** для реал-тайм взаимодействия
- 🔍 **Семантический поиск** через интеграцию с Elasticsearch
- 🗃️ **Кэширование** через Redis для улучшения производительности
- 📦 **Управление зависимостями** через Poetry для надежного управления пакетами

## Начало работы

### Установка

1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/yourusername/myaiserv.git
   cd myaiserv
   ```

2. Установить Poetry (если еще не установлен):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

3. Установить зависимости через Poetry:
   ```bash
   poetry install
   ```

### Запуск сервера

```bash
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Или через утилиту just:
```bash
just run
```

После запуска API доступен по адресу: [http://localhost:8000](http://localhost:8000)

### Документация API

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- GraphQL Playground: [http://localhost:8000/graphql](http://localhost:8000/graphql)

## Структура проекта

```
myaiserv/
├── app/
│   ├── core/             # Базовые компоненты MCP
│   │   ├── base_mcp.py   # Абстрактные классы MCP
│   │   └── base_sampling.py  # Базовые классы для сэмплирования
│   ├── models/           # Pydantic модели
│   │   ├── mcp.py        # Модели данных MCP
│   │   └── graphql.py    # GraphQL схема
│   ├── services/         # Бизнес-логика
│   │   └── mcp_service.py # Сервис MCP
│   ├── storage/          # Хранилище данных
│   ├── tools/            # Инструменты MCP
│   │   ├── example_tool.py   # Примеры инструментов
│   │   └── text_processor.py # Инструмент обработки текста
│   ├── utils/            # Утилиты
│   └── main.py           # Точка входа FastAPI
├── app/tests/            # Тесты
├── docs/                 # Документация
│   └── MCP_API.md        # Описание API
├── pyproject.toml        # Конфигурация Poetry и инструментов
└── .justfile             # Задачи для утилиты just
```

## Доступные инструменты

### File System Tool

Инструмент для работы с файловой системой, поддерживающий операции чтения, записи, удаления и листинга файлов.

```bash
curl -X POST "http://localhost:8000/tools/file_operations" \
     -H "Content-Type: application/json" \
     -d '{"operation": "list", "path": "."}'
```

### Weather Tool

Инструмент для получения погодных данных по координатам.

```bash
curl -X POST "http://localhost:8000/tools/weather" \
     -H "Content-Type: application/json" \
     -d '{"latitude": 37.7749, "longitude": -122.4194}'
```

### Text Analysis Tool

Инструмент для анализа текста, включая определение тональности и суммаризацию.

```bash
curl -X POST "http://localhost:8000/tools/text_analysis" \
     -H "Content-Type: application/json" \
     -d '{"text": "Example text for analysis", "analysis_type": "sentiment"}'
```

### Text Processor Tool

Инструмент для обработки текста, включая форматирование, расчет статистики, извлечение сущностей.

```bash
curl -X POST "http://localhost:8000/tools/text_processor" \
     -H "Content-Type: application/json" \
     -d '{"operation": "statistics", "text": "Example text", "stat_options": ["chars", "words"]}'
```

### Image Processing Tool

Инструмент для обработки изображений, поддерживающий изменение размера, обрезку и применение фильтров.

```bash
curl -X POST "http://localhost:8000/tools/image_processing" \
     -H "Content-Type: application/json" \
     -d '{"operation": "resize", "image_data": "base64...", "params": {"width": 800, "height": 600}}'
```

## WebSocket API

Для подключения к WebSocket API:

```javascript
const socket = new WebSocket("ws://localhost:8000/ws");

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: "initialize",
    id: "my-request-id"
  }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
};
```

## GraphQL API

Примеры запросов через GraphQL:

```graphql
# Получение списка всех инструментов
query {
  getTools {
    name
    description
  }
}

# Выполнение инструмента
mutation {
  executeTool(input: {
    name: "text_processor",
    parameters: {
      operation: "statistics",
      text: "Example text for analysis"
    }
  }) {
    content {
      type
      text
    }
    is_error
  }
}
```

## Запуск тестов

Для запуска тестов используйте Poetry:

```bash
poetry run pytest
```

Или через утилиту just:
```bash
just test
```

## Docker

### Сборка и запуск через Docker Compose

```bash
docker compose up -d
```

Для запуска отдельных сервисов:

```bash
docker compose up -d web redis elasticsearch
```

## Интеграция с LLM

MCP Server предоставляет стандартизированный интерфейс для интеграции с LLM-моделями различных поставщиков:

```python
import httpx

async def query_mcp_with_llm(prompt: str):
    async with httpx.AsyncClient() as client:
        # Запрос к MCP для получения контекста и инструментов
        tools_response = await client.get("http://localhost:8000/tools")
        tools = tools_response.json()["tools"]

        # Отправка запроса к LLM с включением MCP контекста
        llm_response = await client.post(
            "https://api.example-llm.com/v1/chat",
            json={
                "messages": [
                    {"role": "system", "content": "You have access to the following tools:"},
                    {"role": "user", "content": prompt}
                ],
                "tools": tools,
                "tool_choice": "auto"
            }
        )

        return llm_response.json()
```

## Метрики и мониторинг

MCP Server предоставляет метрики в формате Prometheus по эндпоинту `/metrics`. Метрики включают:

- Количество запросов к каждому инструменту
- Время выполнения запросов
- Ошибки и исключения

## Разработка

Для форматирования кода и проверки линтерами:
```bash
just fmt
just lint
```

## Лицензия

[MIT License](LICENSE)
