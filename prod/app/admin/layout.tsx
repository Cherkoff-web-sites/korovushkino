import type { Metadata } from 'next'
import AdminAuthGate from './components/AdminAuthGate'
import AdminShell from './components/AdminShell'

export const metadata: Metadata = {
  title: 'Админ-панель | Коровушкино',
  description: 'Управление каталогом и контентом сайта Коровушкино.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  )
}
