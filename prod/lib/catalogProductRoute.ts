/** Сегмент URL для fallback-страницы товара (static export + rewrite на хостинге). */
export const CATALOG_PRODUCT_FALLBACK_SLUG = '__product__'

export function extractCatalogProductSlug(pathname: string): string {
  const match = String(pathname || '')
    .replace(/\/+$/, '')
    .match(/\/catalog\/([^/]+)(?:\/reviews)?$/)
  const slug = match?.[1]?.trim() ?? ''
  if (!slug || slug === CATALOG_PRODUCT_FALLBACK_SLUG) return ''
  return slug
}

export function collectProductStaticSlugs(
  products: Array<{ id: string; urlSlug?: string }>,
  getSlug: (product: { id: string; urlSlug?: string }) => string
): string[] {
  const slugs = new Set<string>([CATALOG_PRODUCT_FALLBACK_SLUG])
  for (const product of products) {
    slugs.add(product.id)
    slugs.add(getSlug(product))
  }
  return Array.from(slugs).filter(Boolean)
}
