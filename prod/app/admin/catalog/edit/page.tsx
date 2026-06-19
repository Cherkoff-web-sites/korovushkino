import { Suspense } from 'react'
import AdminEditRedirect from './AdminEditRedirect'

export default function AdminEditProductPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#707070]">Переход к редактору...</p>}>
      <AdminEditRedirect />
    </Suspense>
  )
}
