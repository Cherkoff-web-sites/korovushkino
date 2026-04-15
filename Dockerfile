# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./

# Устанавливаем зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Сборка приложения (создаёт .next/standalone)
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Timeweb Cloud по умолчанию использует порт 8080
ENV PORT=8080
# Обязательно: иначе приложение слушает только localhost и прокси не достучится (502)
ENV HOSTNAME=0.0.0.0
EXPOSE 8080

# Создаём непривилегированного пользователя
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем standalone сборку
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Директория для данных админки (content.json, products.json)
RUN mkdir -p ./data && chown -R nextjs:nodejs ./data

USER nextjs

CMD ["node", "server.js"]
