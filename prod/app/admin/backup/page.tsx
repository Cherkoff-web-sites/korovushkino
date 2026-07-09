'use client'

import { useRef, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import {
  buildAdminBackupAsync,
  downloadBackupSection,
  downloadAdminBackup,
  parseAdminBackup,
  restoreBackupSection,
  restoreAdminBackup,
} from '@/lib/adminBackup'
import type { BackupSection } from '@/lib/api/adminSiteApi'
import { useToast } from '@/contexts/ToastContext'

const SECTIONS: Array<{ id: BackupSection; label: string }> = [
  { id: 'products', label: 'Товары' },
  { id: 'orders', label: 'Заказы' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'clients', label: 'Клиенты' },
  { id: 'newsletter', label: 'Рассылка' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'content', label: 'Контент страниц' },
  { id: 'delivery', label: 'Доставка' },
  { id: 'seo', label: 'SEO-файлы' },
]

export default function AdminBackupPage() {
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importSection, setImportSection] = useState<BackupSection | 'auto' | 'all'>('auto')

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

  async function handleSectionExport(section: BackupSection) {
    setExporting(true)
    try {
      await downloadBackupSection(section)
      showToast('Раздел выгружен')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось выгрузить раздел')
    } finally {
      setExporting(false)
    }
  }

  async function handleImport(file: File) {
    setImporting(true)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as { section?: BackupSection }
      const section = importSection === 'auto' ? parsed.section : importSection
      if (!window.confirm(section && section !== 'all'
        ? `Раздел «${SECTIONS.find((item) => item.id === section)?.label ?? section}» будет заменён. Продолжить?`
        : 'Все данные из резервной копии будут загружены в БД. Продолжить?')) {
        return
      }
      if (section && section !== 'all') {
        await restoreBackupSection(section, parsed)
      } else {
        const backup = parseAdminBackup(text)
        await restoreAdminBackup(backup)
      }
      showToast('Данные восстановлены из резервной копии')
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
              <li>главная, страницы сайта, подвал и попапы</li>
              <li>заказы и подписчики рассылки</li>
              <li>тарифы доставки</li>
            </ul>
            <Button type="button" onClick={() => void handleExport()} disabled={exporting}>
              {exporting ? 'Готовим файл...' : 'Скачать резервную копию'}
            </Button>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => void handleSectionExport(section.id)}
                  disabled={exporting}
                  className="rounded-lg border border-[#e2e4ea] px-3 py-2 text-left text-xs text-[#232326] transition-colors hover:bg-[#f7f8fa] disabled:opacity-50"
                >
                  Скачать: {section.label}
                </button>
              ))}
            </div>
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
            <label className="block">
              <span className="mb-1.5 block text-xs text-[#707070]">Что загрузить</span>
              <select
                value={importSection}
                onChange={(event) =>
                  setImportSection(event.target.value as BackupSection | 'auto' | 'all')
                }
                className="w-full rounded-lg border border-[#e2e4ea] bg-white px-3 py-2 text-sm"
              >
                <option value="auto">Определить по файлу</option>
                <option value="all">Всё</option>
                {SECTIONS.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </label>
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
