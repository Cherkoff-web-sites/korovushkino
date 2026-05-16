import type { Metadata } from 'next'
import AccountShell from './components/AccountShell'

export const metadata: Metadata = {
  title: 'Личный кабинет | Коровушкино',
  description: 'Личный кабинет покупателя фермы Коровушкино.',
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>
}
