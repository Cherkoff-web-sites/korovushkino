'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminImageField from '@/components/admin/AdminImageField'
import AdminTaggedTextField from '@/components/admin/AdminTaggedTextField'
import AdminContentBlocksField from '@/components/admin/AdminContentBlocksField'
import { adminInputClass, adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import { useToast } from '@/contexts/ToastContext'
import { usePagesContent } from '@/hooks/usePagesContent'
import type { AboutBlock, PagesContent } from '@/lib/pagesContent'
import { DEFAULT_PAGES_CONTENT, linesToText, textToLines } from '@/lib/pagesContent'
import { resolveHeadingTag } from '@/lib/contentBlocks'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-[#707070]">{label}</span>
      {children}
    </label>
  )
}

function AboutBlockEditor({
  title,
  block,
  onChange,
}: {
  title: string
  block: AboutBlock
  onChange: (next: AboutBlock) => void
}) {
  return (
    <div className="space-y-4 rounded-lg border border-[#e8eaef] p-4">
      <h3 className="text-sm font-semibold text-[#1F1F1F]">{title}</h3>
      <AdminTaggedTextField
        label="Заголовок блока"
        value={block.title}
        tag={resolveHeadingTag(block.titleTag, 'h2')}
        onValueChange={(value) => onChange({ ...block, title: value })}
        onTagChange={(titleTag) => onChange({ ...block, titleTag })}
      />
      <AdminContentBlocksField
        label="Текст блока (h2 / h3 / абзацы)"
        blocks={block.blocks}
        onChange={(blocks) => onChange({ ...block, blocks })}
      />
      <AdminImageField
        label="Изображение"
        value={block.image}
        alt={block.imageAlt}
        onChange={(value) => onChange({ ...block, image: value })}
        onAltChange={(imageAlt) => onChange({ ...block, imageAlt })}
        previewAspect="video"
      />
    </div>
  )
}

export default function AdminPagesEditor() {
  const { content, save, reset } = usePagesContent()
  const { showToast } = useToast()
  const [draft, setDraft] = useState<PagesContent>(content)

  useEffect(() => {
    setDraft(content)
  }, [content])

  function update(mutator: (prev: PagesContent) => PagesContent) {
    setDraft((prev) => mutator(prev))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    save(draft)
    showToast('Страницы сайта сохранены')
  }

  return (
    <div>
      <AdminPageHeader
        title="Страницы сайта"
        description="Тексты и изображения: О нас, Контакты, Доставка и оплата, Корзины."
        actions={
          <button
            type="button"
            onClick={() => {
              reset()
              setDraft(DEFAULT_PAGES_CONTENT)
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
            <h2 className="text-sm font-semibold text-[#1F1F1F]">О нас</h2>
          </div>
          <div className="space-y-4 p-4">
            <AdminTaggedTextField
              label="Заголовок страницы"
              value={draft.about.pageTitle}
              tag={resolveHeadingTag(draft.about.pageTitleTag, 'h1')}
              pageTitle
              onValueChange={(pageTitle) => update((p) => ({ ...p, about: { ...p.about, pageTitle } }))}
              onTagChange={(pageTitleTag) => update((p) => ({ ...p, about: { ...p.about, pageTitleTag } }))}
            />
            <AboutBlockEditor
              title="Блок «С чего всё началось»"
              block={draft.about.origin}
              onChange={(origin) => update((p) => ({ ...p, about: { ...p.about, origin } }))}
            />
            <AboutBlockEditor
              title="Блок «Наше хозяйство»"
              block={draft.about.farm}
              onChange={(farm) => update((p) => ({ ...p, about: { ...p.about, farm } }))}
            />
            <AboutBlockEditor
              title="Блок «Как мы делаем продукты»"
              block={draft.about.production}
              onChange={(production) => update((p) => ({ ...p, about: { ...p.about, production } }))}
            />
            <div className="space-y-4 rounded-lg border border-[#e8eaef] p-4">
              <h3 className="text-sm font-semibold text-[#1F1F1F]">Блок «Почему мы это делаем»</h3>
              <AdminTaggedTextField
                label="Заголовок"
                value={draft.about.why.title}
                tag={resolveHeadingTag(draft.about.why.titleTag, 'h2')}
                onValueChange={(title) =>
                  update((p) => ({ ...p, about: { ...p.about, why: { ...p.about.why, title } } }))
                }
                onTagChange={(titleTag) =>
                  update((p) => ({ ...p, about: { ...p.about, why: { ...p.about.why, titleTag } } }))
                }
              />
              <AdminContentBlocksField
                label="Текст блока"
                blocks={draft.about.why.blocks}
                onChange={(blocks) =>
                  update((p) => ({ ...p, about: { ...p.about, why: { ...p.about.why, blocks } } }))
                }
              />
            </div>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Контакты</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <AdminTaggedTextField
              label="Заголовок страницы"
              value={draft.contact.pageTitle}
              tag={resolveHeadingTag(draft.contact.pageTitleTag, 'h1')}
              pageTitle
              onValueChange={(pageTitle) => update((p) => ({ ...p, contact: { ...p.contact, pageTitle } }))}
              onTagChange={(pageTitleTag) =>
                update((p) => ({ ...p, contact: { ...p.contact, pageTitleTag } }))
              }
            />
            <AdminTaggedTextField
              label="Заголовок блока поддержки"
              value={draft.contact.supportTitle}
              tag={resolveHeadingTag(draft.contact.supportTitleTag, 'h2')}
              onValueChange={(supportTitle) =>
                update((p) => ({ ...p, contact: { ...p.contact, supportTitle } }))
              }
              onTagChange={(supportTitleTag) =>
                update((p) => ({ ...p, contact: { ...p.contact, supportTitleTag } }))
              }
            />
            <Field label="Телефон (отображение)">
              <input
                className={adminInputClass}
                value={draft.contact.phoneDisplay}
                onChange={(e) =>
                  update((p) => ({ ...p, contact: { ...p.contact, phoneDisplay: e.target.value } }))
                }
              />
            </Field>
            <Field label="Телефон (ссылка tel:)">
              <input
                className={adminInputClass}
                value={draft.contact.phoneHref}
                onChange={(e) => update((p) => ({ ...p, contact: { ...p.contact, phoneHref: e.target.value } }))}
              />
            </Field>
            <Field label="Email">
              <input
                className={adminInputClass}
                value={draft.contact.email}
                onChange={(e) => update((p) => ({ ...p, contact: { ...p.contact, email: e.target.value } }))}
              />
            </Field>
            <AdminTaggedTextField
              label="Заголовок соцсетей"
              value={draft.contact.socialTitle}
              tag={resolveHeadingTag(draft.contact.socialTitleTag, 'h2')}
              onValueChange={(socialTitle) =>
                update((p) => ({ ...p, contact: { ...p.contact, socialTitle } }))
              }
              onTagChange={(socialTitleTag) =>
                update((p) => ({ ...p, contact: { ...p.contact, socialTitleTag } }))
              }
            />
            <AdminTaggedTextField
              label="Заголовок юридической информации"
              value={draft.contact.legalTitle}
              tag={resolveHeadingTag(draft.contact.legalTitleTag, 'h2')}
              onValueChange={(legalTitle) =>
                update((p) => ({ ...p, contact: { ...p.contact, legalTitle } }))
              }
              onTagChange={(legalTitleTag) =>
                update((p) => ({ ...p, contact: { ...p.contact, legalTitleTag } }))
              }
            />
            <p className="text-xs text-[#707070] sm:col-span-2">
              Ссылки на соцсети редактируются в разделе «Подвал и попапы».
            </p>
            <div className="sm:col-span-2">
              <AdminImageField
                label="Изображение справа"
                value={draft.contact.sideImage}
                alt={draft.contact.sideImageAlt}
                onChange={(value) => update((p) => ({ ...p, contact: { ...p.contact, sideImage: value } }))}
                onAltChange={(sideImageAlt) =>
                  update((p) => ({ ...p, contact: { ...p.contact, sideImageAlt } }))
                }
                previewAspect="square"
              />
            </div>
            <div className="sm:col-span-2">
              <Field label="Юридическая информация (каждая строка с новой строки)">
                <textarea
                  rows={8}
                  className={`${adminInputClass} resize-y`}
                  value={linesToText(draft.contact.legalLines)}
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      contact: { ...p.contact, legalLines: textToLines(e.target.value) },
                    }))
                  }
                />
              </Field>
            </div>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Доставка и оплата</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <AdminTaggedTextField
              label="Заголовок страницы (доставка)"
              value={draft.deliveryPayment.pageTitle}
              tag={resolveHeadingTag(draft.deliveryPayment.pageTitleTag, 'h1')}
              pageTitle
              onValueChange={(pageTitle) =>
                update((p) => ({ ...p, deliveryPayment: { ...p.deliveryPayment, pageTitle } }))
              }
              onTagChange={(pageTitleTag) =>
                update((p) => ({ ...p, deliveryPayment: { ...p.deliveryPayment, pageTitleTag } }))
              }
            />
            <div className="sm:col-span-2">
              <AdminImageField
                label="Изображение блока доставки"
                value={draft.deliveryPayment.sideImage}
                alt={draft.deliveryPayment.sideImageAlt}
                onChange={(value) =>
                  update((p) => ({ ...p, deliveryPayment: { ...p.deliveryPayment, sideImage: value } }))
                }
                onAltChange={(sideImageAlt) =>
                  update((p) => ({ ...p, deliveryPayment: { ...p.deliveryPayment, sideImageAlt } }))
                }
                previewAspect="video"
              />
            </div>
            {draft.deliveryPayment.facts.map((fact, index) => (
              <div key={index} className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2">
                <Field label={`Факт ${index + 1} — текст`}>
                  <input
                    className={adminInputClass}
                    value={fact.label}
                    onChange={(e) =>
                      update((p) => {
                        const facts = [...p.deliveryPayment.facts]
                        facts[index] = { ...facts[index]!, label: e.target.value }
                        return { ...p, deliveryPayment: { ...p.deliveryPayment, facts } }
                      })
                    }
                  />
                </Field>
                <Field label={`Факт ${index + 1} — значение (можно пусто)`}>
                  <input
                    className={adminInputClass}
                    value={fact.value}
                    onChange={(e) =>
                      update((p) => {
                        const facts = [...p.deliveryPayment.facts]
                        facts[index] = { ...facts[index]!, value: e.target.value }
                        return { ...p, deliveryPayment: { ...p.deliveryPayment, facts } }
                      })
                    }
                  />
                </Field>
              </div>
            ))}
            <AdminTaggedTextField
              label="Заголовок блока тарифов"
              value={draft.deliveryPayment.calculatorTitle}
              tag={resolveHeadingTag(draft.deliveryPayment.calculatorTitleTag, 'h2')}
              onValueChange={(calculatorTitle) =>
                update((p) => ({
                  ...p,
                  deliveryPayment: { ...p.deliveryPayment, calculatorTitle },
                }))
              }
              onTagChange={(calculatorTitleTag) =>
                update((p) => ({
                  ...p,
                  deliveryPayment: { ...p.deliveryPayment, calculatorTitleTag },
                }))
              }
            />
            <AdminTaggedTextField
              label="Текст блока тарифов"
              value={draft.deliveryPayment.calculatorText}
              tag={resolveHeadingTag(draft.deliveryPayment.calculatorTextTag, 'p')}
              multiline
              rows={3}
              onValueChange={(calculatorText) =>
                update((p) => ({
                  ...p,
                  deliveryPayment: { ...p.deliveryPayment, calculatorText },
                }))
              }
              onTagChange={(calculatorTextTag) =>
                update((p) => ({
                  ...p,
                  deliveryPayment: { ...p.deliveryPayment, calculatorTextTag },
                }))
              }
            />
            <AdminTaggedTextField
              label="Заголовок блока оплаты"
              value={draft.deliveryPayment.paymentTitle}
              tag={resolveHeadingTag(draft.deliveryPayment.paymentTitleTag, 'h2')}
              onValueChange={(paymentTitle) =>
                update((p) => ({
                  ...p,
                  deliveryPayment: { ...p.deliveryPayment, paymentTitle },
                }))
              }
              onTagChange={(paymentTitleTag) =>
                update((p) => ({
                  ...p,
                  deliveryPayment: { ...p.deliveryPayment, paymentTitleTag },
                }))
              }
            />
            {draft.deliveryPayment.paymentMethods.map((method, index) => (
              <div key={method.id} className="rounded-lg border border-[#e8eaef] p-3">
                <Field label={`Способ оплаты: ${method.id}`}>
                  <input
                    className={adminInputClass}
                    value={method.label}
                    onChange={(e) =>
                      update((p) => {
                        const paymentMethods = [...p.deliveryPayment.paymentMethods]
                        paymentMethods[index] = { ...paymentMethods[index]!, label: e.target.value }
                        return { ...p, deliveryPayment: { ...p.deliveryPayment, paymentMethods } }
                      })
                    }
                  />
                </Field>
                <label className="mt-2 flex items-center gap-2 text-sm text-[#707070]">
                  <input
                    type="checkbox"
                    checked={method.enabled}
                    onChange={(e) =>
                      update((p) => {
                        const paymentMethods = [...p.deliveryPayment.paymentMethods]
                        paymentMethods[index] = { ...paymentMethods[index]!, enabled: e.target.checked }
                        return { ...p, deliveryPayment: { ...p.deliveryPayment, paymentMethods } }
                      })
                    }
                  />
                  Доступен на сайте
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Продуктовые корзины</h2>
          </div>
          <div className="space-y-4 p-4">
            <AdminTaggedTextField
              label="Заголовок страницы"
              value={draft.baskets.pageTitle}
              tag={resolveHeadingTag(draft.baskets.pageTitleTag, 'h1')}
              pageTitle
              onValueChange={(pageTitle) => update((p) => ({ ...p, baskets: { ...p.baskets, pageTitle } }))}
              onTagChange={(pageTitleTag) =>
                update((p) => ({ ...p, baskets: { ...p.baskets, pageTitleTag } }))
              }
            />
            <AdminTaggedTextField
              label="Вступительный текст"
              value={draft.baskets.intro}
              tag={resolveHeadingTag(draft.baskets.introTag, 'p')}
              multiline
              rows={3}
              onValueChange={(intro) => update((p) => ({ ...p, baskets: { ...p.baskets, intro } }))}
              onTagChange={(introTag) => update((p) => ({ ...p, baskets: { ...p.baskets, introTag } }))}
            />
            {draft.baskets.items.map((item, index) => (
              <div key={item.id} className="space-y-4 rounded-lg border border-[#e8eaef] p-4">
                <h3 className="text-sm font-semibold text-[#1F1F1F]">{item.title || `Корзина ${index + 1}`}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <AdminTaggedTextField
                    label="Название"
                    value={item.title}
                    tag={resolveHeadingTag(item.titleTag, 'h2')}
                    onValueChange={(title) =>
                      update((p) => {
                        const items = [...p.baskets.items]
                        items[index] = { ...items[index]!, title }
                        return { ...p, baskets: { ...p.baskets, items } }
                      })
                    }
                    onTagChange={(titleTag) =>
                      update((p) => {
                        const items = [...p.baskets.items]
                        items[index] = { ...items[index]!, titleTag }
                        return { ...p, baskets: { ...p.baskets, items } }
                      })
                    }
                  />
                  <Field label="Цена, ₽">
                    <input
                      type="number"
                      min={0}
                      className={adminInputClass}
                      value={item.price}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.baskets.items]
                          items[index] = { ...items[index]!, price: Number(e.target.value) || 0 }
                          return { ...p, baskets: { ...p.baskets, items } }
                        })
                      }
                    />
                  </Field>
                </div>
                <AdminTaggedTextField
                  label="Описание"
                  value={item.description}
                  tag={resolveHeadingTag(item.descriptionTag, 'p')}
                  multiline
                  rows={4}
                  onValueChange={(description) =>
                    update((p) => {
                      const items = [...p.baskets.items]
                      items[index] = { ...items[index]!, description }
                      return { ...p, baskets: { ...p.baskets, items } }
                    })
                  }
                  onTagChange={(descriptionTag) =>
                    update((p) => {
                      const items = [...p.baskets.items]
                      items[index] = { ...items[index]!, descriptionTag }
                      return { ...p, baskets: { ...p.baskets, items } }
                    })
                  }
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="На 100 г">
                    <input
                      className={adminInputClass}
                      value={item.nutritionPer100}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.baskets.items]
                          items[index] = { ...items[index]!, nutritionPer100: e.target.value }
                          return { ...p, baskets: { ...p.baskets, items } }
                        })
                      }
                    />
                  </Field>
                  <Field label="Калорийность">
                    <input
                      className={adminInputClass}
                      value={item.calories}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.baskets.items]
                          items[index] = { ...items[index]!, calories: e.target.value }
                          return { ...p, baskets: { ...p.baskets, items } }
                        })
                      }
                    />
                  </Field>
                </div>
                <AdminImageField
                  label="Изображение корзины"
                  value={item.image}
                  alt={item.imageAlt}
                  onChange={(value) =>
                    update((p) => {
                      const items = [...p.baskets.items]
                      items[index] = { ...items[index]!, image: value }
                      return { ...p, baskets: { ...p.baskets, items } }
                    })
                  }
                  onAltChange={(imageAlt) =>
                    update((p) => {
                      const items = [...p.baskets.items]
                      items[index] = { ...items[index]!, imageAlt }
                      return { ...p, baskets: { ...p.baskets, items } }
                    })
                  }
                  previewAspect="video"
                />
              </div>
            ))}
          </div>
        </section>

        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  )
}
