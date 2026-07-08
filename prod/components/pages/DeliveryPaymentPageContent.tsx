'use client'

import Link from 'next/link'
import { usePagesContent } from '@/hooks/usePagesContent'
import { useDeliverySettings } from '@/hooks/useDeliverySettings'
import ContentImage from '@/components/ui/ContentImage'

export default function DeliveryPaymentPageContent() {
  const { content } = usePagesContent()
  const { deliveryPayment } = content
  const { settings, hydrated } = useDeliverySettings()
  const enabledMethods = deliveryPayment.paymentMethods.filter((method) => method.enabled)

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
              {hydrated ? (
                <div className="rounded-md bg-[#FFF4E3] px-2.5 py-2 text-sm text-[#232326] sm:text-[15px]">
                  Московская область — от {settings.moscowRegionPrice.toLocaleString('ru-RU')} ₽ · Москва — от{' '}
                  {settings.moscowDefaultPrice.toLocaleString('ru-RU')} ₽
                </div>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-xl border border-[#D0D9C8] bg-[#E6F2E2]">
              <div className="relative aspect-[4/3] w-full">
                <ContentImage
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
              {deliveryPayment.paymentTitle}
            </h2>

            {enabledMethods.length === 0 ? (
              <p className="mt-4 text-sm text-[#707070]">Способы оплаты временно недоступны.</p>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3">
                {enabledMethods.map((method) => (
                  <Link
                    key={method.id}
                    href="/checkout"
                    className="flex min-h-[48px] items-center justify-center rounded-lg border border-[#3D8C13] bg-[#3D8C13] px-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#347710] sm:text-[15px]"
                  >
                    {method.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
