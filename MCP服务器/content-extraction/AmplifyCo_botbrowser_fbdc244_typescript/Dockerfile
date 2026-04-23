FROM node:22-slim AS builder

WORKDIR /app
RUN corepack enable pnpm

COPY js/package.json js/pnpm-workspace.yaml js/pnpm-lock.yaml ./
COPY js/packages/core/package.json ./packages/core/package.json
COPY js/packages/server/package.json ./packages/server/package.json
RUN pnpm install --frozen-lockfile

COPY js/packages/ ./packages/
RUN pnpm -r build

FROM node:22-slim

WORKDIR /app
RUN corepack enable pnpm

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/packages/core/package.json ./packages/core/package.json
COPY --from=builder /app/packages/core/dist/ ./packages/core/dist/
COPY --from=builder /app/packages/server/package.json ./packages/server/package.json
COPY --from=builder /app/packages/server/dist/ ./packages/server/dist/
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/packages/core/node_modules/ ./packages/core/node_modules/
COPY --from=builder /app/packages/server/node_modules/ ./packages/server/node_modules/

EXPOSE 3000
ENV PORT=3000

CMD ["node", "packages/server/dist/index.js"]
