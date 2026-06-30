'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { adminInputClass, adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import { useSiteContent } from '@/hooks/useSiteContent'
import type { SiteContent } from '@/lib/siteContent'
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContent'
import { useToast } from '@/contexts/ToastContext'

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-[#707070]">{label}</span>
      {children}
    </label>
  )
}

export default function SiteContentEditor() {
  const { content, save, reset } = useSiteContent()
  const { showToast } = useToast()
  const [draft, setDraft] = useState<SiteContent>(content)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setDraft(content)
  }, [content])

  function update(mutator: (prev: SiteContent) => SiteContent) {
    setDraft((prev) => {
      const next = mutator(prev)
      setDirty(true)
      return next
    })
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    save(draft)
    setDirty(false)
    showToast('Контент сайта сохранён')
  }

  return (
    <div>
      <AdminPageHeader
        title="Подвал и попапы"
        description="Тексты подвала, соцсети и окно «Возврат продукции»."
        actions={
          <button
            type="button"
            onClick={() => {
              reset()
              setDraft(DEFAULT_SITE_CONTENT)
              setDirty(false)
              showToast('Сброшено к значениям по умолчанию')
            }}
            className="rounded-lg border border-[#e2e4ea] px-4 py-2 text-sm text-[#707070] hover:bg-[#f7f8fa]"
          >
            Сбросить
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Подвал — рассылка</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4">
            <Field label="Заголовок">
              <input
                className={adminInputClass}
                value={draft.footer.newsletterTitle}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    footer: { ...p.footer, newsletterTitle: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Текст">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.footer.newsletterText}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    footer: { ...p.footer, newsletterText: e.target.value },
                  }))
                }
              />
            </Field>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Подвал — блок «Коровушкино»</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4">
            <Field label="Заголовок">
              <input
                className={adminInputClass}
                value={draft.footer.brandTitle}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    footer: { ...p.footer, brandTitle: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Описание">
              <textarea
                rows={5}
                className={`${adminInputClass} resize-y`}
                value={draft.footer.brandDescription}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    footer: { ...p.footer, brandDescription: e.target.value },
                  }))
                }
              />
            </Field>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Подвал — контакты</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <Field label="Email">
              <input
                className={adminInputClass}
                value={draft.footer.email}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    footer: { ...p.footer, email: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Телефон (отображение)">
              <input
                className={adminInputClass}
                value={draft.footer.phoneDisplay}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    footer: { ...p.footer, phoneDisplay: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Телефон (ссылка)">
              <input
                className={adminInputClass}
                value={draft.footer.phoneHref}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    footer: { ...p.footer, phoneHref: e.target.value },
                  }))
                }
              />
            </Field>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Соцсети в подвале</h2>
          </div>
          <div className="space-y-4 p-4">
            {draft.footer.socialLinks.map((link, index) => (
              <div
                key={link.id}
                className="grid grid-cols-1 gap-3 rounded-lg border border-[#e8eaef] p-4 sm:grid-cols-2"
              >
                <Field label={`${link.label} — ссылка`}>
                  <input
                    className={adminInputClass}
                    value={link.href}
                    onChange={(e) =>
                      update((p) => {
                        const socialLinks = [...p.footer.socialLinks]
                        socialLinks[index] = { ...socialLinks[index]!, href: e.target.value }
                        return { ...p, footer: { ...p.footer, socialLinks } }
                      })
                    }
                  />
                </Field>
                <label className="flex items-center gap-2 self-end pb-2 text-sm text-[#707070]">
                  <input
                    type="checkbox"
                    checked={link.enabled}
                    onChange={(e) =>
                      update((p) => {
                        const socialLinks = [...p.footer.socialLinks]
                        socialLinks[index] = { ...socialLinks[index]!, enabled: e.target.checked }
                        return { ...p, footer: { ...p.footer, socialLinks } }
                      })
                    }
                  />
                  Показывать на сайте
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Попап «Возврат продукции»</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4">
            <Field label="Заголовок">
              <input
                className={adminInputClass}
                value={draft.returnsModal.title}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    returnsModal: { ...p.returnsModal, title: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Вступительный абзац (до телефона)">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.returnsModal.intro}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    returnsModal: { ...p.returnsModal, intro: e.target.value },
                  }))
                }
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Телефон в тексте">
                <input
                  className={adminInputClass}
                  value={draft.returnsModal.phoneDisplay}
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      returnsModal: { ...p.returnsModal, phoneDisplay: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Ссылка на телефон">
                <input
                  className={adminInputClass}
                  value={draft.returnsModal.phoneHref}
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      returnsModal: { ...p.returnsModal, phoneHref: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>
            {draft.returnsModal.steps.map((step, index) => (
              <Field key={index} label={`Пункт ${index + 1}`}>
                <textarea
                  rows={2}
                  className={`${adminInputClass} resize-y`}
                  value={step}
                  onChange={(e) =>
                    update((p) => {
                      const steps = [...p.returnsModal.steps]
                      steps[index] = e.target.value
                      return { ...p, returnsModal: { ...p.returnsModal, steps } }
                    })
                  }
                />
              </Field>
            ))}
            <Field label="Email в пункте 3">
              <input
                className={adminInputClass}
                value={draft.returnsModal.step3Email}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    returnsModal: { ...p.returnsModal, step3Email: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Абзац про возврат денег">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.returnsModal.paragraphRefund}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    returnsModal: { ...p.returnsModal, paragraphRefund: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Абзац про хранение">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.returnsModal.paragraphStorage}
                onChange={(e) =>
                  update((p) =>
                    ({
                      ...p,
                      returnsModal: { ...p.returnsModal, paragraphStorage: e.target.value },
                    })
                  )
                }
              />
            </Field>
          </div>
        </section>

        <Button type="submit">{dirty ? 'Сохранить изменения' : 'Сохранить'}</Button>
      </form>
    </div>
  )
}
