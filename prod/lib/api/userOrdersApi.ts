import type { StoredOrder } from '@/lib/adminDataStore'
import { request } from '@/lib/api/httpClient'

export async function fetchMyOrders() {
  return request<{ orders: StoredOrder[] }>('/api/orders/mine')
}
