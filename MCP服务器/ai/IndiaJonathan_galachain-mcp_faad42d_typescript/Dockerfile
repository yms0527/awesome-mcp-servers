FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Change from CMD to ENTRYPOINT
ENTRYPOINT ["node", "dist/index.js"]