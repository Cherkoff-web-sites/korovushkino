'use client'

import { checkoutSectionClass, checkoutSectionDividerClass, checkoutSectionTitleClass } from '@/components/checkout/checkoutStyles'

type CheckoutOrderSummaryProps = {
  productsTotal: number
  deliveryCost: number | null
  deliveryLabel?: string
  onSubmit: () => void
  submitting?: boolean
  disabled?: boolean
  compact?: boolean
}

export default function CheckoutOrderSummary({
  productsTotal,
  deliveryCost,
  deliveryLabel,
  onSubmit,
  submitting = false,
  disabled = false,
  compact = false,
}: CheckoutOrderSummaryProps) {
  const total = deliveryCost === null ? null : productsTotal + deliveryCost

  return (
    <aside
      className={`${checkoutSectionClass} ${compact ? '' : 'lg:sticky lg:top-28'}`}
      aria-label="Сумма заказа"
    >
      <h2 className={checkoutSectionTitleClass}>Сумма заказа</h2>

      <dl className={`mt-4 space-y-3 border-t ${checkoutSectionDividerClass} pt-4 text-sm sm:text-[15px]`}>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#232326]/80">Стоимость продуктов</dt>
          <dd className="font-medium text-[#1F1F1F]">
            {productsTotal.toLocaleString('ru-RU')} ₽
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#232326]/80">
            Доставка{deliveryLabel ? ` (${deliveryLabel})` : ''}
          </dt>
          <dd className="font-medium text-[#1F1F1F]">
            {deliveryCost === null ? '—' : `${deliveryCost.toLocaleString('ru-RU')} ₽`}
          </dd>
        </div>
        <div className={`flex items-center justify-between gap-4 border-t ${checkoutSectionDividerClass} pt-3`}>
          <dt className="text-base font-semibold text-[#1F1F1F] sm:text-lg">К оплате</dt>
          <dd className="text-base font-semibold text-[#1F1F1F] sm:text-lg">
            {total === null ? '—' : `${total.toLocaleString('ru-RU')} ₽`}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || submitting}
        className="mt-5 hidden w-full rounded-lg bg-[#3D8C13] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#367c11] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px] lg:block"
      >
        {submitting ? 'Оформляем…' : 'Оформить заказ'}
      </button>
    </aside>
  )
}
