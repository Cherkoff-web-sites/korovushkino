'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AccountSectionCard from '@/app/account/components/AccountSectionCard'
import Button from '@/components/ui/Button'
import { adminDeleteProduct, adminFetchProducts } from '@/lib/api/adminProductsApi'
import { ADMIN_PREVIEW, getPreviewProducts } from '@/lib/adminPreview'
import { CATEGORY_LABELS, type ProductData } from '@/lib/api/productsData'
import { useToast } from '@/contexts/ToastContext'

export default function AdminCatalogPage() {
  const { showToast } = useToast()
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProducts() {
    setLoading(true)
    setError('')
    if (ADMIN_PREVIEW) {
      setProducts(getPreviewProducts())
      setLoading(false)
      return
    }
    try {
      const data = await adminFetchProducts()
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить каталог')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  async function handleDelete(product: ProductData) {
    if (!window.confirm(`Удалить «${product.name}»?`)) return
    if (ADMIN_PREVIEW) {
      setProducts((prev) => prev.filter((item) => item.id !== product.id))
      showToast('Товар удалён (только в preview, после перезагрузки вернётся)')
      return
    }
    try {
      await adminDeleteProduct(product.id)
      setProducts((prev) => prev.filter((item) => item.id !== product.id))
      showToast('Товар удалён')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось удалить товар')
    }
  }

  return (
    <AccountSectionCard title="Каталог товаров">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#707070]">
          Редактируйте позиции каталога: цены, описания, категории и изображения.
        </p>
        <Link href="/admin/catalog/new">
          <Button>Добавить товар</Button>
        </Link>
      </div>

      {loading ? <p className="text-sm text-[#707070]">Загрузка каталога...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-x-auto rounded-xl border border-[#D2B48C]/60 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E5DECF] bg-[#FFF8ED] text-[#707070]">
              <tr>
                <th className="px-4 py-3 font-medium">Товар</th>
                <th className="px-4 py-3 font-medium">Категория</th>
                <th className="px-4 py-3 font-medium">Цена</th>
                <th className="px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#E5DECF]/70 last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1F1F1F]">{product.name}</div>
                    <div className="text-xs text-[#707070]">{product.id}</div>
                  </td>
                  <td className="px-4 py-3 text-[#232326]/80">
                    {CATEGORY_LABELS[product.categorySlug]}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.price.toLocaleString('ru-RU')}₽ / {product.series}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/catalog/edit?id=${encodeURIComponent(product.id)}`}
                        className="rounded-lg border border-[#D2B48C] px-3 py-1.5 text-sm transition-colors hover:bg-[#FFF8ED]"
                      >
                        Редактировать
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(product)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 transition-colors hover:bg-red-50"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AccountSectionCard>
  )
}
