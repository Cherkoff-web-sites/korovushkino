import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Оформление заказа | Коровушкино',
  description: 'Оформление заказа фермерской продукции Коровушкино.',
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
