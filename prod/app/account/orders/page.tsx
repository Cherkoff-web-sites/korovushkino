'use client'

import Link from 'next/link'
import AccountSectionCard from '../components/AccountSectionCard'
import { useUserOrders } from '@/hooks/useUserOrders'
import { parseOrderItems } from '@/lib/userOrders'

function OrderCard({ order, active }: { order: ReturnType<typeof useUserOrders>['orders'][0]; active?: boolean }) {
  const items = parseOrderItems(order)

  return (
    <article className="rounded-xl border border-[#D2B48C]/50 bg-white/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#707070]">{order.date}</p>
          <p className="mt-1 text-base font-medium text-black">Заказ {order.id}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            active ? 'bg-[#E8F5E1] text-[#3D8C13]' : 'bg-[#F5F0E8] text-[#707070]'
          }`}
        >
          {order.status}
        </span>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-[#232326]">
        {items.map((item) => (
          <li key={`${order.id}-${item.id}`} className="flex justify-between gap-3">
            <span>{item.name}</span>
            <span className="text-[#707070]">× {item.quantity}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-[#D2B48C]/30 pt-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-[#707070]">Адрес доставки</dt>
          <dd className="max-w-[60%] text-right text-black">{order.address}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#707070]">Доставка</dt>
          <dd className="text-black">{order.deliveryTime}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#707070]">Оплата</dt>
          <dd className="text-black">{order.paymentMethod}</dd>
        </div>
        <div className="flex justify-between gap-3 font-medium">
          <dt className="text-black">Итого</dt>
          <dd className="text-black">{order.total.toLocaleString('ru-RU')} ₽</dd>
        </div>
      </dl>
    </article>
  )
}

export default function AccountOrdersPage() {
  const { orders, activeOrders, completedOrders, loading } = useUserOrders()

  return (
    <AccountSectionCard title="Заказы">
      {loading ? (
        <p className="text-sm text-[#707070]">Загрузка заказов...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-[#D2B48C]/50 bg-white/60 px-6 py-12 text-center">
          <p className="text-lg text-[#232326]/80">У вас пока нет заказов</p>
          <p className="mt-2 text-sm text-[#232326]/60">
            Оформите заказ в корзине — он появится здесь и в админ-панели.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-block rounded-full bg-[#3D8C13] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#367c11]"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {activeOrders.length > 0 ? (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-black">Активные заказы</h2>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} active />
                ))}
              </div>
            </section>
          ) : null}

          {completedOrders.length > 0 ? (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-black">
                {activeOrders.length > 0 ? 'История заказов' : 'Все заказы'}
              </h2>
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          ) : null}

          {activeOrders.length > 0 && completedOrders.length === 0 ? null : null}
        </div>
      )}
    </AccountSectionCard>
  )
}
