'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { adminInputClass, adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import { useHomeContent } from '@/hooks/useHomeContent'
import type { HomeContent } from '@/lib/homeContent'
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

export default function HomeContentEditor() {
  const { content, save, reset } = useHomeContent()
  const { showToast } = useToast()
  const [draft, setDraft] = useState<HomeContent>(content)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setDraft(content)
  }, [content])

  function update(mutator: (prev: HomeContent) => HomeContent) {
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
    showToast('Главная страница сохранена')
  }

  return (
    <div>
      <AdminPageHeader
        title="Главная страница"
        description="Тексты и изображения блоков на главной."
        actions={
          <button
            type="button"
            onClick={() => {
              reset()
              setDraft(content)
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
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Hero-блок</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <Field label="Фоновое изображение (URL)">
              <input
                className={adminInputClass}
                value={draft.hero.backgroundImage}
                onChange={(e) =>
                  update((p) => ({ ...p, hero: { ...p.hero, backgroundImage: e.target.value } }))
                }
              />
            </Field>
            <Field label="Заголовок">
              <input
                className={adminInputClass}
                value={draft.hero.title}
                onChange={(e) => update((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
              />
            </Field>
            <Field label="Текст 1">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.hero.paragraph1}
                onChange={(e) =>
                  update((p) => ({ ...p, hero: { ...p.hero, paragraph1: e.target.value } }))
                }
              />
            </Field>
            <Field label="Текст 2">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.hero.paragraph2}
                onChange={(e) =>
                  update((p) => ({ ...p, hero: { ...p.hero, paragraph2: e.target.value } }))
                }
              />
            </Field>
            <Field label="Текст кнопки">
              <input
                className={adminInputClass}
                value={draft.hero.buttonText}
                onChange={(e) =>
                  update((p) => ({ ...p, hero: { ...p.hero, buttonText: e.target.value } }))
                }
              />
            </Field>
            <Field label="Ссылка кнопки">
              <input
                className={adminInputClass}
                value={draft.hero.buttonHref}
                onChange={(e) =>
                  update((p) => ({ ...p, hero: { ...p.hero, buttonHref: e.target.value } }))
                }
              />
            </Field>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Преимущества</h2>
          </div>
          <div className="space-y-4 p-4">
            {draft.benefits.map((item, index) => (
              <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label={`Иконка ${index + 1}`}>
                  <input
                    className={adminInputClass}
                    value={item.icon}
                    onChange={(e) =>
                      update((p) => {
                        const benefits = [...p.benefits]
                        benefits[index] = { ...benefits[index]!, icon: e.target.value }
                        return { ...p, benefits }
                      })
                    }
                  />
                </Field>
                <Field label={`Текст ${index + 1}`}>
                  <input
                    className={adminInputClass}
                    value={item.text}
                    onChange={(e) =>
                      update((p) => {
                        const benefits = [...p.benefits]
                        benefits[index] = { ...benefits[index]!, text: e.target.value }
                        return { ...p, benefits }
                      })
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Категории на главной</h2>
          </div>
          <div className="space-y-4 p-4">
            {draft.highlights.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label={`Название: ${item.id}`}>
                  <input
                    className={adminInputClass}
                    value={item.title}
                    onChange={(e) =>
                      update((p) => {
                        const highlights = [...p.highlights]
                        highlights[index] = { ...highlights[index]!, title: e.target.value }
                        return { ...p, highlights }
                      })
                    }
                  />
                </Field>
                <Field label="Изображение (URL)">
                  <input
                    className={adminInputClass}
                    value={item.backgroundImage}
                    onChange={(e) =>
                      update((p) => {
                        const highlights = [...p.highlights]
                        highlights[index] = { ...highlights[index]!, backgroundImage: e.target.value }
                        return { ...p, highlights }
                      })
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Блок «О нас»</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <Field label="Заголовок секции">
              <input
                className={adminInputClass}
                value={draft.about.sectionTitle}
                onChange={(e) =>
                  update((p) => ({ ...p, about: { ...p.about, sectionTitle: e.target.value } }))
                }
              />
            </Field>
            <Field label="Фото справа (верх)">
              <input
                className={adminInputClass}
                value={draft.about.row1RightImage}
                onChange={(e) =>
                  update((p) => ({ ...p, about: { ...p.about, row1RightImage: e.target.value } }))
                }
              />
            </Field>
            <Field label="Фото слева (низ)">
              <input
                className={adminInputClass}
                value={draft.about.row2LeftImage}
                onChange={(e) =>
                  update((p) => ({ ...p, about: { ...p.about, row2LeftImage: e.target.value } }))
                }
              />
            </Field>
            {draft.about.blocks.map((block, index) => (
              <div key={index} className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label={`Подзаголовок ${index + 1}`}>
                  <input
                    className={adminInputClass}
                    value={block.title}
                    onChange={(e) =>
                      update((p) => {
                        const blocks = [...p.about.blocks]
                        blocks[index] = { ...blocks[index]!, title: e.target.value }
                        return { ...p, about: { ...p.about, blocks } }
                      })
                    }
                  />
                </Field>
                <Field label={`Текст ${index + 1}`}>
                  <textarea
                    rows={3}
                    className={`${adminInputClass} resize-y`}
                    value={block.text}
                    onChange={(e) =>
                      update((p) => {
                        const blocks = [...p.about.blocks]
                        blocks[index] = { ...blocks[index]!, text: e.target.value }
                        return { ...p, about: { ...p.about, blocks } }
                      })
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Отзывы</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <Field label="Заголовок секции">
              <input
                className={adminInputClass}
                value={draft.reviews.sectionTitle}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    reviews: { ...p.reviews, sectionTitle: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Кнопка «Оставить отзыв»">
              <input
                className={adminInputClass}
                value={draft.reviews.leaveReviewButton}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    reviews: { ...p.reviews, leaveReviewButton: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Кнопка «Все отзывы»">
              <input
                className={adminInputClass}
                value={draft.reviews.allReviewsButton}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    reviews: { ...p.reviews, allReviewsButton: e.target.value },
                  }))
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
