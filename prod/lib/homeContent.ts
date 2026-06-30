import {
  HOME_REVIEW_BODY,
  HOME_REVIEW_VARIANTS,
  REPLY_AUTHOR_LABEL,
  replyTextForAuthor,
} from '@/lib/reviewsData'

export type HomeReviewItem = {
  id: string
  authorName: string
  date: string
  replyDate: string
  productLabel: string
  rating: number
  text: string
  replyText: string
}

export type HomeBenefitItem = {
  icon: string
  text: string
}

export type HomeHighlightItem = {
  id: string
  title: string
  backgroundImage: string
}

export type HomeAboutBlock = {
  title: string
  text: string
}

export type HomeContent = {
  hero: {
    backgroundImage: string
    title: string
    paragraph1: string
    paragraph2: string
    buttonText: string
    buttonHref: string
  }
  benefits: HomeBenefitItem[]
  highlights: HomeHighlightItem[]
  about: {
    sectionTitle: string
    row1RightImage: string
    row2LeftImage: string
    blocks: HomeAboutBlock[]
  }
  reviews: {
    sectionTitle: string
    leaveReviewButton: string
    allReviewsButton: string
    replyAuthorLabel: string
    items: HomeReviewItem[]
  }
}

function buildDefaultReviewItems(): HomeReviewItem[] {
  return HOME_REVIEW_VARIANTS.map((variant) => ({
    id: variant.id,
    authorName: variant.authorName,
    date: variant.date,
    replyDate: variant.replyDate,
    productLabel: 'Козье молоко',
    rating: 5,
    text: HOME_REVIEW_BODY,
    replyText: replyTextForAuthor(variant.authorName),
  }))
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    backgroundImage: '/images/home/hero-bg.png',
    title: 'Собери свою корзину',
    paragraph1:
      'Мы подготовили для вас готовые продуктовые корзины, чтобы вы могли познакомиться с нашим ассортиментом и попробовать самые популярные продукты.',
    paragraph2:
      'Это простой и выгодный способ оценить вкус настоящей фермерской продукции и найти свои любимые позиции.',
    buttonText: 'Перейти к корзинам',
    buttonHref: '/baskets',
  },
  benefits: [
    { icon: '/images/home-benefits/icon-leaf.svg', text: 'Только натуральные ингредиенты' },
    { icon: '/images/home-benefits/icon-scroll.svg', text: 'Сохраняем традиции в рецептах' },
    { icon: '/images/home-benefits/icon-thermometer.svg', text: 'Контроль температуры при транспортировке' },
    { icon: '/images/home-benefits/icon-clipboard-check.svg', text: 'Каждая партия проходит проверку' },
    { icon: '/images/home-benefits/icon-truck.svg', text: 'Доставим продукты прямо до двери' },
  ],
  highlights: [
    { id: 'dairy', title: 'Молочная продукция', backgroundImage: '/images/home/highlight/dairy.png' },
    { id: 'meat', title: 'Мясо', backgroundImage: '/images/home/highlight/meat.png' },
    { id: 'cheese', title: 'Сыры', backgroundImage: '/images/home/highlight/cheese.png' },
    { id: 'poultry', title: 'Птица', backgroundImage: '/images/home/highlight/poultry.png' },
    { id: 'meat-products', title: 'Мясная продукция', backgroundImage: '/images/home/highlight/meat-products.png' },
    { id: 'honey', title: 'Мед', backgroundImage: '/images/home/highlight/honey.png' },
    { id: 'fish', title: 'Рыба', backgroundImage: '/images/home/highlight/fish.png' },
    { id: 'semi-finished', title: 'Полуфабрикаты', backgroundImage: '/images/home/highlight/semi-finished.png' },
  ],
  about: {
    sectionTitle: 'О нас',
    row1RightImage: '/images/home/about/row1-farm-landscape.png',
    row2LeftImage: '/images/home/about/row2-cows-pasture.png',
    blocks: [
      {
        title: 'Наша ферма',
        text: '«Коровушкино» — семейная ферма в Тульской области. Мы выращиваем животных и ведём хозяйство бережно к земле, чтобы вы получали продукты с понятным происхождением и заботой о качестве на каждом этапе.',
      },
      {
        title: 'Натуральные продукты',
        text: 'Делаем натуральные молочные и мясные продукты из сырья с нашей фермы — короткая цепочка от поля и фермы до вашего стола, без лишних промежутков.',
      },
      {
        title: 'Вкус из детства',
        text: 'Опираемся на простые рецепты и натуральные ингредиенты — так сохраняется тот самый вкус, к которому хочется возвращаться, как к воспоминанию из детства.',
      },
      {
        title: 'Натуральные корма',
        text: 'Животные получают натуральные корма; мы не используем гормоны роста и не добавляем антибиотики в рацион «на всякий случай» — только ответственное содержание.',
      },
    ],
  },
  reviews: {
    sectionTitle: 'Отзывы',
    leaveReviewButton: 'Оставить отзыв',
    allReviewsButton: 'Все отзывы',
    replyAuthorLabel: REPLY_AUTHOR_LABEL,
    items: buildDefaultReviewItems(),
  },
}

export const HIGHLIGHT_LAYOUT: Record<
  string,
  { lgClass: string; tileSize: 'large' | 'small' }
> = {
  dairy: { lgClass: 'lg:col-start-1 lg:row-start-1 lg:row-span-2', tileSize: 'large' },
  meat: { lgClass: 'lg:col-start-1 lg:row-start-3 lg:row-span-2', tileSize: 'large' },
  cheese: { lgClass: 'lg:col-start-2 lg:row-start-1 lg:row-span-2', tileSize: 'large' },
  poultry: { lgClass: 'lg:col-start-2 lg:row-start-3 lg:row-span-2', tileSize: 'large' },
  'meat-products': { lgClass: 'lg:col-start-3 lg:row-start-1 lg:row-span-1', tileSize: 'small' },
  honey: { lgClass: 'lg:col-start-3 lg:row-start-2 lg:row-span-1', tileSize: 'small' },
  fish: { lgClass: 'lg:col-start-3 lg:row-start-3 lg:row-span-1', tileSize: 'small' },
  'semi-finished': { lgClass: 'lg:col-start-3 lg:row-start-4 lg:row-span-1', tileSize: 'small' },
}

const STORAGE_KEY = 'korovushkino_home_content'

function mergeHomeContent(parsed: Partial<HomeContent>): HomeContent {
  return {
    ...DEFAULT_HOME_CONTENT,
    ...parsed,
    hero: { ...DEFAULT_HOME_CONTENT.hero, ...parsed.hero },
    about: {
      ...DEFAULT_HOME_CONTENT.about,
      ...parsed.about,
      blocks: parsed.about?.blocks ?? DEFAULT_HOME_CONTENT.about.blocks,
    },
    benefits: parsed.benefits ?? DEFAULT_HOME_CONTENT.benefits,
    highlights: parsed.highlights ?? DEFAULT_HOME_CONTENT.highlights,
    reviews: {
      ...DEFAULT_HOME_CONTENT.reviews,
      ...parsed.reviews,
      items: parsed.reviews?.items?.length
        ? parsed.reviews.items
        : DEFAULT_HOME_CONTENT.reviews.items,
    },
  }
}

export function readHomeContent(): HomeContent {
  if (typeof window === 'undefined') return DEFAULT_HOME_CONTENT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_HOME_CONTENT
    return mergeHomeContent(JSON.parse(raw) as Partial<HomeContent>)
  } catch {
    return DEFAULT_HOME_CONTENT
  }
}

export function writeHomeContent(content: HomeContent) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new Event('home-content-updated'))
}
