'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AccountSectionCard from '@/app/account/components/AccountSectionCard'
import AdminProductForm from '@/app/admin/components/AdminProductForm'
import { adminDeleteProduct, adminFetchProduct, adminUpdateProduct } from '@/lib/api/adminProductsApi'
import {
  ADMIN_PREVIEW,
  buildPreviewProduct,
  getPreviewProduct,
} from '@/lib/adminPreview'
import type { ProductData } from '@/lib/api/productsData'
import { useToast } from '@/contexts/ToastContext'

export default function AdminEditProductContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')?.trim() ?? ''
  const { showToast } = useToast()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!productId) {
      setLoading(false)
      setError('Не указан ID товара')
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      if (ADMIN_PREVIEW) {
        const previewProduct = getPreviewProduct(productId)
        if (!cancelled) {
          if (previewProduct) setProduct(previewProduct)
          else setError('Товар не найден')
        }
        if (!cancelled) setLoading(false)
        return
      }
      try {
        const data = await adminFetchProduct(productId)
        if (!cancelled) setProduct(data.product)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Товар не найден')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [productId])

  if (!productId) {
    return (
      <AccountSectionCard title="Редактирование товара">
        <p className="text-sm text-red-600">Не указан ID товара</p>
        <Link href="/admin/catalog" className="mt-4 inline-block text-sm text-[#3D8C13] hover:underline">
          Вернуться к каталогу
        </Link>
      </AccountSectionCard>
    )
  }

  if (loading) {
    return (
      <AccountSectionCard title="Редактирование товара">
        <p className="text-sm text-[#707070]">Загрузка...</p>
      </AccountSectionCard>
    )
  }

  if (error || !product) {
    return (
      <AccountSectionCard title="Редактирование товара">
        <p className="text-sm text-red-600">{error || 'Товар не найден'}</p>
        <Link href="/admin/catalog" className="mt-4 inline-block text-sm text-[#3D8C13] hover:underline">
          Вернуться к каталогу
        </Link>
      </AccountSectionCard>
    )
  }

  return (
    <AccountSectionCard title={`Редактирование: ${product.name}`}>
      <AdminProductForm
        initialProduct={product}
        isEdit
        onSubmit={async (payload) => {
          if (ADMIN_PREVIEW) {
            setProduct(buildPreviewProduct(payload, product.id))
            showToast('Изменения не сохранены — режим preview')
            return
          }
          const { product: updated } = await adminUpdateProduct(product.id, payload)
          setProduct(updated)
          showToast('Изменения сохранены')
        }}
        onDelete={async () => {
          if (ADMIN_PREVIEW) {
            showToast('Удаление недоступно в preview')
            router.push('/admin/catalog')
            return
          }
          await adminDeleteProduct(product.id)
          showToast('Товар удалён')
          router.push('/admin/catalog')
        }}
      />
    </AccountSectionCard>
  )
}
