'use client'

import { FormEvent, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import {
  CATEGORY_LABELS,
  type CategorySlug,
  type ProductData,
} from '@/lib/api/productsData'

const inputClassName =
  'w-full rounded-lg border border-[#D2B48C] px-4 py-3 text-sm outline-none transition-colors focus:border-[#3D8C13]'

const categoryEntries = Object.entries(CATEGORY_LABELS) as [CategorySlug, string][]

export type AdminProductFormValues = {
  id: string
  name: string
  series: string
  categorySlug: CategorySlug
  price: string
  description: string
  briefDescription: string
  catalogCardTeaser: string
  images: string
  macrosPer100g: string
  kcal: string
}

function toFormValues(product?: ProductData | null): AdminProductFormValues {
  return {
    id: product?.id ?? '',
    name: product?.name ?? '',
    series: product?.series ?? '',
    categorySlug: product?.categorySlug ?? 'dairy',
    price: product ? String(product.price) : '',
    description: product?.description ?? '',
    briefDescription: product?.briefDescription ?? '',
    catalogCardTeaser: product?.catalogCardTeaser ?? '',
    images: product?.images?.join('\n') ?? '',
    macrosPer100g: product?.modalNutrition?.macrosPer100g ?? '',
    kcal: product?.modalNutrition?.kcal ?? '',
  }
}

export default function AdminProductForm({
  initialProduct,
  isEdit = false,
  onSubmit,
  onDelete,
}: {
  initialProduct?: ProductData | null
  isEdit?: boolean
  onSubmit: (payload: Record<string, unknown>) => Promise<void>
  onDelete?: () => Promise<void>
}) {
  const [values, setValues] = useState<AdminProductFormValues>(() => toFormValues(initialProduct))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setValues(toFormValues(initialProduct))
  }, [initialProduct])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await onSubmit({
        id: values.id,
        name: values.name,
        series: values.series,
        categorySlug: values.categorySlug,
        price: Number(values.price),
        description: values.description,
        briefDescription: values.briefDescription,
        catalogCardTeaser: values.catalogCardTeaser,
        images: values.images.split('\n').map((item) => item.trim()).filter(Boolean),
        modalNutrition:
          values.macrosPer100g || values.kcal
            ? { macrosPer100g: values.macrosPer100g, kcal: values.kcal }
            : undefined,
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-[#707070]">
            ID (slug в URL){isEdit ? '' : ', можно оставить пустым'}
          </span>
          <input
            type="text"
            required={isEdit}
            readOnly={isEdit}
            value={values.id}
            onChange={(event) => updateField('id', event.target.value)}
            className={`${inputClassName} ${isEdit ? 'bg-[#f5f5f5]' : ''}`}
            placeholder="molochnoe-korovje"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-[#707070]">Название</span>
          <input
            type="text"
            required
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-[#707070]">Серия / объём</span>
          <input
            type="text"
            required
            value={values.series}
            onChange={(event) => updateField('series', event.target.value)}
            className={inputClassName}
            placeholder="2л"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-[#707070]">Цена, ₽</span>
          <input
            type="number"
            min="0"
            step="1"
            required
            value={values.price}
            onChange={(event) => updateField('price', event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-[#707070]">Категория</span>
          <select
            value={values.categorySlug}
            onChange={(event) => updateField('categorySlug', event.target.value as CategorySlug)}
            className={inputClassName}
          >
            {categoryEntries.map(([slug, label]) => (
              <option key={slug} value={slug}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-[#707070]">Описание</span>
          <textarea
            required
            rows={4}
            value={values.description}
            onChange={(event) => updateField('description', event.target.value)}
            className={`${inputClassName} resize-y`}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-[#707070]">Краткое описание</span>
          <textarea
            rows={2}
            value={values.briefDescription}
            onChange={(event) => updateField('briefDescription', event.target.value)}
            className={`${inputClassName} resize-y`}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-[#707070]">Текст на карточке каталога</span>
          <textarea
            rows={2}
            value={values.catalogCardTeaser}
            onChange={(event) => updateField('catalogCardTeaser', event.target.value)}
            className={`${inputClassName} resize-y`}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-[#707070]">Изображения (по одному URL на строку)</span>
          <textarea
            rows={3}
            value={values.images}
            onChange={(event) => updateField('images', event.target.value)}
            className={`${inputClassName} resize-y`}
            placeholder="/images/home/hero-bg.png"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-[#707070]">КБЖУ на 100 г</span>
          <input
            type="text"
            value={values.macrosPer100g}
            onChange={(event) => updateField('macrosPer100g', event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-[#707070]">Ккал</span>
          <input
            type="text"
            value={values.kcal}
            onChange={(event) => updateField('kcal', event.target.value)}
            className={inputClassName}
          />
        </label>
      </div>

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
