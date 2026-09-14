FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装项目依赖
RUN pip install --no-cache-dir qrcode>=7.4.2 Pillow>=10.0.0 mcp>=1.0.0 uvicorn>=0.30.0

# 复制源代码
COPY qrcode_mcp_server.py qrcode_utils.py docker-entrypoint.sh ./

# 给启动脚本执行权限
RUN chmod +x docker-entrypoint.sh

# 暴露端口
EXPOSE 8008

# 设置环境变量
ENV TRANSPORT_MODE=sse
ENV HOST=0.0.0.0
ENV PORT=8008

# 使用启动脚本
ENTRYPOINT ["./docker-entrypoint.sh"] 