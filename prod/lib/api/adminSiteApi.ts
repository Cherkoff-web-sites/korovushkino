import type { StoredNewsletterSubscriber, StoredOrder } from '@/lib/adminDataStore'
import type { DeliverySettings } from '@/lib/deliverySettings'
import { request } from '@/lib/api/httpClient'

export async function fetchPublicDeliverySettings() {
  return request<{ settings: DeliverySettings }>('/api/delivery/settings')
}

export async function adminFetchOrders() {
  return request<{ orders: StoredOrder[] }>('/api/admin/orders')
}

export async function adminFetchNewsletterSubscribers() {
  return request<{ subscribers: StoredNewsletterSubscriber[] }>('/api/admin/newsletter')
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
