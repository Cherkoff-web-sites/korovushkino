'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  readStoredContacts,
  readStoredOrders,
  type StoredContactLead,
  type StoredOrder,
} from '@/lib/adminDataStore'
import { adminFetchOrders } from '@/lib/api/adminSiteApi'
import { adminInputClass, adminPanelClass, adminTableHeadClass } from './adminStyles'

type LeadsColumn = { key: string; label: string }

type LeadsTableViewProps = {
  title: string
  description: string
  columns: LeadsColumn[]
  emptyLabel?: string
  dataSource: 'orders' | 'contacts'
}

type LeadRow = Record<string, string | number>

function toOrderRow(order: StoredOrder): LeadRow {
  return {
    date: order.date,
    name: order.name,
    email: order.email,
    total: typeof order.total === 'number' ? `${order.total.toLocaleString('ru-RU')} ₽` : '—',
    delivery:
      typeof order.deliveryCost === 'number' ? `${order.deliveryCost.toLocaleString('ru-RU')} ₽` : '—',
    address: order.address || '—',
    items: order.itemsCount,
    summary: order.summary,
    payment: order.paymentMethod || '—',
    status: order.status,
  }
}

function toContactRow(contact: StoredContactLead): LeadRow {
  return {
    date: contact.date,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    message: contact.message,
    source: contact.source,
    status: contact.status,
  }
}

export default function LeadsTableView({
  title,
  description,
  columns,
  emptyLabel = 'Заявок пока нет',
  dataSource,
}: LeadsTableViewProps) {
  const [rows, setRows] = useState<LeadRow[]>([])
  const [query, setQuery] = useState('')

  const reload = useCallback(async () => {
    if (dataSource === 'orders') {
      const local = readStoredOrders().map(toOrderRow)
      try {
        const data = await adminFetchOrders()
        const remote = data.orders.map(toOrderRow)
        const merged = [...local]
        for (const row of remote) {
          const key = `${row.email}-${row.date}-${row.summary}`
          if (!merged.some((item) => `${item.email}-${item.date}-${item.summary}` === key)) {
            merged.unshift(row)
          }
        }
        setRows(merged)
        return
      } catch {
        setRows(local)
        return
      }
    }
    setRows(readStoredContacts().map(toContactRow))
  }, [dataSource])

  useEffect(() => {
    reload()
    const eventName = dataSource === 'orders' ? 'admin-orders-updated' : 'admin-contacts-updated'
    window.addEventListener(eventName, reload)
    window.addEventListener('storage', reload)
    return () => {
      window.removeEventListener(eventName, reload)
      window.removeEventListener('storage', reload)
    }
  }, [dataSource, reload])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((row) =>
      columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(needle))
    )
  }, [columns, query, rows])

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-[#1F1F1F] sm:text-[28px]">{title}</h1>
        <p className="mt-1 text-sm text-[#707070]">{description}</p>
      </div>

      <div className={`${adminPanelClass} mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-end`}>
        <label className="min-w-[200px] flex-1">
          <span className="mb-1.5 block text-xs text-[#707070]">Поиск</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={adminInputClass}
            placeholder="Имя, телефон, email"
          />
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#707070]">
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => (
                <tr key={index} className="border-t border-[#e8eaef]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      {row[column.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
