'use client'

import AccountSectionCard from '../components/AccountSectionCard'
import { useUserOrders } from '@/hooks/useUserOrders'
import { getUniqueAddresses } from '@/lib/userOrders'

export default function AccountAddressesPage() {
  const { orders, loading } = useUserOrders()
  const addresses = getUniqueAddresses(orders)

  return (
    <AccountSectionCard title="Адреса">
      <p className="mb-6 text-sm text-[#232326]/75 sm:text-[15px]">
        Адреса из ваших заказов — те же, что видны в админ-панели при оформлении.
      </p>

      {loading ? (
        <p className="text-sm text-[#707070]">Загрузка адресов...</p>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-[#D2B48C]/50 bg-white/60 px-6 py-12 text-center">
          <p className="text-lg text-[#232326]/80">Сохранённых адресов пока нет</p>
          <p className="mt-2 text-sm text-[#232326]/60">
            После оформления заказа адрес доставки появится здесь автоматически.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.map((entry, index) => (
            <li
              key={entry.address}
              className="rounded-xl border border-[#D2B48C]/50 bg-white/70 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-base font-medium text-black">Адрес {index + 1}</p>
                <span className="text-xs text-[#707070]">из заказа {entry.orderId}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#232326]">{entry.address}</p>
              <p className="mt-2 text-xs text-[#707070]">Использован: {entry.lastUsedAt}</p>
            </li>
          ))}
        </ul>
      )}
    </AccountSectionCard>
  )
}
