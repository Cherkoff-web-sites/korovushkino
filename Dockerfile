# Backend+Frontend in one container (build from repo root)
FROM node:20-alpine AS frontend-build

WORKDIR /app
COPY prod/package*.json ./

# DevDependencies (Next, TypeScript, Tailwind) are required for `next build`.
ENV NODE_ENV=development
RUN npm ci --no-audit --no-fund \
  || (echo "npm ci retry..." && sleep 5 && npm ci --no-audit --no-fund)

COPY prod/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
  || (echo "npm ci retry..." && sleep 5 && npm ci --omit=dev --no-audit --no-fund)
COPY backend/ ./

# Serve Next.js static export from backend/public
COPY --from=frontend-build /app/out /app/public

EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:4000/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "src/server.js"]
