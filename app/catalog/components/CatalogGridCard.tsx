'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import type { ProductData } from '@/lib/api/productsData'

const favoritesIcon = '/images/header/icon-favorites.svg'
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

export default function CatalogGridCard({ product }: { product: ProductData }) {
  const { addItem } = useCart()
  const href = `/catalog/${product.id}`
  const cardText = product.catalogCardTeaser ?? product.description

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      model: product.series,
      price: product.price,
      image: product.images[0] ?? '/images/home/hero-bg.png',
      href,
    })
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#D1C4B2] bg-[#FFF9F0] shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full shrink-0 bg-[#F5F0E8]">
        <Link href={href} className="absolute inset-0 z-0 block">
          <Image
            src={product.images[0] ?? '/images/home/hero-bg.png'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <button
          type="button"
          onClick={handleFavorite}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E0D4] bg-white shadow-sm transition-colors hover:border-[#D1C4B2]"
          aria-label="В избранное"
        >
          <Image src={favoritesIcon} alt="" width={18} height={18} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[#FFF9F0] px-[15px] pb-4 pt-[15px]">
        <Link href={href} className="block min-h-0 flex-1">
          <h2 className="line-clamp-2 text-base font-bold leading-snug text-black sm:text-[17px]">{product.name}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#707070]">{cardText}</p>
          <p className="mt-3 text-lg font-bold leading-none text-black sm:text-xl">
            {product.price}₽
            <span className="text-sm font-normal text-[#707070] sm:text-[15px]">/{product.series}</span>
          </p>
        </Link>
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
