'use client'

import {
  PAYMENT_METHODS,
  type PaymentMethodId,
} from '@/components/checkout/checkoutTypes'
import {
  checkoutSectionClass,
  checkoutSectionDividerClass,
  checkoutSectionTitleClass,
} from '@/components/checkout/checkoutStyles'
import { BankIcon, CardIcon, CashIcon, EditIcon } from '@/components/checkout/CheckoutIcons'

type CheckoutPaymentSectionProps = {
  method: PaymentMethodId | null
  editing: boolean
  onStartEdit: () => void
  onSelect: (method: PaymentMethodId) => void
}

function PaymentMethodIcon({ id }: { id: PaymentMethodId }) {
  if (id === 'cash') return <CashIcon className="h-6 w-6 text-[#232326]/55" />
  if (id === 'card') return <CardIcon className="h-6 w-6 text-[#232326]/55" />
  return <BankIcon className="h-6 w-6 text-[#232326]/55" />
}

function getSummaryLabel(method: PaymentMethodId) {
  return PAYMENT_METHODS.find((item) => item.id === method)?.summaryLabel ?? ''
}

export default function CheckoutPaymentSection({
  method,
  editing,
  onStartEdit,
  onSelect,
}: CheckoutPaymentSectionProps) {
  const summary = method ? getSummaryLabel(method) : ''

  return (
    <section className={checkoutSectionClass}>
      <h2 className={checkoutSectionTitleClass}>Оплата</h2>

      {!editing && method ? (
        <div className={`mt-4 flex items-center justify-between gap-3 border-t ${checkoutSectionDividerClass} pt-4`}>
          <p className="text-sm text-[#1F1F1F] sm:text-[15px]">{summary}</p>
          <button
            type="button"
            onClick={onStartEdit}
            className="shrink-0 rounded-lg p-1.5 text-[#232326]/55 transition-colors hover:bg-white hover:text-[#3D8C13]"
            aria-label="Изменить способ оплаты"
          >
            <EditIcon />
          </button>
        </div>
      ) : null}

      {editing ? (
        <div className={`mt-4 border-t ${checkoutSectionDividerClass} pt-4`}>
          <p className="mb-3 text-sm text-[#232326]/70">Выберите способ оплаты</p>
          <ul className="space-y-2">
            {PAYMENT_METHODS.map((item) => {
              const selected = method === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                      selected
                        ? 'border-[#3D8C13] bg-white'
                        : 'border-[#C88C39]/60 bg-white hover:border-[#C88C39]'
                    }`}
                  >
                    <span className="text-sm text-[#1F1F1F] sm:text-[15px]">{item.label}</span>
                    <PaymentMethodIcon id={item.id} />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
