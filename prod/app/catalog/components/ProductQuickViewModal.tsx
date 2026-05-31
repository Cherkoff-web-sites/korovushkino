'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FavoriteHeartButton from '@/components/FavoriteHeartButton'
import { useCart } from '@/contexts/CartContext'
import { productPageHref, productReviewsHref } from '@/lib/catalogPaths'
import type { ProductData } from '@/lib/api/productsData'
import { useScrollLock } from '@/lib/useScrollLock'

const cartIcon = '/images/header/icon-cart.svg'
const PLACEHOLDER = '/images/home/hero-bg.png'

export default function ProductQuickViewModal({
  product,
  onClose,
}: {
  product: ProductData | null
  onClose: () => void
}) {
  const { addItem } = useCart()

  useScrollLock(Boolean(product))

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, onClose])

  if (!product) return null

  const mainImage = product.images[0] ?? PLACEHOLDER

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      model: product.series,
      price: product.price,
      image: mainImage,
      href: productPageHref(product.id),
    })
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 sm:p-6"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-quick-view-title"
        className="relative max-h-[90vh] w-full max-w-[920px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-[#232326] transition-colors hover:bg-black/[0.06] sm:right-3 sm:top-3"
          aria-label="Закрыть"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 gap-6 p-5 pt-12 sm:p-8 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:p-10 lg:pt-10">
          <div className="order-2 flex min-w-0 flex-col lg:order-1 lg:col-span-7">
            <h2
              id="product-quick-view-title"
              className="text-2xl font-bold leading-tight text-black sm:text-[28px] lg:text-[30px]"
            >
              {product.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href={productReviewsHref(product.id)}
                onClick={onClose}
                aria-label={`Отзывы о товаре «${product.name}»`}
                className="group inline-flex items-center gap-2 text-sm text-[#9A9A9A] transition-colors hover:text-[#3D8C13]"
              >
                <span className="underline-offset-4 group-hover:underline">Отзывы</span>
                <span className="inline-flex gap-0.5 text-lg leading-none text-[#C8C8C8] transition-colors group-hover:text-[#C88C39]" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={`os-${i}`}>☆</span>
                  ))}
                </span>
              </Link>
              <Link
                href={productPageHref(product.id)}
                onClick={onClose}
                className="text-sm font-medium text-[#3D8C13] underline-offset-2 hover:underline"
              >
                Страница товара
              </Link>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-black sm:text-[15px]">{product.description}</p>

            {product.modalNutrition ? (
              <div className="mt-5 space-y-1 text-sm leading-relaxed text-black sm:text-[15px]">
                <p>
                  <span className="text-[#707070]">На 100 г — </span>
                  {product.modalNutrition.macrosPer100g}
                </p>
                <p className="font-medium">{product.modalNutrition.kcal} ккал</p>
              </div>
            ) : null}

            <div className="mt-6">
              <p className="text-2xl font-bold text-black sm:text-[28px]">
                {product.price.toLocaleString('ru-RU')}₽
                <span className="text-base font-normal text-[#707070] sm:text-lg"> / {product.series}</span>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-stretch gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2.5 rounded-lg bg-[#3D8C13] px-5 text-base font-medium text-white transition-colors hover:bg-[#347710] sm:min-w-[200px] sm:flex-initial sm:px-8"
              >
                <Image
                  src={cartIcon}
                  alt=""
                  width={22}
                  height={22}
                  className="brightness-0 invert"
                />
                В корзину
              </button>
              <FavoriteHeartButton
                productId={product.id}
                iconSize={22}
                className="h-12 w-12 shrink-0"
              />
            </div>
          </div>

          <div className="relative order-1 aspect-[4/3] min-h-[200px] w-full overflow-hidden rounded-xl bg-[#F5F0E8] lg:order-2 lg:col-span-5 lg:aspect-auto lg:min-h-[340px]">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
