'use client'

import type { DeliveryAddress } from '@/components/checkout/checkoutTypes'
import {
  checkoutGhostButtonClass,
  checkoutInputClass,
  checkoutPrimaryButtonClass,
  checkoutSectionClass,
  checkoutSectionDividerClass,
  checkoutSectionTitleClass,
} from '@/components/checkout/checkoutStyles'
import { EditIcon, PlusIcon } from '@/components/checkout/CheckoutIcons'
import { useDeliverySettings } from '@/hooks/useDeliverySettings'
import { isMoscowCity } from '@/lib/deliveryPricing'

type CheckoutAddressSectionProps = {
  address: DeliveryAddress | null
  editing: boolean
  draft: DeliveryAddress
  onStartAdd: () => void
  onStartEdit: () => void
  onCancel: () => void
  onSave: () => void
  onDraftChange: (draft: DeliveryAddress) => void
}

function formatAddress(address: DeliveryAddress, districtName?: string) {
  const parts = [
    address.city,
    districtName || (address.district ? `р-н ${address.district}` : ''),
    address.street,
    address.house ? `д. ${address.house}` : '',
    address.apartment ? `кв. ${address.apartment}` : '',
  ].filter(Boolean)

  return parts.join(', ')
}

export default function CheckoutAddressSection({
  address,
  editing,
  draft,
  onStartAdd,
  onStartEdit,
  onCancel,
  onSave,
  onDraftChange,
}: CheckoutAddressSectionProps) {
  const { settings } = useDeliverySettings()
  const moscowSelected = isMoscowCity(draft.city, settings)
  const districtName = settings.moscowDistricts.find((item) => item.id === draft.district)?.name

  const canSave =
    draft.city.trim() !== '' &&
    draft.street.trim() !== '' &&
    draft.house.trim() !== '' &&
    (!moscowSelected || draft.district.trim() !== '')

  return (
    <section className={checkoutSectionClass}>
      <h2 className={checkoutSectionTitleClass}>Адрес доставки</h2>

      {!address && !editing ? (
        <button
          type="button"
          onClick={onStartAdd}
          className="mt-4 flex w-full items-center gap-3 rounded-lg border border-[#C88C39]/60 bg-white px-4 py-3 text-left transition-colors hover:border-[#C88C39] sm:py-3.5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3D8C13] text-white">
            <PlusIcon />
          </span>
          <span className="text-sm text-[#1F1F1F] sm:text-[15px]">Адрес доставки</span>
        </button>
      ) : null}

      {address && !editing ? (
        <div className={`mt-4 flex items-start justify-between gap-3 border-t ${checkoutSectionDividerClass} pt-4`}>
          <p className="min-w-0 text-sm leading-relaxed text-[#1F1F1F] sm:text-[15px]">
            {formatAddress(
              address,
              settings.moscowDistricts.find((item) => item.id === address.district)?.name
            )}
          </p>
          <button
            type="button"
            onClick={onStartEdit}
            className="shrink-0 rounded-lg p-1.5 text-[#232326]/55 transition-colors hover:bg-white hover:text-[#3D8C13]"
            aria-label="Изменить адрес"
          >
            <EditIcon />
          </button>
        </div>
      ) : null}

      {editing ? (
        <div className={`mt-4 space-y-3 border-t ${checkoutSectionDividerClass} pt-4`}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={draft.city}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  city: event.target.value,
                  district: isMoscowCity(event.target.value, settings) ? draft.district : '',
                })
              }
              placeholder="Город"
              className={checkoutInputClass}
              autoComplete="address-level2"
            />
            {moscowSelected ? (
              <select
                value={draft.district}
                onChange={(event) => onDraftChange({ ...draft, district: event.target.value })}
                className={checkoutInputClass}
              >
                <option value="">Район Москвы</option>
                {settings.moscowDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name} — {district.price.toLocaleString('ru-RU')} ₽
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={draft.street}
                onChange={(event) => onDraftChange({ ...draft, street: event.target.value })}
                placeholder="Улица"
                className={checkoutInputClass}
                autoComplete="street-address"
              />
            )}
          </div>

          {moscowSelected ? (
            <input
              type="text"
              value={draft.street}
              onChange={(event) => onDraftChange({ ...draft, street: event.target.value })}
              placeholder="Улица"
              className={checkoutInputClass}
              autoComplete="street-address"
            />
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <input
              type="text"
              value={draft.house}
              onChange={(event) => onDraftChange({ ...draft, house: event.target.value })}
              placeholder="Дом"
              className={checkoutInputClass}
            />
            <input
              type="text"
              value={draft.apartment}
              onChange={(event) => onDraftChange({ ...draft, apartment: event.target.value })}
              placeholder="Кв."
              className={checkoutInputClass}
            />
            <input
              type="text"
              value={draft.floor}
              onChange={(event) => onDraftChange({ ...draft, floor: event.target.value })}
              placeholder="Этаж"
              className={checkoutInputClass}
            />
            <input
              type="text"
              value={draft.entrance}
              onChange={(event) => onDraftChange({ ...draft, entrance: event.target.value })}
              placeholder="Подъезд"
              className={checkoutInputClass}
            />
          </div>

          <input
            type="text"
            value={draft.intercom}
            onChange={(event) => onDraftChange({ ...draft, intercom: event.target.value })}
            placeholder="Домофон"
            className={`${checkoutInputClass} sm:max-w-xs`}
          />

          <textarea
            value={draft.comment}
            onChange={(event) => onDraftChange({ ...draft, comment: event.target.value })}
            placeholder="Комментарий к адресу"
            rows={4}
            className={`${checkoutInputClass} min-h-[120px] resize-y`}
          />

          {moscowSelected && districtName ? (
            <p className="text-sm text-[#707070]">Доставка: {districtName}</p>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onCancel} className={checkoutGhostButtonClass}>
              Отмена
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className={checkoutPrimaryButtonClass}
            >
              Сохранить
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
