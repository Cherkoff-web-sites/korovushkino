'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminImageField from '@/components/admin/AdminImageField'
import AdminTaggedTextField from '@/components/admin/AdminTaggedTextField'
import { adminInputClass, adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import { useHomeContent } from '@/hooks/useHomeContent'
import type { HomeContent } from '@/lib/homeContent'
import { DEFAULT_HOME_CONTENT } from '@/lib/homeContent'
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
              setDraft(DEFAULT_HOME_CONTENT)
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
            <div className="sm:col-span-2">
              <AdminImageField
                label="Фоновое изображение hero"
                value={draft.hero.backgroundImage}
                alt={draft.hero.backgroundImageAlt}
                onChange={(value) =>
                  update((p) => ({ ...p, hero: { ...p.hero, backgroundImage: value } }))
                }
                onAltChange={(backgroundImageAlt) =>
                  update((p) => ({ ...p, hero: { ...p.hero, backgroundImageAlt } }))
                }
                previewAspect="wide"
              />
            </div>
            <AdminTaggedTextField
              label="Заголовок"
              value={draft.hero.title}
              tag={resolveHeadingTag(draft.hero.titleTag, 'h1')}
              pageTitle
              onValueChange={(title) => update((p) => ({ ...p, hero: { ...p.hero, title } }))}
              onTagChange={(titleTag) => update((p) => ({ ...p, hero: { ...p.hero, titleTag } }))}
            />
            <AdminTaggedTextField
              label="Текст 1"
              value={draft.hero.paragraph1}
              tag={resolveHeadingTag(draft.hero.paragraph1Tag, 'p')}
              multiline
              rows={3}
              onValueChange={(paragraph1) => update((p) => ({ ...p, hero: { ...p.hero, paragraph1 } }))}
              onTagChange={(paragraph1Tag) =>
                update((p) => ({ ...p, hero: { ...p.hero, paragraph1Tag } }))
              }
            />
            <AdminTaggedTextField
              label="Текст 2"
              value={draft.hero.paragraph2}
              tag={resolveHeadingTag(draft.hero.paragraph2Tag, 'p')}
              multiline
              rows={3}
              onValueChange={(paragraph2) => update((p) => ({ ...p, hero: { ...p.hero, paragraph2 } }))}
              onTagChange={(paragraph2Tag) =>
                update((p) => ({ ...p, hero: { ...p.hero, paragraph2Tag } }))
              }
            />
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
              <div key={index} className="grid grid-cols-1 gap-4 border-b border-[#e8eaef] pb-4 last:border-b-0 last:pb-0 sm:grid-cols-2">
                <AdminImageField
                  label={`Иконка ${index + 1}`}
                  value={item.icon}
                  alt={item.iconAlt}
                  onChange={(value) =>
                    update((p) => {
                      const benefits = [...p.benefits]
                      benefits[index] = { ...benefits[index]!, icon: value }
                      return { ...p, benefits }
                    })
                  }
                  onAltChange={(iconAlt) =>
                    update((p) => {
                      const benefits = [...p.benefits]
                      benefits[index] = { ...benefits[index]!, iconAlt }
                      return { ...p, benefits }
                    })
                  }
                  previewAspect="square"
                />
                <AdminTaggedTextField
                  label={`Текст ${index + 1}`}
                  value={item.text}
                  tag={resolveHeadingTag(item.textTag, 'p')}
                  onValueChange={(text) =>
                    update((p) => {
                      const benefits = [...p.benefits]
                      benefits[index] = { ...benefits[index]!, text }
                      return { ...p, benefits }
                    })
                  }
                  onTagChange={(textTag) =>
                    update((p) => {
                      const benefits = [...p.benefits]
                      benefits[index] = { ...benefits[index]!, textTag }
                      return { ...p, benefits }
                    })
                  }
                />
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
              <div key={item.id} className="grid grid-cols-1 gap-4 border-b border-[#e8eaef] pb-4 last:border-b-0 sm:grid-cols-2">
                <AdminTaggedTextField
                  label={`Название: ${item.id}`}
                  value={item.title}
                  tag={resolveHeadingTag(item.titleTag, 'h3')}
                  onValueChange={(title) =>
                    update((p) => {
                      const highlights = [...p.highlights]
                      highlights[index] = { ...highlights[index]!, title }
                      return { ...p, highlights }
                    })
                  }
                  onTagChange={(titleTag) =>
                    update((p) => {
                      const highlights = [...p.highlights]
                      highlights[index] = { ...highlights[index]!, titleTag }
                      return { ...p, highlights }
                    })
                  }
                />
                <AdminImageField
                  label={`Изображение: ${item.id}`}
                  value={item.backgroundImage}
                  alt={item.backgroundImageAlt}
                  onChange={(value) =>
                    update((p) => {
                      const highlights = [...p.highlights]
                      highlights[index] = { ...highlights[index]!, backgroundImage: value }
                      return { ...p, highlights }
                    })
                  }
                  onAltChange={(backgroundImageAlt) =>
                    update((p) => {
                      const highlights = [...p.highlights]
                      highlights[index] = { ...highlights[index]!, backgroundImageAlt }
                      return { ...p, highlights }
                    })
                  }
                  previewAspect="video"
                />
              </div>
            ))}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Блок «О нас»</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <AdminTaggedTextField
              label="Заголовок секции"
              value={draft.about.sectionTitle}
              tag={resolveHeadingTag(draft.about.sectionTitleTag, 'h2')}
              onValueChange={(sectionTitle) =>
                update((p) => ({ ...p, about: { ...p.about, sectionTitle } }))
              }
              onTagChange={(sectionTitleTag) =>
                update((p) => ({ ...p, about: { ...p.about, sectionTitleTag } }))
              }
            />
            <AdminImageField
              label="Фото справа (верх)"
              value={draft.about.row1RightImage}
              alt={draft.about.row1RightImageAlt}
              onChange={(value) =>
                update((p) => ({ ...p, about: { ...p.about, row1RightImage: value } }))
              }
              onAltChange={(row1RightImageAlt) =>
                update((p) => ({ ...p, about: { ...p.about, row1RightImageAlt } }))
              }
              previewAspect="video"
            />
            <AdminImageField
              label="Фото слева (низ)"
              value={draft.about.row2LeftImage}
              alt={draft.about.row2LeftImageAlt}
              onChange={(value) =>
                update((p) => ({ ...p, about: { ...p.about, row2LeftImage: value } }))
              }
              onAltChange={(row2LeftImageAlt) =>
                update((p) => ({ ...p, about: { ...p.about, row2LeftImageAlt } }))
              }
              previewAspect="video"
            />
            {draft.about.blocks.map((block, index) => (
              <div key={index} className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AdminTaggedTextField
                  label={`Подзаголовок ${index + 1}`}
                  value={block.title}
                  tag={resolveHeadingTag(block.titleTag, 'h3')}
                  onValueChange={(title) =>
                    update((p) => {
                      const blocks = [...p.about.blocks]
                      blocks[index] = { ...blocks[index]!, title }
                      return { ...p, about: { ...p.about, blocks } }
                    })
                  }
                  onTagChange={(titleTag) =>
                    update((p) => {
                      const blocks = [...p.about.blocks]
                      blocks[index] = { ...blocks[index]!, titleTag }
                      return { ...p, about: { ...p.about, blocks } }
                    })
                  }
                />
                <AdminTaggedTextField
                  label={`Текст ${index + 1}`}
                  value={block.text}
                  tag={resolveHeadingTag(block.textTag, 'p')}
                  multiline
                  rows={3}
                  onValueChange={(text) =>
                    update((p) => {
                      const blocks = [...p.about.blocks]
                      blocks[index] = { ...blocks[index]!, text }
                      return { ...p, about: { ...p.about, blocks } }
                    })
                  }
                  onTagChange={(textTag) =>
                    update((p) => {
                      const blocks = [...p.about.blocks]
                      blocks[index] = { ...blocks[index]!, textTag }
                      return { ...p, about: { ...p.about, blocks } }
                    })
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Отзывы на главной</h2>
            <p className="mt-1 text-xs text-[#707070]">Заголовок секции, кнопки и сами отзывы в карусели.</p>
          </div>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AdminTaggedTextField
                label="Заголовок секции"
                value={draft.reviews.sectionTitle}
                tag={resolveHeadingTag(draft.reviews.sectionTitleTag, 'h2')}
                onValueChange={(sectionTitle) =>
                  update((p) => ({
                    ...p,
                    reviews: { ...p.reviews, sectionTitle },
                  }))
                }
                onTagChange={(sectionTitleTag) =>
                  update((p) => ({
                    ...p,
                    reviews: { ...p.reviews, sectionTitleTag },
                  }))
                }
              />
              <Field label="Подпись ответа магазина">
                <input
                  className={adminInputClass}
                  value={draft.reviews.replyAuthorLabel}
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      reviews: { ...p.reviews, replyAuthorLabel: e.target.value },
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

            {draft.reviews.items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg border border-[#e8eaef] p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[#1F1F1F]">Отзыв {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        reviews: {
                          ...p.reviews,
                          items: p.reviews.items.filter((_, i) => i !== index),
                        },
                      }))
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Удалить
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Имя автора">
                    <input
                      className={adminInputClass}
                      value={item.authorName}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.reviews.items]
                          items[index] = { ...items[index]!, authorName: e.target.value }
                          return { ...p, reviews: { ...p.reviews, items } }
                        })
                      }
                    />
                  </Field>
                  <Field label="Товар">
                    <input
                      className={adminInputClass}
                      value={item.productLabel}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.reviews.items]
                          items[index] = { ...items[index]!, productLabel: e.target.value }
                          return { ...p, reviews: { ...p.reviews, items } }
                        })
                      }
                    />
                  </Field>
                  <Field label="Дата отзыва">
                    <input
                      className={adminInputClass}
                      value={item.date}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.reviews.items]
                          items[index] = { ...items[index]!, date: e.target.value }
                          return { ...p, reviews: { ...p.reviews, items } }
                        })
                      }
                    />
                  </Field>
                  <Field label="Дата ответа">
                    <input
                      className={adminInputClass}
                      value={item.replyDate}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.reviews.items]
                          items[index] = { ...items[index]!, replyDate: e.target.value }
                          return { ...p, reviews: { ...p.reviews, items } }
                        })
                      }
                    />
                  </Field>
                  <Field label="Оценка (1–5)">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      className={adminInputClass}
                      value={item.rating}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.reviews.items]
                          items[index] = {
                            ...items[index]!,
                            rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)),
                          }
                          return { ...p, reviews: { ...p.reviews, items } }
                        })
                      }
                    />
                  </Field>
                  <Field label="Текст отзыва">
                    <textarea
                      rows={3}
                      className={`${adminInputClass} resize-y sm:col-span-2`}
                      value={item.text}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.reviews.items]
                          items[index] = { ...items[index]!, text: e.target.value }
                          return { ...p, reviews: { ...p.reviews, items } }
                        })
                      }
                    />
                  </Field>
                  <Field label="Текст ответа магазина">
                    <textarea
                      rows={3}
                      className={`${adminInputClass} resize-y sm:col-span-2`}
                      value={item.replyText}
                      onChange={(e) =>
                        update((p) => {
                          const items = [...p.reviews.items]
                          items[index] = { ...items[index]!, replyText: e.target.value }
                          return { ...p, reviews: { ...p.reviews, items } }
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                update((p) => ({
                  ...p,
                  reviews: {
                    ...p.reviews,
                    items: [
                      ...p.reviews.items,
                      {
                        id: `review-${Date.now()}`,
                        authorName: 'Новый автор',
                        date: '01.01.2026',
                        replyDate: '02.01.2026',
                        productLabel: 'Товар',
                        rating: 5,
                        text: 'Текст отзыва',
                        replyText: 'Спасибо за отзыв!',
                      },
                    ],
                  },
                }))
              }
              className="rounded-lg border border-[#e2e4ea] px-4 py-2 text-sm text-[#707070] hover:bg-[#f7f8fa]"
            >
              Добавить отзыв
            </button>
          </div>
        </section>

        <Button type="submit">{dirty ? 'Сохранить изменения' : 'Сохранить'}</Button>
      </form>
    </div>
  )
}
