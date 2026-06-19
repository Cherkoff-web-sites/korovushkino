import type { ProductData } from '@/lib/api/productsData'
import { productPageHref } from '@/lib/catalogPaths'

export function productUrlSlug(product: Pick<ProductData, 'id' | 'urlSlug'>) {
  const slug = String(product.urlSlug || product.id || '').trim()
  return slug || product.id
}

export function productPublicPath(product: Pick<ProductData, 'id' | 'urlSlug'>) {
  return productPageHref(productUrlSlug(product))
}

export function productMetaTitle(product: ProductData, siteName = 'Коровушкино') {
  const custom = product.seo?.title?.trim()
  if (custom) return custom
  return `${product.name} | ${siteName}`
}

export function productMetaDescription(product: ProductData) {
  return (
    product.seo?.description?.trim() ||
    product.briefDescription?.trim() ||
    product.description?.trim() ||
    ''
  )
}

export function productMetaKeywords(product: ProductData) {
  return product.seo?.keywords?.trim() || undefined
}
