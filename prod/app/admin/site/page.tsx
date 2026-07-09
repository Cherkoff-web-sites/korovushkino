'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTaggedTextField from '@/components/admin/AdminTaggedTextField'
import { adminInputClass, adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import { useSiteContent } from '@/hooks/useSiteContent'
import type { SiteContent } from '@/lib/siteContent'
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContent'
import { useToast } from '@/contexts/ToastContext'
import { resolveHeadingTag } from '@/lib/contentBlocks'

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
            <AdminTaggedTextField
              label="Заголовок"
              value={draft.footer.newsletterTitle}
              tag={resolveHeadingTag(draft.footer.newsletterTitleTag, 'h2')}
              onValueChange={(newsletterTitle) =>
                update((p) => ({ ...p, footer: { ...p.footer, newsletterTitle } }))
              }
              onTagChange={(newsletterTitleTag) =>
                update((p) => ({ ...p, footer: { ...p.footer, newsletterTitleTag } }))
              }
            />
            <AdminTaggedTextField
              label="Текст"
              value={draft.footer.newsletterText}
              tag={resolveHeadingTag(draft.footer.newsletterTextTag, 'p')}
              multiline
              rows={3}
              onValueChange={(newsletterText) =>
                update((p) => ({ ...p, footer: { ...p.footer, newsletterText } }))
              }
              onTagChange={(newsletterTextTag) =>
                update((p) => ({ ...p, footer: { ...p.footer, newsletterTextTag } }))
              }
            />
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Подвал — блок «Коровушкино»</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4">
            <AdminTaggedTextField
              label="Заголовок"
              value={draft.footer.brandTitle}
              tag={resolveHeadingTag(draft.footer.brandTitleTag, 'h3')}
              onValueChange={(brandTitle) =>
                update((p) => ({ ...p, footer: { ...p.footer, brandTitle } }))
              }
              onTagChange={(brandTitleTag) =>
                update((p) => ({ ...p, footer: { ...p.footer, brandTitleTag } }))
              }
            />
            <AdminTaggedTextField
              label="Описание"
              value={draft.footer.brandDescription}
              tag={resolveHeadingTag(draft.footer.brandDescriptionTag, 'p')}
              multiline
              rows={5}
              onValueChange={(brandDescription) =>
                update((p) => ({ ...p, footer: { ...p.footer, brandDescription } }))
              }
              onTagChange={(brandDescriptionTag) =>
                update((p) => ({ ...p, footer: { ...p.footer, brandDescriptionTag } }))
              }
            />
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
            <AdminTaggedTextField
              label="Заголовок"
              value={draft.returnsModal.title}
              tag={resolveHeadingTag(draft.returnsModal.titleTag, 'h2')}
              onValueChange={(title) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, title } }))
              }
              onTagChange={(titleTag) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, titleTag } }))
              }
            />
            <AdminTaggedTextField
              label="Вступительный абзац (до телефона)"
              value={draft.returnsModal.intro}
              tag={resolveHeadingTag(draft.returnsModal.introTag, 'p')}
              multiline
              rows={3}
              onValueChange={(intro) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, intro } }))
              }
              onTagChange={(introTag) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, introTag } }))
              }
            />
            <AdminTaggedTextField
              label="Текст после телефона"
              value={draft.returnsModal.afterPhoneText}
              tag={resolveHeadingTag(draft.returnsModal.afterPhoneTextTag, 'p')}
              multiline
              rows={3}
              onValueChange={(afterPhoneText) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, afterPhoneText } }))
              }
              onTagChange={(afterPhoneTextTag) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, afterPhoneTextTag } }))
              }
            />
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
            <AdminTaggedTextField
              label="Абзац про возврат денег"
              value={draft.returnsModal.paragraphRefund}
              tag={resolveHeadingTag(draft.returnsModal.paragraphRefundTag, 'p')}
              multiline
              rows={3}
              onValueChange={(paragraphRefund) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, paragraphRefund } }))
              }
              onTagChange={(paragraphRefundTag) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, paragraphRefundTag } }))
              }
            />
            <AdminTaggedTextField
              label="Абзац про хранение"
              value={draft.returnsModal.paragraphStorage}
              tag={resolveHeadingTag(draft.returnsModal.paragraphStorageTag, 'p')}
              multiline
              rows={3}
              onValueChange={(paragraphStorage) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, paragraphStorage } }))
              }
              onTagChange={(paragraphStorageTag) =>
                update((p) => ({ ...p, returnsModal: { ...p.returnsModal, paragraphStorageTag } }))
              }
            />
          </div>
        </section>

        <Button type="submit">{dirty ? 'Сохранить изменения' : 'Сохранить'}</Button>
      </form>
    </div>
  )
}
