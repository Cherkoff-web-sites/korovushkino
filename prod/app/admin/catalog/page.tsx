import { Suspense } from 'react'
import AdminCatalogWorkspace from './AdminCatalogWorkspace'

function CatalogFallback() {
  return <p className="text-sm text-[#707070]">Загрузка каталога...</p>
}

export default function AdminCatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <AdminCatalogWorkspace />
    </Suspense>
  )
}
