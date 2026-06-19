'use client'

import Image from 'next/image'
import FavoriteHeartButton from '@/components/FavoriteHeartButton'
import { useCart } from '@/contexts/CartContext'
import { productPublicPath } from '@/lib/productSeo'
import type { ProductData } from '@/lib/api/productsData'

const cartIcon = '/images/header/icon-cart.svg'

export default function ProductPageActions({ product }: { product: ProductData }) {
  const { addItem } = useCart()
  const mainImage = product.images[0] ?? '/images/home/hero-bg.png'

  return (
    <div className="mt-6 flex flex-wrap items-stretch gap-3">
      <button
        type="button"
        onClick={() =>
          addItem({
            id: product.id,
            name: product.name,
            model: product.series,
            price: product.price,
            image: mainImage,
            href: productPublicPath(product),
          })
        }
        className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2.5 rounded-lg bg-[#3D8C13] px-5 text-base font-medium text-white transition-colors hover:bg-[#347710] sm:min-w-[200px] sm:flex-initial sm:px-8"
      >
        <Image src={cartIcon} alt="" width={22} height={22} className="brightness-0 invert" />
        В корзину
      </button>
      <FavoriteHeartButton productId={product.id} iconSize={22} className="h-12 w-12 shrink-0" />
    </div>
  )
}
