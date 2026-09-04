FROM ghcr.io/pnpm/pnpm:11 AS base
RUN pnpm runtime set node 24 -g

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml  ./
COPY backend/package*.json ./backend/
RUN pnpm install -F track-thing-api --frozen-lockfile

COPY backend/ ./backend/

RUN pnpm run -F track-thing-api build \
  && pnpm deploy -F track-thing-api --prod prod

FROM node:alpine
WORKDIR /opt/app
COPY --from=builder /app/prod/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
CMD [ "node", "dist/main.js" ]
