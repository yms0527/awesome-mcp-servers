FROM node:20-slim
WORKDIR /app
COPY package.json tsconfig.json ./
COPY src/ src/
RUN npm install --ignore-scripts && npm run build
ENTRYPOINT ["node", "dist/index.js"]
