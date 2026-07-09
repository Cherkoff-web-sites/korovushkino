import {
  HOME_REVIEW_BODY,
  HOME_REVIEW_VARIANTS,
  REPLY_AUTHOR_LABEL,
  replyTextForAuthor,
} from '@/lib/reviewsData'
import type { HeadingTag } from '@/lib/contentBlocks'
import { resolveHeadingTag } from '@/lib/contentBlocks'

export type HomeReviewItem = {
  id: string
  authorName: string
  date: string
  replyDate: string
  productLabel: string
  rating: number
  text: string
  textTag?: HeadingTag
  replyText: string
  replyTextTag?: HeadingTag
}

export type HomeBenefitItem = {
  icon: string
  iconAlt: string
  text: string
  textTag?: HeadingTag
}

export type HomeHighlightItem = {
  id: string
  title: string
  titleTag?: HeadingTag
  backgroundImage: string
  backgroundImageAlt: string
}

export type HomeAboutBlock = {
  title: string
  titleTag?: HeadingTag
  text: string
  textTag?: HeadingTag
}

export type HomeContent = {
  hero: {
    backgroundImage: string
    backgroundImageAlt: string
    title: string
    titleTag?: HeadingTag
    paragraph1: string
    paragraph1Tag?: HeadingTag
    paragraph2: string
    paragraph2Tag?: HeadingTag
    buttonText: string
    buttonHref: string
  }
  benefits: HomeBenefitItem[]
  highlights: HomeHighlightItem[]
  about: {
    sectionTitle: string
    sectionTitleTag?: HeadingTag
    row1RightImage: string
    row1RightImageAlt: string
    row2LeftImage: string
    row2LeftImageAlt: string
    blocks: HomeAboutBlock[]
  }
  reviews: {
    sectionTitle: string
    sectionTitleTag?: HeadingTag
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
    textTag: 'p',
    replyText: replyTextForAuthor(variant.authorName),
    replyTextTag: 'p',
  }))
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    backgroundImage: '/images/home/hero-bg.png',
    backgroundImageAlt: 'Фермерские продукты Коровушкино',
    title: 'Собери свою корзину',
    titleTag: 'h1',
    paragraph1:
      'Мы подготовили для вас готовые продуктовые корзины, чтобы вы могли познакомиться с нашим ассортиментом и попробовать самые популярные продукты.',
    paragraph1Tag: 'p',
    paragraph2:
      'Это простой и выгодный способ оценить вкус настоящей фермерской продукции и найти свои любимые позиции.',
    paragraph2Tag: 'p',
    buttonText: 'Перейти к корзинам',
    buttonHref: '/baskets',
  },
  benefits: [
    {
      icon: '/images/home-benefits/icon-leaf.svg',
      iconAlt: 'Натуральные ингредиенты',
      text: 'Только натуральные ингредиенты',
      textTag: 'p',
    },
    {
      icon: '/images/home-benefits/icon-scroll.svg',
      iconAlt: 'Традиционные рецепты',
      text: 'Сохраняем традиции в рецептах',
      textTag: 'p',
    },
    {
      icon: '/images/home-benefits/icon-thermometer.svg',
      iconAlt: 'Контроль температуры',
      text: 'Контроль температуры при транспортировке',
      textTag: 'p',
    },
    {
      icon: '/images/home-benefits/icon-clipboard-check.svg',
      iconAlt: 'Проверка качества',
      text: 'Каждая партия проходит проверку',
      textTag: 'p',
    },
    {
      icon: '/images/home-benefits/icon-truck.svg',
      iconAlt: 'Доставка до двери',
      text: 'Доставим продукты прямо до двери',
      textTag: 'p',
    },
  ],
  highlights: [
    {
      id: 'dairy',
      title: 'Молочная продукция',
      titleTag: 'h3',
      backgroundImage: '/images/home/highlight/dairy.png',
      backgroundImageAlt: 'Молочная продукция',
    },
    {
      id: 'meat',
      title: 'Мясо',
      titleTag: 'h3',
      backgroundImage: '/images/home/highlight/meat.png',
      backgroundImageAlt: 'Мясо',
    },
    {
      id: 'cheese',
      title: 'Сыры',
      titleTag: 'h3',
      backgroundImage: '/images/home/highlight/cheese.png',
      backgroundImageAlt: 'Сыры',
    },
    {
      id: 'poultry',
      title: 'Птица',
      titleTag: 'h3',
      backgroundImage: '/images/home/highlight/poultry.png',
      backgroundImageAlt: 'Птица',
    },
    {
      id: 'meat-products',
      title: 'Мясная продукция',
      titleTag: 'h3',
      backgroundImage: '/images/home/highlight/meat-products.png',
      backgroundImageAlt: 'Мясная продукция',
    },
    {
      id: 'honey',
      title: 'Мед',
      titleTag: 'h3',
      backgroundImage: '/images/home/highlight/honey.png',
      backgroundImageAlt: 'Мед',
    },
    {
      id: 'fish',
      title: 'Рыба',
      titleTag: 'h3',
      backgroundImage: '/images/home/highlight/fish.png',
      backgroundImageAlt: 'Рыба',
    },
    {
      id: 'semi-finished',
      title: 'Полуфабрикаты',
      titleTag: 'h3',
      backgroundImage: '/images/home/highlight/semi-finished.png',
      backgroundImageAlt: 'Полуфабрикаты',
    },
  ],
  about: {
    sectionTitle: 'О нас',
    sectionTitleTag: 'h2',
    row1RightImage: '/images/home/about/row1-farm-landscape.png',
    row1RightImageAlt: 'Пейзаж фермы Коровушкино',
    row2LeftImage: '/images/home/about/row2-cows-pasture.png',
    row2LeftImageAlt: 'Коровы на пастбище',
    blocks: [
      {
        title: 'Наша ферма',
        titleTag: 'h3',
        text: '«Коровушкино» — семейная ферма в Тульской области. Мы выращиваем животных и ведём хозяйство бережно к земле, чтобы вы получали продукты с понятным происхождением и заботой о качестве на каждом этапе.',
        textTag: 'p',
      },
      {
        title: 'Натуральные продукты',
        titleTag: 'h3',
        text: 'Делаем натуральные молочные и мясные продукты из сырья с нашей фермы — короткая цепочка от поля и фермы до вашего стола, без лишних промежутков.',
        textTag: 'p',
      },
      {
        title: 'Вкус из детства',
        titleTag: 'h3',
        text: 'Опираемся на простые рецепты и натуральные ингредиенты — так сохраняется тот самый вкус, к которому хочется возвращаться, как к воспоминанию из детства.',
        textTag: 'p',
      },
      {
        title: 'Натуральные корма',
        titleTag: 'h3',
        text: 'Животные получают натуральные корма; мы не используем гормоны роста и не добавляем антибиотики в рацион «на всякий случай» — только ответственное содержание.',
        textTag: 'p',
      },
    ],
  },
  reviews: {
    sectionTitle: 'Отзывы',
    sectionTitleTag: 'h2',
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

export function mergeHomeContent(parsed: Partial<HomeContent>): HomeContent {
  const hero = { ...DEFAULT_HOME_CONTENT.hero, ...parsed.hero }
  const about = { ...DEFAULT_HOME_CONTENT.about, ...parsed.about }
  const reviews = { ...DEFAULT_HOME_CONTENT.reviews, ...parsed.reviews }

  return {
    ...DEFAULT_HOME_CONTENT,
    ...parsed,
    hero: {
      ...hero,
      titleTag: resolveHeadingTag(hero.titleTag, DEFAULT_HOME_CONTENT.hero.titleTag ?? 'h1'),
      paragraph1Tag: resolveHeadingTag(hero.paragraph1Tag, DEFAULT_HOME_CONTENT.hero.paragraph1Tag ?? 'p'),
      paragraph2Tag: resolveHeadingTag(hero.paragraph2Tag, DEFAULT_HOME_CONTENT.hero.paragraph2Tag ?? 'p'),
      backgroundImageAlt:
        hero.backgroundImageAlt?.trim() || DEFAULT_HOME_CONTENT.hero.backgroundImageAlt,
    },
    benefits: (parsed.benefits ?? DEFAULT_HOME_CONTENT.benefits).map((item, index) => {
      const defaults = DEFAULT_HOME_CONTENT.benefits[index] ?? DEFAULT_HOME_CONTENT.benefits[0]!
      return {
        ...defaults,
        ...item,
        iconAlt: item.iconAlt?.trim() || defaults.iconAlt || item.text,
        textTag: resolveHeadingTag(item.textTag, defaults.textTag ?? 'p'),
      }
    }),
    highlights: (parsed.highlights ?? DEFAULT_HOME_CONTENT.highlights).map((item) => {
      const defaults = DEFAULT_HOME_CONTENT.highlights.find((entry) => entry.id === item.id)
      return {
        ...defaults,
        ...item,
        titleTag: resolveHeadingTag(item.titleTag, defaults?.titleTag ?? 'h3'),
        backgroundImageAlt:
          item.backgroundImageAlt?.trim() || defaults?.backgroundImageAlt || item.title,
      }
    }),
    about: {
      ...about,
      sectionTitleTag: resolveHeadingTag(
        about.sectionTitleTag,
        DEFAULT_HOME_CONTENT.about.sectionTitleTag ?? 'h2'
      ),
      row1RightImageAlt:
        about.row1RightImageAlt?.trim() || DEFAULT_HOME_CONTENT.about.row1RightImageAlt,
      row2LeftImageAlt:
        about.row2LeftImageAlt?.trim() || DEFAULT_HOME_CONTENT.about.row2LeftImageAlt,
      blocks: (about.blocks ?? DEFAULT_HOME_CONTENT.about.blocks).map((block, index) => {
        const defaults = DEFAULT_HOME_CONTENT.about.blocks[index] ?? DEFAULT_HOME_CONTENT.about.blocks[0]!
        return {
          ...defaults,
          ...block,
          titleTag: resolveHeadingTag(block.titleTag, defaults.titleTag ?? 'h3'),
          textTag: resolveHeadingTag(block.textTag, defaults.textTag ?? 'p'),
        }
      }),
    },
    reviews: {
      ...reviews,
      sectionTitleTag: resolveHeadingTag(
        reviews.sectionTitleTag,
        DEFAULT_HOME_CONTENT.reviews.sectionTitleTag ?? 'h2'
      ),
      items:
        parsed.reviews?.items !== undefined
          ? parsed.reviews.items.map((item, index) => {
              const defaults = DEFAULT_HOME_CONTENT.reviews.items[index] ?? DEFAULT_HOME_CONTENT.reviews.items[0]!
              return {
                ...defaults,
                ...item,
                textTag: resolveHeadingTag(item.textTag, defaults.textTag ?? 'p'),
                replyTextTag: resolveHeadingTag(item.replyTextTag, defaults.replyTextTag ?? 'p'),
              }
            })
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
