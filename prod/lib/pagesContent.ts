import type { ContentBlock, HeadingTag } from '@/lib/contentBlocks'
import { normalizeContentBlocks, paragraphsToBlocks, resolveHeadingTag } from '@/lib/contentBlocks'

export type AboutBlock = {
  title: string
  titleTag?: HeadingTag
  blocks: ContentBlock[]
  image: string
  imageAlt: string
}

export type DeliveryFact = {
  label: string
  value: string
}

export type PaymentMethodContent = {
  id: 'card' | 'cash' | 'transfer'
  label: string
  enabled: boolean
}

export type BasketItemContent = {
  id: string
  title: string
  titleTag?: HeadingTag
  description: string
  descriptionTag?: HeadingTag
  nutritionPer100: string
  calories: string
  price: number
  image: string
  imageAlt: string
}

export type PagesContent = {
  about: {
    pageTitle: string
    pageTitleTag?: HeadingTag
    origin: AboutBlock
    farm: AboutBlock
    production: AboutBlock
    why: {
      title: string
      titleTag?: HeadingTag
      blocks: ContentBlock[]
    }
  }
  contact: {
    pageTitle: string
    pageTitleTag?: HeadingTag
    supportTitle: string
    supportTitleTag?: HeadingTag
    socialTitle: string
    socialTitleTag?: HeadingTag
    legalTitle: string
    legalTitleTag?: HeadingTag
    phoneDisplay: string
    phoneHref: string
    email: string
    legalLines: string[]
    sideImage: string
    sideImageAlt: string
  }
  deliveryPayment: {
    pageTitle: string
    pageTitleTag?: HeadingTag
    facts: DeliveryFact[]
    sideImage: string
    sideImageAlt: string
    calculatorTitle: string
    calculatorTitleTag?: HeadingTag
    calculatorText: string
    calculatorTextTag?: HeadingTag
    calculatorPlaceholder: string
    calculatorButton: string
    paymentTitle: string
    paymentTitleTag?: HeadingTag
    paymentMethods: PaymentMethodContent[]
  }
  baskets: {
    pageTitle: string
    pageTitleTag?: HeadingTag
    intro: string
    introTag?: HeadingTag
    items: BasketItemContent[]
  }
}

type LegacyAboutBlock = Partial<AboutBlock> & { paragraphs?: string[] }
type LegacyWhyBlock = Partial<PagesContent['about']['why']> & { paragraphs?: string[] }

function mergeAboutBlock(defaults: AboutBlock, parsed?: LegacyAboutBlock): AboutBlock {
  return {
    ...defaults,
    ...parsed,
    titleTag: resolveHeadingTag(parsed?.titleTag, defaults.titleTag ?? 'h2'),
    blocks: normalizeContentBlocks(parsed?.blocks, parsed?.paragraphs, defaults.blocks),
  }
}

function mergeWhyBlock(
  defaults: PagesContent['about']['why'],
  parsed?: LegacyWhyBlock
): PagesContent['about']['why'] {
  return {
    ...defaults,
    ...parsed,
    titleTag: resolveHeadingTag(parsed?.titleTag, defaults.titleTag ?? 'h2'),
    blocks: normalizeContentBlocks(parsed?.blocks, parsed?.paragraphs, defaults.blocks),
  }
}

export const DEFAULT_PAGES_CONTENT: PagesContent = {
  about: {
    pageTitle: 'О нас',
    pageTitleTag: 'h1',
    origin: {
      title: 'С чего все началось',
      titleTag: 'h2',
      blocks: paragraphsToBlocks([
        'Ферма «Коровушкино» появилась из простой идеи — делать настоящие продукты, такие, какими они были раньше. Без сложных технологий, без искусственных добавок, только из натурального молока и мяса.',
        'Несколько лет назад наша семья решила вернуться к фермерскому хозяйству. Мы хотели не просто выращивать животных, а создать место, где продукты делают с уважением к природе и традициям.',
        'Так в экологически чистом районе Тульской области появилась небольшая ферма, которая со временем стала делом всей семьи.',
      ]),
      image: '/images/about-origin.webp',
      imageAlt: 'Пейзаж Тульской области — место фермы «Коровушкино»',
    },
    farm: {
      title: 'Наше хозяйство',
      titleTag: 'h2',
      blocks: paragraphsToBlocks([
        'Сегодня на ферме «Коровушкино» живут коровы, которые дают натуральное молоко для нашей продукции. Животные получают только натуральные корма и содержатся в спокойных и комфортных условиях.',
        'Мы внимательно следим за качеством каждого этапа: от ухода за животными до производства готовых продуктов.',
        'Именно поэтому наше молоко, йогурты, сыры и мясные продукты сохраняют настоящий деревенский вкус.',
      ]),
      image: '/images/about-farm.webp',
      imageAlt: 'Коровы на ферме «Коровушкино»',
    },
    production: {
      title: 'Как мы делаем продукты',
      titleTag: 'h2',
      blocks: paragraphsToBlocks([
        'Мы придерживаемся простого принципа — минимум обработки и максимум натуральности. Молочные продукты на ферме готовятся традиционными методами. Например, часть продукции мы делаем термостатным способом, который позволяет сохранить полезные бактерии и натуральную структуру продукта. Мы не используем искусственные добавки, усилители вкуса или консерванты. Всё, что попадает на ваш стол — это результат натурального производства и свежего фермерского сырья.',
      ]),
      image: '/images/about-cheese.webp',
      imageAlt: 'Выдержка сыров на ферме',
    },
    why: {
      title: 'Почему мы это делаем',
      titleTag: 'h2',
      blocks: paragraphsToBlocks([
        'Для нас ферма — это не просто бизнес. Это дело, которое мы создаём для людей, ценящих настоящую еду.',
        'Мы хотим, чтобы каждый покупатель, открывая бутылку молока или баночку йогурта, чувствовал вкус натурального продукта, каким он должен быть.',
        'Ферма «Коровушкино» — это возвращение к простым и честным продуктам, сделанным с заботой о качестве и с уважением к традициям.',
      ]),
    },
  },
  contact: {
    pageTitle: 'Контакты',
    pageTitleTag: 'h1',
    supportTitle: 'Служба поддержки клиентов',
    supportTitleTag: 'h2',
    socialTitle: 'Социальные сети и мессенджеры',
    socialTitleTag: 'h2',
    legalTitle: 'Юр информация',
    legalTitleTag: 'h2',
    phoneDisplay: '8 (925) 140-48-05',
    phoneHref: 'tel:+79251404805',
    email: '89251404805@mail.ru',
    legalLines: [
      'ИП КФХ Козарезов Сергей Николаевич',
      'ОГРН ИП 314715403600111',
      'ИНН 772400591891',
      'КПП 0',
      'р/сч 40802810666000000346',
      'банк — Отделение 8604 Сбербанка России г. Тула',
      'БИК 047003608',
      'корр.счет. 30101810300000000608',
      'Юридический адрес: 301446, Тульская обл., Одоевский район, с. Говоренки, ул. Низок, д. 12',
    ],
    sideImage: '/images/contact.webp',
    sideImageAlt: 'Коровушкино — иллюстрация к разделу контактов',
  },
  deliveryPayment: {
    pageTitle: 'Доставка',
    pageTitleTag: 'h1',
    facts: [
      { label: 'Мы доставляем по Москве и Московской области', value: '' },
      { label: 'Минимальная сумма заказа', value: '2000 ₽' },
      { label: 'Заказы доставляются по', value: 'Чт, Пт, Сб' },
      { label: 'Стоимость доставки зависит от', value: 'адреса' },
    ],
    sideImage: '/images/delivery.webp',
    sideImageAlt: 'Доставка по Москве и области',
    calculatorTitle: 'Узнать стоимость доставки',
    calculatorTitleTag: 'h2',
    calculatorText:
      'Ниже — актуальные тарифы по Москве, Московской области и районам столицы. Точная стоимость рассчитывается автоматически при оформлении заказа.',
    calculatorTextTag: 'p',
    calculatorPlaceholder: 'Введите адрес доставки',
    calculatorButton: 'Рассчитать',
    paymentTitle: 'Оплата',
    paymentTitleTag: 'h2',
    paymentMethods: [
      { id: 'card', label: 'Картой', enabled: false },
      { id: 'cash', label: 'Наличными', enabled: false },
      { id: 'transfer', label: 'Переводом при получении', enabled: true },
    ],
  },
  baskets: {
    pageTitle: 'Продуктовые корзины',
    pageTitleTag: 'h1',
    intro: 'Готовые наборы нашей фермы — выберите корзину или соберите свой рацион из каталога.',
    introTag: 'p',
    items: [
      {
        id: 'meat',
        title: 'Корзина мясная',
        titleTag: 'h2',
        description:
          'Свежие мясные продукты с нашей фермы: натуральный состав, бережная упаковка и вкус, к которому хочется возвращаться. Идеально, чтобы познакомиться с ассортиментом или собрать основу для семейных ужинов.',
        descriptionTag: 'p',
        nutritionPer100: 'Белки — 18 г. Жиры — 12 г. Углеводы — 0 г.',
        calories: '198 ккал',
        price: 3499,
        image: '/images/home/hero-bg.png',
        imageAlt: 'Корзина мясная — набор фермерских продуктов',
      },
      {
        id: 'dairy',
        title: 'Корзина молочная',
        titleTag: 'h2',
        description:
          'Молоко, творог, сметана и сыры — всё из цельного молока без лишних добавок. Подходит для завтраков и перекусов: натуральный вкус и привычные продукты в одном наборе.',
        descriptionTag: 'p',
        nutritionPer100: 'Белки — 3,6 г. Жиры — 3–5 г. Углеводы — 4,5 г.',
        calories: '69 ккал',
        price: 2799,
        image: '/images/home/hero-bg.png',
        imageAlt: 'Корзина молочная — набор фермерских продуктов',
      },
      {
        id: 'weekly',
        title: 'Корзина недельная',
        titleTag: 'h2',
        description:
          'Сбалансированный набор на несколько дней: молочное, мясо, яйца и базовые продукты для стола. Удобно заказать разом и не думать о списке покупок на неделю вперёд.',
        descriptionTag: 'p',
        nutritionPer100: 'Белки — 12 г. Жиры — 8 г. Углеводы — 6 г.',
        calories: '145 ккал',
        price: 4999,
        image: '/images/home/hero-bg.png',
        imageAlt: 'Корзина недельная — набор фермерских продуктов',
      },
    ],
  },
}

const STORAGE_KEY = 'korovushkino_pages_content'

export function mergePagesContent(parsed: Partial<PagesContent>): PagesContent {
  const about: Partial<PagesContent['about']> = parsed.about ?? {}
  const contact: Partial<PagesContent['contact']> = parsed.contact ?? {}
  const deliveryPayment: Partial<PagesContent['deliveryPayment']> = parsed.deliveryPayment ?? {}
  const baskets: Partial<PagesContent['baskets']> = parsed.baskets ?? {}

  return {
    ...DEFAULT_PAGES_CONTENT,
    ...parsed,
    about: {
      ...DEFAULT_PAGES_CONTENT.about,
      ...about,
      pageTitleTag: resolveHeadingTag(about.pageTitleTag, DEFAULT_PAGES_CONTENT.about.pageTitleTag),
      origin: mergeAboutBlock(DEFAULT_PAGES_CONTENT.about.origin, about.origin),
      farm: mergeAboutBlock(DEFAULT_PAGES_CONTENT.about.farm, about.farm),
      production: mergeAboutBlock(DEFAULT_PAGES_CONTENT.about.production, about.production),
      why: mergeWhyBlock(DEFAULT_PAGES_CONTENT.about.why, about.why),
    },
    contact: {
      ...DEFAULT_PAGES_CONTENT.contact,
      ...contact,
      pageTitleTag: resolveHeadingTag(contact.pageTitleTag, DEFAULT_PAGES_CONTENT.contact.pageTitleTag),
      supportTitleTag: resolveHeadingTag(contact.supportTitleTag, DEFAULT_PAGES_CONTENT.contact.supportTitleTag),
      socialTitleTag: resolveHeadingTag(contact.socialTitleTag, DEFAULT_PAGES_CONTENT.contact.socialTitleTag),
      legalTitleTag: resolveHeadingTag(contact.legalTitleTag, DEFAULT_PAGES_CONTENT.contact.legalTitleTag),
    },
    deliveryPayment: {
      ...DEFAULT_PAGES_CONTENT.deliveryPayment,
      ...deliveryPayment,
      pageTitleTag: resolveHeadingTag(
        deliveryPayment.pageTitleTag,
        DEFAULT_PAGES_CONTENT.deliveryPayment.pageTitleTag
      ),
      calculatorTitleTag: resolveHeadingTag(
        deliveryPayment.calculatorTitleTag,
        DEFAULT_PAGES_CONTENT.deliveryPayment.calculatorTitleTag
      ),
      calculatorTextTag: resolveHeadingTag(
        deliveryPayment.calculatorTextTag,
        DEFAULT_PAGES_CONTENT.deliveryPayment.calculatorTextTag
      ),
      paymentTitleTag: resolveHeadingTag(
        deliveryPayment.paymentTitleTag,
        DEFAULT_PAGES_CONTENT.deliveryPayment.paymentTitleTag
      ),
      facts: deliveryPayment.facts?.length
        ? deliveryPayment.facts
        : DEFAULT_PAGES_CONTENT.deliveryPayment.facts,
      paymentMethods:
        deliveryPayment.paymentMethods !== undefined
          ? deliveryPayment.paymentMethods
          : DEFAULT_PAGES_CONTENT.deliveryPayment.paymentMethods,
    },
    baskets: {
      ...DEFAULT_PAGES_CONTENT.baskets,
      ...baskets,
      pageTitleTag: resolveHeadingTag(baskets.pageTitleTag, DEFAULT_PAGES_CONTENT.baskets.pageTitleTag),
      introTag: resolveHeadingTag(baskets.introTag, DEFAULT_PAGES_CONTENT.baskets.introTag),
      items: (baskets.items?.length ? baskets.items : DEFAULT_PAGES_CONTENT.baskets.items).map((item, index) => {
        const defaults = DEFAULT_PAGES_CONTENT.baskets.items[index] ?? DEFAULT_PAGES_CONTENT.baskets.items[0]!
        return {
          ...defaults,
          ...item,
          titleTag: resolveHeadingTag(item.titleTag, defaults.titleTag ?? 'h2'),
          descriptionTag: resolveHeadingTag(item.descriptionTag, defaults.descriptionTag ?? 'p'),
          imageAlt: item.imageAlt?.trim() || defaults.imageAlt || item.title,
        }
      }),
    },
  }
}

export function readPagesContent(): PagesContent {
  if (typeof window === 'undefined') return DEFAULT_PAGES_CONTENT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PAGES_CONTENT
    return mergePagesContent(JSON.parse(raw) as Partial<PagesContent>)
  } catch {
    return DEFAULT_PAGES_CONTENT
  }
}

export function writePagesContent(content: PagesContent) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new Event('pages-content-updated'))
}

export function linesToText(lines: string[]) {
  return lines.join('\n')
}

export function textToLines(text: string) {
  return text
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}
