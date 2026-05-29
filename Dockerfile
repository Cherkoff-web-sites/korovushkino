# Backend+Frontend in one container (build from repo root)
FROM node:20-alpine AS frontend-build

WORKDIR /app
COPY prod/package*.json ./
RUN npm ci
COPY prod/ ./
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache curl
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./

# Serve Next.js static export from backend/public
COPY --from=frontend-build /app/out /app/public

EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
  CMD curl -fsS http://127.0.0.1:4000/api/health || exit 1
CMD ["node", "src/server.js"]
