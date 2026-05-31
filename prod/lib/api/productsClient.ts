import type { ProductData } from '@/lib/api/productsData'
import { request } from '@/lib/api/httpClient'

export async function fetchCatalogProducts(): Promise<ProductData[]> {
  const data = await request<{ products: ProductData[] }>('/api/products')
  return data.products
}

export async function fetchCatalogProduct(id: string): Promise<ProductData | null> {
  try {
    const data = await request<{ product: ProductData }>(`/api/products/${encodeURIComponent(id)}`)
    return data.product
  } catch {
    return null
  }
}
