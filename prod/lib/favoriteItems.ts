import { productsData } from '@/lib/api/productsData'
import type { BasketItemContent } from '@/lib/pagesContent'
import { DEFAULT_PAGES_CONTENT, readPagesContent } from '@/lib/pagesContent'
import { productPublicPath } from '@/lib/productSeo'

const PLACEHOLDER_IMG = '/images/home/hero-bg.png'

export type FavoriteItem = {
  id: string
  name: string
  series: string
  price: number
  image: string
  href: string
  kind: 'catalog' | 'basket'
}

export function getFavoriteItemName(
  id: string,
  baskets: BasketItemContent[] = DEFAULT_PAGES_CONTENT.baskets.items,
): string | null {
  const product = productsData[id]
  if (product) return product.name

  const basket = baskets.find((item) => item.id === id)
  if (basket) return basket.title

  return null
}

export function resolveFavoriteItems(
  favoriteIds: string[],
  baskets: BasketItemContent[] = DEFAULT_PAGES_CONTENT.baskets.items,
): FavoriteItem[] {
  const items: FavoriteItem[] = []

  for (const id of favoriteIds) {
    const product = productsData[id]
    if (product) {
      items.push({
        id: product.id,
        name: product.name,
        series: product.series,
        price: product.price,
        image: product.images[0] ?? PLACEHOLDER_IMG,
        href: productPublicPath(product),
        kind: 'catalog',
      })
      continue
    }

    const basket = baskets.find((item) => item.id === id)
    if (basket) {
      items.push({
        id: basket.id,
        name: basket.title,
        series: '1 шт',
        price: basket.price,
        image: basket.image || PLACEHOLDER_IMG,
        href: '/baskets',
        kind: 'basket',
      })
    }
  }

  return items
}

export function getFavoriteItemNameFromStorage(id: string): string | null {
  if (typeof window === 'undefined') return getFavoriteItemName(id)
  return getFavoriteItemName(id, readPagesContent().baskets.items)
}
