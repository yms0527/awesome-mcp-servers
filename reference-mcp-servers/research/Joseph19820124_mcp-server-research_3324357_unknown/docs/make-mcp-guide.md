# Make.com MCP Server 创建指南

> 在 Make.com 上创建自定义 MCP Server，让 AI 助手执行您的专属自动化场景

## 🎯 什么是 Make.com MCP Server？

Make.com MCP Server 是一个云端网关，将您在 Make.com 创建的自动化场景转换为 AI 可调用的工具。与 Zapier MCP 不同，Make.com 允许您完全自定义自动化逻辑，创建独特的 AI 工具。

### 核心优势
- 🎨 **完全自定义** - 创建任意复杂的自动化逻辑
- ☁️ **云端托管** - 无需本地服务器或 Docker
- 🔧 **可视化设计** - 拖拽式界面，无需编程
- 🚀 **实时同步** - 场景变更自动反映到 AI
- 🛡️ **企业级安全** - 内置权限控制和监控
- 💰 **灵活定价** - 根据使用量付费

## 🏗️ 技术架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Client     │◄──►│   Make.com      │◄──►│  External APIs  │
│ (Claude/Cursor) │    │   MCP Server    │    │ (任意服务)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
   自然语言指令           自定义场景执行              具体服务调用
```

### 工作原理

1. **场景设计** - 在 Make.com 中设计自动化场景
2. **MCP 暴露** - 场景自动转换为 MCP 工具
3. **AI 发现** - AI 客户端发现并理解工具功能
4. **智能调用** - AI 根据用户指令智能调用工具
5. **实时执行** - 场景在云端实时执行并返回结果

## 🚀 完整实施指南

### 第一步：创建和配置 Make 场景

#### 1.1 设计自动化场景

1. **登录 Make.com**
   - 访问 [Make.com](https://www.make.com)
   - 登录您的账户或注册新账户

2. **创建新场景**
   ```
   主页 → "Create a new scenario" → 选择触发器
   ```

3. **设计自动化流程**
   - 选择触发器（Webhook、定时器等）
   - 添加处理模块（数据转换、API 调用等）
   - 配置输出模块（数据库写入、通知发送等）

#### 1.2 配置场景输入参数

为了让 AI 能够正确调用您的场景，需要定义清晰的输入参数：

```json
{
  "inputs": [
    {
      "name": "customer_email",
      "type": "email",
      "label": "客户邮箱地址",
      "required": true,
      "description": "需要处理的客户邮箱地址"
    },
    {
      "name": "action_type",
      "type": "select",
      "options": ["create", "update", "delete"],
      "label": "操作类型",
      "required": true
    },
    {
      "name": "additional_data",
      "type": "json",
      "label": "附加数据",
      "required": false,
      "description": "可选的附加处理数据"
    }
  ]
}
```

#### 1.3 设置场景输出结构

定义清晰的输出结构有助于 AI 理解和处理结果：

```json
{
  "outputs": {
    "status": "success",
    "message": "客户数据处理完成",
    "data": {
      "customer_id": "12345",
      "processed_count": 3,
      "timestamp": "2025-06-01T10:30:00Z",
      "details": {
        "created_records": 2,
        "updated_records": 1,
        "errors": []
      }
    },
    "next_steps": [
      "发送确认邮件",
      "更新客户状态"
    ]
  }
}
```

#### 1.4 激活场景

**关键配置要求**：
- ✅ **状态设置为 Active**
- ✅ **执行模式设置为 On-demand**
- ✅ **配置适当的错误处理**
- ✅ **测试场景运行正常**

⚠️ **重要提醒**: 这两个设置缺一不可，否则 MCP server 无法访问您的场景。

### 第二步：获取 MCP Token

#### 2.1 生成 MCP Token

1. **导航到 API 设置**
   ```
   用户配置文件 → API/MCP access → Add token
   ```

2. **创建 MCP Token**
   - 选择 "MCP Token" 类型
   - 输入描述性标签（如 "AI Assistant Access"）
   - 点击 "Add" 生成 Token

3. **获取 MCP URL**
   系统会生成类似以下格式的 URL：
   ```
   https://<MAKE_ZONE>/mcp/api/v1/u/<MCP_TOKEN>/sse
   ```

#### 2.2 理解 URL 组成

- `<MAKE_ZONE>`: 您的组织所在区域
  - `eu1.make.com` (欧洲区域 1)
  - `eu2.make.com` (欧洲区域 2)
  - `us1.make.com` (美国区域 1)
  - `us2.make.com` (美国区域 2)
- `<MCP_TOKEN>`: 您的唯一访问令牌

🔒 **安全提醒**: 此 URL 包含敏感信息，请妥善保管，仅与可信任方共享。

### 第三步：连接 AI 客户端

#### 3.1 Claude Desktop 配置

在 Claude Desktop 的配置文件中添加：

```json
{
  "mcpServers": {
    "make": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://eu2.make.com/mcp/api/v1/u/YOUR_TOKEN/sse"
      ]
    }
  }
}
```

#### 3.2 Cursor IDE 配置

在 Cursor 的 MCP 设置中添加：

```json
{
  "mcpServers": {
    "make": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://eu2.make.com/mcp/api/v1/u/YOUR_TOKEN/sse"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

#### 3.3 Windsurf 配置

```json
{
  "mcpServers": {
    "make": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://eu2.make.com/mcp/api/v1/u/YOUR_TOKEN/sse"
      ]
    }
  }
}
```

### 第四步：测试和验证

#### 4.1 使用 MCP Inspector 测试

```bash
# 安装 MCP Inspector
npm install -g @anthropic-ai/mcp-inspector

# 启动 Inspector
mcp-inspector

# 在浏览器中连接到您的 MCP server
# URL: http://localhost:5173
# MCP Server URL: https://eu2.make.com/mcp/api/v1/u/YOUR_TOKEN/sse
```

#### 4.2 在 AI 客户端中测试

1. **列出可用工具**
   ```
   "显示所有可用的 Make 工具"
   ```

2. **测试简单调用**
   ```
   "运行客户数据处理场景，邮箱是 test@example.com"
   ```

3. **验证输出格式**
   检查返回的数据是否符合预期格式

## 🎯 实际应用示例

### 示例 1：客户反馈收集系统

#### 场景设计
```
触发器: Webhook
↓
数据解析: 解析客户反馈数据
↓
情感分析: 调用 AI API 分析情感
↓
分类处理: 根据情感分类不同处理
↓
通知发送: 发送给相关团队
↓
数据存储: 保存到数据库
```

#### AI 使用方式
```
用户: "收集并分析今天的客户反馈"
AI: 调用 Make 场景 → 返回分析结果和处理建议
```

### 示例 2：团队容量管理

#### 场景设计
```
触发器: On-demand
↓
数据查询: 从项目管理工具获取任务
↓
容量计算: 计算团队成员工作负载
↓
预警检查: 检查是否超负荷
↓
报告生成: 生成可视化报告
↓
结果返回: 返回结构化数据
```

#### AI 使用方式
```
用户: "检查开发团队的当前工作容量"
AI: 调用容量查询场景 → 显示团队负载状态和建议
```

### 示例 3：智能客服工单处理

#### 场景设计
```
触发器: 新工单创建
↓
内容分析: AI 分析工单内容
↓
优先级判断: 自动设置优先级
↓
专家分配: 分配给合适的支持专家
↓
知识库搜索: 查找相关解决方案
↓
自动回复: 发送初始响应
```

#### AI 使用方式
```
用户: "处理新的客服工单 #12345"
AI: 调用工单处理场景 → 自动分析、分配并初步响应
```

## ⚙️ 高级配置

### 4.1 工具访问控制

您可以精确控制哪些场景对 AI 可见：

1. **场景级控制**
   - 在场景设置中控制 MCP 可见性
   - 设置特定的访问权限

2. **参数级控制**
   - 限制某些敏感参数的访问
   - 设置参数验证规则

### 4.2 自定义工具名称

```url
https://eu2.make.com/mcp/api/v1/u/YOUR_TOKEN/sse?maxToolNameLength=64
```

默认工具名称最大长度为 56 字符，您可以通过参数调整。

### 4.3 错误处理配置

在场景中配置robust的错误处理：

```json
{
  "error_handling": {
    "retry_attempts": 3,
    "retry_delay": 5000,
    "fallback_action": "notify_admin",
    "error_notification": {
      "email": "admin@company.com",
      "slack_channel": "#alerts"
    }
  }
}
```

### 4.4 性能优化

#### 场景优化技巧
- **批量处理** - 设计支持批量操作的场景
- **异步执行** - 对于长时间运行的任务使用异步模式
- **缓存策略** - 缓存频繁访问的数据
- **资源限制** - 设置合适的执行时间和内存限制

#### 监控配置
```json
{
  "monitoring": {
    "execution_time_alert": 30000,
    "memory_usage_alert": 512,
    "error_rate_threshold": 0.05,
    "notification_channels": [
      "email",
      "slack",
      "webhook"
    ]
  }
}
```

## 🛡️ 安全最佳实践

### 5.1 Token 安全

- 🔄 **定期轮换**: 每 90 天轮换一次 MCP Token
- 🔒 **环境隔离**: 生产和测试环境使用不同的 Token
- 📋 **访问日志**: 定期审查 Token 使用日志
- 🚫 **最小权限**: 仅激活必要的场景

#### Token 轮换流程

1. 生成新的 MCP Token
2. 更新所有客户端配置
3. 验证新 Token 工作正常
4. 撤销旧 Token
5. 更新文档和团队通知

### 5.2 场景安全

#### 输入验证
```javascript
// 在场景中添加输入验证
if (!email || !isValidEmail(email)) {
  throw new Error('无效的邮箱地址');
}

if (amount && (amount < 0 || amount > 10000)) {
  throw new Error('金额超出允许范围');
}
```

#### 权限检查
```javascript
// 验证用户权限
const userRole = getUserRole(userId);
if (!hasPermission(userRole, 'customer_data_access')) {
  throw new Error('权限不足');
}
```

### 5.3 数据保护

- 🔐 **数据加密**: 敏感数据传输时加密
- 🗑️ **数据清理**: 定期清理临时数据
- 📊 **访问记录**: 记录所有数据访问操作
- 🛡️ **合规检查**: 确保符合 GDPR 等法规

## 📊 监控和分析

### 6.1 性能指标

#### 关键监控指标
```json
{
  "performance_metrics": {
    "avg_execution_time": 2500,
    "success_rate": 98.7,
    "error_rate": 1.3,
    "throughput": 150,
    "peak_concurrent_executions": 25
  },
  "resource_usage": {
    "cpu_utilization": 45,
    "memory_usage": 512,
    "network_io": 1024,
    "storage_usage": 2048
  }
}
```

#### 设置告警
- **执行时间过长** (> 30秒)
- **错误率过高** (> 5%)
- **并发数过多** (> 50)
- **资源使用过高** (> 80%)

### 6.2 使用分析

```json
{
  "usage_analytics": {
    "total_executions": 15420,
    "unique_tools_used": 12,
    "most_popular_tools": [
      "customer_data_processor",
      "email_automation",
      "report_generator"
    ],
    "peak_usage_hours": ["09:00", "14:00", "16:00"],
    "geographic_distribution": {
      "Asia": 45,
      "Europe": 35,
      "Americas": 20
    }
  }
}
```

## 🔧 故障排除

### 7.1 常见问题

#### 问题 1: 场景无法被 AI 发现
**症状**: AI 客户端显示没有可用工具

**解决步骤**:
1. 检查场景是否设置为 Active
2. 确认执行模式为 On-demand
3. 验证 MCP Token 是否正确
4. 检查网络连接

```bash
# 测试连接
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://eu2.make.com/mcp/api/v1/tools"
```

#### 问题 2: 场景执行失败
**症状**: 工具调用返回错误

**解决步骤**:
1. 检查场景配置
2. 验证输入参数格式
3. 查看执行日志
4. 检查外部 API 状态

#### 问题 3: 权限被拒绝
**症状**: 执行时提示权限不足

**解决步骤**:
1. 检查 MCP Token 权限
2. 验证场景访问控制设置
3. 确认用户角色权限
4. 重新生成 Token

### 7.2 调试工具

#### 启用详细日志
```json
{
  "mcpServers": {
    "make": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "YOUR_URL"],
      "env": {
        "DEBUG": "mcp:*",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

#### 使用 Make 调试工具
1. **场景执行历史** - 查看详细执行记录
2. **实时日志** - 监控场景实时执行
3. **性能分析** - 分析执行性能瓶颈
4. **错误追踪** - 追踪错误发生原因

## 💰 定价和使用限制

### 8.1 Make.com 定价结构

| 计划 | 月操作数 | 价格 | MCP 支持 |
|------|----------|------|----------|
| **Free** | 1,000 | 免费 | ✅ 支持 |
| **Core** | 10,000 | $9/月 | ✅ 支持 |
| **Pro** | 10,000 | $16/月 | ✅ 支持 + 高级功能 |
| **Teams** | 10,000 | $29/月 | ✅ 团队管理 |
| **Enterprise** | 无限制 | 定制 | ✅ 企业级支持 |

### 8.2 MCP 特定限制

- **并发连接**: 5-50 个（根据计划）
- **场景数量**: 无限制
- **执行超时**: 40 分钟
- **数据传输**: 10MB/操作
- **API 调用频率**: 60/分钟

### 8.3 企业级功能

#### Teams 和 Enterprise 计划额外功能
- 🏢 **团队管理** - 多用户协作
- 🔒 **高级安全** - SSO、IP 限制
- 📊 **高级分析** - 详细使用报告
- 🎯 **专属支持** - 优先技术支持
- 🔧 **定制集成** - 专属连接器开发

## 🔮 Make.com MCP 发展路线图

### 即将推出的功能
- 🤖 **AI 增强场景** - 内置 AI 模块优化
- 🔄 **自动化模板** - 预构建的 MCP 场景模板
- 📊 **智能分析** - AI 驱动的使用分析
- 🎯 **个性化推荐** - 基于使用模式的场景推荐

### 技术发展方向
- **Q3 2025**: 增强 AI 集成能力
- **Q4 2025**: 推出移动端 MCP 支持
- **Q1 2026**: 引入边缘计算支持
- **Q2 2026**: 完整的多租户企业解决方案

## 📚 学习资源

### 官方文档
- [Make.com MCP 开发者文档](https://developers.make.com/mcp-server/)
- [Make.com 自动化指南](https://www.make.com/en/help)
- [MCP 协议官方规范](https://github.com/modelcontextprotocol)

### 教学资源
- [Make.com 视频教程](https://www.make.com/en/academy)
- [MCP 实战案例](https://www.make.com/en/blog/mcp-use-cases)
- [自动化最佳实践](https://www.make.com/en/blog/automation-best-practices)

### 社区支持
- [Make.com 用户社区](https://community.make.com/)
- [GitHub 讨论区](https://github.com/makecom/mcp-discussions)
- [Discord 服务器](https://discord.gg/makecom)

---

**Make.com MCP Server 让您的创意自动化变为现实，为 AI 助手赋予无限可能！**

*最后更新: 2025年6月1日*