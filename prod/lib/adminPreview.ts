import {
  getCatalogProducts,
  productsData,
  type CategorySlug,
  type DescriptionBlock,
  type ProductData,
  CATEGORY_LABELS,
  productBreadcrumbs,
} from '@/lib/api/productsData'
import { readPreviewProducts } from '@/lib/previewProductsStore'
import { productUrlSlug } from '@/lib/productSeo'

/** Локальный режим админки без backend (перед продом — false). */
export const ADMIN_PREVIEW = true

export function getPreviewProducts(): ProductData[] {
  if (typeof window !== 'undefined') {
    return readPreviewProducts()
  }
  return getCatalogProducts()
}

export function getPreviewProduct(id: string): ProductData | null {
  const products = getPreviewProducts()
  const fromStore = products.find((item) => item.id === id || productUrlSlug(item) === id)
  if (fromStore) return fromStore
  return productsData[id] ?? null
}

function slugifyId(value: string) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildPreviewProduct(payload: Record<string, unknown>, existingId?: string): ProductData {
  const id = existingId || slugifyId(String(payload.id || payload.name || ''))
  const categorySlug = String(payload.categorySlug || 'dairy') as CategorySlug
  const name = String(payload.name || '').trim()
  const images = Array.isArray(payload.images)
    ? payload.images.map((item) => String(item).trim()).filter(Boolean)
    : String(payload.images || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

  return {
    id,
    name,
    series: String(payload.series || '').trim(),
    category: CATEGORY_LABELS[categorySlug] ?? CATEGORY_LABELS.dairy,
    categorySlug,
    price: Number(payload.price) || 0,
    description: String(payload.description || '').trim(),
    descriptionBlocks: Array.isArray(payload.descriptionBlocks)
      ? (payload.descriptionBlocks as DescriptionBlock[])
      : undefined,
    briefDescription: String(payload.briefDescription || '').trim(),
    catalogCardTeaser: String(payload.catalogCardTeaser || '').trim() || undefined,
    modalNutrition:
      payload.modalNutrition &&
      typeof payload.modalNutrition === 'object' &&
      (payload.modalNutrition as { macrosPer100g?: string }).macrosPer100g
        ? {
            macrosPer100g: String(
              (payload.modalNutrition as { macrosPer100g?: string }).macrosPer100g || '',
            ),
            kcal: String((payload.modalNutrition as { kcal?: string }).kcal || ''),
          }
        : undefined,
    images: images.length > 0 ? images : ['/images/home/hero-bg.png'],
    imageAlts: Array.isArray(payload.imageAlts)
      ? payload.imageAlts.map((item) => String(item).trim())
      : undefined,
    breadcrumbs: productBreadcrumbs(name, categorySlug),
    urlSlug: slugifyId(String(payload.urlSlug || id)) || id,
    seo: {
      title: String((payload.seo as { title?: string } | undefined)?.title || '').trim() || undefined,
      description:
        String((payload.seo as { description?: string } | undefined)?.description || '').trim() ||
        undefined,
      keywords:
        String((payload.seo as { keywords?: string } | undefined)?.keywords || '').trim() ||
        undefined,
    },
  }
}

export function suggestPreviewProductId(name: string) {
  return slugifyId(name)
}
