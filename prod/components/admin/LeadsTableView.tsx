'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type StoredContactLead,
  type StoredOrder,
} from '@/lib/adminDataStore'
import { adminFetchContacts, adminFetchOrders, adminUpdateOrderStatus } from '@/lib/api/adminSiteApi'
import { ORDER_STATUSES, formatOrderItemsSummary, normalizeOrderStatus } from '@/lib/orderStatuses'
import { parseOrderItems } from '@/lib/userOrders'
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
  const items = parseOrderItems(order)

  return {
    id: order.id,
    date: order.date,
    name: order.name,
    email: order.email,
    total: typeof order.total === 'number' ? `${order.total.toLocaleString('ru-RU')} ₽` : '—',
    delivery:
      typeof order.deliveryCost === 'number' ? `${order.deliveryCost.toLocaleString('ru-RU')} ₽` : '—',
    address: order.address || '—',
    items: order.itemsCount,
    summary: formatOrderItemsSummary(items, order.summary),
    payment: order.paymentMethod || '—',
    status: normalizeOrderStatus(order.status),
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
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (dataSource === 'orders') {
      try {
        const data = await adminFetchOrders()
        setRows(data.orders.map(toOrderRow))
        return
      } catch {
        setRows([])
        return
      }
    }
    try {
      const data = await adminFetchContacts()
      setRows((data.contacts as StoredContactLead[]).map(toContactRow))
    } catch {
      setRows([])
    }
  }, [dataSource])

  useEffect(() => {
    reload()
    const eventName = dataSource === 'orders' ? 'admin-orders-updated' : 'admin-contacts-updated'
    window.addEventListener(eventName, reload)
    return () => {
      window.removeEventListener(eventName, reload)
    }
  }, [dataSource, reload])

  async function handleOrderStatusChange(orderId: string, status: string) {
    setStatusUpdatingId(orderId)
    try {
      await adminUpdateOrderStatus(orderId, status)
      setRows((prev) =>
        prev.map((row) => (String(row.id) === orderId ? { ...row, status } : row))
      )
      window.dispatchEvent(new Event('admin-orders-updated'))
    } catch {
      await reload()
    } finally {
      setStatusUpdatingId(null)
    }
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((row) =>
      columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(needle))
    )
  }, [columns, query, rows])

  function renderCell(column: LeadsColumn, row: LeadRow) {
    if (dataSource === 'orders' && column.key === 'status') {
      const orderId = String(row.id || '')
      return (
        <select
          value={String(row.status || ORDER_STATUSES[0])}
          disabled={!orderId || statusUpdatingId === orderId}
          onChange={(event) => void handleOrderStatusChange(orderId, event.target.value)}
          className={`${adminInputClass} min-w-[140px] py-2`}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      )
    }

    const value = row[column.key] ?? '—'

    if (column.key === 'summary') {
      return <span className="whitespace-pre-line">{value}</span>
    }

    return value
  }

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
                <tr key={String(row.id ?? index)} className="border-t border-[#e8eaef]">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 align-top ${column.key === 'summary' ? 'min-w-[220px]' : ''}`}
                    >
                      {renderCell(column, row)}
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
