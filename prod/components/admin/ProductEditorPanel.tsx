'use client'

import Link from 'next/link'
import type { ProductData } from '@/lib/api/productsData'
import AdminProductForm from '@/app/admin/components/AdminProductForm'
import { productPublicPath } from '@/lib/productSeo'
import ProductImagePreview from './ProductImagePreview'
import { adminPanelClass } from './adminStyles'

type ProductEditorPanelProps = {
  product: ProductData | null
  isNew?: boolean
  onClose: () => void
  onSubmit: (payload: Record<string, unknown>) => Promise<void>
  onDelete?: () => Promise<void>
}

export default function ProductEditorPanel({
  product,
  isNew = false,
  onClose,
  onSubmit,
  onDelete,
}: ProductEditorPanelProps) {
  const title = isNew ? 'Новый товар' : product?.name ?? 'Редактор'
  const image = product?.images?.[0] ?? '/images/home/hero-bg.png'

  return (
    <div className="fixed inset-0 z-[230] flex flex-col bg-[#f0f1f4] 2xl:static 2xl:z-auto 2xl:max-h-[calc(100vh-3rem)] 2xl:overflow-y-auto">
      <div className={`${adminPanelClass} sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#e8eaef] px-4 py-3`}>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-[#1F1F1F]">{title}</h2>
          {product && !isNew ? (
            <Link
              href={productPublicPath(product)}
              target="_blank"
              className="text-xs text-[#3D8C13] hover:underline"
            >
              Открыть на сайте
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[#e2e4ea] px-3 py-1.5 text-sm text-[#707070] hover:bg-[#f7f8fa] 2xl:hidden"
        >
          Закрыть
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <ProductImagePreview src={image} alt={product?.name ?? 'Товар'} />
        <div className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h3 className="text-sm font-semibold text-[#1F1F1F]">Карточка товара</h3>
          </div>
          <div className="p-4">
            <AdminProductForm
              key={product?.id ?? 'new'}
              initialProduct={product}
              isEdit={!isNew && Boolean(product)}
              onSubmit={onSubmit}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
