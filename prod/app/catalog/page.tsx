import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getCatalogProducts } from '@/lib/api/productsData'
import CatalogPageContent from './CatalogPageContent'

export const metadata: Metadata = {
  title: 'Каталог | Коровушкино',
  description: 'Натуральные товары с фермы Коровушкино: молоко, мясо, сыры и другое.',
}

function CatalogFallback() {
  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="container">
        <p className="text-sm text-[#232326]/60 sm:text-[15px]">Загрузка каталога…</p>
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
