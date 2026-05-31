'use client'

import { useRouter } from 'next/navigation'
import AccountSectionCard from '@/app/account/components/AccountSectionCard'
import AdminProductForm from '@/app/admin/components/AdminProductForm'
import { adminCreateProduct, adminSuggestProductId } from '@/lib/api/adminProductsApi'
import {
  ADMIN_PREVIEW,
  buildPreviewProduct,
  suggestPreviewProductId,
} from '@/lib/adminPreview'
import { useToast } from '@/contexts/ToastContext'

export default function AdminNewProductPage() {
  const router = useRouter()
  const { showToast } = useToast()

  return (
    <AccountSectionCard title="Новый товар">
      <AdminProductForm
        onSubmit={async (payload) => {
          let id = String(payload.id || '').trim()
          if (!id) {
            id = ADMIN_PREVIEW
              ? suggestPreviewProductId(String(payload.name))
              : (await adminSuggestProductId(String(payload.name))).id
          }
          if (ADMIN_PREVIEW) {
            const product = buildPreviewProduct({ ...payload, id })
            showToast('Товар создан (только preview, не сохранён на сервере)')
            router.push(`/admin/catalog/edit?id=${encodeURIComponent(product.id)}`)
            return
          }
          const { product } = await adminCreateProduct({ ...payload, id })
          showToast('Товар создан')
          router.push(`/admin/catalog/edit?id=${encodeURIComponent(product.id)}`)
        }}
      />
    </AccountSectionCard>
  )
}
