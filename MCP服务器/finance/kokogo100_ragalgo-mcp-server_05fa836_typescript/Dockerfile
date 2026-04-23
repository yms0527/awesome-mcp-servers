# Build stage
# Build stage
# Build stage
# Build stage
FROM node:22-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22-slim

WORKDIR /app
COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production

# Install ca-certificates for potential SSL/external requests
# Consolidated and added -qq for quieter logs, but main fix is fresh image
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
