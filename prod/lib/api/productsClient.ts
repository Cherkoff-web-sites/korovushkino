import type { ProductData } from '@/lib/api/productsData'
import { getCatalogProducts, productsData } from '@/lib/api/productsData'
import { productUrlSlug } from '@/lib/productSeo'
import { readPreviewProducts } from '@/lib/previewProductsStore'
import { request } from '@/lib/api/httpClient'

function findInList(list: ProductData[], slugOrId: string) {
  return list.find((item) => item.id === slugOrId || productUrlSlug(item) === slugOrId) ?? null
}

export async function fetchCatalogProducts(): Promise<ProductData[]> {
  if (typeof window !== 'undefined') {
    const preview = readPreviewProducts()
    if (preview.length > 0) return preview
  }

  try {
    const data = await request<{ products: ProductData[] }>('/api/products')
    if (data.products?.length) return data.products
  } catch {
    // fallback ниже
  }

  return getCatalogProducts()
}

export async function fetchCatalogProduct(slugOrId: string): Promise<ProductData | null> {
  if (typeof window !== 'undefined') {
    const preview = readPreviewProducts()
    const fromPreview = findInList(preview, slugOrId)
    if (fromPreview) return fromPreview
  }

  try {
    const data = await request<{ product: ProductData }>(`/api/products/${encodeURIComponent(slugOrId)}`)
    if (data.product) return data.product
  } catch {
    // fallback ниже
  }

  return findInList(getCatalogProducts(), slugOrId) ?? productsData[slugOrId] ?? null
}
