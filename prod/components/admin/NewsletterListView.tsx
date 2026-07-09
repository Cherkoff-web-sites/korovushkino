'use client'

import { useCallback, useEffect, useState } from 'react'
import type { StoredNewsletterSubscriber } from '@/lib/adminDataStore'
import { adminFetchNewsletterSubscribers } from '@/lib/api/adminSiteApi'
import { adminInputClass, adminPanelClass, adminTableHeadClass } from './adminStyles'

export default function NewsletterListView() {
  const [rows, setRows] = useState<StoredNewsletterSubscriber[]>([])
  const [query, setQuery] = useState('')

  const reload = useCallback(async () => {
    try {
      const data = await adminFetchNewsletterSubscribers()
      setRows(data.subscribers)
    } catch {
      setRows([])
    }
  }, [])

  useEffect(() => {
    reload()
    window.addEventListener('admin-newsletter-updated', reload)
    return () => {
      window.removeEventListener('admin-newsletter-updated', reload)
    }
  }, [reload])

  const filtered = rows.filter((row) => row.email.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-[#1F1F1F] sm:text-[28px]">Рассылка</h1>
        <p className="mt-1 text-sm text-[#707070]">
          Подписчики с формы в подвале сайта.
        </p>
      </div>

      <div className={`${adminPanelClass} mb-4 p-4`}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по email"
          className={adminInputClass}
        />
      </div>

      <div className={`${adminPanelClass} overflow-x-auto`}>
        <table className="min-w-full text-left text-sm">
          <thead className={adminTableHeadClass}>
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Источник</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-[#707070]">
                  Подписчиков пока нет
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="border-t border-[#e8eaef]">
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.subscribedAt}</td>
                  <td className="px-4 py-3">{row.source}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
