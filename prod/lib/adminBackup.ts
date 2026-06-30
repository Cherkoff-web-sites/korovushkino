import type { ProductData } from '@/lib/api/productsData'
import { DEFAULT_HOME_CONTENT, type HomeContent, readHomeContent, writeHomeContent } from '@/lib/homeContent'
import { DEFAULT_SITE_CONTENT, type SiteContent, readSiteContent, writeSiteContent } from '@/lib/siteContent'
import {
  readStoredClients,
  readStoredContacts,
  readStoredNewsletterSubscribers,
  readStoredOrders,
  writeStoredClients,
  writeStoredContacts,
  writeStoredNewsletterSubscribers,
  writeStoredOrders,
  type StoredClient,
  type StoredContactLead,
  type StoredNewsletterSubscriber,
  type StoredOrder,
} from '@/lib/adminDataStore'
import { readPreviewProducts, writePreviewProducts } from '@/lib/previewProductsStore'
import { ADMIN_PREVIEW } from '@/lib/adminPreview'
import { adminCreateProduct, adminFetchProducts, adminUpdateProduct } from '@/lib/api/adminProductsApi'
import {
  adminFetchDeliverySettings,
  adminFetchNewsletterSubscribers,
  adminFetchOrders,
} from '@/lib/api/adminSiteApi'
import {
  DEFAULT_DELIVERY_SETTINGS,
  type DeliverySettings,
  readDeliverySettings,
  writeDeliverySettings,
} from '@/lib/deliverySettings'

export const BACKUP_VERSION = 3 as const

export type AdminBackup = {
  version: typeof BACKUP_VERSION
  exportedAt: string
  homeContent: HomeContent
  siteContent: SiteContent
  deliverySettings: DeliverySettings
  products: ProductData[]
  clients: StoredClient[]
  orders: StoredOrder[]
  contacts: StoredContactLead[]
  newsletter: StoredNewsletterSubscriber[]
}

function readSiteContentSafe(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT
  return readSiteContent()
}

export function buildAdminBackup(): AdminBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    homeContent: readHomeContentSafe(),
    siteContent: readSiteContentSafe(),
    deliverySettings: readDeliverySettingsSafe(),
    products: readPreviewProducts(),
    clients: readStoredClients(),
    orders: readStoredOrders(),
    contacts: readStoredContacts(),
    newsletter: readStoredNewsletterSubscribers(),
  }
}

function readDeliverySettingsSafe(): DeliverySettings {
  if (typeof window === 'undefined') return DEFAULT_DELIVERY_SETTINGS
  return readDeliverySettings()
}

function readHomeContentSafe(): HomeContent {
  if (typeof window === 'undefined') return DEFAULT_HOME_CONTENT
  return readHomeContent()
}

export async function buildAdminBackupAsync(): Promise<AdminBackup> {
  if (ADMIN_PREVIEW || typeof window === 'undefined') {
    return buildAdminBackup()
  }
  try {
    const [productsData, ordersData, newsletterData, deliveryData] = await Promise.all([
      adminFetchProducts(),
      adminFetchOrders(),
      adminFetchNewsletterSubscribers(),
      adminFetchDeliverySettings(),
    ])
    return {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      homeContent: readHomeContentSafe(),
      siteContent: readSiteContentSafe(),
      deliverySettings: deliveryData.settings,
      products: productsData.products,
      clients: readStoredClients(),
      orders: ordersData.orders,
      contacts: readStoredContacts(),
      newsletter: newsletterData.subscribers,
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
  const data = JSON.parse(raw) as {
    version?: number
    exportedAt?: string
    homeContent?: HomeContent
    siteContent?: SiteContent
    products?: ProductData[]
    clients?: StoredClient[]
    orders?: StoredOrder[]
    contacts?: StoredContactLead[]
    newsletter?: StoredNewsletterSubscriber[]
    deliverySettings?: DeliverySettings
  }
  const version = data.version ?? 0
  if (!data || (version !== 1 && version !== 2 && version !== 3)) {
    throw new Error('Неподдерживаемый формат файла резервной копии')
  }
  if (!data.homeContent || !Array.isArray(data.products)) {
    throw new Error('Файл резервной копии повреждён')
  }
  return {
    version: BACKUP_VERSION,
    exportedAt: data.exportedAt ?? new Date().toISOString(),
    homeContent: data.homeContent,
    siteContent: data.siteContent ?? DEFAULT_SITE_CONTENT,
    deliverySettings: data.deliverySettings ?? DEFAULT_DELIVERY_SETTINGS,
    products: data.products,
    clients: data.clients ?? [],
    orders: data.orders ?? [],
    contacts: data.contacts ?? [],
    newsletter: data.newsletter ?? [],
  }
}

export async function restoreAdminBackup(backup: AdminBackup) {
  writeHomeContent(backup.homeContent)
  writeSiteContent(backup.siteContent ?? DEFAULT_SITE_CONTENT)
  writeDeliverySettings(backup.deliverySettings ?? DEFAULT_DELIVERY_SETTINGS)
  writePreviewProducts(backup.products)
  writeStoredClients(backup.clients ?? [])
  writeStoredOrders(backup.orders ?? [])
  writeStoredContacts(backup.contacts ?? [])
  writeStoredNewsletterSubscribers(backup.newsletter ?? [])

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
