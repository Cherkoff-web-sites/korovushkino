/** URL страницы товара (с trailing slash под static export). */
export function productPageHref(productId: string) {
  return `/catalog/${productId}/`
}

export function productReviewsHref(productId: string) {
  return `/catalog/${productId}/reviews/`
}
