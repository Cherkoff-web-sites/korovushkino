import type { StoredNewsletterSubscriber, StoredOrder, StoredClient } from '@/lib/adminDataStore'
import type { DeliverySettings } from '@/lib/deliverySettings'
import { request } from '@/lib/api/httpClient'

export type SiteContentSection = 'home' | 'pages' | 'site' | 'delivery'
export type BackupSection =
  | 'products'
  | 'orders'
  | 'reviews'
  | 'newsletter'
  | 'clients'
  | 'contacts'
  | 'content'
  | 'delivery'
  | 'seo'

export async function fetchPublicDeliverySettings() {
  return request<{ settings: DeliverySettings }>('/api/delivery/settings')
}

export async function adminFetchOrders() {
  return request<{ orders: StoredOrder[] }>('/api/admin/orders')
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  return request<{ ok: true; order: StoredOrder }>(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function adminFetchContacts() {
  return request<{ contacts: unknown[] }>('/api/admin/contacts')
}

export async function adminFetchNewsletterSubscribers() {
  return request<{ subscribers: StoredNewsletterSubscriber[] }>('/api/admin/newsletter')
}

export async function adminFetchClients() {
  return request<{ clients: StoredClient[] }>('/api/admin/clients')
}

export async function adminFetchDeliverySettings() {
  return request<{ settings: DeliverySettings }>('/api/admin/delivery/settings')
}

export async function adminSaveDeliverySettings(settings: DeliverySettings) {
  return request<{ settings: DeliverySettings }>('/api/admin/delivery/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  })
}

export async function fetchPublicContent<T>(section: SiteContentSection) {
  return request<{ section: SiteContentSection; content: T | null }>(
    `/api/content/${encodeURIComponent(section)}`
  )
}

export async function adminFetchContent<T>(section: SiteContentSection) {
  return request<{ section: SiteContentSection; content: T | null }>(
    `/api/admin/content/${encodeURIComponent(section)}`
  )
}

export async function adminSaveContent<T>(section: SiteContentSection, content: T) {
  return request<{ section: SiteContentSection; content: T }>(
    `/api/admin/content/${encodeURIComponent(section)}`,
    {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }
  )
}

export async function adminExportBackup(section?: BackupSection) {
  return request<Record<string, unknown>>(section ? `/api/admin/backup/${section}` : '/api/admin/backup')
}

export async function adminImportBackup(payload: unknown, section?: BackupSection) {
  return request<{ ok: true; backup: Record<string, unknown> }>(
    section ? `/api/admin/backup/import/${section}` : '/api/admin/backup/import',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}
