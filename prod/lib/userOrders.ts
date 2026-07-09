import type { StoredOrder, StoredOrderItem } from '@/lib/adminDataStore'
import { fetchMyOrders } from '@/lib/api/userOrdersApi'

const ACTIVE_STATUSES = new Set(['Новый', 'В обработке', 'В пути'])

export function isActiveOrderStatus(status: string) {
  return ACTIVE_STATUSES.has(status.trim())
}

export function parseOrderItems(order: StoredOrder): StoredOrderItem[] {
  if (order.items?.length) return order.items

  return order.summary
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(.+?)\s×\s*(\d+)$/)
      if (!match) return null
      const name = match[1]!.trim()
      return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        quantity: Number(match[2]) || 1,
      }
    })
    .filter((item): item is StoredOrderItem => item !== null)
}

export async function getOrdersForUser(email: string): Promise<StoredOrder[]> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return []

  try {
    const data = await fetchMyOrders()
    return data.orders
  } catch {
    return []
  }
}

export function getUniqueAddresses(orders: StoredOrder[]) {
  const seen = new Set<string>()
  const addresses: { address: string; lastUsedAt: string; orderId: string }[] = []

  for (const order of orders) {
    const address = order.address.trim()
    if (!address || seen.has(address)) continue
    seen.add(address)
    addresses.push({
      address,
      lastUsedAt: order.date,
      orderId: order.id,
    })
  }

  return addresses
}
