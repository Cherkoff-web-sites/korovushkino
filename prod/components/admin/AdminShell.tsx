import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[200] flex bg-[#f0f1f4]">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-16 lg:px-6 lg:pt-6">{children}</div>
      </div>
    </div>
  )
}
