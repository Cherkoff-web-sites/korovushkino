import type { Metadata } from 'next'
import AccountAuthGate from './components/AccountAuthGate'
import AccountShell from './components/AccountShell'

export const metadata: Metadata = {
  title: 'Личный кабинет | Коровушкино',
  description: 'Личный кабинет покупателя фермы Коровушкино.',
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountAuthGate>
      <AccountShell>{children}</AccountShell>
    </AccountAuthGate>
  )
}
