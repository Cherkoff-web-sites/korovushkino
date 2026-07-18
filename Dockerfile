# Backend+Frontend in one container (build from repo root)
FROM node:20-alpine AS frontend-build

WORKDIR /app
COPY prod/package*.json ./

# Install build deps (Next/TS/Tailwind). Do NOT leave NODE_ENV=development —
# that makes `next build` mix runtime.dev.js + runtime.prod.js and crash with
# "Cannot read properties of null (reading 'useContext')" during prerender.
RUN npm ci --include=dev --no-audit --no-fund \
  || (echo "npm ci retry..." && sleep 5 && npm ci --include=dev --no-audit --no-fund)

COPY prod/ ./
ENV NODE_ENV=production
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
