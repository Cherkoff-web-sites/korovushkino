'use client'

import type { CheckoutContact } from '@/components/checkout/checkoutTypes'
import {
  checkoutInputClass,
  checkoutSectionClass,
  checkoutSectionTitleClass,
} from '@/components/checkout/checkoutStyles'

type CheckoutContactSectionProps = {
  value: CheckoutContact
  onChange: (value: CheckoutContact) => void
}

export default function CheckoutContactSection({ value, onChange }: CheckoutContactSectionProps) {
  return (
    <section className={checkoutSectionClass}>
      <h2 className={checkoutSectionTitleClass}>Контактная информация</h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <label className="block">
          <span className="sr-only">ФИО</span>
          <input
            type="text"
            value={value.fullName}
            onChange={(event) => onChange({ ...value, fullName: event.target.value })}
            placeholder="ФИО"
            className={checkoutInputClass}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="sr-only">E-mail</span>
          <input
            type="email"
            value={value.email}
            onChange={(event) => onChange({ ...value, email: event.target.value })}
            placeholder="E-mail"
            className={checkoutInputClass}
            autoComplete="email"
          />
        </label>
      </div>
    </section>
  )
}
