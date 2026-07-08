'use client'

import { useMemo } from 'react'
import { PAYMENT_METHODS, type PaymentMethodId } from '@/components/checkout/checkoutTypes'
import { usePagesContent } from '@/hooks/usePagesContent'

export function useEnabledPaymentMethods() {
  const { content, hydrated } = usePagesContent()

  const methods = useMemo(() => {
    if (!hydrated) return PAYMENT_METHODS
    const enabledIds = new Set(
      content.deliveryPayment.paymentMethods.filter((item) => item.enabled).map((item) => item.id)
    )
    if (enabledIds.size === 0) return PAYMENT_METHODS
    return PAYMENT_METHODS.filter((item) => enabledIds.has(item.id)).map((item) => {
      const fromContent = content.deliveryPayment.paymentMethods.find((method) => method.id === item.id)
      return fromContent ? { ...item, label: fromContent.label } : item
    })
  }, [content.deliveryPayment.paymentMethods, hydrated])

  const defaultMethod = methods[0]?.id ?? null

  return { methods, defaultMethod, hydrated }
}

export type { PaymentMethodId }
