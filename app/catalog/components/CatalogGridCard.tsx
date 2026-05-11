'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import type { ProductData } from '@/lib/api/productsData'

const favoritesIcon = '/images/header/icon-favorites.svg'
const cartIcon = '/images/header/icon-cart.svg'

function GoldStars() {
  return (
    <div className="flex gap-0.5 text-[#C88C39]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-base leading-none">
          ★
        </span>
      ))}
    </div>
  )
}

export default function CatalogGridCard({ product }: { product: ProductData }) {
  const { addItem } = useCart()
  const href = `/catalog/${product.id}`

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
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#C88C39] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full shrink-0 bg-[#E8E4DC]">
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
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DECF] bg-white shadow-sm transition-colors hover:border-[#C88C39]"
          aria-label="В избранное"
        >
          <Image src={favoritesIcon} alt="" width={18} height={18} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[#FFF6E7] p-4 sm:p-5">
        <Link href={href} className="block min-h-0 flex-1">
          <h2 className="text-base font-bold leading-snug text-[#1F1F1F] sm:text-lg">{product.name}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#232326]/70">{product.description}</p>
          <p className="mt-3 text-base font-bold text-[#1F1F1F] sm:text-lg">
            {product.price}₽<span className="font-normal text-[#232326]/65">/{product.series}</span>
          </p>
        </Link>
        <div className="mt-4 flex items-center justify-between gap-2">
          <GoldStars />
          <button
            type="button"
            onClick={handleCart}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D0D0D0] bg-white text-[#3D8C13] shadow-sm transition-colors hover:border-[#3D8C13] hover:bg-[#f6fff0]"
            aria-label="В корзину"
          >
            <Image src={cartIcon} alt="" width={22} height={22} />
          </button>
        </div>
      </div>
    </article>
  )
}
