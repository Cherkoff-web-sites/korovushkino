export type StoredClient = {
  id: string
  email: string
  name: string
  phone: string
  registeredAt: string
  ordersCount: number
  status: string
}

export type StoredOrder = {
  id: string
  date: string
  name: string
  phone: string
  email: string
  itemsCount: number
  summary: string
  status: string
}

export type StoredContactLead = {
  id: string
  date: string
  name: string
  phone: string
  email: string
  message: string
  source: string
  status: string
}

const CLIENTS_KEY = 'korovushkino_admin_clients'
const ORDERS_KEY = 'korovushkino_admin_orders'
const CONTACTS_KEY = 'korovushkino_admin_contacts'

function readList<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function writeList<T>(key: string, items: T[], eventName: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(items))
  window.dispatchEvent(new Event(eventName))
}

export const readStoredClients = () => readList<StoredClient>(CLIENTS_KEY)
export const writeStoredClients = (items: StoredClient[]) =>
  writeList(CLIENTS_KEY, items, 'admin-clients-updated')

export const readStoredOrders = () => readList<StoredOrder>(ORDERS_KEY)
export const writeStoredOrders = (items: StoredOrder[]) =>
  writeList(ORDERS_KEY, items, 'admin-orders-updated')

export const readStoredContacts = () => readList<StoredContactLead>(CONTACTS_KEY)
export const writeStoredContacts = (items: StoredContactLead[]) =>
  writeList(CONTACTS_KEY, items, 'admin-contacts-updated')
