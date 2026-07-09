import { request } from '@/lib/api/httpClient'
import type { SeoSettings } from '@/lib/seoSettings'

export async function adminFetchSeoSettings() {
  return request<{ settings: SeoSettings }>('/api/admin/seo')
}

export async function adminSaveSeoSettings(settings: SeoSettings) {
  return request<{ settings: SeoSettings }>('/api/admin/seo', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  })
}

export async function adminRegenerateSitemap() {
  return request<{ settings: SeoSettings; sitemapXml: string }>('/api/admin/seo/regenerate-sitemap', {
    method: 'POST',
  })
}
