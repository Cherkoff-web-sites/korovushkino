'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { adminInputClass, adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import {
  adminFetchSeoSettings,
  adminRegenerateSitemap,
  adminSaveSeoSettings,
} from '@/lib/api/adminSeoApi'
import { DEFAULT_SEO_SETTINGS, type SeoRedirect, type SeoSettings } from '@/lib/seoSettings'
import { useToast } from '@/contexts/ToastContext'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-[#707070]">{label}</span>
      {children}
    </label>
  )
}

function newRedirect(): SeoRedirect {
  return {
    id: `redirect-${Date.now()}`,
    from: '',
    to: '',
    permanent: true,
  }
}

export default function AdminSeoPage() {
  const { showToast } = useToast()
  const [draft, setDraft] = useState<SeoSettings>(DEFAULT_SEO_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetchSeoSettings()
      setDraft(data.settings)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось загрузить SEO-настройки')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    void load()
  }, [load])

  function update(mutator: (prev: SeoSettings) => SeoSettings) {
    setDraft((prev) => mutator(prev))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const data = await adminSaveSeoSettings(draft)
      setDraft(data.settings)
      showToast('SEO-настройки сохранены')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось сохранить')
    } finally {
      setSaving(false)
    }
  }

  async function handleRegenerateSitemap() {
    setRegenerating(true)
    try {
      const data = await adminRegenerateSitemap()
      setDraft(data.settings)
      showToast('Sitemap обновлён из каталога')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось обновить sitemap')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-[#707070]">Загрузка SEO-настроек…</p>
  }

  return (
    <div>
      <AdminPageHeader
        title="SEO-файлы"
        description="robots.txt, sitemap.xml и редиректы. Всё хранится в базе и не сбрасывается при redeploy."
        actions={
          <button
            type="button"
            onClick={() => {
              setDraft(DEFAULT_SEO_SETTINGS)
              showToast('Черновик сброшен — нажмите «Сохранить», чтобы применить')
            }}
            className="rounded-lg border border-[#e2e4ea] px-4 py-2 text-sm text-[#707070] hover:bg-[#f7f8fa]"
          >
            Сбросить черновик
          </button>
        }
      />

      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Основное</h2>
          </div>
          <div className="space-y-4 p-4">
            <Field label="Адрес сайта (для sitemap)">
              <input
                className={adminInputClass}
                value={draft.siteUrl}
                onChange={(event) => update((prev) => ({ ...prev, siteUrl: event.target.value }))}
                placeholder="https://korovushkino.com"
              />
            </Field>
            <p className="text-xs text-[#707070]">
              Файлы доступны по адресам: <code>/robots.txt</code> и <code>/sitemap.xml</code>
            </p>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">robots.txt</h2>
          </div>
          <div className="p-4">
            <Field label="Содержимое robots.txt">
              <textarea
                rows={10}
                className={`${adminInputClass} font-mono text-xs`}
                value={draft.robotsTxt}
                onChange={(event) => update((prev) => ({ ...prev, robotsTxt: event.target.value }))}
              />
            </Field>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">sitemap.xml</h2>
          </div>
          <div className="space-y-4 p-4">
            <Field label="Режим">
              <select
                className={adminInputClass}
                value={draft.sitemapMode}
                onChange={(event) =>
                  update((prev) => ({
                    ...prev,
                    sitemapMode: event.target.value as SeoSettings['sitemapMode'],
                  }))
                }
              >
                <option value="auto">Авто из каталога и страниц</option>
                <option value="manual">Ручной XML</option>
              </select>
            </Field>

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => void handleRegenerateSitemap()} disabled={regenerating}>
                {regenerating ? 'Обновляем…' : 'Обновить sitemap из каталога'}
              </Button>
            </div>

            {draft.sitemapMode === 'manual' ? (
              <Field label="Содержимое sitemap.xml">
                <textarea
                  rows={14}
                  className={`${adminInputClass} font-mono text-xs`}
                  value={draft.sitemapXml}
                  onChange={(event) => update((prev) => ({ ...prev, sitemapXml: event.target.value }))}
                />
              </Field>
            ) : (
              <p className="text-xs text-[#707070]">
                В авто-режиме sitemap собирается из главной, каталога, страниц и всех товаров в базе.
              </p>
            )}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="flex items-center justify-between border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Редиректы</h2>
            <button
              type="button"
              onClick={() => update((prev) => ({ ...prev, redirects: [...prev.redirects, newRedirect()] }))}
              className="rounded-lg border border-[#e2e4ea] px-3 py-1.5 text-xs text-[#232326] hover:bg-[#f7f8fa]"
            >
              Добавить
            </button>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-xs text-[#707070]">
              Вместо .htaccess: укажите старый и новый путь. Например, после смены slug товара.
            </p>
            {draft.redirects.length === 0 ? (
              <p className="text-sm text-[#707070]">Редиректов пока нет</p>
            ) : (
              draft.redirects.map((item, index) => (
                <div key={item.id} className="grid gap-3 rounded-lg border border-[#e8eaef] p-3 md:grid-cols-[1fr_1fr_auto_auto]">
                  <Field label="Откуда">
                    <input
                      className={adminInputClass}
                      value={item.from}
                      onChange={(event) =>
                        update((prev) => {
                          const redirects = [...prev.redirects]
                          redirects[index] = { ...redirects[index]!, from: event.target.value }
                          return { ...prev, redirects }
                        })
                      }
                      placeholder="/catalog/kefir-3-2"
                    />
                  </Field>
                  <Field label="Куда">
                    <input
                      className={adminInputClass}
                      value={item.to}
                      onChange={(event) =>
                        update((prev) => {
                          const redirects = [...prev.redirects]
                          redirects[index] = { ...redirects[index]!, to: event.target.value }
                          return { ...prev, redirects }
                        })
                      }
                      placeholder="/catalog/1kefir-3-2/"
                    />
                  </Field>
                  <label className="flex items-end gap-2 pb-2 text-sm text-[#707070]">
                    <input
                      type="checkbox"
                      checked={item.permanent}
                      onChange={(event) =>
                        update((prev) => {
                          const redirects = [...prev.redirects]
                          redirects[index] = { ...redirects[index]!, permanent: event.target.checked }
                          return { ...prev, redirects }
                        })
                      }
                    />
                    301
                  </label>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        update((prev) => ({
                          ...prev,
                          redirects: prev.redirects.filter((redirect) => redirect.id !== item.id),
                        }))
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-700 hover:bg-red-50"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  )
}
