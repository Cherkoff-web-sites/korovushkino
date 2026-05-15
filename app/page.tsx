import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AboutSection from '@/components/home/AboutSection'
import ReviewsSection from '@/components/home/ReviewsSection'

export const metadata: Metadata = {
  title: 'Главная | Коровушкино',
  description: 'Натуральные фермерские продукты и готовые продуктовые корзины.',
}

type HighlightTile = {
  /** Совпадает с `categorySlug` в каталоге (`/catalog?category=`) */
  id: string
  title: string
  /** Классы размещения в lg-сетке 3×4: колонки 1–2 — по 2 высокие карточки, колонка 3 — четыре низкие */
  lgClass: string
  /** Крупные плитки (молоко, сыры, мясо, птица) — на lg квадратные */
  tileSize: 'large' | 'small'
  /** PNG в public/images/home/highlight/ — поверх фона, под заголовком */
  backgroundImage?: string
}

export default function HomePage() {
  const heroBgImage = '/images/home/hero-bg.png'

  const homeBenefits = [
    {
      icon: '/images/home-benefits/icon-leaf.svg',
      text: 'Только натуральные ингредиенты',
    },
    {
      icon: '/images/home-benefits/icon-scroll.svg',
      text: 'Сохраняем традиции в рецептах',
    },
    {
      icon: '/images/home-benefits/icon-thermometer.svg',
      text: 'Контроль температуры при транспортировке',
    },
    {
      icon: '/images/home-benefits/icon-clipboard-check.svg',
      text: 'Каждая партия проходит проверку',
    },
    {
      icon: '/images/home-benefits/icon-truck.svg',
      text: 'Доставим продукты прямо до двери',
    },
  ] as const

  const homeHighlightGrid: HighlightTile[] = [
    {
      id: 'dairy',
      title: 'Молочная продукция',
      lgClass: 'lg:col-start-1 lg:row-start-1 lg:row-span-2',
      tileSize: 'large',
      backgroundImage: '/images/home/highlight/dairy.png',
    },
    {
      id: 'meat',
      title: 'Мясо',
      lgClass: 'lg:col-start-1 lg:row-start-3 lg:row-span-2',
      tileSize: 'large',
      backgroundImage: '/images/home/highlight/meat.png',
    },
    {
      id: 'cheese',
      title: 'Сыры',
      lgClass: 'lg:col-start-2 lg:row-start-1 lg:row-span-2',
      tileSize: 'large',
      backgroundImage: '/images/home/highlight/cheese.png',
    },
    {
      id: 'poultry',
      title: 'Птица',
      lgClass: 'lg:col-start-2 lg:row-start-3 lg:row-span-2',
      tileSize: 'large',
      backgroundImage: '/images/home/highlight/poultry.png',
    },
    {
      id: 'meat-products',
      title: 'Мясная продукция',
      lgClass: 'lg:col-start-3 lg:row-start-1 lg:row-span-1',
      tileSize: 'small',
      backgroundImage: '/images/home/highlight/meat-products.png',
    },
    {
      id: 'honey',
      title: 'Мед',
      lgClass: 'lg:col-start-3 lg:row-start-2 lg:row-span-1',
      tileSize: 'small',
      backgroundImage: '/images/home/highlight/honey.png',
    },
    {
      id: 'fish',
      title: 'Рыба',
      lgClass: 'lg:col-start-3 lg:row-start-3 lg:row-span-1',
      tileSize: 'small',
      backgroundImage: '/images/home/highlight/fish.png',
    },
    {
      id: 'semi-finished',
      title: 'Полуфабрикаты',
      lgClass: 'lg:col-start-3 lg:row-start-4 lg:row-span-1',
      tileSize: 'small',
      backgroundImage: '/images/home/highlight/semi-finished.png',
    },
  ]

  return (
    <div className="min-h-screen">
      <section
        className="relative bg-cover bg-center bg-no-repeat pb-16 pt-8 sm:pb-20 sm:pt-10 lg:flex lg:h-[calc(50vw-85px)] lg:flex-col lg:justify-center lg:py-0"
        style={{ backgroundImage: `url('${heroBgImage}')` }}
      >
        <div className="container relative z-10">
          <div className="max-w-[402px]">
            <h1 className="mb-5 text-[30px] font-normal leading-[1.2] text-[#FFFFFF] lg:mb-[40px] lg:text-[36px]">
              Собери свою корзину
            </h1>
            <div className="flex flex-col gap-4 mb-8 lg:mb-[60px]">
              <p className="text-base font-normal leading-[1.45] text-[#FFFFFF] sm:text-lg lg:text-[20px]">
                Мы подготовили для вас готовые <strong className="font-bold">продуктовые корзины</strong>,
                чтобы вы могли познакомиться с нашим ассортиментом и попробовать самые популярные
                продукты.
              </p>
              <p className="text-base font-normal leading-[1.45] text-[#FFFFFF] sm:text-lg lg:text-[20px]">
                Это простой и выгодный способ <strong className="font-bold">оценить вкус</strong> настоящей
                фермерской продукции и найти свои любимые позиции.
              </p>
            </div>
            <div className="flex">
              <Link
                href="/baskets"
                className="inline-flex items-center justify-center rounded-lg bg-[#3D8C13] px-8 py-3 text-base font-normal text-[#FFFFFF] transition-colors hover:bg-[#367c11] sm:px-10 sm:text-lg lg:text-[20px]"
              >
                Перейти к корзинам
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-0 bg-[#fdfbf6] py-8 sm:py-10">
        <div className="container">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 xl:gap-5">
            {homeBenefits.map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-3 rounded-lg border border-[#C88C39] bg-[#FFF6E7] p-4 sm:gap-4 sm:p-5"
              >
                <div className="flex shrink-0 items-center justify-center">
                  <Image
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    sizes="20px"
                    className="h-auto w-[20px] object-contain"
                  />
                </div>
                <p className="min-w-0 text-sm font-normal leading-snug text-black sm:text-[15px]">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Категории: на lg — 3 колонки, слева и в центре по 2 высокие карточки, справа 4 низкие */}
      <section className="bg-[#fdfbf6] py-8 sm:py-10">
        <div className="container">
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-4 lg:gap-5">
            {homeHighlightGrid.map((item) => (
              <li key={item.id} className={`min-w-0 ${item.lgClass}`}>
                <Link
                  href={`/catalog?category=${item.id}`}
                  scroll={false}
                  className="group block h-full min-h-[200px] rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8C13] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfbf6] lg:min-h-0"
                  aria-label={`${item.title} — перейти в каталог`}
                >
                  <article
                    className={`relative flex h-full min-h-[200px] overflow-hidden rounded-xl border border-[#C88C39] bg-[#FFF6E7] transition-shadow group-hover:shadow-md lg:min-h-0 ${
                      item.tileSize === 'large' ? 'aspect-square' : ''
                    }`}
                  >
                    {item.backgroundImage ? (
                      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
                        <Image
                          src={item.backgroundImage}
                          alt=""
                          fill
                          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      </div>
                    ) : null}
                    <h3 className="relative z-10 w-full self-start p-[40px] text-left text-[20px] font-bold leading-snug text-black">
                      {item.title}
                    </h3>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ReviewsSection />

      <AboutSection />
    </div>
  )
}
