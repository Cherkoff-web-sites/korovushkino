import type { ProductData } from '@/lib/api/productsData'
import { getCatalogProducts, productsData } from '@/lib/api/productsData'
import { productUrlSlug } from '@/lib/productSeo'
import { request } from '@/lib/api/httpClient'

const CATALOG_CACHE_KEY = 'korovushkino_catalog_cache_v2'
const CATALOG_CACHE_TTL_MS = 60_000

function findInList(list: ProductData[], slugOrId: string) {
  return list.find((item) => item.id === slugOrId || productUrlSlug(item) === slugOrId) ?? null
}

function readCatalogCache(): ProductData[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CATALOG_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; products: ProductData[] }
    if (!Array.isArray(parsed.products) || Date.now() - parsed.at > CATALOG_CACHE_TTL_MS) {
      return null
    }
    return parsed.products
  } catch {
    return null
  }
}

function writeCatalogCache(products: ProductData[]) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(
      CATALOG_CACHE_KEY,
      JSON.stringify({ at: Date.now(), products })
    )
  } catch {
    // quota / private mode — ignore
  }
}

export function peekCachedCatalogProducts(): ProductData[] | null {
  return readCatalogCache()
}

export async function fetchCatalogProducts(): Promise<ProductData[]> {
  const cached = readCatalogCache()
  if (cached?.length) {
    // Refresh in background
    void request<{ products: ProductData[] }>('/api/products')
      .then((data) => {
        if (data.products?.length) writeCatalogCache(data.products)
      })
      .catch(() => {})
    return cached
  }

  try {
    const data = await request<{ products: ProductData[] }>('/api/products')
    if (data.products?.length) {
      writeCatalogCache(data.products)
      return data.products
    }
  } catch {
    // fallback ниже
  }

  return getCatalogProducts()
}

export async function fetchCatalogProduct(slugOrId: string): Promise<ProductData | null> {
  try {
    const data = await request<{ product: ProductData }>(`/api/products/${encodeURIComponent(slugOrId)}`)
    if (data.product) return data.product
  } catch {
    // fallback ниже
  }

  return findInList(getCatalogProducts(), slugOrId) ?? productsData[slugOrId] ?? null
}
