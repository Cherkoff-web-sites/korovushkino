'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import {
  CATEGORY_LABELS,
  type CategorySlug,
  type ProductData,
} from '@/lib/api/productsData'
import { productPageHref } from '@/lib/catalogPaths'
import { productUrlSlug } from '@/lib/productSeo'
import { adminInputClass } from '@/components/admin/adminStyles'
import AdminImageField from '@/components/admin/AdminImageField'

const categoryEntries = Object.entries(CATEGORY_LABELS) as [CategorySlug, string][]

export type AdminProductFormValues = {
  id: string
  urlSlug: string
  name: string
  series: string
  categorySlug: CategorySlug
  price: string
  description: string
  briefDescription: string
  catalogCardTeaser: string
  extraImages: string[]
  macrosPer100g: string
  kcal: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

function toFormValues(product?: ProductData | null): AdminProductFormValues {
  return {
    id: product?.id ?? '',
    urlSlug: product?.urlSlug ?? product?.id ?? '',
    name: product?.name ?? '',
    series: product?.series ?? '',
    categorySlug: product?.categorySlug ?? 'dairy',
    price: product ? String(product.price) : '',
    description: product?.description ?? '',
    briefDescription: product?.briefDescription ?? '',
    catalogCardTeaser: product?.catalogCardTeaser ?? '',
    extraImages: product?.images?.slice(1).filter(Boolean) ?? [],
    macrosPer100g: product?.modalNutrition?.macrosPer100g ?? '',
    kcal: product?.modalNutrition?.kcal ?? '',
    seoTitle: product?.seo?.title ?? '',
    seoDescription: product?.seo?.description ?? '',
    seoKeywords: product?.seo?.keywords ?? '',
  }
}

export default function AdminProductForm({
  initialProduct,
  isEdit = false,
  mainImage,
  onSubmit,
  onDelete,
}: {
  initialProduct?: ProductData | null
  isEdit?: boolean
  mainImage?: string
  onMainImageChange?: (url: string) => void
  onSubmit: (payload: Record<string, unknown>) => Promise<void>
  onDelete?: () => Promise<void>
}) {
  const [values, setValues] = useState<AdminProductFormValues>(() => toFormValues(initialProduct))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setValues(toFormValues(initialProduct))
  }, [initialProduct])

  const previewPath = useMemo(() => {
    const slug = productUrlSlug({ id: values.id || 'novyj-tovar', urlSlug: values.urlSlug })
    return productPageHref(slug)
  }, [values.id, values.urlSlug])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await onSubmit({
        id: values.id,
        urlSlug: values.urlSlug,
        name: values.name,
        series: values.series,
        categorySlug: values.categorySlug,
        price: Number(values.price),
        description: values.description,
        briefDescription: values.briefDescription,
        catalogCardTeaser: values.catalogCardTeaser,
        images: buildImagesList(mainImage, values.extraImages),
        modalNutrition:
          values.macrosPer100g || values.kcal
            ? { macrosPer100g: values.macrosPer100g, kcal: values.kcal }
            : undefined,
        seo: {
          title: values.seoTitle,
          description: values.seoDescription,
          keywords: values.seoKeywords,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить товар')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField<K extends keyof AdminProductFormValues>(key: K, value: AdminProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-[#1F1F1F]">Основное</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs text-[#707070]">Название</span>
            <input
              type="text"
              required
              value={values.name}
              onChange={(event) => updateField('name', event.target.value)}
              className={adminInputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#707070]">Серия / объём</span>
            <input
              type="text"
              required
              value={values.series}
              onChange={(event) => updateField('series', event.target.value)}
              className={adminInputClass}
              placeholder="2л"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#707070]">Цена, ₽</span>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={values.price}
              onChange={(event) => updateField('price', event.target.value)}
              className={adminInputClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs text-[#707070]">Категория</span>
            <select
              value={values.categorySlug}
              onChange={(event) => updateField('categorySlug', event.target.value as CategorySlug)}
              className={adminInputClass}
            >
              {categoryEntries.map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs text-[#707070]">Описание</span>
            <textarea
              required
              rows={4}
              value={values.description}
              onChange={(event) => updateField('description', event.target.value)}
              className={`${adminInputClass} resize-y`}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs text-[#707070]">Краткое описание</span>
            <textarea
              rows={2}
              value={values.briefDescription}
              onChange={(event) => updateField('briefDescription', event.target.value)}
              className={`${adminInputClass} resize-y`}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs text-[#707070]">Текст на карточке каталога</span>
            <textarea
              rows={2}
              value={values.catalogCardTeaser}
              onChange={(event) => updateField('catalogCardTeaser', event.target.value)}
              className={`${adminInputClass} resize-y`}
            />
          </label>

          <div className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs text-[#707070]">Дополнительные фото</span>
            <div className="space-y-4">
              {values.extraImages.map((url, index) => (
                <AdminImageField
                  key={`extra-${index}`}
                  label={`Доп. фото ${index + 1}`}
                  value={url}
                  onChange={(next) => {
                    const extraImages = [...values.extraImages]
                    extraImages[index] = next
                    updateField('extraImages', extraImages)
                  }}
                  onRemove={() => {
                    updateField(
                      'extraImages',
                      values.extraImages.filter((_, i) => i !== index)
                    )
                  }}
                  previewAspect="square"
                />
              ))}
              <button
                type="button"
                onClick={() => updateField('extraImages', [...values.extraImages, ''])}
                className="rounded-lg border border-[#e2e4ea] px-4 py-2 text-sm text-[#707070] hover:bg-[#f7f8fa]"
              >
                Добавить фото
              </button>
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#707070]">КБЖУ на 100 г</span>
            <input
              type="text"
              value={values.macrosPer100g}
              onChange={(event) => updateField('macrosPer100g', event.target.value)}
              className={adminInputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#707070]">Ккал</span>
            <input
              type="text"
              value={values.kcal}
              onChange={(event) => updateField('kcal', event.target.value)}
              className={adminInputClass}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 border-t border-[#e8eaef] pt-5">
        <div>
          <h3 className="text-sm font-semibold text-[#1F1F1F]">URL и SEO</h3>
          <p className="mt-1 text-xs text-[#707070]">
            Адрес страницы товара и мета-теги для поисковых систем.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isEdit ? (
            <label className="block">
              <span className="mb-1.5 block text-xs text-[#707070]">Внутренний ID</span>
              <input type="text" readOnly value={values.id} className={`${adminInputClass} bg-[#f7f8fa]`} />
            </label>
          ) : (
            <label className="block">
              <span className="mb-1.5 block text-xs text-[#707070]">Внутренний ID (необязательно)</span>
              <input
                type="text"
                value={values.id}
                onChange={(event) => updateField('id', event.target.value)}
                className={adminInputClass}
                placeholder="molochnoe-korovje"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#707070]">Адрес страницы (slug)</span>
            <div className="flex overflow-hidden rounded-lg border border-[#d8dce5] bg-white focus-within:border-[#3D8C13] focus-within:ring-2 focus-within:ring-[#3D8C13]/15">
              <span className="flex items-center bg-[#f7f8fa] px-3 text-xs text-[#707070]">/catalog/</span>
              <input
                type="text"
                required
                value={values.urlSlug}
                onChange={(event) => updateField('urlSlug', event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
                placeholder="sheya-svinaya-bez-kosti"
              />
              <span className="flex items-center bg-[#f7f8fa] px-3 text-xs text-[#707070]">/</span>
            </div>
            <p className="mt-1.5 font-mono text-xs text-[#3D8C13]">{previewPath}</p>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#707070]">SEO Title</span>
            <input
              type="text"
              value={values.seoTitle}
              onChange={(event) => updateField('seoTitle', event.target.value)}
              className={adminInputClass}
              placeholder="Шея свиная без кости — купить с доставкой | Коровушкино"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#707070]">SEO Description</span>
            <textarea
              rows={3}
              value={values.seoDescription}
              onChange={(event) => updateField('seoDescription', event.target.value)}
              className={`${adminInputClass} resize-y`}
              placeholder="Краткое описание для сниппета в поиске"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#707070]">SEO Keywords</span>
            <input
              type="text"
              value={values.seoKeywords}
              onChange={(event) => updateField('seoKeywords', event.target.value)}
              className={adminInputClass}
              placeholder="свинина, шея, фермерское мясо"
            />
          </label>
        </div>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Сохраняем...' : isEdit ? 'Сохранить изменения' : 'Создать товар'}
        </Button>
        {onDelete ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              if (window.confirm('Удалить этот товар из каталога?')) {
                void onDelete()
              }
            }}
            className="rounded-lg border border-red-300 px-6 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            Удалить
          </button>
        ) : null}
      </div>
    </form>
  )
}

function buildImagesList(mainImage: string | undefined, extraImages: string[]) {
  const extra = extraImages.map((item) => item.trim()).filter(Boolean)
  const primary = mainImage?.trim() || extra[0] || '/images/home/hero-bg.png'
  return [primary, ...extra.filter((item) => item !== primary)]
}
