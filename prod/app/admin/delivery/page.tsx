'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { adminInputClass, adminPanelClass } from '@/components/admin/adminStyles'
import Button from '@/components/ui/Button'
import { useDeliverySettings } from '@/hooks/useDeliverySettings'
import type { DeliverySettings } from '@/lib/deliverySettings'
import { DEFAULT_DELIVERY_SETTINGS } from '@/lib/deliverySettings'
import { useToast } from '@/contexts/ToastContext'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-[#707070]">{label}</span>
      {children}
    </label>
  )
}

export default function AdminDeliveryPage() {
  const { settings, save, reset } = useDeliverySettings()
  const { showToast } = useToast()
  const [draft, setDraft] = useState<DeliverySettings>(settings)

  useEffect(() => {
    setDraft(settings)
  }, [settings])

  function update(mutator: (prev: DeliverySettings) => DeliverySettings) {
    setDraft((prev) => mutator(prev))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    void save(draft).then(() => {
      showToast('Настройки доставки сохранены')
    })
  }

  return (
    <div>
      <AdminPageHeader
        title="Доставка"
        description="Стоимость доставки по Москве, области и районам."
        actions={
          <button
            type="button"
            onClick={() => {
              void reset().then(() => {
                setDraft(DEFAULT_DELIVERY_SETTINGS)
                showToast('Сброшено к значениям по умолчанию')
              })
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
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Базовые тарифы</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <Field label="Москва (если район не выбран), ₽">
              <input
                type="number"
                min={0}
                className={adminInputClass}
                value={draft.moscowDefaultPrice}
                onChange={(e) =>
                  update((p) => ({ ...p, moscowDefaultPrice: Number(e.target.value) || 0 }))
                }
              />
            </Field>
            <Field label="Московская область, ₽">
              <input
                type="number"
                min={0}
                className={adminInputClass}
                value={draft.moscowRegionPrice}
                onChange={(e) =>
                  update((p) => ({ ...p, moscowRegionPrice: Number(e.target.value) || 0 }))
                }
              />
            </Field>
            <Field label="Другие города, ₽ (пусто = уточнять у менеджера)">
              <input
                type="number"
                min={0}
                className={adminInputClass}
                value={draft.outsideMoscowPrice ?? ''}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    outsideMoscowPrice: e.target.value === '' ? null : Number(e.target.value) || 0,
                  }))
                }
              />
            </Field>
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Районы Москвы</h2>
          </div>
          <div className="space-y-3 p-4">
            {draft.moscowDistricts.map((district, index) => (
              <div key={district.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
                <input
                  className={adminInputClass}
                  value={district.name}
                  onChange={(e) =>
                    update((p) => {
                      const moscowDistricts = [...p.moscowDistricts]
                      moscowDistricts[index] = { ...moscowDistricts[index]!, name: e.target.value }
                      return { ...p, moscowDistricts }
                    })
                  }
                />
                <input
                  type="number"
                  min={0}
                  className={adminInputClass}
                  value={district.price}
                  onChange={(e) =>
                    update((p) => {
                      const moscowDistricts = [...p.moscowDistricts]
                      moscowDistricts[index] = {
                        ...moscowDistricts[index]!,
                        price: Number(e.target.value) || 0,
                      }
                      return { ...p, moscowDistricts }
                    })
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className={adminPanelClass}>
          <div className="border-b border-[#e8eaef] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1F1F1F]">Распознавание города</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4">
            <Field label="Ключевые слова для Москвы (через запятую)">
              <input
                className={adminInputClass}
                value={draft.moscowKeywords.join(', ')}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    moscowKeywords: e.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </Field>
            <Field label="Ключевые слова для Московской области (через запятую)">
              <textarea
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={draft.regionKeywords.join(', ')}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    regionKeywords: e.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </Field>
          </div>
        </section>

        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  )
}
