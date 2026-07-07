'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminImageField from '@/components/admin/AdminImageField'
import { adminInputClass, adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import { useToast } from '@/contexts/ToastContext'
import { usePagesContent } from '@/hooks/usePagesContent'
import type { AboutBlock, PagesContent } from '@/lib/pagesContent'
import {
  DEFAULT_PAGES_CONTENT,
  linesToText,
  paragraphsToText,
  textToLines,
  textToParagraphs,
} from '@/lib/pagesContent'

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
      <Field label="Заголовок блока">
        <input
          className={adminInputClass}
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
        />
      </Field>
      <Field label="Текст (абзацы через пустую строку)">
        <textarea
          rows={5}
          className={`${adminInputClass} resize-y`}
          value={paragraphsToText(block.paragraphs)}
          onChange={(e) => onChange({ ...block, paragraphs: textToParagraphs(e.target.value) })}
        />
      </Field>
      <AdminImageField
        label="Изображение"
        value={block.image}
        onChange={(value) => onChange({ ...block, image: value })}
        previewAspect="video"
      />
      <Field label="Подпись к изображению (alt)">
        <input
          className={adminInputClass}
          value={block.imageAlt}
          onChange={(e) => onChange({ ...block, imageAlt: e.target.value })}
        />
      </Field>
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
            <Field label="Заголовок страницы">
              <input
                className={adminInputClass}
                value={draft.about.pageTitle}
                onChange={(e) => update((p) => ({ ...p, about: { ...p.about, pageTitle: e.target.value } }))}
              />
            </Field>
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
              <Field label="Заголовок">
                <input
                  className={adminInputClass}
                  value={draft.about.why.title}
                  onChange={(e) =>
                    update((p) => ({ ...p, about: { ...p.about, why: { ...p.about.why, title: e.target.value } } }))
                  }
                />
              </Field>
              <Field label="Текст (абзацы через пустую строку)">
                <textarea
                  rows={5}
                  className={`${adminInputClass} resize-y`}
                  value={paragraphsToText(draft.about.why.paragraphs)}
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      about: { ...p.about, why: { ...p.about.why, paragraphs: textToParagraphs(e.target.value) } },
                    }))
                  }
                />
              </Field>
            </div>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Контакты</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <Field label="Заголовок страницы">
              <input
                className={adminInputClass}
                value={draft.contact.pageTitle}
                onChange={(e) => update((p) => ({ ...p, contact: { ...p.contact, pageTitle: e.target.value } }))}
              />
            </Field>
            <Field label="Заголовок блока поддержки">
              <input
                className={adminInputClass}
                value={draft.contact.supportTitle}
                onChange={(e) =>
                  update((p) => ({ ...p, contact: { ...p.contact, supportTitle: e.target.value } }))
                }
              />
            </Field>
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
            <Field label="Заголовок соцсетей">
              <input
                className={adminInputClass}
                value={draft.contact.socialTitle}
                onChange={(e) =>
                  update((p) => ({ ...p, contact: { ...p.contact, socialTitle: e.target.value } }))
                }
              />
            </Field>
            <p className="text-xs text-[#707070] sm:col-span-2">
              Ссылки на соцсети редактируются в разделе «Подвал и попапы».
            </p>
            <div className="sm:col-span-2">
              <AdminImageField
                label="Изображение справа"
                value={draft.contact.sideImage}
                onChange={(value) => update((p) => ({ ...p, contact: { ...p.contact, sideImage: value } }))}
                previewAspect="square"
              />
            </div>
            <Field label="Подпись к изображению (alt)">
              <input
                className={adminInputClass}
                value={draft.contact.sideImageAlt}
                onChange={(e) =>
                  update((p) => ({ ...p, contact: { ...p.contact, sideImageAlt: e.target.value } }))
                }
              />
            </Field>
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
            <Field label="Заголовок страницы (доставка)">
              <input
                className={adminInputClass}
                value={draft.deliveryPayment.pageTitle}
                onChange={(e) =>
                  update((p) => ({ ...p, deliveryPayment: { ...p.deliveryPayment, pageTitle: e.target.value } }))
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <AdminImageField
                label="Изображение блока доставки"
                value={draft.deliveryPayment.sideImage}
                onChange={(value) =>
                  update((p) => ({ ...p, deliveryPayment: { ...p.deliveryPayment, sideImage: value } }))
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
            <Field label="Заголовок калькулятора">
              <input
                className={adminInputClass}
                value={draft.deliveryPayment.calculatorTitle}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    deliveryPayment: { ...p.deliveryPayment, calculatorTitle: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Текст калькулятора">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.deliveryPayment.calculatorText}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    deliveryPayment: { ...p.deliveryPayment, calculatorText: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Плейсхолдер поля адреса">
              <input
                className={adminInputClass}
                value={draft.deliveryPayment.calculatorPlaceholder}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    deliveryPayment: { ...p.deliveryPayment, calculatorPlaceholder: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Текст кнопки">
              <input
                className={adminInputClass}
                value={draft.deliveryPayment.calculatorButton}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    deliveryPayment: { ...p.deliveryPayment, calculatorButton: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Заголовок блока оплаты">
              <input
                className={adminInputClass}
                value={draft.deliveryPayment.paymentTitle}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    deliveryPayment: { ...p.deliveryPayment, paymentTitle: e.target.value },
                  }))
                }
              />
            </Field>
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
            <Field label="Заголовок страницы">
              <input
                className={adminInputClass}
                value={draft.baskets.pageTitle}
                onChange={(e) => update((p) => ({ ...p, baskets: { ...p.baskets, pageTitle: e.target.value } }))}
              />
            </Field>
            <Field label="Вступительный текст">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.baskets.intro}
                onChange={(e) => update((p) => ({ ...p, baskets: { ...p.baskets, intro: e.target.value } }))}
              />
            </Field>
            {draft.baskets.items.map((item, index) => (
              <div key={item.id} className="space-y-4 rounded-lg border border-[#e8eaef] p-4">
                <h3 className="text-sm font-semibold text-[#1F1F1F]">{item.title || `Корзина ${index + 1}`}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Название">
                    <input
                      className={adminInputClass}
                      value={item.title}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.baskets.items]
                          items[index] = { ...items[index]!, title: e.target.value }
                          return { ...p, baskets: { ...p.baskets, items } }
                        })
                      }
                    />
                  </Field>
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
                <Field label="Описание">
                  <textarea
                    rows={4}
                    className={`${adminInputClass} resize-y`}
                    value={item.description}
                    onChange={(e) =>
                      update((p) => {
                        const items = [...p.baskets.items]
                        items[index] = { ...items[index]!, description: e.target.value }
                        return { ...p, baskets: { ...p.baskets, items } }
                      })
                    }
                  />
                </Field>
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
                  onChange={(value) =>
                    update((p) => {
                      const items = [...p.baskets.items]
                      items[index] = { ...items[index]!, image: value }
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
