export type DeliveryAddress = {
  city: string
  district: string
  street: string
  house: string
  apartment: string
  floor: string
  entrance: string
  intercom: string
  comment: string
}

export type DeliveryTime = {
  date: string
  time: string
}

export type PaymentMethodId = 'cash' | 'card' | 'transfer'

export type CheckoutContact = {
  fullName: string
  email: string
}

export const EMPTY_ADDRESS: DeliveryAddress = {
  city: '',
  district: '',
  street: '',
  house: '',
  apartment: '',
  floor: '',
  entrance: '',
  intercom: '',
  comment: '',
}

export const PAYMENT_METHODS: {
  id: PaymentMethodId
  label: string
  summaryLabel: string
}[] = [
  { id: 'cash', label: 'При получении наличными', summaryLabel: 'Наличными при получении' },
  { id: 'card', label: 'Банковской картой', summaryLabel: 'Банковской картой' },
  { id: 'transfer', label: 'Банковским переводом', summaryLabel: 'Переводом на карту' },
]

export const DEFAULT_DELIVERY_TIME: DeliveryTime = {
  date: '06.08.2026',
  time: '9–21:00',
}
