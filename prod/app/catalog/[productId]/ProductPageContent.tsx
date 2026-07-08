'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ProductData } from '@/lib/api/productsData'
import { CATEGORY_LABELS } from '@/lib/api/productsData'
import { fetchCatalogProduct } from '@/lib/api/productsClient'
import { productReviewsHref } from '@/lib/catalogPaths'
import ProductPageActions from '../components/ProductPageActions'
import { ProductDescription } from '../components/ProductDescription'
import ProductSeoHead from '../components/ProductSeoHead'
import ContentImage from '@/components/ui/ContentImage'
import { readHomeContent } from '@/lib/homeContent'
import { averageReviewRating, formatStarString } from '@/lib/reviewRating'

const PLACEHOLDER = '/images/home/hero-bg.png'

function productImageAlt(product: ProductData, index = 0) {
  return product.imageAlts?.[index]?.trim() || product.name
}

export default function ProductPageContent({
  productId,
  fallbackProduct,
}: {
  productId: string
  fallbackProduct: ProductData
}) {
  const [product, setProduct] = useState<ProductData>(fallbackProduct)

  useEffect(() => {
    let cancelled = false

    fetchCatalogProduct(productId)
      .then((next) => {
        if (!cancelled && next) setProduct(next)
      })
      .catch(() => {
        // оставляем fallback
      })

    const onUpdate = () => {
      const next = fetchCatalogProduct(productId)
      void next.then((item) => {
        if (item) setProduct(item)
      })
    }

    window.addEventListener('preview-products-updated', onUpdate)
    return () => {
      cancelled = true
      window.removeEventListener('preview-products-updated', onUpdate)
    }
  }, [productId])

  const mainImage = product.images[0] ?? PLACEHOLDER
  const categoryHref = `/catalog?category=${product.categorySlug}`
  const categoryLabel = CATEGORY_LABELS[product.categorySlug]
  const homeReviews = readHomeContent().reviews.items
  const productReviews = homeReviews.filter(
    (item) => item.productLabel.toLowerCase() === product.name.toLowerCase()
  )
  const avgRating = averageReviewRating(productReviews.length ? productReviews : homeReviews)

  return (
    <div>
      <ProductSeoHead product={product} />
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />

      <section className="py-6 sm:py-8">
        <div className="container">
          <nav className="mb-4 text-sm text-[#232326]/55 sm:text-[15px]" aria-label="Навигация">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-[#232326]">
                  Главная
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href="/catalog" className="transition-colors hover:text-[#232326]">
                  Каталог
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href={categoryHref} className="transition-colors hover:text-[#232326]">
                  {categoryLabel}
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li className="text-[#232326]/70">{product.name}</li>
            </ol>
          </nav>

          <h1 className="text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
            {product.name}
          </h1>
        </div>
      </section>

      <section className="pb-8 sm:pb-10 lg:pb-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="relative aspect-[4/3] min-h-[240px] w-full overflow-hidden rounded-xl bg-[#F5F0E8] lg:col-span-5 lg:aspect-auto lg:min-h-[420px]">
              <ContentImage
                src={mainImage}
                alt={productImageAlt(product, 0)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
            </div>

            <div className="min-w-0 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={productReviewsHref(product.id)}
                  className="group inline-flex items-center gap-2 text-sm text-[#9A9A9A] transition-colors hover:text-[#3D8C13]"
                >
                  <span className="underline-offset-4 group-hover:underline">Отзывы</span>
                  <span
                    className="inline-flex gap-0.5 text-lg leading-none text-[#C8C8C8] transition-colors group-hover:text-[#C88C39]"
                    aria-hidden
                  >
                    {formatStarString(avgRating)}
                  </span>
                </Link>
              </div>

              {product.briefDescription ? (
                <p className="mt-4 text-base font-medium leading-relaxed text-[#232326] sm:text-lg">
                  {product.briefDescription}
                </p>
              ) : null}

              <ProductDescription description={product.description} blocks={product.descriptionBlocks} />

              {product.modalNutrition ? (
                <div className="mt-5 space-y-1 text-sm leading-relaxed text-black sm:text-[15px]">
                  <p>
                    <span className="text-[#707070]">На 100 г — </span>
                    {product.modalNutrition.macrosPer100g}
                  </p>
                  <p className="font-medium">{product.modalNutrition.kcal} ккал</p>
                </div>
              ) : null}

              {product.advantages && product.advantages.length > 0 ? (
                <ul className="mt-6 space-y-2 text-sm text-[#232326] sm:text-[15px]">
                  {product.advantages.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#3D8C13]" aria-hidden>
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-6">
                <p className="text-2xl font-bold text-black sm:text-[28px]">
                  {product.price.toLocaleString('ru-RU')}₽
                  <span className="text-base font-normal text-[#707070] sm:text-lg"> / {product.series}</span>
                </p>
              </div>

              <ProductPageActions product={product} />

              <Link
                href="/catalog"
                className="mt-8 inline-block text-sm font-medium text-[#3D8C13] underline-offset-2 hover:underline"
              >
                ← Вернуться в каталог
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
