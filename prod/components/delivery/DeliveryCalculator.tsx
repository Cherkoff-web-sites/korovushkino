'use client'

import { useMemo, useState } from 'react'
import CheckoutDeliveryQuote from '@/components/checkout/CheckoutDeliveryQuote'
import { useDeliverySettings } from '@/hooks/useDeliverySettings'
import { calculateDeliveryQuote, isMoscowCity } from '@/lib/deliveryPricing'

type DeliveryCalculatorProps = {
  placeholder?: string
  buttonLabel?: string
  showTariffs?: boolean
}

export default function DeliveryCalculator({
  placeholder = 'Введите город или адрес',
  buttonLabel = 'Рассчитать',
  showTariffs = true,
}: DeliveryCalculatorProps) {
  const { settings, hydrated } = useDeliverySettings()
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')

  const moscowSelected = hydrated && isMoscowCity(city, settings)

  const quote = useMemo(() => {
    if (!hydrated || !city.trim()) {
      return {
        cost: null,
        zone: 'unknown' as const,
        label: 'Укажите город',
        requiresDistrict: false,
      }
    }
    return calculateDeliveryQuote(city, district, settings)
  }, [city, district, hydrated, settings])

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <label htmlFor="delivery-city" className="sr-only">
            Город или адрес доставки
          </label>
          <input
            id="delivery-city"
            type="text"
            value={city}
            onChange={(event) => {
              setCity(event.target.value)
              setDistrict('')
            }}
            placeholder={placeholder}
            className="min-h-[48px] w-full rounded-lg border border-[#E5DECF] bg-white px-4 text-sm text-[#232326] outline-none placeholder:text-[#232326]/45 focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20 sm:flex-1 sm:px-5 sm:text-[15px]"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('delivery-city')
              input?.focus()
            }}
            className="min-h-[48px] shrink-0 rounded-lg bg-[#3D8C13] px-6 text-sm font-medium text-white transition-colors hover:bg-[#347710] sm:min-w-[180px] sm:text-[15px]"
          >
            {buttonLabel}
          </button>
        </div>

        {moscowSelected ? (
          <div>
            <label htmlFor="delivery-district" className="mb-1.5 block text-sm text-[#707070]">
              Район Москвы
            </label>
            <select
              id="delivery-district"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              className="min-h-[48px] w-full rounded-lg border border-[#E5DECF] bg-white px-4 text-sm text-[#232326] outline-none focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20 sm:max-w-md sm:text-[15px]"
            >
              <option value="">Выберите район</option>
              {settings.moscowDistricts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.price.toLocaleString('ru-RU')} ₽
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {city.trim() ? (
        <CheckoutDeliveryQuote
          quote={quote}
          requireDistrictMessage="Выберите район Москвы для точного расчёта стоимости."
        />
      ) : null}

      {showTariffs && hydrated ? (
        <div className="rounded-xl border border-[#E5DECF] bg-white p-4 sm:p-5">
          <h3 className="text-base font-semibold text-[#1F1F1F]">Тарифы доставки</h3>
          <p className="mt-1 text-xs text-[#707070] sm:text-sm">
            Актуальные цены из настроек админки. При оформлении заказа стоимость считается автоматически.
          </p>
          <dl className="mt-4 space-y-2 text-sm sm:text-[15px]">
            <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] pb-2">
              <dt className="text-[#232326]/80">Москва (без выбора района)</dt>
              <dd className="font-medium text-[#1F1F1F]">
                {settings.moscowDefaultPrice.toLocaleString('ru-RU')} ₽
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] pb-2">
              <dt className="text-[#232326]/80">Московская область</dt>
              <dd className="font-medium text-[#1F1F1F]">
                {settings.moscowRegionPrice.toLocaleString('ru-RU')} ₽
              </dd>
            </div>
            {settings.outsideMoscowPrice !== null ? (
              <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] pb-2">
                <dt className="text-[#232326]/80">Другие города</dt>
                <dd className="font-medium text-[#1F1F1F]">
                  {settings.outsideMoscowPrice.toLocaleString('ru-RU')} ₽
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-[#1F1F1F]">Районы Москвы</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {settings.moscowDistricts.map((districtItem) => (
                <li
                  key={districtItem.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[#FFF9F0] px-3 py-2 text-sm"
                >
                  <span className="text-[#232326]/85">{districtItem.name}</span>
                  <span className="shrink-0 font-medium text-[#1F1F1F]">
                    {districtItem.price.toLocaleString('ru-RU')} ₽
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
