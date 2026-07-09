import type { ProductData } from '@/lib/api/productsData'
import { getCatalogProducts, productsData } from '@/lib/api/productsData'
import { productUrlSlug } from '@/lib/productSeo'
import { request } from '@/lib/api/httpClient'

function findInList(list: ProductData[], slugOrId: string) {
  return list.find((item) => item.id === slugOrId || productUrlSlug(item) === slugOrId) ?? null
}

export async function fetchCatalogProducts(): Promise<ProductData[]> {
  try {
    const data = await request<{ products: ProductData[] }>('/api/products')
    if (data.products?.length) return data.products
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
