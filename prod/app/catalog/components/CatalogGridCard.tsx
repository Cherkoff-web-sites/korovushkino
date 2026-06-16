'use client'

import Image from 'next/image'
import Link from 'next/link'
import FavoriteHeartButton from '@/components/FavoriteHeartButton'
import { useCart } from '@/contexts/CartContext'
import { productPageHref } from '@/lib/catalogPaths'
import type { ProductData } from '@/lib/api/productsData'

const cartIcon = '/images/header/icon-cart.svg'

function GoldStars() {
  return (
    <div className="flex gap-0.5 text-[#D4A017]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[15px] leading-none sm:text-base">
          ★
        </span>
      ))}
    </div>
  )
}

export default function CatalogGridCard({
  product,
  onOpen,
}: {
  product: ProductData
  onOpen: (product: ProductData) => void
}) {
  const { addItem } = useCart()
  const cardText = product.catalogCardTeaser ?? product.description
  const productHref = productPageHref(product.id)

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      model: product.series,
      price: product.price,
      image: product.images[0] ?? '/images/home/hero-bg.png',
      href: productHref,
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onOpen(product)
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#D1C4B2] bg-[#FFF9F0] shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={productHref}
        className="absolute inset-0 z-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8C13] focus-visible:ring-inset"
        aria-label={`Перейти к товару: ${product.name}`}
      />

      <div className="relative z-[1] aspect-[4/3] w-full shrink-0 bg-[#F5F0E8] pointer-events-none">
        <Image
          src={product.images[0] ?? '/images/home/hero-bg.png'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <FavoriteHeartButton
          productId={product.id}
          iconSize={18}
          className="pointer-events-auto absolute right-3 top-3 z-[2] h-9 w-9 shadow-sm"
        />
      </div>

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col bg-[#FFF9F0] px-[15px] pb-4 pt-[15px] pointer-events-none">
        <div className="block min-h-0 flex-1">
          <h2 className="line-clamp-2 text-base font-bold leading-snug text-black transition-colors group-hover:text-[#3D8C13] sm:text-[17px]">
            {product.name}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#707070]">{cardText}</p>
          <p className="mt-3 text-lg font-bold leading-none text-black sm:text-xl">
            {product.price}₽
            <span className="text-sm font-normal text-[#707070] sm:text-[15px]">/{product.series}</span>
          </p>
        </div>
        <div className="relative z-[2] mt-auto flex items-end justify-between gap-3 pt-4">
          <GoldStars />
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickView}
              className="flex h-10 shrink-0 items-center justify-center rounded-lg border border-[#B8B8B8] bg-white px-3 text-xs font-medium text-[#232326] shadow-sm transition-colors hover:border-[#3D8C13] hover:bg-[#f6fff0] sm:text-sm"
              aria-label={`Быстрый просмотр: ${product.name}`}
            >
              Быстрый просмотр
            </button>
            <button
              type="button"
              onClick={handleCart}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#B8B8B8] bg-white text-[#1a3d0f] shadow-sm transition-colors hover:border-[#3D8C13] hover:bg-[#f6fff0]"
              aria-label="В корзину"
            >
              <Image src={cartIcon} alt="" width={22} height={22} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
