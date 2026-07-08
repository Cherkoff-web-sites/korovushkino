export type AboutBlock = {
  title: string
  paragraphs: string[]
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
  description: string
  nutritionPer100: string
  calories: string
  price: number
  image: string
}

export type PagesContent = {
  about: {
    pageTitle: string
    origin: AboutBlock
    farm: AboutBlock
    production: AboutBlock
    why: {
      title: string
      paragraphs: string[]
    }
  }
  contact: {
    pageTitle: string
    supportTitle: string
    socialTitle: string
    legalTitle: string
    phoneDisplay: string
    phoneHref: string
    email: string
    legalLines: string[]
    sideImage: string
    sideImageAlt: string
  }
  deliveryPayment: {
    pageTitle: string
    facts: DeliveryFact[]
    sideImage: string
    sideImageAlt: string
    calculatorTitle: string
    calculatorText: string
    calculatorPlaceholder: string
    calculatorButton: string
    paymentTitle: string
    paymentMethods: PaymentMethodContent[]
  }
  baskets: {
    pageTitle: string
    intro: string
    items: BasketItemContent[]
  }
}

export const DEFAULT_PAGES_CONTENT: PagesContent = {
  about: {
    pageTitle: 'О нас',
    origin: {
      title: 'С чего все началось',
      paragraphs: [
        'Ферма «Коровушкино» появилась из простой идеи — делать настоящие продукты, такие, какими они были раньше. Без сложных технологий, без искусственных добавок, только из натурального молока и мяса.',
        'Несколько лет назад наша семья решила вернуться к фермерскому хозяйству. Мы хотели не просто выращивать животных, а создать место, где продукты делают с уважением к природе и традициям.',
        'Так в экологически чистом районе Тульской области появилась небольшая ферма, которая со временем стала делом всей семьи.',
      ],
      image: '/images/about-origin.webp',
      imageAlt: 'Пейзаж Тульской области — место фермы «Коровушкино»',
    },
    farm: {
      title: 'Наше хозяйство',
      paragraphs: [
        'Сегодня на ферме «Коровушкино» живут коровы, которые дают натуральное молоко для нашей продукции. Животные получают только натуральные корма и содержатся в спокойных и комфортных условиях.',
        'Мы внимательно следим за качеством каждого этапа: от ухода за животными до производства готовых продуктов.',
        'Именно поэтому наше молоко, йогурты, сыры и мясные продукты сохраняют настоящий деревенский вкус.',
      ],
      image: '/images/about-farm.webp',
      imageAlt: 'Коровы на ферме «Коровушкино»',
    },
    production: {
      title: 'Как мы делаем продукты',
      paragraphs: [
        'Мы придерживаемся простого принципа — минимум обработки и максимум натуральности. Молочные продукты на ферме готовятся традиционными методами. Например, часть продукции мы делаем термостатным способом, который позволяет сохранить полезные бактерии и натуральную структуру продукта. Мы не используем искусственные добавки, усилители вкуса или консерванты. Всё, что попадает на ваш стол — это результат натурального производства и свежего фермерского сырья.',
      ],
      image: '/images/about-cheese.webp',
      imageAlt: 'Выдержка сыров на ферме',
    },
    why: {
      title: 'Почему мы это делаем',
      paragraphs: [
        'Для нас ферма — это не просто бизнес. Это дело, которое мы создаём для людей, ценящих настоящую еду.',
        'Мы хотим, чтобы каждый покупатель, открывая бутылку молока или баночку йогурта, чувствовал вкус натурального продукта, каким он должен быть.',
        'Ферма «Коровушкино» — это возвращение к простым и честным продуктам, сделанным с заботой о качестве и с уважением к традициям.',
      ],
    },
  },
  contact: {
    pageTitle: 'Контакты',
    supportTitle: 'Служба поддержки клиентов',
    socialTitle: 'Социальные сети и мессенджеры',
    legalTitle: 'Юр информация',
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
    facts: [
      { label: 'Мы доставляем по Москве и Московской области', value: '' },
      { label: 'Минимальная сумма заказа', value: '2000 ₽' },
      { label: 'Заказы доставляются по', value: 'Чт, Пт, Сб' },
      { label: 'Стоимость доставки зависит от', value: 'адреса' },
    ],
    sideImage: '/images/delivery.webp',
    sideImageAlt: 'Доставка по Москве и области',
    calculatorTitle: 'Узнать стоимость доставки',
    calculatorText:
      'Всего лишь введите адрес доставки, а мы все посчитаем и покажем, когда привезем и за сколько.',
    calculatorPlaceholder: 'Введите адрес доставки',
    calculatorButton: 'Рассчитать',
    paymentTitle: 'Оплата',
    paymentMethods: [
      { id: 'card', label: 'Картой', enabled: false },
      { id: 'cash', label: 'Наличными', enabled: false },
      { id: 'transfer', label: 'Переводом при получении', enabled: true },
    ],
  },
  baskets: {
    pageTitle: 'Продуктовые корзины',
    intro: 'Готовые наборы нашей фермы — выберите корзину или соберите свой рацион из каталога.',
    items: [
      {
        id: 'meat',
        title: 'Корзина мясная',
        description:
          'Свежие мясные продукты с нашей фермы: натуральный состав, бережная упаковка и вкус, к которому хочется возвращаться. Идеально, чтобы познакомиться с ассортиментом или собрать основу для семейных ужинов.',
        nutritionPer100: 'Белки — 18 г. Жиры — 12 г. Углеводы — 0 г.',
        calories: '198 ккал',
        price: 3499,
        image: '/images/home/hero-bg.png',
      },
      {
        id: 'dairy',
        title: 'Корзина молочная',
        description:
          'Молоко, творог, сметана и сыры — всё из цельного молока без лишних добавок. Подходит для завтраков и перекусов: натуральный вкус и привычные продукты в одном наборе.',
        nutritionPer100: 'Белки — 3,6 г. Жиры — 3–5 г. Углеводы — 4,5 г.',
        calories: '69 ккал',
        price: 2799,
        image: '/images/home/hero-bg.png',
      },
      {
        id: 'weekly',
        title: 'Корзина недельная',
        description:
          'Сбалансированный набор на несколько дней: молочное, мясо, яйца и базовые продукты для стола. Удобно заказать разом и не думать о списке покупок на неделю вперёд.',
        nutritionPer100: 'Белки — 12 г. Жиры — 8 г. Углеводы — 6 г.',
        calories: '145 ккал',
        price: 4999,
        image: '/images/home/hero-bg.png',
      },
    ],
  },
}

const STORAGE_KEY = 'korovushkino_pages_content'

function mergePagesContent(parsed: Partial<PagesContent>): PagesContent {
  return {
    ...DEFAULT_PAGES_CONTENT,
    ...parsed,
    about: {
      ...DEFAULT_PAGES_CONTENT.about,
      ...parsed.about,
      origin: { ...DEFAULT_PAGES_CONTENT.about.origin, ...parsed.about?.origin },
      farm: { ...DEFAULT_PAGES_CONTENT.about.farm, ...parsed.about?.farm },
      production: { ...DEFAULT_PAGES_CONTENT.about.production, ...parsed.about?.production },
      why: { ...DEFAULT_PAGES_CONTENT.about.why, ...parsed.about?.why },
    },
    contact: { ...DEFAULT_PAGES_CONTENT.contact, ...parsed.contact },
    deliveryPayment: {
      ...DEFAULT_PAGES_CONTENT.deliveryPayment,
      ...parsed.deliveryPayment,
      facts: parsed.deliveryPayment?.facts?.length
        ? parsed.deliveryPayment.facts
        : DEFAULT_PAGES_CONTENT.deliveryPayment.facts,
      paymentMethods:
        parsed.deliveryPayment?.paymentMethods !== undefined
          ? parsed.deliveryPayment.paymentMethods
          : DEFAULT_PAGES_CONTENT.deliveryPayment.paymentMethods,
    },
    baskets: {
      ...DEFAULT_PAGES_CONTENT.baskets,
      ...parsed.baskets,
      items: parsed.baskets?.items?.length
        ? parsed.baskets.items
        : DEFAULT_PAGES_CONTENT.baskets.items,
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

export function paragraphsToText(paragraphs: string[]) {
  return paragraphs.join('\n\n')
}

export function textToParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
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
