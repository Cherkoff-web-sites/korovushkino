import { upsertStoredClient, type StoredClient } from '@/lib/adminDataStore'
import type { AuthUser } from '@/lib/api/authApi'

export function syncClientFromUser(user: AuthUser) {
  if (user.role === 'admin') return

  const client: StoredClient = {
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

  upsertStoredClient(client)
}
