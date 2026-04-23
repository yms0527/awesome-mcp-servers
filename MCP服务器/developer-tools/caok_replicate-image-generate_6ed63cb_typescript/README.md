# Flux Image Generation Server

这是一个简单的HTTP服务器，用于调用Replicate的Flux Schnell模型生成图片。

## 安装

```bash
npm install
```

## 配置

在运行服务器之前，你需要设置Replicate API token作为环境变量：

```bash
export REPLICATE_API_TOKEN=your_token_here
```

## 运行服务器

编译并启动服务器：

```bash
npm run build
npm start
```

服务器将在端口3000上运行。

## API使用

服务器提供了一个简单的HTTP API端点来生成图片：

### 生成图片

**请求**

```bash
POST http://localhost:3000/generate
Content-Type: application/json

{
    "prompt": "your image description here"
}
```

**示例**

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "black forest gateau cake spelling out the words \"FLUX SCHNELL\", tasty, food photography, dynamic shot"}'
```

**响应**

成功响应：
```json
{
    "success": true,
    "data": {
        // Replicate API 返回的数据
    }
}
```

错误响应：
```json
{
    "success": false,
    "error": "错误信息"
}
```

## 关闭服务器

按 `Ctrl+C` 可以优雅地关闭服务器。