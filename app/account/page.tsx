'use client'

import { useCart } from '@/contexts/CartContext'
import AccountSectionCard from './components/AccountSectionCard'

const PROFILE_FIELDS = [
  { label: 'Фамилия и Имя', value: 'Иванов Иван' },
  { label: 'Контактный Email', value: '@mail.ru' },
  { label: 'Контактный телефон', value: '+7 (999) 999-99-99' },
] as const

export default function AccountPersonalPage() {
  const { getTotalPrice } = useCart()
  const ordersTotal = getTotalPrice()

  return (
    <AccountSectionCard title="Личный кабинет">
      <dl className="space-y-4 sm:space-y-5">
        {PROFILE_FIELDS.map((field) => (
          <div
            key={field.label}
            className="grid grid-cols-1 gap-1 border-b border-[#D2B48C]/40 pb-4 last:border-0 last:pb-0 sm:grid-cols-[minmax(140px,200px)_1fr] sm:gap-4 sm:items-baseline"
          >
            <dt className="text-sm text-[#707070] sm:text-[15px]">{field.label}</dt>
            <dd className="text-sm font-medium text-black sm:text-[15px]">{field.value}</dd>
          </div>
        ))}
        <div className="grid grid-cols-1 gap-1 border-b border-[#D2B48C]/40 pb-4 sm:grid-cols-[minmax(140px,200px)_1fr] sm:gap-4 sm:items-baseline">
          <dt className="text-sm text-[#707070] sm:text-[15px]">Сумма заказов</dt>
          <dd className="text-sm font-medium text-black sm:text-[15px]">
            {ordersTotal.toLocaleString('ru-RU')}₽
          </dd>
        </div>
      </dl>

      <div className="mt-8 border-t border-[#D2B48C]/40 pt-8 sm:mt-10">
        <p className="mb-3 text-sm text-[#707070] sm:text-[15px]">Изображение профиля</p>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-lg border border-[#D2B48C] bg-white">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-[#B0B0B0]" aria-hidden>
              <path
                d="M12 3v12M12 15l4-4M12 15l-4-4M4 19h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <button
            type="button"
            className="rounded-lg bg-[#3D8C13] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#347710] sm:text-[15px]"
          >
            редактировать
          </button>
        </div>
      </div>
    </AccountSectionCard>
  )
}
