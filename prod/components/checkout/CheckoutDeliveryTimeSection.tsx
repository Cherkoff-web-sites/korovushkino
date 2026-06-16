'use client'

import type { DeliveryTime } from '@/components/checkout/checkoutTypes'
import {
  checkoutInputClass,
  checkoutSectionClass,
  checkoutSectionDividerClass,
  checkoutSectionTitleClass,
} from '@/components/checkout/checkoutStyles'
import { EditIcon } from '@/components/checkout/CheckoutIcons'

type CheckoutDeliveryTimeSectionProps = {
  value: DeliveryTime | null
  editing: boolean
  draft: DeliveryTime
  onStartEdit: () => void
  onDraftChange: (draft: DeliveryTime) => void
  onSave: () => void
}

export default function CheckoutDeliveryTimeSection({
  value,
  editing,
  draft,
  onStartEdit,
  onDraftChange,
  onSave,
}: CheckoutDeliveryTimeSectionProps) {
  return (
    <section className={checkoutSectionClass}>
      <h2 className={checkoutSectionTitleClass}>Дата и время доставки</h2>

      {!editing && value ? (
        <div className={`mt-4 flex items-center justify-between gap-3 border-t ${checkoutSectionDividerClass} pt-4`}>
          <p className="text-sm text-[#1F1F1F] sm:text-[15px]">
            {value.date} {value.time}
          </p>
          <button
            type="button"
            onClick={onStartEdit}
            className="shrink-0 rounded-lg p-1.5 text-[#232326]/55 transition-colors hover:bg-white hover:text-[#3D8C13]"
            aria-label="Изменить дату и время"
          >
            <EditIcon />
          </button>
        </div>
      ) : null}

      {editing ? (
        <div className={`mt-4 space-y-3 border-t ${checkoutSectionDividerClass} pt-4`}>
          <label className="block">
            <span className="mb-1.5 block text-sm text-[#232326]/70">Дата</span>
            <input
              type="text"
              value={draft.date}
              onChange={(event) => onDraftChange({ ...draft, date: event.target.value })}
              placeholder="ДД.ММ.ГГГГ"
              className={checkoutInputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-[#232326]/70">Время</span>
            <input
              type="text"
              value={draft.time}
              onChange={(event) => onDraftChange({ ...draft, time: event.target.value })}
              placeholder="9–21:00"
              className={checkoutInputClass}
            />
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSave}
              disabled={!draft.date.trim() || !draft.time.trim()}
              className="rounded-lg bg-[#3D8C13] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#367c11] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Готово
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
