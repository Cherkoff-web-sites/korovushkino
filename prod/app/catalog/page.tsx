import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getCatalogProducts } from '@/lib/api/productsData'
import CatalogPageContent from './CatalogPageContent'
import CatalogGridSkeleton from './components/CatalogGridSkeleton'

export const metadata: Metadata = {
  title: 'Каталог | Коровушкино',
  description: 'Натуральные товары с фермы Коровушкино: молоко, мясо, сыры и другое.',
}

function CatalogFallback() {
  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="container">
        <div className="skeleton-pulse mb-4 h-9 w-64 max-w-full rounded-lg bg-[#E8E0D4]" />
        <div className="mb-8 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-pulse h-9 w-24 rounded-full bg-[#E8E0D4]" />
          ))}
        </div>
        <CatalogGridSkeleton count={6} />
      </div>
    </section>
  )
}

export default function CatalogPage() {
  const allProducts = getCatalogProducts()

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />
      <Suspense fallback={<CatalogFallback />}>
        <CatalogPageContent allProducts={allProducts} />
      </Suspense>
    </div>
  )
}
