'use client'

import Image from 'next/image'
import { CATEGORY_LABELS, type ProductData } from '@/lib/api/productsData'
import { productPublicPath } from '@/lib/productSeo'
import { adminPanelClass } from './adminStyles'

type ProductGridProps = {
  products: ProductData[]
  selectedId: string | null
  onSelect: (product: ProductData) => void
}

export default function ProductGrid({ products, selectedId, onSelect }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={`${adminPanelClass} px-4 py-10 text-center text-sm text-[#707070]`}>
        Товаров не найдено
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
      {products.map((product) => {
        const selected = selectedId === product.id
        return (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelect(product)}
            className={`${adminPanelClass} overflow-hidden text-left transition-shadow hover:shadow-md ${
              selected ? 'ring-2 ring-[#3D8C13]' : ''
            }`}
          >
            <div className="relative aspect-[4/3] w-full bg-[#f7f8fa]">
              <Image
                src={product.images[0] ?? '/images/home/hero-bg.png'}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
              />
            </div>
            <div className="space-y-1 p-4">
              <p className="font-medium text-[#1F1F1F]">{product.name}</p>
              <p className="text-xs text-[#707070]">{CATEGORY_LABELS[product.categorySlug]}</p>
              <p className="font-mono text-[11px] text-[#707070]">{productPublicPath(product)}</p>
              <p className="text-sm font-semibold text-[#3D8C13]">
                {product.price.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
