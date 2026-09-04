FROM ghcr.io/pnpm/pnpm:11 AS base
RUN pnpm runtime set node 24 -g

FROM base AS frontend-builder
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml  ./
COPY frontend/package*.json ./frontend/
RUN pnpm install -F track-thing --frozen-lockfile

COPY frontend/ ./frontend/

WORKDIR /app/frontend

RUN pnpm run -F track-thing build --configuration production

FROM nginx:alpine
COPY --from=frontend-builder /app/frontend/dist/track-thing/browser /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
