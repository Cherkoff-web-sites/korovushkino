import { request } from '@/lib/api/httpClient'

export async function syncClientProfileOnApi() {
  return request<{ ok: true }>('/api/clients/sync', { method: 'POST' })
}
