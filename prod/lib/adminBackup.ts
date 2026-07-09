import type { ProductData } from '@/lib/api/productsData'
import { DEFAULT_HOME_CONTENT, type HomeContent } from '@/lib/homeContent'
import { DEFAULT_SITE_CONTENT, type SiteContent } from '@/lib/siteContent'
import {
  type StoredClient,
  type StoredContactLead,
  type StoredNewsletterSubscriber,
  type StoredOrder,
} from '@/lib/adminDataStore'
import { adminExportBackup, adminImportBackup, type BackupSection } from '@/lib/api/adminSiteApi'
import {
  DEFAULT_PAGES_CONTENT,
  type PagesContent,
} from '@/lib/pagesContent'
import {
  DEFAULT_DELIVERY_SETTINGS,
  type DeliverySettings,
} from '@/lib/deliverySettings'
import { DEFAULT_SEO_SETTINGS, type SeoSettings } from '@/lib/seoSettings'

export const BACKUP_VERSION = 5 as const

export type AdminBackup = {
  version: typeof BACKUP_VERSION
  exportedAt: string
  homeContent: HomeContent
  siteContent: SiteContent
  pagesContent: PagesContent
  deliverySettings: DeliverySettings
  products: ProductData[]
  clients: StoredClient[]
  orders: StoredOrder[]
  contacts: StoredContactLead[]
  newsletter: StoredNewsletterSubscriber[]
  seo: SeoSettings
}

export async function buildAdminBackupAsync(): Promise<AdminBackup> {
  const data = await adminExportBackup()
  const content = (data.content && typeof data.content === 'object' ? data.content : {}) as {
    home?: HomeContent
    site?: SiteContent
    pages?: PagesContent
  }
  return {
    version: BACKUP_VERSION,
    exportedAt: String(data.exportedAt || new Date().toISOString()),
    homeContent: content.home ?? DEFAULT_HOME_CONTENT,
    siteContent: content.site ?? DEFAULT_SITE_CONTENT,
    pagesContent: content.pages ?? DEFAULT_PAGES_CONTENT,
    deliverySettings: (data.deliverySettings as DeliverySettings | undefined) ?? DEFAULT_DELIVERY_SETTINGS,
    products: Array.isArray(data.products) ? (data.products as ProductData[]) : [],
    clients: Array.isArray(data.clients) ? (data.clients as StoredClient[]) : [],
    orders: Array.isArray(data.orders) ? (data.orders as StoredOrder[]) : [],
    contacts: Array.isArray(data.contacts) ? (data.contacts as StoredContactLead[]) : [],
    newsletter: Array.isArray(data.newsletter) ? (data.newsletter as StoredNewsletterSubscriber[]) : [],
    seo: (data.seo as SeoSettings | undefined) ?? DEFAULT_SEO_SETTINGS,
  }
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function downloadAdminBackup(backup: AdminBackup) {
  const date = backup.exportedAt.slice(0, 10)
  downloadJson(backup, `korovushkino-backup-${date}.json`)
}

export async function downloadBackupSection(section: BackupSection) {
  const data = await adminExportBackup(section)
  const date = new Date().toISOString().slice(0, 10)
  downloadJson(data, `korovushkino-${section}-backup-${date}.json`)
}

export function parseAdminBackup(raw: string): AdminBackup {
  const data = JSON.parse(raw) as {
    version?: number
    exportedAt?: string
    homeContent?: HomeContent
    siteContent?: SiteContent
    pagesContent?: PagesContent
    products?: ProductData[]
    clients?: StoredClient[]
    orders?: StoredOrder[]
    contacts?: StoredContactLead[]
    newsletter?: StoredNewsletterSubscriber[]
    deliverySettings?: DeliverySettings
    seo?: SeoSettings
  }
  const version = data.version ?? 0
  if (!data || (version !== 1 && version !== 2 && version !== 3 && version !== 4 && version !== 5)) {
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
    pagesContent: data.pagesContent ?? DEFAULT_PAGES_CONTENT,
    deliverySettings: data.deliverySettings ?? DEFAULT_DELIVERY_SETTINGS,
    products: data.products,
    clients: data.clients ?? [],
    orders: data.orders ?? [],
    contacts: data.contacts ?? [],
    newsletter: data.newsletter ?? [],
    seo: data.seo ?? DEFAULT_SEO_SETTINGS,
  }
}

export async function restoreAdminBackup(backup: AdminBackup) {
  await adminImportBackup({
    ...backup,
    content: {
      home: backup.homeContent,
      site: backup.siteContent ?? DEFAULT_SITE_CONTENT,
      pages: backup.pagesContent ?? DEFAULT_PAGES_CONTENT,
    },
  })
}

export async function restoreBackupSection(section: BackupSection, data: unknown) {
  await adminImportBackup(data, section)
}
