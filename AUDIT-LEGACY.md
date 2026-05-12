# Аудит: что осталось от прошлого сайта

Прошёл по всем 50 файлам исходников и активов и собрал то, что осталось от прошлого сайта **CAREL Professional Service** (промышленная ниша: частотные преобразователи, плавный пуск, электродвигатели, увлажнители).

## A. Файлы, которые целиком из старого проекта (можно удалять)

### A1. Чужой / неиспользуемый функционал

| #  | Путь                                                   | Что внутри / почему лишнее |
|----|--------------------------------------------------------|----------------------------|
| 1  | `lib/api/mockData.ts`                                  | `mockProducts` с инженерной номенклатурой: «Инженерное решение A», «Система вентиляции B», «Кондиционирование C», «Отопительная система D», «Электротехническое решение E», «Водоснабжение F». Используется только в старых API. |
| 2  | `app/api/products/route.ts`                            | `GET /api/products` поверх `mockProducts` + `ProductFilters` (search, category, minPrice, maxPrice). К новой витрине молочки не подключено. |
| 3  | `app/api/products/[productId]/route.ts`                | `GET /api/products/[productId]` поверх `mockProducts`. Не используется на сайте. |
| 4  | `app/services/page.tsx`                                | Старая страница «УСЛУГИ» (Шефмонтаж, Пусконаладка, Обучение персонала). На сайте «Коровушкино» услуг нет, в шапке нет такого пункта. |
| 5  | `app/about/page.tsx`                                   | Старая страница «О КОМПАНИИ»: тянет CAREL-абзацы из `getContent()`, кнопка «Скачать презентацию», изображение `/images/about.webp`. К новой главной с `AboutSection` (фермой) отношения не имеет. |
| 6  | `app/admin/page.tsx` + `app/api/admin/content/route.ts` + `app/api/admin/products/route.ts` | Админ-панель CAREL: правит «О компании», «Контакты» (адрес/режим/email), CRUD товаров через `data/products.json`. Завязана на `getContent` и `productsData` от старого сайта. |
| 7  | `lib/api/contentApi.ts`                                | `getContent()` с дефолтами: «CAREL Professional Service», «сервис увлажнителей», адрес «БЦ Кутузов Холл», `servicecarel@yandex.ru`, услуги «Шефмонтаж/Пусконаладка/Обучение». |
| 8  | `components/AddToCartButtonSimple.tsx`                 | Альтернативная кнопка «Купить» из старого каталога. Не импортируется нигде. |
| 9  | `components/Layout/Container.tsx`                      | Дубликат `.container` из Tailwind (плагин в `tailwind.config.ts`). Никем не импортируется. |
| 10 | `components/ui/Card.tsx`                               | Использовался только в удалённых старых `ProductCard`/`Filters`. Сейчас никем. |
| 11 | `components/ui/Input.tsx`                              | Сине-серый `Input` (focus `ring-blue-500`) старого админ-стиля. Используется только в удалённом `Filters`. |
| 12 | `app/cart/page.tsx`                                    | Тёмная страница корзины старого сайта: фон `#2A2529` / `#3B363C`, рамки `#3D8C13`, не сочетается с новым светлым стилем. (Логику можно сохранить, но вёрстку нужно переписать.) |
| 13 | `app/catalog/[productId]/AddToCartButton.tsx`          | Старый компонент с логикой `Получить прайс-лист` для `price === 0` и стилями `border-white text-white hover:bg-white/10` под тёмный фон. Сейчас используется на новой светлой карточке товара — стили не родные. |
| 14 | `lib/constants.ts`                                     | `SITE_NAME = 'CAREL Professional Service'`, `SITE_DESCRIPTION = 'Профессиональный сервис увлажнителей CAREL'`, отдельный `NAVIGATION_ITEMS` (несинхронный с шапкой). Никем не импортируется. |
| 15 | `lib/utils.ts`                                         | `formatPrice` (валюта RUB), `slugify`. Никем не используется (старый каталог удалён). |
| 16 | `types/product.ts`                                     | `Product { id: number, specifications, ... }` и `ProductFilters` — формат старых `mockProducts`. Используется только в `mockData.ts` и старых API. |
| 17 | `types/global.d.ts`                                    | Пустой файл `export {}`. Можно удалить. |

### A2. Картинки и логотипы (CAREL)

| #  | Путь                                                   | Что |
|----|--------------------------------------------------------|-----|
| 18 | `public/images/header/logo-carel-works.svg`            | Логотип CAREL. |
| 19 | `public/images/logo.svg`                               | Похоже на старый логотип. |
| 20 | `public/images/header/icon-drop.svg`                   | Иконка «капля» — для увлажнителей. |
| 21 | `public/images/header/icon-thermometer.svg`            | Иконка «термометр» в шапке (другая из `home-benefits/` остаётся). |
| 22 | `public/images/header/icon-phone.svg`                  | Не используется. |
| 23 | `public/images/features/icon-warranty.svg`             | Иконки старого блока «Преимущества» (гарантия). |
| 24 | `public/images/features/icon-assortment.svg`           | Тоже. |
| 25 | `public/images/features/icon-optimal-prices.svg`       | Тоже. |
| 26 | `public/images/README.md`                              | Инструкция: «converter.png — частотные преобразователи», «soft-starter.png», «motor.png», `callback_bg.png`. |

> Из `public/images/header/` нужны только: `icon-cart.svg`, `icon-favorites.svg`, `icon-account.svg`. Остальные — старые.

---

## B. Старые куски внутри файлов, которые мы хотим оставить

### B1. `package.json`
- `"name": "carel-professional-service"` — название пакета. Минорно, но «след».

### B2. `README.md` (корень проекта)
- Упоминание `carel-professional-service` (строка 5).
- Перечисление в дереве уже удалённых файлов: `siteFlags.ts`, `ProductList`, `ProductCard`, `Filters`, `ProductImages.tsx`, `AddToCartButtonSimple.tsx`, `services/page.tsx`, `lib/utils.ts`, `lib/constants.ts`.
- Описание API `/api/admin/...`, `/api/products/...` (всё из старого сайта).
- Раздел «Маршруты» включает `/services` (которого по новой концепции быть не должно).

### B3. `lib/api/productsData.ts`
- Сама структура **`ProductData`** содержит поля чисто из CAREL: `series`, `descriptionContent { advantages, mainFunctions, characteristics, structuralFeatures, motorProtection, additionalOptions, generalDescription }`, `parametersTable`. У тебя сейчас `series` переиспользуется как «фасовка» (`2л`, `0,5л`) — это нормально, но **`descriptionContent` и `parametersTable` для молочки не нужны** и тянут поля старой схемы.
- Импортируется в `app/admin/page.tsx`, `lib/api/productsApi.ts`, `app/api/admin/products/route.ts` — все эти потребители тоже из старого сайта.

### B4. `app/catalog/[productId]/page.tsx`
- Хлебные крошки используют поле **`product.breadcrumbs`** (CAREL-стиль с подкатегориями/сериями). На «молочке» крошки могут быть простыми «Каталог / Молочная продукция / Название».
- Импорт `ScrollToTop` — компонент из старого сайта (см. ниже).

### B5. `components/ScrollToTop.tsx`
- Сам компонент норм, но используется только на одной странице. Не «след старого сайта», но код-«огрызок» — на твой выбор.

### B6. `app/page.tsx`
- В блоке hero мелкий **синтаксический мусор** — незакрытая квадратная скобка в классе: `lg:mb-[60px"` (строка 119). Tailwind её игнорирует, но это явный артефакт.

### B7. `app/catalog/[productId]/ProductTabs.tsx`
- Логика табов в порядке (новая), но **типизация** опирается на `descriptionContent` и `parametersTable` из CAREL-схемы `ProductData` (см. B3). Если упростить `ProductData`, эти ветки кода становятся не нужны.

### B8. `app/admin/page.tsx`
- Внутри есть жёсткие тексты «О компании», «Контакты», «Сохранить контент» — все они для CAREL-страниц. Если оставлять админку, её надо перерисовывать под молочку (или просто удалить, см. A1).

### B9. `app/cart/page.tsx`
- См. A1: тёмные фоны `#2A2529` / `#3B363C`, обводки `border-2 border-[#3D8C13]`, единицы «руб.». Стилистически из старого сайта.

### B10. `tsconfig.json` / `next.config.js`
- Чистые, упоминаний CAREL нет. Но `output: 'standalone'` остался от старого деплоя — для статического сайта без сервера он не нужен (хотя и не вреден).

---

## C. Атрибуты / значения, которые «эхом» от прошлого сайта

- Цвета `#2A2529`, `#3B363C` (тёмные фоны старого CAREL-сайта) встречаются в:
  - `app/admin/page.tsx`,
  - `app/cart/page.tsx`,
  - старых местах, которые мы уже переделали — но в `cart` и `admin` остались.
- `bg-amber-500/20`, `text-amber-200` (в `app/admin/page.tsx`) — из старой палитры.
- `eslint-config-next` подключён, но конфига `.eslintrc*` в проекте нет (минор).

---

## D. Уже корректные («наши») файлы — для контраста, чтобы понимать, что не трогать

`app/layout.tsx`, `app/page.tsx` (кроме B6), `app/baskets/*`, `app/delivery-payment/page.tsx`, `app/contact/page.tsx`, `app/catalog/page.tsx`, `app/catalog/components/CatalogGridCard.tsx`, `components/Header/*`, `components/Footer/Footer.tsx`, `components/home/AboutSection.tsx`, `components/home/ReviewsSection.tsx`, `components/ui/Button.tsx`, `contexts/CartContext.tsx`, `app/globals.css`, `tailwind.config.ts`, `postcss.config.js`.

---

## Краткая сводка «что предлагаю удалить, что переписать»

**Удалить целиком (17 файлов кода/манифестов + 9 ассетов):** см. таблицы A1 и A2.

**Переписать / почистить:**

1. `lib/api/productsData.ts` — урезать `ProductData` под молочку (убрать `descriptionContent`, `parametersTable`, упростить `breadcrumbs`).
2. `app/catalog/[productId]/page.tsx` + `ProductTabs.tsx` — выкинуть ветки CAREL после упрощения схемы.
3. `app/cart/page.tsx` — переверстать в светлой палитре (или собрать заново под Коровушкино).
4. `app/catalog/[productId]/AddToCartButton.tsx` — упростить (убрать «Получить прайс-лист», стили под тёмный фон).
5. `package.json` → `"name"`, `README.md`, `public/images/README.md` — переименовать/обновить под Коровушкино, выкинуть упоминания CAREL и удалённых файлов.
6. `app/page.tsx` — починить опечатку `lg:mb-[60px"` → `lg:mb-[60px]`.
7. `next.config.js` — при желании убрать `output: 'standalone'`, если деплой статикой.
