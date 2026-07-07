'use client'

import Image from 'next/image'
import { usePagesContent } from '@/hooks/usePagesContent'

export default function DeliveryPaymentPageContent() {
  const { content } = usePagesContent()
  const { deliveryPayment } = content

  return (
    <div className="bg-[#fdfbf6] pt-8 sm:py-10">
      <section className="pb-10 sm:pb-12 lg:pb-14">
        <div className="container">
          <h1 className="text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
            {deliveryPayment.pageTitle}
          </h1>

          <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,420px)] lg:items-start lg:gap-8">
            <div className="space-y-3 sm:space-y-4">
              {deliveryPayment.facts.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-wrap items-center gap-2 text-sm leading-relaxed text-[#232326] sm:text-[15px]"
                >
                  <span>{item.label}</span>
                  {item.value ? (
                    <span className="rounded-md bg-[#FFF4E3] px-2.5 py-1 text-sm font-semibold text-[#1F1F1F] sm:text-[15px]">
                      {item.value}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-[#D0D9C8] bg-[#E6F2E2]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={deliveryPayment.sideImage}
                  alt={deliveryPayment.sideImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-12">
            <h2 className="text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
              {deliveryPayment.calculatorTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#232326]/80 sm:text-[15px]">
              {deliveryPayment.calculatorText}
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <label htmlFor="delivery-address" className="sr-only">
                Адрес доставки
              </label>
              <input
                id="delivery-address"
                type="text"
                placeholder={deliveryPayment.calculatorPlaceholder}
                className="min-h-[48px] w-full rounded-lg border border-[#E5DECF] bg-white px-4 text-sm text-[#232326] outline-none placeholder:text-[#232326]/45 focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20 sm:flex-1 sm:px-5 sm:text-[15px]"
              />
              <button
                type="button"
                className="min-h-[48px] shrink-0 rounded-lg bg-[#3D8C13] px-6 text-sm font-medium text-white transition-colors hover:bg-[#347710] sm:min-w-[180px] sm:text-[15px]"
              >
                {deliveryPayment.calculatorButton}
              </button>
            </div>
          </div>

          <div className="mt-10 sm:mt-12">
            <h2 className="text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
              {deliveryPayment.paymentTitle}
            </h2>

            <div className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3">
              {deliveryPayment.paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  disabled={!method.enabled}
                  className={`min-h-[48px] rounded-lg border px-3 text-sm transition-colors sm:text-[15px] ${
                    !method.enabled
                      ? 'border-[#E5DECF] bg-[#FFF8EB] text-[#232326]/40'
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
