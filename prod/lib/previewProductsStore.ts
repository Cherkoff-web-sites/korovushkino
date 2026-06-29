import { getCatalogProducts, type ProductData } from '@/lib/api/productsData'

const STORAGE_KEY = 'korovushkino_products'

export function readPreviewProducts(): ProductData[] {
  if (typeof window === 'undefined') return getCatalogProducts()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getCatalogProducts()
    const parsed = JSON.parse(raw) as ProductData[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getCatalogProducts()
  } catch {
    return getCatalogProducts()
  }
}

export function writePreviewProducts(products: ProductData[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  window.dispatchEvent(new Event('preview-products-updated'))
}
