import AdminSidebar from './AdminSidebar'
import { ADMIN_PREVIEW } from '@/lib/adminPreview'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fdfbf6] py-8 sm:py-10 lg:py-12">
      <div className="container">
        {ADMIN_PREVIEW ? (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Режим preview: админка без backend и авторизации. Изменения не сохраняются на сервере.
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-8">{children}</div>
          <div className="lg:col-span-4">
            <AdminSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
