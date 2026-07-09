'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useUserOrders } from '@/hooks/useUserOrders'
import AccountSectionCard from './components/AccountSectionCard'

export default function AccountPersonalPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { orders, loading } = useUserOrders()

  const ordersTotal = useMemo(
    () => orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
    [orders]
  )

  const fullName = [user?.surname, user?.firstName].filter(Boolean).join(' ') || 'Не указано'
  const email = user?.email || user?.login || '—'
  const phone = user?.phone || '—'

  return (
    <AccountSectionCard title="Личный кабинет">
      <dl className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 gap-1 border-b border-[#D2B48C]/40 pb-4 sm:grid-cols-[minmax(140px,200px)_1fr] sm:gap-4 sm:items-baseline">
          <dt className="text-sm text-[#707070] sm:text-[15px]">Фамилия и Имя</dt>
          <dd className="text-sm font-medium text-black sm:text-[15px]">{fullName}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 border-b border-[#D2B48C]/40 pb-4 sm:grid-cols-[minmax(140px,200px)_1fr] sm:gap-4 sm:items-baseline">
          <dt className="text-sm text-[#707070] sm:text-[15px]">Контактный Email</dt>
          <dd className="text-sm font-medium text-black sm:text-[15px]">{email}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 border-b border-[#D2B48C]/40 pb-4 sm:grid-cols-[minmax(140px,200px)_1fr] sm:gap-4 sm:items-baseline">
          <dt className="text-sm text-[#707070] sm:text-[15px]">Контактный телефон</dt>
          <dd className="text-sm font-medium text-black sm:text-[15px]">{phone}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 border-b border-[#D2B48C]/40 pb-4 sm:grid-cols-[minmax(140px,200px)_1fr] sm:gap-4 sm:items-baseline">
          <dt className="text-sm text-[#707070] sm:text-[15px]">Сумма заказов</dt>
          <dd className="text-sm font-medium text-black sm:text-[15px]">
            {loading ? '…' : `${ordersTotal.toLocaleString('ru-RU')}₽`}
          </dd>
        </div>
      </dl>

      <div className="mt-8 border-t border-[#D2B48C]/40 pt-8 sm:mt-10">
        <button
          type="button"
          onClick={() => {
            logout()
            router.push('/')
          }}
          className="text-sm text-[#707070] transition-colors hover:text-black"
        >
          Выйти из аккаунта
        </button>
      </div>
    </AccountSectionCard>
  )
}
