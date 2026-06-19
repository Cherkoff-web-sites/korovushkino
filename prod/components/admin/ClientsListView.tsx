'use client'

import { adminInputClass, adminPanelClass, adminTableHeadClass } from './adminStyles'

const CLIENT_COLUMNS = [
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Имя' },
  { key: 'phone', label: 'Телефон' },
  { key: 'registered', label: 'Регистрация' },
  { key: 'orders', label: 'Заказов' },
  { key: 'status', label: 'Статус' },
] as const

export default function ClientsListView() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-[#1F1F1F] sm:text-[28px]">Клиенты</h1>
          <p className="mt-1 text-sm text-[#707070]">
            Пользователи с личным кабинетом на сайте.
          </p>
        </div>

        <div className={`${adminPanelClass} mb-4 p-4`}>
          <input
            type="search"
            disabled
            placeholder="Поиск по email, имени, телефону"
            className={adminInputClass}
          />
        </div>

        <div className={`${adminPanelClass} overflow-x-auto`}>
          <table className="min-w-full text-left text-sm">
            <thead className={adminTableHeadClass}>
              <tr>
                {CLIENT_COLUMNS.map((column) => (
                  <th key={column.key} className="px-4 py-3">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={CLIENT_COLUMNS.length} className="px-4 py-12 text-center text-[#707070]">
                  Клиентов пока нет
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <aside className={`${adminPanelClass} h-fit p-5 opacity-80`}>
        <h2 className="text-base font-semibold text-[#1F1F1F]">Карточка клиента</h2>
        <p className="mt-2 text-sm text-[#707070]">Выберите клиента из списка</p>

        <div className="mt-5 space-y-3 border-t border-[#e8eaef] pt-5">
          <button type="button" disabled className="w-full rounded-lg border border-[#e2e4ea] bg-[#f7f8fa] px-4 py-2.5 text-sm text-[#232326]/45">
            Заблокировать
          </button>
          <button type="button" disabled className="w-full rounded-lg border border-[#e2e4ea] bg-[#f7f8fa] px-4 py-2.5 text-sm text-[#232326]/45">
            Сбросить пароль
          </button>
        </div>
      </aside>
    </div>
  )
}
