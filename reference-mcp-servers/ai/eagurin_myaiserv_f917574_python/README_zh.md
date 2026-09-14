# FastAPI MCP 服务器:您强大的 AI 驱动应用程序 🚀

本项目展示了一个利用模型上下文协议 (MCP) 与大型语言模型 (LLM) 无缝集成的尖端 FastAPI 服务器。它旨在实现速度、可扩展性和易用性,是您下一个 AI 驱动应用程序的理想基础。

## 主要功能 ✨

- **闪电般的速度:** 使用 FastAPI 构建,实现最佳速度和效率。
- **灵活的数据存储:** 使用 Elasticsearch 进行强大的全文和向量搜索,并使用 Redis 进行闪电般的缓存。
- **强大的 MCP 实现:** 支持所有核心 MCP 功能:工具、资源、提示和采样。
- **GraphQL 集成:** 提供灵活的 GraphQL API,方便数据访问。
- **全面的监控:** 包括 Prometheus 指标和 Grafana 仪表板,用于实时监控和警报。
- **模块化设计:** 代码简洁、结构清晰,易于维护和扩展。
- **彻底的测试:** 包括单元测试和集成测试,确保可靠性。
- **轻松部署:** 使用 Docker 进行简单且一致的部署。

## 开始使用 🛠️

1. **克隆仓库:**

   ```bash
   git clone <repository-url>
   cd myaiserv
   ```

2. **创建虚拟环境:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows
   ```

3. **安装依赖项:**

   ```bash
   pip install -r requirements.txt
   ```

4. **配置环境变量:** 将 `.env.example` 复制到 `.env`,并根据您的环境调整值。

5. **运行应用程序:**

   ```bash
   uvicorn app.main:app --reload
   ```

6. **访问 API:**
   - API 文档: [http://localhost:8000/docs](http://localhost:8000/docs)
   - GraphQL Playground: [http://localhost:8000/graphql](http://localhost:8000/graphql)

## 使用示例 💡

### REST API

```python
import httpx
import asyncio

async def main():
    async with httpx.AsyncClient() as client:
        # 获取工具列表
        response = await client.get("http://localhost:8000/tools")
        print(response.json())

        # 执行工具
        result = await client.post(
            "http://localhost:8000/tools/weather",
            json={"latitude": 37.7749, "longitude": -122.4194}
        )
        print(result.json())

asyncio.run(main())
```

### GraphQL

```graphql
query {
    listTools {
        name
        description
    }
}

mutation {
    executeTool(
        name: "weather"
        parameters: {
            latitude: 37.7749
            longitude: -122.4194
        }
    ) {
        content {
            text
        }
    }
}
```

### WebSocket

```python
import asyncio
import websockets
import json

async def main():
    async with websockets.connect("ws://localhost:8000/mcp") as websocket:
        await websocket.send(json.dumps({"jsonrpc": "2.0", "method": "initialize"}))
        response = await websocket.recv()
        print(response)

asyncio.run(main())
```

## 项目结构 📁

```
myaiserv/
├── app/
│   ├── core/             # 核心 MCP 组件
│   ├── models/          # Pydantic 模型
│   ├── services/        # 业务逻辑
│   ├── storage/         # 数据库交互
│   ├── tools/           # MCP 工具
│   └── main.py         # FastAPI 应用程序
├── config/             # 配置文件
├── docs/               # 文档
├── migrations/         # 数据库迁移
├── scripts/            # 实用程序脚本
├── tests/              # 测试
└── requirements.txt   # 项目依赖项
```

## 贡献 🤝

我们欢迎您的贡献!请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 文件以了解如何开始。

## 许可证 📄

[MIT](LICENSE)
