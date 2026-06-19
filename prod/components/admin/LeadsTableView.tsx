'use client'

import { adminInputClass, adminPanelClass, adminTableHeadClass } from './adminStyles'

type LeadsColumn = { key: string; label: string }

type LeadsTableViewProps = {
  title: string
  description: string
  columns: LeadsColumn[]
  emptyLabel?: string
}

export default function LeadsTableView({
  title,
  description,
  columns,
  emptyLabel = 'Заявок пока нет',
}: LeadsTableViewProps) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-[#1F1F1F] sm:text-[28px]">{title}</h1>
        <p className="mt-1 text-sm text-[#707070]">{description}</p>
      </div>

      <div className={`${adminPanelClass} mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-end`}>
        <label className="min-w-[200px] flex-1">
          <span className="mb-1.5 block text-xs text-[#707070]">Поиск</span>
          <input type="search" disabled className={adminInputClass} placeholder="Имя, телефон, email" />
        </label>
        <label className="min-w-[140px]">
          <span className="mb-1.5 block text-xs text-[#707070]">Статус</span>
          <select disabled className={adminInputClass}>
            <option>Все</option>
          </select>
        </label>
        <label className="min-w-[140px]">
          <span className="mb-1.5 block text-xs text-[#707070]">Дата от</span>
          <input type="date" disabled className={adminInputClass} />
        </label>
        <label className="min-w-[140px]">
          <span className="mb-1.5 block text-xs text-[#707070]">Дата до</span>
          <input type="date" disabled className={adminInputClass} />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="rounded-lg border border-[#e2e4ea] bg-[#f7f8fa] px-4 py-2.5 text-sm text-[#232326]/45"
          >
            CSV
          </button>
          <button
            type="button"
            disabled
            className="rounded-lg border border-[#e2e4ea] bg-[#f7f8fa] px-4 py-2.5 text-sm text-[#232326]/45"
          >
            Excel
          </button>
        </div>
      </div>

      <div className={`${adminPanelClass} overflow-x-auto`}>
        <table className="min-w-full text-left text-sm">
          <thead className={adminTableHeadClass}>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-[#707070]">
                {emptyLabel}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
