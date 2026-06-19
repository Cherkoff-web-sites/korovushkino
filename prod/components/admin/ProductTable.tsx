'use client'

import Image from 'next/image'
import { CATEGORY_LABELS, type ProductData } from '@/lib/api/productsData'
import { productPublicPath } from '@/lib/productSeo'
import { adminPanelClass, adminTableHeadClass } from './adminStyles'

type ProductTableProps = {
  products: ProductData[]
  selectedId: string | null
  onSelect: (product: ProductData) => void
  onDelete: (product: ProductData) => void
}

export default function ProductTable({
  products,
  selectedId,
  onSelect,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className={`${adminPanelClass} px-4 py-10 text-center text-sm text-[#707070]`}>
        Товаров не найдено
      </div>
    )
  }

  return (
    <>
      <div className={`${adminPanelClass} hidden overflow-x-auto md:block`}>
        <table className="min-w-full text-left text-sm">
          <thead className={adminTableHeadClass}>
            <tr>
              <th className="px-4 py-3">Товар</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const selected = selectedId === product.id
              return (
                <tr
                  key={product.id}
                  className={`border-b border-[#eef0f4] last:border-b-0 ${
                    selected ? 'bg-[#3D8C13]/5' : 'hover:bg-[#fafbfc]'
                  }`}
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSelect(product)}
                      className="flex items-center gap-3 text-left"
                    >
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#e8eaef] bg-[#f7f8fa]">
                        <Image
                          src={product.images[0] ?? '/images/home/hero-bg.png'}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-[#1F1F1F]">{product.name}</div>
                        <div className="text-xs text-[#707070]">{product.series}</div>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[#232326]/80">
                    {CATEGORY_LABELS[product.categorySlug]}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#707070]">
                    {productPublicPath(product)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onSelect(product)}
                        className="rounded-lg border border-[#e2e4ea] px-3 py-1.5 text-sm hover:bg-[#f7f8fa]"
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {products.map((product) => (
          <li key={product.id} className={`${adminPanelClass} p-4`}>
            <button type="button" onClick={() => onSelect(product)} className="flex w-full gap-3 text-left">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#e8eaef]">
                <Image
                  src={product.images[0] ?? '/images/home/hero-bg.png'}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#1F1F1F]">{product.name}</p>
                <p className="text-xs text-[#707070]">{productPublicPath(product)}</p>
                <p className="mt-1 text-sm text-[#3D8C13]">
                  {product.price.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
