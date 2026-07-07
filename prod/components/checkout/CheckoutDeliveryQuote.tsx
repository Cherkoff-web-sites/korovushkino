import type { DeliveryQuote } from '@/lib/deliveryPricing'

type CheckoutDeliveryQuoteProps = {
  quote: DeliveryQuote
  compact?: boolean
}

export default function CheckoutDeliveryQuote({ quote, compact = false }: CheckoutDeliveryQuoteProps) {
  const showBlock =
    quote.cost !== null ||
    quote.requiresDistrict ||
    quote.zone === 'outside' ||
    (quote.label !== 'Укажите адрес' && quote.label !== 'Укажите город')

  if (!showBlock) return null

  return (
    <div
      className={`rounded-lg border border-[#C88C39]/45 bg-[#FFF9F0] ${
        compact ? 'px-3 py-2.5' : 'px-4 py-3'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-medium text-[#1F1F1F] ${compact ? 'text-sm' : 'text-sm sm:text-[15px]'}`}>
            Стоимость доставки
          </p>
          <p className="mt-0.5 text-xs text-[#707070] sm:text-sm">{quote.label}</p>
        </div>
        <p className={`shrink-0 font-semibold text-[#1F1F1F] ${compact ? 'text-sm' : 'text-base'}`}>
          {quote.cost === null ? '—' : `${quote.cost.toLocaleString('ru-RU')} ₽`}
        </p>
      </div>

      {quote.requiresDistrict ? (
        <p className="mt-2 text-xs leading-relaxed text-[#C88C39]">
          Выберите район Москвы — без него нельзя оформить заказ.
        </p>
      ) : null}

      {quote.cost === null && quote.zone === 'outside' ? (
        <p className="mt-2 text-xs leading-relaxed text-[#707070]">
          Стоимость доставки в этот город уточнит менеджер после оформления.
        </p>
      ) : null}
    </div>
  )
}
