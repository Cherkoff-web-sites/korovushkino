export const ORDER_STATUSES = ['Новый', 'В работе', 'Собран', 'Доставлен'] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const DEFAULT_ORDER_STATUS: OrderStatus = 'Новый'

export function isActiveOrderStatus(status: string) {
  return status.trim() !== 'Доставлен'
}

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus)
}

const LEGACY_STATUS_MAP: Record<string, OrderStatus> = {
  'В обработке': 'В работе',
  'В пути': 'Собран',
}

export function normalizeOrderStatus(status: string): OrderStatus {
  const trimmed = status.trim()
  if (isOrderStatus(trimmed)) return trimmed
  return LEGACY_STATUS_MAP[trimmed] || DEFAULT_ORDER_STATUS
}

export function formatOrderItemsSummary(
  items: { name: string; quantity: number }[],
  fallbackSummary = ''
) {
  if (items.length > 0) {
    return items.map((item) => `${item.name} × ${item.quantity}`).join('\n')
  }
  return fallbackSummary
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .join('\n')
}
