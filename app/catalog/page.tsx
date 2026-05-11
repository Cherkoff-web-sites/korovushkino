import type { Metadata } from 'next'
import Link from 'next/link'
import { getCatalogProducts } from '@/lib/api/productsData'
import CatalogGridCard from './components/CatalogGridCard'

export const metadata: Metadata = {
  title: 'Каталог | Коровушкино',
  description: 'Молочная продукция и натуральные товары с фермы Коровушкино.',
}

export default function CatalogPage() {
  const products = getCatalogProducts()

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />

      <section className="py-6 sm:py-8 lg:py-10">
        <div className="container">
          <nav className="mb-6 text-sm text-[#232326]/55 sm:text-base" aria-label="Навигация">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/catalog" className="text-[#232326]/55 transition-colors hover:text-[#232326]">
                  Каталог
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li className="text-[#232326]/55">Молочная продукция</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6">
            {products.map((product) => (
              <CatalogGridCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
