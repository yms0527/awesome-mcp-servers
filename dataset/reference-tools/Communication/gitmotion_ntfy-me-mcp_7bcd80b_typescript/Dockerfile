FROM node:20-slim

WORKDIR /app

# Create a non-root user
RUN adduser --disabled-password --gecos "" mcp_user

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# Copy build files only (we don't need src for production)
COPY --chown=mcp_user:mcp_user build ./build

# Create a volume for configuration if needed
VOLUME /app/config

# Set environment variables
ENV NODE_ENV=production
ENV MCP_PORT=3000

# Expose the MCP port (default is 3000)
EXPOSE 3000

# Change to non-root user
USER mcp_user

# Add healthcheck to verify the service is running
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://localhost:3000/health || exit 1

# Start the MCP server
CMD ["node", "build/index.js"]

# The following environment variables can be passed when running the container:
# - NTFY_TOPIC: Your ntfy topic name
# - NTFY_URL: Your ntfy server URL (default: https://ntfy.sh)
# - NTFY_TOKEN: Authentication token for protected topics
# - PROTECTED_TOPIC: Set to "true" for protected topics
