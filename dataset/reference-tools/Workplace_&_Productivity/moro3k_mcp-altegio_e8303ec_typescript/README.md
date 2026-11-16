# mcp-altegio

MCP-сервер для [Altegio API](https://developer.alteg.io/api) — управление записями, клиентами, услугами, сотрудниками и расписанием через AI-ассистента.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-f9f1e1?logo=bun&logoColor=black)](https://bun.sh)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ed?logo=docker&logoColor=white)](Dockerfile)
[![MCP SDK](https://img.shields.io/badge/MCP_SDK-1.26-green?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHRleHQgeD0iMCIgeT0iMTMiIGZvbnQtc2l6ZT0iMTQiPuKamjwvdGV4dD48L3N2Zz4=)](https://github.com/modelcontextprotocol/typescript-sdk)
[![Tests](https://img.shields.io/badge/Tests-141_passing-brightgreen)](tests/)

## Возможности

- **18 MCP-инструментов** — записи, клиенты, услуги, сотрудники, расписание, финансы
- **CRUD-операции** — полный цикл создания, чтения, обновления и удаления записей и клиентов
- **Умный поиск** — автоопределение типа запроса (телефон, email, имя)
- **Docker-образ** — multi-stage build на Alpine (~184MB), готов к продакшну
- **141 тест** — unit, API-клиент, интеграционные MCP-тесты
- **Dual transport** — stdio (локально) и Streamable HTTP (удалённо, Smithery, облако)
- **stdio-транспорт** — работает с Claude Desktop, Claude Code, Cursor, VS Code Copilot

## Инструменты

**18 инструментов**, разбитые по категориям:

### 📅 Записи

| Инструмент | Описание |
|------------|----------|
| `get_records` | Записи за период с фильтрами по мастеру/клиенту |
| `get_records_by_client` | Все записи конкретного клиента |
| `get_records_by_visit` | Поиск записей по `api_id` (привязка к внешней системе) |
| `create_record` | Создать запись с полной настройкой параметров |
| `book_service` | Быстрое бронирование с привязкой к визиту |
| `update_record` | Изменить существующую запись |
| `delete_record` | Удалить запись |

### 👥 Клиенты

| Инструмент | Описание |
|------------|----------|
| `search_clients` | Поиск по имени, телефону или email (авто-определение) |
| `get_client` | Карточка клиента по ID |
| `create_client` | Создать нового клиента |
| `update_client` | Редактировать данные клиента |

### 🛎️ Услуги и сотрудники

| Инструмент | Описание |
|------------|----------|
| `get_services` | Каталог услуг (фильтр по мастеру/категории) |
| `get_service_categories` | Категории услуг |
| `get_staff` | Список сотрудников (по умолчанию без уволенных) |
| `get_staff_member` | Детали конкретного сотрудника |

### 📊 Расписание и финансы

| Инструмент | Описание |
|------------|----------|
| `get_available_times` | Свободные слоты на дату |
| `get_available_dates` | Рабочие дни мастера |
| `get_transactions` | Финансовые транзакции за период |

## Быстрый старт

### Требования

- [Bun](https://bun.sh/) >= 1.0 **или** [Docker](https://www.docker.com/)
- Партнёрский и пользовательский токены [Altegio API](https://developer.alteg.io)

### Установка

<details>
<summary><b>Bun (локально)</b></summary>

```bash
git clone https://github.com/moro3k/mcp-altegio.git
cd mcp-altegio
bun install
```

</details>

<details>
<summary><b>Docker</b></summary>

```bash
git clone https://github.com/moro3k/mcp-altegio.git
cd mcp-altegio
docker build -t mcp-altegio .
```

</details>

### Конфигурация

| Переменная | Обязательна | Описание |
|------------|:-----------:|----------|
| `ALTEGIO_TOKEN` | Да | Партнёрский токен API |
| `ALTEGIO_USER_TOKEN` | Да | Пользовательский токен |
| `ALTEGIO_COMPANY_ID` | Да | ID компании |

<details>
<summary><b>Где взять токены?</b></summary>

- **ALTEGIO_TOKEN** — партнёрский токен. Получается в [кабинете разработчика](https://developer.alteg.io) после регистрации партнёрского аккаунта
- **ALTEGIO_USER_TOKEN** — пользовательский токен. Получается через авторизацию к API (`POST /auth`) с логином и паролем аккаунта Altegio
- **ALTEGIO_COMPANY_ID** — ID компании. Виден в URL панели управления: `app.alteg.io/company/XXXXXX/...`

</details>

## Подключение

### Claude Desktop

Добавьте в конфигурацию (`~/Library/Application Support/Claude/claude_desktop_config.json` на macOS или `%APPDATA%\Claude\claude_desktop_config.json` на Windows):

<details>
<summary><b>Bun</b></summary>

```json
{
  "mcpServers": {
    "altegio": {
      "command": "bun",
      "args": ["run", "/полный/путь/к/mcp-altegio/src/index.ts"],
      "env": {
        "ALTEGIO_TOKEN": "ваш_токен",
        "ALTEGIO_USER_TOKEN": "ваш_токен",
        "ALTEGIO_COMPANY_ID": "12345"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Docker</b></summary>

```json
{
  "mcpServers": {
    "altegio": {
      "command": "docker",
      "args": ["run", "-i", "--rm",
        "-e", "ALTEGIO_TOKEN",
        "-e", "ALTEGIO_USER_TOKEN",
        "-e", "ALTEGIO_COMPANY_ID",
        "mcp-altegio"],
      "env": {
        "ALTEGIO_TOKEN": "ваш_токен",
        "ALTEGIO_USER_TOKEN": "ваш_токен",
        "ALTEGIO_COMPANY_ID": "12345"
      }
    }
  }
}
```

> Флаг `-i` обязателен — MCP работает через stdio.

</details>

### Claude Code

Добавьте в `.mcp.json` в корне проекта:

```json
{
  "mcpServers": {
    "altegio": {
      "command": "bun",
      "args": ["run", "/полный/путь/к/mcp-altegio/src/index.ts"],
      "cwd": "/полный/путь/к/mcp-altegio"
    }
  }
}
```

### Cursor

Settings → MCP Servers → Add new server:

```json
{
  "altegio": {
    "command": "bun",
    "args": ["run", "/полный/путь/к/mcp-altegio/src/index.ts"],
    "cwd": "/полный/путь/к/mcp-altegio"
  }
}
```

> Bun автоматически подтягивает `.env` из директории `cwd`. Можно использовать `.env` файл вместо передачи переменных напрямую.

### HTTP-транспорт (Streamable HTTP)

Для облачных деплоев и Smithery используйте HTTP-режим:

```bash
# Локально
bun run start:http

# Docker
docker run --rm -p 3000:3000 \
  -e ALTEGIO_TOKEN=ваш_токен \
  -e ALTEGIO_USER_TOKEN=ваш_токен \
  -e ALTEGIO_COMPANY_ID=12345 \
  mcp-altegio bun run src/http.ts
```

Сервер слушает на порту `3000` (переопределяется через `PORT`). Endpoint: `POST /mcp`.

Подключение через URL:

```json
{
  "mcpServers": {
    "altegio": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## Примеры

```
> Покажи все записи на сегодня
  → get_records

> Найди клиента по телефону +66812345678
  → search_clients → get_records_by_client

> Запиши Анну на тайский массаж к Kai на завтра в 14:00
  → get_services → get_available_times → create_record

> Покажи свободные слоты у Wanida на эту неделю
  → get_available_dates → get_available_times
```

## Разработка

```bash
bun install     # Установить зависимости
bun run start   # Запустить сервер
bun test        # Запустить тесты (141 тест)
```

### Структура проекта

```
src/
  server.ts     # Фабрика MCP-сервера, регистрация 18 инструментов
  index.ts      # Точка входа stdio
  http.ts       # Точка входа HTTP (Streamable HTTP)
  api.ts        # HTTP-клиент (авторизация, подстановка company_id)
  helpers.ts    # Вспомогательные функции (поиск, фильтры)
tests/
  helpers.test.ts   # Unit-тесты хелперов (39)
  api.test.ts       # Тесты HTTP-клиента (37)
  server.test.ts    # Интеграционные MCP-тесты (55)
```

### Тесты

141 тест с покрытием всех инструментов:

- **Unit** — автоопределение типа поиска, фильтрация сотрудников и записей
- **API-клиент** — HTTP-методы, авторизация, query-параметры, обработка ошибок
- **Интеграционные** — регистрация инструментов, схемы, вызов через MCP SDK клиент

## Стек

| Компонент | Технология |
|-----------|-----------|
| Runtime | [Bun](https://bun.sh/) 1.x |
| Язык | TypeScript 5.7 |
| SDK | [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) 1.26 |
| Валидация | Zod v4 |
| Тесты | Bun Test |
| Контейнер | Docker (Alpine) |
| Transport | stdio, Streamable HTTP |

## Особенности Altegio API

| Параметр | Описание |
|----------|----------|
| `api_id` | Только `number`. Строки игнорируются, записывается `0` |
| `save_if_busy` | `true` при программном создании записей |
| `seance_length` | Длительность в **секундах** (3600 = 1 час) |
| `attendance` | `-1` отменён · `0` ожидается · `1` подтверждён · `2` пришёл |
| `fired` | `0` активный · `1` уволенный |

## Участие

PR приветствуются. Форкните, улучшите, откройте PR.

Идеи:
- Групповые события (activities)
- Webhook-уведомления
- Кеширование запросов
- Работа с несколькими компаниями
- Складской учёт и товары

## Лицензия

[MIT](LICENSE)
