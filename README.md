# CAREL Professional Service — сайт на Next.js

## 🎯 Архитектура проекта

Гибридный подход Next.js 14 с App Router, комбинирующий SSG и CSR для оптимального баланса SEO и интерактивности.

### SSG (Static Site Generation) - для контентных страниц:
- ✅ `/` - Главная страница
- ✅ `/about` - О компании
- ✅ `/contact` - Контакты
- ✅ `/catalog/[productId]` - Страницы товаров (SSG для SEO)

**Преимущества:** Максимальное SEO, быстрая загрузка, готовый HTML

### CSR (Client-Side Rendering) - для интерактивных страниц:
- ✅ `/catalog` - Каталог товаров (React-приложение)
- ✅ `/admin` - Административная панель

**Преимущества:** Интерактивность, фильтры, динамические обновления

## 🚀 Быстрый старт

### 1. Установка зависимостей:

```bash
npm install
```

### 2. Запуск в режиме разработки:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### 3. Сборка для продакшена:

```bash
npm run build
npm start
```

## 📁 Структура проекта

```
├── app/                          # App Router (Next.js 14)
│   ├── layout.tsx               # Корневой layout с Header/Footer
│   ├── page.tsx                 # Главная (SSG)
│   ├── about/
│   │   └── page.tsx             # О компании (SSG)
│   ├── contact/
│   │   └── page.tsx             # Контакты (SSG)
│   ├── catalog/                 # КАТАЛОГ (React-приложение)
│   │   ├── page.tsx             # Список товаров (CSR)
│   │   ├── [productId]/
│   │   │   └── page.tsx         # Страница товара (SSG)
│   │   └── components/          # Компоненты каталога
│   │       ├── ProductList.tsx
│   │       ├── ProductCard.tsx
│   │       └── Filters.tsx
│   ├── api/                     # API роуты
│   │   └── products/
│   │       ├── route.ts        # GET /api/products
│   │       └── [productId]/
│   │           └── route.ts     # GET /api/products/[id]
│   └── globals.css              # Глобальные стили + Tailwind
├── components/                  # ОБЩИЕ КОМПОНЕНТЫ
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   ├── Footer/
│   │   └── Footer.tsx
│   ├── ui/                     # UI компоненты
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── Layout/
│       └── Container.tsx
├── lib/                        # УТИЛИТЫ
│   ├── api/
│   │   └── mockData.ts         # Моковые данные
│   ├── utils.ts                # Общие утилиты
│   └── constants.ts            # Константы
├── types/                      # ТИПЫ TypeScript
│   ├── product.ts
│   └── global.d.ts
├── public/                     # СТАТИЧЕСКИЕ ФАЙЛЫ
├── tailwind.config.ts          # Конфиг Tailwind
├── postcss.config.js           # Конфиг PostCSS
├── next.config.js              # Конфиг Next.js
└── tsconfig.json               # Конфиг TypeScript
```

## 🛠 Технологии

- **Next.js 14** - React фреймворк с App Router
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **PostCSS** - Обработка CSS

## 📖 Документация

Подробная инструкция по установке и настройке: [SETUP.md](./SETUP.md)

## ✅ Особенности

- ✅ Гибридный рендеринг (SSG + CSR)
- ✅ SEO-оптимизация для статичных страниц
- ✅ Интерактивный каталог с фильтрами
- ✅ TypeScript для типобезопасности
- ✅ Tailwind CSS для стилизации
- ✅ API Routes для работы с данными
- ✅ Готово к подключению CMS (Strapi и др.)

## 🎨 Проверка работы

После установки зависимостей:

1. **SSG страницы** - откройте исходный код (View Page Source), должен быть готовый HTML
2. **CSR каталог** - проверьте работу фильтров и поиска
3. **API Routes** - откройте `/api/products` в браузере

Подробнее в [SETUP.md](./SETUP.md)

