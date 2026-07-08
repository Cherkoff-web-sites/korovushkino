import { appendNewsletterSubscriber, appendStoredOrder, type StoredOrder } from '@/lib/adminDataStore'
import { request } from '@/lib/api/httpClient'
import type { CartItem } from '@/contexts/CartContext'
import type { DeliveryAddress, DeliveryTime, PaymentMethodId } from '@/components/checkout/checkoutTypes'
import { PAYMENT_METHODS } from '@/components/checkout/checkoutTypes'
import { readDeliverySettings } from '@/lib/deliverySettings'

function formatAddress(address: DeliveryAddress) {
  const settings = readDeliverySettings()
  const districtName = settings.moscowDistricts.find((item) => item.id === address.district)?.name
  const parts = [
    address.city,
    districtName ? `р-н ${districtName}` : address.district ? `р-н ${address.district}` : '',
    address.street,
    address.house ? `д. ${address.house}` : '',
    address.apartment ? `кв. ${address.apartment}` : '',
    address.floor ? `эт. ${address.floor}` : '',
    address.entrance ? `подъезд ${address.entrance}` : '',
    address.intercom ? `домофон ${address.intercom}` : '',
    address.comment ? `(${address.comment})` : '',
  ].filter(Boolean)
  return parts.join(', ')
}

export type SubmitOrderPayload = {
  contact: { fullName: string; email: string }
  address: DeliveryAddress
  deliveryTime: DeliveryTime
  paymentMethod: PaymentMethodId
  items: CartItem[]
  productsTotal: number
  deliveryCost: number
}

function buildOrderSummary(items: CartItem[]) {
  return items.map((item) => `${item.name} × ${item.quantity}`).join('; ')
}

function toStoredOrder(payload: SubmitOrderPayload): StoredOrder {
  const paymentLabel =
    PAYMENT_METHODS.find((item) => item.id === payload.paymentMethod)?.summaryLabel ??
    payload.paymentMethod

  return {
    id: `ord-${Date.now()}`,
    date: new Date().toLocaleString('ru-RU'),
    name: payload.contact.fullName.trim(),
    phone: '—',
    email: payload.contact.email.trim(),
    itemsCount: payload.items.reduce((sum, item) => sum + item.quantity, 0),
    summary: buildOrderSummary(payload.items),
    status: 'Новый',
    productsTotal: payload.productsTotal,
    deliveryCost: payload.deliveryCost,
    total: payload.productsTotal + payload.deliveryCost,
    address: formatAddress(payload.address),
    paymentMethod: paymentLabel,
    deliveryTime: `${payload.deliveryTime.date}, ${payload.deliveryTime.time}`,
  }
}

export async function submitCheckoutOrder(payload: SubmitOrderPayload) {
  const order = toStoredOrder(payload)
  appendStoredOrder(order)

  try {
    await request<{ ok: true }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    })
  } catch {
    // Заказ уже сохранён локально для админки
  }

  return order
}

export async function subscribeToNewsletter(email: string, source = 'footer') {
  const added = appendNewsletterSubscriber(email, source)

  try {
    const response = await request<{ ok: true; duplicate?: boolean }>('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    })
    return response.duplicate ? false : true
  } catch {
    return added
  }
}
