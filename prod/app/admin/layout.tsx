import type { Metadata } from 'next'
import AdminAuthGate from './components/AdminAuthGate'
import AdminShell from '@/components/admin/AdminShell'

export const metadata: Metadata = {
  title: 'Админ-панель | Коровушкино',
  description: 'Управление каталогом, заказами и клиентами Коровушкино.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  )
}
