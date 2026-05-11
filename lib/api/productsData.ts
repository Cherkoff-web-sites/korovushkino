/** Данные каталога «Коровушкино» (молочная продукция). */

const PLACEHOLDER_IMG = '/images/home/hero-bg.png'

const crumbCatalog = { label: 'Каталог', href: '/catalog' as const }
const crumbCategory = { label: 'Молочная продукция', href: '/catalog' as const }

export interface ProductData {
  id: string
  name: string
  /** Подпись к цене на карточке каталога, напр. «2л», «0,5л» */
  series: string
  category: string
  price: number
  description: string
  briefDescription?: string
  images: string[]
  breadcrumbs: {
    label: string
    href: string
    active?: boolean
  }[]
  descriptionContent?: {
    advantages?: string[]
    mainFunctions?: string[]
    characteristics?: string[]
    structuralFeatures?: string[]
    motorProtection?: string
    additionalOptions?: string
    generalDescription?: string
  }
  parametersTable?: {
    title: string
    headers: string[]
    rows: string[][]
  }[]
}

function crumbs(productName: string) {
  return [
    { label: 'Главная', href: '/' },
    crumbCatalog,
    crumbCategory,
    { label: productName, href: '#', active: true as const },
  ]
}

export const catalogProductIds = [
  'molochnoe-korovje',
  'molochnoe-kozje',
  'toplenoe-moloko',
  'kefir-3-2',
  'ryazhenka-4',
  'yogurt-klubnika',
] as const

export const productsData: Record<string, ProductData> = {
  'molochnoe-korovje': {
    id: 'molochnoe-korovje',
    name: 'Молоко коровье',
    series: '2л',
    category: 'Молочная продукция',
    price: 220,
    description:
      'Цельное пастеризованное молоко с собственной фермы. Натуральный вкус без растительных жиров — подходит для всей семьи.',
    briefDescription: 'Пастеризованное молоко 2 л.',
    images: [PLACEHOLDER_IMG],
    breadcrumbs: crumbs('Молоко коровье'),
  },
  'molochnoe-kozje': {
    id: 'molochnoe-kozje',
    name: 'Молоко козье',
    series: '0,5л',
    category: 'Молочная продукция',
    price: 140,
    description:
      'Нежное козье молоко с мягким вкусом. Удобный объём для первого знакомства с продуктом или небольшой семьи.',
    briefDescription: 'Козье молоко 0,5 л.',
    images: [PLACEHOLDER_IMG],
    breadcrumbs: crumbs('Молоко козье'),
  },
  'toplenoe-moloko': {
    id: 'toplenoe-moloko',
    name: 'Топлёное молоко',
    series: '1л',
    category: 'Молочная продукция',
    price: 145,
    description:
      'Молоко длительной термической обработки — насыщенный карамельный аромат. Отлично для каши и напитков.',
    briefDescription: 'Топлёное молоко 1 л.',
    images: [PLACEHOLDER_IMG],
    breadcrumbs: crumbs('Топлёное молоко'),
  },
  'kefir-3-2': {
    id: 'kefir-3-2',
    name: 'Кефир 3,2%',
    series: '1л',
    category: 'Молочная продукция',
    price: 145,
    description:
      'Густой кефир с живой закваской. Помогает разнообразить рацион и подходит к завтраку или перекусу.',
    briefDescription: 'Кефир 3,2%, 1 л.',
    images: [PLACEHOLDER_IMG],
    breadcrumbs: crumbs('Кефир 3,2%'),
  },
  'ryazhenka-4': {
    id: 'ryazhenka-4',
    name: 'Ряженка 4%',
    series: '1л',
    category: 'Молочная продукция',
    price: 155,
    description:
      'Традиционная ряженка с выдержкой — кремовая текстура и сбалансированная кислинка.',
    briefDescription: 'Ряженка 4%, 1 л.',
    images: [PLACEHOLDER_IMG],
    breadcrumbs: crumbs('Ряженка 4%'),
  },
  'yogurt-klubnika': {
    id: 'yogurt-klubnika',
    name: 'Йогурт питьевой (клубника)',
    series: '0,5л',
    category: 'Молочная продукция',
    price: 100,
    description:
      'Питьевой йогурт с натуральным клубничным наполнителем. Освежает и удобен в дороге.',
    briefDescription: 'Питьевой йогурт, клубника, 0,5 л.',
    images: [PLACEHOLDER_IMG],
    breadcrumbs: crumbs('Йогурт питьевой (клубника)'),
  },
}

/** Порядок карточек как в макете каталога */
export function getCatalogProducts(): ProductData[] {
  return catalogProductIds.map((id) => productsData[id]).filter(Boolean)
}
