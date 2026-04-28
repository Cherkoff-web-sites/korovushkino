# Коровушкино — сайт на Next.js

Фермерские продукты и корзины. Стек: **Next.js 14** (App Router), **React 18**, **TypeScript**, **Tailwind CSS**.

Пакет в `package.json` по-прежнему может называться `carel-professional-service` — это историческое имя; продукт и метаданные сайта — **Коровушкино**.

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
| `/services` | `app/services/page.tsx` | Услуги |
| `/catalog` | `app/catalog/page.tsx` | **`'use client'`** — клиентская страница каталога |
| `/catalog/[productId]` | `app/catalog/[productId]/page.tsx` | Карточка товара + табы, изображения, кнопка в корзину |
| `/cart` | `app/cart/page.tsx` | Корзина |
| `/admin` | `app/admin/page.tsx` | Админ-панель (контент/товары) |

В шапке есть пункт «Доставка и оплата» (`/delivery-payment`) — отдельной страницы в `app/` сейчас нет; при необходимости добавьте `app/delivery-payment/page.tsx`.

## API Routes

- `GET` `app/api/products/route.ts` — список товаров  
- `GET` `app/api/products/[productId]/route.ts` — товар по id  
- `app/api/admin/products/route.ts` — админ: товары  
- `app/api/admin/content/route.ts` — админ: контент  

## Структура проекта

```
prod/
├── app/
│   ├── layout.tsx              # Inter, Header, CartProvider, main (без Footer)
│   ├── page.tsx                # Главная
│   ├── globals.css             # Tailwind + глобальные стили
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── services/page.tsx
│   ├── cart/page.tsx
│   ├── admin/page.tsx
│   ├── catalog/
│   │   ├── page.tsx
│   │   ├── components/         # ProductList, ProductCard, Filters
│   │   └── [productId]/
│   │       ├── page.tsx
│   │       ├── ProductTabs.tsx
│   │       ├── ProductImages.tsx
│   │       └── AddToCartButton.tsx
│   └── api/
│       ├── products/
│       └── admin/
├── components/
│   ├── Header/                 # Header, Navigation, MobileMenu
│   ├── home/                   # AboutSection, ReviewsSection
│   ├── ui/                     # Button, Input, Card
│   ├── Layout/Container.tsx
│   ├── ScrollToTop.tsx
│   └── AddToCartButtonSimple.tsx
├── contexts/
│   └── CartContext.tsx         # Корзина + localStorage
├── lib/
│   ├── siteFlags.ts
│   ├── constants.ts, utils.ts
│   └── api/                    # mockData, productsApi, contentApi, productsData
├── types/
│   ├── product.ts
│   └── global.d.ts
├── public/
│   └── images/                 # logo, header, home-benefits, features, home/* и т.д.
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
