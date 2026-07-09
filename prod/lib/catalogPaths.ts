import { productUrlSlug } from '@/lib/productSeo'

/** URL страницы товара (с trailing slash под static export). */
export function productPageHref(productIdOrSlug: string) {
  const slug = String(productIdOrSlug || '').trim().replace(/^\/+|\/+$/g, '')
  return `/catalog/${slug}/`
}

export function productReviewsHref(product: { id: string; urlSlug?: string }) {
  return `/catalog/${productUrlSlug(product)}/reviews/`
}
