'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import CheckoutAddressSection from '@/components/checkout/CheckoutAddressSection'
import CheckoutCartSection from '@/components/checkout/CheckoutCartSection'
import CheckoutContactSection from '@/components/checkout/CheckoutContactSection'
import CheckoutDeliveryTimeSection from '@/components/checkout/CheckoutDeliveryTimeSection'
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary'
import CheckoutPaymentSection from '@/components/checkout/CheckoutPaymentSection'
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess'
import {
  DEFAULT_DELIVERY_TIME,
  EMPTY_ADDRESS,
  type CheckoutContact,
  type DeliveryAddress,
  type DeliveryTime,
  type PaymentMethodId,
} from '@/components/checkout/checkoutTypes'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { useDeliverySettings } from '@/hooks/useDeliverySettings'
import { calculateDeliveryQuote } from '@/lib/deliveryPricing'
import type { DeliveryQuote } from '@/lib/deliveryPricing'
import { submitCheckoutOrder } from '@/lib/leadsService'
import { useEnabledPaymentMethods } from '@/hooks/useEnabledPaymentMethods'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const { settings: deliverySettings } = useDeliverySettings()
  const { methods: paymentMethods, defaultMethod } = useEnabledPaymentMethods()

  const [hydrated, setHydrated] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [contact, setContact] = useState<CheckoutContact>({ fullName: '', email: '' })
  const [address, setAddress] = useState<DeliveryAddress | null>(null)
  const [addressEditing, setAddressEditing] = useState(false)
  const [addressDraft, setAddressDraft] = useState<DeliveryAddress>(EMPTY_ADDRESS)
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime | null>(DEFAULT_DELIVERY_TIME)
  const [deliveryTimeEditing, setDeliveryTimeEditing] = useState(false)
  const [deliveryTimeDraft, setDeliveryTimeDraft] = useState<DeliveryTime>(DEFAULT_DELIVERY_TIME)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | null>(null)
  const [paymentEditing, setPaymentEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (defaultMethod && !paymentMethod) {
      setPaymentMethod(defaultMethod)
    }
  }, [defaultMethod, paymentMethod])

  useEffect(() => {
    if (!user) return
    const fullName = [user.surname, user.firstName].filter(Boolean).join(' ').trim()
    setContact((prev) => ({
      fullName: prev.fullName || fullName,
      email: prev.email || user.email || '',
    }))
  }, [user])

  useEffect(() => {
    if (!hydrated || submitted) return
    if (items.length === 0) {
      router.replace('/cart')
    }
  }, [hydrated, items.length, router, submitted])

  const productsTotal = useMemo(() => getTotalPrice(), [getTotalPrice, items])

  const deliveryQuote = useMemo<DeliveryQuote>(() => {
    const source = addressEditing ? addressDraft : address
    if (!source) {
      return { cost: null, zone: 'unknown', label: 'Укажите адрес', requiresDistrict: false }
    }
    return calculateDeliveryQuote(source.city, source.district, deliverySettings)
  }, [address, addressDraft, addressEditing, deliverySettings])

  const canSubmit =
    items.length > 0 &&
    contact.fullName.trim() !== '' &&
    contact.email.trim() !== '' &&
    address !== null &&
    deliveryTime !== null &&
    paymentMethod !== null &&
    deliveryQuote.cost !== null &&
    !deliveryQuote.requiresDistrict &&
    !addressEditing &&
    !deliveryTimeEditing &&
    !paymentEditing

  function handleAddressStartAdd() {
    setAddressDraft(EMPTY_ADDRESS)
    setAddressEditing(true)
  }

  function handleAddressStartEdit() {
    if (!address) return
    setAddressDraft(address)
    setAddressEditing(true)
  }

  function handleAddressCancel() {
    setAddressEditing(false)
    setAddressDraft(address ?? EMPTY_ADDRESS)
  }

  function handleAddressSave() {
    setAddress(addressDraft)
    setAddressEditing(false)
    showToast('Адрес сохранён')
  }

  function handleDeliveryTimeSave() {
    setDeliveryTime(deliveryTimeDraft)
    setDeliveryTimeEditing(false)
  }

  function handlePaymentSelect(method: PaymentMethodId) {
    setPaymentMethod(method)
    setPaymentEditing(false)
  }

  async function handleSubmit() {
    if (!canSubmit || !address || !deliveryTime || !paymentMethod || deliveryQuote.cost === null) {
      showToast('Заполните все поля оформления заказа')
      return
    }

    setSubmitting(true)
    try {
      await submitCheckoutOrder({
        contact,
        address,
        deliveryTime,
        paymentMethod,
        items,
        productsTotal,
        deliveryCost: deliveryQuote.cost,
      })
      clearCart()
      setSubmitted(true)
      showToast('Заказ оформлен')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      showToast('Не удалось оформить заказ')
    } finally {
      setSubmitting(false)
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#fdfbf6]">
        <section className="py-8 sm:py-10 lg:py-12">
          <div className="container">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-[#E5DECF]/60" />
          </div>
        </section>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fdfbf6]">
        <section className="py-8 sm:py-10 lg:py-12">
          <div className="container max-w-2xl">
            <CheckoutSuccess />
            <div className="mt-6 text-center">
              <Link href="/catalog">
                <Button size="lg">Вернуться в каталог</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container">
          <nav className="mb-4 text-sm text-[#232326]/55 sm:text-[15px]" aria-label="Навигация">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-[#232326]">
                  Главная
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-[#232326]">
                  Корзина
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li className="text-[#232326]">Оформление заказа</li>
            </ol>
          </nav>

          <h1 className="text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
            Оформление заказа
          </h1>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:mt-8 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-4 lg:col-span-7 xl:col-span-8">
              <CheckoutCartSection
                items={items}
                open={cartOpen}
                onToggle={() => setCartOpen((prev) => !prev)}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />

              <CheckoutContactSection value={contact} onChange={setContact} />

              <CheckoutAddressSection
                address={address}
                editing={addressEditing}
                draft={addressDraft}
                deliveryQuote={deliveryQuote}
                onStartAdd={handleAddressStartAdd}
                onStartEdit={handleAddressStartEdit}
                onCancel={handleAddressCancel}
                onSave={handleAddressSave}
                onDraftChange={setAddressDraft}
              />

              <CheckoutDeliveryTimeSection
                value={deliveryTime}
                editing={deliveryTimeEditing}
                draft={deliveryTimeDraft}
                onStartEdit={() => {
                  setDeliveryTimeDraft(deliveryTime ?? DEFAULT_DELIVERY_TIME)
                  setDeliveryTimeEditing(true)
                }}
                onDraftChange={setDeliveryTimeDraft}
                onSave={handleDeliveryTimeSave}
              />

              <CheckoutPaymentSection
                methods={paymentMethods}
                method={paymentMethod}
                editing={paymentEditing}
                onStartEdit={() => setPaymentEditing(true)}
                onSelect={handlePaymentSelect}
              />
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <CheckoutOrderSummary
                productsTotal={productsTotal}
                deliveryQuote={deliveryQuote}
                onSubmit={handleSubmit}
                submitting={submitting}
                disabled={!canSubmit}
              />
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#C88C39]/60 bg-[#FFF6E7]/95 p-4 backdrop-blur-sm lg:hidden">
            <div className="container flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#232326]/70">К оплате</p>
                <p className="text-base font-semibold text-[#1F1F1F]">
                  {deliveryQuote.cost === null
                    ? '—'
                    : `${(productsTotal + deliveryQuote.cost).toLocaleString('ru-RU')} ₽`}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="shrink-0 rounded-lg bg-[#3D8C13] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#367c11] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? '…' : 'Оформить заказ'}
              </button>
            </div>
          </div>

          <div className="h-24 lg:hidden" aria-hidden />
        </div>
      </section>
    </div>
  )
}
