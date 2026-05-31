import type { ProductData } from '@/lib/api/productsData'
import { request } from '@/lib/api/httpClient'

export async function adminFetchProducts() {
  return request<{ products: ProductData[]; order: string[] }>('/api/admin/products')
}

export async function adminFetchProduct(id: string) {
  return request<{ product: ProductData }>(`/api/admin/products/${encodeURIComponent(id)}`)
}

export async function adminCreateProduct(payload: Partial<ProductData> & Record<string, unknown>) {
  return request<{ product: ProductData }>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function adminUpdateProduct(
  id: string,
  payload: Partial<ProductData> & Record<string, unknown>,
) {
  return request<{ product: ProductData }>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function adminDeleteProduct(id: string) {
  return request<{ ok: boolean }>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export async function adminSuggestProductId(name: string) {
  return request<{ id: string }>('/api/admin/products/suggest-id', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}
