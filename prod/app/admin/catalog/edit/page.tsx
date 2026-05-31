import { Suspense } from 'react'
import AdminEditProductContent from './AdminEditProductContent'

function EditFallback() {
  return (
    <div className="rounded-xl border border-[#D2B48C] bg-[#FFF8E7] p-5 sm:p-8">
      <p className="text-sm text-[#707070]">Загрузка...</p>
    </div>
  )
}

export default function AdminEditProductPage() {
  return (
    <Suspense fallback={<EditFallback />}>
      <AdminEditProductContent />
    </Suspense>
  )
}
