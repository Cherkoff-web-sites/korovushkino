'use client'

import Image from 'next/image'
import FavoriteHeartButton from '@/components/FavoriteHeartButton'
import { useCart } from '@/contexts/CartContext'
import type { ProductData } from '@/lib/api/productsData'

const cartIcon = '/images/header/icon-cart.svg'
const CATALOG_HREF = '/catalog'

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

  const handleOpen = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement
    if (t.closest('button')) return
    onOpen(product)
  }

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      model: product.series,
      price: product.price,
      image: product.images[0] ?? '/images/home/hero-bg.png',
      href: CATALOG_HREF,
    })
  }

  return (
    <article
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(product)
        }
      }}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[#D1C4B2] bg-[#FFF9F0] shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8C13] focus-visible:ring-offset-2"
      aria-label={`${product.name} — открыть карточку`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 bg-[#F5F0E8]">
        <div className="absolute inset-0 z-0">
          <Image
            src={product.images[0] ?? '/images/home/hero-bg.png'}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <FavoriteHeartButton
          productId={product.id}
          iconSize={18}
          className="absolute right-3 top-3 z-10 h-9 w-9 shadow-sm"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[#FFF9F0] px-[15px] pb-4 pt-[15px]">
        <div className="block min-h-0 flex-1">
          <h2 className="line-clamp-2 text-base font-bold leading-snug text-black sm:text-[17px]">{product.name}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#707070]">{cardText}</p>
          <p className="mt-3 text-lg font-bold leading-none text-black sm:text-xl">
            {product.price}₽
            <span className="text-sm font-normal text-[#707070] sm:text-[15px]">/{product.series}</span>
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <GoldStars />
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
    </article>
  )
}
