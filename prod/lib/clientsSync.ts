import { upsertStoredClient, type StoredClient } from '@/lib/adminDataStore'
import { syncClientProfileOnApi } from '@/lib/api/clientsApi'
import type { AuthUser } from '@/lib/api/authApi'

function buildStoredClient(user: AuthUser): StoredClient {
  return {
    id: String(user.id),
    email: user.email || user.login,
    name: [user.surname, user.firstName].filter(Boolean).join(' ').trim() || '—',
    phone: user.phone || '—',
    registeredAt: user.createdAt
      ? new Date(user.createdAt).toLocaleString('ru-RU')
      : new Date().toLocaleString('ru-RU'),
    ordersCount: 0,
    status: 'Активен',
  }
}

export function syncClientFromUser(user: AuthUser) {
  if (user.role === 'admin' || !user.id) return

  const client = buildStoredClient(user)
  upsertStoredClient(client)

  void syncClientProfileOnApi().catch(() => {
    // Офлайн-режим: локальная копия уже обновлена выше
  })
}
