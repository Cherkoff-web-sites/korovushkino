import type { CategorySlug, ProductData } from '@/lib/api/productsData'

export function filterAdminProducts(
  products: ProductData[],
  options: {
    categorySlug?: CategorySlug | 'all'
    query?: string
  },
) {
  const query = options.query?.trim().toLowerCase() ?? ''
  const category = options.categorySlug ?? 'all'

  return products.filter((product) => {
    if (category !== 'all' && product.categorySlug !== category) return false
    if (!query) return true
    const haystack = [
      product.name,
      product.id,
      product.urlSlug,
      product.series,
      product.seo?.title,
      product.seo?.keywords,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })
}
