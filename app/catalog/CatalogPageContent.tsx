'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  CATEGORY_LABELS,
  isCategorySlug,
  type CategorySlug,
  type ProductData,
} from '@/lib/api/productsData'
import CatalogGridCard from './components/CatalogGridCard'

const categoryEntries = Object.entries(CATEGORY_LABELS) as [CategorySlug, string][]

export default function CatalogPageContent({ allProducts }: { allProducts: ProductData[] }) {
  const searchParams = useSearchParams()
  const raw = searchParams.get('category')?.trim() ?? ''
  const activeSlug: CategorySlug | null = raw && isCategorySlug(raw) ? raw : null

  const products = useMemo(() => {
    if (!activeSlug) return allProducts
    return allProducts.filter((p) => p.categorySlug === activeSlug)
  }, [allProducts, activeSlug])

  const categoryTitle = activeSlug ? CATEGORY_LABELS[activeSlug] : 'Все категории'

  return (
    <section className="py-6 sm:py-8 lg:py-10">
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
            {activeSlug ? (
              <>
                <li className="text-[#232326]/35" aria-hidden>
                  •
                </li>
                <li className="text-[#232326]/70">{CATEGORY_LABELS[activeSlug]}</li>
              </>
            ) : null}
          </ol>
        </nav>

        <h1 className="mb-4 text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
          {categoryTitle}
        </h1>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/catalog"
            scroll={false}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              !activeSlug
                ? 'border-[#3D8C13] bg-[#3D8C13] text-white'
                : 'border-[#E5DECF] bg-white text-[#232326] hover:border-[#3D8C13]'
            }`}
          >
            Все
          </Link>
          {categoryEntries.map(([slug, label]) => (
            <Link
              key={slug}
              href={`/catalog?category=${slug}`}
              scroll={false}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeSlug === slug
                  ? 'border-[#3D8C13] bg-[#3D8C13] text-white'
                  : 'border-[#E5DECF] bg-white text-[#232326] hover:border-[#3D8C13]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-[#232326]/75 sm:text-[15px]">В этой категории пока нет позиций.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <CatalogGridCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
