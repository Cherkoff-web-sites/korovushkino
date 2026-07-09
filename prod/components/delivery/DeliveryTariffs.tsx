'use client'

import { useDeliverySettings } from '@/hooks/useDeliverySettings'

export default function DeliveryTariffs() {
  const { settings, hydrated } = useDeliverySettings()

  if (!hydrated) return null

  return (
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
  )
}
