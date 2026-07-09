export type SeoRedirect = {
  id: string
  from: string
  to: string
  permanent: boolean
}

export type SeoSettings = {
  siteUrl: string
  robotsTxt: string
  sitemapMode: 'auto' | 'manual'
  sitemapXml: string
  redirects: SeoRedirect[]
}

export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://korovushkino.com/sitemap.xml
`

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteUrl: 'https://korovushkino.com',
  robotsTxt: DEFAULT_ROBOTS_TXT,
  sitemapMode: 'auto',
  sitemapXml: '',
  redirects: [],
}

export function mergeSeoSettings(parsed: Partial<SeoSettings>): SeoSettings {
  return {
    ...DEFAULT_SEO_SETTINGS,
    ...parsed,
    redirects: Array.isArray(parsed.redirects) ? parsed.redirects : [],
  }
}
