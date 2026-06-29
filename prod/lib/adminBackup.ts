import type { ProductData } from '@/lib/api/productsData'
import { DEFAULT_HOME_CONTENT, type HomeContent, writeHomeContent } from '@/lib/homeContent'
import {
  readStoredClients,
  readStoredContacts,
  readStoredOrders,
  writeStoredClients,
  writeStoredContacts,
  writeStoredOrders,
  type StoredClient,
  type StoredContactLead,
  type StoredOrder,
} from '@/lib/adminDataStore'
import { readPreviewProducts, writePreviewProducts } from '@/lib/previewProductsStore'
import { ADMIN_PREVIEW } from '@/lib/adminPreview'
import { adminCreateProduct, adminFetchProducts, adminUpdateProduct } from '@/lib/api/adminProductsApi'

export const BACKUP_VERSION = 1 as const

export type AdminBackup = {
  version: typeof BACKUP_VERSION
  exportedAt: string
  homeContent: HomeContent
  products: ProductData[]
  clients: StoredClient[]
  orders: StoredOrder[]
  contacts: StoredContactLead[]
}

export function buildAdminBackup(): AdminBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    homeContent: readHomeContentSafe(),
    products: readPreviewProducts(),
    clients: readStoredClients(),
    orders: readStoredOrders(),
    contacts: readStoredContacts(),
  }
}

function readHomeContentSafe(): HomeContent {
  if (typeof window === 'undefined') return DEFAULT_HOME_CONTENT
  try {
    const raw = localStorage.getItem('korovushkino_home_content')
    if (!raw) return DEFAULT_HOME_CONTENT
    return { ...DEFAULT_HOME_CONTENT, ...JSON.parse(raw) } as HomeContent
  } catch {
    return DEFAULT_HOME_CONTENT
  }
}

export async function buildAdminBackupAsync(): Promise<AdminBackup> {
  if (ADMIN_PREVIEW || typeof window === 'undefined') {
    return buildAdminBackup()
  }
  try {
    const data = await adminFetchProducts()
    return {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      homeContent: readHomeContentSafe(),
      products: data.products,
      clients: readStoredClients(),
      orders: readStoredOrders(),
      contacts: readStoredContacts(),
    }
  } catch {
    return buildAdminBackup()
  }
}

export function downloadAdminBackup(backup: AdminBackup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const date = backup.exportedAt.slice(0, 10)
  anchor.href = url
  anchor.download = `korovushkino-backup-${date}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function parseAdminBackup(raw: string): AdminBackup {
  const data = JSON.parse(raw) as AdminBackup
  if (!data || data.version !== BACKUP_VERSION) {
    throw new Error('Неподдерживаемый формат файла резервной копии')
  }
  if (!data.homeContent || !Array.isArray(data.products)) {
    throw new Error('Файл резервной копии повреждён')
  }
  return data
}

export async function restoreAdminBackup(backup: AdminBackup) {
  writeHomeContent(backup.homeContent)
  writePreviewProducts(backup.products)
  writeStoredClients(backup.clients ?? [])
  writeStoredOrders(backup.orders ?? [])
  writeStoredContacts(backup.contacts ?? [])

  if (!ADMIN_PREVIEW) {
    for (const product of backup.products) {
      const payload = product as Partial<ProductData> & Record<string, unknown>
      try {
        await adminUpdateProduct(product.id, payload)
      } catch {
        await adminCreateProduct(payload)
      }
    }
  }
}
