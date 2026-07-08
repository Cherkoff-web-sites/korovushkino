/** Данные каталога «Коровушкино». Категории совпадают с плитками на главной (`?category=`). */

const PLACEHOLDER_IMG = '/images/home/hero-bg.png'

/** Плитки главной → slug в URL каталога */
export const CATEGORY_LABELS = {
  dairy: 'Молочная продукция',
  meat: 'Мясо',
  cheese: 'Сыры',
  poultry: 'Птица',
  'meat-products': 'Мясная продукция',
  honey: 'Мед',
  fish: 'Рыба',
  'semi-finished': 'Полуфабрикаты',
} as const

export type CategorySlug = keyof typeof CATEGORY_LABELS

export type DescriptionBlock = {
  type: 'p' | 'h2' | 'h3'
  text: string
}

export interface ProductData {
  id: string
  name: string
  /** Подпись к цене на карточке каталога, напр. «2л», «0,5л» */
  series: string
  /** Человекочитаемое имя категории (как в `CATEGORY_LABELS`) */
  category: string
  /** Совпадает с `id` плитки на главной и query `?category=` */
  categorySlug: CategorySlug
  price: number
  description: string
  /** Структурированное описание с заголовками h2/h3 */
  descriptionBlocks?: DescriptionBlock[]
  briefDescription?: string
  /** Текст на карточке в каталоге (2 строки с обрезкой); если нет — показывается `description`. */
  catalogCardTeaser?: string
  /** КБЖУ на 100 г и ккал — блок «Пищевая ценность» в поп-апе товара */
  modalNutrition?: {
    macrosPer100g: string
    kcal: string
  }
  images: string[]
  /** Alt-тексты для images (по индексу) */
  imageAlts?: string[]
  breadcrumbs: {
    label: string
    href: string
    active?: boolean
  }[]
  /** Сегмент URL: /catalog/{urlSlug}/ — если не задан, используется id */
  urlSlug?: string
  /** SEO-метаданные страницы товара */
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
  advantages?: string[]
  parametersTable?: {
    title: string
    headers: string[]
    rows: string[][]
  }[]
}

export function productBreadcrumbs(productName: string, categorySlug: CategorySlug) {
  return [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    {
      label: CATEGORY_LABELS[categorySlug],
      href: `/catalog?category=${categorySlug}`,
    },
    { label: productName, href: '#', active: true as const },
  ]
}

function p(
  id: string,
  name: string,
  series: string,
  categorySlug: CategorySlug,
  price: number,
  description: string,
  briefDescription: string,
  catalogImage?: string,
  catalogCardTeaser?: string,
  modalNutrition?: ProductData['modalNutrition'],
): ProductData {
  return {
    id,
    name,
    series,
    category: CATEGORY_LABELS[categorySlug],
    categorySlug,
    price,
    description,
    briefDescription,
    catalogCardTeaser,
    modalNutrition,
    images: [catalogImage ?? PLACEHOLDER_IMG],
    breadcrumbs: productBreadcrumbs(name, categorySlug),
  }
}

export const productsData: Record<string, ProductData> = {
  // —— Молочная продукция
  'molochnoe-korovje': p(
    'molochnoe-korovje',
    'Молоко коровье',
    '2л',
    'dairy',
    220,
    'Цельное пастеризованное молоко с собственной фермы. Натуральный вкус без растительных жиров — подходит для всей семьи.',
    'Пастеризованное молоко 2 л.',
    '/images/product_1.webp',
    'Молоко от «Коровушкино» — продукт высшего качества прямо с нашей фермы, без лишних добавок.',
  ),
  'molochnoe-kozje': p(
    'molochnoe-kozje',
    'Молоко козье',
    '0,5л',
    'dairy',
    140,
    'Свежее козье молоко с нашей фермы в Тульской области: нежный вкус и бережная пастеризация. Без растительных жиров — натуральный продукт для всей семьи.',
    'Козье молоко 0,5 л.',
    '/images/product_2.webp',
    'Свежее козье молоко с нашей фермы — идеальный выбор для тех, кто ценит нежный натуральный вкус.',
    {
      macrosPer100g: 'Белки — 3,6 г. Жиры — 3–5 г. Углеводы — 4,5 г.',
      kcal: '69',
    },
  ),
  'toplenoe-moloko': p(
    'toplenoe-moloko',
    'Топлёное молоко',
    '1л',
    'dairy',
    145,
    'Молоко длительной термической обработки — насыщенный карамельный аромат. Отлично для каши и напитков.',
    'Топлёное молоко 1 л.',
    '/images/product_3.webp',
    'После стакана такого топлёного молока хочется добавки — насыщенный карамельный аромат и мягкость.',
  ),
  'kefir-3-2': p(
    'kefir-3-2',
    'Кефир 3,2%',
    '1л',
    'dairy',
    145,
    'Густой кефир с живой закваской. Помогает разнообразить рацион и подходит к завтраку или перекусу.',
    'Кефир 3,2%, 1 л.',
    '/images/product_4.webp',
    'Кефир от «Коровушкино»! Кефир — это ферментированный молочный продукт с живой закваской.',
  ),
  'ryazhenka-4': p(
    'ryazhenka-4',
    'Ряженка 4%',
    '1л',
    'dairy',
    155,
    'Традиционная ряженка с выдержкой — кремовая текстура и сбалансированная кислинка.',
    'Ряженка 4%, 1 л.',
    '/images/product_5.webp',
    'Ряженка от «Коровушкино», изготовленная из самого свежего молока с выдержкой и кремовой текстурой.',
  ),
  'yogurt-klubnika': p(
    'yogurt-klubnika',
    'Йогурт питьевой (клубника)',
    '0,5л',
    'dairy',
    100,
    'Питьевой йогурт с натуральным клубничным наполнителем. Освежает и удобен в дороге.',
    'Питьевой йогурт, клубника, 0,5 л.',
    '/images/product_6.webp',
    'Питьевой йогурт с натуральным клубничным наполнителем — освежает и удобен в дороге.',
  ),
  'smetana-20': p(
    'smetana-20',
    'Сметана 20%',
    '300 г',
    'dairy',
    95,
    'Густая сметана для заправки борща, соусов и выпечки.',
    'Сметана 20%, 300 г.',
  ),
  'tvorog-mjagkij': p(
    'tvorog-mjagkij',
    'Творог мягкий 5%',
    '200 г',
    'dairy',
    110,
    'Нежный зернистый творог — завтрак или основа для запеканок.',
    'Творог 5%, 200 г.',
  ),

  // —— Мясо
  'govjadina-farsh': p(
    'govjadina-farsh',
    'Фарш говяжий',
    '500 г',
    'meat',
    320,
    'Свежий охлаждённый фарш для котлет и фрикаделек.',
    'Говяжий фарш, 500 г.',
  ),
  'svinina-korejka': p(
    'svinina-korejka',
    'Корейка свиная',
    '≈ 1 кг',
    'meat',
    480,
    'Мраморная корейка для запекания и стейков на сковороде.',
    'Свиная корейка.',
  ),
  'baranina-rebra': p(
    'baranina-rebra',
    'Рёбра бараньи',
    '≈ 1 кг',
    'meat',
    620,
    'Для томления и шашлыка — насыщенный вкус.',
    'Бараньи рёбра.',
  ),
  'tushenina-gov': p(
    'tushenina-gov',
    'Тушенина говяжья',
    '≈ 1,2 кг',
    'meat',
    540,
    'Универсальный кусок для жаркого и тушения.',
    'Говяжья тушенина.',
  ),

  // —— Сыры
  'syr-domashnij': p(
    'syr-domashnij',
    'Сыр домашний',
    '≈ 350 г',
    'cheese',
    420,
    'Мягкий сыр с деликатной кислинкой — к хлебу и вино.',
    'Домашний сыр.',
  ),
  'syr-kopchjonij': p(
    'syr-kopchjonij',
    'Сыр копчёный',
    '≈ 250 г',
    'cheese',
    380,
    'Аромат дымка и плотная текстура.',
    'Копчёный сыр.',
  ),
  'brynza-kozja': p(
    'brynza-kozja',
    'Брынза козья',
    '200 г',
    'cheese',
    290,
    'Рассыпчатая солоноватая брынза для салатов и лепёшек.',
    'Козья брынза.',
  ),
  'suluguni': p(
    'suluguni',
    'Сулугуни',
    '250 г',
    'cheese',
    310,
    'Плетёнка для жарки и закусок.',
    'Сыр сулугуни.',
  ),

  // —— Птица
  'kurinoe-file': p(
    'kurinoe-file',
    'Филе куриное',
    '≈ 1 кг',
    'poultry',
    350,
    'Нежное филе грудки — запекание, гриль, суп.',
    'Куриное филе.',
  ),
  'kurinye-krylja': p(
    'kurinye-krylja',
    'Крылья куриные',
    '≈ 1 кг',
    'poultry',
    260,
    'Для запекания и маринада.',
    'Куриные крылья.',
  ),
  'indjajka-grudka': p(
    'indjajka-grudka',
    'Грудка индейки',
    '≈ 0,8 кг',
    'poultry',
    410,
    'Постное мясо с мягким вкусом.',
    'Индейка.',
  ),
  'utka-tushon': p(
    'utka-tushon',
    'Утка тушёная (тушка)',
    '≈ 2 кг',
    'poultry',
    680,
    'Для утиного жаркого и супов.',
    'Тушка утки.',
  ),

  // —— Мясная продукция
  'kolbasa-doktorskaja': p(
    'kolbasa-doktorskaja',
    'Колбаса «Докторская»',
    '500 г',
    'meat-products',
    385,
    'Варёная колбаса по домашнему рецепту.',
    'Докторская, 500 г.',
  ),
  'sosiski-molochnye': p(
    'sosiski-molochnye',
    'Сосиски молочные',
    '400 г',
    'meat-products',
    220,
    'Детям и к завтраку — мягкая текстура.',
    'Молочные сосиски.',
  ),
  'pechenochnaja-pashtet': p(
    'pechenochnaja-pashtet',
    'Паштет печёночный',
    '150 г',
    'meat-products',
    165,
    'Намазка к хлебу и крекерам.',
    'Печёночный паштет.',
  ),
  'rulet-kurinyj': p(
    'rulet-kurinyj',
    'Рулет куриный',
    '400 г',
    'meat-products',
    275,
    'Нарезка к столу и в ланч-бокс.',
    'Куриный рулет.',
  ),

  // —— Мёд
  'med-lipovij': p(
    'med-lipovij',
    'Мёд липовый',
    '500 г',
    'honey',
    450,
    'Цветочный аромат, мягкое послевкусие.',
    'Липовый мёд.',
  ),
  'med-grechishnyj': p(
    'med-grechishnyj',
    'Мёд гречишный',
    '500 г',
    'honey',
    470,
    'Насыщенный тёмный мёд.',
    'Гречишный мёд.',
  ),
  'med-sotovij': p(
    'med-sotovij',
    'Мёд в сотах',
    '300 г',
    'honey',
    520,
    'Срез с пасеки — как есть и к чаю.',
    'Мёд в сотах.',
  ),

  // —— Рыба
  'forel-ohl': p(
    'forel-ohl',
    'Форель охлаждённая',
    '≈ 1,5 кг',
    'fish',
    890,
    'Свежая форель для запекания целиком.',
    'Форель.',
  ),
  'semga-holod': p(
    'semga-holod',
    'Сёмга слабосолёная',
    '200 г',
    'fish',
    520,
    'Нарезка к завтраку и бутербродам.',
    'Сёмга.',
  ),
  'sibass-morskoj': p(
    'sibass-morskoj',
    'Сибас потрошёный',
    '≈ 400 г',
    'fish',
    340,
    'Для жарки и гриля.',
    'Сибас.',
  ),

  // —— Полуфабрикаты
  'pelmeni-domashnie': p(
    'pelmeni-domashnie',
    'Пельмени домашние',
    '800 г',
    'semi-finished',
    320,
    'Сочная начинка из говядины и свинины.',
    'Пельмени.',
  ),
  'vareniki-kartoshka': p(
    'vareniki-kartoshka',
    'Вареники с картофелем',
    '500 г',
    'semi-finished',
    210,
    'Классика с луком и маслом.',
    'Вареники.',
  ),
  'kotlety-kurinye': p(
    'kotlety-kurinye',
    'Котлеты куриные',
    '400 г',
    'semi-finished',
    240,
    'Готовые к жарке — удобный ужин.',
    'Куриные котлеты.',
  ),
}

/** Порядок карточек в каталоге «Все категории» */
export const allCatalogProductIds = [
  'molochnoe-korovje',
  'molochnoe-kozje',
  'toplenoe-moloko',
  'kefir-3-2',
  'ryazhenka-4',
  'yogurt-klubnika',
  'smetana-20',
  'tvorog-mjagkij',
  'govjadina-farsh',
  'svinina-korejka',
  'baranina-rebra',
  'tushenina-gov',
  'syr-domashnij',
  'syr-kopchjonij',
  'brynza-kozja',
  'suluguni',
  'kurinoe-file',
  'kurinye-krylja',
  'indjajka-grudka',
  'utka-tushon',
  'kolbasa-doktorskaja',
  'sosiski-molochnye',
  'pechenochnaja-pashtet',
  'rulet-kurinyj',
  'med-lipovij',
  'med-grechishnyj',
  'med-sotovij',
  'forel-ohl',
  'semga-holod',
  'sibass-morskoj',
  'pelmeni-domashnie',
  'vareniki-kartoshka',
  'kotlety-kurinye',
] as const

export function getCatalogProducts(categorySlug?: string | null): ProductData[] {
  const list = allCatalogProductIds.map((id) => productsData[id]).filter(Boolean) as ProductData[]
  if (!categorySlug) return list
  const slug = categorySlug.trim()
  if (!(slug in CATEGORY_LABELS)) return list
  return list.filter((product) => product.categorySlug === slug)
}

export function isCategorySlug(value: string): value is CategorySlug {
  return value in CATEGORY_LABELS
}
