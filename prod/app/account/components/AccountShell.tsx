import AccountSidebar from './AccountSidebar'

export default function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fdfbf6] py-8 sm:py-10 lg:py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-8">{children}</div>
          <div className="lg:col-span-4">
            <AccountSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
