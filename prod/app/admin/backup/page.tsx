'use client'

import { useRef, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import {
  buildAdminBackupAsync,
  downloadAdminBackup,
  parseAdminBackup,
  restoreAdminBackup,
} from '@/lib/adminBackup'
import { useToast } from '@/contexts/ToastContext'

export default function AdminBackupPage() {
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const backup = await buildAdminBackupAsync()
      downloadAdminBackup(backup)
      showToast('Резервная копия выгружена')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось выгрузить данные')
    } finally {
      setExporting(false)
    }
  }

  async function handleImport(file: File) {
    setImporting(true)
    try {
      const text = await file.text()
      const backup = parseAdminBackup(text)
      await restoreAdminBackup(backup)
      showToast('Контент восстановлен из резервной копии')
      window.location.reload()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось загрузить файл')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Резервная копия"
        description="Выгрузите весь контент сайта, чтобы после передеплоя загрузить его обратно через админку."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Выгрузить</h2>
          </div>
          <div className="space-y-3 p-4 text-sm text-[#707070]">
            <p>В файл JSON сохраняется:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>главная страница — тексты, изображения и отзывы</li>
              <li>подвал, соцсети и попап возврата</li>
              <li>каталог товаров</li>
              <li>заказы и подписчики рассылки</li>
              <li>тарифы доставки</li>
            </ul>
            <Button type="button" onClick={() => void handleExport()} disabled={exporting}>
              {exporting ? 'Готовим файл...' : 'Скачать резервную копию'}
            </Button>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Загрузить</h2>
          </div>
          <div className="space-y-3 p-4 text-sm text-[#707070]">
            <p>
              После передеплоя выберите ранее сохранённый файл — контент восстановится в админке и на
              сайте.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="block w-full text-sm"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void handleImport(file)
              }}
              disabled={importing}
            />
            {importing ? <p>Загружаем...</p> : null}
          </div>
        </section>
      </div>
    </div>
  )
}
