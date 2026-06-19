/** URL страницы товара (с trailing slash под static export). */
export function productPageHref(productIdOrSlug: string) {
  const slug = String(productIdOrSlug || '').trim().replace(/^\/+|\/+$/g, '')
  return `/catalog/${slug}/`
}

export function productReviewsHref(productId: string) {
  return `/catalog/${productId}/reviews/`
}
