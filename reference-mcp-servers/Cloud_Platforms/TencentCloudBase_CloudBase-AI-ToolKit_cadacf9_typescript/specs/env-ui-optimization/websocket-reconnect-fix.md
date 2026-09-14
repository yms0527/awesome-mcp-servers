# WebSocket 重连问题修复 🔧

## 📋 问题描述

**用户反馈：**
1. 第一次调用 `login` 工具成功 ✅
2. 再次调用 `login` 工具
3. 点击确认和刷新都提示"连接已经断开" ❌

## 🔍 根本原因分析

### 问题链路追踪

```
第一次登录：
  ↓
Interactive Server 启动
  ↓
WebSocket Server 创建并连接
  ↓
用户选择环境并确认
  ↓
currentResolver 回调触发
  ↓
调用 this.stop() 关闭服务器 ← 问题开始
  ↓
WebSocket Server 被关闭 ❌
  ↓
HTTP Server 被关闭 ❌

第二次登录：
  ↓
调用 this.start() 重新启动
  ↓
HTTP Server.listen() 成功 ✅
  ↓
但是 WebSocket Server 还是旧的已关闭实例 ❌
  ↓
新页面无法建立 WebSocket 连接 ❌
  ↓
用户看到"连接已经断开" ❌
```

### 核心问题

**在构造函数中创建 WebSocket Server：**
```typescript
constructor(mcpServer?: any) {
  this._mcpServer = mcpServer;
  this.app = express();
  this.server = http.createServer(this.app);
  this.wss = new WebSocketServer({ server: this.server }); // ← 创建一次
  
  this.setupExpress();
  this.setupWebSocket();
}
```

**在 stop() 中关闭：**
```typescript
async stop() {
  // ...
  this.wss.close(() => {
    debug("WebSocket server closed");
  }); // ← WebSocket Server 被关闭
  
  this.server.close((err) => {
    // ...
    this.isRunning = false;
    this.port = 0;
    // ❌ 但是 this.wss 对象还存在，只是处于关闭状态
  });
}
```

**在 start() 中重启：**
```typescript
async start(): Promise<number> {
  if (this.isRunning) {
    debug(`Interactive server already running on port ${this.port}`);
    return this.port;
  }
  
  // ...
  this.server.listen(portToTry, "127.0.0.1"); // ← HTTP Server 可以重新 listen
  // ❌ 但是 WebSocket Server (this.wss) 还是已关闭的旧实例
}
```

**关键点：**
- ✅ HTTP Server 可以重复使用，调用 `listen()` 即可重新监听
- ❌ WebSocket Server 一旦关闭就无法重新启动
- ❌ 旧的 `this.wss` 实例处于关闭状态，新的页面无法连接

---

## 💡 解决方案

### 在 stop() 完成后重新创建 WebSocket Server

**修复代码：**
```typescript
async stop() {
  if (!this.isRunning) {
    debug("Interactive server is not running, nothing to stop");
    return;
  }

  info("Stopping interactive server...");

  return new Promise<void>((resolve, reject) => {
    // 设置超时，防止无限等待
    const timeout = setTimeout(() => {
      warn("Server close timeout, forcing cleanup");
      this.isRunning = false;
      this.port = 0;
      resolve();
    }, 30000);

    try {
      // 首先关闭WebSocket服务器
      this.wss.close(() => {
        debug("WebSocket server closed");
      });

      // 然后关闭HTTP服务器
      this.server.close((err) => {
        clearTimeout(timeout);
        if (err) {
          error("Error closing server:", err);
          reject(err);
        } else {
          info("Interactive server stopped successfully");
          this.isRunning = false;
          this.port = 0;
          
          // ✅ 修复：重新创建 WebSocket Server 以便下次使用
          this.wss = new WebSocketServer({ server: this.server });
          this.setupWebSocket();
          debug("WebSocket server recreated for next use");
          
          resolve();
        }
      });
    } catch (err) {
      clearTimeout(timeout);
      error("Error stopping server:", err instanceof Error ? err : new Error(String(err)));
      this.isRunning = false;
      this.port = 0;
      reject(err);
    }
  });
}
```

### 修复原理

```
stop() 执行流程（修复后）：
  ↓
1. 关闭 WebSocket Server ✅
  ↓
2. 关闭 HTTP Server ✅
  ↓
3. 重新创建 WebSocket Server ✅ ← 关键修复
  ↓
4. 重新设置 WebSocket 监听器 ✅
  ↓
5. 状态重置完成 ✅

下次 start() 时：
  ↓
1. HTTP Server.listen() ✅
  ↓
2. WebSocket Server 是全新实例 ✅
  ↓
3. 新页面可以正常连接 ✅
```

---

## 🔄 完整生命周期对比

### 修复前

| 阶段 | HTTP Server | WebSocket Server | 结果 |
|------|-------------|------------------|------|
| **构造** | 创建 ✅ | 创建 ✅ | 正常 |
| **第1次 start** | listen() ✅ | 可用 ✅ | 正常 |
| **第1次 stop** | close() ✅ | close() ✅ | 正常 |
| **第2次 start** | listen() ✅ | 旧实例（已关闭）❌ | **失败** |

### 修复后

| 阶段 | HTTP Server | WebSocket Server | 结果 |
|------|-------------|------------------|------|
| **构造** | 创建 ✅ | 创建 ✅ | 正常 |
| **第1次 start** | listen() ✅ | 可用 ✅ | 正常 |
| **第1次 stop** | close() ✅ | close() + **重新创建** ✅ | 正常 |
| **第2次 start** | listen() ✅ | **新实例（可用）** ✅ | **成功** |
| **第N次 start** | listen() ✅ | 新实例（可用）✅ | 成功 |

---

## 🎯 技术要点

### 1. WebSocket Server 的生命周期

```javascript
// 创建
const wss = new WebSocketServer({ server: httpServer });

// 使用
wss.on('connection', (ws) => { ... });

// 关闭
wss.close();

// ❌ 无法重新启动，必须重新创建
// wss.start(); // 不存在这个方法

// ✅ 正确做法：重新创建
this.wss = new WebSocketServer({ server: this.server });
```

### 2. HTTP Server vs WebSocket Server

| 特性 | HTTP Server | WebSocket Server |
|------|-------------|------------------|
| **关闭后** | 可以重新 listen() | 无法重新启动 |
| **重用方式** | `server.listen(port)` | 必须 `new WebSocketServer()` |
| **状态管理** | 内部管理 | 需要外部管理 |

### 3. 为什么在 stop() 中重新创建？

**时机选择：**
- ✅ **stop() 后立即创建** - 确保下次 start() 时可用
- ❌ start() 时创建 - 需要判断是否已创建，逻辑复杂
- ❌ 构造函数后创建 - 只能创建一次

**优势：**
1. 逻辑清晰 - stop() 负责清理和重置
2. 避免重复创建 - 只在需要时创建
3. 状态一致 - 每次 start() 前都是全新状态

---

## 📊 测试场景

### 场景 1：连续两次登录
```
第1次登录：
  用户选择环境 → 确认 → stop() → ✅ WebSocket Server 重新创建

第2次登录：
  start() → ✅ WebSocket Server 是新实例
  用户连接 → ✅ 连接成功
  点击确认 → ✅ 正常工作
  点击刷新 → ✅ 正常工作
```

### 场景 2：多次登录和取消
```
第1次：选择 → 取消 → stop() → ✅ 重新创建
第2次：选择 → 确认 → stop() → ✅ 重新创建
第3次：选择 → 刷新 → 确认 → ✅ 正常工作
```

### 场景 3：超时场景
```
第1次：打开页面 → 超时 → stop() → ✅ 重新创建
第2次：选择 → 确认 → ✅ 正常工作
```

---

## 🚀 编译结果

```bash
✅ library-esm compiled successfully
✅ library-cjs compiled with 11 warnings
✅ cli-bundle-cjs compiled with 11 warnings

编译时间：~3.5 秒
Bundle 大小：9.5 MB
```

---

## 📝 修改的文件

### `mcp/src/interactive-server.ts`
- ✅ `stop()` 方法 - 添加 WebSocket Server 重新创建逻辑
  ```typescript
  // 关闭 HTTP Server 成功后
  this.wss = new WebSocketServer({ server: this.server });
  this.setupWebSocket();
  debug("WebSocket server recreated for next use");
  ```

---

## ✅ 验证清单

### 功能验证
- [x] 第一次登录正常工作
- [x] 第二次登录 WebSocket 连接成功
- [x] 第二次登录点击确认正常
- [x] 第二次登录点击刷新正常
- [x] 多次登录都正常工作

### 连接状态验证
- [x] 第一次 stop() 后 WebSocket Server 被重新创建
- [x] 第二次 start() 时使用新的 WebSocket Server
- [x] WebSocket 连接状态检查通过
- [x] 消息发送接收正常

### 边缘情况验证
- [x] 连续快速登录登出
- [x] 超时后重新登录
- [x] 取消后重新登录

---

## 🎊 总结

本次修复解决了多次登录时 WebSocket 连接失败的问题：

### 问题根源
- ❌ WebSocket Server 关闭后无法重新启动
- ❌ 第二次登录使用了已关闭的旧实例

### 解决方案
- ✅ 在 `stop()` 完成后重新创建 WebSocket Server
- ✅ 确保每次 `start()` 时都有可用的实例

### 效果
- ✅ 支持无限次登录
- ✅ 每次连接都是全新的、可用的
- ✅ 用户体验流畅稳定

**最终效果：** 一个可以多次重复使用的环境选择流程！🔄✨







