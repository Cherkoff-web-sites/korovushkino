import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Доставка и оплата | Коровушкино',
  description: 'Условия доставки и способы оплаты фермерской продукции Коровушкино.',
}

type DeliveryFact = {
  label: string
  value?: string
}

const deliveryFacts: DeliveryFact[] = [
  { label: 'Мы доставляем по Москве и Московской области' },
  { label: 'Минимальная сумма заказа', value: '2000р' },
  { label: 'Заказы доставляются по', value: 'Чт, Пт, Сб' },
  { label: 'Стоимость доставки зависит от', value: 'адреса' },
]

const paymentMethods = [
  { id: 'card', label: 'Картой', disabled: true },
  { id: 'cash', label: 'Наличными', disabled: true },
  { id: 'transfer', label: 'Переводом при получении', disabled: false },
] as const

export default function DeliveryPaymentPage() {
  return (
    <div className="bg-[#FDFBF6] pt-8 sm:pt-10 lg:pt-12">
      <section className="pb-10 sm:pb-12 lg:pb-14">
        <div className="container">
          <h1 className="text-[34px] font-semibold leading-tight text-[#1F1F1F] sm:text-[42px]">Доставка</h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] lg:items-start">
            <div className="space-y-4 sm:space-y-5">
              {deliveryFacts.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-wrap items-center gap-2 text-[18px] leading-[1.35] text-[#1F1F1F] sm:text-[24px]"
                >
                  <span>{item.label}</span>
                  {item.value ? (
                    <span className="rounded-md bg-[#FFF4E3] px-3 py-1 text-[18px] font-semibold sm:text-[28px]">
                      {item.value}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-[#D0D9C8] bg-[#E6F2E2]">
              <div className="relative aspect-[4/3] w-full bg-[radial-gradient(circle_at_70%_35%,#d1e6d7_0,#d1e6d7_22%,#b6d8bd_22%,#b6d8bd_35%,#9ec8a7_35%,#9ec8a7_100%)]">
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
                <span className="absolute left-[45%] top-[42%] rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#1F1F1F] shadow">
                  Москва
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-14">
            <h2 className="text-[30px] font-semibold leading-tight text-[#1F1F1F] sm:text-[44px]">
              Узнать стоимость доставки
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#1F1F1F]/55 sm:text-[28px] sm:leading-[1.2]">
              Всего лишь введите адрес доставки, а мы все посчитаем и покажем, когда привезем и за сколько.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <label htmlFor="delivery-address" className="sr-only">
                Адрес доставки
              </label>
              <input
                id="delivery-address"
                type="text"
                placeholder="Введите адрес доставки"
                className="h-[52px] w-full rounded-lg border border-[#CFCFCF] bg-white px-5 text-base text-[#1F1F1F] outline-none placeholder:text-[#1F1F1F]/50 focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20 sm:h-[58px] sm:flex-1 sm:text-xl"
              />
              <button
                type="button"
                className="h-[52px] rounded-lg bg-[#3D8C13] px-8 text-base font-medium text-white transition-colors hover:bg-[#347710] sm:h-[58px] sm:min-w-[210px] sm:text-[28px]"
              >
                Рассчитать
              </button>
            </div>
          </div>

          <div className="mt-12 sm:mt-14">
            <h2 className="text-[34px] font-semibold leading-tight text-[#1F1F1F] sm:text-[44px]">Оплата</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  disabled={method.disabled}
                  className={`h-[52px] rounded-lg border text-sm transition-colors sm:h-[66px] sm:text-[26px] ${
                    method.disabled
                      ? 'border-[#E5D8C1] bg-[#FFF8EB] text-[#1F1F1F]/40'
                      : 'border-[#3D8C13] bg-[#3D8C13] font-medium text-white hover:bg-[#347710]'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
