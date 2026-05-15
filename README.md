# Коровушкино — сайт на Next.js

Фермерские продукты и корзины. Стек: **Next.js 14** (App Router), **React 18**, **TypeScript**, **Tailwind CSS**.

Имя пакета в `package.json`: **`korovushkino`**.

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Сборка:

```bash
npm run build
npm start
```

Линт:

```bash
npm run lint
```

## Маршруты (`app/`)

| Путь | Файл | Примечание |
|------|------|------------|
| `/` | `app/page.tsx` | Главная: hero, преимущества, сетка категорий, отзывы, блок «О нас» |
| `/about` | `app/about/page.tsx` | О компании |
| `/contact` | `app/contact/page.tsx` | Контакты |
| `/catalog` | `app/catalog/page.tsx` | **`'use client'`** — клиентская страница каталога |
| `/catalog/[productId]` | `app/catalog/[productId]/page.tsx` | Карточка товара + табы, изображения, кнопка в корзину |
| `/cart` | `app/cart/page.tsx` | Корзина |
| `/delivery-payment` | `app/delivery-payment/page.tsx` | Доставка и оплата |
| `/baskets` | `app/baskets/page.tsx` | Готовые корзины |

Публичных **API Routes** в проекте нет: каталог и карточка товара используют `lib/api/productsData.ts` и при необходимости `data/products.json` через `lib/api/productsApi.ts` (только чтение на сервере).

## Структура проекта

```
prod/
├── app/
│   ├── layout.tsx              # Inter, Header, Footer, CartProvider, main
│   ├── page.tsx                # Главная
│   ├── globals.css             # Tailwind + глобальные стили
│   ├── delivery-payment/page.tsx
│   ├── baskets/
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── cart/page.tsx
│   ├── catalog/
│   │   ├── page.tsx
│   │   ├── components/         # CatalogGridCard
│   │   └── [productId]/
│   │       ├── page.tsx
│   │       ├── ProductTabs.tsx
│   │       └── AddToCartButton.tsx
├── components/
│   ├── Header/                 # Header, Navigation, MobileMenu
│   ├── home/                   # AboutSection, ReviewsSection
│   ├── Footer/
│   ├── ui/                     # Button
│   └── ScrollToTop.tsx
├── contexts/
│   └── CartContext.tsx         # Корзина + localStorage
├── lib/
│   └── api/                    # productsApi, productsData (без REST-админки)
├── public/
│   └── images/                 # home, home-benefits, header — см. public/images/README.md
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── tsconfig.json
```

## Технологии

- Next.js **14** (App Router)  
- React **18**  
- TypeScript **5**  
- Tailwind CSS **3.4**  
- PostCSS, ESLint (`eslint-config-next`)

## Особенности

- **Главная**: статичная разметка + клиентские секции (`ReviewsSection` с `'use client'`).
- **Каталог** (`/catalog`): клиентский рендеринг, поиск/фильтры в коде страницы.
- **Корзина**: `CartProvider` в `layout`, синхронизация с `localStorage`.
- **Шрифт**: Google **Inter** (латиница + кириллица).
- Акцентный цвет бренда зелёный **`#3D8C13`** (красные акценты убраны в пользу зелёной палитры).

## Изображения

Частые пути (см. код страниц):

- `public/images/home/` — hero, highlight-категории, about  
- `public/images/home-benefits/` — иконки преимуществ  
- `public/images/header/` — иконки шапки  

Подробности по ассетам — `public/images/README.md`, если файл есть.
